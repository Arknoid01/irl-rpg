// Titres — un fil par compétence, 2 paliers (cf. TAXONOMIE §8).
// Débloqués quand la compétence atteint le seuil. Jamais reperdus.
//
// T1 (~100) : première récompense en quelques jours d’engagement.
// T2 (~320) : palier « maîtrisé », ~2–4 semaines sur une compétence fréquente ;
//             plus long sur discipline / création (tirage plus rare).

export const TITLE_TIER1 = 100;
export const TITLE_TIER2 = 320;

export const TITLES = [
  { id: 'curiosite_1', skill: 'curiosite', min: TITLE_TIER1, label: { fr: '🔎 Œil curieux', en: '🔎 Curious eye' } },
  { id: 'curiosite_2', skill: 'curiosite', min: TITLE_TIER2, label: { fr: '🧠 Érudit', en: '🧠 Scholar' } },
  { id: 'social_1',    skill: 'social',    min: TITLE_TIER1, label: { fr: '🙂 Bonne présence', en: '🙂 Warm presence' } },
  { id: 'social_2',    skill: 'social',    min: TITLE_TIER2, label: { fr: '🤝 Diplomate', en: '🤝 Diplomat' } },
  { id: 'audace_1',    skill: 'audace',    min: TITLE_TIER1, label: { fr: '🚪 Premier pas', en: '🚪 First step' } },
  { id: 'audace_2',    skill: 'audace',    min: TITLE_TIER2, label: { fr: '🥾 Explorateur', en: '🥾 Explorer' } },
  { id: 'creativite_1', skill: 'creativite', min: TITLE_TIER1, label: { fr: '✏️ Main qui bricole', en: '✏️ Tinkerer\'s hand' } },
  { id: 'creativite_2', skill: 'creativite', min: TITLE_TIER2, label: { fr: '🎨 Artiste de rue', en: '🎨 Street artist' } },
  { id: 'discipline_1', skill: 'discipline', min: TITLE_TIER1, label: { fr: '🧭 Cap tenu', en: '🧭 On course' } },
  { id: 'discipline_2', skill: 'discipline', min: TITLE_TIER2, label: { fr: '🏆 Héros du quotidien', en: '🏆 Everyday hero' } },
  { id: 'chaos_1',    skill: 'chaos',    min: TITLE_TIER1, label: { fr: '🙃 Grain de sable', en: '🙃 Spanner in the works' } },
  { id: 'chaos_2',    skill: 'chaos',    min: TITLE_TIER2, label: { fr: '😂 Agent du Chaos', en: '😂 Chaos agent' } },
];

// Style d'aventure — dérivé des 1-2 compétences dominantes (valeur brute).
export const STYLES = {
  curiosite:  { fr: '🔭 Explorateur curieux', en: '🔭 Curious explorer' },
  social:     { fr: '🤝 Âme sociable', en: '🤝 Sociable soul' },
  audace:     { fr: '🧗 Tête brûlée douce', en: '🧗 Gentle daredevil' },
  creativite: { fr: '🎨 Regard d’artiste', en: '🎨 Artist’s eye' },
  discipline: { fr: '🧹 Maître de son quotidien', en: '🧹 Master of the everyday' },
  chaos:      { fr: '😂 Agent du chaos', en: '😂 Chaos agent' },
};

export const STYLE_PAIRS = {
  'social+chaos':         { fr: '🎭 Grain de folie sociable', en: '🎭 Sociable streak of madness' },
  'curiosite+creativite': { fr: '🖋️ Œil qui invente', en: '🖋️ Eye that invents' },
  'audace+curiosite':     { fr: '🗺️ Aventurier attentif', en: '🗺️ Attentive adventurer' },
  'social+audace':        { fr: '🔥 Fonceur chaleureux', en: '🔥 Warm go-getter' },
  'chaos+audace':         { fr: '🎢 Électron libre', en: '🎢 Free spirit' },
  'discipline+creativite':{ fr: '🛠️ Bâtisseur tranquille', en: '🛠️ Quiet builder' },
};

export const STYLE_DEFAULT = { fr: '🌱 Aventurier en devenir', en: '🌱 Adventurer in the making' };
