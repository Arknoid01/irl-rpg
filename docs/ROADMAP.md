# IRL RPG — feuille de route

> Fusionne les deux analyses de Yannick (2026-09) avec l'état réel du code :
> - `IRL_RPG_Analyse_Modele_Economique_et_Roadmap.md` — positionnement, éco, rétention
> - `IRL_RPG_Analyse_Interface_UX.md` — interface, hiérarchie, présentation
>
> `DECISIONS.md` reste l'autorité sur ce qui est **tranché**. Ce doc trie ce qui
> est **fait**, ce qui **reste**, et donne un ordre suivable. Cocher les cases
> au fur et à mesure.

---

## 0. Principe directeur (les deux analyses convergent)

> **Faire → Découvrir → Se souvenir → Devenir.**
> (⚔️ Aventure · 🗺 Monde · 📖 Journal · ⚜️ Personnage)

- **Le risque n°1 est la rétention**, pas la concurrence. Objectif unique :
  qu'un joueur ouvre l'app demain matin pour voir ce que son compagnon lui
  réserve. Tant que cette boucle ne tient pas, ajouter thèmes/badges ne règle
  rien (Éco §25).
- **Ne pas refaire le design.** Faire évoluer *« joli grimoire plein de
  systèmes »* → *« grimoire vivant qui raconte mon aventure »* (UX §1, §26).
- **Ne pas transformer l'interface en tableau de bord.** Moins de jauges, de
  stats, de cadres visibles en même temps ; la profondeur se découvre
  progressivement (UX §23).
- Tout reste **on-device** (D11) et **sans pression** (D3,
  `PHILOSOPHY_CHECKLIST.md`).

Note UX de départ (UX §24) : direction artistique 9/10, identité 9,5/10,
**lisibilité 7,5/10, hiérarchie 7/10** — c'est là qu'est le travail.

---

## 1. État réel vs analyses

Beaucoup de briques décrites comme « à faire » sont livrées. À ne pas
reconstruire :

| Sujet | État | Où / reste à faire |
|---|---|---|
| Push, pas pull · pas de punition · zéro cloud · archi séparée | ✅ | D3, D11, tests |
| Souvenir dans la boucle | ✅ en grande partie | musée, fragments+moments de journal, régions |
| Mémoire légère du compagnon (Éco §6) | ✅ | `state.history` + `computeStyle` + `state.milestones` (Phase 1.1) ; le compagnon cite un fragment passé **et** réagit aux premières fois / paliers de volume (Phase 1.2) |
| Journal → Chronique (Éco §7, UX §13-14) | ⚠️ partiel | `chapterForLevel` : 6 chapitres **par thème**. **Manque** : seuils en nb de quêtes, entrée de journal « du jour » qui résume ce qui a été vécu |
| Styles d'aventurier (Éco §9) | ✅ | `computeStyle`, affiché sur Personnage |
| Compagnon = fil rouge (Éco §10, UX §22-P2) | ✅ | branches contextuelles dans `companionLineForState` + narration par jalon (Phase 1.2) + accueil au retour (Phase 1.3) |
| Événements rares (Éco §11) | ✅ | `engine/events.js`, ~30 %/jour, ~34 événements |
| Quêtes secrètes (Éco §12) | ⚠️ mono-étape | 9 quêtes/templates `hidden`. **Manque** : mini-arcs 3–5 étapes avec indices |
| Collections de souvenirs (Éco §13, UX §12) | ✅ | musée + collection « Moments » (Phase 2.3) + « Découvertes » (Phase 2.4) + vitrines `???` (Phase 2.5) |
| Page « Mon aventure » (Éco §14, UX §10-11) | ✅ | écran Personnage recadré « qui je deviens » : identité + style en tête, traits qualitatifs, « Ton chemin », chronique, collections (Phase 2.1-2.2) |
| Retour après absence (Éco §15) | ✅ | toast `streak_break_ok` + tirage allégé, quêtes neuves, événement d'accueil et ligne compagnon dédiée quand `daysAway >= 3` (Phase 1.3) |
| Gratuit à vie · pas d'abo · pas de pub | ✅ | = D12 |
| Thèmes payants (Éco §17) | ✅ (forme actuelle) | 1 gratuit + 6 payants (police, palette, texture, cadres, **voix**, cérémonie, effet). `billing.js` prêt |
| Carte du Monde à révélation progressive (UX §15-16) | ✅ | `X/10 révélés`, brume, régions par famille + polish révélation (phrase « pas encore prêtes », encart « tu viens de révéler… », Phase 2.6) |
| Hiérarchie de l'accueil (UX §3-4, §20) | ❌ | l'accueil montre hero card (nom/niveau/XP/élan/série/titres) **avant** les quêtes → Phase 0 |
| « Élan du jour » en % (UX §5) | ❌ | affiché `elan%` → à passer en `0/3 aventures` + phrase |
| Hauteur des cartes de quête (UX §7) | ❌ | à compacter légèrement pour comparer les 3 sans scroller |
| Couleur = langage (UX §19) | ⚠️ partiel | familles ont déjà une couleur (`--fam-color`) ; à formaliser (violet=action, or=XP, bleu=monde) |
| Excès de cadres (UX §18) | ⚠️ | titres de section / intros / chapitres devraient être **sans cadre** |

