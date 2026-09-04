# Taxonomie IRL RPG — modèle canonique

> **Ce document fait autorité.** Il remplace :
> - `concept` §5 « Types de quêtes » (Quotidien / Exploration / Social / Intelligence / Chaos)
> - `interactions` §2 « 5 familles » (Social / Foufou / Exploration / Improvisation / Observation)
> - `interactions` §28 table de fréquence
> - les catégories improvisées du prototype
>
> Toute modification = mettre à jour **en même temps** le contenu (banque de quêtes)
> et le prototype. Propriété commune.
>
> Date : 2026-09-04.

---

## 1. Deux axes, pas un

| Axe | Rôle | Qui l'utilise |
|---|---|---|
| **Famille** | Classer une quête pour l'**écriture** et le **tirage** | Auteurs de contenu, moteur de tirage quotidien |
| **Compétence** | Faire progresser le **personnage** | Fiche perso, titres, « style d'aventure » |

Une quête a **exactement une famille**. Elle alimente **1 à 2 compétences** via la
matrice (§4). Ne jamais reclasser une quête « par compétence » : la compétence se
déduit de la famille.

---

## 2. Les 6 familles

| Clé | Label | Icône | Ce que c'est | Exemples |
|---|---|---|---|---|
| `social` | Social | 🤝 | Interaction humaine réelle, positive, naturelle | compliment sincère · appeler quelqu'un en vocal · engager la conversation · remercier |
| `exploration` | Exploration | 🧭 | Découvrir son environnement, modifier ses trajets | autre chemin pour rentrer · commerce jamais visité · lieu à 20 min inconnu |
| `curiosite` | Curiosité | 🔭 | Observer le monde autrement **+** apprendre **+** résoudre | trouver 3 choses jamais remarquées · apprendre 15 min · énigme · compter les objets bleus |
| `creation` | Création | 🎨 | Fabriquer / produire quelque chose | cuisiner un plat nouveau · dessiner 2 min · inventer une histoire · photo d'un truc étrange |
| `quotidien` | Quotidien | 🧹 | Vie courante — **toujours avec une torsion** (contrainte, hasard, narration), jamais un todo brut | ranger un espace en te chronométrant · finir une tâche repoussée façon « mission » |
| `chaos` | Chaos | 😂 | Règle absurde temporaire, hasard décisionnel, improvisation | marche uniquement sur les dalles 5 min · pièce pour choisir un chemin · « probablement » à toute question 2 h |

### Fusions depuis les anciens systèmes

| Ancien | Nouveau |
|---|---|
| `concept` « Intelligence » | `curiosite` |
| `interactions` « Observation » | `curiosite` |
| `interactions` « Foufou » | `chaos` |
| `interactions` « Improvisation » | `chaos` |
| créativité éparpillée (proto : dans quotidien/observation/chaos) | `creation` |

### Règle « torsion » pour `quotidien`

Une quête `quotidien` sans mécanique de jeu (contrainte, minuteur, hasard, fragment
narratif) est **refusée en revue**. « Range ta chambre » → non. « Range ta chambre
avant que 3 morceaux de musique soient passés » → oui.

---

## 3. Les 6 compétences

Inchangées depuis `concept` §3.

| Clé | Label | Icône |
|---|---|---|
| `curiosite` | Curiosité | 🧠 |
| `social` | Social | 🤝 |
| `audace` | Audace | 🧗 |
| `creativite` | Créativité | 🎨 |
| `discipline` | Discipline | 🧹 |
| `chaos` | Chaos | 😂 |

