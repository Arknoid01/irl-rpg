// Tirage d’événements contextuel + pondération légère.

import { EVENTS } from '../data/events.js';
import { FAMILY_KEYS } from '../data/taxonomy.js';
import { dayPart } from './dates.js';
import { weightedPick, defaultRng } from './rng.js';

const DEFAULT_WEIGHT = 10;
const PREF_BONUS = 6;
const UNDERPLAYED_BONUS = 8;
const OVERPLAYED_PENALTY = 5;
const RECENT_EVENT_MEMORY = 12;

function familyCount(state, fam) {
  return (state.history.familleCompleted && state.history.familleCompleted[fam]) || 0;
}

function avgFamilyCompletions(state) {
  const sum = FAMILY_KEYS.reduce((s, f) => s + familyCount(state, f), 0);
  return sum / FAMILY_KEYS.length;
}

/** Éligibilité dure (hors poids). */
export function eventEligible(ev, state, now = new Date()) {
  if (!ev) return false;
  if (ev.minLevel != null && state.level < ev.minLevel) return false;
  if (ev.minStreak != null && (state.streak || 0) < ev.minStreak) return false;
  if (ev.minComfort != null && state.comfort < ev.minComfort) return false;
  if (ev.maxComfort != null && state.comfort > ev.maxComfort) return false;
  if (ev.moment) {
    if (dayPart(now) !== ev.moment) return false;
  }
  if (ev.requireFamily) {
    const need = ev.requireFamilyN || 1;
    if (familyCount(state, ev.requireFamily) < need) return false;
  }
  const recent = state.history.recentEventIds || [];
  if (recent.includes(ev.id)) return false;
  return true;
}

/** Poids adaptatif. */
export function eventWeight(ev, state) {
  let w = Number.isFinite(ev.weight) ? ev.weight : DEFAULT_WEIGHT;
  if (ev.famille && (state.prefFamilies || []).includes(ev.famille)) w += PREF_BONUS;
  if (ev.famille) {
    const avg = avgFamilyCompletions(state);
    const n = familyCount(state, ev.famille);
    if (n < avg - 0.5) w += UNDERPLAYED_BONUS;
    if (n > avg + 3) w = Math.max(1, w - OVERPLAYED_PENALTY);
  }
  if (ev.minStreak && (state.streak || 0) >= (ev.minStreak || 0) + 2) w += 3;
  if (ev.minLevel && state.level >= (ev.minLevel || 0) + 2) w += 2;
  return Math.max(0, w);
}

/**
 * Tire un événement ou null.
 * @returns {object|null} événement sans status
 */
export function drawEvent(state, { now = new Date(), rng = defaultRng, chance = 0.32 } = {}) {
  if (rng() >= chance) return null;
  const pool = EVENTS.filter((ev) => eventEligible(ev, state, now));
  if (!pool.length) return null;
  const weighted = pool.map((ev) => ({ value: ev, weight: eventWeight(ev, state) }));
  if (weighted.every((x) => x.weight <= 0)) return null;
  const picked = weightedPick(weighted, rng);
  return picked ? { ...picked } : null;
}

/** Bonus / malus de poids famille pour le tirage de quêtes. */
export function adaptiveFamilyBonus(fam, state) {
  let bonus = 0;
  const avg = avgFamilyCompletions(state);
  const n = familyCount(state, fam);
  if (n < avg - 0.5) bonus += UNDERPLAYED_BONUS;
  if (n > avg + 3) bonus -= OVERPLAYED_PENALTY;
  const recent = (state.history.recentFamilles || []).slice(-5);
  const recentHits = recent.filter((f) => f === fam).length;
  if (recentHits >= 3) bonus -= 6;
  return bonus;
}

export { RECENT_EVENT_MEMORY };
