// Jalons d'aventure — les « premières fois » et les paliers de volume.
// state.milestones : { <clé> : 'YYYY-MM-DD' } — date de la première occurrence.
// Purement mémoire : sert au compagnon (voix par jalon) et, plus tard, à la
// collection « Moments » (ROADMAP Phase 2.3). Aucune règle, aucune pénalité :
// un jalon jamais atteint ne coûte rien, il n'est simplement pas encore là.

import { dayPart, todayStr } from './dates.js';

/** Ordre canonique — les tests et la voix des thèmes s'appuient dessus. */
export const FIRST_MILESTONES = [
  'first_quest',    // toute première quête accomplie
  'first_outdoor',  // une quête qui t'a fait sortir (contexte extérieur)
  'first_social',   // une vraie interaction (famille social, hors version douce)
  'first_evening',  // une quête bouclée le soir
  'first_hidden',   // une quête mystérieuse menée à son terme
  'first_bold',     // une quête franchement audacieuse (audace >= 4)
  'first_big',      // une quête à effort conséquent
  'first_event',    // un événement rare relevé
];

export const VOLUME_MILESTONES = [10, 25, 50, 100];

export const MILESTONE_KEYS = [
  ...FIRST_MILESTONES,
  ...VOLUME_MILESTONES.map((n) => `volume_${n}`),
];

/**
 * Libellés bilingues pour la collection « Moments » (ROADMAP Phase 2.3).
 * Évocateurs, jamais une description de la condition de déclenchement — la
 * surprise fait partie du plaisir. Les paliers de volume sont explicites (ils
 * n'ont rien de secret) et rendus à part par l'UI.
 */
export const MILESTONE_LABELS = {
  first_quest:   { icon: '📖', fr: 'La première aventure', en: 'The first adventure' },
  first_outdoor: { icon: '🚪', fr: 'Un pas dehors', en: 'A step outside' },
  first_social:  { icon: '🤝', fr: 'Un mot à quelqu’un', en: 'A word to someone' },
  first_evening: { icon: '🌙', fr: 'Sous la lampe du soir', en: 'Under the evening lamp' },
  first_hidden:  { icon: '🗝', fr: 'Un mystère suivi jusqu’au bout', en: 'A mystery followed to its end' },
  first_bold:    { icon: '🧗', fr: 'Un pas plus grand que d’habitude', en: 'A step bigger than usual' },
  first_big:     { icon: '⚓', fr: 'Une aventure qui pesait son poids', en: 'An adventure with real weight' },
  first_event:   { icon: '✦', fr: 'Un imprévu saisi', en: 'An unexpected turn taken' },
};

/** Libellé d'un palier de volume (explicite). */
export function volumeLabel(n, lang = 'fr') {
  return lang === 'en' ? `${n} adventures` : `${n} aventures`;
}

function marker(state, dateStr) {
  if (!state.milestones || typeof state.milestones !== 'object') state.milestones = {};
  const hits = [];
  return {
    hits,
    mark(key) {
      if (state.milestones[key]) return;
      state.milestones[key] = dateStr;
      hits.push(key);
    },
  };
}

/**
 * Enregistre les jalons déclenchés par une quête accomplie.
 * À appeler APRÈS l'incrément de state.history.totalCompleted.
 * @returns {string[]} clés nouvellement débloquées, dans l'ordre canonique
 */
export function recordQuestMilestones(state, quest, now = new Date()) {
  const today = todayStr(now);
  const { hits, mark } = marker(state, today);
  const total = state.history?.totalCompleted || 0;
  const contexte = quest.contexte || [];

  if (total === 1) mark('first_quest');
  if (contexte.includes('exterieur')) mark('first_outdoor');
  if (quest.famille === 'social' && !quest.gentle) mark('first_social');
  if (dayPart(now) === 'soir') mark('first_evening');
  if (quest.hidden) mark('first_hidden');
  if ((quest.audace || 0) >= 4) mark('first_bold');
  if (quest.effort === 'consequent') mark('first_big');
  for (const n of VOLUME_MILESTONES) {
    if (total === n) mark(`volume_${n}`);
  }
  return hits;
}

/** Jalons déclenchés par un événement relevé. */
export function recordEventMilestones(state, _event, now = new Date()) {
  const { hits, mark } = marker(state, todayStr(now));
  mark('first_event');
  return hits;
}

/**
 * Applique une liste de jalons au journal des effets + mémoire du compagnon.
 * Le compagnon met en avant le PREMIER de la liste (ordre canonique : une
 * toute première quête l'emporte sur « tu es sorti », etc.).
 */
export function applyMilestones(state, effects, keys, now = new Date()) {
  if (!keys || !keys.length) return;
  for (const key of keys) effects.push({ type: 'milestone', key });
  if (!state.history) state.history = {};
  state.history.lastMilestone = { key: keys[0], date: todayStr(now) };
}
