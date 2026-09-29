// Orchestrateur du jeu. Chaque action : (state, args, ctx) -> { state, effects }.
// L'état d'entrée n'est jamais muté (clone défensif). Les « effets » décrivent ce
// que l'UI peut animer (toast, level-up, titre, fragment, objet…).

import { drawDaily } from './draw.js';
import {
  gainXp, gainSkills, bumpStreak, checkTitles, levelUp,
} from './progression.js';
import { openOrdealIfDue, currentOrdeal, pickOrdeal } from './ordeals.js';
import { skillDeltasFor, FAMILY_KEYS, xpToNext } from '../data/taxonomy.js';
import { todayStr } from './dates.js';
import {
  addEntry, maybeMemorable, eventEntry, eventCoda, levelChapterEntry, regionRevealEntry,
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
import { THEME_KEYS, DEFAULT_THEME } from '../data/themes.js';
import { COLLECTION_THEMES } from '../platform/billing.js';
import { hasAccess, trialExhausted } from './access.js';

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
    addEntry(s, {
      date: today,
      kind: 'decouverte',
      title: r.label,
      text: regionRevealEntry(r.label, s.theme),
    });
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

  // Essai terminé sans achat (D20) : l'aventure se met en pause. Pas de tirage,
  // pas de jour joué compté ; journal, personnage et carte restent lisibles.
  if (trialExhausted(s)) {
    const first = !s.trialEnded;
    s.trialEnded = true;
    s.quests = [];
    s.event = null;
    s.drawDate = today;
    if (!s.unlockedThemes.includes(s.theme)) s.theme = DEFAULT_THEME;
    return { state: s, effects: [{ type: 'trial-over', first }] };
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

/** Cumul mensuel pour la rétrospective (D19) — appelé après bumpStreak. */
function recordMonth(s, today, xp, famille) {
  const key = today.slice(0, 7);
  if (!s.history.months) s.history.months = {};
  const m = s.history.months[key] || (s.history.months[key] = {
    done: 0, xp: 0, activeDays: 0, lastDay: null, bestStreak: 0, fam: {},
  });
  m.done += 1;
  m.xp += Math.max(0, Math.round(xp) || 0);
  if (m.lastDay !== today) { m.activeDays += 1; m.lastDay = today; }
  m.bestStreak = Math.max(m.bestStreak, s.streak || 0);
  if (famille) m.fam[famille] = (m.fam[famille] || 0) + 1;
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
  recordMonth(s, today, q.xp, q.famille);
  applyLevelLoot(s, effects, today);

  // Historique
  s.history.totalCompleted += 1;
  s.history.familleCompleted[q.famille] = (s.history.familleCompleted[q.famille] || 0) + 1;
  countLevelFamily(s, q.famille);
  s.history.recentFamilles.push(q.famille);
  s.history.recentFamilles = s.history.recentFamilles.slice(-RECENT_FAMILLES_MEMORY);
  if (!q.gentle && !q.custom) {
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

  openOrdealIfDue(s, effects);
  effects.push({ type: 'quest-done', xp: q.xp, first: wasFirst });
  return { state: s, effects };
}

/* ─────────────── Événement ─────────────── */

export function completeEvent(state, _args, ctx) {
  const { now, rng } = ctxDefaults(ctx);
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
    countLevelFamily(s, ev.famille);
  }
  bumpStreak(s, effects, today);
  recordMonth(s, today, ev.xp, ev.famille);
  applyLevelLoot(s, effects, today);

  const loot = lootFromEvent(ev, today);
  addLoot(s, loot);
  // Entrée de journal = un souvenir, pas une ligne de log : titre de
  // l'événement, récit à la 2e personne (ev.memory), l'objet gagné, et
  // parfois un mot du compagnon. Repli sur eventEntry() si `memory` manque.
  addEntry(s, {
    date: today,
    kind: 'evenement',
    title: ev.title,
    text: ev.memory || eventEntry(ev, s.theme),
    souvenir: ev.item,
    coda: eventCoda(s.theme, rng),
  });
  applyRegionReveals(s, effects, today);

  applyMilestones(s, effects, recordEventMilestones(s, ev, now), now);

  openOrdealIfDue(s, effects);
  effects.push({ type: 'event-done', xp: ev.xp, item: ev.item });
  return { state: s, effects };
}

/* ─────────────── Épreuve de passage (D21) ─────────────── */

function countLevelFamily(s, famille) {
  if (!famille) return;
  if (!s.history.levelFam) s.history.levelFam = {};
  s.history.levelFam[famille] = (s.history.levelFam[famille] || 0) + 1;
}

/**
 * Épreuve validée : monte d'un niveau, puis de tous les niveaux dont l'XP
 * accumulée pendant l'attente remplit déjà la barre. Pas d'XP en plus.
 */
export function completeOrdeal(state, _args, ctx) {
  const { now } = ctxDefaults(ctx);
  const s = clone(state);
  const o = currentOrdeal(s);
  if (!o || !hasAccess(s)) return { state: s, effects: [] };
  const effects = [];
  const today = todayStr(now);
  const famille = o.familles[0];
  noteComebackReturn(s, now, today);

  do { levelUp(s, effects); } while (s.xp >= xpToNext(s.level));
  s.ordeal = null;
  s.history.ordealsDone = [...(s.history.ordealsDone || []), o.id].slice(-60);

  for (const f of o.familles) gainSkills(s, effects, skillDeltasFor({ famille: f, xp: 60 }));
  bumpStreak(s, effects, today);
  recordMonth(s, today, 0, famille);
  const loot = {
    item: o.item, date: today, from: o.title, kind: 'relic',
    source: 'ordeal', famille, id: `ordeal_${o.id}_${s.level}`,
  };
  if (addLoot(s, loot)) effects.push({ type: 'loot', item: loot.item, kind: loot.kind });
  addEntry(s, { date: today, kind: 'epreuve', title: o.title, text: o.memory, souvenir: o.item });
  applyLevelLoot(s, effects, today);
  applyRegionReveals(s, effects, today);

  effects.push({ type: 'ordeal-done', id: o.id, level: s.level });
  return { state: s, effects };
}

/** « Autre épreuve » : à volonté, en parcourant les candidates puis en rebouclant. */
export function rerollOrdeal(state) {
  const s = clone(state);
  if (!s.ordeal) return { state: s, effects: [] };
  let skipped = [...(s.ordeal.skipped || []), s.ordeal.id];
  let next = pickOrdeal(s, skipped);
  if (!next || skipped.includes(next.id)) { skipped = [s.ordeal.id]; next = pickOrdeal(s, skipped); }
  if (!next || next.id === s.ordeal.id) return { state: s, effects: [] };
  s.ordeal = { id: next.id, skipped };
  return { state: s, effects: [{ type: 'ordeal-reroll', id: next.id }] };
}

export function dismissEvent(state) {
  const s = clone(state);
  if (s.event) s.event = { ...s.event, status: 'dismissed' };
  return { state: s, effects: [] };
}

/* ─────────────── Réglages ─────────────── */

export function setTheme(state, { theme }) {
  const s = clone(state);
  // Pendant l'essai (D20), tous les mondes sont ouverts.
  if (!THEME_KEYS.includes(theme) || (!s.unlockedThemes.includes(theme) && !hasAccess(s))) {
    return { state: s, effects: [] };
  }
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
  const wasComplete = s.complete === true;
  s.complete = true; // « Cairn Complet » (D19) : même produit, droit séparé des thèmes
  // Achat après l'essai (D20) : l'aventure reprend tout de suite — le jour
  // bloqué est retiré pour que le prochain passage tire les quêtes.
  if (s.trialEnded) {
    s.trialEnded = false;
    if (!s.quests.length && !s.event) s.drawDate = null;
  }
  return {
    state: s,
    effects: added.length || !wasComplete ? [{ type: 'collection-unlocked', themes: added }] : [],
  };
}

/* ─────────────── Quêtes perso (Complet, D19 ; ouvertes pendant l'essai, D20) ─────────────── */

// XP fixe par effort, volontairement un peu sous la moyenne du pool (75 / 101 /
// 139) et 1 seule quête perso jouée par jour : aucune voie de farm d'XP payante.
export const CUSTOM_XP = { leger: 60, moyen: 90, consequent: 120 };
export const CUSTOM_MAX_SAVED = 30;
export const CUSTOM_TEXT_MAX = 120;

export function addCustomQuest(state, { text, famille, effort }) {
  const s = clone(state);
  const t = String(text || '').replace(/\s+/g, ' ').trim().slice(0, CUSTOM_TEXT_MAX);
  if (!hasAccess(s) || t.length < 3 || !FAMILY_KEYS.includes(famille) || !CUSTOM_XP[effort]) {
    return { state: s, effects: [] };
  }
  if (s.customQuests.length >= CUSTOM_MAX_SAVED) {
    return { state: s, effects: [{ type: 'custom-full' }] };
  }
  const id = `c${Date.now().toString(36)}${s.customQuests.length}`;
  s.customQuests.push({ id, text: t, famille, effort });
  return { state: s, effects: [{ type: 'custom-added', id }] };
}

export function updateCustomQuest(state, { id, text, famille, effort }) {
  const s = clone(state);
  const c = s.customQuests.find((x) => x.id === id);
  const txt = String(text || '').replace(/\s+/g, ' ').trim().slice(0, CUSTOM_TEXT_MAX);
  if (!hasAccess(s) || !c || txt.length < 3 || !FAMILY_KEYS.includes(famille) || !CUSTOM_XP[effort]) {
    return { state: s, effects: [] };
  }
  Object.assign(c, { text: txt, famille, effort });
  return { state: s, effects: [{ type: 'custom-updated', id }] };
}

export function deleteCustomQuest(state, { id }) {
  const s = clone(state);
  s.customQuests = s.customQuests.filter((c) => c.id !== id);
  return { state: s, effects: [] };
}

/** Ajoute une quête perso à la liste du jour (une seule par jour). */
export function playCustomQuest(state, { id }, ctx) {
  const { now } = ctxDefaults(ctx);
  const s = clone(state);
  const c = s.customQuests.find((x) => x.id === id);
  if (!hasAccess(s) || !c || s.quests.some((q) => q.custom)) {
    return { state: s, effects: [] };
  }
  s.quests.push({
    id: `custom_${c.id}_${todayStr(now)}`,
    famille: c.famille,
    text: { fr: c.text, en: c.text },
    xp: CUSTOM_XP[c.effort],
    effort: c.effort,
    registre: 'quete',
    audace: 1,
    contexte: [],
    defi_ami: false,
    custom: true,
    status: 'accepted',
  });
  return { state: s, effects: [{ type: 'custom-played', id: c.id }] };
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

export const EXTRA_REMINDERS_MAX = 2;

/** Heures valides (6..22), sans doublon ni l'heure principale, plafonnées. */
export function cleanExtraHours(list, mainHour) {
  const out = [];
  for (const v of Array.isArray(list) ? list : []) {
    const h = Math.round(Number(v));
    if (h >= 6 && h <= 22 && h !== mainHour && !out.includes(h)) out.push(h);
  }
  return out.sort((x, y) => x - y).slice(0, EXTRA_REMINDERS_MAX);
}

export function setNotifications(state, { enabled, hour, extra }) {
  const s = clone(state);
  const mainHour = hour != null ? Math.min(22, Math.max(6, Math.round(hour))) : s.notifications.hour;
  // Rappels supplémentaires : Complet (D19), ouverts pendant l'essai (D20).
  const wanted = extra !== undefined ? extra : s.notifications.extra;
  s.notifications = {
    enabled: enabled != null ? !!enabled : s.notifications.enabled,
    hour: mainHour,
    extra: hasAccess(s) ? cleanExtraHours(wanted, mainHour) : [],
  };
  return { state: s, effects: [{ type: 'notifications', ...s.notifications }] };
}

export function renameHero(state, { name }) {
  const s = clone(state);
  s.name = (name || '').trim().slice(0, 24) || s.name;
  return { state: s, effects: [] };
}

/** Épingle / désépingle une entrée de journal (garder un souvenir en évidence). */
export function togglePinnedMemory(state, { id }) {
  const s = clone(state);
  const e = (s.journal || []).find((x) => x.id === id);
  if (e) e.pinned = !e.pinned;
  return { state: s, effects: [] };
}

// Ré-exports utiles
export { checkTitles };
