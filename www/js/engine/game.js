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
} from './journal.js';
import { defaultRng } from './rng.js';
import { templateHistoryKey } from './generate.js';
import { RECENT_EVENT_MEMORY } from './events.js';
import {
  addLoot, lootFromEvent, lootFromHiddenQuest, milestoneLootForLevel,
} from './inventory.js';
import { syncRegionUnlocks } from './worldView.js';

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
    addEntry(s, { date: today, text: levelChapterEntry(fx.level), kind: 'chapitre' });
    effects.push({ type: 'chapter', level: fx.level });
  }
}

function applyRegionReveals(s, effects, today) {
  const newly = syncRegionUnlocks(s);
  for (const r of newly) {
    if (r.id === 'foyer') continue;
    addEntry(s, { date: today, text: regionRevealEntry(r.label), kind: 'decouverte' });
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

  const { quests, event } = drawDaily(s, { now, rng });
  s.quests = quests;
  s.event = event;
  s.drawDate = today;
  s.history.daysPlayed += 1;
  if (event && event.id) {
    const recent = (s.history.recentEventIds || []).slice();
    recent.push(event.id);
    s.history.recentEventIds = recent.slice(-RECENT_EVENT_MEMORY);
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

  // Journal
  if (q.fragment) {
    addEntry(s, { date: today, text: q.fragment, kind: 'fragment' });
    effects.push({ type: 'fragment', text: q.fragment });
  }
  const memo = maybeMemorable(q, rng);
  if (memo) {
    addEntry(s, { date: today, text: memo, kind: 'moment' });
    effects.push({ type: 'moment', text: memo });
  }

  if (q.hidden) {
    const loot = lootFromHiddenQuest(q, today);
    if (addLoot(s, loot)) effects.push({ type: 'loot', item: loot.item, kind: loot.kind });
  }

  applyRegionReveals(s, effects, today);

  effects.push({ type: 'quest-done', xp: q.xp });
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
  addEntry(s, { date: today, text: eventEntry(ev), kind: 'evenement' });
  applyRegionReveals(s, effects, today);

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
  s.theme = theme;
  return { state: s, effects: [{ type: 'theme', theme }] };
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
