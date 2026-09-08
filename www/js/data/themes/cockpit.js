// Thème payant « Poste de pilotage ». Voir ../themes.js pour le contrat.
// Voix : une « IA de bord » à côté de toi (D4). Vocabulaire : cap, console,
// trajectoire, journal de bord. Mêmes intentions que nordique.js ; le reste
// retombe sur la voix de nordique.

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

  voice: {
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
          'Cap tenu depuis plusieurs jours. Ton IA de bord l’a consigné — sans rien exiger de plus.',
          'La série suit sa trajectoire. On garde la même vitesse, à ton rythme.',
        ],
        en: [
          'Heading held for several days. Your onboard AI logged it — asking nothing more.',
          'The streak stays on its trajectory. We keep the same speed, at your pace.',
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
      styleLead: {
        fr: (style) => [
          `Ton style de vol — « ${style} » — est déjà lisible sur la console. Ton IA de bord s’y cale.`,
          `On sait comment tu pilotes : ${style}. Voici de quoi nourrir ça.`,
        ],
        en: (style) => [
          `Your flying style — “${style}” — already reads on the console. Your onboard AI keeps to it.`,
          `We know how you fly: ${style}. Here’s something to feed that.`,
        ],
      },
      callback: {
        fr: (t) => [
          `Au journal de bord, hier : « ${t} » Ton IA de bord ne l’a pas effacé.`,
          `Ce que tu as fait est consigné : « ${t} »`,
        ],
        en: (t) => [
          `In the flight record, yesterday: “${t}” Your onboard AI didn’t wipe it.`,
          `What you did is logged: “${t}”`,
        ],
      },
    },

    afterQuest: {
      fr: ['Objectif atteint.', 'Consigné au journal de bord.', 'Le secteur a bougé, un peu.', 'Ton IA de bord valide.', 'Un cap de plus derrière nous.'],
      en: ['Objective reached.', 'Logged to the flight record.', 'The sector shifted, a little.', 'Your onboard AI confirms.', 'One more heading behind us.'],
    },
    afterQuestFirst: {
      fr: 'Ton IA de bord : « J’aurai un cap pour toi. Reconnecte-toi demain. »',
      en: 'Your onboard AI: “I’ll have a heading for you. Reconnect tomorrow.”',
    },

    memorable: [
      {
        fr: (t) => `Aujourd’hui tu as vraiment fait ça : « ${t} » Aucun objectif ne le demandait.`,
        en: (t) => `Today you actually did this: “${t}” No objective called for it.`,
      },
      {
        fr: (t) => `À consigner : le jour où « ${t.toLowerCase()} » Oui, vraiment.`,
        en: (t) => `To log: the day when “${t.toLowerCase()}” Yes, really.`,
      },
      {
        fr: (t) => `Bref pic sur la console : « ${t} »`,
        en: (t) => `A brief spike on the console: “${t}”`,
      },
      {
        fr: (t) => `Micro-correction de cap : tu as choisi « ${t} » — et rien n’a décroché. Tant mieux.`,
        en: (t) => `A micro heading fix: you chose “${t}” — and nothing stalled. Good.`,
      },
      {
        fr: (t) => `Ton IA de bord marque le journal : « ${t} » — à relire un soir de doute.`,
        en: (t) => `Your onboard AI marks the log: “${t}” — to reread on a doubtful night.`,
      },
    ],

    eventEntry: {
      fr: (title, item) => `Incident consigné — ${title}. Butin : ${item}.`,
      en: (title, item) => `Incident logged — ${title}. Loot: ${item}.`,
    },
    levelChapter: {
      fr: (level) => `Palier de vol franchi. Niveau ${level}. Le journal de bord n’exige rien d’autre.`,
      en: (level) => `Flight threshold cleared. Level ${level}. The flight record asks nothing more.`,
    },
    regionReveal: {
      fr: (label) => `Sur la carte de nav, un point s’éclaire : « ${label} » n’est plus une zone blanche.`,
      en: (label) => `On the nav chart, a point lights: “${label}” is no longer a blank zone.`,
    },

    chapters: [
      { label: { fr: 'Prologue', en: 'Prologue' }, blurb: {
        fr: 'Les premiers caps — encore hésitants, déjà vrais.',
        en: 'The first headings — still hesitant, already real.' } },
      { label: { fr: 'Segment 01', en: 'Segment 01' }, blurb: {
        fr: 'Le rythme s’installe. Les rues commencent à répondre.',
        en: 'A rhythm settles in. The streets begin to answer.' } },
      { label: { fr: 'Segment 02', en: 'Segment 02' }, blurb: {
        fr: 'Les systèmes tiennent. Les modules s’accumulent au musée.',
        en: 'Systems hold. Modules gather in the museum.' } },
      { label: { fr: 'Segment 03', en: 'Segment 03' }, blurb: {
        fr: 'La destination est en vue. La carte n’est plus une projection.',
        en: 'The destination is in sight. The chart is no longer a projection.' } },
      { label: { fr: 'Segment 04', en: 'Segment 04' }, blurb: {
        fr: 'Assez d’heures de vol pour connaître le grain de la console.',
        en: 'Enough flight hours to know the grain of the console.' } },
      { label: { fr: 'Segment 05', en: 'Segment 05' }, blurb: {
        fr: 'La station lointaine n’est plus qu’une silhouette familière.',
        en: 'The distant station is now only a familiar silhouette.' } },
    ],
  },

  // Aperçu boutique : place réservée, vidéo à enregistrer plus tard (Yannick).
  previewVideo: null,
};
