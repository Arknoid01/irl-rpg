// Événements aléatoires — cassent la routine, toujours facultatifs.
//
// Champs :
//   id, title{fr,en}, text{fr,en}, xp, item{fr,en}, minutes (indicatif)
//   famille?     — lie l’événement à une région / compétences
//   weight?      — poids de base au tirage (défaut 10)
//   minLevel?, minStreak?, minComfort?, maxComfort?
//   moment?      — 'matin' | 'midi' | 'soir' (sinon tout moment)
//   requireFamily? / requireFamilyN? — débloqué après N quêtes de la famille

/** @type {Array<object>} */
export const EVENTS = [
  // ── Exploration ──
  {
    id: 'ev_marchand', famille: 'exploration', xp: 260, minutes: 90, weight: 10,
    title: { fr: 'Le marchand ambulant', en: 'The travelling merchant' },
    text: {
      fr: "Une occasion vient d'apparaître à proximité. Trouve dans la journée une boulangerie (ou un commerce de bouche) où tu n'es jamais allé.",
      en: "An opportunity just appeared nearby. Find, sometime today, a bakery (or food shop) you've never been to.",
    },
    item: { fr: '🥖 Pain légendaire', en: '🥖 Legendary bread' },
  },
  {
    id: 'ev_porte', famille: 'exploration', xp: 230, minutes: 120, weight: 10,
    title: { fr: "L'appel du hasard", en: 'The call of chance' },
    text: {
      fr: "Une porte inconnue s'est ouverte. Emprunte une rue que tu n'as jamais prise avant la fin de la journée.",
      en: "An unknown door has opened. Walk down a street you've never taken before the day ends.",
    },
    item: { fr: '🗺️ Fragment de carte', en: '🗺️ Map fragment' },
  },
  {
    id: 'ev_cafe', famille: 'exploration', xp: 190, minutes: 90, weight: 9,
    title: { fr: 'Le comptoir inconnu', en: 'The unknown counter' },
    text: {
      fr: "Prends quelque chose à boire (ou à grignoter) dans un endroit où tu n'as jamais commandé.",
      en: "Get a drink (or a snack) somewhere you've never ordered before.",
    },
    item: { fr: '☕ Ticket de comptoir', en: '☕ Counter ticket' },
  },
  {
    id: 'ev_balcon_monde', famille: 'exploration', xp: 200, minutes: 60, weight: 8, moment: 'soir',
    title: { fr: 'Le balcon du monde', en: 'The world’s balcony' },
    text: {
      fr: "Ce soir, trouve un point de vue un peu plus haut que d’habitude (escalier, colline, étage) et regarde 3 minutes.",
      en: "Tonight, find a viewpoint a little higher than usual (stairs, hill, floor) and look for 3 minutes.",
    },
    item: { fr: '🔭 Lentille du soir', en: '🔭 Evening lens' },
  },
  {
    id: 'ev_carte_trou', famille: 'exploration', xp: 240, minutes: 150, weight: 6, minLevel: 4,
    title: { fr: 'Le trou dans la carte', en: 'The hole in the map' },
    text: {
      fr: "Choisis un coin de ton quartier que tu évites d’habitude — passe-y 10 minutes sans but précis.",
      en: "Pick a corner of your neighbourhood you usually avoid — spend 10 minutes there with no set goal.",
    },
    item: { fr: '🧭 Boussole rayée', en: '🧭 Scratched compass' },
  },

  // ── Social ──
  {
    id: 'ev_visage', famille: 'social', xp: 250, minutes: 240, weight: 10,
    title: { fr: 'Le visage familier', en: 'The familiar face' },
    text: {
      fr: "Quelqu'un que tu connais mal croisera peut-être ton chemin aujourd'hui. Si ça arrive, va lui dire un mot.",
      en: "Someone you barely know might cross your path today. If it happens, go say a word.",
    },
    item: { fr: '🤝 Jeton de confiance', en: '🤝 Token of trust' },
  },
  {
    id: 'ev_detour_ami', famille: 'social', xp: 220, minutes: 180, weight: 9,
    title: { fr: 'Mission complice', en: 'Accomplice mission' },
    text: {
      fr: "Envoie à un ami : « J'ai une mission, choisis A ou B. » Applique sa réponse à ta prochaine décision sans importance.",
      en: "Text a friend: “I've got a mission, pick A or B.” Apply their answer to your next unimportant decision.",
    },
    item: { fr: '🎲 Dé partagé', en: '🎲 Shared die' },
  },
  {
    id: 'ev_lettre', famille: 'social', xp: 210, minutes: 90, weight: 8,
    title: { fr: 'La missive courte', en: 'The short missive' },
    text: {
      fr: "Écris un message sincère à quelqu’un — trois phrases max — sans attendre de réponse.",
      en: "Write a sincere message to someone — three sentences max — without expecting a reply.",
    },
    item: { fr: '✉ Sceau de papier', en: '✉ Paper seal' },
  },
  {
    id: 'ev_table', famille: 'social', xp: 280, minutes: 300, weight: 5, minLevel: 5, minComfort: 3,
    title: { fr: 'La table improvisée', en: 'The improvised table' },
    text: {
      fr: "Propose à quelqu’un de partager un repas, un café ou un banc — aujourd’hui ou ce soir.",
      en: "Invite someone to share a meal, a coffee or a bench — today or tonight.",
    },
    item: { fr: '🪑 Chaise pliante', en: '🪑 Folding chair' },
  },

  // ── Curiosité ──
  {
    id: 'ev_lumiere', famille: 'curiosite', xp: 180, minutes: 60, weight: 10,
    title: { fr: "L'heure dorée", en: 'The golden hour' },
    text: {
      fr: "Dans l'heure qui vient, prends 5 minutes pour regarder la lumière quelque part — dehors, à une fenêtre, peu importe.",
      en: "Within the next hour, take 5 minutes to watch the light somewhere — outside, at a window, anywhere.",
    },
    item: { fr: '✨ Éclat de lumière', en: '✨ Shard of light' },
  },
  {
    id: 'ev_pierre', famille: 'curiosite', xp: 170, minutes: 45, weight: 9,
    title: { fr: 'La pierre étrange', en: 'The strange stone' },
    text: {
      fr: "Trouve un caillou, une feuille ou un petit objet naturel qui te plaît — garde-le ou photographie-le.",
      en: "Find a pebble, a leaf or a small natural object you like — keep it or photograph it.",
    },
    item: { fr: '🪨 Pierre étrange', en: '🪨 Strange stone' },
  },
  {
    id: 'ev_bibliotheque', famille: 'curiosite', xp: 220, minutes: 120, weight: 7,
    title: { fr: 'Le rayon au hasard', en: 'The random shelf' },
    text: {
      fr: "Ouvre un livre, un magazine ou un article au hasard — lis 2 pages / 2 écrans, note une idée.",
      en: "Open a book, magazine or article at random — read 2 pages / 2 screens, note one idea.",
    },
    item: { fr: '📖 Marque-page errant', en: '📖 Wandering bookmark' },
  },
  {
    id: 'ev_enigme_matin', famille: 'curiosite', xp: 160, minutes: 40, weight: 8, moment: 'matin',
    title: { fr: 'L’énigme du réveil', en: 'The waking riddle' },
    text: {
      fr: "Ce matin, invente une question absurde sur ton quartier et cherche une vraie réponse en 10 minutes.",
      en: "This morning, invent an absurd question about your neighbourhood and find a real answer in 10 minutes.",
    },
    item: { fr: '🧩 Pièce d’énigme', en: '🧩 Riddle piece' },
  },

  // ── Création ──
  {
    id: 'ev_objet', famille: 'creation', xp: 210, minutes: 120, weight: 9,
    title: { fr: "L'objet trouvé", en: 'The found object' },
    text: {
      fr: "Ramasse (ou photographie) un objet abandonné qui raconte une histoire, et invente laquelle.",
      en: "Pick up (or photograph) a discarded object that tells a story, and invent which one.",
    },
    item: { fr: '📦 Relique de trottoir', en: '📦 Kerbside relic' },
  },
  {
    id: 'ev_croquis', famille: 'creation', xp: 190, minutes: 45, weight: 8,
    title: { fr: 'Le croquis volé', en: 'The stolen sketch' },
    text: {
      fr: "Dessine ou photographie volontairement mal quelque chose que tu vois — 2 minutes chrono.",
      en: "Draw or deliberately take a bad photo of something you see — 2-minute timer.",
    },
    item: { fr: '✏️ Mine brisée', en: '✏️ Broken lead' },
  },
  {
    id: 'ev_playlist', famille: 'creation', xp: 180, minutes: 60, weight: 7,
    title: { fr: 'La bande-son du jour', en: 'Today’s soundtrack' },
    text: {
      fr: "Compose une mini-playlist de 3 titres qui raconte ta journée — écoute-en au moins un.",
      en: "Make a 3-track mini-playlist that tells your day — listen to at least one.",
    },
    item: { fr: '🎵 Partition pliée', en: '🎵 Folded score' },
  },

  // ── Quotidien ──
  {
    id: 'ev_silence', famille: 'quotidien', xp: 200, minutes: 30, weight: 10,
    title: { fr: 'La zone calme', en: 'The quiet zone' },
    text: {
      fr: "Pendant 15 minutes aujourd'hui, coupe toutes les notifications et fais une seule chose.",
      en: "For 15 minutes today, silence every notification and do one single thing.",
    },
    item: { fr: '🌙 Pierre de calme', en: '🌙 Calm stone' },
  },
  {
    id: 'ev_mission_tiroir', famille: 'quotidien', xp: 170, minutes: 40, weight: 8,
    title: { fr: 'La mission tiroir', en: 'The drawer mission' },
    text: {
      fr: "Choisis un tiroir, un sac ou une poche : range-le comme une quête chronométrée (5 minutes).",
      en: "Pick a drawer, bag or pocket: tidy it like a timed quest (5 minutes).",
    },
    item: { fr: '🗝 Clé de rangement', en: '🗝 Tidying key' },
  },
  {
    id: 'ev_serie', famille: 'quotidien', xp: 230, minutes: 20, weight: 7, minStreak: 3,
    title: { fr: 'Le feu de camp', en: 'The campfire' },
    text: {
      fr: "Ta série tient. Célèbre-la : 5 minutes sans écran, juste respirer ou regarder dehors.",
      en: "Your streak holds. Celebrate it: 5 screen-free minutes, just breathe or look outside.",
    },
    item: { fr: '🔥 Braise de série', en: '🔥 Streak ember' },
  },

  // ── Chaos ──
  {
    id: 'ev_roi_du_banc', famille: 'chaos', xp: 200, minutes: 60, weight: 8,
    title: { fr: 'Le roi du banc', en: 'King of the bench' },
    text: {
      fr: "Pendant 10 minutes, décide que le prochain banc (ou siège public) est ton trône — observe ton royaume.",
      en: "For 10 minutes, decide the next bench (or public seat) is your throne — survey your realm.",
    },
    item: { fr: '👑 Couronne de bois', en: '👑 Wooden crown' },
  },
  {
    id: 'ev_de_invisible', famille: 'chaos', xp: 210, minutes: 90, weight: 8,
    title: { fr: 'Le dé invisible', en: 'The invisible die' },
    text: {
      fr: "Pour ta prochaine décision sans enjeu, lance un dé mental (1–6) et obéis au résultat.",
      en: "For your next low-stakes decision, roll a mental die (1–6) and obey the result.",
    },
    item: { fr: '🎲 Dé fantôme', en: '🎲 Ghost die' },
  },
  {
    id: 'ev_agent_chaos', famille: 'chaos', xp: 260, minutes: 120, weight: 5, requireFamily: 'chaos', requireFamilyN: 3,
    title: { fr: 'Licence d’agent du chaos', en: 'Chaos agent licence' },
    text: {
      fr: "Tu as assez improvisé. Invente une règle absurde pour 20 minutes et tiens-la sans déranger personne.",
      en: "You’ve improvised enough. Invent an absurd rule for 20 minutes and keep it without bothering anyone.",
    },
    item: { fr: '📜 Licence pliée', en: '📜 Folded licence' },
  },

  // ── Transversal / progression ──
  {
    id: 'ev_sommet', famille: 'exploration', xp: 300, minutes: 180, weight: 4, minLevel: 8,
    title: { fr: 'L’appel de la crête', en: 'Call of the ridge' },
    text: {
      fr: "La montagne de ta carte s’est ouverte. Va quelque part un peu plus loin / plus haut que d’habitude aujourd’hui.",
      en: "The mountain on your map has opened. Go somewhere a little farther / higher than usual today.",
    },
    item: { fr: '🏔 Éclat de crête', en: '🏔 Ridge shard' },
  },
  {
    id: 'ev_doux', famille: 'social', xp: 160, minutes: 60, weight: 11, maxComfort: 2,
    title: { fr: 'La porte entrouverte', en: 'The ajar door' },
    text: {
      fr: "Version douce : souris ou dis bonjour à une personne que tu croises — rien de plus, si tu veux.",
      en: "Gentle version: smile or say hello to someone you pass — nothing more, if you want.",
    },
    item: { fr: '🌱 Graine de seuil', en: '🌱 Threshold seed' },
  },

  // ── Extensions variété ──
  {
    id: 'ev_atelier_minute', famille: 'creation', xp: 200, minutes: 45, weight: 8,
    title: { fr: 'L’atelier minute', en: 'The one-minute workshop' },
    text: {
      fr: "Chronomètre 10 minutes : fabrique ou arrange quelque chose de petit — même bancal.",
      en: "Set a 10-minute timer: make or arrange something small — even crooked.",
    },
    item: { fr: '🧵 Bobine d’atelier', en: '🧵 Workshop spool' },
  },
  {
    id: 'ev_recette', famille: 'creation', xp: 220, minutes: 120, weight: 7,
    title: { fr: 'La recette improvisée', en: 'The improvised recipe' },
    text: {
      fr: "Cuisine ou assemble un truc que tu n’as jamais fait exactement comme ça — même simple.",
      en: "Cook or assemble something you’ve never made exactly that way — even simple.",
    },
    item: { fr: '🥄 Cuillère annotée', en: '🥄 Annotated spoon' },
  },
  {
    id: 'ev_photo_absurde', famille: 'creation', xp: 180, minutes: 40, weight: 8,
    title: { fr: 'Le cliché absurde', en: 'The absurd shot' },
    text: {
      fr: "Prends une photo volontairement ratée d’un objet ordinaire — et donne-lui un titre noble.",
      en: "Take a deliberately bad photo of an ordinary object — and give it a noble title.",
    },
    item: { fr: '📷 Négatif plié', en: '📷 Folded negative' },
  },
  {
    id: 'ev_lit_range', famille: 'quotidien', xp: 160, minutes: 20, weight: 9, moment: 'matin',
    title: { fr: 'Le campement du matin', en: 'Morning campsite' },
    text: {
      fr: "Ce matin, range ton lit (ou ton coin nuit) comme si tu préparais un camp avant la route.",
      en: "This morning, make your bed (or night corner) as if preparing camp before the road.",
    },
    item: { fr: '🛏 Drap de route', en: '🛏 Road sheet' },
  },
  {
    id: 'ev_inbox_zero', famille: 'quotidien', xp: 190, minutes: 45, weight: 7,
    title: { fr: 'La quête des trois messages', en: 'The three-message quest' },
    text: {
      fr: "Traite exactement trois messages / notifs en attente — pas plus, pas moins — puis stop.",
      en: "Handle exactly three waiting messages / notifications — no more, no less — then stop.",
    },
    item: { fr: '✉ Cachet « trois »', en: '✉ Seal of three' },
  },
  {
    id: 'ev_pas_chausson', famille: 'quotidien', xp: 150, minutes: 30, weight: 8,
    title: { fr: 'Les chaussons d’aventure', en: 'Adventure slippers' },
    text: {
      fr: "Fais une petite tâche ménagère en te chronométrant comme une mission (5 minutes max).",
      en: "Do a small chore on a timer like a mission (5 minutes max).",
    },
    item: { fr: '🧦 Chausson estampillé', en: '🧦 Stamped slipper' },
  },
  {
    id: 'ev_miroir', famille: 'chaos', xp: 180, minutes: 30, weight: 8,
    title: { fr: 'Le miroir complice', en: 'The accomplice mirror' },
    text: {
      fr: "Pendant 5 minutes, parle à ton reflet comme à un compagnon d’aventure (même tout bas).",
      en: "For 5 minutes, talk to your reflection like an adventure companion (even quietly).",
    },
    item: { fr: '🪞 Éclat de miroir', en: '🪞 Mirror shard' },
  },
  {
    id: 'ev_nom_secret', famille: 'chaos', xp: 170, minutes: 60, weight: 8,
    title: { fr: 'Le nom de code', en: 'The codename' },
    text: {
      fr: "Donne un nom de code ridicule à ta prochaine activité banale — et utilise-le mentalement jusqu’à la fin.",
      en: "Give a ridiculous codename to your next mundane activity — and use it mentally until you’re done.",
    },
    item: { fr: '🗂 Fiche classifiée', en: '🗂 Classified card' },
  },
  {
    id: 'ev_ombre_guide', famille: 'chaos', xp: 190, minutes: 40, weight: 7,
    title: { fr: 'Le guide d’ombre', en: 'The shadow guide' },
    text: {
      fr: "Dehors ou près d’une fenêtre : suis ton ombre 5 minutes comme un éclaireur officiel.",
      en: "Outside or by a window: follow your shadow for 5 minutes as an official scout.",
    },
    item: { fr: '🕯 Flamme d’ombre', en: '🕯 Shadow flame' },
  },
  {
    id: 'ev_chapitre_3', famille: 'curiosite', xp: 200, minutes: 30, weight: 6, minLevel: 3,
    title: { fr: 'Le troisième chapitre', en: 'The third chapter' },
    text: {
      fr: "Tu as déjà tourné des pages. Note en 3 phrases ce que ton aventure a changé depuis le début.",
      en: "You’ve already turned pages. Note in 3 sentences what your adventure has changed since the start.",
    },
    item: { fr: '📗 Signet du chapitre III', en: '📗 Chapter III bookmark' },
  },
];
