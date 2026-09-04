// Templates de quêtes — générateur modulaire (slots + texte).
// Chaque template produit une quête concrète via engine/generate.js.

const FB_SOCIAL = {
  fr: "Si l'occasion ne se présente pas naturellement, garde l'intention — validable dès qu'elle se présente.",
  en: "If the chance doesn't come up naturally, keep the intention — it counts as soon as it does.",
};
const FB_DEHORS = {
  fr: "Si la situation n'est pas sûre ou adaptée (circulation, monde, météo), fais-la simplement quand tu peux — priorité aux autres usagers.",
  en: "If it isn't safe or suitable (traffic, crowds, weather), just do it when you can — other people come first.",
};
const FB_LATER = {
  fr: "Un autre jour si ce n'est pas le moment.",
  en: "Another day if now isn't the time.",
};

/**
 * @typedef {object} QuestTemplate
 * @property {string} id
 * @property {string} famille
 * @property {number} xp
 * @property {'leger'|'moyen'|'consequent'} effort
 * @property {'quete'|'experience'} registre
 * @property {number} audace
 * @property {string[]} [contexte]
 * @property {{fr:string,en:string}} [safe_fallback]
 * @property {boolean} [defi_ami]
 * @property {string} [skill_bonus]
 * @property {Record<string,string>} slots  // slotName -> poolKey in SLOT_POOLS
 * @property {{fr:string,en:string}} text   // placeholders {slotName}
 */

