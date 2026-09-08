# IRL RPG — Analyse produit, modèle économique et plan d’évolution

## 1. Positionnement

Le produit n’est pas simplement une application de tâches gamifiée.

### Positionnement recommandé

> **Une application qui transforme la vie quotidienne en petite aventure.**

Le cœur de l’expérience :

```text
Ouvrir l’app
    ↓
Recevoir 3 propositions
    ↓
Choisir une aventure
    ↓
Faire quelque chose dans le monde réel
    ↓
Gagner de l’XP
    ↓
Conserver un souvenir
    ↓
Faire évoluer son personnage
    ↓
Revenir le lendemain pour découvrir la suite
```

Le différenciateur central :

> **Le joueur ne fabrique pas sa liste de tâches. Son compagnon lui propose son aventure.**

---

# 2. Différenciation face au marché

## Concurrents / références

- Habitica
- LifeUp
- Finch
- LifeForge
- Questify
- DayLyze
- RPG Life

### Comparaison conceptuelle

| Produit | Tâches créées par l’utilisateur | Propositions d’aventures | Punition | RPG | Vie réelle | Privacy forte |
|---|---:|---:|---:|---:|---:|---:|
| Habitica | ✅ | ❌ | ✅ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| LifeUp | ✅ | ❌ | Faible | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Finch | Partiel | ✅ | Très faible | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| LifeForge | Partiel | ✅ | Variable | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Questify | ✅ | Partiel | Faible | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| DayLyze | ✅ | ✅ | Forte | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **IRL RPG** | **❌** | **✅✅✅** | **❌** | **⭐⭐⭐⭐** | **⭐⭐⭐⭐⭐** | **⭐⭐⭐⭐⭐** |

### Terrain à occuper

Ne pas chercher à battre Habitica sur :

- la profondeur RPG ;
- les équipements ;
- les guildes ;
- le social ;
- la quantité de contenu.

Ne pas chercher non plus à copier Finch.

Le terrain propre à IRL RPG est :

> **La vraie vie comme aventure surprise.**

---

# 3. Les forces du produit

## 3.1 Push, pas Pull

L’utilisateur n’a pas besoin de construire sa todo-list.

Il ouvre l’application et reçoit des propositions.

Cela rapproche davantage le produit d’un jeu que d’un outil de productivité.

---

## 3.2 Pas de culpabilisation

Philosophie :

- pas de perte d’XP ;
- pas de perte de niveau ;
- pas de sanction après absence ;
- pas de pression excessive ;
- streaks doux ;
- retour possible après plusieurs jours.

Cette philosophie devient une véritable identité de marque.

Message potentiel :

> **Tu peux disparaître deux semaines. Ton personnage t’attend.**

---

## 3.3 Zéro cloud

L’architecture actuelle repose sur :

- pas de backend ;
- pas de compte obligatoire ;
- pas d’IA cloud ;
- pas de télémétrie ;
- pas d’API ;
- notifications locales ;
- sauvegarde locale ;
- moteur déterministe.

Cela donne un avantage économique et marketing :

> **Ton aventure reste sur ton téléphone.**

Le coût marginal par utilisateur est donc très faible.

---

## 3.4 Architecture déjà adaptée

Le projet possède une séparation claire entre :

- données ;
- moteur ;
- état ;
- progression ;
- tirage ;
- génération ;
- UI ;
- thèmes ;
- i18n ;
- plateforme.

Le système de thèmes est donc particulièrement adapté à une monétisation cosmétique / narrative.

---

# 4. Faiblesse principale : la rétention

Le principal risque n’est pas la concurrence.

C’est la répétition.

Jour 1 :

> « C’est génial, mon téléphone me donne une quête. »

Jour 7 :

> « Encore une balade ? »

Jour 30 :

> « Pourquoi je reviens ? »

Le vrai objectif est donc de construire une raison de revenir.

### KPI principal recommandé

> **D30 Adventure Return Rate**

Pourcentage d’utilisateurs qui reviennent vivre une aventure au jour 30.

KPI secondaires :

- D1 ;
- D7 ;
- D30 ;
- quêtes/session ;
- sessions/semaine ;
- événements découverts ;
- chapitres débloqués ;
- taux de retour après absence ;
- conversion premium.

La confidentialité reste prioritaire : ces statistiques peuvent rester locales et être présentées à l’utilisateur sans être envoyées à un serveur.

---