> `curiosite`, `social`, `chaos` portent le même nom que leur famille — mnémonique
> volontaire. `exploration → audace` et `quotidien → discipline` diffèrent (le trait
> de caractère est plus large que le type d'activité).

---

## 4. Matrice famille → compétences

Chaque famille alimente une compétence **principale** et une **secondaire**.

| Famille | Principale | Secondaire |
|---|---|---|
| `social` | `social` | `audace` |
| `exploration` | `audace` | `curiosite` |
| `curiosite` | `curiosite` | `creativite` |
| `creation` | `creativite` | `curiosite` |
| `quotidien` | `discipline` | — (aucune) |
| `chaos` | `chaos` | `audace` |

### Conversion XP → compétence

À la validation d'une quête de récompense `xp` :

```
compétence principale  += round(xp * 0.5)
compétence secondaire  += round(xp * 0.2)   // si la famille en a une
```

Une quête peut redéfinir sa secondaire via le champ `skill_bonus` (cas limite
seulement — ex. une quête `quotidien` particulièrement créative peut pointer
`creativite`).

> Coefficients (0.5 / 0.2) = point de départ, à ajuster au tuning de l'économie.

---

## 5. Tags orthogonaux (pas des familles)

Portés par chaque quête, en plus de la famille.

### 5.1 `effort` — coût en temps / énergie

| Valeur | Sens | Points |
|---|---|---|
| `leger` | < 2 min, aucune préparation | 1 |
| `moyen` | 2–20 min | 2 |
| `consequent` | > 20 min ou déplacement dédié | 4 |

**Budget quotidien : 7 points.** Le tirage remplit jusqu'à 7, avec **au plus un
`consequent` par jour**. (Ex. : 1 consequent + 1 moyen + 1 leger, ou 3 moyen + 1 leger.)

### 5.2 `registre` — enjeu de la quête

| Valeur | XP | Vérification | Usage |
|---|---|---|---|
| `quete` | oui (40–300) | auto-attestable (« j'ai réussi ») | contenu porteur de progression |
| `experience` | 0 ou symbolique (≤ 20) | aucune | micro-moments, faits pour le moment pas la récompense |

### 5.3 `poids` — présentation (cf. `ui_ux_spec` §6)

`petite` · `importante` · `personnelle` · `epique` · `mystere`
→ pilote la taille de carte et les effets visuels, pas les règles.

### 5.4 `contexte` — conditions de tirage (toutes optionnelles)

`exterieur` · `trajet` · `presence_gens` · `commerce_ouvert` · `domicile`
· `moment:matin` · `moment:midi` · `moment:soir`

Liste vide = tirable n'importe quand. **MVP : seul `moment:*` est exploité**
(déduit de l'heure, zéro permission). Le reste est renseigné dès maintenant pour
le futur mais ignoré par le tirage MVP.

### 5.5 `defi_ami` — quête envoyable à un ami

`true` = peut être proposée dans le flux « choisis une quête pour un pote »
(texto manuel, aucun compte partagé — cf. `interactions` §10).

### 5.6 `params` — créneaux paramétriques + générateur

`null`, ou un objet dont chaque clé est un slot du texte :

```json
"params": { "duree": [3, 5, 10], "couleur": ["rouge", "bleu", "jaune"] }
```

Le texte contient alors `{duree}`, `{couleur}`. Le tirage choisit une valeur.

**Générateur modulaire (post-V1, livré) :** templates dans `www/js/data/templates.js`
+ pools `slots.js`, instanciés par `engine/generate.js` et mélangés à la banque
curée au tirage. **Pas de générateur libre / LLM.**

### 5.7 `safe_fallback` — repli sécurité (obligatoire si `contexte` ≠ [])

Phrase disant quoi faire si la situation n'est pas sûre / adaptée, la quête restant
validable. Ex. : *« Si l'escalier n'est pas adapté ou qu'il y a du monde, monte
normalement — quête validée quand même. »*
Baked dans le modèle de données, pas seulement sous-entendu (cf. `REVUE_CRITIQUE` §3.7).

---

## 6. Modèle de données d'une quête

```json
{
  "id": "s1",
  "famille": "social",
  "text": "Fais un compliment sincère à quelqu'un aujourd'hui.",
  "xp": 150,
  "effort": "leger",
  "registre": "quete",
  "poids": "petite",
  "skill_bonus": null,
  "contexte": ["presence_gens"],
  "params": null,
  "defi_ami": true,
  "safe_fallback": "Si l'occasion ne se présente pas naturellement, garde l'intention — validable dès qu'elle se présente.",
  "hidden": false,
  "fragment": null
}
```

- `hidden: true` → carte « ❓ Quête mystérieuse », texte révélé à l'acceptation.
- `fragment` → texte narratif ajouté au **Journal** à la complétion (`poids: mystere`
  ou `personnelle` en général).

---

## 7. Tirage quotidien — pondération par famille

Poids de base (ajustés ensuite par les familles préférées du joueur et le curseur
de confort) :

| Famille | Poids |
|---|---|
| `social` | 22 % |
| `exploration` | 18 % |
| `curiosite` | 15 % |
| `chaos` | 15 % |
| `quotidien` | 18 % |
| `creation` | 12 % |

Règles de composition d'une journée (3–4 quêtes, budget 7 pts) :

1. **Au moins 1 `social`** — mais toujours version douce, jamais un constat
   d'évitement (cf. `REVUE_CRITIQUE` §3.1).
2. Au plus **1 `consequent`**.
3. Pas plus de **2 quêtes de la même famille**.
4. Pas **4 `chaos` d'affilée** sur la semaine (rythme émotionnel, `interactions` §29).
5. 25 % de chance de glisser une quête `hidden` à la place d'une quête tirée.
6. 30 % de chance d'un **événement** en plus (hors budget).

---

## 8. Titres & style d'aventure

### Titres — un fil par compétence (V1 : 2 paliers)

| Palier | Seuil | Intention |
|---|---|---|
| T1 | **100** | Première récompense en quelques jours d’engagement sur la compétence |
| T2 | **320** | Palier « maîtrisé » (~2–4 semaines sur une compétence fréquente) |

Un titre par compétence × palier (12 au total). Jamais reperdus. Les poids de
tirage (social 22 · exploration 18 · quotidien 18 · curiosité 15 · chaos 15 ·
création 12) évitent que social/audace écrasent discipline/création.

Courbe XP V1 : `xpToNext(level) = 280 + (level - 1) * 130`
(≈ niv.5 en 1 sem., niv.10 en ~3–4 sem., niv.15 en ~2 mois à ~300 XP/jour).

### Style d'aventure (`ui_ux_spec` §11)

Calculé = les **1 à 2 compétences les plus hautes en valeur relative**. Table de
phrases :

| Combinaison dominante | Style |
|---|---|
| `curiosite` seule | 🔭 Explorateur curieux |
| `social` seule | 🤝 Âme sociable |
| `audace` seule | 🧗 Tête brûlée douce |
| `chaos` seule | 😂 Agent du chaos |
| `creativite` seule | 🎨 Regard d'artiste |
| `discipline` seule | 🧹 Maître de son quotidien |
| `social` + `chaos` | 🎭 Grain de folie sociable |
| `curiosite` + `creativite` | 🖋️ Œil qui invente |
| `audace` + `curiosite` | 🗺️ Aventurier attentif |
| *(défaut, rien ne domine)* | 🌱 Aventurier en devenir |

Évolue en continu avec le comportement. Jamais figé, jamais un jugement.

---

## 9. Checklist de revue d'une quête

Avant d'ajouter une quête à la banque :

- [ ] Une seule `famille`, cohérente avec le contenu
- [ ] `effort` et `registre` renseignés
- [ ] Si `famille: quotidien` → il y a une **torsion** ludique
- [ ] Si `contexte` ≠ [] → `safe_fallback` présent
- [ ] Ne demande jamais : courir/traverser sans regarder, escalader, monter sur une
      structure, approcher un animal inconnu, suivre quelqu'un, entrer chez autrui,
      provoquer, gêner la circulation, alcool/substances (`interactions` §23)
- [ ] Les règles absurdes portent sur **ma** perception / **mes** micro-décisions,
      jamais sur ma façon de répondre aux autres d'une manière qu'ils remarqueraient
      négativement (`REVUE_CRITIQUE` §3.4)
- [ ] Aucune personne ciblée / photographiée / « enquêtée » sans consentement
- [ ] Passe la checklist de conformité philosophie (`REVUE_CRITIQUE` §3.1) :
      ignorable sans pénalité, n'implique jamais un échec du joueur, série cassée
      = zéro coût réel
