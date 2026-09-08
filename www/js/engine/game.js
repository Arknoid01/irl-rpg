// Orchestrateur du jeu. Chaque action : (state, args, ctx) -> { state, effects }.
// L'état d'entrée n'est jamais muté (clone défensif). Les « effets » décrivent ce
// que l'UI peut animer (toast, level-up, titre, fragment, objet…).

import { drawDaily } from './draw.js';
import {
  gainXp, gainSkills, bumpStreak, checkTitles,
} from './progression.js';
import { skillDeltasFor } from '../data/taxonomy.js';
import { todayStr } from './dates.js';
import {
  addEntry, maybeMemorable, eventEntry, levelChapterEntry, regionRevealEntry,
  chapterFor, chapterOpenEntry, CHAPTER_QUEST_THRESHOLDS, dailyRecapEntry,
  arcClueEntry, arcRevealEntry,
} from './journal.js';
import { defaultRng } from './rng.js';
import { templateHistoryKey } from './generate.js';
import { RECENT_EVENT_MEMORY } from './events.js';
import {
  addLoot, lootFromEvent, lootFromHiddenQuest, milestoneLootForLevel,
} from './inventory.js';
import { syncRegionUnlocks } from './worldView.js';
import {
  recordQuestMilestones, recordEventMilestones, applyMilestones,
} from './milestones.js';
import { recordDiscoveries } from './discoveries.js';
import { advanceArc } from './arcs.js';
import { isComebackDay } from './comeback.js';
import { THEME_KEYS } from '../data/themes.js';
import { COLLECTION_THEMES } from '../platform/billing.js';

const RECENT_DONE_MEMORY = 56;
const RECENT_FAMILLES_MEMORY = 12;

function clone(state) {
  return typeof structuredClone === 'function'
    ? structuredClone(state)
    : JSON.parse(JSON.stringify(state));
}

function ctxDefaults(ctx = {}) {
  return { now: ctx.now || new Date(), rng: ctx.rng || defaultRng };
}

function findQuest(s, id) {
  return s.quests.find((q) => q.id === id);
}

function applyLevelLoot(s, effects, today) {
  for (const fx of effects) {
    if (fx.type !== 'levelup') continue;
    const loot = milestoneLootForLevel(fx.level);
    if (loot && addLoot(s, { ...loot, date: today })) {
      effects.push({ type: 'loot', item: loot.item, kind: loot.kind });
    }
    addEntry(s, { date: today, text: levelChapterEntry(fx.level, s.theme), kind: 'chapitre' });
    effects.push({ type: 'chapter', level: fx.level });
  }
}

/** Compte un retour après absence (KPI rétention local), une fois par jour. */
function noteComebackReturn(s, now, today) {
  if (!isComebackDay(s, now)) return;
  if (s.history.lastComebackDate === today) return;
  s.history.comebacks = (s.history.comebacks || 0) + 1;
  s.history.lastComebackDate = today;
}

function applyRegionReveals(s, effects, today) {
  const newly = syncRegionUnlocks(s);
  for (const r of newly) {
    if (r.id === 'foyer') continue;
    addEntry(s, { date: today, text: regionRevealEntry(r.label, s.theme), kind: 'decouverte' });
    effects.push({ type: 'region', id: r.id, label: r.label });
  }
}

/* ─────────────── Onboarding ─────────────── */

export function finishOnboarding(state, args, ctx) {
  const s = clone(state);
  s.name = (args.name || '').trim().slice(0, 24) || 'Aventurier';
  s.comfort = Math.min(5, Math.max(1, Math.round(args.comfort) || 3));
  s.prefFamilies = Array.isArray(args.prefFamilies) ? args.prefFamilies.slice(0, 3) : [];
  if (args.theme) s.theme = args.theme;
  if (args.lang === 'fr' || args.lang === 'en') s.lang = args.lang;
  s.notifications = {
    enabled: !!(args.notifications && args.notifications.enabled),
    hour: Math.min(22, Math.max(6, (args.notifications && args.notifications.hour) || 9)),
  };
  s.ageAck = !!args.ageAck;
  if (!s.ageAck) {
    return { state: clone(state), effects: [] };
  }
  s.onboarded = true;
  const r = newDay(s, {}, ctx);
  return { state: r.state, effects: [{ type: 'onboarded' }, ...r.effects] };
}

/* ─────────────── Nouveau jour ─────────────── */

export function needsNewDay(state, ctx) {
  const { now } = ctxDefaults(ctx);
  return state.drawDate !== todayStr(now);
}

