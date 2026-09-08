# IRL RPG — Analyse et évolution de l’interface

## 1. Diagnostic général

L’interface actuelle est déjà **très réussie visuellement**.

Elle possède une identité forte :

> **Grimoire / journal d’aventurier moderne**

Les éléments qui fonctionnent particulièrement bien :

- papier / parchemin ;
- lignes de carnet ;
- bordures fines ;
- typographies serif élégantes ;
- titres en italique ;
- palette violet / bleu / or / beige ;
- boutons façon reliure ;
- cartes de quêtes ;
- navigation thématique.

### Conclusion

**Il ne faut pas refaire le design.**

Il faut faire évoluer l’interface actuelle d’un :

> **« joli grimoire qui contient beaucoup de systèmes »**

vers :

> **« grimoire vivant qui raconte mon aventure »**.

---

# 2. Le principe UX central

L’application doit progressivement être structurée autour de quatre verbes :

> **Faire → Découvrir → Se souvenir → Devenir**

### ⚔️ AVENTURE
Ce que je fais maintenant.

### 🗺 MONDE
Ce que je découvre.

### 📖 JOURNAL
Ce que j’ai vécu.

### ⚜️ PERSONNAGE
Ce que je deviens.

Cette structure doit devenir le modèle mental principal de l’application.

---

# 3. Accueil : priorité aux aventures

## Problème actuel

L’écran d’accueil contient beaucoup d’informations avant les quêtes :

- nom ;
- niveau ;
- XP ;
- élan du jour ;
- série ;
- présages ;
- progression ;
- puis seulement les aventures.

Cela réduit l’impact du cœur du produit.

Or la promesse principale est :

> **« Qu’est-ce que le monde me propose aujourd’hui ? »**

---

# 4. Nouvelle hiérarchie de l’accueil

L’ordre recommandé :

```text
IRL RPG                         ⚙

JOUR 17

LES SIGNES DU JOUR

Trois chemins se présentent à toi.

────────────────────────

QUÊTE 1

QUÊTE 2

QUÊTE 3

────────────────────────

Résumé léger de progression
```

Les informations secondaires comme :

- niveau ;
- XP ;
- série ;

peuvent rester accessibles mais doivent prendre moins de place.

---

# 5. Remplacer « Élan du jour »

Le système actuel d’« Élan du jour » est cohérent avec la philosophie du projet, mais son apparence ressemble encore à une jauge de progression obligatoire.

Cela peut involontairement donner une impression de pression.

## Proposition

Remplacer :

> Élan du jour — 0 %

par :

> 🌱 **Élan du jour — 0 / 3 aventures**

Puis une phrase narrative.

### Avant toute quête

> *Le monde attend encore ton premier choix.*

### Après une quête

> 🌱 **1 aventure vécue**

### Après trois

> ✨ **Ton aventure du jour est complète.**

L’objectif reste un indicateur, pas une contrainte.

---

# 6. Les cartes de quêtes

Les cartes actuelles sont l’un des meilleurs éléments de l’interface.

Exemple actuel :

```text
🌿 TRANQUILLE

🤝 SOCIAL

Fais un compliment sincère
à quelqu’un aujourd’hui.

+130 XP — LE SIGNE EST LU

[ Ignorer ]     [ Accepter ]
```

### Ce qui fonctionne

- forte identité RPG ;
- catégorie immédiatement identifiable ;
- XP visible ;
- texte de quête central ;
- bouton « Accepter » ;
- possibilité d’ignorer sans sanction.

### À conserver

Le bouton :

> **Accepter**

est excellent.

Il donne l’impression de recevoir une mission plutôt que de lancer une fonctionnalité.

---

# 7. Réduire légèrement la hauteur des cartes

Les cartes occupent actuellement beaucoup d’espace vertical.

Sur mobile, l’utilisateur voit difficilement plusieurs aventures en même temps.

Objectif :

> **Permettre de comparer les trois aventures avec très peu de scrolling.**

Réduire légèrement :

- marges internes ;
- espacements ;
- hauteur des métadonnées ;
- espaces entre cartes.

Ne pas réduire la lisibilité du texte principal.

---

# 8. Hiérarchie des boutons

Les deux actions principales sont :

### Secondaire

> Ignorer

### Primaire

> **Accepter**

Le bouton « Accepter » doit rester visuellement dominant.

« Ignorer » peut être plus discret.

L’objectif n’est pas de forcer le joueur mais de rendre le choix naturel :

> **« J’en choisis une. »**

---

# 9. « Envoyer à un ami »

Le lien actuel :

> effort léger · envoyer à un ami

peut être simplifié visuellement.

Proposition :

> ↗ **Partager**

ou une petite icône.

La quête doit rester présentée comme :

> **ton aventure**

