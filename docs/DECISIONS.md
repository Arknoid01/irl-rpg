# Décisions de design — journal

> Décisions tranchées. **Fait autorité** sur les 3 docs de spec quand il y a
> conflit (au même titre que `TAXONOMIE.md` pour les catégories).
> Chaque entrée : date, décision, ce que ça change.

---

## D1 — Plateforme : HTML + Capacitor (2026-09-04)

App web (HTML/CSS/JS), empaquetée avec **Capacitor** pour Android/iOS. **Pas de
Godot.** Même approche que le projet Fableris.

- Le « projet applicatif » = faire évoluer `prototype/` vers une vraie app web
  (modules, build, assets) + wrapper Capacitor.
- Notifications quotidiennes = `@capacitor/local-notifications`, planifiées côté
  client. Zéro backend.
- Scène de montée de niveau = séquence CSS/JS soignée, pas un moteur.

Détail : `REVUE_CRITIQUE.md` §5.

---

## D2 — Taxonomie unique (2026-09-04)

Voir `TAXONOMIE.md`. 6 familles / 6 compétences / matrice / tags orthogonaux /
modèle JSON de quête. Remplace les catégories de `concept` §5, `interactions`
§2 et §28.

---

## D3 — Solo-first, honor-system, aucun classement compétitif (2026-09-04)

Le jeu est **solo d'abord**. Validation = **confiance** (« j'ai réussi »), aucune
preuve exigée.

**Aucun classement compétitif, aucune comparaison de score/niveau entre joueurs.**
Le social est **coopératif et expressif uniquement** :

- **Défis d'amis** = tu choisis une quête pour un pote et tu la lui envoies par
  message (aucun compte partagé, cf. `interactions` §10). Champ `defi_ami` dans le
  modèle de quête.
- **Partage** de moments / titres / fragments de journal, pour le plaisir de
  raconter — pas pour se mesurer.
- Les amis peuvent apparaître dans l'app comme personnages (prénom, éventuellement
  style d'aventure), **jamais** classés par niveau ou par XP.

**Ce que ça remplace :**

- `concept` §9 « Quêtes de groupe » : la version « tous réunis au même endroit
  avant 20h, +500 XP chacun » (qui suppose présence partagée / backend) est
  reportée à une éventuelle version majeure. MVP = défis d'amis manuels + quêtes
  communes que chacun valide de son côté, sans comparaison.
- `concept` §3 : la liste d'amis avec niveaux affichés (« Yannick Lv12, Thomas
  Lv9 ») → afficher les amis sans hiérarchie de niveau.

**Pourquoi :** résout ~5 contradictions des specs, garde l'app gratuite à opérer
(zéro serveur), et protège la philosophie (pas de course, pas de pression).

**Conséquence anti-triche :** non-sujet. Tricher une quête = tricher contre
soi-même (`interactions` §27), et il n'y a rien à gagner sur les autres.

---

## D4 — « Compagnon » remplace « maître du jeu » (2026-09-04)

L'entité qui propose les quêtes est un **compagnon d'aventure**, à côté du joueur —
pas un maître du jeu au-dessus de lui.

- Vocabulaire de base : « ton compagnon », « ton compagnon d'aventure ».
- Le vocabulaire de thème peut l'habiller (`interactions` / `ui_ux_spec` vocab
  tables) : IA compagnon (cyberpunk), compagnon de route / guide (nordique),
  voix / présence (sombre) — mais l'idée reste « avec toi », jamais « te
  commande ».
- Catchphrase mise à jour :
  > « Et si ta vie quotidienne était un RPG, et cette appli ton compagnon
  > d'aventure ? »

**Pourquoi :** aligne avec la philosophie (`interactions` §35 : « le compagnon
regarde le monde **avec** toi ») et retire la connotation de contrôle.

Le prototype utilise déjà « compagnon ».

---

## D5 — « Énergie » supprimée comme ressource (2026-09-04)

Pas de ressource qui se vide et **conditionne** l'accès aux quêtes (= pression
interdite par `concept` §13).

Remplacée par un simple indicateur d'activité du jour : **« Élan du jour »** =
pourcentage de quêtes du jour accomplies. Purement informatif, ne bloque rien,
se remet à zéro chaque jour, aucune conséquence s'il reste bas.