export function newDay(state, _args, ctx) {
  const { now, rng } = ctxDefaults(ctx);
  const s = clone(state);
  const today = todayStr(now);
  if (s.drawDate === today) return { state: s, effects: [] };

  // Entrée de journal « du jour » pour la veille (Phase 3.2) — seulement si
  // quelque chose a été vécu, jamais pour une journée vide (aucune pression).
  if (s.drawDate) {
    const doneFams = [];
    for (const q of s.quests || []) {
      if (q.status === 'done' && !doneFams.includes(q.famille)) doneFams.push(q.famille);
    }
    if (s.event && s.event.status === 'done' && s.event.famille && !doneFams.includes(s.event.famille)) {
      doneFams.push(s.event.famille);
    }
    const already = (s.journal || []).some((e) => e.kind === 'jour' && e.date === s.drawDate);
    if (doneFams.length && !already) {
      const recap = dailyRecapEntry(s.history.daysPlayed, doneFams, s.theme, s.seeds?.companion || 0);
      if (recap) addEntry(s, { date: s.drawDate, text: recap, kind: 'jour' });
    }
  }

  const { quests, event } = drawDaily(s, { now, rng });
  s.quests = quests;
  s.event = event;
  s.drawDate = today;
  s.history.daysPlayed += 1;
  if (event && event.id) {
    const recent = (s.history.recentEventIds || []).slice();
    recent.push(event.id);
    s.history.recentEventIds = recent.slice(-RECENT_EVENT_MEMORY);
    s.history.daysSinceEvent = 0;
  } else {
    s.history.daysSinceEvent = (s.history.daysSinceEvent || 0) + 1;
  }
  // Foyer toujours connu ; sync sans spam journal au new day
  syncRegionUnlocks(s);
  if (!(s.history.regionsUnlocked || []).includes('foyer')) {
    s.history.regionsUnlocked = ['foyer', ...(s.history.regionsUnlocked || [])];
  }

  for (const q of quests) {
    if (q.famille === 'social' && !q.gentle) s.history.social.proposed += 1;
  }

  return { state: s, effects: [{ type: 'newday', count: quests.length, event: !!event }] };
}

/* ─────────────── Quêtes ─────────────── */

export function acceptQuest(state, { id }) {
  const s = clone(state);
  const q = findQuest(s, id);
  if (!q || q.status !== 'proposed') return { state: s, effects: [] };
  q.status = 'accepted';
  return { state: s, effects: [] };
}

export function ignoreQuest(state, { id }) {
  const s = clone(state);
  const q = findQuest(s, id);
  if (!q || (q.status !== 'proposed' && q.status !== 'accepted')) return { state: s, effects: [] };
  q.status = 'ignored';
  if (q.famille === 'social' && !q.gentle) s.history.social.skipped += 1;
  // Ignorer est gratuit — aucun effet négatif, aucune perte.
  return { state: s, effects: [] };
}

export function completeQuest(state, { id }, ctx) {
  const { now, rng } = ctxDefaults(ctx);
  const s = clone(state);
  const q = findQuest(s, id);
  if (!q || q.status === 'done') return { state: s, effects: [] };
  q.status = 'done';

  const effects = [];
  const today = todayStr(now);
  const wasFirst = s.history.totalCompleted === 0;
  noteComebackReturn(s, now, today);

  gainXp(s, effects, q.xp);
  gainSkills(s, effects, skillDeltasFor(q));
  bumpStreak(s, effects, today);
  applyLevelLoot(s, effects, today);

  // Historique
  s.history.totalCompleted += 1;
  s.history.familleCompleted[q.famille] = (s.history.familleCompleted[q.famille] || 0) + 1;
  s.history.recentFamilles.push(q.famille);
  s.history.recentFamilles = s.history.recentFamilles.slice(-RECENT_FAMILLES_MEMORY);
  if (!q.gentle) {
    s.history.completedQuestIds.push(q.id);
    if (q.templateId) s.history.completedQuestIds.push(templateHistoryKey(q.templateId));
    s.history.completedQuestIds = s.history.completedQuestIds.slice(-RECENT_DONE_MEMORY);
  }
  if (q.famille === 'social') s.history.social.completed += 1;

  // Nouveau chapitre de la chronique (Phase 3.1) — seuil en nb de quêtes.
  if (CHAPTER_QUEST_THRESHOLDS.includes(s.history.totalCompleted)) {
    const chap = chapterFor(s, s.theme);
    addEntry(s, { date: today, text: chapterOpenEntry(chap), kind: 'chapitre' });
    effects.push({ type: 'chapter-open', id: chap.id });
  }

  // Journal
  if (q.fragment) {
    addEntry(s, { date: today, text: q.fragment, kind: 'fragment' });
    effects.push({ type: 'fragment', text: q.fragment });
  }
  const memo = maybeMemorable(q, rng, s.theme);
  if (memo) {
    addEntry(s, { date: today, text: memo, kind: 'moment' });
    effects.push({ type: 'moment', text: memo });
  }

  if (q.hidden && !q.arcId) {
    const loot = lootFromHiddenQuest(q, today);
    if (addLoot(s, loot)) effects.push({ type: 'loot', item: loot.item, kind: loot.kind });
  }

  // Mini-arc secret (Phase 3.3) — l'étape fait avancer la piste ; le texte
  // brut de data/arcs.js est habillé par la voix du thème.
  if (q.arcId) {
    const adv = advanceArc(s, q);
    if (adv) {
      if (adv.last) {
        addEntry(s, { date: today, text: arcRevealEntry(adv.text, s.theme), kind: 'revelation' });
        const loot = {
          ...adv.arc.loot, date: today, source: 'arc', id: `arc_${adv.arc.id}`,
        };
        if (addLoot(s, loot)) effects.push({ type: 'loot', item: loot.item, kind: loot.kind });
        effects.push({ type: 'arc-done', arcId: adv.arc.id });
      } else {
        addEntry(s, { date: today, text: arcClueEntry(adv.text, s.theme), kind: 'indice' });
        effects.push({ type: 'arc-clue', arcId: adv.arc.id });
      }
    }
  }

  applyRegionReveals(s, effects, today);

  // Jalons + découvertes — après le bookkeeping (totalCompleted à jour).
  applyMilestones(s, effects, recordQuestMilestones(s, q, now), now);
  for (const key of recordDiscoveries(s, q, now)) {
    effects.push({ type: 'discovery', key });
  }

  effects.push({ type: 'quest-done', xp: q.xp, first: wasFirst });
  return { state: s, effects };
}