avant d’être une fonctionnalité sociale.

---

# 10. Page Personnage

La page actuelle est jolie mais très orientée RPG traditionnel :

- niveau ;
- XP ;
- style ;
- compétences ;
- titres ;
- musée.

Le risque est de donner l’impression :

> **« Je dois optimiser mes statistiques. »**

Or IRL RPG ne doit pas devenir un jeu d’optimisation.

La page doit plutôt répondre à :

> **« Qui suis-je devenu ? »**

---

# 11. Transformer les compétences en traits narratifs

Les compétences actuelles :

- Curiosité ;
- Social ;
- Audace ;
- Créativité ;
- Discipline ;
- Chaos.

fonctionnent visuellement.

Mais elles doivent être présentées comme des traits, pas comme des statistiques à maximiser.

Exemple :

```text
TRAITS DE L’AVENTURIER

🧠 Curiosité       dominante
🤝 Social          émergente
🎨 Créativité      présente
🔥 Audace          discrète
```

Ou conserver les valeurs numériques tout en ajoutant une dimension narrative :

> **Curiosité 18**
>
> *Tu sembles toujours vouloir comprendre.*

La statistique devient alors un outil de narration.

---

# 12. Le Musée

Le Musée est probablement l’un des systèmes ayant le plus gros potentiel narratif.

Le texte actuel :

> « Les vitrines sont vides. Les événements laissent parfois une trace — un ticket, une pierre, un éclat… »

est particulièrement cohérent avec le concept.

Il faut pousser cette idée.

## Exemple

```text
MUSÉE

┌─────────┐   ┌─────────┐
│   🌙    │   │   🪨    │
│         │   │         │
│ Première│   │ Trouvé  │
│ aventure│   │ dehors  │
└─────────┘   └─────────┘
```

Et des vitrines mystérieuses :

```text
┌──────────────┐
│      ???     │
│              │
│ Cette vitrine│
│ n’a pas encore│
│ d’histoire.  │
└──────────────┘
```

Cela crée de la curiosité sans pression.

---

# 13. Le Journal

Le journal actuel commence par :

> PROLOGUE

> Les premiers pas — encore hésitants, déjà vrais.

C’est une excellente direction.

Mais lorsque le joueur avance, le journal doit devenir :

> **la récompense émotionnelle de sa progression.**

---

# 14. Exemple de journal évolué

```text
JOUR 17

LES DÉTOURS

Aujourd’hui, tu as quitté
ton chemin habituel.

Tu as vécu :

🌿 Observation
🤝 Rencontre
🧭 Exploration

────────────────────

SOUVENIR CONSERVÉ
```

Le journal devient progressivement une chronique personnelle.

Il ne sert plus seulement à afficher :

> « J’ai fait une quête. »

Il raconte :

> **« Voilà ce que j’ai vécu. »**

---

# 15. La Carte du Monde

La carte actuelle est déjà très intéressante :

- Foyer ;
- Place des rencontres ;
- Grotte mystérieuse ;
- Observatoire ;
- Atelier ;
- Quartier du quotidien ;
- Chemin du hasard ;
- Château lointain.

Et :

> **1 / 10 révélés**

est une très bonne mécanique.

## Principe

La carte doit progressivement représenter :

> **la progression du joueur dans son propre monde.**

Ne pas révéler toutes les régions immédiatement.

---

# 16. Carte du Monde : présentation recommandée

```text
CARTE DU MONDE

3 / 10 révélés

       🌫 ???

       │

   🏠 FOYER

       │

 🤝 RENCONTRE

« Certaines régions ne sont
pas encore prêtes à être découvertes. »
```

Chaque découverte doit donner l’impression d’avoir révélé une partie du monde.

---

# 17. Typographie

La direction typographique actuelle est excellente.

Conserver le mélange :

- grande serif ;
- italique ;
- petites capitales ;
- titres élégants.

Cela donne :

> carnet d’explorateur / grimoire / journal ancien

sans tomber dans un style fantasy médiévale trop cliché.

Les futurs thèmes peuvent changer les détails mais doivent conserver une hiérarchie typographique cohérente.

---

# 18. Attention à l’excès de cadres

L’interface utilise beaucoup de cartes :

```text
┌─────────────────────┐
│                     │
└─────────────────────┘
```

C’est cohérent avec le grimoire, mais trop de cadres donnent une impression de dashboard.

## Recommandation

### Avec cadres

- cartes de quêtes ;
- informations importantes ;
- objets ;
- récompenses.

### Sans cadre

- titres de sections ;
- transitions narratives ;
- textes d’introduction ;
- chapitres.

Il faut laisser davantage de respiration.

---

# 19. Palette de couleurs

La palette actuelle fonctionne, mais chaque couleur devrait avoir une fonction précise.

