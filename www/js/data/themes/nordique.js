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
      // Retour après absence (Phase 1.3) — accueil, jamais un reproche.
      comeback: {
        fr: [
          'Ça faisait quelques jours. Le grimoire est resté ouvert à ta page — rien à rattraper, on reprend là où tu veux.',
          'Te revoilà, voyageur. Le feu ne s’est pas éteint ; il attendait juste qu’on le ranime, sans se presser.',
        ],
        en: [
          'It’s been a few days. The grimoire stayed open at your page — nothing to catch up on, we pick up wherever you like.',
          'There you are, traveller. The fire didn’t go out; it was just waiting to be stirred back up, no rush.',
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

    // Réactions du compagnon aux jalons — « premières fois » + paliers de volume
    // (engine/milestones.js, Phase 1.2). Rare, une phrase, jamais une exigence.
    milestones: {
      first_quest: {
        fr: 'Première page écrite de ta main. Ton compagnon la relit une fois, pour le plaisir.',
        en: 'First page written in your own hand. Your companion rereads it once, just for the pleasure.',
      },
      first_outdoor: {
        fr: 'Tu as passé la porte pour de vrai. Ce qui se vit dehors compte double dans le grimoire.',
        en: 'You actually stepped out the door. What’s lived outside counts double in the grimoire.',
      },
      first_social: {
        fr: 'Un mot échangé avec quelqu’un. Ton compagnon le note : ce genre de chose laisse une trace.',
        en: 'A word exchanged with someone. Your companion notes it: this kind of thing leaves a mark.',
      },
      first_evening: {
        fr: 'Une quête bouclée à la lueur du soir. Les meilleures histoires se passent souvent après le coucher du soleil.',
        en: 'A quest finished by evening light. The best stories often happen after sundown.',
      },
      first_hidden: {
        fr: 'Tu as suivi une piste sans en connaître le bout. C’est exactement comme ça qu’on trouve les bonnes.',
        en: 'You followed a trail without knowing where it led. That’s exactly how the good ones are found.',
      },
      first_bold: {
        fr: 'Celle-là demandait un peu de cran. Tu l’as prise quand même — ton compagnon s’en souviendra.',
        en: 'That one took some nerve. You took it anyway — your companion will remember.',
      },
      first_big: {
        fr: 'Une quête qui pesait son poids. Tu l’as portée jusqu’au bout.',
        en: 'A quest with real weight. You carried it all the way.',
      },
      first_event: {
        fr: 'Ton premier détour hors du chemin tracé. Les événements ne préviennent jamais — c’est ce qui les rend précieux.',
        en: 'Your first step off the marked path. Events never announce themselves — that’s what makes them precious.',
      },
      volume: {
        fr: (n) => `${n} quêtes derrière toi. Le grimoire commence à avoir de l’épaisseur — et toi, une histoire.`,
        en: (n) => `${n} quests behind you. The grimoire is starting to have some heft — and you, a story.`,
      },
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

    // Nuance de chapitre selon la famille dominante (Phase 3.1). Une phrase,
    // jamais un jugement — c'est une couleur, pas un score.
    chapterLean: {
      fr: {
        social: 'Ton chemin passe surtout par les autres — un mot, un visage, une présence.',
        exploration: 'Ton chemin s’écarte souvent des sentiers connus.',
        curiosite: 'Ton chemin est fait de choses regardées de plus près.',
        creation: 'Ton chemin laisse des traces que tu as faites de tes mains.',
        quotidien: 'Ton chemin transforme l’ordinaire en petites victoires.',
        chaos: 'Ton chemin aime les règles absurdes et les détours du hasard.',
      },
      en: {
        social: 'Your path runs mostly through other people — a word, a face, a presence.',
        exploration: 'Your path keeps stepping off the known trails.',
        curiosite: 'Your path is made of things looked at more closely.',
        creation: 'Your path leaves traces you made with your hands.',
        quotidien: 'Your path turns the ordinary into small wins.',
        chaos: 'Your path loves absurd rules and the detours of chance.',
      },
    },

    // Entrée de journal « du jour » (Phase 3.2) — un résumé de la veille.
    dayTitles: {
      fr: ['Le fil du jour', 'Les détours', 'Une journée de plus', 'La page d’aujourd’hui', 'Ce que le jour a donné'],
      en: ['The day’s thread', 'The detours', 'One more day', 'Today’s page', 'What the day gave'],
    },
    dayEntry: {
      fr: (n, title, tags) => `Jour ${n} — « ${title} ». Tu as vécu : ${tags}. Souvenir conservé.`,
      en: (n, title, tags) => `Day ${n} — “${title}”. You lived: ${tags}. Kept as a memory.`,
    },

    // Cadre des mini-arcs secrets (Phase 3.3) — le contenu brut vient de
    // data/arcs.js ; ici seul l'habillage change.
    arc: {
      clue: {
        fr: (t) => `Un indice se précise dans le grimoire : « ${t} »`,
        en: (t) => `A clue sharpens in the grimoire: “${t}”`,
      },
      reveal: {
        fr: (t) => `La piste se referme. « ${t} »`,
        en: (t) => `The trail closes. “${t}”`,
      },
      inProgress: {
        fr: [
          'Une piste te suit depuis quelques jours — ton compagnon la garde en tête.',
          'Le grimoire a une page à moitié écrite ; elle attend la suite.',
        ],
        en: [
          'A trail has followed you for a few days — your companion keeps it in mind.',
          'The grimoire has a half-written page; it waits for what comes next.',
        ],
      },
    },
  },
};