# 5. Nouvelle boucle de jeu recommandée

Passer de :

```text
Ouvrir
 ↓
3 quêtes
 ↓
Choisir
 ↓
Faire
 ↓
XP
 ↓
Demain
```

à :

```text
             TON MONDE
                 ↓
        Ton compagnon observe
                 ↓
          3 AVENTURES
                 ↓
               Choix
                 ↓
       Action dans la vraie vie
                 ↓
            Récompense
                 ↓
       Souvenir / découverte
                 ↓
         Journal personnel
                 ↓
       Progression du héros
                 ↓
      Le monde évolue légèrement
                 ↓
              Demain...
```

Le changement fondamental est l’apparition du **souvenir**.

Les quêtes ne doivent plus être seulement des actions isolées.

Elles doivent alimenter une histoire personnelle.

---

# 6. Donner une mémoire légère au compagnon

Pas besoin d’IA.

Le moteur peut exploiter les données déjà disponibles.

Exemple :

```js
memory = {
    firstOutdoorQuest: true,

    discoveredPlaces: 4,

    completedCategories: {
        exploration: 12,
        social: 7,
        creativity: 9,
        courage: 3
    },

    preferences: {
        likesExploration: true,
        likesSocial: false
    },

    milestones: [
        "first_quest",
        "first_night_quest",
        "first_hidden_quest"
    ]
}
```

Le compagnon peut ensuite produire des réactions contextuelles :

> « Tu as beaucoup exploré ces derniers jours. »

> « Ça fait longtemps que tu n’as pas tenté une quête sociale. »

> « Tu te souviens de la première fois où tu as fait ça ? »

Tout cela peut être déterministe.

---

# 7. Transformer le journal en Chronique

Le journal doit évoluer de simple historique vers :

> **le récit de la partie du joueur.**

Exemple :

## Chapitre I — Le commencement

> Tu ne savais pas encore ce que tu cherchais.

Puis :

## Chapitre II — Les premiers détours

> Tu as commencé à sortir de tes habitudes.

Puis :

## Chapitre III — Le monde devient plus grand

Les chapitres peuvent être débloqués automatiquement.

Exemple :

```text
10 quêtes  → Chapitre II
25 quêtes  → Chapitre III
50 quêtes  → Chapitre IV
100 quêtes → Chapitre V
```

Mais le contenu peut également varier selon le comportement du joueur.

---

# 8. Transformer les catégories en axes narratifs

Exemples :

```text
EXPLORATION
SOCIAL
CRÉATIVITÉ
OBSERVATION
COURAGE
CALME
CURIOSITÉ
CHAOS
```

Ces catégories deviennent progressivement des axes décrivant le joueur.

Important :

> Elles ne doivent pas devenir des statistiques à optimiser.

Elles servent à raconter le type d’aventurier que devient le joueur.

---

# 9. Styles d’aventurier

Après suffisamment de données, calculer un profil.

Exemple :

## 🧭 EXPLORATEUR

> Tu acceptes souvent les quêtes qui te font découvrir quelque chose.

Ou :

## 🔥 IMPULSIF

> Tu choisis régulièrement les aventures les plus inhabituelles.

Ou :

## 👁 OBSERVATEUR

> Tu remarques énormément de détails autour de toi.

Le but n’est pas forcément d’accorder des bonus.

Le jeu doit surtout pouvoir dire :

> **« Voilà le genre d’aventurier que tu deviens. »**

---

# 10. Faire du compagnon le fil rouge

Le compagnon doit progressivement devenir :

> **le narrateur de la partie.**

Au lieu de :

> « Bravo ! +20 XP »

il peut dire :

### Première semaine

> « Je crois qu’on commence à prendre nos marques. »

### Après 20 quêtes

> « Tu sais quoi ? Tu es beaucoup plus curieux que je ne le pensais. »

### Après une absence

> « Te voilà enfin. J’ai gardé quelques aventures de côté. »

### Après beaucoup d’exploration

> « Tu passes ton temps à regarder ce qu’il y a derrière les coins. »

Le compagnon crée ainsi une continuité émotionnelle.

---

# 11. Événements rares

Ajouter des événements qui apparaissent occasionnellement.

Exemple :

```text
Quest
Quest
Quest
Quest
Quest
  ↓
EVENT
```

Possibilités :

> **Événement inhabituel**

> Aujourd’hui, quelque chose est différent.

Ou :

> **Ton compagnon a trouvé quelque chose.**

