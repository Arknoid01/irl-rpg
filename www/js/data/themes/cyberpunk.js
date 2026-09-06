// Thème « Néon nocturne ». Voir ../themes.js pour le contrat attendu par un thème.

export default {
  label: { fr: 'Néon nocturne', en: 'Night neon' },
  dot: 'linear-gradient(135deg,#ff2e9a,#00e5ff)',
  companionLines: {
    fr: [
      'Ton compagnon scanne la ville. Nouvelles pistes détectées.',
      'Signal reçu. Ton compagnon a repéré des opportunités dans le secteur.',
      'Le réseau est calme. Ton compagnon te propose deux ou trois choses.',
    ],
    en: [
      'Your companion scans the city. New leads detected.',
      'Signal received. Your companion picked up opportunities in the sector.',
      'The network is quiet. Your companion has two or three things for you.',
    ],
  },
  xpSuffix: { fr: '— données', en: '— data' },

  ui: {
    questsHeading: { fr: 'Missions du jour', en: 'Today’s missions' },
    eventLabel: { fr: 'Incident', en: 'Incident' },
    allDone: {
      fr: 'Toutes les missions du jour sont bouclées 🏆',
      en: 'All of today’s missions are done 🏆',
    },
  },

  // Voix du compagnon (cf. engine/companion.js). « IA compagnon », jamais un
  // maître du jeu (D4).
  ctx: {
    emptyDay: {
      fr: [
        'File de missions vide. On peut en générer quand tu veux.',
        'Signal clair. Lance un scan et de nouvelles pistes remontent.',
      ],
      en: [
        'Mission queue empty. We can generate some whenever.',
        'Signal’s clear. Run a scan and new leads surface.',
      ],
    },
    allDone: {
      fr: [
        'Missions du jour : toutes clôturées. Le réseau se calme.',
        'Rien en file. Ton IA repasse en veille — la journée a suffi.',
      ],
      en: [
        'Today’s missions: all closed. The network settles.',
        'Nothing queued. Your AI drops to standby — the day was enough.',
      ],
    },
    streakHot: {
      fr: [
        'Série active depuis un moment. Ton IA archive, sans alerte.',
        'Jour après jour, ton historique se remplit. On garde le rythme.',
      ],
      en: [
        'Streak’s been running a while. Your AI logs it, no alert.',
        'Day after day your record fills up. We keep the pace.',
      ],
    },
    mapFresh: {
      fr: [
        'Nouveau nœud en ligne sur le réseau. Un secteur vient de s’ouvrir.',
        'Ton IA surligne le plan : une zone se déchiffre.',
      ],
      en: [
        'New node online on the network. A sector just opened.',
        'Your AI highlights the map: an area decrypts.',
      ],
    },
    afterQuest: {
      fr: ['Validé.', 'Mission clôturée.', 'Ton IA enregistre.', 'Données acquises.'],
      en: ['Confirmed.', 'Mission closed.', 'Your AI logs it.', 'Data acquired.'],
    },
    afterQuestFirst: {
      fr: ['Ton IA, en incrustation : « J’aurai un contrat pour toi. Reconnecte-toi demain. »'],
      en: ['Your AI, overlaid: “I’ll have a contract for you. Reconnect tomorrow.”'],
    },
  },

  // Aperçu boutique (ui/shop.js) : mettre './assets/videos/cyberpunk-preview.mp4'
  // (chemin depuis www/, comme les <link> d'index.html) une fois le fichier
  // ajouté — vidéo courte en boucle, sans son (l'attribut muted est de toute
  // façon obligatoire pour l'autoplay mobile). Tant que c'est null, la
  // boutique retombe sur l'aperçu live en CSS.
  previewVideo: './assets/videos/cyberpunk-preview.mp4',
};
