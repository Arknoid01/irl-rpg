// Accès à l'aventure (D20) : essai complet de 7 jours joués, puis achat unique
// « Cairn Complet ». Un jour joué = un jour où l'app a tiré les quêtes
// (`history.daysPlayed`) : installer puis oublier l'app ne consomme pas l'essai.
// Après l'essai, sans achat, l'aventure se met en pause — le journal, le
// personnage, la carte et l'export restent lisibles à vie.

export const TRIAL_DAYS = 7;

/** L'aventure est ouverte : acheteur, ou essai pas encore terminé. */
export function hasAccess(state) {
  return !!state && (state.complete === true || !state.trialEnded);
}

/** Essai en cours (pas d'achat, pas encore terminé). */
export function inTrial(state) {
  return !!state && state.complete !== true && !state.trialEnded;
}

/** Jour d'essai courant, 1..TRIAL_DAYS (0 hors essai). */
export function trialDay(state) {
  if (!inTrial(state)) return 0;
  return Math.min(TRIAL_DAYS, Math.max(1, state.history?.daysPlayed || 1));
}

/** Le prochain tirage doit-il être refusé (essai épuisé, pas d'achat) ? */
export function trialExhausted(state) {
  return !!state && state.complete !== true
    && (state.trialEnded === true || (state.history?.daysPlayed || 0) >= TRIAL_DAYS);
}