**Conclusion** : le socle « boucle de jeu » est là. Le travail restant =
**rétention long terme** (mini-arcs, retour-après-absence, mémoire) +
**hiérarchie/présentation UX** (accueil, cartes, journal-récit, Personnage).

---

## 2. Décisions produit à trancher (Yannick) — avant Phase 3-4

1. **Pricing (Éco §17).** `billing.js` a **un produit non-consommable par
   thème** aujourd'hui. L'analyse propose **un bundle « Collection des Mondes »
   à 6,99 €** pour les 6.
   - Bundle : plus simple, meilleur message, 1 fiche produit ; perd l'entrée
     à petit prix.
   - Compromis : bundle + thèmes à l'unité (plus de SKU).
   - `unlockTheme`/`setTheme`/`billing.purchase` supportent les deux sans
     changement — à décider avant de déclarer les produits en Play Console.
2. **Seuils de chapitre (Éco §7).** Niveau (actuel : 3/5/8/12/15) → nb de
   quêtes (10/25/50/100) ? Plus lié à l'activité. Petit changement
   (`chapterForLevel` → `chapterFor(state)`), cosmétique, pas de régression.
3. **Tagline store (Éco §21.1).** « Chaque jour, ton compagnon te propose 3
   petites aventures à vivre dans le monde réel. » → dans `STORE.md`.
4. ~~**Compétences : garder les chiffres ou pas (UX §11).**~~ **Tranché
   (2026-09-08) : Option A — qualificatif seul, sans chiffre** (`dominante /
   émergente / présente / discrète`). Livré en Phase 2.2.
5. **Extensions de contenu payantes (Éco §18)** (packs Nuits / Exploration /
   Chaos / Social, 1,99–2,99 €) : **après** validation de la rétention. Ne
   rien préparer maintenant.

---

## 3. KPI de rétention — local uniquement

KPI central (Éco §4) : **D30 Adventure Return Rate**. Contrainte D11 : rien
n'est envoyé. Ces chiffres restent on-device et servent à alimenter la page
« Mon aventure » (Phase 2) :

- jours joués, jours depuis l'install, plus longue série, retours après absence
- aventures/semaine, quêtes/session, événements découverts, chapitres atteints

Piège (les deux analyses le disent) : **ne jamais transformer ces chiffres en
pression** — pas de « tu as raté X jours », pas de rouge, pas de compteur
culpabilisant.

---

## 4. Roadmap

### Phase 0 — Hiérarchie UX (quick wins, aucun changement moteur) — ✅ fait (QA visuelle appareil à faire)

Faible risque, fort impact lisibilité. Purement `ui/` + CSS + i18n.

- [x] **0.1 Accueil : quêtes au centre** (UX §3-4, §20). Ordre :
  `Jour N` → le compagnon plante le décor → **les 3 quêtes** → événement →
  résumé de progression discret en bas. La grosse hero card a été remplacée
  par `.prog-strip` (prénom · niveau · fine barre XP · série · lien perso).
  `ui/screens/adventure.js`, `ui/components/charBits.js` (`heroCardHtml`
  repurposé), `styles/components.css`.
- [x] **0.2 « Élan du jour » : fraction + phrase** (UX §5). Plus de `%` ni de
  jauge : `.elan-line` = `🌱 n / d aventures` + phrase narrative selon
  l'avancement (`elan_phrase_start` / `_mid` / `_done`). Le panneau encadré
  `.elan-chest` est supprimé.
