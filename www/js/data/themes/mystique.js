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

  previewVideo: null,
};
