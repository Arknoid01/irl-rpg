// Événements aléatoires — cassent la routine, toujours facultatifs.
//
// Champs :
//   id, title{fr,en}, text{fr,en}, xp, item{fr,en}, minutes (indicatif)
//   memory{fr,en} — récit court à la 2e personne, au passé : ce que tu retiens
//                   de ce détour (journal). Jamais une consigne.
//   famille?     — lie l’événement à une région / compétences
//   weight?      — poids de base au tirage (défaut 10)
//   minLevel?, minStreak?, minComfort?, maxComfort?
//   moment?      — 'matin' | 'midi' | 'soir' (sinon tout moment)
//   requireFamily? / requireFamilyN? — débloqué après N quêtes de la famille
//   minDaysPlayed? — événement temporel (Phase 3.4)
//   requireMilestone? — écho d'un jalon déjà atteint (Phase 3.4)
//   comeback?    — accueil au retour après absence, jamais en rotation normale (Phase 1.3)

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
    memory: {
      fr: "Tu as poussé la porte d'une boulangerie où tu n'étais jamais entré. L'odeur, elle, était déjà familière.",
      en: "You pushed open the door of a bakery you'd never been into. The smell, though, was already familiar.",
    },
  },
  {
    id: 'ev_porte', famille: 'exploration', xp: 230, minutes: 120, weight: 10,
    title: { fr: "L'appel du hasard", en: 'The call of chance' },
    text: {
      fr: "Une porte inconnue s'est ouverte. Emprunte une rue que tu n'as jamais prise avant la fin de la journée.",
      en: "An unknown door has opened. Walk down a street you've never taken before the day ends.",
    },
    item: { fr: '🗺️ Fragment de carte', en: '🗺️ Map fragment' },
    memory: {
      fr: "Tu as pris une rue que tu ne connaissais pas. Elle menait à peu près là où tu allais — mais autrement.",
      en: "You took a street you didn't know. It led roughly where you were going — but by another way.",
    },
  },
  {
    id: 'ev_cafe', famille: 'exploration', xp: 190, minutes: 90, weight: 9,
    title: { fr: 'Le comptoir inconnu', en: 'The unknown counter' },
    text: {
      fr: "Prends quelque chose à boire (ou à grignoter) dans un endroit où tu n'as jamais commandé.",
      en: "Get a drink (or a snack) somewhere you've never ordered before.",
    },
    item: { fr: '☕ Ticket de comptoir', en: '☕ Counter ticket' },
    memory: {
      fr: "Tu as commandé quelque part où personne ne connaissait ton habitude. Toi non plus, ce jour-là.",
      en: "You ordered somewhere no one knew your usual. Neither did you, that day.",
    },
  },
  {
    id: 'ev_balcon_monde', famille: 'exploration', xp: 200, minutes: 60, weight: 8, moment: 'soir',
    title: { fr: 'Le balcon du monde', en: 'The world’s balcony' },
    text: {
      fr: "Ce soir, trouve un point de vue un peu plus haut que d’habitude (escalier, colline, étage) et regarde 3 minutes.",
      en: "Tonight, find a viewpoint a little higher than usual (stairs, hill, floor) and look for 3 minutes.",
    },
    item: { fr: '🔭 Lentille du soir', en: '🔭 Evening lens' },
    memory: {
      fr: "Tu as trouvé un endroit un peu plus haut et tu as regardé le soir tomber trois minutes. Personne n'a rien remarqué. Toi, si.",
      en: "You found a spot a little higher and watched the evening fall for three minutes. Nobody noticed. You did.",
    },
  },
  {
    id: 'ev_carte_trou', famille: 'exploration', xp: 240, minutes: 150, weight: 6, minLevel: 4,
    title: { fr: 'Le trou dans la carte', en: 'The hole in the map' },
    text: {
      fr: "Choisis un coin de ton quartier que tu évites d’habitude — passe-y 10 minutes sans but précis.",
      en: "Pick a corner of your neighbourhood you usually avoid — spend 10 minutes there with no set goal.",
    },
    item: { fr: '🧭 Boussole rayée', en: '🧭 Scratched compass' },
    memory: {
      fr: "Tu as passé dix minutes dans un coin que tu évites d'habitude. Il n'avait rien de spécial — sauf que tu y étais.",
      en: "You spent ten minutes in a corner you usually avoid. Nothing special about it — except that you were there.",
    },
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
    memory: {
      fr: "Tu as dit un mot à quelqu'un que tu connais à peine. Ça n'a duré qu'un instant, et c'était bien assez.",
      en: "You said a word to someone you barely know. It lasted only a moment, and that was plenty.",
    },
  },
  {
    id: 'ev_detour_ami', famille: 'social', xp: 220, minutes: 180, weight: 9,
    title: { fr: 'Mission complice', en: 'Accomplice mission' },
    text: {
      fr: "Envoie à un ami : « J'ai une mission, choisis A ou B. » Applique sa réponse à ta prochaine décision sans importance.",
      en: "Text a friend: “I've got a mission, pick A or B.” Apply their answer to your next unimportant decision.",
    },
    item: { fr: '🎲 Dé partagé', en: '🎲 Shared die' },
    memory: {
      fr: "Tu as laissé un ami trancher une décision minuscule à ta place. Le hasard portait sa voix.",
      en: "You let a friend settle a tiny decision for you. Chance was speaking in their voice.",
    },
  },
  {
    id: 'ev_lettre', famille: 'social', xp: 210, minutes: 90, weight: 8,
    title: { fr: 'La missive courte', en: 'The short missive' },
    text: {
      fr: "Écris un message sincère à quelqu’un — trois phrases max — sans attendre de réponse.",
      en: "Write a sincere message to someone — three sentences max — without expecting a reply.",
    },
    item: { fr: '✉ Sceau de papier', en: '✉ Paper seal' },
    memory: {
      fr: "Tu as écrit trois phrases sincères à quelqu'un, sans rien attendre en retour. Le message est parti quand même.",
      en: "You wrote someone three honest sentences, expecting nothing back. You sent it anyway.",
    },
  },
  {
    id: 'ev_table', famille: 'social', xp: 280, minutes: 300, weight: 5, minLevel: 5, minComfort: 3,
    title: { fr: 'La table improvisée', en: 'The improvised table' },
    text: {
      fr: "Propose à quelqu’un de partager un repas, un café ou un banc — aujourd’hui ou ce soir.",
      en: "Invite someone to share a meal, a coffee or a bench — today or tonight.",
    },
    item: { fr: '🪑 Chaise pliante', en: '🪑 Folding chair' },
    memory: {
      fr: "Tu as proposé de partager un moment — un café, un banc, peu importe. L'invitation comptait déjà, avant la réponse.",
      en: "You offered to share a moment — a coffee, a bench, it didn't matter. The offer already counted, before any answer.",
    },
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
    memory: {
      fr: "Tu n'avais pas prévu de t'arrêter là. Mais la lumière était trop belle pour continuer.",
      en: "You hadn't planned to stop there. But the light was too good to keep walking.",
    },
  },
  {
    id: 'ev_pierre', famille: 'curiosite', xp: 170, minutes: 45, weight: 9,
    title: { fr: 'La pierre étrange', en: 'The strange stone' },
    text: {
      fr: "Trouve un caillou, une feuille ou un petit objet naturel qui te plaît — garde-le ou photographie-le.",
      en: "Find a pebble, a leaf or a small natural object you like — keep it or photograph it.",
    },
    item: { fr: '🪨 Pierre étrange', en: '🪨 Strange stone' },
    memory: {
      fr: "Tu as ramassé un petit objet que personne d'autre n'aurait remarqué. Il ne vaut rien. Il est à toi.",
      en: "You picked up a small object no one else would have noticed. It's worth nothing. It's yours.",
    },
  },
  {
    id: 'ev_bibliotheque', famille: 'curiosite', xp: 220, minutes: 120, weight: 7,
    title: { fr: 'Le rayon au hasard', en: 'The random shelf' },
    text: {
      fr: "Ouvre un livre, un magazine ou un article au hasard — lis 2 pages / 2 écrans, note une idée.",
      en: "Open a book, magazine or article at random — read 2 pages / 2 screens, note one idea.",
    },
    item: { fr: '📖 Marque-page errant', en: '📖 Wandering bookmark' },
    memory: {
      fr: "Tu as ouvert quelque chose au hasard et lu deux pages. Une phrase t'est restée — tu ne sais pas encore pourquoi.",
      en: "You opened something at random and read two pages. One line stayed with you — you don't know why yet.",
    },
  },
  {
    id: 'ev_enigme_matin', famille: 'curiosite', xp: 160, minutes: 40, weight: 8, moment: 'matin',
    title: { fr: 'L’énigme du réveil', en: 'The waking riddle' },
    text: {
      fr: "Ce matin, invente une question absurde sur ton quartier et cherche une vraie réponse en 10 minutes.",
      en: "This morning, invent an absurd question about your neighbourhood and find a real answer in 10 minutes.",
    },
    item: { fr: '🧩 Pièce d’énigme', en: '🧩 Riddle piece' },
    memory: {
      fr: "Tu t'es posé une question idiote sur ton quartier, et tu as vraiment cherché la réponse. Tu l'as trouvée.",
      en: "You asked yourself a silly question about your neighbourhood, and actually looked for the answer. You found it.",
    },
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
    memory: {
      fr: "Tu as croisé un objet abandonné et tu lui as inventé une histoire. Elle est sûrement fausse. Elle vaut mieux que rien.",
      en: "You came across a discarded object and made up a story for it. It's surely wrong. It beats nothing.",
    },
  },
  {
    id: 'ev_croquis', famille: 'creation', xp: 190, minutes: 45, weight: 8,
    title: { fr: 'Le croquis volé', en: 'The stolen sketch' },
    text: {
      fr: "Dessine ou photographie volontairement mal quelque chose que tu vois — 2 minutes chrono.",
      en: "Draw or deliberately take a bad photo of something you see — 2-minute timer.",
    },
    item: { fr: '✏️ Mine brisée', en: '✏️ Broken lead' },
    memory: {
      fr: "Tu as dessiné quelque chose exprès mal, en deux minutes. Pour une fois, rater était le but — et c'était reposant.",
      en: "You drew something badly on purpose, in two minutes. For once, failing was the point — and it was a relief.",
    },
  },
  {
    id: 'ev_playlist', famille: 'creation', xp: 180, minutes: 60, weight: 7,
    title: { fr: 'La bande-son du jour', en: 'Today’s soundtrack' },
    text: {
      fr: "Compose une mini-playlist de 3 titres qui raconte ta journée — écoute-en au moins un.",
      en: "Make a 3-track mini-playlist that tells your day — listen to at least one.",
    },
    item: { fr: '🎵 Partition pliée', en: '🎵 Folded score' },
    memory: {
      fr: "Tu as choisi trois morceaux pour raconter ta journée. Mis bout à bout, ils disaient une chose que tu n'aurais pas su formuler.",
      en: "You picked three tracks to tell your day. Strung together, they said something you couldn't have put into words.",
    },
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
    memory: {
      fr: "Pendant quinze minutes, tu n'as fait qu'une seule chose. Le monde a continué sans t'attendre, et ça allait.",
      en: "For fifteen minutes, you did one single thing. The world carried on without waiting for you, and that was fine.",
    },
  },
  {
    id: 'ev_mission_tiroir', famille: 'quotidien', xp: 170, minutes: 40, weight: 8,
    title: { fr: 'La mission tiroir', en: 'The drawer mission' },
    text: {
      fr: "Choisis un tiroir, un sac ou une poche : range-le comme une quête chronométrée (5 minutes).",
      en: "Pick a drawer, bag or pocket: tidy it like a timed quest (5 minutes).",
    },
    item: { fr: '🗝 Clé de rangement', en: '🗝 Tidying key' },
    memory: {
      fr: "Tu as rangé un tiroir comme si c'était une quête chronométrée. Bêtement, ça a marché.",
      en: "You tidied a drawer as if it were a timed quest. Absurdly, it worked.",
    },
  },
  {
    id: 'ev_serie', famille: 'quotidien', xp: 230, minutes: 20, weight: 7, minStreak: 3,
    title: { fr: 'Le feu de camp', en: 'The campfire' },
    text: {
      fr: "Ta série tient. Célèbre-la : 5 minutes sans écran, juste respirer ou regarder dehors.",
      en: "Your streak holds. Celebrate it: 5 screen-free minutes, just breathe or look outside.",
    },
    item: { fr: '🔥 Braise de série', en: '🔥 Streak ember' },
    memory: {
      fr: "Ta série tenait, alors tu t'es accordé cinq minutes de rien. Juste respirer, en te disant que ça faisait déjà un bout de chemin.",
      en: "Your streak was holding, so you gave yourself five minutes of nothing. Just breathing, thinking how far it had already come.",
    },
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
    memory: {
      fr: "Pendant dix minutes, un banc a été ton trône et le trottoir ton royaume. Le règne fut court mais juste.",
      en: "For ten minutes, a bench was your throne and the pavement your realm. The reign was short but fair.",
    },
  },
  {
    id: 'ev_de_invisible', famille: 'chaos', xp: 210, minutes: 90, weight: 8,
    title: { fr: 'Le dé invisible', en: 'The invisible die' },
    text: {
      fr: "Pour ta prochaine décision sans enjeu, lance un dé mental (1–6) et obéis au résultat.",
      en: "For your next low-stakes decision, roll a mental die (1–6) and obey the result.",
    },
    item: { fr: '🎲 Dé fantôme', en: '🎲 Ghost die' },
    memory: {
      fr: "Tu as lancé un dé qui n'existait pas, et tu as obéi. Le résultat n'avait aucune importance — c'était bien l'idée.",
      en: "You rolled a die that didn't exist, and obeyed it. The outcome didn't matter — that was rather the point.",
    },
  },
  {
    id: 'ev_agent_chaos', famille: 'chaos', xp: 260, minutes: 120, weight: 5, requireFamily: 'chaos', requireFamilyN: 3,
    title: { fr: 'Licence d’agent du chaos', en: 'Chaos agent licence' },
    text: {
      fr: "Tu as assez improvisé. Invente une règle absurde pour 20 minutes et tiens-la sans déranger personne.",
      en: "You’ve improvised enough. Invent an absurd rule for 20 minutes and keep it without bothering anyone.",
    },
    item: { fr: '📜 Licence pliée', en: '📜 Folded licence' },
    memory: {
      fr: "Tu t'es imposé une règle absurde pendant vingt minutes, et tu l'as tenue. Personne n'en a rien su : c'était ton secret.",
      en: "You held yourself to an absurd rule for twenty minutes, and kept it. Nobody knew: it was your secret.",
    },
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
    memory: {
      fr: "Tu es allé un peu plus loin que d'habitude, juste parce que la carte s'était ouverte de ce côté. Le point de vue valait le détour.",
      en: "You went a little farther than usual, just because the map had opened that way. The view was worth the detour.",
    },
  },
  {
    id: 'ev_doux', famille: 'social', xp: 160, minutes: 60, weight: 11, maxComfort: 2,
    title: { fr: 'La porte entrouverte', en: 'The ajar door' },
    text: {
      fr: "Version douce : souris ou dis bonjour à une personne que tu croises — rien de plus, si tu veux.",
      en: "Gentle version: smile or say hello to someone you pass — nothing more, if you want.",
    },
    item: { fr: '🌱 Graine de seuil', en: '🌱 Threshold seed' },
    memory: {
      fr: "Tu as croisé un regard et tu as dit bonjour. Rien de plus. C'était déjà un lien, minuscule.",
      en: "You met someone's eyes and said hello. Nothing more. It was already a bond, a tiny one.",
    },
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
    memory: {
      fr: "En dix minutes tu as fabriqué quelque chose de petit et de bancal. Ça ne sert à rien. Tu l'as gardé quand même.",
      en: "In ten minutes you made something small and crooked. It's useless. You kept it anyway.",
    },
  },
  {
    id: 'ev_recette', famille: 'creation', xp: 220, minutes: 120, weight: 7,
    title: { fr: 'La recette improvisée', en: 'The improvised recipe' },
    text: {
      fr: "Cuisine ou assemble un truc que tu n’as jamais fait exactement comme ça — même simple.",
      en: "Cook or assemble something you’ve never made exactly that way — even simple.",
    },
    item: { fr: '🥄 Cuillère annotée', en: '🥄 Annotated spoon' },
    memory: {
      fr: "Tu as assemblé quelque chose que tu n'avais jamais fait exactement comme ça. C'était mangeable, et surtout : c'était à toi.",
      en: "You put together something you'd never made quite that way. It was edible, and above all: it was yours.",
    },
  },
  {
    id: 'ev_photo_absurde', famille: 'creation', xp: 180, minutes: 40, weight: 8,
    title: { fr: 'Le cliché absurde', en: 'The absurd shot' },
    text: {
      fr: "Prends une photo volontairement ratée d’un objet ordinaire — et donne-lui un titre noble.",
      en: "Take a deliberately bad photo of an ordinary object — and give it a noble title.",
    },
    item: { fr: '📷 Négatif plié', en: '📷 Folded negative' },
    memory: {
      fr: "Tu as pris une photo volontairement ratée d'un objet banal et tu lui as donné un titre grandiose. Elle mérite un cadre.",
      en: "You took a deliberately bad photo of a plain object and gave it a grand title. It deserves a frame.",
    },
  },
  {
    id: 'ev_lit_range', famille: 'quotidien', xp: 160, minutes: 20, weight: 9, moment: 'matin',
    title: { fr: 'Le campement du matin', en: 'Morning campsite' },
    text: {
      fr: "Ce matin, range ton lit (ou ton coin nuit) comme si tu préparais un camp avant la route.",
      en: "This morning, make your bed (or night corner) as if preparing camp before the road.",
    },
    item: { fr: '🛏 Drap de route', en: '🛏 Road sheet' },
    memory: {
      fr: "Tu as fait ton lit comme si tu levais le camp avant la route. La journée n'avait encore rien donné — mais elle commençait bien.",
      en: "You made your bed as if breaking camp before the road. The day had given nothing yet — but it started right.",
    },
  },
  {
    id: 'ev_inbox_zero', famille: 'quotidien', xp: 190, minutes: 45, weight: 7,
    title: { fr: 'La quête des trois messages', en: 'The three-message quest' },
    text: {
      fr: "Traite exactement trois messages / notifs en attente — pas plus, pas moins — puis stop.",
      en: "Handle exactly three waiting messages / notifications — no more, no less — then stop.",
    },
    item: { fr: '✉ Cachet « trois »', en: '✉ Seal of three' },
    memory: {
      fr: "Tu as traité exactement trois messages, puis tu t'es arrêté. Le reste pouvait attendre — et n'en est pas mort.",
      en: "You handled exactly three messages, then stopped. The rest could wait — and survived just fine.",
    },
  },
  {
    id: 'ev_pas_chausson', famille: 'quotidien', xp: 150, minutes: 30, weight: 8,
    title: { fr: 'Les chaussons d’aventure', en: 'Adventure slippers' },
    text: {
      fr: "Fais une petite tâche ménagère en te chronométrant comme une mission (5 minutes max).",
      en: "Do a small chore on a timer like a mission (5 minutes max).",
    },
    item: { fr: '🧦 Chausson estampillé', en: '🧦 Stamped slipper' },
    memory: {
      fr: "Tu as transformé une corvée en mission de cinq minutes. Elle n'est pas devenue amusante, mais elle est devenue courte.",
      en: "You turned a chore into a five-minute mission. It didn't become fun, but it became short.",
    },
  },
  {
    id: 'ev_miroir', famille: 'chaos', xp: 180, minutes: 30, weight: 8,
    title: { fr: 'Le miroir complice', en: 'The accomplice mirror' },
    text: {
      fr: "Pendant 5 minutes, parle à ton reflet comme à un compagnon d’aventure (même tout bas).",
      en: "For 5 minutes, talk to your reflection like an adventure companion (even quietly).",
    },
    item: { fr: '🪞 Éclat de miroir', en: '🪞 Mirror shard' },
    memory: {
      fr: "Tu as parlé à ton reflet comme à un compagnon de route, même tout bas. Il t'a écouté sans t'interrompre.",
      en: "You talked to your reflection like a travelling companion, even under your breath. It listened without interrupting.",
    },
  },
  {
    id: 'ev_nom_secret', famille: 'chaos', xp: 170, minutes: 60, weight: 8,
    title: { fr: 'Le nom de code', en: 'The codename' },
    text: {
      fr: "Donne un nom de code ridicule à ta prochaine activité banale — et utilise-le mentalement jusqu’à la fin.",
      en: "Give a ridiculous codename to your next mundane activity — and use it mentally until you’re done.",
    },
    item: { fr: '🗂 Fiche classifiée', en: '🗂 Classified card' },
    memory: {
      fr: "Tu as donné un nom de code ridicule à une tâche banale. Elle n'a pas changé — mais toi, tu souriais un peu.",
      en: "You gave a ridiculous codename to a plain task. It didn't change — but you were smiling a little.",
    },
  },
  {
    id: 'ev_ombre_guide', famille: 'chaos', xp: 190, minutes: 40, weight: 7,
    title: { fr: 'Le guide d’ombre', en: 'The shadow guide' },
    text: {
      fr: "Dehors ou près d’une fenêtre : suis ton ombre 5 minutes comme un éclaireur officiel.",
      en: "Outside or by a window: follow your shadow for 5 minutes as an official scout.",
    },
    item: { fr: '🕯 Flamme d’ombre', en: '🕯 Shadow flame' },
    memory: {
      fr: "Tu as suivi ton ombre pendant cinq minutes, comme un éclaireur. Elle t'a mené nulle part, exactement où il fallait.",
      en: "You followed your shadow for five minutes, like a scout. It led you nowhere in particular, exactly where you needed.",
    },
  },
  {
    id: 'ev_chapitre_3', famille: 'curiosite', xp: 200, minutes: 30, weight: 6, minLevel: 3,
    title: { fr: 'Le troisième chapitre', en: 'The third chapter' },
    text: {
      fr: "Tu as déjà tourné des pages. Note en 3 phrases ce que ton aventure a changé depuis le début.",
      en: "You’ve already turned pages. Note in 3 sentences what your adventure has changed since the start.",
    },
    item: { fr: '📗 Signet du chapitre III', en: '📗 Chapter III bookmark' },
    memory: {
      fr: "Tu as écrit trois phrases sur ce que tout ça avait changé. En les relisant, tu as vu que ce n'était pas rien.",
      en: "You wrote three sentences about what all this had changed. Rereading them, you saw it wasn't nothing.",
    },
  },

  // ── Événements spéciaux (Phase 3.4) : temporels + échos de jalon ──
  {
    id: 'ev_une_semaine', famille: 'curiosite', xp: 190, minutes: 15, weight: 8,
    minDaysPlayed: 7, requireMilestone: 'first_quest',
    title: { fr: 'Une semaine derrière toi', en: 'A week behind you' },
    text: {
      fr: "Ça fait à peu près une semaine que ton compagnon te propose des choses. Prends 3 minutes : note une aventure que tu n’aurais pas vécue sans lui.",
      en: "It’s been about a week of your companion offering you things. Take 3 minutes: note one adventure you wouldn’t have had without it.",
    },
    item: { fr: '📅 Marque de la première semaine', en: '📅 First-week mark' },
    memory: {
      fr: "Une semaine. Tu as noté une chose que tu n'aurais pas faite tout seul. Une seule a suffi à te convaincre.",
      en: "One week. You noted one thing you wouldn't have done on your own. Just one was enough to convince you.",
    },
  },
  {
    id: 'ev_un_mois', famille: 'curiosite', xp: 240, minutes: 20, weight: 7,
    minDaysPlayed: 30, requireMilestone: 'volume_10',
    title: { fr: 'Un mois de chemin', en: 'A month of road' },
    text: {
      fr: "Un mois. Relis une page ou deux de ton journal, puis écris une phrase : qu’est-ce qui a changé dans tes journées ?",
      en: "A month. Reread a page or two of your journal, then write one sentence: what has changed in your days?",
    },
    item: { fr: '🌗 Jeton du premier mois', en: '🌗 First-month token' },
    memory: {
      fr: "Un mois. Tu as relu deux pages de ton journal et écrit une phrase. Les journées, elles, avaient bougé sans faire de bruit.",
      en: "A month. You reread two pages of your journal and wrote one sentence. Your days, meanwhile, had shifted without a sound.",
    },
  },
  {
    id: 'ev_echo_inconnu', famille: 'social', xp: 220, minutes: 120, weight: 8,
    requireMilestone: 'first_social',
    title: { fr: 'L’écho d’une rencontre', en: 'The echo of an encounter' },
    text: {
      fr: "Tu as déjà osé parler à quelqu’un que tu ne connaissais pas. Aujourd’hui, si l’occasion vient : refais-le, une fois.",
      en: "You’ve already dared to talk to someone you didn’t know. Today, if the chance comes: do it again, once.",
    },
    item: { fr: '🔗 Second maillon', en: '🔗 Second link' },
    memory: {
      fr: "Tu l'avais déjà fait une fois. Cette fois, c'était un peu moins difficile — et tu l'as remarqué.",
      en: "You'd done it once before. This time it was a little less hard — and you noticed.",
    },
  },
  {
    id: 'ev_echo_mystere', famille: 'exploration', xp: 210, minutes: 90, weight: 7,
    requireMilestone: 'first_hidden',
    title: { fr: 'La piste qui reste', en: 'The trail that lingers' },
    text: {
      fr: "Une quête mystérieuse t’a déjà mené quelque part. Retourne à cet endroit — ou trouves-en un nouveau à explorer sans but.",
      en: "A mystery quest already led you somewhere. Go back there — or find a new place to wander with no goal.",
    },
    item: { fr: '🕯 Braise de curiosité', en: '🕯 Ember of curiosity' },
    memory: {
      fr: "Une piste t'avait mené quelque part, un jour. Tu y es retourné — ou tu en as trouvé une autre. Les deux comptent pareil.",
      en: "A trail had led you somewhere, once. You went back — or you found another. Both count the same.",
    },
  },

  // ── Accueil au retour (Phase 1.3) ──
  // `comeback: true` : jamais tiré en rotation normale (voir eventEligible),
  // seulement le jour où le joueur revient après une absence. Ton d'accueil,
  // jamais de reproche — le chemin est simplement resté ouvert.
  {
    id: 'ev_retour_chemin', comeback: true, xp: 150, minutes: 20, weight: 10,
    title: { fr: 'Le chemin est resté ouvert', en: 'The path stayed open' },
    text: {
      fr: "Ça faisait un moment. Rien n’a bougé sans toi. Reprends par une seule petite chose — celle que tu veux, aussi légère que tu veux.",
      en: "It’s been a while. Nothing moved on without you. Pick just one small thing back up — whichever you like, as light as you like.",
    },
    item: { fr: '🪧 Repère laissé en chemin', en: '🪧 Marker left on the path' },
    memory: {
      fr: "Ça faisait un moment. Tu as repris par une seule petite chose, et rien ne t'a reproché ton absence.",
      en: "It had been a while. You picked one small thing back up, and nothing held your absence against you.",
    },
  },
  {
    id: 'ev_retour_page', comeback: true, xp: 150, minutes: 15, weight: 9,
    title: { fr: 'La page t’attendait', en: 'The page was waiting' },
    text: {
      fr: "Le grimoire s’est rouvert exactement où tu l’avais laissé. Pas de rattrapage à faire : aujourd’hui compte à partir de maintenant.",
      en: "The book fell open right where you left it. Nothing to catch up on: today counts from now.",
    },
    item: { fr: '🔖 Signet resté en place', en: '🔖 Bookmark still in place' },
    memory: {
      fr: "Le grimoire s'est rouvert exactement où tu l'avais laissé. Tu n'avais rien à rattraper : la page t'attendait.",
      en: "The book fell open right where you left it. You had nothing to catch up on: the page was waiting.",
    },
  },
];
