// Collection « Découvertes » (ROADMAP Phase 2.4) — les contextes de vie que
// tes quêtes accomplies t'ont fait traverser. Mécanique jumelle des jalons
// (engine/milestones.js) : `state.discoveries` = { <clé> : 'YYYY-MM-DD' }.
// Dérivé du `contexte` (et de la famille) des quêtes — donc 100 % on-device,
// aucune donnée météo / géo (D11). Purement décoratif, aucune pression.

import { dayPart, todayStr } from './dates.js';

/** Ordre canonique — l'UI et les tests s'appuient dessus. */
export const DISCOVERY_KEYS = [
  'dehors',    // une quête en extérieur
  'chemin',    // une quête liée à un trajet
  'rencontre', // une quête sociale / en présence de gens
  'creer',     // une quête de création
  'matin',     // une quête bouclée le matin
  'soir',      // une quête bouclée le soir
];

/** Libellés bilingues — évocateurs, sans dire quelle quête les déclenche. */
export const DISCOVERY_LABELS = {
  dehors:    { icon: '🌿', fr: 'Dehors', en: 'Outside' },
  chemin:    { icon: '🚶', fr: 'En chemin', en: 'On the way' },
  rencontre: { icon: '👥', fr: 'Une rencontre', en: 'An encounter' },
  creer:     { icon: '🎨', fr: 'Créer quelque chose', en: 'Making something' },
  matin:     { icon: '🌅', fr: 'Le matin', en: 'The morning' },
  soir:      { icon: '🌙', fr: 'Le soir', en: 'The evening' },
};

/**
 * Enregistre les découvertes déclenchées par une quête accomplie.
 * @returns {string[]} clés nouvellement débloquées (ordre canonique)
 */
export function recordDiscoveries(state, quest, now = new Date()) {
  if (!state.discoveries || typeof state.discoveries !== 'object') state.discoveries = {};
  const today = todayStr(now);
  const contexte = quest.contexte || [];
  const hits = [];
  const mark = (key) => {
    if (state.discoveries[key]) return;
    state.discoveries[key] = today;
    hits.push(key);
  };

  if (contexte.includes('exterieur')) mark('dehors');
  if (contexte.includes('trajet')) mark('chemin');
  if (contexte.includes('presence_gens') || (quest.famille === 'social' && !quest.gentle)) {
    mark('rencontre');
  }
  if (quest.famille === 'creation') mark('creer');
  const part = dayPart(now);
  if (part === 'matin') mark('matin');
  if (part === 'soir') mark('soir');

  // ordre canonique
  return DISCOVERY_KEYS.filter((k) => hits.includes(k));
}
