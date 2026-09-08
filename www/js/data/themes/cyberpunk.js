// Thème payant « Néon nocturne ». Voir ../themes.js pour le contrat.
// `voice` : même structure et mêmes intentions que nordique.js (jamais de
// pression, toujours « avec toi ») — seul le vocabulaire change : signal,
// secteur, données, la Grille, la ville qui ne dort pas, un compagnon qui
// scanne. Ce qui n'est pas redéfini ici retombe sur la voix de nordique.

export default {
  label: { fr: 'Néon nocturne', en: 'Night neon' },
  dot: 'linear-gradient(135deg,#ff2e9a,#00e5ff)',
  companionLines: {
    fr: [
      'Ton compagnon scanne la ville. Nouvelles pistes détectées.',
      'Signal reçu. Ton compagnon a repéré des opportunités dans le secteur.',
      'Le réseau est calme. Ton compagnon te propose deux ou trois choses.',
    ],
    en: [
      'Your companion scans the city. New leads detected.',
      'Signal received. Your companion picked up opportunities in the sector.',
      'The network is quiet. Your companion has two or three things for you.',
    ],
  },
  xpSuffix: { fr: '— données', en: '— data' },

  ui: {
    questsHeading: { fr: 'Missions du jour', en: 'Today’s missions' },
    eventLabel: { fr: 'Incident', en: 'Incident' },
    allDone: {
      fr: 'Toutes les missions du jour sont bouclées 🏆',
      en: 'Every mission today is closed 🏆',
    },
  },

  voice: {
    ctx: {
      allDone: {
        fr: [
          'Les pistes du jour sont traitées. Coupe le flux — ou relis le log.',
          'Plus rien de requis maintenant. Ton compagnon relâche : la journée a suffi.',
        ],
        en: [
          'Today’s leads are handled. Cut the feed — or reread the log.',
          'Nothing required now. Your companion stands down: the day was enough.',
        ],
      },
      streakHot: {
        fr: [
          'Ta série tient comme une diode qui refuse de s’éteindre. Ton compagnon la surveille — sans pression.',
          'Jour après jour, le log s’allonge. On continue à ton rythme.',
        ],
        en: [
          'Your streak holds like a diode that won’t go dark. Your companion watches it — no pressure.',
          'Day after day the log grows longer. We keep your pace.',
        ],
      },
      mapFresh: {
        fr: [
          'Un secteur passe au vert sur la carte. Un lieu s’est ouvert pour toi.',
          'Ton compagnon pointe le plan : une zone vient d’apparaître au scan.',
        ],
        en: [
          'A sector goes green on the map. A place has opened for you.',
          'Your companion points at the grid: an area just showed up on the scan.',
        ],
      },
      emptyDay: {
        fr: [
          'Le flux est encore vide. On peut tirer une journée quand tu veux.',
          'Aucune piste pour l’instant — ton compagnon attend ton signal.',
        ],
        en: [
          'The feed is still empty. We can draw a day whenever you like.',
          'No leads yet — your companion waits for your cue.',
        ],
      },
      styleLead: {
        fr: (style) => [
          `Ta signature — « ${style} » — colore déjà le flux. Ton compagnon s’y cale.`,
          `On lit bien qui tu es entre deux néons : ${style}. Voici de quoi nourrir ça.`,
        ],
        en: (style) => [
          `Your signature — “${style}” — already colours the feed. Your companion locks onto it.`,
          `We read who you are between two neon signs: ${style}. Here’s something to feed that.`,
        ],
      },
      callback: {
        fr: (t) => [
          `Hier : « ${t} » Ton compagnon l’a gardé en cache.`,
          `Ce que tu as fait n’est pas effacé : « ${t} »`,
        ],
        en: (t) => [
          `Yesterday: “${t}” Your companion kept it cached.`,
          `What you did isn’t wiped: “${t}”`,
        ],
      },
    },

    afterQuest: {
      fr: [
        'Validé.',
        'Voilà, c’est loggé.',
        'Le secteur a bougé, un peu.',
        'Ton compagnon accuse réception.',
        'Une ligne de plus au log.',
      ],
      en: [
        'Confirmed.',
        'There, it’s logged.',
        'The sector shifted, a little.',
        'Your companion acknowledges.',
        'One more line in the log.',
      ],
    },
    afterQuestFirst: {
      fr: 'Ton compagnon envoie un ping : « J’aurai quelque chose pour toi. Repasse demain. »',
      en: 'Your companion sends a ping: “I’ll have something for you. Come back tomorrow.”',
    },

    memorable: [
      {
        fr: (t) => `Aujourd’hui tu as vraiment fait ça : « ${t} » Aucune piste ne le demandait.`,
        en: (t) => `Today you actually did this: “${t}” No lead asked for it.`,
      },
      {
        fr: (t) => `À garder en cache : le jour où « ${t.toLowerCase()} » Oui, vraiment.`,
        en: (t) => `Keep it cached: the day when “${t.toLowerCase()}” Yes, really.`,
      },
      {
        fr: (t) => `Bref pic de signal : « ${t} »`,
        en: (t) => `A brief signal spike: “${t}”`,
      },
      {
        fr: (t) => `Micro-commit : tu as choisi « ${t} » — et rien n’a planté. Tant mieux.`,
        en: (t) => `A micro-commit: you chose “${t}” — and nothing crashed. Good.`,
      },
      {
        fr: (t) => `Ton compagnon épingle une note : « ${t} » — à relire un soir de doute.`,
        en: (t) => `Your companion pins a note: “${t}” — to reread on a doubtful night.`,
      },
    ],

    eventEntry: {
      fr: (title, item) => `Incident traité — ${title}. Butin : ${item}.`,
      en: (title, item) => `Incident handled — ${title}. Loot: ${item}.`,
    },
    levelChapter: {
      fr: (level) => `Palier franchi. Niveau ${level}. Le log s’étoffe — sans rien exiger de plus.`,
      en: (level) => `Threshold cleared. Level ${level}. The log fills out — asking nothing more.`,
    },
    regionReveal: {
      fr: (label) => `Sur le plan, un secteur s’éclaire : « ${label} » n’est plus une zone blanche.`,
      en: (label) => `On the grid, a sector lights up: “${label}” is no longer a blank zone.`,
    },

    chapters: [
      {
        label: { fr: 'Prologue', en: 'Prologue' },
        blurb: {
          fr: 'Les premiers pas dans la ville — encore hésitants, déjà vrais.',
          en: 'First steps into the city — still hesitant, already real.',
        },
      },
      {
        label: { fr: 'Séquence 01', en: 'Sequence 01' },
        blurb: {
          fr: 'Le rythme s’installe. Les rues commencent à répondre.',
          en: 'A rhythm settles in. The streets begin to answer.',
        },
      },
      {
        label: { fr: 'Séquence 02', en: 'Sequence 02' },
        blurb: {
          fr: 'Le signal tient. Les artefacts s’accumulent au musée.',
          en: 'The signal holds. Artifacts gather in the museum.',
        },
      },
      {
        label: { fr: 'Séquence 03', en: 'Sequence 03' },
        blurb: {
          fr: 'Les tours hautes sont en vue. Le plan n’est plus une projection.',
          en: 'The high towers are in sight. The grid is no longer a projection.',
        },
      },
      {
        label: { fr: 'Séquence 04', en: 'Sequence 04' },
        blurb: {
          fr: 'Assez de nuits éveillées pour connaître le grain du réseau.',
          en: 'Enough waking nights to know the grain of the network.',
        },
      },
      {
        label: { fr: 'Séquence 05', en: 'Sequence 05' },
        blurb: {
          fr: 'La tour lointaine n’est plus qu’une silhouette familière.',
          en: 'The distant tower is now only a familiar silhouette.',
        },
      },
    ],
  },

  // Aperçu boutique (ui/shop.js) : mettre './assets/videos/cyberpunk-preview.mp4'
  // (chemin depuis www/, comme les <link> d'index.html) une fois le fichier
  // ajouté — vidéo courte en boucle, sans son (l'attribut muted est de toute
  // façon obligatoire pour l'autoplay mobile). Tant que c'est null, la
  // boutique retombe sur l'aperçu live en CSS.
  previewVideo: './assets/videos/cyberpunk-preview.mp4',
};
