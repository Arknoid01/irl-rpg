// Taxonomie du musée (inventaire décoratif — pas d’économie / craft).
// cf. docs/IRL_RPG_ui_ux_spec.md §13 + DECISIONS.

/** @type {Record<string, { icon: string, label: {fr:string,en:string}, blurb: {fr:string,en:string} }>} */
export const LOOT_KINDS = {
  objet: {
    icon: '🎁',
    label: { fr: 'Objets', en: 'Objects' },
    blurb: {
      fr: 'Petites choses ramassées en chemin.',
      en: 'Little things picked up along the way.',
    },
  },
  fragment: {
    icon: '🗺',
    label: { fr: 'Fragments', en: 'Fragments' },
    blurb: {
      fr: 'Morceaux de carte, d’histoire, de quartier.',
      en: 'Bits of map, story, neighbourhood.',
    },
  },
  relic: {
    icon: '📜',
    label: { fr: 'Reliques', en: 'Relics' },
    blurb: {
      fr: 'Traces un peu plus anciennes — licences, sceaux, braises.',
      en: 'Older traces — licences, seals, embers.',
    },
  },
  souvenir: {
    icon: '📸',
    label: { fr: 'Souvenirs', en: 'Mementos' },
    blurb: {
      fr: 'Moments gardés pour le plaisir de s’en souvenir.',
      en: 'Moments kept for the joy of remembering.',
    },
  },
  collectible: {
    icon: '🏆',
    label: { fr: 'Collectibles', en: 'Collectibles' },
    blurb: {
      fr: 'Jalons de ton aventure — purement symboliques.',
      en: 'Milestones of your adventure — purely symbolic.',
    },
  },
};

export const LOOT_KIND_KEYS = Object.keys(LOOT_KINDS);

/** Reliques de niveau (portes de la carte). */
export const MILESTONE_LOOT = {
  3: {
    kind: 'collectible',
    item: { fr: '📗 Signet des premiers pas', en: '📗 First-steps bookmark' },
    lore: {
      fr: 'Trois niveaux. Le livre commence vraiment. Ce signet ne sert qu’à marquer le moment.',
      en: 'Three levels. The book truly begins. This bookmark only marks the moment.',
    },
    from: { fr: 'Niveau 3', en: 'Level 3' },
  },
  5: {
    kind: 'collectible',
    item: { fr: '🏅 Médaille des cinq feux', en: '🏅 Medal of five fires' },
    lore: {
      fr: 'Tu as tenu assez longtemps pour que le compagnon grave un premier jalon. Ça ne débloque rien — ça témoigne.',
      en: 'You held on long enough for your companion to carve a first milestone. It unlocks nothing — it bears witness.',
    },
    from: { fr: 'Niveau 5', en: 'Level 5' },
  },
  8: {
    kind: 'collectible',
    item: { fr: '🏔 Éclat de la crête', en: '🏔 Ridge shard' },
    lore: {
      fr: 'La montagne de ta carte s’est ouverte. Cet éclat n’ouvre aucune porte réelle — seulement le panorama.',
      en: 'The mountain on your map opened. This shard opens no real door — only the vista.',
    },
    from: { fr: 'Niveau 8 — Crête', en: 'Level 8 — Ridge' },
  },
  12: {
    kind: 'collectible',
    item: { fr: '🕯 Chandelle de la douzième veille', en: '🕯 Candle of the twelfth watch' },
    lore: {
      fr: 'Assez de veilles pour que le grimoire sente la cire. Toujours décoratif — toujours à toi.',
      en: 'Enough watches for the grimoire to smell of wax. Still decorative — still yours.',
    },
    from: { fr: 'Niveau 12', en: 'Level 12' },
  },
  15: {
    kind: 'collectible',
    item: { fr: '🏰 Clé du château lointain', en: '🏰 Key to the distant castle' },
    lore: {
      fr: 'Une silhouette sur le plateau. La clé ne tourne dans aucune serrure — elle rappelle jusqu’où tu es allé.',
      en: 'A silhouette on the board. The key turns in no lock — it recalls how far you went.',
    },
    from: { fr: 'Niveau 15 — Château', en: 'Level 15 — Castle' },
  },
};

