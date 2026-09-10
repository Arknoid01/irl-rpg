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

### Addendum 2026-09-08 — thème `sombre` porté à parité visuelle

Le pass visuel poussé de `sombre` (jusque-là juste une palette, cf. plus
haut) est fait, direction « Grimoire / pierre gravée » (choix produit) :

- **Police dédiée** : Cinzel (capitales romaines gravées) pour les titres
  (`--font-brand`, `--font-display`), Google Fonts / SIL OFL, embarquée en
  local dans `www/assets/fonts/` comme toutes les autres — zéro appel réseau,
  cohérent D11. Le texte courant (réplique compagnon, corps de quête, journal,
  blurbs) reste en Cormorant Garamond : lisibilité. Un seul fichier woff2 par
  sous-ensemble couvre 400→700 (fonte variable sous-répartie par l'API).
- **Fond / texture** : parchemin cendré froid (grain désaturé, `grayscale`
  léger), gouttière et taches de foxing chaudes remplacées par une brume
  froide en haut de page + une vignette sombre aux bords.
- **Cadres** : coins nets + double filet (filet clair intérieur / filet fer
  extérieur via `box-shadow` inset) façon plaque de fer forgé, au lieu des
  bords « papier déchiré » de nordique.
- **Onglets** : ardoise froide, léger accent par onglet.
- **Effet payant** : `sombre-candle`, vacillement lent d'opacité sur la
  vignette de page (mimique une bougie). Respecte `prefers-reduced-motion`
  via la règle globale `*` de `components.css` comme les effets cyberpunk.
- **Ripple au clic** : `ui/ripple.js` n'est plus gated sur le seul
  `cyberpunk` mais sur un `Set` de thèmes payants (`cyberpunk`, `sombre`) ;
  l'apparence (néon vs diffusion d'encre) vient du CSS de chaque thème.

`previewVideo` de `sombre` reste `null` (place réservée, commentaire dans
`data/themes/sombre.js`) : Yannick enregistrera les vidéos d'aperçu boutique
à la fin. En attendant, l'aperçu live en CSS de la boutique est déjà complet.

Toujours **pas de QA visuelle possible ici** (pas de navigateur) : CSS validé
au parseur (`css-tree`), 42/42 tests, simulation 45 j inchangée — mais le
rendu réel des deux thèmes payants est à revoir sur appareil avant de vendre.

### Addendum 2026-09-08 (suite) — voix du compagnon thématisée

Le texte de saveur (répliques contextuelles, réaction après quête, moments
mémorables, entrées et 6 chapitres de journal) est maintenant **une voix par
thème**, sous la clé `voice` de `data/themes/<thème>.js` :

- `nordique.js` porte la version complète de référence (texte inchangé).
- `sombre.js` (veille / contrat / cendre / registre / la cité endormie) et
  `cyberpunk.js` (signal / secteur / log / la Grille / la ville qui ne dort
  pas) fournissent leur variante complète — **même structure, mêmes
  intentions** (jamais de pression, toujours « avec toi », D4) ; seul le
  vocabulaire change. `voiceFor(themeKey)` (themes.js) complète toute clé
  absente par celle de nordique, donc un futur thème peut n'adapter qu'une
  partie.
- `engine/companion.js` et `engine/journal.js` ne contiennent plus aucun
  texte en dur ; les reducers de `engine/game.js` passent `s.theme` aux
  générateurs d'entrées de journal, `buildJournalTimeline` passe
  `state.theme` à `chapterForLevel`. Les identifiants et seuils de chapitre
  (`prologue`, `ch1`…`ch5`) restent stables — seuls `label`/`blurb` sont
  thématisés.
- Nouveau test `voix par thème (D12)` : vérifie que chaque thème payant a une
  réaction après quête distincte de nordique, que l'anti-pression est
  préservée sur la réplique de série chaude, que les chapitres gardent
  id/seuils stables, et qu'un thème inconnu retombe proprement sur nordique.

43/43 tests, simulation 45 j inchangée.

### Addendum 2026-09-08 (suite) — achat in-app derrière une abstraction

Le déblocage passe maintenant par `www/js/platform/billing.js`, interface
`{ listProducts, purchase, restore }` :

- **impl « dev »** (web, pas de plugin) : déblocage local gratuit — l'état
  d'avant, inchangé pour l'expérience actuelle et les tests.
- **impl native** : `@capacitor-community/in-app-purchases`, atteinte via
  `window.Capacitor.Plugins.InAppPurchases` (même style que
  `platform/notifications.js` — aucun import ES du paquet, bundle web sans
  dépendance). Le plugin parle au Play Store / à StoreKit **en direct, sans
  serveur tiers** → cohérent D11. RevenueCat écarté pour cette raison.
