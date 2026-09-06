// Thème payant — Post-apo. Voir ../themes.js pour le contrat attendu par un thème.

export default {
  label: { fr: 'Post-apo', en: 'Fallout' },
  dot: 'linear-gradient(135deg,#a4552b,#b89526)',
  companionLines: {
    fr: [
      'La radio grésille. Ton guide capte quelques missions dans le secteur.',
      'Poussière et ferraille. Ton guide a repéré deux ou trois trucs faisables.',
      'Le calme, pour l’instant. Voici de quoi occuper la journée.',
    ],
    en: [
      'The radio crackles. Your guide picks up a few runs in the sector.',
      'Dust and scrap. Your guide spotted two or three doable things.',
      'Quiet, for now. Here is enough to fill the day.',
    ],
  },
  xpSuffix: { fr: '— ça, c’est fait', en: '— that one’s done' },

  ui: {
    questsHeading: { fr: 'Missions du jour', en: 'Today’s runs' },
    eventLabel: { fr: 'Alerte', en: 'Alert' },
    allDone: {
      fr: 'Toutes les missions du jour sont faites 🏆',
      en: 'All of today’s runs are done 🏆',
    },
  },

  previewVideo: null,
};
