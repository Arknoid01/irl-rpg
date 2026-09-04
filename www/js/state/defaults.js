// Forme canonique de la sauvegarde. Toute nouvelle clé doit avoir une valeur
// par défaut ici (le merge au chargement s'appuie dessus).

export const SAVE_VERSION = 2;

export function defaultState() {
  return {
    version: SAVE_VERSION,
    onboarded: false,
    ageAck: false,

    name: '',
    lang: 'fr',            // 'fr' | 'en'
    theme: 'nordique',
    comfort: 3,            // 1..5 — plafond d'audace des quêtes proposées
    prefFamilies: [],      // familles mises en avant au tirage

    notifications: { enabled: false, hour: 9 },

    level: 1,
    xp: 0,
    skills: { curiosite: 0, social: 0, audace: 0, creativite: 0, discipline: 0, chaos: 0 },
    titles: [],

    streak: 0,
    lastActiveDate: null,  // 'YYYY-MM-DD' du dernier jour avec une quête/événement validé
    drawDate: null,        // 'YYYY-MM-DD' du tirage courant

    quests: [],            // quêtes du jour : { ...quest, status }
    event: null,           // événement du jour : { ...event, status }

    inventory: [],         // { item, date, from }
    journal: [],           // { date, text, kind }

    history: {
      social: { proposed: 0, skipped: 0, completed: 0 },
      familleCompleted: {},   // famille -> total
      recentFamilles: [],     // ~10 dernières familles validées
      completedQuestIds: [],  // anti-répétition (plafonné)
      totalCompleted: 0,
      daysPlayed: 0,
      bestStreak: 0,
      recentEventIds: [],   // anti-répétition événements
    },

    seeds: { companion: 0 },
  };
}