- [x] **0.3 Compacter les cartes de quête** (UX §7). Marges/paddings réduits
  sur `.quest-card`, `.quest-top`, `.quest-text`, `.quest-meta`,
  `.quest-role` — texte de quête inchangé.
- [x] **0.4 Hiérarchie des boutons** (UX §8). `.quest-actions` : primaire
  (`Accepter` / `Terminé`) `flex: 2`, ghost (`Ignorer` / `Abandonner`)
  `flex: 1` + `small`.
- [x] **0.5 « envoyer à un ami » → `↗ Partager`** (UX §9). i18n
  `q_send_friend`, soulignement retiré dans `.quest-meta`.
- [x] **0.6 Moins de cadres** (UX §18). `.section-label` : filet du bas
  retiré. `.elan-chest` supprimé.
- [x] **0.7 Couleur = langage** (UX §19). Rôles formalisés en commentaire
  dans `styles/themes/base-tokens.css` (accent/seal = action, gold = XP,
  bleu = monde, fam-color = catégorie).

**À faire avant de clore la phase** : QA visuelle sur appareil des 7 thèmes
(l'accueil, les cartes compactées, la `.prog-strip`).

### Phase 1 — Rétention (priorité absolue) — ✅ fait (QA visuelle appareil à faire)

- [x] **1.1 `state.milestones`** (Éco §6, §13). `state.milestones` = map
  `<clé> -> 'YYYY-MM-DD'` (première occurrence). Détection dans
  `engine/milestones.js` : 8 premières fois (`first_quest`, `first_outdoor`,
  `first_social`, `first_evening`, `first_hidden`, `first_bold`, `first_big`,
  `first_event`) + paliers de volume (`volume_10/25/50/100`). `first_rain` /
  météo écartés (pas de donnée on-device). Marqué par les reducers de
  `game.js` après le bookkeeping ; `state.history.lastMilestone = { key, date }`
  pour la voix. Migration : additif, `defaultState` + `normalize` (pas de bump
  `SAVE_VERSION`). L'UI checklist « Moments » reste en Phase 2.3.
- [x] **1.2 Compagnon par jalon** (Éco §10, UX §22-P2). Branche prioritaire
  dans `companionLineForState` : le jour où `history.lastMilestone.date` vaut
  aujourd'hui, le compagnon relève le jalon (le premier de la liste l'emporte
  — une toute première quête passe devant « tu es sorti »). Texte **par thème**
  sous `voice.milestones` dans les 7 `data/themes/*.js` (`voiceFor` fusionne
  en profondeur, fallback nordique). `volume` = `(n) => string`.
- [x] **1.3 Retour après absence** (Éco §15). `engine/comeback.js` :
  `isComebackDay` = `daysAway(state) >= 3` (s'éteint dès que le joueur valide
  quelque chose). `draw.js` : `pickFrom` privilégie l'effort léger, pool
  restreint aux quêtes jamais faites, `chance` d'événement montée à 0.8.
  2 événements `comeback: true` (`ev_retour_chemin`, `ev_retour_page`) —
  jamais tirés hors retour (`eventEligible` + `drawEvent` les met devant).
  Ligne compagnon dédiée sous `voice.ctx.comeback` (7 thèmes), jamais de
  reproche (D3).
- [x] **1.4 Événement d'ouverture occasionnel** (Éco §11).
  `history.daysSinceEvent` incrémenté à chaque `newDay` sans événement, remis
  à 0 sinon. Après `EVENT_DROUGHT_MAX` (4) jours secs, `drawDaily` force
  `chance = 1` : il y a toujours une question à l'ouverture au bout de ~4
  jours. Compteur borné (vérifié en sim).

### Phase 2 — Vie du personnage & présentation — ✅ fait (QA visuelle appareil à faire)

- [x] **2.1 Page « Mon aventure »** (Éco §14, UX §10). `ui/screens/character.js`
  réagencé : titre « Mon aventure » → en-tête identité (prénom, `Niveau N ·
  <style>`, fine barre XP, mot du compagnon via `companionLineForState`) →
  Traits → Titres (si présents) → « Ta chronique » (chapitre en cours) →
  « Ton chemin » (repères doux, §3) → Moments → Découvertes → Musée. Pas de
  nouvel onglet. `pathStatsHtml` : jours d'aventure, plus longue série,
  moments vécus (X / 8), reprises (si > 0).
