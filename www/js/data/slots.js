// Pools de slots pour le générateur de quêtes (templates + params).
// Valeurs numériques = partagées FR/EN. Objets {fr,en} = libellés bilingues.

/** @type {Record<string, Array<number|string|{fr:string,en:string}>>} */
export const SLOT_POOLS = {
  duree_courte: [3, 5, 8, 10],
  duree_moyenne: [10, 15, 20],
  nombre_petit: [2, 3, 4, 5],
  nombre_moyen: [5, 7, 10],

  couleur: [
    { fr: 'rouge', en: 'red' },
    { fr: 'bleu', en: 'blue' },
    { fr: 'vert', en: 'green' },
    { fr: 'jaune', en: 'yellow' },
    { fr: 'orange', en: 'orange' },
    { fr: 'violet', en: 'purple' },
    { fr: 'blanc', en: 'white' },
    { fr: 'noir', en: 'black' },
  ],

  texture: [
    { fr: 'lisse', en: 'smooth' },
    { fr: 'rugueux', en: 'rough' },
    { fr: 'brillant', en: 'shiny' },
    { fr: 'mat', en: 'matte' },
    { fr: 'doux', en: 'soft' },
  ],

  son: [
    { fr: 'un oiseau', en: 'a bird' },
    { fr: 'une conversation lointaine', en: 'a distant conversation' },
    { fr: 'un moteur', en: 'an engine' },
    { fr: 'des pas', en: 'footsteps' },
    { fr: 'du vent', en: 'the wind' },
    { fr: 'une porte', en: 'a door' },
  ],

  lieu_proche: [
    { fr: 'un parc', en: 'a park' },
    { fr: 'une rue calme', en: 'a quiet street' },
    { fr: 'un coin de place', en: 'a corner of a square' },
    { fr: 'un passage piéton fréquenté', en: 'a busy crosswalk' },
    { fr: 'devant une vitrine', en: 'in front of a shop window' },
    { fr: 'près d’un arbre', en: 'near a tree' },
  ],

  objet_quotidien: [
    { fr: 'une clé', en: 'a key' },
    { fr: 'une tasse', en: 'a mug' },
    { fr: 'un livre', en: 'a book' },
    { fr: 'une chaussure', en: 'a shoe' },
    { fr: 'une plante', en: 'a plant' },
    { fr: 'un stylo', en: 'a pen' },
  ],

  geste_social: [
    { fr: 'un compliment sincère', en: 'a sincere compliment' },
    { fr: 'un vrai merci', en: 'a real thank-you' },
    { fr: 'une question simple (heure, chemin…)', en: 'a simple question (time, directions…)' },
    { fr: 'un bonjour franc', en: 'a clear hello' },
    { fr: 'une écoute attentive de 1 minute', en: 'one minute of careful listening' },
  ],

  contrainte_marche: [
    { fr: 'évite les lignes entre les dalles quand c’est sûr', en: 'avoid the lines between paving stones when safe' },
    { fr: 'à chaque choix sûr, tourne le plus à gauche', en: 'at each safe choice, turn furthest left' },
    { fr: 'à chaque choix sûr, tourne le plus à droite', en: 'at each safe choice, turn furthest right' },
    { fr: 'ralentis volontairement ton pas', en: 'deliberately slow your pace' },
    { fr: 'suis la plus jolie façade que tu vois', en: 'follow the nicest facade you can see' },
    { fr: 'reste du côté ombragé quand c’est possible', en: 'stay on the shady side when you can' },
  ],

  regle_absurde: [
    { fr: 'réponds « probablement » à toute question non urgente', en: 'answer “probably” to every non-urgent question' },
    { fr: 'compte à voix basse chaque porte rouge', en: 'quietly count every red door' },
    { fr: 'donne un titre de film à trois scènes ordinaires', en: 'give three ordinary scenes a movie title' },
    { fr: 'traite les bancs comme des postes de garde', en: 'treat benches as guard posts' },
    { fr: 'suis ton ombre comme un guide officiel', en: 'follow your shadow as an official guide' },
  ],

  medium_crea: [
    { fr: 'un croquis rapide', en: 'a quick sketch' },
    { fr: 'une photo volontairement bancale', en: 'a deliberately crooked photo' },
    { fr: 'trois phrases écrites', en: 'three written sentences' },
    { fr: 'une mélodie sifflée', en: 'a hummed tune' },
    { fr: 'un arrangement d’objets', en: 'an arrangement of objects' },
  ],

  tache_maison: [
    { fr: 'un coin de pièce', en: 'a corner of a room' },
    { fr: 'un tiroir', en: 'a drawer' },
    { fr: 'une surface de plan de travail', en: 'a stretch of countertop' },
    { fr: 'un sac ou une poche', en: 'a bag or pocket' },
    { fr: 'une étagère', en: 'a shelf' },
  ],

  sujet_apprendre: [
    { fr: 'un mot dans une autre langue', en: 'a word in another language' },
    { fr: 'un fait sur ta ville', en: 'a fact about your city' },
    { fr: 'le nom d’une constellation ou d’une plante', en: 'the name of a constellation or a plant' },
    { fr: 'une technique de 2 minutes (nœud, pli, astuce)', en: 'a 2-minute skill (knot, fold, tip)' },
  ],

  contrainte_sociale: [
    { fr: 'sans parler de toi', en: 'without talking about yourself' },
    { fr: 'en souriant vraiment', en: 'while smiling for real' },
    { fr: 'en une seule phrase', en: 'in a single sentence' },
    { fr: 'sans regarder ton téléphone juste après', en: 'without checking your phone right after' },
    { fr: 'en gardant le contact des yeux une seconde de plus', en: 'holding eye contact one second longer' },
  ],

  objet_nature: [
    { fr: 'une feuille', en: 'a leaf' },
    { fr: 'un caillou', en: 'a pebble' },
    { fr: 'une brindille', en: 'a twig' },
    { fr: 'une plume', en: 'a feather' },
    { fr: 'un pétale', en: 'a petal' },
    { fr: 'un bout d’écorce', en: 'a scrap of bark' },
  ],

  odeur: [
    { fr: 'le café', en: 'coffee' },
    { fr: 'la pluie', en: 'rain' },
    { fr: 'le pain', en: 'bread' },
    { fr: 'le savon', en: 'soap' },
    { fr: 'le bois', en: 'wood' },
    { fr: 'les fleurs', en: 'flowers' },
  ],
};