## Couleur principale

🟣 Violet

→ navigation / actions / boutons.

## Couleur secondaire

🟡 Or

→ XP / progression / rareté.

## Monde

🔵 Bleu

→ découverte / carte.

## Catégories

🌿 Vert → calme

🤝 Jaune → social

🔥 Orange/rouge → audace

🎨 Couleurs spécifiques → autres familles

Ainsi, la couleur devient un langage visuel.

---

# 20. Nouvel accueil recommandé

```text
┌──────────────────────────────┐
│                              │
│  IRL RPG                 ⚙   │
│                              │
├──────────────────────────────┤
│                              │
│          JOUR 17             │
│                              │
│     LES SIGNES DU JOUR       │
│                              │
│  Trois chemins se présentent │
│  à toi.                      │
│                              │
├──────────────────────────────┤
│                              │
│ 🌿 TRANQUILLE                │
│ 🤝 SOCIAL                    │
│                              │
│ Fais un compliment sincère   │
│ à quelqu’un aujourd’hui.     │
│                              │
│                  +130 XP     │
│                              │
│ [ Ignorer ] [ ACCEPTER ]     │
│                              │
├──────────────────────────────┤
│                              │
│ 🔥 AUDACIEUSE                │
│ ...                          │
│                              │
├──────────────────────────────┤
│                              │
│ ⭐ PRINCIPALE                │
│ ...                          │
│                              │
└──────────────────────────────┘

⚔️       🗺️       📖       ⚜️
AVENTURE MONDE    JOURNAL PERSONNAGE
```

---

# 21. Architecture UX globale

L’application doit progressivement devenir :

```text
                    IRL RPG

                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
       FAIRE       DÉCOUVRIR   SE SOUVENIR
          │            │            │
       Aventure       Monde       Journal
          │            │            │
          └────────────┼────────────┘
                       ↓
                    DEVENIR
                       │
                  Personnage
```

C’est une structure beaucoup plus forte qu’une simple navigation entre quatre pages.

---

# 22. Priorités UX

## Priorité 1 — Accueil

- réduire les informations secondaires ;
- mettre les aventures au centre ;
- rendre l’action immédiate ;
- améliorer la comparaison entre les trois quêtes.

## Priorité 2 — Compagnon / narration

- rendre les messages contextuels ;
- réagir aux actions du joueur ;
- donner l’impression d’une continuité.

## Priorité 3 — Journal

- transformer les actions en récit ;
- créer des chapitres ;
- afficher les souvenirs.

## Priorité 4 — Monde

- révélation progressive ;
- régions mystérieuses ;
- événements liés aux découvertes.

## Priorité 5 — Personnage

- faire évoluer la page vers « qui je deviens » ;
- rendre les compétences narratives ;
- développer le Musée.

---

# 23. Ce qu’il ne faut pas faire

Ne pas refaire complètement l’interface.

Ne pas multiplier :

- les jauges ;
- les statistiques ;
- les badges ;
- les panneaux ;
- les menus ;
- les fonctionnalités visibles simultanément.

Ne pas transformer l’accueil en dashboard.

Ne pas chercher à afficher toute la profondeur du jeu immédiatement.

La profondeur doit être :

> **découverte progressivement.**

---

# 24. Évaluation actuelle

| Domaine | Note |
|---|---:|
| Direction artistique | **9/10** |
| Cohérence visuelle | **9/10** |
| Identité | **9,5/10** |
| Lisibilité | **7,5/10** |
| Hiérarchie | **7/10** |
| Potentiel | **10/10** |

La base visuelle est suffisamment forte pour devenir une vraie identité produit.

---

# 25. Vision finale

L’évolution recherchée n’est pas :

> **plus de fonctionnalités visibles.**

C’est :

> **plus de sens derrière les fonctionnalités existantes.**

L’interface doit donner progressivement au joueur la sensation que :

### Jour 1

> « Ah, c’est marrant. »

### Jour 3

> « Voyons ce qu’il me propose aujourd’hui. »

### Jour 10

> « Mon compagnon commence à connaître mes habitudes. »

### Jour 30

> « J’ai déjà vécu tout ça ? »

### Jour 60

> « Mon personnage me ressemble vraiment. »

### Jour 100

> « J’ai envie de voir quel sera le prochain chapitre. »

---

# 26. Principe directeur

> **Ne pas faire de l’interface un tableau de bord de progression.**
>
> **Faire de l’interface le grimoire vivant de l’aventure du joueur.**

La différence est fondamentale.

Le premier montre des statistiques.

Le second raconte une histoire.

Et c’est cette deuxième direction qui correspond le mieux au positionnement d’IRL RPG :

> **Faire → Découvrir → Se souvenir → Devenir.**
