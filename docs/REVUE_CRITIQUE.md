# Revue critique — specs IRL RPG

> Analyse des 3 documents de design (`IRL_RPG_concept.md`,
> `IRL_RPG_interactions_defis.md`, `IRL_RPG_ui_ux_spec.md`) + prototype
> `irl-rpg-prototype.html`.
> Objectif : repérer trous, incohérences, risques, et cadrer un MVP réaliste
> **avant** d'écrire du code applicatif.
> Date : 2026-09-04.

---

## 0. Verdict rapide

Le concept est solide et **réellement différenciant** : la philosophie anti-culpabilité
(« tiens, ça pourrait être marrant » plutôt que « merde, encore une tâche »).
Le prototype prouve que la boucle de base fonctionne et qu'un thème = jeu de tokens
CSS suffit.

Trois problèmes structurels dominaient tout le reste — **deux tranchés le 2026-09-04**
(cf. `DECISIONS.md`) :

1. ~~**Taxonomie éclatée**~~ → **résolu** : `TAXONOMIE.md` (6 familles / 6 compétences /
   matrice / modèle de quête). Prototype réaligné.
2. **Périmètre = jeu de 2-3 ans** décrit comme si tout était P0. Le MVP doit être
   brutalement réduit (thèmes, carte, générateur, adaptatif, multi = tout post-MVP).
   → cf. §7. **Reste à acter formellement.**
3. ~~**Vérification / enjeu social**~~ → **tranché** (D3) : solo-first, honor-system,
   aucun classement compétitif, social coopératif + expressif uniquement.

~~Décision de plateforme absente : **Godot ou PWA ?**~~ **Tranché** (D1) :
HTML/CSS/JS + Capacitor, pas de Godot. Voir §5.

Autres décisions appliquées le 2026-09-04 : « compagnon » remplace « maître du jeu »
(D4) · « Énergie » supprimée comme ressource, remplacée par « Élan du jour » (D5).
Reste ouvert à l'époque : périmètre MVP (depuis **livré**, voir §7) · public/âge
→ **tranché 16+** (D6, gate onboarding + `docs/STORE.md` / `docs/PRIVACY.md`).

---

## 1. Incohérences entre documents

### 1.1 Taxonomie (le plus grave)

| Source | Catégories |
|---|---|
| `concept` — types de quêtes | Quotidien, Exploration, Social, Intelligence, Chaos |
| `concept` — compétences | Curiosité, Social, Audace, Créativité, Discipline, Chaos |
| `interactions` — familles d'interactions | Social, Foufou, Exploration, Improvisation, Observation |
| `interactions` — table de fréquence §28 | Quotidien, Social, Exploration, Observation, Foufou |
| `prototype` — `cat` | quotidien, exploration, social, intelligence, chaos |
| `prototype` — `skill` | curiosite, social, audace, creativite, discipline, chaos |

Aucun document ne définit le mapping **type de quête → compétence**. Le prototype
l'invente au cas par cas (`quest.skill`). « Créativité » (compétence) n'a aucun
type de quête correspondant ; « Intelligence » (type) n'a aucune compétence
correspondante.

**Action :** figer **un** modèle canonique. Proposition à 2 niveaux :

