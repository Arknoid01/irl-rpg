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

  ui: {
    questsHeading: { fr: 'Objectifs du jour', en: 'Today’s objectives' },
    eventLabel: { fr: 'Incident', en: 'Incident' },
    allDone: {
      fr: 'Tous les objectifs du jour sont atteints 🏆',
      en: 'All of today’s objectives met 🏆',
    },
  },

  // Voix du compagnon (cf. engine/companion.js). « IA de bord », avec toi.
  ctx: {
    emptyDay: {
      fr: [
        'Aucun cap défini. On peut en tracer un quand tu veux.',
        'Scanners dégagés. Un mot et de nouvelles trajectoires s’affichent.',
      ],
      en: [
        'No heading set. We can plot one whenever.',
        'Scanners clear. A word and new courses come up.',
      ],
    },
    allDone: {
      fr: [
        'Tous les objectifs du jour sont atteints. Pilote automatique.',
        'Rien d’autre au programme. Ton IA de bord repasse en veille.',
      ],
      en: [
        'All of today’s objectives met. Autopilot on.',
        'Nothing else on the schedule. Your onboard AI returns to standby.',
      ],
    },
    streakHot: {
      fr: [
        'Cap tenu depuis plusieurs jours. Ton IA de bord l’a consigné.',
        'La série suit sa trajectoire. On garde la même vitesse.',
      ],
      en: [
        'Heading held for several days. Your onboard AI logged it.',
        'The streak stays on its trajectory. We keep the same speed.',
      ],
    },
    mapFresh: {
      fr: [
        'Nouveau point sur la carte de nav. Une zone vient de s’ouvrir.',
        'Ton IA de bord surligne le secteur : une région est accessible.',
      ],
      en: [
        'New waypoint on the nav chart. An area just opened.',
        'Your onboard AI highlights the sector: a region’s reachable.',
      ],
    },
    afterQuest: {
      fr: ['Objectif atteint.', 'Consigné au journal de bord.', 'Ton IA de bord valide.', 'Un cap de plus derrière nous.'],
      en: ['Objective reached.', 'Logged to the flight record.', 'Your onboard AI confirms.', 'One more heading behind us.'],
    },
    afterQuestFirst: {
      fr: ['Ton IA de bord : « J’aurai un cap pour toi. Reconnecte-toi demain. »'],
      en: ['Your onboard AI: “I’ll have a heading for you. Reconnect tomorrow.”'],
    },
  },

  previewVideo: null,
};
