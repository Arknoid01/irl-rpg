# IRL RPG — récap global des Phases 0 → 4

> État au 2026-09-08, `main` = `4ea655b`. Les 4 phases de `docs/ROADMAP.md` sont
> livrées **côté code**. Ce qui reste est **manuel / hors environnement de dev**
> (Play Console, appareil réel, QA visuelle).
>
> Autorité sur les choix : `docs/DECISIONS.md` (D1→D17). Détail par phase :
> `docs/SESSION_2026-09-08_phase{1,2,3,4}.md`. Tags git : `phase-0`…`phase-4`.

---

## 1. Ce qui a été livré

### Phase 0 — Hiérarchie UX (`phase-0` = `cf919f0`)
Accueil recentré sur les 3 quêtes : `Jour N → le compagnon plante le décor →
les quêtes → événement → résumé discret`. La grosse hero card devient
`.prog-strip`. « Élan du jour » = `n / d aventures` + phrase (plus de %).
Cartes de quête compactées, hiérarchie des boutons (primaire large / ghost
petit), moins de cadres, couleur = langage formalisée.

### Phase 1 — Rétention (`phase-1` = `37f1d2f`) — DECISIONS **D13**
- **`state.milestones`** (`engine/milestones.js`) : map `<clé> → date`.
  8 premières fois (`first_quest`, `first_outdoor`, `first_social`,
  `first_evening`, `first_hidden`, `first_bold`, `first_big`, `first_event`)
  + paliers `volume_10/25/50/100`. Enregistrés par `completeQuest` /
  `completeEvent`.
- **Compagnon par jalon** : `companionLineForState` relève le jalon le jour
  même (`voice.milestones`, 7 thèmes).
- **Retour après absence** (`engine/comeback.js`) : `isComebackDay` =
  `daysAway ≥ 3`. Tirage biaisé effort léger, quêtes jamais faites, 2
  événements `comeback: true` (hors rotation normale), ligne compagnon dédiée
  (`voice.ctx.comeback`). S'éteint dès la première validation.
- **Anti-disette d'événement** : `history.daysSinceEvent` ; après 4 jours secs,
  `drawDaily` force un événement.

### Phase 2 — Vie du personnage (`phase-2` = `84b8e4f`) — DECISIONS **D14**
- **Écran « Mon aventure »** (`ui/screens/character.js` réécrit) : identité +
  style en tête, mot du compagnon, Traits, Titres, « Ta chronique »,
  « Ton chemin », Moments, Découvertes, Musée. Réagencement, pas de nouvel
  onglet.
- **Traits qualitatifs** (`progression.js: traitTierFor`, décision **§2.4**) :
  `dominante / émergente / présente / discrète`, relatif à la compétence la
  plus haute — **aucun chiffre affiché**.
- **Collection « Moments »** : les 8 jalons, cartes cochées ou **scellées**
  (« Cette page n'a pas encore d'histoire. »).
- **Collection « Découvertes »** (`engine/discoveries.js`) : `state.discoveries`,
  6 clés dérivées du `contexte` / famille — `dehors`, `chemin`, `rencontre`,
  `creer`, `matin`, `soir`. **`pluie` / `nature` / `ville` écartés** (météo/géo
  indisponibles hors-ligne, D11).
- **Vitrines `???`** au musée (vue « tout » seulement).
- **Polish carte** : phrase « Certaines régions ne sont pas encore prêtes… » +
  encart/liseré sur une région révélée.
- `history.comebacks` (compteur de reprises, affiché seulement si > 0).

### Phase 3 — Récit (`phase-3` = `7e4f718`) — DECISIONS **D15 + D16**
- **Chronique en nombre de quêtes** (`chapterFor(state)`, seuils
  `[0,10,25,50,100,200]`, décision **§2.2**). Entrée de journal « nouveau
  chapitre » au passage de seuil. **Nuance de famille** (`voice.chapterLean`,
  6 familles × 7 thèmes).
- **Entrée de journal « du jour »** (`engine/journal.js: dailyRecapEntry`) : au
  **rollover naturel** uniquement, un résumé de la veille, une seule par date,
  jamais pour une journée vide. `voice.dayEntry` + `voice.dayTitles`.
