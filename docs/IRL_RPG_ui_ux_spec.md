# IRL RPG — UI / UX Specification

> Direction artistique et architecture d'interface — version 1.0
>
> ⚠️ Décisions postérieures dans [`DECISIONS.md`](DECISIONS.md) (plateforme,
> « compagnon », « élan du jour », social non compétitif) et périmètre MVP
> resserré dans [`REVUE_CRITIQUE.md`](REVUE_CRITIQUE.md) §4 et §7 — ils font
> autorité en cas de conflit.

---

# 1. Vision de l'interface

IRL RPG doit donner l'impression d'ouvrir **un jeu**, pas une application de productivité.

L'interface doit être capable de changer complètement d'ambiance selon le thème choisi tout en conservant la même structure fonctionnelle.

### Principe central

> **Le gameplay ne change pas. L'univers graphique change.**

Un joueur peut donc utiliser exactement les mêmes fonctions avec une identité visuelle complètement différente.

---

# 2. Architecture générale

L'application repose sur une navigation simple.

## Navigation principale

### 🗺️ Aventure
Écran principal.

Contient :
- message du compagnon ;
- personnage ;
- niveau / XP ;
- élan du jour ;
- quêtes du jour ;
- événements ;
- accès rapide à la carte.

### 🧭 Monde
Carte du monde et découvertes.

Contient :
- zones ;
- lieux ;
- découvertes ;
- événements ;
- zones verrouillées ;
- progression géographique/narrative.

### 🎒 Inventaire
Tout ce que le joueur a découvert.

Contient :
- objets ;
- collectibles ;
- fragments ;
- souvenirs ;
- récompenses.

### 📖 Journal
Mémoire de l'aventure.

Contient :
- quêtes réalisées ;
- événements ;
- découvertes ;
- chapitres ;
- moments importants.

### 👤 Personnage
Fiche RPG.

Contient :
- niveau ;
- XP ;
- compétences ;
- titres ;
- succès ;
- statistiques ;
- style de joueur.

### ⚙️ Menu
Réglages :
- thème ;
- notifications ;
- confidentialité ;
- géolocalisation ;
- accessibilité ;
- compte ;
- données.

---

# 3. Écran d'accueil — Aventure

C'est **l'écran le plus important de l'application**.

Il doit immédiatement répondre à :

> **« Qu'est-ce que mon compagnon me propose aujourd'hui ? »**

## Structure

### Header

Afficher :
- nom / logo IRL RPG ;
- éventuellement niveau ;
- bouton profil ;
- accès aux paramètres.

Le header doit s'adapter au thème.

---

## Bloc compagnon

Zone fortement mise en avant.

Exemple :

> **TON COMPAGNON**
>
> « Une nouvelle journée commence.
> Trois possibilités s'offrent à toi. »

Le bloc peut changer de présentation selon le thème.

Cyberpunk :
> `MISSION INCOMING`

Fantasy nordique :
> `UNE NOUVELLE QUÊTE VOUS ATTEND, VOYAGEUR`

Dark fantasy :
> `UN NOUVEAU CONTRAT EST DISPONIBLE`

---

# 4. Carte personnage compacte

Sous le bloc compagnon :

**Yannick — Niveau 12**

⭐ 1 240 / 1 500 XP

████████████░░░

🔥 Série : 6 jours

### Statistiques visibles

Seulement les informations importantes.

Éviter de transformer l'accueil en écran de statistiques.

Un bouton :

> **Voir le personnage**

ouvre la fiche complète.

---

# 5. Quêtes du jour

Les quêtes constituent le contenu principal.

Chaque quête est une **carte interactive**.

## Carte

### Header

🗺️ EXPLORATION

`+120 XP`

### Corps

> Découvre un endroit où tu n'es jamais allé.

### Actions

`IGNORER`

`ACCEPTER`

Après acceptation :

`VALIDER LA QUÊTE`

---

# 6. Hiérarchie visuelle des quêtes

Toutes les quêtes ne doivent pas avoir le même poids.

