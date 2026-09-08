// Thème payant « Mystique ». Voir ../themes.js pour le contrat.
// Voix : « la voix des astres », une guide qui lit les signes avec toi (D4).
// Vocabulaire : présage, signe, carte céleste, constellation, maison. Mêmes
// intentions que nordique.js ; le reste retombe sur la voix de nordique.

export default {
  label: { fr: 'Mystique', en: 'Mystic' },
  dot: 'linear-gradient(135deg,#2a1a4a,#b78f3a)',
  companionLines: {
    fr: [
      'La voix des astres se penche sur la carte du ciel. De nouveaux présages se dessinent.',
      'Les constellations ont bougé. Ta guide en lit quelques-unes pour aujourd’hui.',
      'La nuit est claire. Voici ce que les signes proposent d’ici demain.',
    ],
    en: [
      'The voice of the stars leans over the sky chart. New omens take shape.',
      'The constellations have shifted. Your guide reads a few for today.',
      'The night is clear. Here is what the signs suggest by tomorrow.',
    ],
  },
  xpSuffix: { fr: '— le signe est lu', en: '— the sign is read' },

  ui: {
    questsHeading: { fr: 'Présages du jour', en: 'Today’s omens' },
    eventLabel: { fr: 'Signe', en: 'Sign' },
    allDone: {
      fr: 'Tous les présages du jour sont lus 🏆',
      en: 'Every omen today has been read 🏆',
    },
  },

  voice: {
    ctx: {
      emptyDay: {
        fr: [
          'Aucun présage en cours. On peut interroger le ciel quand tu veux.',
          'Le ciel est calme. Un mot, et de nouveaux signes se lèvent.',
        ],
        en: [
          'No omen in play. We can question the sky whenever.',
          'The sky is calm. A word, and new signs rise.',
        ],
      },
      allDone: {
        fr: [
          'Tous les présages du jour sont lus. Le ciel peut tourner en paix.',
          'Plus rien à déchiffrer ce soir. La voix des astres se tait, sereine.',
        ],
        en: [
          'Every omen today has been read. The sky can turn in peace.',
          'Nothing left to read tonight. The voice of the stars falls quiet, calm.',
        ],
      },
      streakHot: {
        fr: [
          'Nuit après nuit, tu réponds aux signes. Les astres s’en souviennent — sans rien exiger.',
          'La série tient comme une constellation. On avance à ton pas.',
        ],
        en: [
          'Night after night you answer the signs. The stars remember — asking nothing.',
          'The streak holds like a constellation. We move at your pace.',
        ],
      },
      mapFresh: {
        fr: [
          'Une lueur nouvelle sur la carte céleste. Un lieu s’ouvre à toi.',
          'La voix des astres montre le ciel : une région se dessine.',
        ],
        en: [
          'A new glow on the star chart. A place opens to you.',
          'The voice of the stars points to the sky: a region takes shape.',
        ],
      },
      styleLead: {
        fr: (style) => [
          `Ton thème — « ${style} » — teinte déjà les signes. La voix des astres s’y accorde.`,
          `On lit qui tu es dans le ciel : ${style}. Voici de quoi nourrir ça.`,
        ],
        en: (style) => [
          `Your chart — “${style}” — already colours the signs. The voice of the stars attunes to it.`,
          `We read who you are in the sky: ${style}. Here’s something to feed that.`,
        ],
      },
      callback: {
        fr: (t) => [
          `Hier, dans les signes : « ${t} » La voix des astres s’en souvient.`,
          `Ce que tu as fait est inscrit au ciel : « ${t} »`,
        ],
        en: (t) => [
          `Yesterday, in the signs: “${t}” The voice of the stars remembers.`,
          `What you did is written in the sky: “${t}”`,
        ],
      },
    },

    afterQuest: {
      fr: ['Le signe est lu.', 'Voilà qui est accompli.', 'Le ciel a bougé, un peu.', 'La voix des astres approuve, discrètement.', 'Une ligne de plus dans le ciel.'],
      en: ['The sign is read.', 'That is fulfilled.', 'The sky shifted, a little.', 'The voice of the stars quietly approves.', 'One more line drawn in the sky.'],
    },
    afterQuestFirst: {
      fr: 'Une voix venue des astres : « Un signe se prépare pour toi. Reviens demain. »',
      en: 'A voice from the stars: “A sign is forming for you. Come back tomorrow.”',
    },

    memorable: [
      {
        fr: (t) => `Aujourd’hui tu as vraiment fait ça : « ${t} » Aucun présage ne l’annonçait.`,
        en: (t) => `Today you actually did this: “${t}” No omen foretold it.`,
      },
      {
        fr: (t) => `À inscrire au ciel : le jour où « ${t.toLowerCase()} » Oui, vraiment.`,
        en: (t) => `To write in the sky: the day when “${t.toLowerCase()}” Yes, really.`,
      },
      {
        fr: (t) => `Bref éclat d’étoile : « ${t} »`,
        en: (t) => `A brief flare of a star: “${t}”`,
      },
      {
        fr: (t) => `Signe minuscule : tu as choisi « ${t} » — et le ciel n’a pas basculé. Tant mieux.`,
        en: (t) => `A tiny sign: you chose “${t}” — and the sky didn’t tip. Good.`,
      },
      {
        fr: (t) => `La voix des astres note en marge : « ${t} » — à relire un soir de doute.`,
        en: (t) => `The voice of the stars notes in the margin: “${t}” — to reread on a doubtful night.`,
      },
    ],

    eventEntry: {
      fr: (title, item) => `Signe interprété — ${title}. Butin : ${item}.`,
      en: (title, item) => `Sign read — ${title}. Loot: ${item}.`,
    },
    levelChapter: {
      fr: (level) => `Une maison de plus se lève. Niveau ${level}. Le ciel n’exige rien d’autre.`,
      en: (level) => `One more house rises. Level ${level}. The sky asks nothing more.`,
    },
    regionReveal: {
      fr: (label) => `Sur la carte céleste, une étoile s’allume : « ${label} » n’est plus un vide.`,
      en: (label) => `On the star chart, a star lights: “${label}” is no longer a void.`,
    },

    chapters: [
      { label: { fr: 'Prologue', en: 'Prologue' }, blurb: {
        fr: 'Les premiers signes — encore hésitants, déjà vrais.',
        en: 'The first signs — still hesitant, already real.' } },
      { label: { fr: 'Maison I', en: 'House I' }, blurb: {
        fr: 'Le rythme s’installe. Les rues commencent à répondre.',
        en: 'A rhythm settles in. The streets begin to answer.' } },
      { label: { fr: 'Maison II', en: 'House II' }, blurb: {
        fr: 'La lueur tient. Les reliques s’accumulent au musée.',
        en: 'The glow holds. Relics gather in the museum.' } },
      { label: { fr: 'Maison III', en: 'House III' }, blurb: {
        fr: 'La voûte se lit mieux. La carte n’est plus un rêve.',
        en: 'The vault reads clearer. The map is no longer a dream.' } },
      { label: { fr: 'Maison IV', en: 'House IV' }, blurb: {
        fr: 'Assez de nuits claires pour connaître le grain du ciel.',
        en: 'Enough clear nights to know the grain of the sky.' } },
      { label: { fr: 'Maison V', en: 'House V' }, blurb: {
        fr: 'La constellation lointaine n’est plus qu’une silhouette familière.',
        en: 'The distant constellation is now only a familiar silhouette.' } },
    ],
  },

  // Aperçu boutique : place réservée, vidéo à enregistrer plus tard (Yannick).
  previewVideo: null,
};
