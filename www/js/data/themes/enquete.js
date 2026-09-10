// Thème payant « Enquête ». Voir ../themes.js pour le contrat.
// Voix : un « coéquipier » à côté de toi (D4), vocabulaire de dossier /
// piste / tableau de liège. Mêmes intentions que nordique.js, seul le
// vocabulaire de saveur change ; le reste retombe sur la voix de nordique.

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

  voice: {
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
          'Jour après jour, tu tiens le fil. Ton coéquipier le remarque — sans pression.',
          'La série avance comme une enquête bien menée. On continue à ton rythme.',
        ],
        en: [
          'Day after day, you keep the thread. Your partner notices — no pressure.',
          'The streak moves like a case run right. We carry on at your pace.',
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
      styleLead: {
        fr: (style) => [
          `Ta méthode — « ${style} » — se lit déjà dans le dossier. Ton coéquipier s’y adapte.`,
          `On sait comment tu bosses : ${style}. Voici de quoi nourrir ça.`,
        ],
        en: (style) => [
          `Your method — “${style}” — already shows in the file. Your partner adapts.`,
          `We know how you work: ${style}. Here’s something to feed that.`,
        ],
      },
      callback: {
        fr: (t) => [
          `Au dossier, hier : « ${t} » Ton coéquipier ne l’a pas classé.`,
          `Ce que tu as fait est consigné : « ${t} »`,
        ],
        en: (t) => [
          `In the file, yesterday: “${t}” Your partner hasn’t shelved it.`,
          `What you did is on record: “${t}”`,
        ],
      },
      comeback: {
        fr: [
          'Quelques jours sans passer au bureau. Le dossier est resté ouvert à ta page — rien à rattraper, on le reprend quand tu veux.',
          'Te revoilà. La piste n’a pas refroidi ; elle attendait juste qu’on s’y remette, tranquillement.',
        ],
        en: [
          'A few days away from the office. The file stayed open at your page — nothing to catch up on, we pick it back up whenever you like.',
          'There you are. The lead didn’t go cold; it was just waiting for us to get back to it, calmly.',
        ],
      },
    },

    afterQuest: {
      fr: ['Noté.', 'Versé au dossier.', 'L’affaire a bougé, un peu.', 'Ton coéquipier coche la ligne.', 'Une piste de moins à traiter.'],
      en: ['Noted.', 'Filed to the case.', 'The case moved, a little.', 'Your partner ticks the line.', 'One less lead to chase.'],
    },
    afterQuestFirst: {
      fr: 'Ton coéquipier pose une tasse : « J’aurai une piste pour toi. Repasse demain. »',
      en: 'Your partner sets down a mug: “I’ll have a lead for you. Come by tomorrow.”',
    },

    milestones: {
      first_quest: {
        fr: 'Première note versée au dossier de ta main. Ton coéquipier la relit une fois.',
        en: 'First note filed in your own hand. Your partner rereads it once.',
      },
      first_outdoor: {
        fr: 'Tu es sorti sur le terrain pour de vrai. Ce qui se vérifie dehors pèse double au dossier.',
        en: 'You actually went out into the field. What’s checked outside weighs double in the file.',
      },
      first_social: {
        fr: 'Un mot pris à quelqu’un. Ton coéquipier le consigne : un témoignage, même court, ça compte.',
        en: 'A word taken from someone. Your partner logs it: a statement, however short, counts.',
      },
      first_evening: {
        fr: 'Une piste suivie en soirée. C’est souvent après la fermeture que les choses se disent.',
        en: 'A lead followed in the evening. It’s often after closing time that things get said.',
      },
      first_hidden: {
        fr: 'Tu as suivi une piste sans en connaître l’issue. C’est comme ça qu’on boucle les vraies affaires.',
        en: 'You followed a lead without knowing its outcome. That’s how real cases get closed.',
      },
      first_bold: {
        fr: 'Celle-là demandait du culot. Tu l’as prise quand même — ton coéquipier l’a noté.',
        en: 'That one took some nerve. You took it anyway — your partner noted it.',
      },
      first_big: {
        fr: 'Une piste qui demandait du temps. Tu l’as suivie jusqu’au bout.',
        en: 'A lead that took time. You followed it all the way.',
      },
      first_event: {
        fr: 'Ton premier développement imprévu. Ça n’arrive jamais sur rendez-vous — c’est ce qui fait avancer.',
        en: 'Your first unplanned development. It never comes by appointment — that’s what moves things.',
      },
      volume: {
        fr: (n) => `${n} pistes suivies. Le dossier s’épaissit — et toi, tu as une méthode.`,
        en: (n) => `${n} leads followed. The file grows thicker — and you have a method.`,
      },
    },

    memorable: [
      {
        fr: (t) => `Aujourd’hui tu as vraiment fait ça : « ${t} » Aucun dossier ne le demandait.`,
        en: (t) => `Today you actually did this: “${t}” No file asked for it.`,
      },
      {
        fr: (t) => `À verser au dossier : le jour où « ${t.toLowerCase()} » Oui, vraiment.`,
        en: (t) => `To file: the day when “${t.toLowerCase()}” Yes, really.`,
      },
      {
        fr: (t) => `Petit moment ridicule et parfait : « ${t} »`,
        en: (t) => `A small, ridiculous, perfect moment: “${t}”`,
      },
      {
        fr: (t) => `Note en marge : tu as choisi « ${t} » — et l’affaire n’a pas dérapé. Tant mieux.`,
        en: (t) => `Margin note: you chose “${t}” — and the case didn’t go sideways. Good.`,
      },
      {
        fr: (t) => `Ton coéquipier épingle au tableau : « ${t} » — à relire un soir de doute.`,
        en: (t) => `Your partner pins it to the board: “${t}” — to reread on a doubtful night.`,
      },
    ],

    eventEntry: {
      fr: (title, item) => `Développement traité — ${title}. Butin : ${item}.`,
      en: (title, item) => `Development handled — ${title}. Loot: ${item}.`,
    },
    levelChapter: {
      fr: (level) => `Le dossier s’épaissit. Niveau ${level}. Rien de plus n’est exigé.`,
      en: (level) => `The file grows thicker. Level ${level}. Nothing more is required.`,
    },
    regionReveal: {
      fr: (label) => `Sur le plan, une épingle de plus : « ${label} » n’est plus une case vide.`,
      en: (label) => `On the map, one more pin: “${label}” is no longer a blank square.`,
    },

    chapters: [
      { label: { fr: 'Prologue', en: 'Prologue' }, blurb: {
        fr: 'Les premiers pas dans l’affaire — encore hésitants, déjà vrais.',
        en: 'First steps into the case — still hesitant, already real.' } },
      { label: { fr: 'Rapport I', en: 'Report I' }, blurb: {
        fr: 'Le rythme s’installe. Les rues commencent à répondre.',
        en: 'A rhythm settles in. The streets begin to answer.' } },
      { label: { fr: 'Rapport II', en: 'Report II' }, blurb: {
        fr: 'La piste tient. Les pièces à conviction s’accumulent au musée.',
        en: 'The lead holds. Exhibits gather in the museum.' } },
      { label: { fr: 'Rapport III', en: 'Report III' }, blurb: {
        fr: 'Le mobile se dessine. Le plan n’est plus une hypothèse.',
        en: 'The motive takes shape. The map is no longer a hypothesis.' } },
      { label: { fr: 'Rapport IV', en: 'Report IV' }, blurb: {
        fr: 'Assez de nuits au bureau pour sentir le carton de la chemise.',
        en: 'Enough nights at the office to feel the folder’s cardboard.' } },
      { label: { fr: 'Rapport V', en: 'Report V' }, blurb: {
        fr: 'L’affaire lointaine n’est plus qu’une routine familière.',
        en: 'The distant case is now only a familiar routine.' } },
    ],

    chapterLean: {
      fr: {
        social: 'Ton enquête passe surtout par les gens — un mot pris, un visage, un témoin.',
        exploration: 'Ton enquête sort souvent des rues que tu connais.',
        curiosite: 'Ton enquête est faite de détails que d’autres laisseraient passer.',
        creation: 'Ton enquête laisse des choses que tu as faites de tes mains.',
        quotidien: 'Ton enquête fait de l’ordinaire une série de petites victoires.',
        chaos: 'Ton enquête aime les règles absurdes et les pistes que rien n’annonçait.',
      },
      en: {
        social: 'Your case runs mostly through people — a word taken, a face, a witness.',
        exploration: 'Your case keeps leaving the streets you know.',
        curiosite: 'Your case is made of details others would let slip.',
        creation: 'Your case leaves things you made with your hands.',
        quotidien: 'Your case turns the ordinary into a run of small wins.',
        chaos: 'Your case loves absurd rules and leads nothing announced.',
      },
    },
    dayTitles: {
      fr: ['Le rapport du jour', 'Les écarts', 'Une journée de plus au dossier', 'La note d’aujourd’hui', 'Ce que la journée a donné'],
      en: ['The day’s report', 'The detours', 'One more day on file', 'Today’s note', 'What the day turned up'],
    },
    dayEntry: {
      fr: (n, t, tags) => `Jour ${n} — « ${t} ». Versé au dossier : ${tags}. Conservé.`,
      en: (n, t, tags) => `Day ${n} — “${t}”. Filed to the case: ${tags}. Kept.`,
    },
    arc: {
      clue: {
        fr: (t) => `Une pièce s’ajoute au tableau : « ${t} »`,
        en: (t) => `A piece goes up on the board: “${t}”`,
      },
      reveal: {
        fr: (t) => `L’affaire est bouclée. « ${t} »`,
        en: (t) => `The case is closed. “${t}”`,
      },
      inProgress: {
        fr: [
          'Une piste te suit depuis quelques jours — ton coéquipier ne l’a pas classée.',
          'Le dossier a une note à moitié écrite ; elle attend la suite.',
        ],
        en: [
          'A lead has followed you for days — your partner hasn’t shelved it.',
          'The file has a half-written note; it waits for what comes next.',
        ],
      },
    },
  },
};
