// Thème par défaut « Fantasy nordique ». Voir ../themes.js pour le contrat.
// C'est la voix de référence : sombre.js et cyberpunk.js fournissent leur
// propre `voice` (même structure, mêmes intentions — jamais de pression,
// toujours « avec toi »), et retombent sur celle-ci pour ce qu'ils omettent.

export default {
  label: { fr: 'Fantasy nordique', en: 'Nordic fantasy' },
  dot: 'linear-gradient(135deg,#c9a227,#3d6b58)',
  companionLines: {
    fr: [
      'Ton compagnon de route déplie la carte. De nouvelles pistes s’ouvrent, voyageur.',
      'Le vent tourne. Ton compagnon connaît quelques chemins pour aujourd’hui.',
      'Halte un instant. Ton compagnon te propose de quoi remplir la journée.',
    ],
    en: [
      'Your travelling companion unfolds the map. New trails open up, traveller.',
      'The wind turns. Your companion knows a few paths for today.',
      'Pause a moment. Your companion has enough to fill the day.',
    ],
  },
  xpSuffix: { fr: '— expérience', en: '— experience' },

  voice: {
    // Répliques contextuelles de l'écran Aventure (engine/companion.js).
    ctx: {
      allDone: {
        fr: [
          'Les pages du jour sont remplies. Repose-toi — ou feuillette le journal.',
          'Rien d’obligatoire maintenant. Ton compagnon sourit : la journée a suffi.',
        ],
        en: [
          'Today’s pages are full. Rest — or skim the journal.',
          'Nothing required now. Your companion smiles: the day was enough.',
        ],
      },
      streakHot: {
        fr: [
          'Ta série tient comme un feu de camp. Ton compagnon y ajoute une braise — sans pression.',
          'Jour après jour, le grimoire s’épaissit. On continue à ton rythme.',
        ],
        en: [
          'Your streak holds like a campfire. Your companion adds an ember — no pressure.',
          'Day after day the grimoire thickens. We keep your pace.',
        ],
      },
      mapFresh: {
        fr: [
          'La brume se lève quelque part sur la carte. Un lieu s’est ouvert pour toi.',
          'Ton compagnon pointe le plateau : une région vient de se révéler.',
        ],
        en: [
          'Fog lifts somewhere on the map. A place has opened for you.',
          'Your companion points at the board: a region just revealed itself.',
        ],
      },
      emptyDay: {
        fr: [
          'La page est encore blanche. On peut tirer une journée quand tu veux.',
          'Pas de quêtes pour l’instant — le compagnon attend ton signal.',
        ],
        en: [
          'The page is still blank. We can draw a day whenever you like.',
          'No quests yet — your companion waits for your cue.',
        ],
      },
      styleLead: {
        fr: (style) => [
          `Ton style — « ${style} » — colore déjà la journée. Ton compagnon s’adapte.`,
          `On voit bien qui tu es en chemin : ${style}. Voici de quoi nourrir ça.`,
        ],
        en: (style) => [
          `Your style — “${style}” — already colours the day. Your companion adapts.`,
          `It’s clear who you are on the road: ${style}. Here’s something to feed that.`,
        ],
      },
      // Le compagnon se souvient d'un fragment précis (axe différenciation D11).
      callback: {
        fr: (t) => [
          `Hier : « ${t} » Ton compagnon s’en souvient encore.`,
          `Ce que tu as fait n’est pas oublié : « ${t} »`,
        ],
        en: (t) => [
          `Yesterday: “${t}” Your companion still remembers it.`,
          `What you did isn’t forgotten: “${t}”`,
        ],
      },
    },

    // Réaction courte après une quête accomplie (cérémonie de validation).
    afterQuest: {
      fr: [
        'Pas mal.',
        'Voilà qui est fait.',
        'Le monde a bougé, un peu.',
        'Ton compagnon hoche la tête.',
        'Une page de plus dans le grimoire.',
      ],
      en: [
        'Not bad.',
        'Well, that’s done.',
        'The world shifted, a little.',
        'Your companion nods.',
        'One more page in the grimoire.',
      ],
    },
    afterQuestFirst: {
      fr: 'Ton compagnon sourit : « J’ai quelque chose pour toi. Reviens demain. »',
      en: 'Your companion smiles: “I’ll have something for you. Come back tomorrow.”',
    },

    // Journal — « moments mémorables » (engine/journal.js). fr et en appariés.
    memorable: [
      {
        fr: (t) => `Aujourd'hui tu as vraiment fait ça : « ${t} » Personne ne te l'avait demandé.`,
        en: (t) => `Today you actually did this: “${t}” Nobody asked you to.`,
      },
      {
        fr: (t) => `Note pour plus tard : le jour où « ${t.toLowerCase()} » Oui, vraiment.`,
        en: (t) => `Note for later: the day when “${t.toLowerCase()}” Yes, really.`,
      },
      {
        fr: (t) => `Petit moment ridicule et parfait : « ${t} »`,
        en: (t) => `A small, ridiculous, perfect moment: “${t}”`,
      },
      {
        fr: (t) => `Chapitre minuscule : tu as choisi « ${t} » — et le monde n’a pas basculé. Tant mieux.`,
        en: (t) => `Tiny chapter: you chose “${t}” — and the world didn’t tip. Good.`,
      },
      {
        fr: (t) => `Ton compagnon note en marge : « ${t} » — à relire un soir de doute.`,
        en: (t) => `Your companion notes in the margin: “${t}” — to reread on a doubtful night.`,
      },
    ],

    // Entrées de journal générées par le moteur.
    eventEntry: {
      fr: (title, item) => `Événement relevé — ${title}. Butin : ${item}.`,
      en: (title, item) => `Event taken on — ${title}. Loot: ${item}.`,
    },
    levelChapter: {
      fr: (level) => `Une page se tourne. Niveau ${level}. Le grimoire s’épaissit — sans rien exiger de plus.`,
      en: (level) => `A page turns. Level ${level}. The grimoire thickens — asking nothing more.`,
    },
    regionReveal: {
      fr: (label) => `Sur la carte, la brume se lève : « ${label} » n’est plus un blanc.`,
      en: (label) => `On the map, the fog lifts: “${label}” is no longer a blank.`,
    },

    // Chapitres narratifs, dans l'ordre des paliers (prologue → ch5).
    // engine/journal.js garde les seuils de niveau et les identifiants stables.
    chapters: [
      {
        label: { fr: 'Prologue', en: 'Prologue' },
        blurb: {
          fr: 'Les premiers pas — encore hésitants, déjà vrais.',
          en: 'First steps — still hesitant, already real.',
        },
      },
      {
        label: { fr: 'Chapitre I', en: 'Chapter I' },
        blurb: {
          fr: 'Le rythme s’installe. Les rues commencent à répondre.',
          en: 'A rhythm settles in. The streets begin to answer.',
        },
      },
      {
        label: { fr: 'Chapitre II', en: 'Chapter II' },
        blurb: {
          fr: 'Le feu tient. Les souvenirs s’accumulent dans le musée.',
          en: 'The fire holds. Souvenirs gather in the museum.',
        },
      },
      {
        label: { fr: 'Chapitre III', en: 'Chapter III' },
        blurb: {
          fr: 'La crête est en vue. La carte n’est plus un rêve.',
          en: 'The ridge is in sight. The map is no longer a dream.',
        },
      },
      {
        label: { fr: 'Chapitre IV', en: 'Chapter IV' },
        blurb: {
          fr: 'Assez de veilles pour sentir la cire du grimoire.',
          en: 'Enough watches to smell the grimoire’s wax.',
        },
      },
      {
        label: { fr: 'Chapitre V', en: 'Chapter V' },
        blurb: {
          fr: 'Le château lointain n’est plus qu’une silhouette familière.',
          en: 'The distant castle is now only a familiar silhouette.',
        },
      },
    ],
  },
};