/** @type {QuestTemplate[]} */
export const QUEST_TEMPLATES = [
  // ── Social ──
  {
    id: 'tpl_s_geste',
    famille: 'social', xp: 110, effort: 'leger', registre: 'quete', audace: 2,
    contexte: ['presence_gens'], safe_fallback: FB_SOCIAL, defi_ami: true,
    slots: { geste: 'geste_social' },
    text: {
      fr: "Aujourd’hui, offre {geste} à quelqu’un — naturellement, sans forcer.",
      en: "Today, offer {geste} to someone — naturally, without forcing it.",
    },
  },
  {
    id: 'tpl_s_nombre',
    famille: 'social', xp: 100, effort: 'leger', registre: 'experience', audace: 2,
    contexte: ['presence_gens'], safe_fallback: FB_SOCIAL,
    slots: { n: 'nombre_petit' },
    text: {
      fr: "Dis bonjour franchement à {n} personnes que tu croises et à qui tu n’aurais rien dit.",
      en: "Give a clear hello to {n} people you pass whom you wouldn’t normally greet.",
    },
  },
  {
    id: 'tpl_s_ecoute',
    famille: 'social', xp: 120, effort: 'moyen', registre: 'quete', audace: 2,
    contexte: ['presence_gens'], safe_fallback: FB_SOCIAL, defi_ami: true,
    slots: { n: 'nombre_petit' },
    text: {
      fr: "Dans une conversation, pose {n} questions de suite sans parler de toi.",
      en: "In a conversation, ask {n} questions in a row without talking about yourself.",
    },
  },

  // ── Exploration ──
  {
    id: 'tpl_e_contrainte',
    famille: 'exploration', xp: 100, effort: 'moyen', registre: 'quete', audace: 2,
    contexte: ['exterieur', 'trajet'], safe_fallback: FB_DEHORS,
    slots: { duree: 'duree_courte', contrainte: 'contrainte_marche' },
    text: {
      fr: "Marche {duree} minutes en appliquant cette règle : {contrainte}.",
      en: "Walk for {duree} minutes with this rule: {contrainte}.",
    },
  },
  {
    id: 'tpl_e_expedition',
    famille: 'exploration', xp: 130, effort: 'moyen', registre: 'quete', audace: 3,
    contexte: ['exterieur'], safe_fallback: FB_DEHORS,
    slots: { duree: 'duree_courte', contrainte: 'contrainte_marche', couleur: 'couleur' },
    text: {
      fr: "Expédition improvisée : explore {duree} min. Règle : {contrainte}. Objectif : trouve quelque chose de {couleur}.",
      en: "Improvised expedition: explore for {duree} min. Rule: {contrainte}. Goal: find something {couleur}.",
    },
  },
  {
    id: 'tpl_e_lieu',
    famille: 'exploration', xp: 90, effort: 'moyen', registre: 'quete', audace: 2,
    contexte: ['exterieur'], safe_fallback: FB_DEHORS,
    slots: { lieu: 'lieu_proche', duree: 'duree_courte' },
    text: {
      fr: "Passe {duree} minutes près de {lieu} que tu ne fréquentes pas d’habitude — juste pour voir.",
      en: "Spend {duree} minutes near {lieu} you don’t usually hang around — just to see.",
    },
  },
  {
    id: 'tpl_e_detour',
    famille: 'exploration', xp: 70, effort: 'leger', registre: 'experience', audace: 1,
    contexte: ['trajet', 'exterieur'], safe_fallback: FB_DEHORS,
    slots: { duree: 'duree_courte' },
    text: {
      fr: "Sur un trajet habituel, ajoute un détour volontaire de {duree} minutes.",
      en: "On a usual route, add a deliberate {duree}-minute detour.",
    },
  },

  // ── Curiosité ──
  {
    id: 'tpl_cu_couleur',
    famille: 'curiosite', xp: 70, effort: 'leger', registre: 'experience', audace: 1,
    contexte: [],
    slots: { duree: 'duree_courte', couleur: 'couleur' },
    text: {
      fr: "Pendant {duree} minutes, repère tout ce qui est {couleur} autour de toi.",
      en: "For {duree} minutes, notice everything around you that is {couleur}.",
    },
  },
  {
    id: 'tpl_cu_texture',
    famille: 'curiosite', xp: 80, effort: 'leger', registre: 'quete', audace: 1,
    contexte: [],
    slots: { n: 'nombre_petit', texture: 'texture' },
    text: {
      fr: "Trouve {n} surfaces {texture} que tu n’avais jamais vraiment touchées des yeux.",
      en: "Find {n} {texture} surfaces you had never really noticed.",
    },
  },
  {
    id: 'tpl_cu_son',
    famille: 'curiosite', xp: 80, effort: 'leger', registre: 'experience', audace: 1,
    contexte: [],
    slots: { duree: 'duree_courte', son: 'son' },
    text: {
      fr: "Pendant {duree} minutes, écoute jusqu’à entendre clairement {son}.",
      en: "For {duree} minutes, listen until you clearly hear {son}.",
    },
  },
  {
    id: 'tpl_cu_apprendre',
    famille: 'curiosite', xp: 100, effort: 'moyen', registre: 'quete', audace: 1,
    contexte: [],
    slots: { sujet: 'sujet_apprendre', duree: 'duree_courte' },
    text: {
      fr: "Apprends {sujet} en {duree} minutes chrono — puis explique-le à voix haute.",
      en: "Learn {sujet} in {duree} minutes flat — then explain it out loud.",
    },
  },
  {
    id: 'tpl_cu_details',
    famille: 'curiosite', xp: 90, effort: 'leger', registre: 'quete', audace: 1,
    contexte: [],
    slots: { n: 'nombre_moyen', lieu: 'lieu_proche' },
    text: {
      fr: "Près de {lieu}, note {n} détails que tu n’avais jamais remarqués.",
      en: "Near {lieu}, note {n} details you had never noticed.",
    },
  },

  // ── Création ──
  {
    id: 'tpl_cr_medium',
    famille: 'creation', xp: 100, effort: 'moyen', registre: 'quete', audace: 1,
    contexte: [],
    slots: { medium: 'medium_crea', objet: 'objet_quotidien' },
    text: {
      fr: "Crée {medium} à partir de {objet} (ou de son idée).",
      en: "Make {medium} from {objet} (or the idea of it).",
    },
  },
  {
    id: 'tpl_cr_photo',
    famille: 'creation', xp: 80, effort: 'leger', registre: 'experience', audace: 1,
    contexte: [],
    slots: { n: 'nombre_petit', couleur: 'couleur' },
    text: {
      fr: "Prends {n} photos dont le sujet principal est clairement {couleur}.",
      en: "Take {n} photos whose main subject is clearly {couleur}.",
    },
  },
  {
    id: 'tpl_cr_histoire',
    famille: 'creation', xp: 90, effort: 'leger', registre: 'quete', audace: 1,
    contexte: [],
    slots: { objet: 'objet_quotidien', n: 'nombre_petit' },
    text: {
      fr: "Invente une micro-histoire de {n} phrases où {objet} est le héros.",
      en: "Invent a micro-story of {n} sentences where {objet} is the hero.",
    },
  },
  {
    id: 'tpl_cr_duree',
    famille: 'creation', xp: 110, effort: 'moyen', registre: 'quete', audace: 2,
    contexte: [],
    slots: { duree: 'duree_courte', medium: 'medium_crea' },
    text: {
      fr: "Chronomètre {duree} minutes et produis {medium} sans te censurer.",
      en: "Set a {duree}-minute timer and produce {medium} without censoring yourself.",
    },
  },

  // ── Quotidien (toujours une torsion) ──
  {
    id: 'tpl_q_chrono',
    famille: 'quotidien', xp: 80, effort: 'leger', registre: 'quete', audace: 1,
    contexte: [],
    slots: { tache: 'tache_maison', duree: 'duree_courte' },
    text: {
      fr: "Mission express : range {tache} avant la fin d’un chrono de {duree} minutes.",
      en: "Express mission: tidy {tache} before a {duree}-minute timer ends.",
    },
  },
  {
    id: 'tpl_q_hasard',
    famille: 'quotidien', xp: 70, effort: 'leger', registre: 'quete', audace: 1,
    contexte: [],
    slots: { tache: 'tache_maison', n: 'nombre_petit' },
    text: {
      fr: "Lance un dé mental (1–{n}) : ce chiffre = le nombre de gestes utiles sur {tache}. Exécute.",
      en: "Roll a mental die (1–{n}): that number = useful actions on {tache}. Do them.",
    },
  },
  {
    id: 'tpl_q_narratif',
    famille: 'quotidien', xp: 90, effort: 'moyen', registre: 'quete', audace: 1,
    contexte: [],
    slots: { tache: 'tache_maison' },
    text: {
      fr: "Accomplis une vraie petite mission sur {tache} comme si tu préparais un campement pour demain.",
      en: "Complete a real little mission on {tache} as if preparing a campsite for tomorrow.",
    },
  },
  {
    id: 'tpl_q_matin',
    famille: 'quotidien', xp: 70, effort: 'leger', registre: 'experience', audace: 1,
    contexte: ['moment:matin'],
    slots: { duree: 'duree_courte' },
    text: {
      fr: "Ce matin, une seule chose à la fois pendant {duree} minutes — pas de téléphone en parallèle.",
      en: "This morning, one thing at a time for {duree} minutes — no phone alongside.",
    },
  },

  // ── Chaos ──
  {
    id: 'tpl_ch_regle',
    famille: 'chaos', xp: 80, effort: 'leger', registre: 'quete', audace: 2,
    contexte: [],
    slots: { duree: 'duree_moyenne', regle: 'regle_absurde' },
    text: {
      fr: "Pendant {duree} minutes, règle en vigueur : {regle}.",
      en: "For {duree} minutes, standing rule: {regle}.",
    },
  },
  {
    id: 'tpl_ch_couleur',
    famille: 'chaos', xp: 60, effort: 'leger', registre: 'experience', audace: 1,
    contexte: [],
    slots: { duree: 'duree_courte', couleur: 'couleur' },
    text: {
      fr: "Pendant {duree} minutes, compte tout ce qui est {couleur} — à voix basse si besoin.",
      en: "For {duree} minutes, count everything that is {couleur} — quietly if needed.",
    },
  },
  {
    id: 'tpl_ch_vehicule',
    famille: 'chaos', xp: 60, effort: 'leger', registre: 'experience', audace: 1,
    contexte: ['exterieur'], safe_fallback: FB_DEHORS,
    slots: { couleur: 'couleur', duree: 'duree_courte' },
    text: {
      fr: "La prochaine chose {couleur} que tu vois est ton « véhicule officiel » pendant {duree} minutes.",
      en: "The next {couleur} thing you see is your “official vehicle” for {duree} minutes.",
    },
  },
  {
    id: 'tpl_ch_dehors',
    famille: 'chaos', xp: 90, effort: 'moyen', registre: 'quete', audace: 2,
    contexte: ['exterieur'], safe_fallback: FB_DEHORS,
    slots: { duree: 'duree_courte', contrainte: 'contrainte_marche', regle: 'regle_absurde' },
    text: {
      fr: "Dehors, {duree} min : {contrainte}. Et en plus : {regle}.",
      en: "Outside, {duree} min: {contrainte}. Plus: {regle}.",
    },
  },

  // ── Cachées (générées) ──
  {
    id: 'tpl_h_couleur',
    famille: 'curiosite', xp: 110, effort: 'moyen', registre: 'quete', audace: 2,
    poids: 'mystere', contexte: ['exterieur'], safe_fallback: FB_DEHORS, hidden: true,
    slots: { couleur: 'couleur', n: 'nombre_petit' },
    text: {
      fr: "Trouve {n} choses {couleur} qui n’ont rien à faire ensemble — et invente le lien.",
      en: "Find {n} {couleur} things that don’t belong together — and invent the link.",
    },
    fragment: {
      fr: "Tu as forcé un lien entre des choses qui n’en avaient pas. C’est exactement le genre de magie quotidienne.",
      en: "You forced a link between things that had none. That’s exactly everyday magic.",
    },
  },
  {
    id: 'tpl_h_social',
    famille: 'social', xp: 140, effort: 'moyen', registre: 'quete', audace: 3,
    poids: 'mystere', contexte: ['presence_gens'], safe_fallback: FB_SOCIAL, hidden: true,
    slots: { geste: 'geste_social' },
    text: {
      fr: "Offre {geste} à quelqu’un que tu ne connais presque pas.",
      en: "Offer {geste} to someone you barely know.",
    },
    fragment: {
      fr: "Un geste simple, un visage nouveau. L’histoire retient parfois si peu — et c’est assez.",
      en: "A simple gesture, a new face. Stories sometimes keep so little — and that’s enough.",
    },
  },
];

export { FB_SOCIAL, FB_DEHORS, FB_LATER };
