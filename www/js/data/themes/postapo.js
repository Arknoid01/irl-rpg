// Thème payant « Post-apo ». Voir ../themes.js pour le contrat.
// Voix : un « guide » qui te parle à la radio (D4). Vocabulaire : secteur,
// run, ferraille, émetteur. Mêmes intentions que nordique.js ; le reste
// retombe sur la voix de nordique.

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

  voice: {
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
          'Jour après jour, tu tiens le secteur. Ça compte, ici — et personne ne te presse.',
          'La série dure. Ton guide le note sur la carte, sans un mot de plus.',
        ],
        en: [
          'Day after day, you hold the sector. That counts out here — and nobody’s pushing you.',
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
      styleLead: {
        fr: (style) => [
          `Ta façon de bouger — « ${style} » — se voit sur le terrain. Ton guide s’y cale.`,
          `On sait comment tu tiens le secteur : ${style}. Voici de quoi nourrir ça.`,
        ],
        en: (style) => [
          `The way you move — “${style}” — shows on the ground. Your guide keeps to it.`,
          `We know how you hold the sector: ${style}. Here’s something to feed that.`,
        ],
      },
      callback: {
        fr: (t) => [
          `Hier, sur les ondes : « ${t} » Ton guide l’a gardé.`,
          `Ce que tu as fait n’est pas perdu : « ${t} »`,
        ],
        en: (t) => [
          `Yesterday, over the air: “${t}” Your guide kept it.`,
          `What you did isn’t lost: “${t}”`,
        ],
      },
    },

    afterQuest: {
      fr: ['Fait.', 'Ça, c’est réglé.', 'Le secteur a bougé, un peu.', 'Ton guide acquiesce, bref.', 'Un problème de moins pour aujourd’hui.'],
      en: ['Done.', 'That’s handled.', 'The sector shifted, a little.', 'Your guide gives a short nod.', 'One less problem for today.'],
    },
    afterQuestFirst: {
      fr: 'La radio grésille : « J’aurai un run pour toi. Repasse demain. »',
      en: 'The radio crackles: “I’ll have a run for you. Come back tomorrow.”',
    },

    memorable: [
      {
        fr: (t) => `Aujourd’hui tu as vraiment fait ça : « ${t} » Aucune mission ne le demandait.`,
        en: (t) => `Today you actually did this: “${t}” No run called for it.`,
      },
      {
        fr: (t) => `À garder pour plus tard : le jour où « ${t.toLowerCase()} » Oui, vraiment.`,
        en: (t) => `Keep it for later: the day when “${t.toLowerCase()}” Yes, really.`,
      },
      {
        fr: (t) => `Bref éclat dans la poussière : « ${t} »`,
        en: (t) => `A brief flash in the dust: “${t}”`,
      },
      {
        fr: (t) => `Petit truc de rien : tu as choisi « ${t} » — et rien n’a explosé. Tant mieux.`,
        en: (t) => `A small nothing: you chose “${t}” — and nothing blew up. Good.`,
      },
      {
        fr: (t) => `Ton guide le note sur la carte : « ${t} » — à relire un soir de doute.`,
        en: (t) => `Your guide marks it on the map: “${t}” — to reread on a doubtful night.`,
      },
    ],

    eventEntry: {
      fr: (title, item) => `Alerte gérée — ${title}. Butin : ${item}.`,
      en: (title, item) => `Alert handled — ${title}. Loot: ${item}.`,
    },
    levelChapter: {
      fr: (level) => `Un cran de plus. Niveau ${level}. Le secteur ne demande rien d’autre.`,
      en: (level) => `One notch further. Level ${level}. The sector asks nothing more.`,
    },
    regionReveal: {
      fr: (label) => `Sur la carte, un secteur s’ouvre : « ${label} » n’est plus une zone morte.`,
      en: (label) => `On the map, a sector opens: “${label}” is no longer a dead zone.`,
    },

    chapters: [
      { label: { fr: 'Prologue', en: 'Prologue' }, blurb: {
        fr: 'Les premiers pas dehors — encore hésitants, déjà vrais.',
        en: 'First steps outside — still hesitant, already real.' } },
      { label: { fr: 'Secteur I', en: 'Sector I' }, blurb: {
        fr: 'Le rythme s’installe. Les rues commencent à répondre.',
        en: 'A rhythm settles in. The streets begin to answer.' } },
      { label: { fr: 'Secteur II', en: 'Sector II' }, blurb: {
        fr: 'Le signal tient. La récup s’accumule au musée.',
        en: 'The signal holds. Salvage gathers in the museum.' } },
      { label: { fr: 'Secteur III', en: 'Sector III' }, blurb: {
        fr: 'Le relief est en vue. La carte n’est plus un pari.',
        en: 'The high ground is in sight. The map is no longer a gamble.' } },
      { label: { fr: 'Secteur IV', en: 'Sector IV' }, blurb: {
        fr: 'Assez de nuits dehors pour connaître le grésillement de la radio.',
        en: 'Enough nights outside to know the radio’s crackle.' } },
      { label: { fr: 'Secteur V', en: 'Sector V' }, blurb: {
        fr: 'Le relais lointain n’est plus qu’une silhouette familière.',
        en: 'The distant relay is now only a familiar silhouette.' } },
    ],
  },

  // Aperçu boutique : place réservée, vidéo à enregistrer plus tard (Yannick).
  previewVideo: null,
};
