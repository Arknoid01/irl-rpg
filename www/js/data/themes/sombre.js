// Thème « Dark fantasy ». Voir ../themes.js pour le contrat attendu par un thème.

export default {
  label: { fr: 'Dark fantasy', en: 'Dark fantasy' },
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

  // Aperçu boutique : voir le commentaire dans cyberpunk.js.
  previewVideo: null,
};