- Produits : deux **non-consommables** (achat unique, D12) —
  `theme_sombre`, `theme_cyberpunk`. Jamais de produit lié au contenu de jeu.
- `ui/shop.js` ne connaît que l'interface : `billing.purchase(themeKey)`,
  `billing.restore()`. Bouton « Restaurer mes achats » ajouté (obligatoire
  pour des non-consommables). La note « démo locale » ne s'affiche que tant
  que `billing.real` est faux.

**Pas encore fait** (nécessite un accès Play Console / App Store Connect
pour être écrit et testé d'un bloc) : `npm i @capacitor-community/in-app-purchases`,
`npx cap sync`, déclaration des deux produits côté stores, permission
`com.android.vending.BILLING`, et vérification des noms de méthodes/réponses
réels du plugin (les appels dans `nativeBilling` sont des hypothèses isolées,
marquées comme telles). Prix : renseignés côté stores, l'app affiche ce que
le store renvoie (placeholder `null` sinon).

44/44 tests (dont `billing (D12)` : impl dev + parité des identifiants
produits), simulation 45 j inchangée.

### Addendum 2026-09-08 (suite) — pipeline banque de quêtes

Le point « pipeline pour étoffer durablement la banque de quêtes » (README
« Reste ouvert ») est concrétisé, sans nouveau format ni build step :

- `tools/quests-report.mjs` (`npm run quests`, ajouté à la CI après `sim`) :
  rapport de **couverture** (familles vs poids de tirage cible, matrice
  famille × effort, histogramme d'audace, défi d'ami / mystère / contexte,
  combinaisons génératives par template) et **checks durs** que les tests
  unitaires ne couvraient pas — doublon de texte fr/en, deux templates
  identiques hors slots, famille sans aucune quête curée (exit 1). Le reste
  (case vide, audace 4–5 mince) est un point d'attention, pas un blocage :
  c'est la feuille de route des prochains ajouts.
- `tests/engine.test.mjs` : nouveau test « pas de doublon de texte » (garde
  CI même si `npm run quests` est oublié).
- `docs/QUESTS.md` : mode d'emploi — la boucle report → ajout → test → sim,
  le modèle de champ par champ (curées et templates), ce qui bloque.

État de départ mesuré : 98 curées + 42 templates (~1 100 combinaisons),
familles globalement alignées sur les poids de tirage, deux trous connus
(social/chaos conséquent, audace 4–5).

45/45 tests, `npm run quests` vert (4 points d'attention documentés).

**Suivi 2026-09-10 :** les 4 trous comblés — banque à 118 curées + 48
templates (~1 180 combinaisons). social/chaos conséquent remplis ; audace 4
passe de 5 à 13, audace 5 de 1 à 7. `npm run quests` : zéro point d'attention.

### Addendum 2026-09-08 (suite) — réconciliation avec la session parallèle

Une autre session Claude (panneau tmux parallèle, `session_0173Fo…`, commits
du 2026-09-06) avait poussé sur `main` 4 commits sur les mêmes sujets :
4 thèmes payants de plus, une voix de compagnon par thème (archi différente),
un vocabulaire d'UI par thème, un effet ambiant par thème. Tranché par
Yannick : **on garde l'archi de cette session-ci** (voix = clé `voice` +
`voiceFor()` dans `themes.js`, qui thématise aussi journal et chapitres ;
abstraction IAP `platform/billing.js` ; pipeline quêtes) et **on récupère les
4 thèmes en plus**, adaptés au contrat `voice`.

Les 4 commits de la session parallèle sont conservés hors `main` sous le tag
`parallel-session-20260906` (rien de perdu).

Repris de la session parallèle, adapté :

- **4 thèmes payants** : `enquete` (bureau + chemise, Special Elite),
  `mystique` (ciel étoilé, Cinzel), `postapo` (plaque rivetée, Black Ops
  One), `cockpit` (console HUD sombre, Chakra Petch — seul des 4 dont le
  panneau passe au sombre, d'où des rattrapages de contrôles comme
  cyberpunk). CSS verbatim de la session parallèle (effet ambiant inclus).
  **Catalogue : 1 gratuit + 6 payants.**
- **Polices** : Special Elite (Apache 2.0), Black Ops One + Chakra Petch (SIL
  OFL), latin seul, embarquées en local (`assets/fonts/LICENSES.md`). Cinzel
  garde le fichier de cette session (latin + latin-ext, 400→700).
- **`ui` par thème** (`ui/themeText.js`) : mot de saveur pour le titre de
  section « Quêtes du jour », le badge « Événement » (carte + carte du monde)
  et le titre « tout est fait ». Habillage uniquement — aucun texte de
  sécurité / d'optionnalité touché (spec §22). Ajouté aussi à `sombre` et
  `cyberpunk` pour la cohérence.
- **`voice` complète** écrite pour chacun des 4 (répliques contextuelles +
  réaction après quête depuis leur `ctx`, plus `chapters` / `eventEntry` /
  `levelChapter` / `regionReveal` / `memorable` thématisés — parité avec
  sombre et cyberpunk).
- `platform/billing.js` : un produit non-consommable par thème payant
  (`theme_enquete` … `theme_cockpit`).
- `demo.html` débloque les 7 thèmes pour la revue visuelle.

46/46 tests, `npm run quests` vert, simulation 45 j inchangée, CSS validé.

## D13 — Rétention long terme : jalons, retour après absence, anti-disette (2026-09-08)

`ROADMAP.md` Phase 1 (« le risque n°1 est la rétention »). Trois briques,
toutes on-device (D11), toutes sans pression (D3 — passées à la
`PHILOSOPHY_CHECKLIST`).

**Jalons (`state.milestones`)** — map `<clé> -> 'YYYY-MM-DD'` de la première
occurrence. Ensemble figé (les tests et la voix des thèmes s'appuient dessus,
`engine/milestones.js` `MILESTONE_KEYS`) :

- 8 premières fois : `first_quest`, `first_outdoor`, `first_social`,
  `first_evening`, `first_hidden`, `first_bold` (audace ≥ 4), `first_big`
  (effort conséquent), `first_event`.
- 4 paliers de volume : `volume_10 / 25 / 50 / 100`.
- Écartés : tout ce qui suppose une donnée non disponible hors-ligne (météo,
  géoloc) — pas de `first_rain`.

Marqués par les reducers (`completeQuest` / `completeEvent`) **après** le
bookkeeping. Un jalon jamais atteint ne coûte rien. La collection visible
« Moments » est Phase 2.3 — pour l'instant les jalons ne servent qu'à la voix
du compagnon (`history.lastMilestone`, mis en avant le jour même, le premier
de la liste l'emporte).

**Retour après absence** — `engine/comeback.js` : seuil **3 jours** sans
activité (`daysAway`). Aucun décompte de jours « manqués » n'est affiché ni
stocké. Effets le jour du retour : tirage biaisé effort léger + quêtes jamais
faites (`draw.js`), un des 2 événements `comeback: true` très probable (jamais
tirés en rotation normale), une ligne compagnon dédiée
(`voice.ctx.comeback`, 7 thèmes). Le mode s'éteint dès la première validation
(`bumpStreak` remet `lastActiveDate`).

**Anti-disette d'événement** — `history.daysSinceEvent` ; après **4** jours
secs, `drawDaily` force un événement (`chance = 1`). But : garantir une
« question à l'ouverture » au moins tous les ~4 jours.

Migration : purement additive (`defaultState` + `normalize`), pas de bump
`SAVE_VERSION`. 52/52 tests, `npm run quests` vert, sim 45 j (avec 2 absences)
sans violation.

## D14 — Écran Personnage recadré « qui je deviens » (2026-09-08)

`ROADMAP.md` Phase 2 (« la page doit répondre à : qui suis-je devenu ? », pas
« quelles stats optimiser »). Réagencement du même contenu, pas de nouvel
onglet. Ordre : identité (prénom, `Niveau N · <style>`, fine barre XP, mot du
compagnon) → Traits → Titres → « Ta chronique » → « Ton chemin » → Moments →
Découvertes → Musée.

**Compétences → traits qualitatifs (décision §2.4, tranchée).** Option A :
**qualificatif seul, sans chiffre**. `engine/progression.js` `traitTierFor`
classe les 6 compétences en `dominante / émergente / présente / discrète`,
**relatif à la plus haute** (ratio ≥ .8 / ≥ .45 / ≥ .2 / reste ; 0 →
discrète). Jamais un score absolu à atteindre. Petit indicateur en 4 segments,
non chiffré. Libellés : `data/taxonomy.js` `TRAIT_TIERS`. Les valeurs brutes
restent dans `state.skills` (titres, style, carte s'appuient dessus) — elles
ne sont juste plus affichées sur cet écran.

**Collections.** Mécanique commune « clé → date, coché ou scellé, sans dire le
déclencheur » :
- **Moments** = `state.milestones` (D13), 8 cartes + paliers de volume à part.
- **Découvertes** = nouveau `state.discoveries` (`engine/discoveries.js`),
  dérivé du `contexte` / famille des quêtes accomplies. 6 clés, **toutes
  strictement on-device** : `dehors` `chemin` `rencontre` `creer` `matin`
  `soir`. `pluie` / `nature` / `ville` de l'analyse **écartés** (météo/géo
  indisponibles hors-ligne, D11) — même raison que `first_rain`.
- **Musée** : 2 vitrines `???` après les vraies pièces, vue « tout »
  seulement — curiosité sans faire du musée une checklist.

**KPI rétention affichés (§3).** « Ton chemin » : jours d'aventure, plus
longue série, moments vécus (X / 8), et *reprises* (`history.comebacks`,
compté une fois par jour de retour) **seulement si > 0**. Aucun décompte de
jours manqués, aucun rouge, aucun compteur culpabilisant.

**Carte du Monde (2.6).** Phrase « Certaines régions ne sont pas encore prêtes
à être découvertes. » tant qu'il reste brume/verrou ; encart + liseré or sur
une région `justRevealed`.

Migration additive (`discoveries: {}`, `history.comebacks`), pas de bump
`SAVE_VERSION`. Ancien `skillsGridHtml` / `styleHtml` retirés de l'écran ;
CSS `.hero-*` / `.skill-*` / `.style-*` devient orphelin (nettoyage à faire
avec la QA appareil). 58/58 tests, sim OK, CSS `css-tree` OK.

## D15 — Chronique : chapitres en nombre de quêtes + nuance de famille (2026-09-08)

`ROADMAP.md` Phase 3.1, décision §2.2 **tranchée : nombre de quêtes**, pas le
niveau (« plus lié à l'activité » ; le niveau monte aussi avec les événements).

- `engine/journal.js` : `chapterForLevel(level)` → **`chapterFor(state)`**.
  Seuils sur `history.totalCompleted` : `[0, 10, 25, 50, 100, 200]` →
  prologue / ch1…ch5. Identifiants (`prologue`, `ch1`…) et textes par thème
  (`voice.chapters`) **inchangés** — seuls les seuils bougent.
- Entrée de journal « nouveau chapitre » émise dans `completeQuest` au passage
  d'un seuil (effet `chapter-open`). Texte = `— <label> —\n<blurb>` (déjà
  thématisés, pas de wrapper par thème à écrire).
- **Nuance de famille** : `voice.chapterLean` (6 familles) — une phrase sous le
  blurb quand une famille domine nettement (≥ 5 quêtes ET ≥ 1.4× la 2ᵉ).
  Écrite pour les 7 thèmes. Jamais un jugement, une couleur.

Migration : additive (rien de nouveau dans l'état — la chronique se dérive de
`totalCompleted` qui existait déjà). Pas de bump `SAVE_VERSION`.

## D16 — Récit : entrée « du jour », mini-arcs secrets, événements spéciaux (2026-09-08)

`ROADMAP.md` Phase 3.2–3.4. Voix par thème : **les 7 thèmes** (cohérent
D12).

**Entrée de journal « du jour » (3.2).** Au **rollover naturel** (pas au
re-tirage manuel), une entrée résume la veille : `voice.dayEntry(dayNo, titre,
tags)` + `voice.dayTitles`. Une seule par date, **jamais pour une journée
vide** (aucune pression). `simulate.mjs` et les tests d'intégration passent en
rollover naturel (la date avance, plus de `drawDate = null` forcé).

**Mini-arcs secrets (3.3)** — « le plus gros levier rétention ».
- `state.arcs = { active, step, completed }`. **Un arc à la fois.**
- `data/arcs.js` : **4 arcs** figés (`passage`, `visage`, `objet`, `heure`),
  3–4 étapes. Contenu (action, indice, révélation) **neutre bilingue** comme
  la banque de quêtes ; `voice.arc` (clue / reveal / inProgress) l'habille.
- Étape courante = quête cachée **toujours légère, audace 2, jamais chaos** →
  occupe le créneau « mystère » au tirage (`ARC_STEP_CHANCE = 0.28`, avant la
  quête cachée aléatoire). Les invariants du tirage tiennent (l'effort ne fait
  que baisser). Au **retour après absence** : plus de swap mystère aléatoire,
  et `canAdd` refuse tout effort conséquent.
- `completeQuest` : `advanceArc` fait progresser ; indice → journal
  (`kind: 'indice'`), révélation → journal (`kind: 'revelation'`) + **pièce de
  musée dédiée** (`id: arc_<arcId>`). Les étapes d'arc ne donnent plus le
  souvenir générique « Chapitre glané ».

**Événements spéciaux (3.4).** `eventEligible` gagne `minDaysPlayed`
(temporel) et `requireMilestone` (écho d'un jalon). 4 événements
(`ev_une_semaine` 7 j, `ev_un_mois` 30 j, `ev_echo_inconnu`, `ev_echo_mystere`).
L'événement de retour reste D13/1.3.

Migration : additive (`arcs: {active:null,step:0,completed:[]}` + `normalize`),
pas de bump `SAVE_VERSION`. 65/65 tests, sim 45 j (2 arcs terminés + 1 en
cours) sans violation, CSS `css-tree` OK.

## D17 — Achat in-app : « Collection des Mondes » (bundle) + plugin réel (2026-09-08)

`ROADMAP.md` Phase 4.2. Deux décisions.

**Pricing (§2.1, tranchée : bundle).** Un **seul** produit **non consommable**
`collection_des_mondes` (~6,99 €) débloque les **6 thèmes payants** d'un coup.
Plus de SKU par thème (`theme_sombre`…). Raisons : message plus simple, une
seule fiche produit, meilleure conversion probable ; on accepte de perdre
l'entrée à petit prix. Reste cosmétique pur, jamais pay-to-win (D12).
`engine/game.js` : `unlockCollection` (idempotent) ; `unlockTheme` conservé
pour la démo / les tests. `www/js/platform/billing.js` :
`COLLECTION_PRODUCT` + `COLLECTION_THEMES`.

**Plugin.** Le paquet visé par les sessions précédentes
(`@capacitor-community/in-app-purchases`) **n'existe pas sur npm**. Retenu :
**`capacitor-plugin-cdv-purchase`** (édition Capacitor de
`cordova-plugin-purchase` / Fovea, v13). Il parle **directement** à Google
Play Billing / StoreKit — **aucun serveur tiers** (D11). RevenueCat écarté
(exige leur backend). `npx cap sync` enregistre la classe native
`cc.fovea.iap.PurchasePlugin` ; les fichiers gradle générés
(`android/app/capacitor.build.gradle`, `android/capacitor.settings.gradle`)
sont commités.

**Intégration.** Ce projet n'a **pas de bundler** (les modules `www/js` sont
chargés bruts). On n'importe donc pas le paquet ES : `nativeBilling` passe par
le pont bas niveau `window.Capacitor.Plugins.PurchasePlugin` (mêmes méthodes
que le source Android du plugin : `init`, `getAvailableProducts`,
`getPurchases`, `buy`, `acknowledgePurchase`, événements `purchasesUpdated` /
`setPurchases`). **Non testable ici** (pas de Play Console, pas d'appareil) —
le flow d'achat / acquittement / la forme exacte des payloads sont à vérifier
sur une piste de test fermée (checklist dans `STORE.md`). Toute la surface
incertaine est isolée dans `nativeBilling` et commentée.

**Manifeste.** `com.android.vending.BILLING` ajouté.

**4.3 (extensions de contenu payantes).** Pas maintenant — *après* un D30
Return Rate correct (roadmap §18 / Phase 4).

66/66 tests, sim OK, `css-tree` OK, zéro appel réseau dans `billing.js`.

## D18 — Nom public de l'app : « Cairn » (2026-09-10)

`IRL RPG` n'était qu'un placeholder de travail. Nom retenu : **Cairn** — le
tas de pierres qui balise un sentier de montagne. Raisons : court, identique
en FR et en EN, neutre vis-à-vis des thèmes (ne présume pas « fantasy »),
et il dit la promesse du produit — de petits gestes qu'on empile, un repère
sur le chemin, jamais une injonction.

**Portée du changement.** `i18n.app_name` (fr/en), `ob_welcome_body`,
`ob_age`, `share_text`, `<title>` de `index.html` / `demo.html`,
`manifest.webmanifest` (`name` + `short_name`), `capacitor.config.json`
(`appName`), `notifications.js` (titre de la notif via `i18n.t('app_name')`),
`package.json`, `www/README.md`, `www/privacy.html`, `docs/STORE.md`
(fiche listing).

**Ce qui NE change pas** : `appId` `com.pegasuscorp.irlrpg` (l'identité Play
Store / StoreKit se fige au premier upload — la renommer casserait la
continuité) et la clé de sauvegarde `irlrpg_save_v2` dans `state/store.js`
(la changer effacerait les parties en cours). Les docs d'analyse historiques
gardent « IRL RPG » — non réécrites, ce sont des archives datées.