Ou :

> **Le monde t’a remarqué.**

Le but est de créer une question au moment de l’ouverture :

> **« Qu’est-ce qui va se passer aujourd’hui ? »**

---

# 12. Quêtes secrètes

Le système de quêtes cachées peut devenir un vrai outil de rétention.

Exemple :

```text
???
 ↓
Indice 1
 ↓
???
 ↓
Indice 2
 ↓
???
 ↓
Révélation
```

Des mini-arcs de 3 à 5 étapes suffisent.

La quête peut être présentée comme :

> **???**

Puis révéler progressivement son contexte.

---

# 13. Collections de souvenirs

Créer des collections qui se remplissent naturellement.

## Moments

```text
☑ Première aventure
☑ Première quête nocturne
☐ Première rencontre inattendue
☑ Première quête secrète
☐ Première aventure sous la pluie
```

## Découvertes

```text
🌙 Nuit
🌧 Pluie
🌲 Nature
🏙 Ville
👥 Rencontre
🎨 Création
```

Chaque quête peut potentiellement débloquer quelque chose.

Le joueur n’a pas forcément besoin de savoir exactement quand.

---

# 14. Nouvelle page : « Mon aventure »

Créer une page centrale qui résume la progression.

Exemple :

```text
          ⚔️ Niveau 12

       L’EXPLORATEUR CURIEUX

────────────────────────

🗺 98 aventures vécues

📖 48 souvenirs

🏆 12 titres

🌍 7 découvertes

🔥 14 jours d’aventure

────────────────────────

TES TRAITS

Curiosité       ██████████
Exploration     █████████
Créativité      ███████
Social          ████

────────────────────────

📖 CHRONIQUE

Chapitre III
« Les détours »

────────────────────────

🐉 TON COMPAGNON

« Tu commences à devenir
quelqu’un d’intéressant... »
```

Cette page devient la maison du joueur.

---

# 15. Retour après absence

La philosophie doit rester :

> **absence ≠ punition**

Si :

```text
lastActive > 3 jours
```

alors adapter les propositions.

Exemple :

> **Bon retour, aventurier.**

> Ton compagnon a préparé trois choses simples.

Après absence :

- privilégier des quêtes accessibles ;
- privilégier du contenu nouveau ;
- éviter les répétitions ;
- éventuellement déclencher un événement de retour.

---

# 16. Modèle économique recommandé

## Gratuit à vie

Tout ce qui constitue le jeu doit rester gratuit :

- 3 propositions quotidiennes ;
- quêtes ;
- XP ;
- niveaux ;
- compétences ;
- titres ;
- compagnon ;
- journal ;
- événements ;
- progression ;
- monde ;
- inventaire ;
- hors ligne ;
- sauvegarde/export.

Aucun paywall sur le gameplay.

---

# 17. Remplacer « skins payants » par « Collections des Mondes »

Le modèle actuel « skins payants » risque d’être trop faible en valeur perçue.

Proposition :

# IRL RPG — Collection des Mondes

### Prix cible

**6,99 € — achat unique**

Chaque monde est une expérience esthétique et narrative.

Exemples :

- 🌲 Forêt ancienne ;
- 🌌 Cosmos ;
- 🏰 Royaume ;
- 🌆 Cyberpunk ;
- ☠️ Terres mortes ;
- 🔮 Mystique.

Chaque monde peut modifier :

- interface ;
- typographies ;
- textures ;
- cadres ;
- animations ;
- couleurs ;
- réactions du compagnon ;
- formulation des cérémonies ;
- style du journal ;
- vocabulaire.

Le produit vendu n’est donc pas :

> « 6 skins »

mais :

> **« 6 façons différentes de vivre le même RPG. »**

---

# 18. Extensions futures

Pas immédiatement.

Une fois la rétention validée :

- Pack « Les Nuits » — 1,99–2,99 €
- Pack « Exploration » — 1,99–2,99 €
- Pack « Chaos » — 1,99–2,99 €
- Pack « Social » — 1,99–2,99 €

Principe :

> nouvelles aventures + nouvelle ambiance + nouveau contenu narratif.

Jamais de puissance payante.

---

# 19. Pourquoi éviter l’abonnement

Pour IRL RPG, l’abonnement serait difficile à justifier :

> pas de serveur ;
> pas d’IA cloud ;
> pas de service continu obligatoire.

Le paiement unique correspond beaucoup mieux à la philosophie :

