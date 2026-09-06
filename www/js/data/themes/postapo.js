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

  // Voix du compagnon (cf. engine/companion.js). « Guide », voix radio.
  ctx: {
    emptyDay: {
      fr: [
        'Aucune mission en cours. On peut en trouver quand tu veux.',
        'Calme radio. Un mot et de nouvelles pistes remontent.',
      ],
      en: [
        'No run in play. We can find some whenever.',
        'Radio’s quiet. One word and new leads come in.',
      ],
    },
    allDone: {
      fr: [
        'Toutes les missions du jour sont bouclées. La radio peut se taire.',
        'Rien d’autre à courir aujourd’hui. Ton guide coupe l’émetteur.',
      ],
      en: [
        'All of today’s runs are done. The radio can go quiet.',
        'Nothing else to run today. Your guide cuts the transmitter.',
      ],
    },
    streakHot: {
      fr: [
        'Jour après jour, tu tiens le secteur. Ça compte, ici.',
        'La série dure. Ton guide le note sur la carte, sans un mot de plus.',
      ],
      en: [
        'Day after day, you hold the sector. That counts, out here.',
        'The streak holds. Your guide marks it on the map, nothing more.',
      ],
    },
    mapFresh: {
      fr: [
        'Signal capté : un secteur de la carte vient de s’ouvrir.',
        'Ton guide tape sur la carte : une zone est praticable.',
      ],
      en: [
        'Signal picked up: a sector of the map just opened.',
        'Your guide taps the map: an area’s passable now.',
      ],
    },
    afterQuest: {
      fr: ['Fait.', 'Ça, c’est réglé.', 'Ton guide acquiesce, bref.', 'Un problème de moins pour aujourd’hui.'],
      en: ['Done.', 'That’s handled.', 'Your guide gives a short nod.', 'One less problem for today.'],
    },
    afterQuestFirst: {
      fr: ['La radio grésille : « J’aurai un run pour toi. Repasse demain. »'],
      en: ['The radio crackles: “I’ll have a run for you. Come back tomorrow.”'],
    },
  },

  previewVideo: null,
};
