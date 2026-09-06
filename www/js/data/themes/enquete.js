// Thème payant — Enquête. Voir ../themes.js pour le contrat attendu par un thème.

export default {
  label: { fr: 'Enquête', en: 'The case' },
  dot: 'linear-gradient(135deg,#1f3a5f,#b23b3b)',
  companionLines: {
    fr: [
      'Ton coéquipier étale le dossier. Quelques pistes à suivre aujourd’hui.',
      'Café tiède, tableau de liège. Ton coéquipier a noté deux ou trois choses.',
      'Rien d’urgent. Ton coéquipier te propose de quoi avancer sur l’affaire.',
    ],
    en: [
      'Your partner lays out the file. A few leads to follow today.',
      'Lukewarm coffee, corkboard. Your partner jotted down two or three things.',
      'Nothing urgent. Your partner has enough to move the case forward.',
    ],
  },
  xpSuffix: { fr: '— versé au dossier', en: '— filed to the case' },

  ui: {
    questsHeading: { fr: 'Pistes du jour', en: 'Today’s leads' },
    eventLabel: { fr: 'Développement', en: 'Development' },
    allDone: {
      fr: 'Toutes les pistes du jour sont suivies 🏆',
      en: 'Every lead today has been followed 🏆',
    },
  },

  // Aperçu boutique : voir le commentaire dans cyberpunk.js.
  previewVideo: null,
};