## Petite quête

Visuellement discrète.

## Quête importante

Plus grande carte.

## Quête personnelle

Accent visuel spécial.

## Quête épique

Animation + bordure + récompense mise en avant.

## Quête mystérieuse

Informations volontairement masquées.

Exemple :

> ❓ **QUÊTE MYSTÉRIEUSE**
>
> Son contenu sera révélé lorsque tu commenceras.

---

# 7. Événements

Les événements doivent casser visuellement la routine.

Ils apparaissent comme quelque chose de spécial.

### Exemple

⚠️ **ÉVÉNEMENT**

> Une opportunité vient d'apparaître.

`38:42`

**Découvrir**

L'événement doit être clairement différent d'une quête normale.

---

# 8. Écran Monde

## Carte RPG

La carte est stylisée selon le thème.

Elle doit représenter :

> **Le monde que le joueur a découvert.**

### Zones

- découvertes ;
- inconnues ;
- verrouillées ;
- mystérieuses ;
- événements.

### Exemple

```
          🏔️
       Montagnes
          🔒

🌲 Forêt ───── 🏘️ Ville
   │
   │
   🕳️ ?
```

---

# 9. Carte et thèmes

La carte doit être l'un des éléments qui change le plus entre les thèmes.

### Cyberpunk

- carte holographique ;
- néons ;
- quadrillage ;
- points lumineux ;
- interfaces HUD.

### Fantasy

- parchemin ;
- dessin à la main ;
- icônes médiévales ;
- reliefs ;
- routes.

### Dark fantasy

- carte vieillie ;
- taches ;
- symboles occultes ;
- zones brumeuses ;
- contrats.

---

# 10. Écran Personnage

La fiche doit réellement ressembler à une **fiche de personnage RPG**.

## Header

Portrait / avatar.

Nom.

Niveau.

Titre.

## Progression

XP.

Série.

Quêtes réalisées.

## Compétences

🧠 Curiosité

🤝 Social

🧗 Audace

🎨 Créativité

🧹 Discipline

😂 Chaos

Chaque compétence possède :
- niveau ;
- progression ;
- description ;
- statistiques associées.

---

# 11. Style du joueur

Ajouter une section :

> **TON STYLE D'AVENTURE**

Exemple :

### 🧭 Explorateur curieux

> Tu découvres beaucoup de lieux et acceptes régulièrement les quêtes d'exploration.

Cette section évolue avec le comportement du joueur.

---

# 12. Titres

Les titres apparaissent comme des éléments de collection.

Exemple :

🏆 Explorateur

🤝 Diplomate

😂 Agent du Chaos

🧠 Érudit

🌙 Noctambule

Le thème peut modifier leur présentation.

---

# 13. Écran Inventaire

L'inventaire ne doit pas ressembler immédiatement à un inventaire de MMO.

Il doit être davantage un :

> **musée de l'aventure du joueur.**

## Catégories

- 🎁 Objets
- 🗺️ Fragments
- 📜 Reliques
- 📸 Souvenirs
- 🏆 Collectibles

Chaque objet peut avoir une petite description narrative.

---

# 14. Écran Journal

Le journal doit devenir une partie émotionnelle de l'application.

## Timeline

### Aujourd'hui

> 🌎 Découverte d'une nouvelle rue.

### Hier

> 🤝 Rencontre enregistrée.

### Il y a 3 jours

> 🏆 Nouveau titre débloqué.

### Il y a 2 semaines

> 📖 Chapitre : Les premiers pas.

Le journal doit progressivement raconter **la partie du joueur**.

---

# 15. Écran Succès

Présentation sous forme de collection.

### Débloqués

🏆 Premier pas

🌎 Touriste local

😂 Agent du chaos

### Verrouillés

🔒 ???

🔒 ???

Les succès secrets doivent rester volontairement mystérieux.

---

# 16. Écran Paramètres

Simple.

## Sections

### Apparence
- thème ;
- taille du texte ;
- animations ;
- contraste.

