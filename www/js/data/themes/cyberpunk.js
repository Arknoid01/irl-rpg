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

  // Aperçu boutique (ui/shop.js) : mettre './assets/videos/cyberpunk-preview.mp4'
  // (chemin depuis www/, comme les <link> d'index.html) une fois le fichier
  // ajouté — vidéo courte en boucle, sans son (l'attribut muted est de toute
  // façon obligatoire pour l'autoplay mobile). Tant que c'est null, la
  // boutique retombe sur l'aperçu live en CSS.
  previewVideo: './assets/videos/cyberpunk-preview.mp4',
};