- **Famille** (pour l'écriture du contenu) : `Social`, `Exploration`, `Observation`,
  `Chaos`, `Quotidien` (toujours avec une torsion, cf. §3.3).
- **Compétence** (pour la progression) : les 6, alimentées via une **matrice fixe**
  famille × (compétence principale + secondaire). Ex. `Exploration → Audace (+),
  Curiosité (+)`.

À écrire dans un `docs/TAXONOMIE.md` court, propriété commune, non modifiable sans
mettre à jour contenu + prototype.

### 1.2 « Maître du jeu » vs « compagnon »

- `concept` / `ui_ux_spec` : **LE MAÎTRE DU JEU** (bloc fortement mis en avant,
  ton « au-dessus » du joueur).
- `prototype` : « ton IA **compagnon** », « compagnon de route », « ton médaillon
  frémit » — entité **à côté** du joueur.

Le prototype est plus aligné avec la philosophie (`interactions` §35 : « le maître
du jeu regarde le monde **avec** toi ») et moins autoritaire.
**Recommandation : adopter « compagnon »** partout, retirer « maître du jeu ».

### 1.3 Stat « Énergie »

- `concept` : `❤️ Énergie : 72` présentée comme stat centrale, **jamais définie**
  (ressource ? PV ? jauge ?).
- `prototype` : réinterprétée en « énergie du jour = % de quêtes faites
  aujourd'hui » — un indicateur de progression, pas une ressource.

Une ressource qui se vide et **conditionne** l'accès aux quêtes = exactement la
pression que la philosophie interdit (`concept` §13).
**Recommandation : supprimer « Énergie » comme ressource.** Garder seulement un
indicateur d'activité du jour, et le renommer (« Élan du jour », « Progression du
jour »).

### 1.4 Quêtes de groupe

- `concept` §9 : « tous les joueurs réunis au même endroit avant 20h »,
  niveaux d'amis affichés — suppose présence partagée / comptes / géoloc.
- `interactions` §10 : « le jeu ne nécessite **pas** de compte partagé », défis
  d'amis = tu envoies un texto manuellement.

Contradiction directe.
**Recommandation :** MVP = version `interactions` §10 (colle sociale manuelle, zéro
backend). Le vrai multijoueur avec présence = version majeure ultérieure.

### 1.5 Thèmes dans le prototype vs règle §29

`ui_ux_spec` §29 : « ❌ utiliser directement des assets **ou marques** de jeux
existants ». Le prototype expose `data-theme="skyrim"` et `data-theme="witcher"`,
titres « Skyrim » / « Witcher ».
**Action (rapide, à faire tout de suite) :** renommer → `nordique` (« Fantasy
nordique ») et `sombre` (« Dark fantasy »), comme les noms de la spec. Risque réel
de rejet store / juridique, pas un détail.

### 1.6 Couche sécurité absente du concept

`interactions` consacre 3 sections (§23-25) à la validation sécurité. `concept`
ne la mentionne nulle part alors qu'elle **détermine quelles quêtes peuvent
exister**. À intégrer comme contrainte de premier ordre dans `concept`.

---

## 2. Trous — ce qui manque dans TOUS les docs