### Aventure
- fréquence des quêtes ;
- catégories préférées ;
- difficulté ;
- notifications.

### Confidentialité
- localisation ;
- données ;
- statistiques ;
- permissions.

### Données
- export ;
- import ;
- sauvegarde ;
- suppression.

---

# 17. Système de thèmes

## Principe

Un thème n'est pas simplement une couleur.

Il modifie :

- couleurs ;
- typographies ;
- icônes ;
- bordures ;
- cartes ;
- animations ;
- sons éventuels ;
- vocabulaire ;
- présentation du compagnon ;
- transitions ;
- boutons ;
- illustrations.

---

# 18. Thème 1 — Cyberpunk

## Identité

Technologique.

Nerveux.

Futuriste.

## UI

- fond sombre ;
- néons ;
- panneaux HUD ;
- lignes ;
- scanlines ;
- bordures anguleuses ;
- petites animations ;
- effets de glitch légers.

## Typographie

Police futuriste pour les titres.

Police monospace pour les informations.

## Vocabulaire

Quête → Mission

Événement → Incident

Objet → Item

Compagnon → IA compagnon

Carte → Réseau

## Animation

- scan ;
- glitch léger ;
- apparition holographique ;
- notifications façon terminal.

---

# 19. Thème 2 — Fantasy nordique

## Identité

Aventure.

Voyage.

Héroïsme.

## UI

- parchemin ;
- bois ;
- métal ;
- pierre ;
- ornements ;
- dorures ;
- icônes gravées.

## Typographie

Titres serif fantasy.

Texte lisible et chaleureux.

## Vocabulaire

Mission → Quête

Événement → Événement

Objet → Relique / Objet

Compagnon → Guide / Compagnon de route

Carte → Carte du royaume

## Animation

- fondu ;
- particules légères ;
- parchemin ;
- lueur dorée.

---

# 20. Thème 3 — Dark fantasy

## Identité

Sombre.

Mystérieux.

Dangereux.

## UI

- noir ;
- rouge sombre ;
- métal ;
- cuir ;
- papier ancien ;
- textures ;
- bordures irrégulières.

## Vocabulaire

Quête → Contrat

Événement → Incident

Objet → Relique

Compagnon → Voix / Présence

Carte → Carte des terres

## Animation

- fumée ;
- braise ;
- apparition progressive ;
- transitions lentes.

---

# 21. Thèmes futurs

Architecture prévue pour pouvoir ajouter facilement :

### ☢️ Post-apocalypse

Ruines, métal, radio, survie.

### 🚀 Science-fiction

Station spatiale, hologrammes, interface cockpit.

### 🧙 High fantasy

Magie, grimoires, royaume.

### 🕵️ Enquête

Dossiers, preuves, notes, photos.

### 🏴‍☠️ Pirate

Carte au trésor, bois, cordages, parchemins.

### 🌌 Mystique

Constellations, symboles, rêve, astral.

---

# 22. Règle fondamentale des thèmes

Les thèmes doivent changer **l'habillage et la narration**, pas les fonctionnalités.

Exemple :

Même donnée :

`+120 XP`

Cyberpunk :

> `+120 XP // DATA ACQUIRED`

Fantasy :

> `+120 XP — EXPÉRIENCE GAGNÉE`

Dark fantasy :

> `+120 XP — Le contrat est accompli.`

---

# 23. Animations

Les animations doivent être utilisées pour renforcer le jeu.

## Validation d'une quête

1. Carte réagit.
2. Animation de réussite.
3. XP monte.
4. compétence progresse.
5. récompense apparaît.
6. éventuel nouveau contenu débloqué.

### Exemple

> **QUÊTE ACCOMPLIE**
>
> +120 XP
>
> 🧠 Curiosité +72
>
> 🗺️ Nouvelle zone découverte

---

# 24. Écran de montée de niveau

Moment important.

Ne jamais faire simplement :

> Niveau 12 → Niveau 13.

Faire une vraie petite scène.

### Exemple

# NIVEAU SUPÉRIEUR

**13**

