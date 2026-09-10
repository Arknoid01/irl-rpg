// Mini-arcs secrets (ROADMAP Phase 3.3 — « le plus gros levier rétention »).
// Chaînes ??? → indice → ??? → indice → révélation. Le CONTENU (actions,
// indices, révélation) est neutre bilingue, comme la banque de quêtes ; c'est
// data/themes/<thème>.js `voice.arc` qui l'habille (voir engine/journal.js).
//
// Un arc à la fois. L'étape courante est proposée au tirage à la place d'un
// créneau « mystère » (engine/draw.js), s'affiche en ??? tant qu'elle n'est
// pas acceptée (comme les quêtes cachées), et fait avancer l'arc à la
// complétion (engine/game.js → engine/arcs.js).
//
// Une étape d'arc est toujours : effort léger, audace 2 (accessible à tous),
// jamais famille chaos. `contexte` sert au repli sûr et aux Découvertes.

const FB = {
  fr: "Garde l’idée pour quand ça se présente — rien ne presse.",
  en: "Keep the idea for when it comes up — no rush.",
};

/** @type {Array<{id:string, famille:string, steps:object[], loot:object}>} */
export const ARCS = [
  {
    id: 'passage',
    famille: 'exploration',
    steps: [
      {
        famille: 'exploration', xp: 110, contexte: ['exterieur'], safe_fallback: FB,
        text: {
          fr: "Repère un raccourci possible entre deux endroits de ton quotidien — un passage que tu n’as jamais pris.",
          en: "Spot a possible shortcut between two everyday places — a passage you’ve never taken.",
        },
        indice: {
          fr: "Il y avait un passage, juste là, que tu n’avais jamais vu.",
          en: "There was a passage, right there, that you’d never seen.",
        },
      },
      {
        famille: 'exploration', xp: 120, contexte: ['exterieur', 'trajet'], safe_fallback: FB,
        text: {
          fr: "Emprunte ce raccourci pour de vrai, une fois. Regarde où il débouche exactement.",
          en: "Actually take that shortcut, once. See where it really comes out.",
        },
        indice: {
          fr: "Le passage mène un peu ailleurs que tu croyais — plus loin, un peu de travers.",
          en: "The passage leads somewhere slightly other than you thought — farther, a little sideways.",
        },
      },
      {
        famille: 'curiosite', xp: 120, contexte: ['exterieur'], safe_fallback: FB,
        text: {
          fr: "Va à l’autre bout du passage et regarde ton quartier depuis là.",
          en: "Go to the far end of the passage and look at your neighbourhood from there.",
        },
        indice: {
          fr: "Vu de l’autre côté, ton quartier n’a pas tout à fait la même forme.",
          en: "Seen from the other side, your neighbourhood isn’t quite the same shape.",
        },
      },
      {
        famille: 'exploration', xp: 140, contexte: ['exterieur', 'trajet'], safe_fallback: FB,
        text: {
          fr: "Reprends ce raccourci une fois de plus — puis décide s’il entre dans tes trajets.",
          en: "Take that shortcut one more time — then decide whether it joins your routes.",
        },
        revelation: {
          fr: "Ce passage est à toi maintenant : une ligne de plus sur ta carte, que personne ne t’a donnée.",
          en: "This passage is yours now: one more line on your map, that nobody handed you.",
        },
      },
    ],
    loot: {
      item: { fr: '🧭 Tracé du passage', en: '🧭 Line of the passage' },
      kind: 'fragment',
      lore: {
        fr: "Un trait entre deux points que tu croyais séparés. La carte officielle ne le connaît pas.",
        en: "A line between two points you thought were separate. The official map doesn’t know it.",
      },
    },
  },

  {
    id: 'visage',
    famille: 'social',
    steps: [
      {
        famille: 'curiosite', xp: 100, contexte: ['presence_gens'], safe_fallback: FB,
        text: {
          fr: "Repère quelqu’un que tu croises souvent sans jamais lui parler — un commerçant, un voisin, un habitué.",
          en: "Notice someone you cross paths with often but never speak to — a shopkeeper, a neighbour, a regular.",
        },
        indice: {
          fr: "Il y a un visage qui revient dans tes journées. Tu ne connais pas son nom.",
          en: "There’s a face that keeps coming back through your days. You don’t know its name.",
        },
      },
      {
        famille: 'social', xp: 120, contexte: ['presence_gens'], safe_fallback: FB,
        text: {
          fr: "La prochaine fois que tu le croises, dis-lui bonjour. Rien de plus.",
          en: "Next time you pass them, say hello. Nothing more.",
        },
        indice: {
          fr: "Un bonjour échangé. Le visage a une voix, maintenant.",
          en: "A hello exchanged. The face has a voice now.",
        },
      },
      {
        famille: 'social', xp: 130, contexte: ['presence_gens'], safe_fallback: FB,
        text: {
          fr: "Pose-lui une petite question sans enjeu : l’heure, un conseil, la pluie qui vient.",
          en: "Ask them a small, stakes-free question: the time, a tip, the rain coming in.",
        },
        indice: {
          fr: "Dix secondes de conversation. C’est déjà une habitude qui commence.",
          en: "Ten seconds of conversation. That’s already a habit starting.",
        },
      },
      {
        famille: 'social', xp: 140, contexte: ['presence_gens'], safe_fallback: FB,
        text: {
          fr: "Souhaite-lui une bonne journée — par son rôle, ou son prénom si tu le connais.",
          en: "Wish them a good day — by their role, or their first name if you know it.",
        },
        revelation: {
          fr: "Ce visage fait partie de ton décor, et toi du sien. Ça s’est fait sans que tu décides rien de grand.",
          en: "This face is part of your scenery, and you of theirs. It happened without you deciding anything big.",
        },
      },
    ],
    loot: {
      item: { fr: '🪙 Jeton d’un visage connu', en: '🪙 Token of a known face' },
      kind: 'souvenir',
      lore: {
        fr: "Aucune valeur marchande. Il pèse le poids de quelques bonjours devenus une habitude.",
        en: "No market value. It weighs as much as a few hellos that became a habit.",
      },
    },
  },

  {
    id: 'objet',
    famille: 'creation',
    steps: [
      {
        famille: 'curiosite', xp: 100, contexte: ['exterieur'], safe_fallback: FB,
        text: {
          fr: "Ramasse (ou photographie) un petit objet abandonné qui attire ton œil.",
          en: "Pick up (or photograph) a small discarded object that catches your eye.",
        },
        indice: {
          fr: "Tu as gardé quelque chose que tout le monde aurait laissé.",
          en: "You kept something everyone else would have left behind.",
        },
      },
      {
        famille: 'creation', xp: 120, contexte: [], safe_fallback: FB,
        text: {
          fr: "Invente d’où il vient. Une phrase suffit.",
          en: "Invent where it came from. One sentence is enough.",
        },
        indice: {
          fr: "L’objet a une histoire, maintenant — celle que tu lui as donnée.",
          en: "The object has a story now — the one you gave it.",
        },
      },
      {
        famille: 'creation', xp: 130, contexte: [], safe_fallback: FB,
        text: {
          fr: "Décide : tu le gardes pour de bon, ou tu le reposes exactement où tu l’as trouvé.",
          en: "Decide: keep it for good, or put it back exactly where you found it.",
        },
        revelation: {
          fr: "Garder ou rendre, tu as choisi. L’objet aura servi à une chose : te faire regarder.",
          en: "Keep or return, you chose. The object will have done one thing: made you look.",
        },
      },
    ],
    loot: {
      item: { fr: '📦 L’objet gardé', en: '📦 The kept object' },
      kind: 'souvenir',
      lore: {
        fr: "Un déchet pour les autres. Pour toi, la preuve d’un jour où tu as regardé plus longtemps.",
        en: "Trash to others. To you, proof of a day you looked a little longer.",
      },
    },
  },

  {
    id: 'heure',
    famille: 'curiosite',
    steps: [
      {
        famille: 'curiosite', xp: 100, contexte: [], safe_fallback: FB,
        text: {
          fr: "Choisis un moment où tu es rarement dehors : tôt le matin, tard le soir.",
          en: "Pick a time you’re rarely outside: early morning, late evening.",
        },
        indice: {
          fr: "Il y a une heure que tu ne connais presque pas dans ton propre quartier.",
          en: "There’s an hour you barely know in your own neighbourhood.",
        },
      },
      {
        famille: 'exploration', xp: 120, contexte: ['exterieur'], safe_fallback: FB,
        text: {
          fr: "Sors 10 minutes à ce moment-là, dans un endroit que tu connais bien.",
          en: "Go out for 10 minutes at that time, somewhere you know well.",
        },
        indice: {
          fr: "Le même endroit, à cette heure : la lumière, le bruit, les gens — rien n’est pareil.",
          en: "The same place, at that hour: the light, the noise, the people — nothing is the same.",
        },
      },
      {
        famille: 'exploration', xp: 120, contexte: ['exterieur'], safe_fallback: FB,
        text: {
          fr: "Reviens une seconde fois, au même moment, au même endroit.",
          en: "Come back a second time, same moment, same place.",
        },
        indice: {
          fr: "Deux fois suffisent pour que ce soit à toi. Cette heure a ton nom, maintenant.",
          en: "Twice is enough to make it yours. That hour has your name on it now.",
        },
      },
      {
        famille: 'quotidien', xp: 140, contexte: ['exterieur'], safe_fallback: FB,
        text: {
          fr: "Fais une chose ordinaire à cette heure-là — marcher, boire quelque chose, t’asseoir — sans la presser.",
          en: "Do something ordinary at that hour — walk, drink something, sit down — without rushing it.",
        },
        revelation: {
          fr: "Tu as ajouté une heure à ta journée. Elle était là depuis toujours ; tu ne l’avais jamais habitée.",
          en: "You’ve added an hour to your day. It was always there; you’d just never lived in it.",
        },
      },
    ],
    loot: {
      item: { fr: '🕰 L’heure ajoutée', en: '🕰 The added hour' },
      kind: 'relic',
      lore: {
        fr: "Une aiguille sur un moment que tu ignorais. Elle ne sonne pas — elle rappelle juste que le jour est plus large que tu croyais.",
        en: "A hand on a moment you used to ignore. It doesn’t chime — it just recalls that the day is wider than you thought.",
      },
    },
  },
  {
    id: 'son',
    famille: 'curiosite',
    steps: [
      {
        famille: 'curiosite', xp: 100, contexte: [], safe_fallback: FB,
        text: {
          fr: "Rep\u00e8re un son que tu entends si souvent que tu ne l'\u00e9coutes plus (une horloge, la rue, un frigo).",
          en: "Notice a sound you hear so often you've stopped listening to it (a clock, the street, a fridge).",
        },
        indice: {
          fr: "Il y a un son qui t'accompagne tout le temps. Tu avais cess\u00e9 de l'entendre.",
          en: "There's a sound with you all the time. You'd stopped hearing it.",
        },
      },
      {
        famille: 'curiosite', xp: 110, contexte: [], safe_fallback: FB,
        text: {
          fr: "Passe une minute \u00e0 n'\u00e9couter que lui, comme s'il \u00e9tait nouveau.",
          en: "Spend a minute listening to nothing but it, as if it were new.",
        },
        indice: {
          fr: "\u00c9cout\u00e9 expr\u00e8s, il n'est pas si anodin. Il a un rythme, presque une intention.",
          en: "Listened to on purpose, it isn't so plain. It has a rhythm, almost an intent.",
        },
      },
      {
        famille: 'creation', xp: 120, contexte: [], safe_fallback: FB,
        text: {
          fr: "Trouve trois mots pour le d\u00e9crire \u00e0 quelqu'un qui ne l'a jamais entendu.",
          en: "Find three words to describe it to someone who's never heard it.",
        },
        indice: {
          fr: "Mis en mots, le son devient un objet. Tu peux le donner, maintenant.",
          en: "Put into words, the sound becomes an object. You can hand it over now.",
        },
      },
      {
        famille: 'curiosite', xp: 130, contexte: [], safe_fallback: FB,
        text: {
          fr: "Un jour o\u00f9 il s'arr\u00eate ou change, remarque-le \u2014 et ce que \u00e7a te fait.",
          en: "On a day it stops or shifts, notice it — and what that does to you.",
        },
        revelation: {
          fr: "Tu entends de nouveau ce qui \u00e9tait devenu invisible. Ton quotidien a regagn\u00e9 une voix \u2014 celle qu'il avait toujours eue.",
          en: "You hear again what had gone invisible. Your everyday got a voice back — the one it always had.",
        },
      },
    ],
    loot: {
      item: { fr: '\ud83c\udfa7 Le son retrouv\u00e9', en: '\ud83c\udfa7 The sound found again' },
      kind: 'fragment',
      lore: {
        fr: "La trace d'un bruit que tout le monde ignore et que toi, un jour, tu as vraiment \u00e9cout\u00e9.",
        en: "The trace of a noise everyone ignores and that you, one day, actually listened to.",
      },
    },
  },

  {
    id: 'graine',
    famille: 'creation',
    steps: [
      {
        famille: 'creation', xp: 100, contexte: [], safe_fallback: FB,
        text: {
          fr: "Fabrique ou choisis une petite chose sans valeur mais soign\u00e9e : un dessin, un galet, un mot pli\u00e9.",
          en: "Make or pick a small worthless but carefully-made thing: a drawing, a pebble, a folded note.",
        },
        indice: {
          fr: "Tu as fait quelque chose qui ne te servira pas. C'est fait expr\u00e8s.",
          en: "You made something that won't serve you. That's on purpose.",
        },
      },
      {
        famille: 'exploration', xp: 110, contexte: ['exterieur'], safe_fallback: FB,
        text: {
          fr: "Rep\u00e8re un endroit public o\u00f9 quelqu'un tombera dessus par hasard, sans g\u00eaner personne.",
          en: "Find a public spot where someone will come across it by chance, bothering no one.",
        },
        indice: {
          fr: "Il y a un endroit qui attend ta petite chose. Un rebord, une branche, un interstice.",
          en: "There's a spot waiting for your small thing. A ledge, a branch, a gap.",
        },
      },
      {
        famille: 'social', xp: 130, contexte: ['exterieur'], safe_fallback: FB,
        text: {
          fr: "Laisse-la l\u00e0 et repars sans regarder qui la prend.",
          en: "Leave it there and walk off without watching who takes it.",
        },
        revelation: {
          fr: "Ta petite chose vit sa vie maintenant, sans toi. Quelqu'un l'a peut-\u00eatre d\u00e9j\u00e0, et se demande d'o\u00f9 elle vient.",
          en: "Your small thing lives its own life now, without you. Someone may already have it, wondering where it came from.",
        },
      },
    ],
    loot: {
      item: { fr: '\ud83c\udf31 Ce que tu as sem\u00e9', en: '\ud83c\udf31 What you sowed' },
      kind: 'souvenir',
      lore: {
        fr: "Aucune preuve que \u00e7a a march\u00e9. C'est \u00e0 peu pr\u00e8s la d\u00e9finition d'un cadeau.",
        en: "No proof it worked. That's more or less the definition of a gift.",
      },
    },
  },

  {
    id: 'nom',
    famille: 'curiosite',
    steps: [
      {
        famille: 'curiosite', xp: 100, contexte: ['exterieur'], safe_fallback: FB,
        text: {
          fr: "Choisis un arbre, une plante ou un oiseau que tu croises tous les jours sans conna\u00eetre son nom.",
          en: "Pick a tree, a plant or a bird you pass every day without knowing its name.",
        },
        indice: {
          fr: "Il y a un \u00eatre vivant sur ta route dont tu ignores le nom. Il te voit passer depuis longtemps.",
          en: "There's a living thing on your way whose name you don't know. It's watched you pass for a while.",
        },
      },
      {
        famille: 'curiosite', xp: 110, contexte: [], safe_fallback: FB,
        text: {
          fr: "Trouve son nom \u2014 une appli, un livre, quelqu'un qui sait.",
          en: "Find its name — an app, a book, someone who knows.",
        },
        indice: {
          fr: "Il a un nom. \u00c7a change \u00e0 peine les choses, et pourtant.",
          en: "It has a name. It barely changes anything, and yet.",
        },
      },
      {
        famille: 'exploration', xp: 120, contexte: ['exterieur'], safe_fallback: FB,
        text: {
          fr: "Repasse devant, et cette fois salue-le par son nom \u2014 dans ta t\u00eate, \u00e7a compte.",
          en: "Walk past again, and this time greet it by name — in your head counts.",
        },
        revelation: {
          fr: "Nommer, c'est d\u00e9j\u00e0 conna\u00eetre un peu. Il y a une chose de plus sur ta route qui n'est plus \u00ab un truc \u00bb mais quelqu'un.",
          en: "To name is already to know a little. There's one more thing on your way that's no longer \u201ca thing\u201d but someone.",
        },
      },
    ],
    loot: {
      item: { fr: '\ud83c\udf43 Un nom sur ta route', en: '\ud83c\udf43 A name on your way' },
      kind: 'fragment',
      lore: {
        fr: "Un mot que tu ne connaissais pas la semaine derni\u00e8re, et qui d\u00e9signe maintenant un vieux voisin.",
        en: "A word you didn't know last week, now naming an old neighbour.",
      },
    },
  },
];
