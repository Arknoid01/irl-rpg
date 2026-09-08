# IRL RPG — feuille de route

> Réconcilie l'analyse produit `IRL_RPG_Analyse_Modele_Economique_et_Roadmap.md`
> (Yannick, 2026-09) avec l'état réel du code. `DECISIONS.md` reste l'autorité
> sur ce qui est tranché ; ce doc-ci trie ce qui est **fait**, ce qui **reste**,
> et l'ordre pour la suite.
>
> Thèse de l'analyse, retenue : **le risque n°1 est la rétention, pas la
> concurrence.** Objectif unique : qu'un joueur ait envie d'ouvrir l'app demain
> matin pour voir ce que son compagnon lui réserve. Tant que cette boucle ne
> tient pas, ajouter des thèmes ou des badges ne réglera rien (§25 de l'analyse).

---

## 1. État réel vs analyse

L'analyse décrit plusieurs briques comme « à faire » alors qu'elles sont
livrées. Récapitulatif pour ne pas reconstruire :

| Sujet (§ analyse) | État | Où |
|---|---|---|
| Push, pas pull (§3.1) | ✅ verrouillé | D11, écran d'ouverture, `draw.js` |
| Pas de culpabilisation (§3.2) | ✅ testé en dur | D3, `philosophy.js`, `tests/` |
| Zéro cloud (§3.3) | ✅ testé en CI | D11, `tests/no-network.test.mjs` |
| Séparation données/moteur/UI (§3.4) | ✅ | arborescence `www/js/` |
| Souvenir dans la boucle (§5) | ✅ en grande partie | musée (`inventory.js`), fragments + moments de journal, régions/découvertes (`worldView.js`) |
| Mémoire légère du compagnon (§6) | ⚠️ partiel | `state.history` (familleCompleted, recentFamilles, regionsUnlocked, completedQuestIds, totalCompleted, daysPlayed, bestStreak) + `computeStyle`. Le compagnon **cite déjà** un fragment de journal passé (`companion.js` branche `callback`), réagit à la série, au style, à la carte. **Manque** : un tableau `milestones` (premières fois) et des réactions calées sur des jalons de volume (« après 20 quêtes ») |
| Journal → Chronique (§7) | ⚠️ partiel | `chapterForLevel` : 6 chapitres (prologue→ch5), **par thème** (`voice.chapters`). Seuils actuels = **niveau** (3/5/8/12/15) ; l'analyse propose **nb de quêtes** (10/25/50/100) |
| Catégories = axes narratifs (§8) | ✅ | 6 familles, jamais présentées comme des stats à optimiser |
| Styles d'aventurier (§9) | ✅ | `computeStyle`, `STYLE_DEFAULT`, affiché sur l'écran Personnage |
| Compagnon = fil rouge (§10) | ⚠️ partiel | `companionLineForState` a déjà 7 branches contextuelles. **Manque** : narration par jalon de progression |
| Événements rares (§11) | ✅ | `engine/events.js`, ~30 %/jour, tirage adaptatif, ~34 événements |
| Quêtes secrètes (§12) | ⚠️ mono-étape | 9 quêtes/templates `hidden` (texte révélé à l'acceptation). **Manque** : mini-arcs 3–5 étapes avec indices |
| Collections de souvenirs (§13) | ⚠️ partiel | musée (souvenirs + jalons de niveau + loot d'événement). **Manque** : checklist visible de « premières fois » |
| Page « Mon aventure » (§14) | ⚠️ proche | écran Personnage : niveau, style, compétences, titres, musée, `statsHtml` (3 chiffres). **Manque** : la vue-résumé « maison du joueur » du mockup (traits en barres, chronique, mot du compagnon au même endroit) |
| Retour après absence (§15) | ⚠️ partiel | toast de réassurance `streak_break_ok` (D11). **Manque** : tirage adapté (`lastActive > 3j` → plus accessible + contenu neuf + éventuel event de retour) |
| Gratuit à vie sur le gameplay (§16) | ✅ | = D12 |
| Skins payants (§17) | ✅ (форme actuelle) | 1 gratuit + 6 payants, reskins complets (police, palette, texture, cadres, **voix du compagnon**, cérémonie, effet ambiant). Déblocage local, `platform/billing.js` prêt pour l'IAP |
| Pas d'abonnement / pas de pub (§19–20) | ✅ | = D12 |
| Restriction 16+ (§21.4) | ✅ tranché | D6 (l'analyse ne fait que noter le coût marché) |

**Conclusion** : le socle « boucle de jeu » de l'analyse est déjà là. Ce qui
manque est presque entièrement du côté **rétention long terme** (§4, §12, §15)
et **présentation du récit** (§7, §10, §14).

---

## 2. Décisions produit à trancher (Yannick)

Avant de coder les phases 3–4 :

1. **Pricing (§17).** `billing.js` a aujourd'hui **un produit non-consommable
   par thème** (`theme_sombre`, `theme_cyberpunk`, …). L'analyse propose **un
   seul achat « Collection des Mondes » à 6,99 €** pour les 6.
   - Bundle unique : plus simple à vendre, meilleur message (« 6 façons de
     vivre le même RPG »), 1 seule fiche produit.
     Perte : plus d'entrée à petit prix (un thème seul).
   - Compromis possible : bundle **+** thèmes à l'unité (plus de SKU à gérer).
   - **À décider avant de déclarer les produits en Play Console** — le reste
     de l'archi (`unlockTheme`, `setTheme`, `billing.purchase`) supporte les
     deux sans changement.
2. **Seuils de chapitre (§7).** Passer de « niveau » à « nb de quêtes »
   (10/25/50/100) ? Plus lié à l'activité réelle qu'au niveau. Toucherait
   `chapterForLevel` (→ `chapterFor(state)`) et son test — petit changement,
   pas de régression d'équilibrage (les chapitres sont cosmétiques).
3. **Tagline store (§21.1).** Retenir
   « Chaque jour, ton compagnon te propose 3 petites aventures à vivre dans le
   monde réel. » et la porter dans `STORE.md` + la fiche store.
4. **Extensions de contenu payantes (§18)** (packs Nuits / Exploration /
   Chaos / Social à 1,99–2,99 €) : explicitement **après** validation de la
   rétention. Ne rien préparer maintenant.

---

## 3. KPI de rétention — local uniquement

L'analyse recommande un KPI central : **D30 Adventure Return Rate**
(part des joueurs qui reviennent vivre une aventure au jour 30).

Contrainte D11 : **rien n'est envoyé.** Ces chiffres restent on-device et
peuvent être montrés au joueur dans « Mon aventure » (§14) :

- jours joués, jours depuis l'install, plus longue série, retour après absence ;
- aventures/semaine, quêtes/session, événements découverts, chapitres atteints.

Piège à éviter (l'analyse le dit) : ne pas transformer ces chiffres en pression
(pas de « tu as raté X jours », pas de rouge, pas de compteur qui culpabilise).
Cadre : `PHILOSOPHY_CHECKLIST.md`.

---

## 4. Roadmap (nettoyée de ce qui est fait)

### Phase 1 — Rétention (priorité absolue)

| # | Chantier | Détail | Touche |
|---|---|---|---|
| 1.1 | **`state.milestones`** | tableau des « premières fois » (`first_quest`, `first_night_quest`, `first_hidden_quest`, `first_outdoor`, `first_rain`, …), rempli par les reducers de `game.js` à la complétion | `state/defaults.js`, `engine/game.js`, migration `store.js` |
| 1.2 | **Compagnon par jalon** | réactions calées sur `totalCompleted` (10/20/50…) et sur une famille dominante marquée (`« tu passes ton temps à regarder derrière les coins »`). Nouvelle branche dans `companionLineForState`, texte **par thème** (`voice.milestones`) | `engine/companion.js`, `data/themes/*.js` |
| 1.3 | **Retour après absence** | si `daysSinceActive >= 3` : tirage `draw.js` biaisé vers `effort` léger + quêtes/templates jamais faits + 1 event de retour possible ; ligne compagnon dédiée (`voice`) ; jamais de reproche | `engine/draw.js`, `engine/companion.js`, i18n |
| 1.4 | **Événement d'ouverture occasionnel** | après N quêtes sans event, forcer une carte « aujourd'hui, quelque chose est différent » pour créer la question à l'ouverture (§11). Réglage léger du tirage d'événement existant | `engine/events.js` |

### Phase 2 — Vie du personnage

| # | Chantier | Détail |
|---|---|---|
| 2.1 | **Page « Mon aventure »** | vue-résumé (§14 mockup) : niveau + style en titre, traits en barres, chiffres de rétention (§3), chronique en cours, mot du compagnon. Réagencement de l'écran Personnage existant, pas un nouvel onglet |
| 2.2 | **Collection « Moments »** | checklist visible des `milestones` (1.1), cochés au fil du jeu, sans dire au joueur quand ça se déclenche |
| 2.3 | **Collection « Découvertes »** | 🌙 nuit / 🌧 pluie / 🌲 nature / 🏙 ville / 👥 rencontre / 🎨 création — dérivées des `contexte` de quêtes accomplies |

### Phase 3 — Récit

| # | Chantier | Détail |
|---|---|---|
| 3.1 | **Chronique** | seuils en nb de quêtes (cf. décision §2.2) ; blurbs de chapitre qui varient légèrement selon la famille dominante ; déjà **par thème** via `voice.chapters` |
| 3.2 | **Mini-arcs secrets** | chaînes de 3–5 étapes : `??? → indice → ??? → indice → révélation`. Nouveau type de contenu (`data/arcs.js` ?) + suivi d'avancement dans `state`. **Le plus gros levier rétention de tout le doc.** |
| 3.3 | **Événements spéciaux** | jalons, événements temporels, événement de retour (recoupe 1.3) |

### Phase 4 — Monétisation

| # | Chantier | Détail |
|---|---|---|
| 4.1 | **Système de thèmes** | ✅ fait (6 payants, archi `voice` + `ui` + CSS) |
| 4.2 | **Achat réel** | `npm i @capacitor-community/in-app-purchases`, `npx cap sync`, déclarer le(s) produit(s) selon la décision §2.1, permission `BILLING`, vérifier l'API réelle du plugin. L'abstraction `platform/billing.js` est prête |
| 4.3 | **Extensions de contenu** | packs thématiques — **seulement après** que le D30 Return Rate soit correct |

---

## 5. Ce qu'il ne faut pas faire (rappel de l'analyse §23)

Ne pas empiler Habitica + Finch + LifeUp + IA + réseau social + guildes +
classement + 40 statistiques. La simplicité est une force. Le produit reste
centré sur :

> ouvrir → choisir une aventure → vivre quelque chose → garder une trace →
> découvrir ce que le compagnon propose ensuite.