/* ─────────────── Événement ─────────────── */

export function completeEvent(state, _args, ctx) {
  const { now } = ctxDefaults(ctx);
  const s = clone(state);
  if (!s.event || s.event.status === 'done') return { state: s, effects: [] };
  const ev = s.event;
  ev.status = 'done';
  const effects = [];
  const today = todayStr(now);
  noteComebackReturn(s, now, today);

  gainXp(s, effects, ev.xp);
  if (ev.famille) {
    gainSkills(s, effects, skillDeltasFor({ famille: ev.famille, xp: Math.round(ev.xp * 0.6) }));
    checkTitles(s, effects);
    s.history.familleCompleted[ev.famille] = (s.history.familleCompleted[ev.famille] || 0) + 1;
  }
  bumpStreak(s, effects, today);
  applyLevelLoot(s, effects, today);

  const loot = lootFromEvent(ev, today);
  addLoot(s, loot);
  addEntry(s, { date: today, text: eventEntry(ev, s.theme), kind: 'evenement' });
  applyRegionReveals(s, effects, today);

  applyMilestones(s, effects, recordEventMilestones(s, ev, now), now);

  effects.push({ type: 'event-done', xp: ev.xp, item: ev.item });
  return { state: s, effects };
}

export function dismissEvent(state) {
  const s = clone(state);
  if (s.event) s.event = { ...s.event, status: 'dismissed' };
  return { state: s, effects: [] };
}

/* ─────────────── Réglages ─────────────── */

export function setTheme(state, { theme }) {
  const s = clone(state);
  if (!s.unlockedThemes.includes(theme)) return { state: s, effects: [] };
  s.theme = theme;
  return { state: s, effects: [{ type: 'theme', theme }] };
}

/**
 * Déblocage d'un thème payant (D12). Le déblocage réel passe par
 * `unlockCollection` (achat unique « Collection des Mondes », D17) ; cette
 * fonction reste utile pour la démo et les tests. Ne pas confondre avec un
 * achat validé par un store.
 */
export function unlockTheme(state, { theme }) {
  const s = clone(state);
  if (!THEME_KEYS.includes(theme) || s.unlockedThemes.includes(theme)) {
    return { state: s, effects: [] };
  }
  s.unlockedThemes.push(theme);
  return { state: s, effects: [{ type: 'theme-unlocked', theme }] };
}

/**
 * Débloque la « Collection des Mondes » — les 6 thèmes payants d'un coup
 * (D17). Appelé après un achat validé (`billing.purchase`) ou une
 * restauration. Idempotent.
 */
export function unlockCollection(state) {
  const s = clone(state);
  const added = [];
  for (const theme of COLLECTION_THEMES) {
    if (THEME_KEYS.includes(theme) && !s.unlockedThemes.includes(theme)) {
      s.unlockedThemes.push(theme);
      added.push(theme);
    }
  }
  return {
    state: s,
    effects: added.length ? [{ type: 'collection-unlocked', themes: added }] : [],
  };
}

export function setComfort(state, { comfort }) {
  const s = clone(state);
  s.comfort = Math.min(5, Math.max(1, Math.round(comfort) || 3));
  return { state: s, effects: [] };
}

export function setPrefFamilies(state, { prefFamilies }) {
  const s = clone(state);
  s.prefFamilies = Array.isArray(prefFamilies) ? prefFamilies.slice(0, 3) : [];
  return { state: s, effects: [] };
}

export function setNotifications(state, { enabled, hour }) {
  const s = clone(state);
  s.notifications = {
    enabled: enabled != null ? !!enabled : s.notifications.enabled,
    hour: hour != null ? Math.min(22, Math.max(6, Math.round(hour))) : s.notifications.hour,
  };
  return { state: s, effects: [{ type: 'notifications', ...s.notifications }] };
}

export function renameHero(state, { name }) {
  const s = clone(state);
  s.name = (name || '').trim().slice(0, 24) || s.name;
  return { state: s, effects: [] };
}

// Ré-exports utiles
export { checkTitles };