- **Mini-arcs secrets** (`data/arcs.js` + `engine/arcs.js`) : `state.arcs =
  {active, step, completed}`, **un arc à la fois**. 4 arcs (`passage`,
  `visage`, `objet`, `heure`), 3-4 étapes, contenu neutre bilingue + habillage
  `voice.arc`. L'étape courante occupe le créneau « mystère » au tirage
  (`ARC_STEP_CHANCE = 0.28`). `??? → indice → ??? → révélation` + pièce de
  musée dédiée.
- **Événements spéciaux** : `eventEligible` gère `minDaysPlayed` (temporel) et
  `requireMilestone` (écho de jalon). 4 événements.

### Phase 4 — Monétisation (`phase-4` = `4ea655b`) — DECISIONS **D17**
- **Bundle unique « Collection des Mondes »** (décision **§2.1**) :
  `collection_des_mondes`, non consommable, ~6,99 €, débloque les 6 thèmes
  payants. `game.unlockCollection` (idempotent). Plus de SKU par thème.
- **Plugin réel** : **`capacitor-plugin-cdv-purchase`** (le paquet visé,
  `@capacitor-community/in-app-purchases`, **n'existe pas**). Parle direct à
  Play Billing / StoreKit, aucun serveur tiers (D11). `npx cap sync` fait
  (classe `cc.fovea.iap.PurchasePlugin` enregistrée, gradle commité).
- **`nativeBilling`** réécrit contre le pont bas niveau
  `window.Capacitor.Plugins.PurchasePlugin` (pas de bundler dans ce projet).
  API tirée du source Android du plugin. **Flow d'achat / acquittement / forme
  des payloads = à vérifier sur appareil.**
- `AndroidManifest.xml` : `com.android.vending.BILLING`.
- **4.3 (packs de contenu payants)** : pas maintenant — après un D30 Return
  Rate correct.

---

## 2. Architecture ajoutée

### Nouveaux modules moteur
| Fichier | Rôle |
|---|---|
| `engine/milestones.js` | jalons — `MILESTONE_KEYS`, `MILESTONE_LABELS`, `recordQuestMilestones` / `recordEventMilestones` / `applyMilestones` |
| `engine/comeback.js` | retour après absence — `daysAway`, `isComebackDay` (`COMEBACK_DAYS = 3`) |
| `engine/discoveries.js` | collection Découvertes — `DISCOVERY_KEYS`, `DISCOVERY_LABELS`, `recordDiscoveries` |
| `engine/arcs.js` | mini-arcs — `nextArc`, `currentArcStep`, `advanceArc`, `arcInProgress` |
| `data/arcs.js` | contenu des 4 arcs |

### Forme de la sauvegarde (tout ajouté est **additif** — jamais de bump `SAVE_VERSION`)
```
state.milestones      : { <clé> : 'YYYY-MM-DD' }
state.discoveries     : { <clé> : 'YYYY-MM-DD' }
state.arcs            : { active: <arcId|null>, step: <int>, completed: [<arcId>] }
state.history.daysSinceEvent   : int
state.history.lastMilestone    : { key, date } | null
state.history.comebacks        : int
state.history.lastComebackDate : 'YYYY-MM-DD' | null
```
`state/store.js: normalize` assainit chacun ; `deepMerge` sur `defaultState()`
remplit les anciennes sauvegardes.

### Contrat `voice` par thème (les 7 thèmes le remplissent)
`voice.milestones` · `voice.chapterLean` (6 familles) · `voice.dayEntry` ·
`voice.dayTitles` · `voice.arc` (`clue` / `reveal` / `inProgress`) ·
`voice.ctx.comeback`. `data/themes.js: voiceFor` fusionne en profondeur avec
la voix de nordique (référence).

### Constantes figées (ne pas changer sans nouvelle décision)
- Jalons : les 8 `first_*` + `volume_10/25/50/100`
- Découvertes : les 6 clés on-device
- `COMEBACK_DAYS = 3` · `EVENT_DROUGHT_MAX = 4` · `ARC_STEP_CHANCE = 0.28`
- Chapitres : seuils `[0, 10, 25, 50, 100, 200]` quêtes
- `COLLECTION_PRODUCT = 'collection_des_mondes'` (doit matcher Play Console)

---

## 3. Décisions produit tranchées cette session

| Réf | Décision |
|---|---|
| **§2.1** | Pricing = **bundle unique** « Collection des Mondes » (pas de SKU par thème) |
| **§2.2** | Chapitres = **nombre de quêtes** (0/10/25/50/100/200), pas le niveau |
| **§2.4** | Compétences = **qualificatif seul**, sans chiffre |
| D13 | Rétention : jalons figés, seuils retour / disette |
| D14 | Écran Personnage « qui je deviens », traits relatifs, collections scellées/cochées |
| D15 | Chronique en nb de quêtes + nuance de famille |
| D16 | Entrée du jour (rollover naturel), mini-arcs (4, un à la fois), événements spéciaux |
| D17 | Bundle + plugin `capacitor-plugin-cdv-purchase` + intégration pont bas niveau |

**Encore ouverte : §2.3 — tagline store.**

---

## 4. État de vérification

| Vérif | État |
|---|---|
| `npm test` | ✅ **66/66** |
| `npm run sim` (45 j, 2 absences) | ✅ aucune violation — 11-12 jalons, 6/6 découvertes, arcs qui progressent, 2 reprises |
| `npm run quests` | ✅ vert (4 points d'attention connus : social/chaos `consequent`, audace 4-5) |
| CSS `css-tree` | ✅ (validé à chaque passe) |
| `no-network` (D11) | ✅ zéro appel réseau dans `www/js`, `billing.js` inclus |
| **QA visuelle appareil** | ❌ **jamais faite** — pas de navigateur ici. Priorité : « Mon aventure », Chronique, arcs, boutique, les 7 thèmes |
| **Achat in-app réel** | ❌ non testable — pas de Play Console / appareil / AAB signé |

---

## 5. Ce qui reste (manuel / hors dev)

**Bloquant pour publier :**
- Play Console : créer le produit `collection_des_mondes` (non consommable,
  ~6,99 €) ; héberger `privacy.html` (URL publique obligatoire) ; questionnaires
  âge (16+) + data-safety (achats in-app = oui, rien collecté).
- AAB signé (keystore hors git) sur une piste de test fermée + compte testeur
  de licence.
- Dérouler la **checklist `STORE.md` § Achat in-app** : achat, restore (autre
  appareil / réinstall), acquittement (sinon Google rembourse sous 3 j),
  annulation, **revérifier les noms d'événements du plugin** (`purchasesUpdated`
  / `setPurchases`) et la forme des payloads.

**Non bloquant :**
- QA visuelle appareil des Phases 0-4.
- `npm run quests` à remettre dans `.github/workflows/ci.yml` (le token n'avait
  pas le scope `workflow`).
- Nettoyer le CSS orphelin `.hero-*` / `.skill-*` / `.style-*` (+ overrides
  thèmes) laissé par la réécriture de l'écran Personnage.
- Carte du Monde : palette parchemin clair non reprise sous les thèmes sombres
  (cyberpunk, cockpit).
- Vidéos d'aperçu boutique (`previewVideo` null pour 6 thèmes sur 7).
- Combler les trous de la banque de quêtes.
- Décider la tagline store (§2.3).
- **Après validation rétention (D30)** : Phase 4.3 (packs de contenu payants).
- Enrichissement continu : plus d'arcs (`data/arcs.js` — juste du contenu).

---

## 6. Carte des commits

```
phase-0  cf919f0  Phase 0 : hiérarchie de l'accueil, élan narratif, cartes compactées
phase-1  a1262a7  Phase 1 (rétention) : jalons, retour après absence, anti-disette
         37f1d2f  docs : Phase 1 actée
phase-2  c6800d5  Phase 2 : écran « Mon aventure », traits qualitatifs, collections
         84b8e4f  docs : Phase 2 actée
phase-3  c9615c2  Phase 3.1-3.2 : Chronique en nb de quêtes + entrée « du jour »
         014ec2a  Phase 3.3 : mini-arcs secrets
         4fd536a  Phase 3.4 : événements spéciaux
         7e4f718  docs : Phase 3 actée
phase-4  7f2814d  Phase 4.2 : achat in-app « Collection des Mondes »
         4ea655b  docs : Phase 4.2 actée
```

Tag hors phases : `parallel-session-20260906` (4 commits d'une session Claude
parallèle du 2026-09-06, conservés hors `main`).
