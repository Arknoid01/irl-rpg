// Thème payant — Poste de pilotage. Voir ../themes.js pour le contrat d'un thème.

export default {
  label: { fr: 'Poste de pilotage', en: 'Cockpit' },
  dot: 'linear-gradient(135deg,#2c7fb8,#c58a2e)',
  companionLines: {
    fr: [
      'Ton IA de bord met à jour la console. Nouvelles trajectoires disponibles.',
      'Systèmes stables. Ton IA de bord a tracé deux ou trois options.',
      'Espace calme sur les scanners. Voici le programme jusqu’à demain.',
    ],
    en: [
      'Your onboard AI updates the console. New headings available.',
      'Systems stable. Your onboard AI plotted two or three options.',
      'Scanners quiet. Here is the plan until tomorrow.',
    ],
  },
  xpSuffix: { fr: '— consigné au journal de bord', en: '— logged to the flight record' },

  previewVideo: null,
};
