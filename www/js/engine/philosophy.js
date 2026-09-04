// Garde-fous « philosophie » — cf. REVUE_CRITIQUE §3.1.
// Le jeu ne doit jamais : infliger une pénalité, culpabiliser, rendre une série
// cassée coûteuse, ou exiger une action. Ces helpers rendent la règle explicite
// et sont vérifiés par les tests.

/** Ignorer une quête est toujours gratuit. */
export const IGNORE_IS_FREE = true;

/** Casser une série ne coûte rien de réel. */
export const STREAK_BREAK_COST = 0;

/**
 * Vérifie qu'une transition d'état n'a rien retiré au joueur.
 * Utilisé par les tests et en dev. Renvoie une liste de violations (vide = OK).
 */
export function checkNoPenalty(prev, next) {
  const bad = [];
  if (next.xp < 0) bad.push('xp négatif');
  if (next.level < prev.level) bad.push('niveau qui baisse');
  for (const k of Object.keys(prev.skills || {})) {
    if ((next.skills[k] || 0) < (prev.skills[k] || 0)) bad.push(`compétence ${k} en baisse`);
  }
  if ((next.titles || []).length < (prev.titles || []).length) bad.push('titre retiré');
  if ((next.inventory || []).length < (prev.inventory || []).length) bad.push('objet retiré');
  // Le seul recul autorisé sur la série est un reset à 1 (jamais < 1, jamais de coût).
  if (next.streak < 1 && next.streak !== 0) bad.push('série invalide');
  return bad;
}

/** Message d'accompagnement neutre (jamais de reproche). Choisi par l'appelant. */
export const GENTLE_LINES = [
  'Rien d’obligatoire ici. Prends ce qui te tente.',
  'Tu peux tout ignorer — la journée compte quand même.',
  'Une seule quête, c’est déjà une aventure.',
];