| Sujet | Pourquoi c'est bloquant | Piste |
|---|---|---|
| **Onboarding** | 1er lancement = où on pose les attentes (« ceci n'est pas une to-do list »), le prénom, le niveau de confort, les permissions. Absent partout ; le proto code « Yannick » en dur. | Écran d'accueil : pitch philosophie (1 phrase) → prénom → curseur de confort 1-5 → familles préférées → notifications (opt-in). |
| **Stratégie de notifications** | Un « IRL RPG » vit ou meurt sur le nudge quotidien. C'est une case à cocher dans §16. | Section dédiée. 1 notif/jour max, ton doux, **jamais** « ta série va se casser ». |
| **Modèle économique / coûts** | `concept` ignore le sujet ; la vision Quizz est très nette dessus (« QuizUp est mort : coûts serveurs + 0 monétisation »). | Pilier de design explicite : **MVP 100 % on-device, zéro backend, zéro coût récurrent**. Monétisation = cosmétiques / thèmes plus tard, jamais pay-to-win, jamais de pression. |
| **Confidentialité / analytics** | Une app qui suggère « prends une autre rue », « parle à un inconnu » a une surface de risque et de données sensibles (habitudes, déplacements). | Pilier marketing possible : « ton aventure ne quitte jamais ton téléphone ». Pas de géoloc au MVP. Analytics = zéro ou strictement locales. |
| **Plancher d'accessibilité** | 3 thèmes sombres + polices serif (Almendra SC en petit = illisible). §29 le craint mais rien ne le garantit. | Contraste minimum AA que **les thèmes ne peuvent pas violer** ; taille de police plancher. |
| **Pipeline de contenu** | Qui écrit les quêtes ? Combien ? Relecture ? Quizz a des docs solides là-dessus, IRL RPG rien. | Objectif chiffré (ex. 100 quêtes MVP), format de fiche quête, checklist sécurité par quête, process de revue. |
| **Public / âge** | L'app suppose un adulte (« tu avais 31 ans »). « Parle à un inconnu », « entre dans un commerce » n'ont pas le même profil de risque à 13 ans. | Statut explicite : 16+ ou 18+, ou adapter les quêtes selon un âge déclaré. Impacte le classement store. |
| **Maths de l'économie XP** | Aucun doc ne donne le rythme attendu (XP/jour, temps pour monter de niveau). Le proto : `xpToNext = 200 + (lvl-1)*100`, ~4 quêtes/jour de 40-250 XP. | Premier passage chiffré : cible « niveau tous les X jours » early, courbe qui s'aplatit. |
| **Budget d'effort par jour** | Quêtes de 10 s (« dis bonjour ») à 1 h+ (« va à 20 min de chez toi »). Le tirage en pioche 4 à l'aveugle. | Tag `effort` (léger / moyen / gros) par quête + budget/jour pour éviter 4 grosses quêtes d'affilée. |
| **Décision de plateforme** | Voir §5. | — |

---

## 3. Risques de design

### 3.1 Chaque système pousse vers la pression (contre la philosophie)

Séries, nudges, « énergie », call-outs adaptatifs, titres, notifications :
tous tendent naturellement vers l'obligation. La philosophie est **le produit** ;
il faut la protéger activement.

**Recommandation : checklist de conformité philosophie**, que toute feature doit
passer :

- [ ] Le joueur peut ignorer ça avec **zéro** pénalité (aucune perte réelle) ?
- [ ] Ça n'implique jamais que le joueur échoue / est paresseux / « évite » ?
- [ ] Une série cassée ne coûte rien de réel (pas de perte d'XP, d'objet, de rang) ?
- [ ] Les données nécessaires restent sur l'appareil ?
- [ ] Le ton reste « ça pourrait être marrant », jamais « tu dois » ?

Point d'attention immédiat : le **nudge social** du prototype
(« Tu évites les interactions sociales depuis plusieurs jours ») est exactement le
call-out que `concept` §13 interdit. À réécrire en pure offre positive
(« Voici une mini-interaction toute simple si l'envie te prend »), sans constat
d'évitement.

### 3.2 Vérification vs enjeu social

Le tout-confiance (`interactions` §26-27) est parfait pour un jeu **solo privé**.
Mais dès qu'il y a défis d'amis, quêtes de groupe, niveaux affichés, la comparaison
devient creuse (tout le monde peut valider sans rien faire).

Certaines quêtes sont **invérifiables par nature** (« compte les objets bleus
pendant 10 min ») — l'XP y est un trophée de participation.

**Recommandation :**

1. **Trancher : solo-first, honor-system, aucun classement compétitif.**
   Social = coopératif + expressif uniquement (défis d'amis pour le fun, partage
   de moments). Ça résout ~5 contradictions d'un coup et garde l'app gratuite à
   opérer.
2. Deux registres de contenu explicites :
   - **Expériences** : micro, peu ou pas d'XP, faites pour le moment (pas la récompense).
   - **Quêtes** : porteuses d'XP, au moins auto-attestables.

### 3.3 « Quotidien 35 % » ramène la corvée

`interactions` §28 met 35 % de « range un truc / fais une tâche repoussée ».
C'est beaucoup de contenu à saveur to-do, précisément ce que la philo fuit.
**Recommandation :** soit baisser à ~15-20 %, soit imposer que toute quête
« Quotidien » ait une torsion ludique (contrainte, hasard, narration), jamais un
todo brut.

### 3.4 Défis « Foufou » et friction sociale

« Réponds "probablement" à toute question pendant 2 h », « évite un mot pendant
10 min » en pleine conversation → dégrade des interactions réelles avec des gens
qui n'ont pas consenti. §14/§25 disent « ne pas gêner » mais la catégorie pousse
structurellement vers la friction.
**Recommandation :** règle claire — les règles absurdes s'appliquent à **ta**
perception / **tes** micro-décisions, jamais à la façon dont tu réponds aux autres
d'une manière qu'ils remarqueraient négativement.

### 3.5 Défis d'observation borderline

À relire pour l'effet « malaise » : « enquêteur : trouve 3 indices que quelqu'un
vit dans cette rue » (peut se lire comme du repérage), « invente une histoire sur
la première personne en manteau rouge » (garder strictement interne, ne jamais
cibler / photographier). Le principe consentement est déjà posé (§11, §25) — il
faut juste purger 2-3 quêtes.

### 3.6 Générateur modulaire — cœur technique sous-spécifié

`interactions` §19-20 : `ACTION + CONTRAINTE + DURÉE + CONTEXTE + RÉCOMPENSE +
CONSÉQUENCE`. Problèmes :

- **Sécurité combinatoire** : un combineur libre peut produire de l'infaisable /
  du dangereux (« explore une rue inconnue » + « les yeux fermés » + « 30 min »).
  Un blocklist (§23) ne suffit pas — il faut des **tags de compatibilité** et de
  **contexte requis** par module.
- **Aucun inventaire de modules** : le doc donne des exemples, pas la liste
  énumérée avec tags. C'est ça, le vrai travail.
- **« CONSÉQUENCE »** (fragment narratif) : jamais dit comment c'est écrit
  (par quête ? par famille ? pool aléatoire ?).

**Recommandation MVP :** **pas de générateur libre.** Banque de quêtes curée
(~100) avec quelques créneaux paramétriques (durée, nombre de cibles, couleur),
comme le prototype. Le générateur complet = P2+.

### 3.7 Sécurité = prose, pas spec

`interactions` §23-25 énonce des principes. Pour être actionnable il faut :

- Un champ `safe_fallback` **dans le modèle de données** de la quête
  (« si l'escalier n'est pas adapté, monte normalement, quête validée »), pas
  seulement sous-entendu.
- Une checklist sécurité par quête que l'auteur doit cocher.
- Position explicite : mineurs, proximité route / circulation, météo (verglas),
  nuit.
- Un disclaimer (l'app n'est pas responsable), et **pas** de quête géolocalisée
  « va à tel endroit » sans contexte de sécurité.

### 3.8 Adaptatif / personnalisation — la partie la plus dure, esquivée

`concept` §6 : « l'application apprend ». Avec quoi ? Heuristiques on-device
(compteurs simples, comme `socialNeedsNudge`) vs ML vs génération LLM (coût +
backend). **Recommandation MVP :** compteurs + pondération du tirage, rien de
plus, et **uniquement** pour proposer plus de ce que le joueur aime — jamais pour
pointer un évitement.

### 3.9 Hypothèses urbaines / culturelles

« dalles de trottoir », « pavés », « boulangerie » : très européen urbain. Public
péri-urbain / rural / dépendant de la voiture = beaucoup moins de quêtes
applicables. Pas bloquant pour un MVP FR, à noter comme contrainte de passage à
l'échelle.

---

## 4. Spec UI/UX — points spécifiques

| # | Problème | Recommandation |
|---|---|---|
| 4.1 | **6 onglets** (Aventure/Monde/Inventaire/Journal/Personnage/Menu) sur mobile — contredit « navigation basse, peu de menus » (§25) et « pas 15 boutons » (§29). | MVP = **3 onglets** (Aventure / Journal / Personnage), Paramètres en icône dans le header. Monde + Inventaire = P1. Le prototype (2 onglets) est déjà dans le bon esprit. |
| 4.2 | **Système de thèmes en P0** — un thème modifie « couleurs, typos, icônes, bordures, cartes, animations, sons, vocabulaire, illustrations » (§17) = construire l'app 3 fois. **Risque de périmètre nº 1.** | P0 = **1 seul thème abouti** + architecture de tokens (couleurs + polices + chaînes de vocabulaire). Re-skin complet avec illus / sons / animations par thème = P2. Le proto valide l'approche tokens — et ses thèmes sont volontairement peu profonds, c'est le bon périmètre. |
| 4.3 | **Carte du monde** (§8-9) : abstraite ou géolocalisée ? Style de carte par thème = encore 3× coût d'art. | Trancher : abstraite (plateau symbolique) au MVP, et le MVP ne la contient pas du tout (P1/P2). 2ᵉ plus gros poste de périmètre après les thèmes. |
| 4.4 | **Inventaire = « musée »** (§13) : les objets font-ils quelque chose (déblocages cosmétiques, clés de carte) ou purement déco ? | Décider. Si déco : le dire, éviter d'impliquer un système de craft / économie. |
| 4.5 | **Vocabulaire de thème vs sécurité** : Dark fantasy = « CONTRAT », ton gritty. La philosophie (jamais culpabiliser, toujours optionnel) doit survivre à **chaque** thème. | Règle : le vocabulaire de thème ne change que les mots de saveur ; tout le texte sécurité / optionnalité / « ignore si pas sûr » est **indépendant du thème** et toujours présent. |
| 4.6 | **Scène de montée de niveau** (§24) + **animations avancées** (§23). | Plateforme HTML+Capacitor (§5) : séquence CSS/JS soignée, pas de moteur. Garder ces moments simples et rares. |
| 4.7 | **Accessibilité** : seulement des toggles (§16). Witcher/Almendra SC en petit = illisible. | Plancher de contraste + taille que les thèmes ne peuvent pas franchir. |
| 4.8 | **Onboarding** : absent (voir §2). | — |
| 4.9 | **Notifications** : case à cocher, aucune stratégie (voir §2). | — |
| 4.10 | **Export / import / suppression** (§16) : bon réflexe, aligné on-device. | L'élever au rang de pilier marketing (« ton aventure reste sur ton téléphone »). |

---

## 5. Plateforme — TRANCHÉ : HTML + Capacitor

**Décision 2026-09-04 : app web (HTML/CSS/JS) empaquetée avec Capacitor. Pas de
Godot.** Même approche que le projet Fableris (wrapper Capacitor, `www/` = l'app
web, keystore propre).

Justification : la valeur du produit est la **boucle + la philosophie + le
contenu**, pas un « game feel » animé de moteur de jeu. Le prototype le prouve —
toute la boucle (thèmes, save, tirage, XP, journal) tient en ~30 Ko de web et est
déjà à ~70 % du MVP.

| Critère | HTML + Capacitor |
|---|---|
| Vitesse de dev | Rapide — on continue le prototype |
| Notifications locales natives | Oui (`@capacitor/local-notifications`) — l'app est on-device, pas besoin de push serveur |
| Offline | Oui (tout embarqué, `localStorage` / SQLite Capacitor) |
| Présence store | Oui (vraie app Android/iOS) |
| Un seul codebase mobile + desktop/web | Oui |
| Coût récurrent | Nul (zéro backend) |
| Animations | CSS / transitions / petites libs — suffisant pour la scène de level-up et le feedback de validation |

Conséquences pour la suite :

- Le « projet applicatif » = faire évoluer `prototype/` vers une vraie structure
  d'app web (modules, build, assets), puis ajouter le wrapper Capacitor.
- Notifications quotidiennes = `local-notifications` planifiées côté client.
- Pas de scène de level-up « moteur de jeu » — une séquence CSS/JS soignée.
- Ré-évaluer un moteur seulement si un jour le produit devient très « juicy » /
  temps réel (pas au programme).

---

## 6. Décisions à trancher (avant de coder)

1. ~~**Taxonomie** unique~~ → **fait** : `TAXONOMIE.md` (D2, 2026-09-04).
2. ~~**Solo-first honor-system**, aucun classement compétitif~~ → **tranché : oui** (D3, 2026-09-04).
3. ~~**Plateforme**~~ → **tranché** : HTML + Capacitor (D1, 2026-09-04).
4. ~~**« Compagnon »** remplace « maître du jeu »~~ → **tranché : oui** (D4, 2026-09-04).
5. ~~**« Énergie »** supprimée comme ressource~~ → **tranché : oui**, remplacée par « Élan du jour » (D5, 2026-09-04).
6. **Public / âge** : ~~16+ ?~~ → **tranché 16+** (D6), gate onboarding + fiche store.
7. **Générateur** : banque curée au MVP, générateur libre en P2 ? (recommandé : oui)
8. **Objectif contenu MVP** : combien de quêtes, écrites par qui, relues comment ?

Encore à acter historiquement : items 7 et 8 (contenu). Périmètre MVP livré (§7).

---

## 7. MVP réaliste

> **V1 livrée le 2026-09-04** dans `www/` conformément à ce périmètre — voir
> `DECISIONS.md` § « V1 livrée » et `www/README.md`. Ajout en cours de route :
> bilingue FR/EN (D7).

Les specs décrivent un jeu de 2-3 ans. P0 doit être impitoyable.

**Dans le MVP :**

- 1 thème (architecture tokens, mais 1 seul livré)
- 3 onglets : Aventure / Journal / Personnage ; Paramètres en icône
- Banque de quêtes curée (~100) avec tags `famille`, `effort`, `safe_fallback`
  et quelques créneaux paramétriques — **pas** de générateur libre
- Tirage quotidien **budgété en effort**, accepter / ignorer / valider
- XP / niveau / 6 compétences / titres
- Journal : fragments narratifs + « moments mémorables »
- 1 type d'événement aléatoire
- Onboarding : prénom, curseur de confort, pitch philosophie, **acquittement 16+**
- 1 notification quotidienne (douce, opt-in)
- Sauvegarde on-device + export / import
- Checklist de conformité philosophie appliquée à chaque écran
- Confidentialité / store : `docs/PRIVACY.md`, `docs/STORE.md`, `www/privacy.html`

**Hors MVP (P1 / P2) :**

Monde / carte, Inventaire, générateur modulaire, adaptatif « intelligent »,
quêtes de groupe / multijoueur, art / son / animations par thème, thèmes
supplémentaires, géolocalisation, météo, scène de level-up élaborée.

**Écart depuis le prototype (déjà ~70 % du MVP) :**

onboarding · écran Personnage plein · budget d'effort · curseur de confort ·
notification quotidienne (→ `@capacitor/local-notifications`) · réécriture du nudge social ·
tuning compétences → titres · volume de la banque de quêtes (18 → ~100) ·
renommer les thèmes (marques) · champ `safe_fallback` dans le modèle de quête.

---

## 8. À faire vite (sans décision de fond)

- [x] Renommer les thèmes du prototype : `skyrim` → `nordique`, `witcher` →
      `sombre` (risque marque, §1.5). — *fait 2026-09-04*
- [x] Réécrire le nudge social en offre positive (§3.1). — *fait : `wantsGentleSocial`,
      texte neutre, plus de tag « ⚠️ Quête personnelle »*
- [x] Écrire `docs/TAXONOMIE.md` (§1.1). — *fait 2026-09-04*
- [x] Réaligner les familles du prototype sur `TAXONOMIE.md`
      (`intelligence` → `curiosite`, ajout `creation`). — *fait 2026-09-04*
- [ ] Purger / relire 2-3 quêtes « curiosité » borderline (§3.5) — le prototype
      n'en contient plus de problématiques ; à garder en tête pour la vraie banque.
