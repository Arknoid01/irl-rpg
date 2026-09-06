// Thème payant — Enquête. Voir ../themes.js pour le contrat attendu par un thème.

export default {
  label: { fr: 'Enquête', en: 'The case' },
  dot: 'linear-gradient(135deg,#1f3a5f,#b23b3b)',
  companionLines: {
    fr: [
      'Ton coéquipier étale le dossier. Quelques pistes à suivre aujourd’hui.',
      'Café tiède, tableau de liège. Ton coéquipier a noté deux ou trois choses.',
      'Rien d’urgent. Ton coéquipier te propose de quoi avancer sur l’affaire.',
    ],
    en: [
      'Your partner lays out the file. A few leads to follow today.',
      'Lukewarm coffee, corkboard. Your partner jotted down two or three things.',
      'Nothing urgent. Your partner has enough to move the case forward.',
    ],
  },
  xpSuffix: { fr: '— versé au dossier', en: '— filed to the case' },

  ui: {
    questsHeading: { fr: 'Pistes du jour', en: 'Today’s leads' },
    eventLabel: { fr: 'Développement', en: 'Development' },
    allDone: {
      fr: 'Toutes les pistes du jour sont suivies 🏆',
      en: 'Every lead today has been followed 🏆',
    },
  },

  // Voix du compagnon (cf. engine/companion.js). « Coéquipier », à côté de toi.
  ctx: {
    emptyDay: {
      fr: [
        'Aucune piste ouverte. On peut relancer le dossier quand tu veux.',
        'Bureau calme. Un mot et de nouvelles pistes atterrissent.',
      ],
      en: [
        'No lead open. We can reopen the file whenever.',
        'Quiet office. One word and new leads land.',
      ],
    },
    allDone: {
      fr: [
        'Toutes les pistes du jour ont été suivies. Le dossier peut reposer.',
        'Rien à creuser ce soir. Ton coéquipier referme la chemise.',
      ],
      en: [
        'Every lead today has been followed. The file can rest.',
        'Nothing to dig tonight. Your partner closes the folder.',
      ],
    },
    streakHot: {
      fr: [
        'Jour après jour, tu tiens le fil. Ton coéquipier le remarque.',
        'La série avance comme une enquête bien menée. On continue.',
      ],
      en: [
        'Day after day, you keep the thread. Your partner notices.',
        'The streak moves like a case run right. We carry on.',
      ],
    },
    mapFresh: {
      fr: [
        'Un lieu du plan vient de s’éclairer. Quelqu’un t’y attend peut-être.',
        'Ton coéquipier pointe la carte : une zone se précise.',
      ],
      en: [
        'A spot on the map just lit up. Someone might be waiting there.',
        'Your partner taps the map: an area sharpens.',
      ],
    },
    afterQuest: {
      fr: ['Noté.', 'Versé au dossier.', 'Ton coéquipier coche la ligne.', 'Une piste de moins à traiter.'],
      en: ['Noted.', 'Filed to the case.', 'Your partner ticks the line.', 'One less lead to chase.'],
    },
    afterQuestFirst: {
      fr: ['Ton coéquipier pose une tasse : « J’aurai une piste pour toi. Repasse demain. »'],
      en: ['Your partner sets down a mug: “I’ll have a lead for you. Come by tomorrow.”'],
    },
  },

  // Aperçu boutique : voir le commentaire dans cyberpunk.js.
  previewVideo: null,
};
