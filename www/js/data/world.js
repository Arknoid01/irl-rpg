// Carte du monde abstraite — plateau symbolique (pas de géoloc).
// Les régions correspondent aux familles / progression / mystère.

/** @typedef {'hub'|'family'|'gate'|'mystery'} RegionKind */

/**
 * @type {Array<{
 *   id: string,
 *   kind: RegionKind,
 *   famille?: string,
 *   x: number, y: number,
 *   icon: string,
 *   label: {fr:string,en:string},
 *   blurb: {fr:string,en:string},
 *   unlock: { type: 'always' } | { type: 'family'; n: number } | { type: 'level'; min: number } | { type: 'hidden'; n: number },
 * }>}
 */
export const WORLD_REGIONS = [
  {
    id: 'foyer', kind: 'hub', x: 50, y: 48, icon: '🏘',
    label: { fr: 'Foyer', en: 'Hearth' },
    blurb: {
      fr: 'Ton point de départ. Les souvenirs et les événements du jour s’y rassemblent.',
      en: 'Your starting point. Souvenirs and today’s events gather here.',
    },
    unlock: { type: 'always' },
  },
  {
    id: 'social', kind: 'family', famille: 'social', x: 82, y: 36, icon: '🤝',
    label: { fr: 'Place des rencontres', en: 'Meeting square' },
    blurb: {
      fr: 'Là où les gestes simples deviennent des liens.',
      en: 'Where simple gestures become bonds.',
    },
    unlock: { type: 'family', n: 1 },
  },
  {
    id: 'exploration', kind: 'family', famille: 'exploration', x: 18, y: 34, icon: '🧭',
    label: { fr: 'Sentiers inconnus', en: 'Unknown paths' },
    blurb: {
      fr: 'Chemins détournés, rues jamais prises, horizons proches.',
      en: 'Detours, untaken streets, nearby horizons.',
    },
    unlock: { type: 'family', n: 1 },
  },
  {
    id: 'curiosite', kind: 'family', famille: 'curiosite', x: 14, y: 62, icon: '🔭',
    label: { fr: 'Observatoire', en: 'Observatory' },
    blurb: {
      fr: 'Regarder autrement — sons, couleurs, détails oubliés.',
      en: 'See differently — sounds, colours, forgotten details.',
    },
    unlock: { type: 'family', n: 1 },
  },
  {
    id: 'creation', kind: 'family', famille: 'creation', x: 28, y: 86, icon: '🎨',
    label: { fr: 'Atelier', en: 'Workshop' },
    blurb: {
      fr: 'Ce que tu fabriques laisse une trace sur la carte.',
      en: 'What you make leaves a mark on the map.',
    },
    unlock: { type: 'family', n: 1 },
  },
  {
    id: 'quotidien', kind: 'family', famille: 'quotidien', x: 50, y: 78, icon: '🧹',
    label: { fr: 'Quartier du quotidien', en: 'Everyday quarter' },
    blurb: {
      fr: 'La vie courante, toujours avec une petite torsion de jeu.',
      en: 'Everyday life, always with a small game twist.',
    },
    unlock: { type: 'family', n: 1 },
  },
  {
    id: 'chaos', kind: 'family', famille: 'chaos', x: 76, y: 78, icon: '😂',
    label: { fr: 'Terrain du hasard', en: 'Grounds of chance' },
    blurb: {
      fr: 'Règles absurdes, dés mentaux, improvisation.',
      en: 'Absurd rules, mental dice, improvisation.',
    },
    unlock: { type: 'family', n: 1 },
  },
  {
    id: 'montagne', kind: 'gate', x: 50, y: 14, icon: '🏔',
    label: { fr: 'Crête des niveaux', en: 'Ridge of levels' },
    blurb: {
      fr: 'Un panorama qui s’ouvre quand tu as assez cheminé.',
      en: 'A vista that opens once you have journeyed far enough.',
    },
    unlock: { type: 'level', min: 8 },
  },
  {
    id: 'chateau', kind: 'gate', x: 86, y: 58, icon: '🏰',
    label: { fr: 'Château lointain', en: 'Distant castle' },
    blurb: {
      fr: 'Une silhouette pour les aventuriers confirmés — purement symbolique.',
      en: 'A silhouette for seasoned adventurers — purely symbolic.',
    },
    unlock: { type: 'level', min: 15 },
  },
  {
    id: 'grotte', kind: 'mystery', x: 68, y: 18, icon: '🕳',
    label: { fr: 'Grotte mystérieuse', en: 'Mysterious cave' },
    blurb: {
      fr: 'S’ouvre après une quête cachée — un chapitre entrevu.',
      en: 'Opens after a hidden quest — a chapter glimpsed.',
    },
    unlock: { type: 'hidden', n: 1 },
  },
];

/** Chemins ink entre régions (ids). */
export const WORLD_PATHS = [
  ['foyer', 'social'],
  ['foyer', 'exploration'],
  ['foyer', 'quotidien'],
  ['foyer', 'montagne'],
  ['exploration', 'curiosite'],
  ['curiosite', 'creation'],
  ['quotidien', 'creation'],
  ['quotidien', 'chaos'],
  ['social', 'chaos'],
  ['social', 'chateau'],
  ['montagne', 'grotte'],
  ['foyer', 'grotte'],
];

export const WORLD_REGION_IDS = WORLD_REGIONS.map((r) => r.id);
