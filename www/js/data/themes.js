// Thèmes — habillage + vocabulaire uniquement. Le gameplay ne change jamais.
// Couleurs/polices : styles/themes.css. Textes : bilingues { fr, en }.
//
// D4 : l'entité qui propose les quêtes est un « compagnon », jamais un maître du jeu.
// Le vocabulaire de thème n'habille que des mots de saveur ; tout le texte de
// sécurité / optionnalité reste identique quel que soit le thème.

export const DEFAULT_THEME = 'nordique';

export const THEMES = {
  nordique: {
    label: 'Fantasy nordique',
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
  },
  sombre: {
    label: 'Dark fantasy',
    dot: 'linear-gradient(135deg,#7a1f1f,#b8bcc2)',
    companionLines: {
      fr: [
        'Une présence discrète t’accompagne. De nouveaux contrats sont à prendre.',
        'Le silence pèse. Ta compagne de route a entendu parler de quelques affaires.',
        'La nuit sera longue. Voici ce qu’on peut faire d’ici demain.',
      ],
      en: [
        'A quiet presence walks with you. New contracts are on offer.',
        'The silence weighs. Your companion has heard of a few jobs.',
        'The night will be long. Here is what can be done by tomorrow.',
      ],
    },
    xpSuffix: { fr: '— le contrat est rempli', en: '— the contract is fulfilled' },
  },
  cyberpunk: {
    label: 'Néon nocturne',
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
  },
};

export const THEME_KEYS = Object.keys(THEMES);

export function companionLineFor(themeKey, lang, seed = 0) {
  const t = THEMES[themeKey] || THEMES[DEFAULT_THEME];
  const lines = t.companionLines[lang] || t.companionLines.fr;
  return lines[seed % lines.length];
}
