// Taxonomie canonique — cf. docs/TAXONOMIE.md
// Ce fichier fait foi pour les familles, compétences et la matrice.
// Les libellés sont bilingues ({ fr, en }) ; résolus via i18n.loc().

/** Les 6 compétences du personnage. */
export const SKILLS = {
  curiosite:  { label: { fr: 'Curiosité',  en: 'Curiosity' },   icon: '🧠' },
  social:     { label: { fr: 'Social',     en: 'Social' },       icon: '🤝' },
  audace:     { label: { fr: 'Audace',     en: 'Boldness' },     icon: '🧗' },
  creativite: { label: { fr: 'Créativité', en: 'Creativity' },   icon: '🎨' },
  discipline: { label: { fr: 'Discipline', en: 'Discipline' },   icon: '🧹' },
  chaos:      { label: { fr: 'Chaos',      en: 'Chaos' },        icon: '😂' },
};

export const SKILL_KEYS = Object.keys(SKILLS);

/** Les 6 familles de quêtes (écriture + tirage). */
export const FAMILIES = {
  social: {
    label: { fr: 'Social', en: 'Social' }, icon: '🤝', color: '#c9a227',
    desc: { fr: 'Une interaction humaine réelle, positive, naturelle.', en: 'A real, positive, natural human interaction.' },
    primary: 'social', secondary: 'audace', drawWeight: 25,
  },
  exploration: {
    label: { fr: 'Exploration', en: 'Exploration' }, icon: '🧭', color: '#4a7a9a',
    desc: { fr: 'Découvrir son environnement, changer ses trajets.', en: 'Discover your surroundings, change your routes.' },
    primary: 'audace', secondary: 'curiosite', drawWeight: 20,
  },
  curiosite: {
    label: { fr: 'Curiosité', en: 'Curiosity' }, icon: '🔭', color: '#6b8f71',
    desc: { fr: 'Observer le monde autrement, apprendre, résoudre.', en: 'See the world differently, learn, solve.' },
    primary: 'curiosite', secondary: 'creativite', drawWeight: 15,
  },
  creation: {
    label: { fr: 'Création', en: 'Creation' }, icon: '🎨', color: '#a67c52',
    desc: { fr: 'Fabriquer, dessiner, écrire, cuisiner, photographier.', en: 'Make, draw, write, cook, photograph.' },
    primary: 'creativite', secondary: 'curiosite', drawWeight: 10,
  },
  quotidien: {
    label: { fr: 'Quotidien', en: 'Everyday' }, icon: '🧹', color: '#5a8f62',
    desc: { fr: 'La vie courante — toujours avec une petite torsion de jeu.', en: 'Everyday life — always with a small game twist.' },
    primary: 'discipline', secondary: null, drawWeight: 15,
  },
  chaos: {
    label: { fr: 'Chaos', en: 'Chaos' }, icon: '😂', color: '#a63d3d',
    desc: { fr: 'Une règle absurde et temporaire, le hasard aux commandes.', en: 'An absurd, temporary rule; chance in charge.' },
    primary: 'chaos', secondary: 'audace', drawWeight: 15,
  },
};

export const FAMILY_KEYS = Object.keys(FAMILIES);

/** Coefficients XP -> compétence (cf. TAXONOMIE §4). */
export const SKILL_GAIN = { primary: 0.5, secondary: 0.2 };

/** Coût en points d'effort par niveau. Budget quotidien = 7, max 1 "consequent". */
export const EFFORT_POINTS = { leger: 1, moyen: 2, consequent: 4 };
export const DAILY_EFFORT_BUDGET = 7;

/**
 * Répartit l'XP d'une quête sur les compétences.
 * @returns {Record<string, number>} deltas de compétence
 */
export function skillDeltasFor(quest) {
  const fam = FAMILIES[quest.famille];
  if (!fam) return {};
  const deltas = {};
  deltas[fam.primary] = Math.round(quest.xp * SKILL_GAIN.primary);
  const secondary = quest.skill_bonus || fam.secondary;
  if (secondary) {
    deltas[secondary] = (deltas[secondary] || 0) + Math.round(quest.xp * SKILL_GAIN.secondary);
  }
  return deltas;
}

/** Courbe d'XP : XP nécessaire pour passer du niveau `level` au suivant. */
export function xpToNext(level) {
  return 200 + (level - 1) * 100;
}
