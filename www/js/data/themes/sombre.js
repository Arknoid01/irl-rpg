// Thème « Dark fantasy ». Voir ../themes.js pour le contrat attendu par un thème.

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

  // Mots de saveur (cf. ui/themeText.js). Habillage uniquement.
  ui: {
    questsHeading: { fr: 'Contrats du jour', en: 'Today’s contracts' },
    eventLabel: { fr: 'Incident', en: 'Incident' },
    allDone: {
      fr: 'Tous les contrats du jour sont remplis 🏆',
      en: 'All of today’s contracts are fulfilled 🏆',
    },
  },

  // Voix du compagnon (cf. engine/companion.js). Seaux non redéfinis =
  // voix par défaut. « Présence / voix », jamais un maître du jeu (D4).
  ctx: {
    emptyDay: {
      fr: [
        'Aucun contrat en cours. On peut en ouvrir quand tu veux.',
        'La table est nette. Dis un mot et de nouvelles affaires arrivent.',
      ],
      en: [
        'No contract in play. We can open some whenever you want.',
        'The table is clear. Say the word and new jobs come in.',
      ],
    },
    allDone: {
      fr: [
        'Les contrats du jour sont honorés. La nuit peut suivre son cours.',
        'Plus rien à régler ce soir. La présence à tes côtés s’apaise.',
      ],
      en: [
        'Today’s contracts are settled. The night can run its course.',
        'Nothing left to handle tonight. The presence at your side goes quiet.',
      ],
    },
    streakHot: {
      fr: [
        'Jour après jour, ta parole tient. Ça se sait, sur ces routes.',
        'La série dure. La présence le note, sans rien te réclamer.',
      ],
      en: [
        'Day after day, your word holds. Word travels, on these roads.',
        'The streak holds. The presence notes it, and asks nothing of you.',
      ],
    },
    mapFresh: {
      fr: [
        'Une porte s’est descellée quelque part sur la carte des terres.',
        'La présence tend le doigt : une région sort de l’ombre.',
      ],
      en: [
        'A door has come unsealed somewhere on the map of the lands.',
        'The presence points: a region steps out of the dark.',
      ],
    },
    afterQuest: {
      fr: ['Réglé.', 'Le contrat est clos.', 'La présence acquiesce, en silence.', 'Une dette de moins envers le jour.'],
      en: ['Settled.', 'The contract is closed.', 'The presence nods, silent.', 'One less debt to the day.'],
    },
    afterQuestFirst: {
      fr: ['Une voix, tout près : « J’aurai une affaire pour toi. Reviens demain. »'],
      en: ['A voice, close by: “I’ll have a job for you. Come back tomorrow.”'],
    },
  },

  // Aperçu boutique : voir le commentaire dans cyberpunk.js.
  previewVideo: null,
};
