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
  xpSuffix: { fr: '— le présage s’accomplit', en: '— the omen is fulfilled' },

  ui: {
    questsHeading: { fr: 'Présages du jour', en: 'Today’s omens' },
    eventLabel: { fr: 'Signe', en: 'Sign' },
    allDone: {
      fr: 'Tous les présages du jour sont accomplis 🏆',
      en: 'Every omen today has been fulfilled 🏆',
    },
    levelUpLine: {
      fr: 'Un astre de plus s’aligne sur ta carte du ciel.',
      en: 'One more star aligns on your sky chart.',
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
          'Tous les présages du jour sont accomplis. Le ciel peut tourner en paix.',
          'Plus rien à déchiffrer ce soir. La voix des astres se tait, sereine.',
        ],
        en: [
          'Every omen today is fulfilled. The sky can turn in peace.',
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
      comeback: {
        fr: [
          'Quelques nuits sans lecture. Le ciel est resté à la même page — rien à rattraper, on interroge les signes quand tu veux.',
          'Te revoilà sous les étoiles. Elles n’ont pas bougé sans toi ; elles attendaient juste ton regard, sans hâte.',
        ],
        en: [
          'A few nights without a reading. The sky stayed on the same page — nothing to catch up on, we question the signs whenever you like.',
          'There you are under the stars. They didn’t move on without you; they were just waiting for your gaze, no haste.',
        ],
      },
    },

    afterQuest: {
      fr: ['Le présage s’accomplit.', 'Voilà qui est accompli.', 'Le ciel a bougé, un peu.', 'La voix des astres approuve, discrètement.', 'Une ligne de plus dans le ciel.'],
      en: ['The omen is fulfilled.', 'That is fulfilled.', 'The sky shifted, a little.', 'The voice of the stars quietly approves.', 'One more line drawn in the sky.'],
    },
    afterQuestFirst: {
      fr: 'Une voix venue des astres : « Un signe se prépare pour toi. Reviens demain. »',
      en: 'A voice from the stars: “A sign is forming for you. Come back tomorrow.”',
    },

    milestones: {
      first_quest: {
        fr: 'Premier signe répondu de ta main. La voix des astres le relit une fois.',
        en: 'First sign answered in your own hand. The voice of the stars rereads it once.',
      },
      first_outdoor: {
        fr: 'Tu es sorti sous le ciel pour de vrai. Ce qui se vit dehors pèse double dans les signes.',
        en: 'You actually went out under the sky. What’s lived outside weighs double in the signs.',
      },
      first_social: {
        fr: 'Un mot partagé avec quelqu’un. La voix des astres le note : les rencontres laissent une trace au ciel.',
        en: 'A word shared with someone. The voice of the stars notes it: encounters leave a mark in the sky.',
      },
      first_evening: {
        fr: 'Un présage lu à la nuit tombée. C’est l’heure où le ciel parle le plus clairement.',
        en: 'An omen read after nightfall. That’s the hour the sky speaks most clearly.',
      },
      first_hidden: {
        fr: 'Tu as suivi un signe sans en connaître le sens. C’est ainsi qu’on lit les vrais présages.',
        en: 'You followed a sign without knowing its meaning. That’s how true omens are read.',
      },
      first_bold: {
        fr: 'Celui-là demandait du courage. Tu l’as suivi quand même — le ciel s’en souviendra.',
        en: 'That one took courage. You followed it anyway — the sky will remember.',
      },
      first_big: {
        fr: 'Un signe qui demandait de la patience. Tu l’as lu jusqu’au bout.',
        en: 'A sign that took patience. You read it all the way through.',
      },
      first_event: {
        fr: 'Ton premier signe venu sans être appelé. Les astres ne préviennent jamais — c’est ce qui les rend justes.',
        en: 'Your first sign that came unbidden. The stars never warn you — that’s what makes them true.',
      },
      volume: {
        fr: (n) => `${n} présages lus. Le ciel se remplit de tes lignes — et toi, tu as une carte.`,
        en: (n) => `${n} omens read. The sky fills with your lines — and you have a chart.`,
      },
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
    eventCoda: [
      {
        fr: "C’est sans doute ce genre de détour que les astres retiennent.",
        en: "It’s probably this kind of detour the stars remember.",
      },
      {
        fr: "Aucun signe ne te l’imposait. C’est peut-être pour ça qu’il compte.",
        en: "No sign demanded it of you. Maybe that’s why it matters.",
      },
      {
        fr: "Tu l’oublieras peut-être. Le ciel, lui, s’en souviendra.",
        en: "You might forget it. The sky will remember.",
      },
    ],
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

    chapterLean: {
      fr: {
        social: 'Ton ciel penche vers les autres — un mot, un visage, une présence.',
        exploration: 'Ton ciel te fait quitter les chemins connus.',
        curiosite: 'Ton ciel est fait de choses regardées longtemps.',
        creation: 'Ton ciel laisse des choses nées de tes mains.',
        quotidien: 'Ton ciel change l’ordinaire en petites victoires.',
        chaos: 'Ton ciel aime les règles absurdes et ce que le hasard écrit.',
      },
      en: {
        social: 'Your sky leans toward other people — a word, a face, a presence.',
        exploration: 'Your sky keeps taking you off the known paths.',
        curiosite: 'Your sky is made of things watched a long while.',
        creation: 'Your sky leaves things born from your hands.',
        quotidien: 'Your sky turns the ordinary into small wins.',
        chaos: 'Your sky loves absurd rules and whatever chance writes.',
      },
    },
    dayTitles: {
      fr: ['Le relevé du ciel', 'Les écarts', 'Une nuit de plus', 'La ligne d’aujourd’hui', 'Ce que le ciel a rendu'],
      en: ['The sky’s reading', 'The strays', 'One more night', 'Today’s line', 'What the sky gave back'],
    },
    dayEntry: {
      fr: (n, t, tags) => `Nuit ${n}. « ${t} ». Inscrit au ciel : ${tags} — les autres signes attendront.`,
      en: (n, t, tags) => `Night ${n}. “${t}”. Written in the sky: ${tags} — the other signs can wait.`,
    },
    arc: {
      clue: {
        fr: (t) => `Un signe se précise : « ${t} »`,
        en: (t) => `A sign sharpens: “${t}”`,
      },
      reveal: {
        fr: (t) => `Le présage s’accomplit. « ${t} »`,
        en: (t) => `The omen is fulfilled. “${t}”`,
      },
      inProgress: {
        fr: [
          'Un signe te suit depuis quelques nuits — la voix des astres le garde en tête.',
          'Le ciel a une figure à moitié tracée ; elle attend la suite.',
        ],
        en: [
          'A sign has followed you for a few nights — the voice of the stars keeps it in mind.',
          'The sky has a half-drawn figure; it waits for what comes next.',
        ],
      },
    },
  },
};
