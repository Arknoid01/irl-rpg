// Événements aléatoires — cassent la routine, toujours facultatifs.
// Champs : id, title{fr,en}, text{fr,en}, xp, item{fr,en}, minutes (indicatif).

export const EVENTS = [
  {
    id: 'ev_marchand', xp: 260, minutes: 90,
    title: { fr: 'Le marchand ambulant', en: 'The travelling merchant' },
    text: {
      fr: "Une occasion vient d'apparaître à proximité. Trouve dans la journée une boulangerie (ou un commerce de bouche) où tu n'es jamais allé.",
      en: "An opportunity just appeared nearby. Find, sometime today, a bakery (or food shop) you've never been to.",
    },
    item: { fr: '🥖 Pain légendaire', en: '🥖 Legendary bread' },
  },
  {
    id: 'ev_porte', xp: 230, minutes: 120,
    title: { fr: "L'appel du hasard", en: 'The call of chance' },
    text: {
      fr: "Une porte inconnue s'est ouverte. Emprunte une rue que tu n'as jamais prise avant la fin de la journée.",
      en: "An unknown door has opened. Walk down a street you've never taken before the day ends.",
    },
    item: { fr: '🗺️ Fragment de carte', en: '🗺️ Map fragment' },
  },
  {
    id: 'ev_visage', xp: 250, minutes: 240,
    title: { fr: 'Le visage familier', en: 'The familiar face' },
    text: {
      fr: "Quelqu'un que tu connais mal croisera peut-être ton chemin aujourd'hui. Si ça arrive, va lui dire un mot.",
      en: "Someone you barely know might cross your path today. If it happens, go say a word.",
    },
    item: { fr: '🤝 Jeton de confiance', en: '🤝 Token of trust' },
  },
  {
    id: 'ev_lumiere', xp: 180, minutes: 60,
    title: { fr: "L'heure dorée", en: 'The golden hour' },
    text: {
      fr: "Dans l'heure qui vient, prends 5 minutes pour regarder la lumière quelque part — dehors, à une fenêtre, peu importe.",
      en: "Within the next hour, take 5 minutes to watch the light somewhere — outside, at a window, anywhere.",
    },
    item: { fr: '✨ Éclat de lumière', en: '✨ Shard of light' },
  },
  {
    id: 'ev_silence', xp: 200, minutes: 30,
    title: { fr: 'La zone calme', en: 'The quiet zone' },
    text: {
      fr: "Pendant 15 minutes aujourd'hui, coupe toutes les notifications et fais une seule chose.",
      en: "For 15 minutes today, silence every notification and do one single thing.",
    },
    item: { fr: '🌙 Pierre de calme', en: '🌙 Calm stone' },
  },
  {
    id: 'ev_objet', xp: 210, minutes: 120,
    title: { fr: "L'objet trouvé", en: 'The found object' },
    text: {
      fr: "Ramasse (ou photographie) un objet abandonné qui raconte une histoire, et invente laquelle.",
      en: "Pick up (or photograph) a discarded object that tells a story, and invent which one.",
    },
    item: { fr: '📦 Relique de trottoir', en: '📦 Kerbside relic' },
  },
  {
    id: 'ev_detour_ami', xp: 220, minutes: 180,
    title: { fr: 'Mission complice', en: 'Accomplice mission' },
    text: {
      fr: "Envoie à un ami : « J'ai une mission, choisis A ou B. » Applique sa réponse à ta prochaine décision sans importance.",
      en: "Text a friend: “I've got a mission, pick A or B.” Apply their answer to your next unimportant decision.",
    },
    item: { fr: '🎲 Dé partagé', en: '🎲 Shared die' },
  },
  {
    id: 'ev_cafe', xp: 190, minutes: 90,
    title: { fr: 'Le comptoir inconnu', en: 'The unknown counter' },
    text: {
      fr: "Prends quelque chose à boire (ou à grignoter) dans un endroit où tu n'as jamais commandé.",
      en: "Get a drink (or a snack) somewhere you've never ordered before.",
    },
    item: { fr: '☕ Ticket de comptoir', en: '☕ Counter ticket' },
  },
  {
    id: 'ev_pierre', xp: 170, minutes: 45,
    title: { fr: 'La pierre étrange', en: 'The strange stone' },
    text: {
      fr: "Trouve un caillou, une feuille ou un petit objet naturel qui te plaît — garde-le ou photographie-le.",
      en: "Find a pebble, a leaf or a small natural object you like — keep it or photograph it.",
    },
    item: { fr: '🪨 Pierre étrange', en: '🪨 Strange stone' },
  },
];
