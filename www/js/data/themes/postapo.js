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
    levelUpLine: {
      fr: 'Ta réputation grésille un peu plus fort sur les ondes.',
      en: 'Your reputation crackles a little louder on the airwaves.',
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
      comeback: {
        fr: [
          'Quelques jours de silence radio. Le secteur n’a pas changé sans toi — rien à rattraper, on reprend une mission quand tu veux.',
          'Te revoilà sur les ondes. L’émetteur a tenu tout seul ; il attendait juste ton signal, sans presser.',
        ],
        en: [
          'A few days of radio silence. The sector didn’t change without you — nothing to catch up on, we take a run whenever you like.',
          'There you are, back on the air. The transmitter held on its own; it was just waiting for your signal, no rush.',
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

    milestones: {
      first_quest: {
        fr: 'Première ligne notée de ta main. Ton guide la relit une fois, sur les ondes.',
        en: 'First line noted in your own hand. Your guide reads it back once, over the air.',
      },
      first_outdoor: {
        fr: 'Tu es sorti dans le secteur pour de vrai. Ce qui se fait dehors compte double, ici.',
        en: 'You actually went out into the sector. What’s done outside counts double out here.',
      },
      first_social: {
        fr: 'Un mot échangé avec quelqu’un. Ton guide le note : dans le secteur, un contact, ça compte.',
        en: 'A word exchanged with someone. Your guide notes it: out here, a contact counts.',
      },
      first_evening: {
        fr: 'Une mission bouclée de nuit. C’est quand la radio se calme que le secteur se lit le mieux.',
        en: 'A run finished at night. It’s when the radio goes quiet that the sector reads best.',
      },
      first_hidden: {
        fr: 'Tu as suivi un signal sans savoir où il menait. C’est comme ça qu’on trouve les bons.',
        en: 'You followed a signal without knowing where it led. That’s how the good ones turn up.',
      },
      first_bold: {
        fr: 'Celle-là demandait du cran. Tu l’as prise quand même — ton guide l’a notée sur la carte.',
        en: 'That one took guts. You took it anyway — your guide marked it on the map.',
      },
      first_big: {
        fr: 'Un run qui pesait lourd. Tu es allé au bout.',
        en: 'A run that weighed heavy. You saw it through.',
      },
      first_event: {
        fr: 'Ta première alerte hors programme. Ça ne prévient jamais — c’est ce qui fait bouger le secteur.',
        en: 'Your first off-schedule alert. It never warns you — that’s what moves the sector.',
      },
      volume: {
        fr: (n) => `${n} missions au compteur. Le secteur, tu commences à le connaître — et toi, tu as une histoire.`,
        en: (n) => `${n} runs on the counter. You’re starting to know the sector — and you have a story.`,
      },
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

    chapterLean: {
      fr: {
        social: 'Ta route passe surtout par les gens — un mot, un visage, un contact.',
        exploration: 'Ta route sort souvent des secteurs que tu connais.',
        curiosite: 'Ta route est faite de trucs regardés de plus près.',
        creation: 'Ta route laisse des choses bricolées de tes mains.',
        quotidien: 'Ta route fait des corvées ordinaires des petites victoires.',
        chaos: 'Ta route aime les règles absurdes et ce que le hasard décide.',
      },
      en: {
        social: 'Your route runs mostly through people — a word, a face, a contact.',
        exploration: 'Your route keeps leaving the sectors you know.',
        curiosite: 'Your route is made of things looked at more closely.',
        creation: 'Your route leaves things rigged up by your hands.',
        quotidien: 'Your route turns ordinary chores into small wins.',
        chaos: 'Your route loves absurd rules and whatever chance decides.',
      },
    },
    dayTitles: {
      fr: ['Le rapport du jour', 'Les écarts', 'Un jour de plus', 'La ligne d’aujourd’hui', 'Ce que le secteur a rendu'],
      en: ['The day’s report', 'The strays', 'One more day', 'Today’s line', 'What the sector gave back'],
    },
    dayEntry: {
      fr: (n, t, tags) => `Jour ${n} — « ${t} ». Sur les ondes : ${tags}. Gardé.`,
      en: (n, t, tags) => `Day ${n} — “${t}”. Over the air: ${tags}. Kept.`,
    },
    arc: {
      clue: {
        fr: (t) => `Un fragment de signal remonte : « ${t} »`,
        en: (t) => `A fragment of signal comes through: “${t}”`,
      },
      reveal: {
        fr: (t) => `La piste aboutit. « ${t} »`,
        en: (t) => `The trail leads home. “${t}”`,
      },
      inProgress: {
        fr: [
          'Une piste te suit depuis quelques jours — ton guide la garde sur la carte.',
          'La radio a un message à moitié capté ; il attend la suite.',
        ],
        en: [
          'A trail has followed you for days — your guide keeps it on the map.',
          'The radio has a half-caught message; it waits for what comes next.',
        ],
      },
    },
  },
};
