// Thème payant « Dark fantasy ». Voir ../themes.js pour le contrat.
// `voice` : même structure et mêmes intentions que nordique.js (jamais de
// pression, toujours « avec toi ») — seul le vocabulaire de saveur change :
// veille, contrat, cendre, forge, la Longue Nuit, la cité endormie. Ce qui
// n'est pas redéfini ici retombe sur la voix de nordique.

export default {
  label: { fr: 'Dark fantasy', en: 'Dark fantasy' },
  dot: 'linear-gradient(135deg,#7a1f1f,#b8bcc2)',
  companionLines: {
    fr: [
      'Une présence discrète t’accompagne. De nouveaux contrats sont à prendre.',
      'Le silence pèse. Ta compagne de route a entendu parler de quelques affaires.',
      'La nuit sera longue. Voici ce qu’on peut faire d’ici demain.',
    ],
    en: [
      'A quiet presence walks with you. New contracts are on offer.',
      'The silence weighs. Your companion has heard of a few jobs.',
      'The night will be long. Here is what can be done by tomorrow.',
    ],
  },
  xpSuffix: { fr: '— le contrat est rempli', en: '— the contract is fulfilled' },

  ui: {
    questsHeading: { fr: 'Contrats du jour', en: 'Today’s contracts' },
    eventLabel: { fr: 'Affaire', en: 'Matter' },
    allDone: {
      fr: 'Tous les contrats du jour sont honorés 🏆',
      en: 'Every contract today is settled 🏆',
    },
  },

  voice: {
    ctx: {
      allDone: {
        fr: [
          'Les contrats du jour sont honorés. Repose-toi — ou relis le registre.',
          'Plus rien d’exigé cette nuit. Ta compagne baisse la garde : la journée a suffi.',
        ],
        en: [
          'Today’s contracts are settled. Rest — or reread the ledger.',
          'Nothing more demanded tonight. Your companion lowers her guard: the day was enough.',
        ],
      },
      streakHot: {
        fr: [
          'Ta série tient comme une braise sous la cendre. Ta compagne la couve — sans pression.',
          'Nuit après nuit, le registre s’alourdit. On continue à ton rythme.',
        ],
        en: [
          'Your streak holds like an ember under ash. Your companion tends it — no pressure.',
          'Night after night the ledger grows heavier. We keep your pace.',
        ],
      },
      mapFresh: {
        fr: [
          'Une torche s’allume quelque part sur la carte. Un lieu s’est ouvert pour toi.',
          'Ta compagne montre le plan : un quartier vient de sortir de l’ombre.',
        ],
        en: [
          'A torch lights somewhere on the map. A place has opened for you.',
          'Your companion points at the plan: a district just stepped out of the dark.',
        ],
      },
      emptyDay: {
        fr: [
          'Le registre est encore vierge. On peut tirer une journée quand tu veux.',
          'Aucun contrat pour l’instant — ta compagne attend ton signe.',
        ],
        en: [
          'The ledger is still blank. We can draw a day whenever you like.',
          'No contracts yet — your companion waits for your sign.',
        ],
      },
      styleLead: {
        fr: (style) => [
          `Ta manière — « ${style} » — marque déjà la nuit. Ta compagne s’y accorde.`,
          `On sait qui tu es entre deux réverbères : ${style}. Voici de quoi nourrir ça.`,
        ],
        en: (style) => [
          `Your way — “${style}” — already marks the night. Your companion falls in with it.`,
          `We know who you are between two lamps: ${style}. Here’s something to feed that.`,
        ],
      },
      callback: {
        fr: (t) => [
          `Hier : « ${t} » Ta compagne ne l’a pas oublié.`,
          `Ce que tu as fait est consigné : « ${t} »`,
        ],
        en: (t) => [
          `Yesterday: “${t}” Your companion hasn’t forgotten it.`,
          `What you did is on record: “${t}”`,
        ],
      },
    },

    afterQuest: {
      fr: [
        'C’est réglé.',
        'Le contrat est clos.',
        'La nuit a bougé, un peu.',
        'Ta compagne acquiesce en silence.',
        'Une ligne de plus au registre.',
      ],
      en: [
        'It’s settled.',
        'The contract is closed.',
        'The night shifted, a little.',
        'Your companion nods in silence.',
        'One more line in the ledger.',
      ],
    },
    afterQuestFirst: {
      fr: 'Ta compagne esquisse un sourire : « J’aurai quelque chose pour toi. Reviens demain. »',
      en: 'Your companion half-smiles: “I’ll have something for you. Come back tomorrow.”',
    },

    memorable: [
      {
        fr: (t) => `Cette nuit tu as vraiment fait ça : « ${t} » Aucun contrat ne l’exigeait.`,
        en: (t) => `Tonight you actually did this: “${t}” No contract asked for it.`,
      },
      {
        fr: (t) => `À consigner : la nuit où « ${t.toLowerCase()} » Oui, vraiment.`,
        en: (t) => `To record: the night when “${t.toLowerCase()}” Yes, really.`,
      },
      {
        fr: (t) => `Bref éclat dans le noir : « ${t} »`,
        en: (t) => `A brief flare in the dark: “${t}”`,
      },
      {
        fr: (t) => `Pierre minuscule à l’édifice : tu as choisi « ${t} » — et rien ne s’est effondré. Tant mieux.`,
        en: (t) => `A tiny stone in the wall: you chose “${t}” — and nothing collapsed. Good.`,
      },
      {
        fr: (t) => `Ta compagne note en marge : « ${t} » — à relire une nuit de doute.`,
        en: (t) => `Your companion notes in the margin: “${t}” — to reread on a doubtful night.`,
      },
    ],

    eventEntry: {
      fr: (title, item) => `Affaire réglée — ${title}. Butin : ${item}.`,
      en: (title, item) => `Matter dealt with — ${title}. Loot: ${item}.`,
    },
    levelChapter: {
      fr: (level) => `Un cran de plus. Niveau ${level}. Le registre s’alourdit — sans rien réclamer d’autre.`,
      en: (level) => `One notch further. Level ${level}. The ledger grows heavier — claiming nothing more.`,
    },
    regionReveal: {
      fr: (label) => `Sur le plan, une lanterne s’allume : « ${label} » n’est plus une zone morte.`,
      en: (label) => `On the plan, a lantern lights: “${label}” is no longer a dead zone.`,
    },

    chapters: [
      {
        label: { fr: 'Prologue', en: 'Prologue' },
        blurb: {
          fr: 'Les premiers pas dans le noir — encore hésitants, déjà vrais.',
          en: 'First steps in the dark — still hesitant, already real.',
        },
      },
      {
        label: { fr: 'Veille I', en: 'Watch I' },
        blurb: {
          fr: 'Le rythme s’installe. Les ruelles commencent à répondre.',
          en: 'A rhythm settles in. The alleys begin to answer.',
        },
      },
      {
        label: { fr: 'Veille II', en: 'Watch II' },
        blurb: {
          fr: 'La braise tient. Les reliques s’accumulent au musée.',
          en: 'The ember holds. Relics gather in the museum.',
        },
      },
      {
        label: { fr: 'Veille III', en: 'Watch III' },
        blurb: {
          fr: 'Les remparts sont en vue. Le plan n’est plus un pari.',
          en: 'The ramparts are in sight. The plan is no longer a gamble.',
        },
      },
      {
        label: { fr: 'Veille IV', en: 'Watch IV' },
        blurb: {
          fr: 'Assez de nuits blanches pour sentir la cire du registre.',
          en: 'Enough sleepless nights to smell the ledger’s wax.',
        },
      },
      {
        label: { fr: 'Veille V', en: 'Watch V' },
        blurb: {
          fr: 'La citadelle lointaine n’est plus qu’une silhouette familière.',
          en: 'The distant citadel is now only a familiar silhouette.',
        },
      },
    ],
  },

  // Aperçu boutique (ui/shop.js) : place réservée pour une vidéo d'aperçu, à
  // enregistrer sur appareil plus tard (Yannick). Mettre alors le chemin
  // './assets/videos/sombre-preview.mp4' (depuis www/, comme les <link>
  // d'index.html) — vidéo courte en boucle, sans son. Tant que c'est null, la
  // boutique retombe sur l'aperçu live en CSS (déjà complet pour ce thème).
  previewVideo: null,
};