/** Lore / catégorie par id d’événement. */
export const EVENT_LOOT_META = {
  ev_marchand: {
    kind: 'objet',
    lore: {
      fr: 'Encore chaud d’avoir été choisi. Une preuve que tu es entré quelque part pour la première fois.',
      en: 'Still warm from being chosen. Proof you stepped somewhere for the first time.',
    },
  },
  ev_porte: {
    kind: 'fragment',
    lore: {
      fr: 'Un coin de papier qui ne correspond à aucune carte officielle — seulement à ta journée.',
      en: 'A scrap of paper that matches no official map — only your day.',
    },
  },
  ev_visage: {
    kind: 'souvenir',
    lore: {
      fr: 'Un jeton sans valeur marchande. Il pèse le poids d’un mot dit.',
      en: 'A token with no market value. It weighs as much as a word spoken.',
    },
  },
  ev_lumiere: {
    kind: 'fragment',
    lore: {
      fr: 'Tu as regardé la lumière assez longtemps pour qu’elle te regarde en retour.',
      en: 'You watched the light long enough for it to look back.',
    },
  },
  ev_silence: {
    kind: 'relic',
    lore: {
      fr: 'Lisse, froide, inutile — sauf pour rappeler quinze minutes sans alerte.',
      en: 'Smooth, cold, useless — except to recall fifteen minutes without alerts.',
    },
  },
  ev_objet: {
    kind: 'objet',
    lore: {
      fr: 'Un déchet pour d’autres. Pour toi, le début d’une histoire inventée.',
      en: 'Trash to others. To you, the start of an invented story.',
    },
  },
  ev_detour_ami: {
    kind: 'objet',
    lore: {
      fr: 'Le hasard a un complice. Ce dé n’a jamais été lancé — et pourtant il a décidé.',
      en: 'Chance has an accomplice. This die was never rolled — and yet it decided.',
    },
  },
  ev_cafe: {
    kind: 'souvenir',
    lore: {
      fr: 'Le ticket d’un comptoir que tu ne connaissais pas. Goût encore vague.',
      en: 'A ticket from a counter you didn’t know. Taste still vague.',
    },
  },
  ev_pierre: {
    kind: 'objet',
    lore: {
      fr: 'Choisie sans raison solide. C’est exactement pour ça qu’elle compte.',
      en: 'Chosen for no solid reason. That’s exactly why it matters.',
    },
  },
  ev_balcon_monde: {
    kind: 'fragment',
    lore: {
      fr: 'Un verre qui grossit le soir. Tu as vu plus loin — même de peu.',
      en: 'A glass that enlarges the evening. You saw farther — even a little.',
    },
  },
  ev_carte_trou: {
    kind: 'fragment',
    lore: {
      fr: 'La boussole pointe vers un endroit que tu évitais. Elle a gagné.',
      en: 'The compass points somewhere you avoided. It won.',
    },
  },
  ev_lettre: {
    kind: 'relic',
    lore: {
      fr: 'Trois phrases, aucun retour exigé. Le sceau tient tout seul.',
      en: 'Three sentences, no reply required. The seal holds on its own.',
    },
  },
  ev_table: {
    kind: 'souvenir',
    lore: {
      fr: 'Une chaise pliante pour un repas qui a peut-être eu lieu. L’intention suffit.',
      en: 'A folding chair for a meal that may have happened. Intent is enough.',
    },
  },
  ev_bibliotheque: {
    kind: 'fragment',
    lore: {
      fr: 'Une page prise au hasard. L’idée notée n’appartient qu’à toi maintenant.',
      en: 'A page taken at random. The noted idea belongs only to you now.',
    },
  },
  ev_enigme_matin: {
    kind: 'objet',
    lore: {
      fr: 'Pièce d’un puzzle qui n’existait pas avant ta question.',
      en: 'A piece of a puzzle that didn’t exist before your question.',
    },
  },
  ev_croquis: {
    kind: 'souvenir',
    lore: {
      fr: 'Trait bancal, volontaire. La preuve que tu as regardé assez pour mal dessiner.',
      en: 'A crooked line, on purpose. Proof you looked long enough to draw badly.',
    },
  },
  ev_playlist: {
    kind: 'souvenir',
    lore: {
      fr: 'Trois titres pliés en quatre. La journée a une bande-son.',
      en: 'Three tracks folded in four. The day has a soundtrack.',
    },
  },
  ev_mission_tiroir: {
    kind: 'objet',
    lore: {
      fr: 'Une clé qui n’ouvre que le tiroir que tu as choisi de ranger.',
      en: 'A key that only opens the drawer you chose to tidy.',
    },
  },
  ev_serie: {
    kind: 'relic',
    lore: {
      fr: 'Une braise pour les jours enchaînés. Elle ne brûle pas si tu manques un jour.',
      en: 'An ember for chained days. It doesn’t burn you if you miss one.',
    },
  },
  ev_roi_du_banc: {
    kind: 'relic',
    lore: {
      fr: 'Couronne improvisée. Ton royaume faisait la taille d’un banc.',
      en: 'Improvised crown. Your realm was the size of a bench.',
    },
  },
  ev_de_invisible: {
    kind: 'objet',
    lore: {
      fr: 'Invisible, donc parfait. Personne ne peut contester le jet.',
      en: 'Invisible, therefore perfect. No one can contest the roll.',
    },
  },
  ev_agent_chaos: {
    kind: 'relic',
    lore: {
      fr: 'Licence sans autorité. Valable uniquement si tu inventes la règle.',
      en: 'A licence with no authority. Valid only if you invent the rule.',
    },
  },
  ev_sommet: {
    kind: 'collectible',
    lore: {
      fr: 'Même matière que la crête de ta carte. Preuve que tu es allé un peu plus loin.',
      en: 'Same stuff as the ridge on your map. Proof you went a little farther.',
    },
  },
  ev_doux: {
    kind: 'souvenir',
    lore: {
      fr: 'Une graine de seuil. Pas besoin de forcer la porte — l’entrouvrir suffit.',
      en: 'A threshold seed. No need to force the door — leaving it ajar is enough.',
    },
  },
  ev_atelier_minute: {
    kind: 'objet',
    lore: {
      fr: 'Dix minutes de fil. Le résultat est secondaire — le geste reste.',
      en: 'Ten minutes of thread. The result is secondary — the gesture remains.',
    },
  },
  ev_recette: {
    kind: 'souvenir',
    lore: {
      fr: 'Une cuillère qui a goûté quelque chose de nouveau. Même imparfait.',
      en: 'A spoon that tasted something new. Even imperfect.',
    },
  },
  ev_photo_absurde: {
    kind: 'souvenir',
    lore: {
      fr: 'Un négatif digne d’un portrait royal pour un objet banal.',
      en: 'A negative fit for a royal portrait of a mundane object.',
    },
  },
  ev_lit_range: {
    kind: 'objet',
    lore: {
      fr: 'Le camp est prêt. La route peut attendre — le lit, non.',
      en: 'Camp is ready. The road can wait — the bed cannot.',
    },
  },
  ev_inbox_zero: {
    kind: 'relic',
    lore: {
      fr: 'Trois messages, un cachet. La boîte n’est pas vide — elle est bornée.',
      en: 'Three messages, one seal. The inbox isn’t empty — it’s bounded.',
    },
  },
  ev_pas_chausson: {
    kind: 'objet',
    lore: {
      fr: 'Estampillé par cinq minutes de mission domestique.',
      en: 'Stamped by five minutes of domestic mission.',
    },
  },
  ev_miroir: {
    kind: 'relic',
    lore: {
      fr: 'Ton reflet a écouté. C’est déjà une conversation.',
      en: 'Your reflection listened. That’s already a conversation.',
    },
  },
  ev_nom_secret: {
    kind: 'fragment',
    lore: {
      fr: 'Classifié ridicule. L’activité banale a eu droit à un dossier.',
      en: 'Ridiculously classified. The mundane activity got a file.',
    },
  },
  ev_ombre_guide: {
    kind: 'fragment',
    lore: {
      fr: 'L’ombre mène parfois mieux que la carte.',
      en: 'Shadow sometimes leads better than the map.',
    },
  },
  ev_chapitre_3: {
    kind: 'collectible',
    lore: {
      fr: 'Trois phrases pour le chapitre III. Le grimoire s’épaissit.',
      en: 'Three sentences for chapter III. The grimoire thickens.',
    },
  },
};
