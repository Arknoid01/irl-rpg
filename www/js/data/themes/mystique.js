// Thème payant — Mystique. Voir ../themes.js pour le contrat attendu par un thème.

export default {
  label: { fr: 'Mystique', en: 'Mystic' },
  dot: 'linear-gradient(135deg,#2a1a4a,#b78f3a)',
  companionLines: {
    fr: [
      'La voix des astres se penche sur la carte du ciel. De nouveaux présages se dessinent.',
      'Les constellations ont bougé. Ta guide en lit quelques-unes pour aujourd’hui.',
      'La nuit est claire. Voici ce que les signes proposent d’ici demain.',
    ],
    en: [
      'The voice of the stars leans over the sky chart. New omens take shape.',
      'The constellations have shifted. Your guide reads a few for today.',
      'The night is clear. Here is what the signs suggest by tomorrow.',
    ],
  },
  xpSuffix: { fr: '— le signe est lu', en: '— the sign is read' },

  ui: {
    questsHeading: { fr: 'Présages du jour', en: 'Today’s omens' },
    eventLabel: { fr: 'Signe', en: 'Sign' },
    allDone: {
      fr: 'Tous les présages du jour sont lus 🏆',
      en: 'Every omen today has been read 🏆',
    },
  },

  // Voix du compagnon (cf. engine/companion.js). « Voix des astres », avec toi.
  ctx: {
    emptyDay: {
      fr: [
        'Aucun présage en cours. On peut interroger le ciel quand tu veux.',
        'Le ciel est calme. Un mot, et de nouveaux signes se lèvent.',
      ],
      en: [
        'No omen in play. We can question the sky whenever.',
        'The sky is calm. A word, and new signs rise.',
      ],
    },
    allDone: {
      fr: [
        'Tous les présages du jour sont lus. Le ciel peut tourner en paix.',
        'Plus rien à déchiffrer ce soir. La voix des astres se tait, sereine.',
      ],
      en: [
        'Every omen today has been read. The sky can turn in peace.',
        'Nothing left to read tonight. The voice of the stars falls quiet, calm.',
      ],
    },
    streakHot: {
      fr: [
        'Nuit après nuit, tu réponds aux signes. Les astres s’en souviennent.',
        'La série tient comme une constellation. On avance à ton pas.',
      ],
      en: [
        'Night after night you answer the signs. The stars remember.',
        'The streak holds like a constellation. We move at your pace.',
      ],
    },
    mapFresh: {
      fr: [
        'Une lueur nouvelle sur la carte céleste. Un lieu s’ouvre à toi.',
        'La voix des astres montre le ciel : une région se dessine.',
      ],
      en: [
        'A new glow on the star chart. A place opens to you.',
        'The voice of the stars points to the sky: a region takes shape.',
      ],
    },
    afterQuest: {
      fr: ['Le signe est lu.', 'Voilà qui est accompli.', 'La voix des astres approuve, discrètement.', 'Une ligne de plus dans le ciel.'],
      en: ['The sign is read.', 'That is fulfilled.', 'The voice of the stars quietly approves.', 'One more line drawn in the sky.'],
    },
    afterQuestFirst: {
      fr: ['Une voix venue des astres : « Un signe se prépare pour toi. Reviens demain. »'],
      en: ['A voice from the stars: “A sign is forming for you. Come back tomorrow.”'],
    },
  },

  previewVideo: null,
};