- `concept` §3 : `❤️ Énergie : 72` → `✨ Élan du jour : ~%`.
- `ui_ux_spec` §2 : « énergie » dans l'écran Aventure → « élan du jour ».

Le prototype a déjà ce comportement (barre « énergie du jour » = % fait) — seul le
libellé change.

---

## D7 — Bilingue FR / EN dès la V1 (2026-09-04)

L'app est **FR + EN** avec un bouton de bascule (dans la barre du haut et dans les
réglages). Langue de départ devinée depuis `navigator.language`, puis stockée dans
la sauvegarde (`state.lang`).

- UI : dictionnaires `www/js/i18n/fr.js` + `en.js`, helper `i18n.t(clé)`.
- Contenu (quêtes, événements, titres, familles, fragments, phrases du compagnon) :
  champs `{ fr, en }`, résolus par `i18n.loc(...)`.
- Les entrées de journal générées stockent les deux langues -> se retraduisent au
  changement de langue.

---

## V1 livrée (2026-09-04)

Application jouable de bout en bout dans `www/` (voir `www/README.md`).
Périmètre conforme à `REVUE_CRITIQUE.md` §7 :

- 3 onglets (Aventure / Journal / Personnage) + réglages ; 3 thèmes en tokens
- Onboarding (langue, thème, prénom, curseur de confort, familles, rappel, ack 16+)
- Banque de ~70 quêtes bilingues + tags `effort` / `registre` / `safe_fallback` ;
  pas de générateur libre
- Tirage quotidien budgété en effort, accepter / ignorer / valider
- XP / niveau / 6 compétences / 12 titres / style d'aventure / série sans coût
- Journal (fragments + moments mémorables), 1 famille d'événements (7)
- Défi d'ami = partage de texte (Web Share / Capacitor Share), aucun classement
- Sauvegarde on-device + export / import + migration depuis le prototype
- Rappel quotidien via `@capacitor/local-notifications` (repli web propre)
- Classement **16+** (D6) + docs privacy / store
- Tests : `node --test` (moteur + DOM jsdom) + simulation 45–90 jours + CI

**Post-V1 (démarré) :** générateur modulaire = templates + slots
(`www/js/data/templates.js`, `slots.js`, `engine/generate.js`), mélangé au tirage.
Toujours pas de générateur libre / LLM.  
**Carte abstraite** = onglet Monde, plateau symbolique (`data/world.js`,
`engine/worldView.js`) — régions liées aux familles, pins = quêtes du jour /
événement / souvenirs, portes de niveau, grotte mystère. Pas de géoloc.

Hors V1 encore : Inventaire « musée » complet, adaptatif « intelligent »,
multijoueur, art / son par thème, géoloc, météo.

---

## D8 — Économie XP / titres V1 (2026-09-04)

Courbe : `xpToNext(level) = 280 + (level - 1) * 130`.  
Titres : T1 = **100**, T2 = **320** par compétence.  
Tirage : social 22 · exploration 18 · quotidien 18 · curiosité 15 · chaos 15 ·
création 12 (rééquilibre discipline/création vs social/audace).

Détail : `TAXONOMIE.md` §7–§8.

---

## D6 — Public / âge : **16+** (2026-09-04)

**Tranché : classement 16+.**

Raisonnement : le contenu est majoritairement bénin, mais certaines quêtes
(« engage la conversation avec un inconnu », « entre dans un commerce inconnu »,
« prends un chemin différent ») demandent un minimum d'autonomie et de jugement.
18+ serait excessif ; sans âge déclaré, classement store et responsabilité
posent problème. Pas d'adaptation du pool selon un âge déclaré en V1 (complexité
inutile) — un seul pool, gate d'âge à l'onboarding.

**Conséquences :**

- Onboarding : texte explicite + case à cocher obligatoire « J'ai 16 ans ou plus »
  (`ageAck` dans la sauvegarde). Sans ack, l'aventure ne démarre pas.
- Stores : déclarer **16+** / IARC équivalent (voir `docs/STORE.md`).
- Mentions : réglages « À propos » + `docs/PRIVACY.md` / `www/privacy.html`.

Ce n'est **pas** une vérification d'identité — déclaration honorable, comme le
reste du jeu (D3).
