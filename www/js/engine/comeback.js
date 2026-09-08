// Retour après absence (ROADMAP Phase 1.3). Aucune notion de faute : on ne
// compte pas les jours « manqués », on constate juste que ça faisait un moment
// et on rend la reprise plus douce (tirage allégé, quêtes neuves, un événement
// d'accueil possible, une ligne dédiée du compagnon). Jamais de reproche (D3).

import { daysBetween, todayStr } from './dates.js';

/** À partir de combien de jours sans activité on parle de « retour ». */
export const COMEBACK_DAYS = 3;

/** Jours écoulés depuis la dernière activité (0 si jamais actif / aujourd'hui). */
export function daysAway(state, now = new Date()) {
  if (!state || !state.lastActiveDate) return 0;
  return Math.max(0, daysBetween(state.lastActiveDate, todayStr(now)));
}

/**
 * Vrai le jour où le joueur revient après une absence, tant qu'il n'a rien
 * repris (dès qu'il valide quelque chose, bumpStreak remet lastActiveDate à
 * aujourd'hui et le mode s'éteint tout seul).
 */
export function isComebackDay(state, now = new Date()) {
  return daysAway(state, now) >= COMEBACK_DAYS;
}
