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
**Événements contextuels** + tirage adaptatif léger (`engine/events.js`) —
famille, moment, niveau / série / confort, anti-répétition.  
**Inventaire = musée décoratif** (`data/loot.js`, `engine/inventory.js`) —
catégories, lore, jalons ; aucune économie / craft.  
**Contenu enrichi + UX grimoire** : ~40 templates, ~34 événements + lore musée,
jalons 3/5/8/12/15 ; level-up et onboarding habillés en feuillets de livre.

Hors V1 encore : adaptatif « intelligent » poussé, multijoueur, art / son par
thème, géoloc, météo.

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

---

## D9 — Application du `IRL_RPG_PLAN_UX_UI_V1.md` (2026-09-05)

Un second document de plan (`~/Téléchargements/IRL_RPG_PLAN_UX_UI_V1.md`) est arrivé
après la V1 livrée. Il décrit la même philosophie (grimoire, compagnon, pas de
liste de tâches) mais avec un script écran-par-écran plus cérémonieux, et un
détail structurel différent : « 3 propositions max/jour, on en choisit une ».

**Décision : ne pas remplacer le moteur de tirage multi-quêtes budgété (D8,
`draw.js`)** par un choix strict à 3 options. C'est une décision de fond déjà
tranchée, testée (simulation 45 j, invariants) et livrée — la retoucher change
l'équilibrage XP et le rythme de jeu, pas juste l'habillage. À confirmer avec
Yannick si un vrai changement de mécanique est voulu ; en attendant, seul
l'habillage/la cérémonie du plan a été repris.

**Appliqué cette session (sans toucher au moteur de tirage) :**

- Écran d'ouverture « grimoire fermé » avant l'onboarding (`.cover-screen`,
  `ui/onboarding.js` step `cover`) — texte du plan repris quasi mot pour mot.
- Cérémonie de validation de quête (plan §16) : overlay « Accomplie / le monde
  vient de changer un peu / +XP / réaction du compagnon », au lieu d'un simple
  toast. `companionLineAfterQuest()` ajouté dans `engine/companion.js`.
- **Bug corrigé** : l'effet `{ type: 'quest-done' }` émis par
  `completeQuest()` n'était géré par aucun `case` dans `ui/feedback.js` —
  silencieusement ignoré depuis la livraison V1. C'est ce canal qui porte
  maintenant la cérémonie ci-dessus.
- Réglages : libellé de section « Aventure » → « Préférences d'aventure »
  (plan §33), simple renommage.

**Pas fait / laissé en l'état** (périmètre trop large pour une session, ou
recoupant des décisions déjà tranchées) : refonte du choix « 3 quêtes »,
refonte visuelle Monde/Personnage (déjà proches de l'esprit du plan),
transitions de page supplémentaires, écran de clôture « À demain » dédié.

**Mise à jour 2026-09-05 — tranché par Yannick :**
- **Rythme d'XP : gardé tel quel.** Le rythme actuel (simulation : niveau 12
  en 45 jours) est validé, aucun changement de courbe/paliers.