> Ton aventure continue.

Puis :

- nouvelles statistiques ;
- éventuellement titre ;
- nouveau contenu ;
- animation.

---

# 25. UX mobile

L'application doit être pensée **mobile-first**.

## Principes

- une main ;
- gros boutons ;
- textes courts ;
- actions principales toujours accessibles ;
- peu de menus imbriqués ;
- navigation basse ;
- animations rapides ;
- feedback immédiat.

---

# 26. Design System

Tous les thèmes utilisent les mêmes composants logiques :

- Button.
- Card.
- QuestCard.
- EventCard.
- ProgressBar.
- SkillBar.
- Badge.
- Dialog.
- BottomSheet.
- Toast.
- Modal.
- Navigation.
- Header.
- MapNode.
- InventoryItem.

Le composant est identique fonctionnellement mais son apparence est fournie par le thème.

---

# 27. Architecture technique recommandée

Séparer :

## Gameplay

Les données et règles.

```text
Quest
Player
Skill
Item
Event
Achievement
JournalEntry
WorldZone
```

## UI

Les composants.

```text
Home
QuestCard
CharacterCard
Map
Journal
Inventory
Profile
Settings
```

## Theme

Un thème contient :

```text
colors
fonts
icons
textures
animations
vocabulary
sounds
```

Cela permet d'ajouter un nouveau thème sans réécrire le jeu.

---

# 28. Personnalisation avancée des thèmes

À terme, le joueur pourrait choisir :

### Univers
Cyberpunk

### Interface
HUD compact

### Narrateur
IA sarcastique

### Couleurs
Rose / cyan

### Intensité
Animations fortes

Cela crée presque un **créateur de version d'IRL RPG**.

---

# 29. Ce qu'il faut éviter

❌ Une interface trop chargée.

❌ Copier les interfaces de MMORPG.

❌ Trop de statistiques sur l'accueil.

❌ 15 boutons partout.

❌ Animations lentes.

❌ Un thème qui rend le texte illisible.

❌ Faire dépendre une fonctionnalité du thème.

❌ Utiliser directement des assets ou marques de jeux existants.

❌ Donner l'impression d'une application de productivité.

---

# 30. Structure finale recommandée

```text
IRL RPG
│
├── 🗺️ Aventure
│   ├── Compagnon
│   ├── Personnage
│   ├── Quêtes
│   └── Événements
│
├── 🧭 Monde
│   ├── Carte
│   ├── Zones
│   └── Découvertes
│
├── 🎒 Inventaire
│   ├── Objets
│   ├── Fragments
│   └── Souvenirs
│
├── 📖 Journal
│   ├── Timeline
│   ├── Chapitres
│   └── Événements
│
├── 👤 Personnage
│   ├── Stats
│   ├── Compétences
│   ├── Titres
│   └── Succès
│
└── ⚙️ Paramètres
    ├── Apparence
    ├── Aventure
    ├── Confidentialité
    └── Données
```

---

# 31. Priorité UX

## P0 — MVP

- Aventure.
- Quêtes.
- Compagnon.
- Personnage compact.
- XP / niveau.
- Navigation.
- Journal.
- Thèmes.
- Paramètres essentiels.

## P1

- Monde.
- Carte.
- Inventaire.
- Succès.
- Titres avancés.
- Événements.
- animations avancées.

## P2

- Personnalisation poussée des thèmes.
- Sons.
- météo visuelle.
- géolocalisation.
- thèmes supplémentaires.
- narration avancée.

---

# 32. Direction artistique finale

L'application doit avoir une architecture reconnaissable :

> **IRL RPG**

mais chaque thème doit donner l'impression de lancer **un jeu différent**.

Le joueur pourrait passer de :

> 🟦 Cyberpunk

à :

> 🟨 Fantasy

à :

> 🟥 Dark Fantasy

sans perdre son personnage, sa progression ou son aventure.

### Le principe ultime

> **Même jeu.**
>
> **Même personnage.**
>
> **Même aventure.**
>
> **Univers complètement différent.**