- [x] **2.2 Compétences → traits qualitatifs** (UX §11). Décision Yannick :
  **qualificatif seul, sans chiffre**. `progression.js` `traitTierFor` →
  `dominante / émergente / présente / discrète`, relatif à la compétence la
  plus haute (jamais un score absolu). Section « Traits de l'aventurier »,
  petit indicateur en segments (non chiffré). `data/taxonomy.js` `TRAIT_TIERS`.
- [x] **2.3 Collection « Moments »** (Éco §13, UX §12). `charBits.momentsHtml` :
  8 cartes premières fois (`milestones` de 1.1), cochées ou **scellées**
  (« Cette page n'a pas encore d'histoire. ») sans dire ce qui les ouvre.
  Ligne de paliers `volume_*` à part (explicites). `MILESTONE_LABELS`.
- [x] **2.4 Collection « Découvertes »** (Éco §13). Nouveau `engine/discoveries.js` :
  `state.discoveries` (map clé→date), dérivé du `contexte` / famille des quêtes
  accomplies. 6 clés **toutes on-device** : `dehors` `chemin` `rencontre`
  `creer` `matin` `soir`. **`pluie` / `nature` / `ville` écartés** — pas de
  donnée météo/géo hors-ligne (D11). `charBits.discoveriesHtml`.
- [x] **2.5 Musée : vitrines `???`** (UX §12). `charBits.inventoryHtml` : 2
  vitrines scellées après les vraies pièces, **uniquement en vue « tout »**
  (curiosité sans transformer le musée en checklist).
- [x] **2.6 Carte du Monde : polish révélation** (UX §15-16). `ui/screens/world.js` :
  ligne « Certaines régions ne sont pas encore prêtes… » quand il reste du
  brouillard / verrouillé ; encart « Tu viens de révéler cette partie du
  monde. » + liseré or sur une région `justRevealed` dans le détail.

### Phase 3 — Récit

- [ ] **3.1 Chronique** (Éco §7, UX §13-14). Seuils en nb de quêtes (décision
  §2.2) ; blurbs de chapitre qui varient légèrement selon la famille
  dominante ; déjà **par thème** via `voice.chapters`.
- [ ] **3.2 Entrée de journal « du jour »** (UX §14). En fin de journée (ou à
  l'ouverture du lendemain), une entrée qui résume ce qui a été vécu (« Jour
  17 — Les détours : tu as quitté ton chemin habituel. 🌿 Observation · 🤝
  Rencontre. Souvenir conservé. »). `engine/journal.js`, `engine/game.js`.
- [ ] **3.3 Mini-arcs secrets 3–5 étapes** (Éco §12). Chaînes
  `??? → indice → ??? → indice → révélation`. Nouveau contenu (`data/arcs.js`)
  + suivi d'avancement dans `state`. **Plus gros levier rétention des deux
  docs.**
- [ ] **3.4 Événements spéciaux** (Éco §12/§22-P3). Jalons, événements
  temporels, événement de retour (recoupe 1.3).

### Phase 4 — Monétisation

- [x] **4.1 Système de thèmes** — fait (6 payants, archi `voice` + `ui` + CSS).
- [ ] **4.2 Achat réel** (Éco §17). `npm i @capacitor-community/in-app-purchases`,
  `npx cap sync`, déclarer le(s) produit(s) selon décision §2.1, permission
  `com.android.vending.BILLING`, vérifier l'API réelle du plugin.
  `platform/billing.js` est prêt.
- [ ] **4.3 Extensions de contenu** (Éco §18). Packs thématiques —
  **seulement après** un D30 Return Rate correct.

---

## 5. Ce qu'il ne faut pas faire (les deux analyses, §23)

- Ne pas refaire l'interface. Ne pas empiler jauges / stats / badges /
  panneaux / menus visibles en même temps.
- Ne pas transformer l'accueil en dashboard.
- Ne pas afficher toute la profondeur du jeu immédiatement.
- Ne pas empiler Habitica + Finch + LifeUp + IA + réseau social + guildes +
  classement.
- Jamais de puissance payante, jamais de pub, jamais d'abonnement (D12).

Le produit reste centré sur :

> ouvrir → choisir une aventure → vivre quelque chose → garder une trace →
> découvrir ce que le compagnon propose ensuite.
