// Épreuves de passage (D21) : à partir du niveau 3, monter de niveau demande
// une épreuve choisie d'après ce que le joueur a le plus vécu pendant le
// niveau. Pas plus dure qu'une quête : plus originale, plus marquante.
// Chaque épreuve a un repli sûr (comme les quêtes) et un souvenir.
//
// familles : 1 famille, ou 2 pour un « duo » (tiré quand les deux familles
// dominantes du niveau sont proches). Texte de premier jet, à relire.

/** @type {Array<{id:string, familles:string[], title:object, text:object, safe_fallback:object, memory:object, item:object}>} */
export const ORDEALS = [
  /* ─────────────── Social ─────────────── */
  {
    id: 'o_pont', familles: ['social'],
    title: { fr: 'Le pont', en: 'The bridge' },
    text: {
      fr: 'Présente l’une à l’autre deux personnes de ton entourage qui ne se connaissent pas, et donne-leur une bonne raison de se parler.',
      en: 'Introduce two people you know who have never met, and give them a good reason to talk.',
    },
    safe_fallback: {
      fr: 'Un message à trois suffit. Si personne ne s’y prête, recommande à quelqu’un une personne que tu admires : le pont peut attendre.',
      en: 'A group message is enough. If nobody is up for it, recommend someone you admire to a friend: the bridge can wait.',
    },
    memory: {
      fr: 'Tu as relié deux fils qui ne se touchaient pas. Ce qu’ils en feront ne t’appartient plus, et c’est tout l’intérêt.',
      en: 'You tied together two threads that never touched. What they make of it is no longer yours, and that is the point.',
    },
    item: { fr: '🌉 Petit pont de corde', en: '🌉 Little rope bridge' },
  },
  {
    id: 'o_merci_tardif', familles: ['social'],
    title: { fr: 'Le merci en retard', en: 'The late thank-you' },
    text: {
      fr: 'Remercie quelqu’un pour une chose qu’il a faite pour toi il y a longtemps, et dont tu ne lui as jamais vraiment parlé.',
      en: 'Thank someone for something they did for you long ago, that you never really told them about.',
    },
    safe_fallback: {
      fr: 'Si tu ne peux pas le joindre, écris-lui la lettre quand même et garde-la.',
      en: 'If you can’t reach them, write the letter anyway and keep it.',
    },
    memory: {
      fr: 'Certains mercis mûrissent des années avant d’être prêts. Celui-là est enfin arrivé.',
      en: 'Some thank-yous ripen for years before they are ready. This one finally arrived.',
    },
    item: { fr: '✉️ Lettre scellée', en: '✉️ Sealed letter' },
  },
  {
    id: 'o_table', familles: ['social'],
    title: { fr: 'La table ouverte', en: 'The open table' },
    text: {
      fr: 'Partage un repas, un café ou une pause avec quelqu’un avec qui tu n’as jamais pris ce temps-là.',
      en: 'Share a meal, a coffee or a break with someone you have never taken that time with.',
    },
    safe_fallback: {
      fr: 'Si ce n’est pas possible cette semaine, propose simplement une date : l’invitation compte déjà.',
      en: 'If it can’t happen this week, just offer a date: the invitation already counts.',
    },
    memory: {
      fr: 'Une table, deux chaises, un peu de temps. Il n’en faut pas plus pour qu’un inconnu devienne quelqu’un.',
      en: 'A table, two chairs, a little time. That is all it takes for a stranger to become someone.',
    },
    item: { fr: '☕ Tasse dépareillée', en: '☕ Odd teacup' },
  },

  /* ─────────────── Exploration ─────────────── */
  {
    id: 'o_sans_carte', familles: ['exploration'],
    title: { fr: 'Sans carte', en: 'No map' },
    text: {
      fr: 'Marche 30 minutes sans regarder de carte, en choisissant tes tournants à l’instinct, puis retrouve ton chemin.',
      en: 'Walk for 30 minutes without looking at a map, choosing your turns on instinct, then find your way back.',
    },
    safe_fallback: {
      fr: 'En journée, dans un quartier que tu connais un peu. Le téléphone reste dans la poche, mais il reste là en cas de besoin.',
      en: 'In daylight, in an area you know a little. Your phone stays in your pocket, but it stays with you just in case.',
    },
    memory: {
      fr: 'Pendant une demi-heure, le chemin ne savait pas où il allait. Toi non plus. Vous vous êtes bien entendus.',
      en: 'For half an hour the path didn’t know where it was going. Neither did you. You got along fine.',
    },
    item: { fr: '🧭 Boussole sans aiguille', en: '🧭 Needleless compass' },
  },
  {
    id: 'o_point_haut', familles: ['exploration'],
    title: { fr: 'Le point haut', en: 'The high point' },
    text: {
      fr: 'Trouve le point le plus haut accessible près de chez toi (colline, pont, dernier étage) et regarde ton quartier d’en haut.',
      en: 'Find the highest reachable point near you (a hill, a bridge, a top floor) and look at your neighbourhood from above.',
    },
    safe_fallback: {
      fr: 'Seulement des lieux ouverts au public et sûrs. Une fenêtre d’étage fait très bien l’affaire.',
      en: 'Only safe places open to the public. An upstairs window works just fine.',
    },
    memory: {
      fr: 'D’en haut, tes trajets de tous les jours ressemblent à une carte. Tu as vu d’où tu viens.',
      en: 'From up there, your daily routes look like a map. You saw where you come from.',
    },
    item: { fr: '🏔 Caillou du sommet', en: '🏔 Summit pebble' },
  },
  {
    id: 'o_terminus', familles: ['exploration'],
    title: { fr: 'Le terminus', en: 'End of the line' },
    text: {
      fr: 'Va au bout d’une ligne de bus, de tram ou d’une longue rue, là où tu ne vas jamais, et restes-y dix minutes.',
      en: 'Go to the end of a bus or tram line, or of a long street, somewhere you never go, and stay there ten minutes.',
    },
    safe_fallback: {
      fr: 'De jour, avec un retour facile. À pied ou à vélo, ça compte pareil.',
      en: 'In daylight, with an easy way back. On foot or by bike counts just the same.',
    },
    memory: {
      fr: 'Tout le monde descend avant. Toi, tu es allé voir ce qu’il y avait au bout.',
      en: 'Everyone else gets off earlier. You went to see what was at the end.',
    },
    item: { fr: '🎫 Ticket du terminus', en: '🎫 End-of-line ticket' },
  },

  /* ─────────────── Curiosité ─────────────── */
  {
    id: 'o_transmettre', familles: ['curiosite'],
    title: { fr: 'Transmettre', en: 'Pass it on' },
    text: {
      fr: 'Explique à quelqu’un une chose que tu as apprise récemment, assez bien pour qu’il puisse la réexpliquer à son tour.',
      en: 'Explain something you learned recently to someone, well enough that they could explain it in turn.',
    },
    safe_fallback: {
      fr: 'Personne sous la main ? Écris l’explication en cinq phrases, comme pour un ami.',
      en: 'Nobody around? Write the explanation in five sentences, as if for a friend.',
    },
    memory: {
      fr: 'Tu sais vraiment une chose le jour où tu peux la donner. Ce jour-là, c’était aujourd’hui.',
      en: 'You truly know something the day you can give it away. Today was that day.',
    },
    item: { fr: '📜 Parchemin d’élève', en: '📜 Pupil’s scroll' },
  },
  {
    id: 'o_vraie_question', familles: ['curiosite'],
    title: { fr: 'La vraie question', en: 'The real question' },
    text: {
      fr: 'Choisis une question qui te trotte dans la tête depuis longtemps et passe une heure à y chercher une réponse : livres, gens, recherches.',
      en: 'Pick a question that has been on your mind for ages and spend an hour looking for an answer: books, people, research.',
    },
    safe_fallback: {
      fr: 'Une demi-heure suffit si la journée est pleine. Note ce que tu as trouvé, même si c’est « pas grand-chose ».',
      en: 'Half an hour is enough on a busy day. Write down what you found, even if it’s “not much”.',
    },
    memory: {
      fr: 'La question dormait depuis des années. Tu l’as réveillée et elle t’a emmené plus loin que prévu.',
      en: 'The question had been asleep for years. You woke it up and it took you further than planned.',
    },
    item: { fr: '🔍 Loupe de poche', en: '🔍 Pocket magnifier' },
  },
  {
    id: 'o_expert', familles: ['curiosite'],
    title: { fr: 'L’expert du coin', en: 'The local expert' },
    text: {
      fr: 'Demande à quelqu’un de te parler de son métier ou de sa passion pendant quinze minutes, et pose-lui au moins trois questions.',
      en: 'Ask someone to tell you about their job or passion for fifteen minutes, and ask them at least three questions.',
    },
    safe_fallback: {
      fr: 'Une vidéo ou un podcast d’un passionné peut remplacer la conversation, si tu notes tes trois questions.',
      en: 'A video or podcast by an enthusiast can stand in for the conversation, if you write down your three questions.',
    },
    memory: {
      fr: 'Tout le monde est l’expert de quelque chose. Tu as trouvé de quoi, et tu as écouté.',
      en: 'Everyone is an expert in something. You found out what, and you listened.',
    },
    item: { fr: '🎓 Insigne d’apprenti', en: '🎓 Apprentice badge' },
  },

  /* ─────────────── Création ─────────────── */
  {
    id: 'o_objet_temoin', familles: ['creation'],
    title: { fr: 'L’objet-témoin', en: 'The witness object' },
    text: {
      fr: 'Fabrique un petit objet qui résume ce que tu as vécu pendant ce niveau (dessin, bricolage, collage, texte) et garde-le.',
      en: 'Make a small object that sums up what you lived through this level (a drawing, a craft, a collage, a text) and keep it.',
    },
    safe_fallback: {
      fr: 'Fais-le à ta mesure : trois traits sur un post-it comptent autant qu’une sculpture.',
      en: 'Make it your size: three lines on a sticky note count as much as a sculpture.',
    },
    memory: {
      fr: 'Ce niveau tient maintenant dans un objet. Il ne vaut rien pour personne d’autre, et tout pour toi.',
      en: 'This level now fits in an object. It is worth nothing to anyone else, and everything to you.',
    },
    item: { fr: '🏺 Objet-témoin', en: '🏺 Witness object' },
  },
  {
    id: 'o_cadeau_main', familles: ['creation'],
    title: { fr: 'Le cadeau fait main', en: 'The handmade gift' },
    text: {
      fr: 'Crée quelque chose pour quelqu’un (une carte, une recette, une playlist, un dessin) et offre-le-lui.',
      en: 'Create something for someone (a card, a recipe, a playlist, a drawing) and give it to them.',
    },
    safe_fallback: {
      fr: 'Si tu ne peux pas le donner tout de suite, garde-le prêt : le fabriquer compte déjà.',
      en: 'If you can’t give it right away, keep it ready: making it already counts.',
    },
    memory: {
      fr: 'Un cadeau acheté dit « j’ai pensé à toi ». Celui-là dit « j’ai passé du temps avec toi, même seul ».',
      en: 'A bought gift says “I thought of you”. This one says “I spent time with you, even alone”.',
    },
    item: { fr: '🎁 Ruban noué', en: '🎁 Tied ribbon' },
  },
  {
    id: 'o_cinq_sens', familles: ['creation'],
    title: { fr: 'Une page, cinq sens', en: 'One page, five senses' },
    text: {
      fr: 'Remplis une page avec cinq observations du jour, une par sens : vue, ouïe, toucher, goût, odorat.',
      en: 'Fill a page with five observations from today, one per sense: sight, hearing, touch, taste, smell.',
    },
    safe_fallback: {
      fr: 'Des mots, des croquis ou des notes vocales : la forme importe peu.',
      en: 'Words, sketches or voice notes: the form doesn’t matter.',
    },
    memory: {
      fr: 'Une journée ordinaire, vue par cinq fenêtres à la fois. Elle n’était pas si ordinaire.',
      en: 'An ordinary day, seen through five windows at once. It wasn’t so ordinary after all.',
    },
    item: { fr: '📓 Page aux cinq sens', en: '📓 Five-senses page' },
  },

  /* ─────────────── Quotidien ─────────────── */
  {
    id: 'o_rituel', familles: ['quotidien'],
    title: { fr: 'Le rituel', en: 'The ritual' },
    text: {
      fr: 'Transforme une corvée que tu repousses en rituel à toi (une musique, un ordre, une petite récompense) et va jusqu’au bout.',
      en: 'Turn a chore you keep putting off into your own ritual (a song, an order, a small reward) and see it through.',
    },
    safe_fallback: {
      fr: 'Choisis une corvée courte si l’énergie manque. Le rituel compte plus que la taille.',
      en: 'Pick a short chore if energy is low. The ritual matters more than the size.',
    },
    memory: {
      fr: 'La corvée est devenue une cérémonie. Elle reviendra, mais elle ne sera plus tout à fait la même.',
      en: 'The chore became a ceremony. It will come back, but it won’t be quite the same.',
    },
    item: { fr: '🕯 Bougie du rituel', en: '🕯 Ritual candle' },
  },
  {
    id: 'o_coin_oublie', familles: ['quotidien'],
    title: { fr: 'Le coin oublié', en: 'The forgotten corner' },
    text: {
      fr: 'Remets en ordre un coin que tu évites depuis des semaines : un tiroir, un placard, un dossier sur l’ordinateur.',
      en: 'Sort out a corner you have been avoiding for weeks: a drawer, a cupboard, a folder on your computer.',
    },
    safe_fallback: {
      fr: 'Un seul tiroir suffit. Le but n’est pas la perfection.',
      en: 'A single drawer is enough. Perfection is not the goal.',
    },
    memory: {
      fr: 'Tu as ouvert la porte que tu contournais. Derrière, rien de terrible : juste de la place.',
      en: 'You opened the door you kept walking around. Behind it, nothing terrible: just room.',
    },
    item: { fr: '🗝 Clé du tiroir', en: '🗝 Drawer key' },
  },
  {
    id: 'o_expedition', familles: ['quotidien'],
    title: { fr: 'L’expédition de demain', en: 'Tomorrow’s expedition' },
    text: {
      fr: 'Prépare ta journée de demain comme une expédition : affaires prêtes, repas prévu, et une chose agréable au programme.',
      en: 'Prepare tomorrow like an expedition: things ready, a meal planned, and one pleasant thing on the schedule.',
    },
    safe_fallback: {
      fr: 'Même trois lignes sur un papier font une expédition.',
      en: 'Even three lines on a scrap of paper make an expedition.',
    },
    memory: {
      fr: 'Demain t’attend déjà, sac bouclé. Le toi d’aujourd’hui a fait un beau cadeau au toi de demain.',
      en: 'Tomorrow is already waiting, bag packed. Today’s you gave tomorrow’s you a fine gift.',
    },
    item: { fr: '🎒 Sac bouclé', en: '🎒 Packed bag' },
  },

  /* ─────────────── Chaos ─────────────── */
  {
    id: 'o_de_decide', familles: ['chaos'],
    title: { fr: 'Le dé décide', en: 'The die decides' },
    text: {
      fr: 'Laisse un dé (ou un tirage au sort) décider de trois choix de ta journée : où manger, quel chemin, quoi écouter.',
      en: 'Let a die (or a random draw) decide three choices in your day: where to eat, which way to go, what to listen to.',
    },
    safe_fallback: {
      fr: 'Seulement des choix sans conséquence. Tu gardes toujours ton droit de veto.',
      en: 'Only choices with no consequences. You always keep your right of veto.',
    },
    memory: {
      fr: 'Trois fois, tu as lâché le volant. La journée a pris des virages que tu n’aurais jamais choisis.',
      en: 'Three times you let go of the wheel. The day took turns you would never have chosen.',
    },
    item: { fr: '🎲 Dé fétiche', en: '🎲 Lucky die' },
  },
  {
    id: 'o_miroir', familles: ['chaos'],
    title: { fr: 'L’heure miroir', en: 'The mirror hour' },
    text: {
      fr: 'Pendant une heure, fais tout à l’inverse de tes habitudes : l’autre main, un autre ordre, une autre place.',
      en: 'For one hour, do everything the opposite of your habits: the other hand, another order, another seat.',
    },
    safe_fallback: {
      fr: 'Rien qui touche à la sécurité (conduite, cuisine chaude) : ne change que ce qui ne risque rien.',
      en: 'Nothing safety-related (driving, hot cooking): only change what carries no risk.',
    },
    memory: {
      fr: 'Une heure de l’autre côté du miroir. Tes habitudes ont eu l’air un peu surprises de te voir faire.',
      en: 'An hour on the other side of the mirror. Your habits looked a little surprised.',
    },
    item: { fr: '🪞 Éclat de miroir', en: '🪞 Mirror shard' },
  },
  {
    id: 'o_detail_absurde', familles: ['chaos'],
    title: { fr: 'Le détail absurde', en: 'The absurd detail' },
    text: {
      fr: 'Porte toute la journée un détail absurde et assumé (chaussettes dépareillées, badge fait maison) et invente son histoire si on te pose la question.',
      en: 'Wear an absurd, fully owned detail all day (odd socks, a homemade badge) and make up its story if anyone asks.',
    },
    safe_fallback: {
      fr: 'Le détail peut être invisible pour les autres : c’est toi qui sais.',
      en: 'The detail can be invisible to others: you know it’s there.',
    },
    memory: {
      fr: 'Toute la journée, un petit secret ridicule t’a tenu compagnie. Il avait une histoire, en plus.',
      en: 'All day long a ridiculous little secret kept you company. It even had a story.',
    },
    item: { fr: '🧦 Chaussette orpheline', en: '🧦 Orphan sock' },
  },

  /* ─────────────── Duos (deux familles proches) ─────────────── */
  {
    id: 'o_complice', familles: ['social', 'chaos'],
    title: { fr: 'Le complice', en: 'The accomplice' },
    text: {
      fr: 'Organise une petite surprise inoffensive pour quelqu’un, avec la complicité d’une autre personne.',
      en: 'Set up a small, harmless surprise for someone, with the help of an accomplice.',
    },
    safe_fallback: {
      fr: 'Une surprise gentille, jamais aux dépens de quelqu’un. Un mot caché compte aussi.',
      en: 'A kind surprise, never at anyone’s expense. A hidden note counts too.',
    },
    memory: {
      fr: 'Un clin d’œil entre complices, un sourire à l’arrivée. Le chaos, quand il est gentil, rapproche.',
      en: 'A wink between accomplices, a smile at the end. Chaos, when it is kind, brings people closer.',
    },
    item: { fr: '🎉 Confetti rescapé', en: '🎉 Surviving confetti' },
  },
  {
    id: 'o_enquete_rue', familles: ['exploration', 'curiosite'],
    title: { fr: 'L’enquête de quartier', en: 'The neighbourhood case' },
    text: {
      fr: 'Trouve l’histoire d’un lieu près de chez toi (un nom de rue, un bâtiment, une plaque), puis va le voir en sachant.',
      en: 'Find the story of a place near you (a street name, a building, a plaque), then go and see it knowing.',
    },
    safe_fallback: {
      fr: 'Si tu ne peux pas y aller, regarde-le en photo et raconte son histoire à quelqu’un.',
      en: 'If you can’t go, look at a photo and tell its story to someone.',
    },
    memory: {
      fr: 'Ce lieu, tu passais devant sans le voir. Maintenant il a un passé, et il te le raconte à chaque fois.',
      en: 'You used to walk past without seeing it. Now it has a past, and it tells you every time.',
    },
    item: { fr: '🏛 Plaque de rue', en: '🏛 Street plaque' },
  },
  {
    id: 'o_carnet_terrain', familles: ['creation', 'curiosite'],
    title: { fr: 'Le carnet de terrain', en: 'The field notebook' },
    text: {
      fr: 'Dessine ou décris en détail une plante, un bâtiment ou un objet, puis cherche ce que c’est vraiment.',
      en: 'Draw or describe a plant, a building or an object in detail, then find out what it really is.',
    },
    safe_fallback: {
      fr: 'Une photo annotée remplace très bien le dessin.',
      en: 'An annotated photo works just as well as a drawing.',
    },
    memory: {
      fr: 'Regarder assez longtemps pour dessiner, puis chercher assez loin pour comprendre : c’est ça, un naturaliste.',
      en: 'Looking long enough to draw, then digging deep enough to understand: that is what a naturalist does.',
    },
    item: { fr: '🌿 Croquis annoté', en: '🌿 Annotated sketch' },
  },
  {
    id: 'o_guide', familles: ['social', 'exploration'],
    title: { fr: 'Le guide', en: 'The guide' },
    text: {
      fr: 'Emmène quelqu’un dans un endroit que tu aimes et qu’il ne connaît pas encore.',
      en: 'Take someone to a place you love that they don’t know yet.',
    },
    safe_fallback: {
      fr: 'Si vous ne pouvez pas vous voir, fais la visite en photos et en récit par message.',
      en: 'If you can’t meet, give the tour in photos and a story by message.',
    },
    memory: {
      fr: 'Ton endroit a maintenant un deuxième gardien. Les lieux qu’on partage ne s’usent pas, ils s’agrandissent.',
      en: 'Your place now has a second keeper. Shared places don’t wear out, they grow.',
    },
    item: { fr: '🗺 Carte dessinée à deux', en: '🗺 Map drawn by two' },
  },
  {
    id: 'o_plat_signature', familles: ['quotidien', 'creation'],
    title: { fr: 'Le plat signature', en: 'The signature dish' },
    text: {
      fr: 'Invente ou revisite une recette simple, donne-lui un nom, et prépare-la.',
      en: 'Invent or rework a simple recipe, give it a name, and make it.',
    },
    safe_fallback: {
      fr: 'Une tartine revisitée est un plat signature tout à fait honorable.',
      en: 'A reinvented slice of toast is a perfectly respectable signature dish.',
    },
    memory: {
      fr: 'Quelque part, un plat porte désormais un nom que toi seul connais. Il a le goût de ce niveau.',
      en: 'Somewhere, a dish now bears a name only you know. It tastes like this level.',
    },
    item: { fr: '🥄 Cuillère en bois', en: '🥄 Wooden spoon' },
  },
  {
    id: 'o_porte_hasard', familles: ['chaos', 'exploration'],
    title: { fr: 'La porte au hasard', en: 'The random door' },
    text: {
      fr: 'Choisis une direction au hasard (dé, pièce, premier oiseau qui passe) et marche vingt minutes en suivant chaque signe.',
      en: 'Pick a direction at random (a die, a coin, the first passing bird) and walk twenty minutes following every sign.',
    },
    safe_fallback: {
      fr: 'De jour, dans un coin sûr. Demi-tour autorisé à tout moment.',
      en: 'In daylight, somewhere safe. Turning back is allowed at any time.',
    },
    memory: {
      fr: 'Le hasard t’a servi de guide. Il n’est pas très fiable, mais il connaît de drôles d’endroits.',
      en: 'Chance was your guide. It isn’t very reliable, but it knows some funny places.',
    },
    item: { fr: '🪙 Pièce du hasard', en: '🪙 Coin of chance' },
  },
];

export const ORDEAL_BY_ID = Object.fromEntries(ORDEALS.map((o) => [o.id, o]));