- **Mécanique « 3 quêtes/jour » : option « 3 propositions, plusieurs
  faisables » retenue** (pas le choix exclusif d'une seule). **Implémenté** :
  `engine/draw.js` tire désormais exactement 3 quêtes/jour (`MAX_QUESTS = 3`,
  au lieu de 3-4) et les étiquette ⭐ principale / 🌿 tranquille / 🔥
  audacieuse selon l'audace relative (`assignProposalRoles`, cosmétique). Le
  joueur garde la possibilité d'en accepter plusieurs, budget d'effort et
  Élan du jour inchangés. Ligne compagnon « Choisis ton aventure. » ajoutée
  tant qu'il reste des propositions non tranchées (`adventure.js`). Sim 45 j
  après coup : toujours niveau 12 (rythme d'XP préservé). Voir aussi
  `TAXONOMIE.md` §7.

---

## D11 — Verrous de différenciation produit (2026-09-05)

Analyse concurrentielle (Habitica, LifeUp, Finch, RPG Life, LifeForge,
IRLQUEST) : le marché 2026 converge vers IA cloud qui construit ton skill
tree, coach IA, leaderboards, récompenses réelles (cartes cadeaux) — et les
utilisateurs se plaignent d'abonnements chers sans nouvelle mécanique
(Habitica, Finch). `irl-rpg` va délibérément à rebours sur 3 axes déjà
présents dans l'architecture mais jamais verrouillés ni rendus visibles.
**Décision : verrouiller ces 3 piliers comme contraintes permanentes**, pas
des choix de design révisables au coup par coup — au même titre que D3.

1. **Push, jamais pull** — le joueur ne crée jamais sa propre quête. Le
   compagnon propose (`draw.js`) ; jamais de « + ajoute ta tâche ». Toute
   feature qui irait dans ce sens est refusée par design, pas débattue au cas
   par cas. Différence structurelle avec Habitica/LifeUp/RPG Life (tous des
   gamificateurs de to-do list où le joueur saisit ses propres tâches).
2. **Anti-pression** — étend D3/D5. `docs/PHILOSOPHY_CHECKLIST.md` devient le
   passage obligatoire pour toute feature touchant séries, notifications ou
   comparaison entre joueurs.
3. **Zéro cloud** — aucune télémétrie, aucun SDK analytics, aucune IA
   distante, jamais. Garde-fou enforced (pas juste documenté) :
   `tests/no-network.test.mjs` fait échouer la CI si `fetch`/`XMLHttpRequest`/
   un appel réseau apparaît dans `www/js`.

**Appliqué cette session (sans toucher au moteur de tirage ni à l'équilibrage
XP) :**

- Écran d'ouverture reformulé : `cover_title`/`cover_body` nomment le contraste
  push/pas-de-liste dès la première image ; `cover_tagline` ajoute la promesse
  vie privée avant même l'onboarding.
- Bloc « Notre promesse » ajouté à Réglages → À propos (`set_promise`) :
  rend explicite ce qui était seulement vrai en interne (aucun classement,
  aucune perte réelle, ton jamais culpabilisant).
- `streak_break_ok` (chaîne existante, jamais câblée) enfin affichée : une
  vraie rupture de série (`bumpStreak` → `broke: true`) déclenche un toast de
  réassurance au lieu d'un reset silencieux.
- Réplique compagnon « callback » (`companion.js`) : cite un fragment de
  journal d'un jour précédent — renforce « il/elle connaît ton histoire
  précise », pas un template générique. Priorité basse (après streak/style),
  n'affecte aucun test existant.
- `tests/no-network.test.mjs` créé et ajouté à `npm test` / CI.

---

## D12 — Modèle économique : achat unique, pas de pubs (2026-09-05)

Décision (discutée avec Yannick) : **achat unique, jamais de publicité.** Des
pubs impliqueraient quasi systématiquement du tracking tiers — contradiction
directe avec D11 (zéro cloud) et avec ce que l'app promet déjà elle-même
(`set_data_body` : « Aucun compte, aucun serveur, aucune pub » ; `STORE.md` :
Publicités : non). Jamais de pay-to-win : aucun avantage XP/vitesse de
progression/titre ne sera jamais derrière un paywall (cohérent avec D3).

**Contenu du pack payant : reskin complet, pas plus de quêtes.** Les thèmes
`sombre` et `cyberpunk` (déjà présents dans le code, jamais montrés en UI)
deviennent le contenu payant — palette + police + texture de fond/page +
formes des cadres, une identité visuelle complète et cohérente par thème, pas
un simple recolorage. Le contenu de jeu (98 quêtes, courbe XP, compétences)
reste strictement identique et gratuit pour tout le monde. Prochaine étape
(pas encore faite) : réécrire la voix du compagnon/cérémonie/chapitres de
journal par thème (adapter les textes existants, pas en écrire de nouveaux),
puis brancher un vrai mécanisme d'achat (plugin Capacitor IAP) qui débloque
le sélecteur de thème actuellement retiré de l'UI (cf. commit "Choix de
langue explicite...").

Mécanique d'essai envisagée (pas tranchée techniquement) : gratuit à vie sur
la boucle principale plutôt qu'un mur de paiement après un essai chronométré
— maximise les installs/bouche-à-oreille pour un lancement sans budget
marketing (cf. discussion produit du 2026-09-05).

**Refactor d'architecture fait cette session (indépendant du choix
business ci-dessus, sert aussi bien 2 thèmes que 10) :**

- `data/themes.js` devient un registre qui importe un fichier par thème
  (`data/themes/nordique.js`, `sombre.js`, `cyberpunk.js`) — ajouter un thème
  = un nouveau fichier + une ligne d'import, aucun autre fichier à toucher.
- Même principe côté CSS : `styles/themes.css` n'est plus qu'une liste de
  `@import` vers `styles/themes/*.css` (`base-tokens.css` d'abord — sinon son
  `:root` gagnerait sur les couleurs des thèmes pour `<html>`, même
  spécificité, l'ordre de cascade décide). `nordique.css` reproduit le
  comportement par défaut à l'identique (zéro régression pour l'expérience
  gratuite). `sombre.css` complète enfin sa palette (fond/encre propres au
  lieu d'hériter du parchemin chaud de nordique). `cyberpunk.css` réécrit
  fond, texture de page, formes des cadres, couleurs d'onglets et polices
  (Orbitron + Share Tech Mono, Google Fonts/SIL OFL, embarquées en local
  comme les autres polices — zéro appel réseau, cohérent D11).
- Aucun changement de layout/structure DOM par thème (seulement CSS) — évite
  le risque de fragmentation de code identifié dans `REVUE_CRITIQUE.md` §4.2.
- CSS validé avec un vrai parseur (`css-tree`, dépendance transitive de
  jsdom) plutôt qu'à l'œil : a immédiatement attrapé un bug réel (un
  commentaire contenant littéralement `*/` qui fermait le commentaire en
  plein milieu). Pas de QA visuelle possible dans cet environnement (pas de
  navigateur) — à vérifier sur un vrai appareil/navigateur avant de vendre
  quoi que ce soit.

**Effets ajoutés pour cyberpunk (thème payant uniquement, zéro effet sur
nordique/sombre)** : balayage scanline sur `.page`, halo néon qui pulse sur
panneaux/cartes (pur CSS, respecte déjà `prefers-reduced-motion` via la règle
globale existante), et un ripple au clic (`ui/ripple.js`, générique mais gated
sur `data-theme="cyberpunk"` + sur `prefers-reduced-motion`, avec délai de
secours si `animationend` ne part jamais).

**Boutique de thèmes (`ui/shop.js`)**, ouverte depuis Réglages → Apparence
→ « Voir les thèmes ». Aperçu **live en CSS** de chaque thème (police,
couleurs, réplique de compagnon réelle via `companionLineFor`, halo animé) —
pas de vidéo/GIF enregistrée (impossible à produire dans cet environnement
sans navigateur ; un aperçu live reste toujours synchronisé avec le vrai
rendu, contrairement à une vidéo qui peut devenir obsolète). `label` des
thèmes passé bilingue `{fr,en}` à cette occasion (était FR uniquement).

Déblocage : **local pour l'instant, aucun paiement réel** (`unlockedThemes`
dans la sauvegarde, `game.unlockTheme()`). `game.setTheme()` refuse
désormais un thème non débloqué — impossible de contourner un futur achat en
trafiquant juste `state.theme`. Prochaine étape non commencée : brancher un
vrai plugin IAP Capacitor qui appelle `unlockTheme()` après un paiement
validé par le store, au lieu du bouton "Débloquer" gratuit actuel.
