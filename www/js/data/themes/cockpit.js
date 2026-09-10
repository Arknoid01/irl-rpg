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
    levelUpLine: {
      fr: 'Palier franchi. Ton IA de bord recalibre les instruments.',
      en: 'Threshold cleared. Your onboard AI recalibrates the instruments.',
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
      comeback: {
        fr: [
          'Quelques jours hors connexion. Le journal de bord est resté à ta dernière entrée — rien à resynchroniser, on trace un cap quand tu veux.',
          'Te revoilà aux commandes. Les systèmes ont tenu en veille ; ils attendaient juste ta reconnexion, sans précipitation.',
        ],
        en: [
          'A few days disconnected. The flight record stayed at your last entry — nothing to resync, we plot a heading whenever you like.',
          'There you are, back at the controls. Systems held on standby; they were just waiting for you to reconnect, no rush.',
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

    milestones: {
      first_quest: {
        fr: 'Première entrée consignée de ta main au journal de bord. Ton IA de bord la relit une fois.',
        en: 'First entry logged in your own hand in the flight record. Your onboard AI reads it back once.',
      },
      first_outdoor: {
        fr: 'Tu es sorti pour de vrai. Ce qui se fait hors du poste compte double au journal.',
        en: 'You actually went out. What’s done away from the console counts double in the record.',
      },
      first_social: {
        fr: 'Un échange avec quelqu’un. Ton IA de bord le consigne : un contact, ça se note.',
        en: 'An exchange with someone. Your onboard AI logs it: a contact is worth recording.',
      },
      first_evening: {
        fr: 'Un objectif atteint de nuit. C’est quand les scanners se calment que la trajectoire se lit le mieux.',
        en: 'An objective met at night. It’s when the scanners quiet down that the trajectory reads best.',
      },
      first_hidden: {
        fr: 'Tu as suivi un cap sans en connaître la destination. C’est comme ça qu’on trouve les bonnes routes.',
        en: 'You held a heading without knowing the destination. That’s how the good routes are found.',
      },
      first_bold: {
        fr: 'Celui-là demandait du sang-froid. Tu l’as pris quand même — c’est au journal.',
        en: 'That one took a steady hand. You took it anyway — it’s in the record.',
      },
      first_big: {
        fr: 'Un objectif lourd à mener. Tu es allé au bout de la trajectoire.',
        en: 'A heavy objective to run. You flew the trajectory to the end.',
      },
      first_event: {
        fr: 'Ton premier incident hors plan de vol. Ça n’apparaît jamais au programme — c’est ce qui compte.',
        en: 'Your first incident off the flight plan. It never shows on the schedule — that’s what matters.',
      },
      volume: {
        fr: (n) => `${n} objectifs derrière nous. Le journal de bord se remplit — et toi, tu as une trajectoire.`,
        en: (n) => `${n} objectives behind us. The flight record fills up — and you have a trajectory.`,
      },
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

    chapterLean: {
      fr: {
        social: 'Ta trajectoire passe surtout par les gens — un échange, un contact, une présence.',
        exploration: 'Ta trajectoire quitte souvent les routes connues.',
        curiosite: 'Ta trajectoire est faite de choses observées de plus près.',
        creation: 'Ta trajectoire laisse des choses assemblées de tes mains.',
        quotidien: 'Ta trajectoire change la routine en petites victoires.',
        chaos: 'Ta trajectoire aime les règles absurdes et les écarts volontaires.',
      },
      en: {
        social: 'Your trajectory runs mostly through people — an exchange, a contact, a presence.',
        exploration: 'Your trajectory keeps leaving the known routes.',
        curiosite: 'Your trajectory is made of things observed more closely.',
        creation: 'Your trajectory leaves things assembled by your hands.',
        quotidien: 'Your trajectory turns routine into small wins.',
        chaos: 'Your trajectory loves absurd rules and deliberate deviations.',
      },
    },
    dayTitles: {
      fr: ['Le journal du jour', 'Les écarts de cap', 'Un segment de plus', 'L’entrée d’aujourd’hui', 'Ce que le jour a renvoyé'],
      en: ['The day’s log', 'Heading drift', 'One more segment', 'Today’s entry', 'What the day returned'],
    },
    dayEntry: {
      fr: (n, t, tags) => `Jour ${n} — « ${t} ». Au journal de bord : ${tags}. Consigné.`,
      en: (n, t, tags) => `Day ${n} — “${t}”. In the flight record: ${tags}. Logged.`,
    },
    arc: {
      clue: {
        fr: (t) => `Un relevé se précise sur la console : « ${t} »`,
        en: (t) => `A reading sharpens on the console: “${t}”`,
      },
      reveal: {
        fr: (t) => `Le cap aboutit. « ${t} »`,
        en: (t) => `The heading arrives. “${t}”`,
      },
      inProgress: {
        fr: [
          'Un cap te suit depuis quelques jours — ton IA de bord le garde en mémoire.',
          'Le journal de bord a une entrée incomplète ; elle attend la suite.',
        ],
        en: [
          'A heading has followed you for days — your onboard AI keeps it in memory.',
          'The flight record has an incomplete entry; it waits for what comes next.',
        ],
      },
    },
  },
};