> **« Tu payes une fois, et l’aventure reste à toi. »**

Le produit peut ainsi transformer la confidentialité en argument commercial.

---

# 20. Pourquoi éviter la publicité

La publicité entrerait en contradiction avec l’expérience :

```text
Aventure personnelle
      ↓
Notification
      ↓
PUBLICITÉ
```

Le modèle sans publicité est beaucoup plus cohérent avec :

- immersion ;
- simplicité ;
- confidentialité ;
- expérience premium ;
- zéro backend.

---

# 21. Risques à surveiller

## 21.1 Concept trop abstrait

« IRL RPG » ne suffit pas forcément à expliquer le produit.

La promesse marketing doit être immédiatement compréhensible.

Proposition :

> **Chaque jour, ton compagnon te propose 3 petites aventures à vivre dans le monde réel.**

---

## 21.2 Répétition du contenu

Le moteur possède déjà :

- banque curée ;
- génération modulaire ;
- anti-répétition ;
- pondération des familles ;
- événements ;
- quêtes cachées.

Mais à long terme, il faudra enrichir la **grammaire narrative**, pas uniquement ajouter des variantes de paramètres.

---

## 21.3 Manque d’utilité fonctionnelle

Habitica aide à gérer les tâches.

Finch accompagne le bien-être.

LifeUp gamifie la productivité.

IRL RPG vend surtout :

> **l’envie de vivre quelque chose d’intéressant.**

Cela signifie que le plaisir, la surprise et la narration doivent compenser l’absence d’utilité traditionnelle.

---

## 21.4 Restriction 16+

Le choix 16+ peut réduire le marché potentiel face à certains concurrents plus accessibles.

Il reste néanmoins cohérent avec les contraintes de sécurité liées aux quêtes IRL.

---

# 22. Roadmap concrète

## Phase 1 — Rétention

### 1. Mémoire du joueur
- préférences ;
- catégories ;
- milestones.

### 2. Compagnon contextuel
- réactions basées sur l’historique.

### 3. Retour après absence
- propositions adaptées.

### 4. Événements rares
- événements aléatoires et surprises.

---

## Phase 2 — Vie du personnage

### 5. Page « Mon aventure »
- statistiques narratives ;
- progression ;
- souvenirs.

### 6. Styles d’aventurier
- profil calculé.

### 7. Collections
- découvertes ;
- moments ;
- événements.

---

## Phase 3 — Récit

### 8. Chronique
- chapitres ;
- progression narrative.

### 9. Mini-arcs secrets
- 3–5 étapes ;
- indices ;
- révélations.

### 10. Événements spéciaux
- milestones ;
- événements temporels ;
- événements de retour.

---

## Phase 4 — Monétisation

### 11. Système de thèmes
- exploiter l’architecture existante.

### 12. Collection des Mondes
- achat unique autour de 6,99 €.

### 13. Extensions
- seulement après validation de la rétention.

---

# 23. Ce qu’il ne faut surtout pas faire

Ne pas transformer IRL RPG en :

> Habitica + Finch + LifeUp + IA + réseau social + boutique + guildes + classement + 40 statistiques.

La simplicité est une force.

Le produit doit rester centré sur :

> **ouvrir → choisir une aventure → vivre quelque chose → garder une trace → découvrir ce que le compagnon propose ensuite.**

---

# 24. Vision produit finale

### Jour 1

> « Ah c’est marrant. »

### Jour 3

> « Voyons ce qu’il me propose aujourd’hui. »

### Jour 10

> « Mon compagnon commence à connaître mes habitudes. »

### Jour 30

> « Putain, j’ai déjà fait tout ça ? »

### Jour 60

> « Mon personnage me ressemble vraiment. »

### Jour 100

> « J’ai envie de voir quel sera le prochain chapitre. »

Le produit n’est alors plus seulement une application utilisée.

Il devient :

> **une petite histoire de la vie réelle du joueur qu’il continue d’écrire.**

---

# 25. Priorité absolue

Le prochain objectif n’est pas d’ajouter énormément de fonctionnalités.

C’est :

> **faire en sorte qu’un utilisateur ait envie de découvrir ce que son compagnon lui réserve demain matin.**

Si cette boucle fonctionne, la monétisation devient secondaire et naturelle.

Si elle ne fonctionne pas, ajouter des skins, des badges ou des fonctionnalités ne résoudra pas le problème.
