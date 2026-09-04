# IRL RPG — Ton personnage principal

> ⚠️ Décisions postérieures à ce document dans [`DECISIONS.md`](DECISIONS.md) et
> [`TAXONOMIE.md`](TAXONOMIE.md) — ils font autorité en cas de conflit.

## 1. Concept

**IRL RPG** transforme la vie quotidienne du joueur en RPG.

Le joueur est **le personnage principal**.

L'application joue le rôle de **compagnon d'aventure** : elle lui propose des quêtes adaptées à son profil, ses habitudes, ses envies et sa progression, sans jamais lui donner d'ordre.

L'objectif n'est pas de transformer la vie en liste de tâches, mais de créer une sensation d'aventure :

> **« Et si ta vie quotidienne était un RPG, et cette appli ton compagnon d'aventure ? »**

---

## 2. Boucle de jeu

1. Le joueur ouvre l'application.
2. De nouvelles quêtes lui sont proposées.
3. Il choisit celles qu'il souhaite accepter.
4. Il accomplit les quêtes dans le monde réel.
5. Il valide ses actions.
6. Il gagne de l'XP, des récompenses et fait progresser ses compétences.
7. De nouvelles quêtes, événements et éléments narratifs se débloquent.
8. L'application adapte progressivement les quêtes à son comportement.

La boucle doit rester **ludique et volontaire**, sans transformer l'application en outil de productivité classique.

---

# 3. Le personnage

Chaque joueur possède une fiche de personnage.

### Exemple

**Yannick — Niveau 12**

- ✨ Élan du jour : 60 % (quêtes du jour accomplies — purement indicatif, ne bloque rien ; cf. `DECISIONS.md` D5)
- ⭐ XP : 1 240 / 1 500
- 🔥 Série : 6 jours

### Compétences

- 🧠 Curiosité
- 🤝 Social
- 🧗 Audace
- 🎨 Créativité
- 🧹 Discipline
- 😂 Chaos

Les compétences augmentent selon les types de quêtes réalisées.

Le profil doit donner la sensation de **faire évoluer un véritable personnage**, même si les actions sont réalisées dans la vie réelle.

---

# 4. Les quêtes

Les quêtes constituent le cœur de l'application.

Le joueur reçoit plusieurs propositions et choisit celles qu'il souhaite accepter.

## Exemples

### 🟢 Petite quête

> Fais quelque chose que tu repousses depuis 24 heures.

**+50 XP**

### 🔵 Exploration

> Va dans un endroit où tu n'es jamais allé.

**+120 XP**

### 🟣 Sociale

> Parle à quelqu'un avec qui tu n'as jamais discuté.

**+150 XP**

### 🟠 Chaos

> Lance une pièce. Face : prends un chemin différent pour rentrer chez toi.

**+200 XP**

---

# 5. Types de quêtes

## 🏠 Quotidien

Des actions simples de la vie courante.

Exemples :

- Ranger quelque chose.
- Faire une tâche repoussée.
- Cuisiner quelque chose de nouveau.
- Organiser un espace.
- Terminer une petite obligation.

## 🌎 Exploration

Encourager le joueur à découvrir son environnement.

Exemples :

- Prendre une route différente.
- Découvrir un commerce.
- Explorer un endroit inconnu.
- Photographier quelque chose d'étrange.
- Visiter un lieu proche jamais découvert.

## 🤝 Social

Encourager les interactions humaines.

Exemples :

- Envoyer un message à quelqu'un que tu n'as pas contacté depuis longtemps.
- Faire un compliment sincère.
- Parler à une nouvelle personne.
- Organiser une activité avec un ami.

## 🧠 Intelligence

Développer la curiosité et l'apprentissage.

Exemples :

- Apprendre quelque chose pendant 15 minutes.
- Résoudre une énigme.
- Lire sur un sujet inconnu.
- Regarder une conférence ou une vidéo éducative.

## 😂 Chaos

Des quêtes imprévisibles et volontairement absurdes.

Exemples :

> Pendant les prochaines 2 heures, réponds « probablement » à chaque question.

Ou :

> Choisis au hasard entre deux chemins et suis celui qui est sélectionné.

Le but est de créer des moments mémorables.

---

# 6. Quêtes personnalisées

Les quêtes ne doivent pas rester statiques.

L'application apprend progressivement quels types de quêtes le joueur :

- accepte ;
- refuse ;
- réussit ;
- abandonne ;
- réalise régulièrement.

Elle peut alors générer des quêtes adaptées.

### Exemple

Le joueur évite régulièrement les quêtes sociales.

L'application peut proposer :

> ⚠️ **Quête personnelle**
>
> Tu évites les interactions sociales depuis plusieurs jours.
>
> Aujourd'hui, ton objectif est simplement de demander à quelqu'un :
>
> **« Comment se passe ta journée ? »**
>
> **Récompense : +250 XP**

Inversement, si le joueur accomplit beaucoup de quêtes d'exploration :

> 🏆 **Nouvelle compétence débloquée : Explorateur**
>
> Tu as découvert 5 nouveaux endroits cette semaine.

---

# 7. Événements aléatoires

L'application peut interrompre la routine avec des événements temporaires.

### Exemple

> ⚠️ **ÉVÉNEMENT ALÉATOIRE**
>
> Un événement vient d'apparaître à proximité.
>
> **Le marchand ambulant**
>
> Tu as 45 minutes pour trouver une boulangerie que tu n'as jamais visitée.
>
> **Récompense : +300 XP**
>
> **Objet : 🥖 Pain légendaire**

Les événements sont toujours facultatifs.

Le joueur peut choisir :

> ❌ Ignorer

---

# 8. Carte du monde

La progression peut être représentée par une carte RPG.

Exemple :

```text
                    🏔️ Montagne
                       │
                   🔒 Niveau 15
                       │
🏡 Ville ─────────── 🏰 Château
  │                      │
  │                  🔒 Niveau 20
  │
🌲 Forêt
  │
  └──── 🕳️ Grotte mystérieuse
```

Les zones, lieux et événements se débloquent progressivement.

La carte représente symboliquement **la progression réelle du joueur**.

---

# 9. Quêtes de groupe

> Révisé — cf. `DECISIONS.md` D3 : solo d'abord, **aucun classement ni
> comparaison de niveau entre joueurs**. Le social est coopératif et expressif,
> jamais compétitif. La version « présence partagée / +XP synchronisés » est
> reportée à une éventuelle version majeure.

Les amis peuvent apparaître comme personnages (prénom, éventuellement style
d'aventure) — **sans hiérarchie de niveau ni de score**.

### 🏹 Défi entre amis (MVP)

> Yannick choisit une quête pour Thomas et la lui envoie par message.
>
> Thomas choisit une quête pour Yannick.

Aucun compte partagé : chacun valide de son côté, pour le plaisir de se lancer des
défis et de raconter (`interactions` §10).

### ⚔️ Quête commune (MVP)

> Le groupe se met d'accord sur une même quête (« ce week-end, chacun explore un
> lieu inconnu et partage une photo »). Chacun la valide de son côté. Pas de
> synchronisation, pas de score commun.

Cela crée une dimension sociale sans transformer l'application en réseau social ni
en course.

---

# 10. Quêtes cachées

Certaines quêtes ne révèlent pas immédiatement leur importance.

### Exemple

> ❓ **Quête mystérieuse**
>
> Achète quelque chose que tu n'as jamais mangé.
>
> **+100 XP**

Après accomplissement :

> 📖 **Chapitre découvert**
>
> Hier, tu as choisi un fruit du dragon.
>
> Cette décision débloque maintenant une nouvelle quête...

Les actions du joueur peuvent ainsi progressivement construire **une histoire personnelle**.

---

# 11. Narration dynamique

L'application peut donner un contexte narratif aux actions du joueur.

Une simple action peut devenir un élément de l'aventure.

Au lieu de :

> « Visite un nouvel endroit. »

L'application peut présenter :

> 🗺️ **Une zone inconnue vient d'apparaître sur ta carte.**
>
> Personne ne sait ce qui s'y trouve.
>
> **Découvre-la.**

La narration doit rester légère et ne jamais empêcher l'utilisateur de simplement jouer.

---

# 12. Progression

Le joueur gagne principalement :

- ⭐ XP
- 🏆 Succès
- 🎖️ Titres
- 🧩 Compétences
- 🎁 Objets
- 🗺️ Zones
- 📖 Fragments narratifs

Exemples de titres :

- 🥾 Explorateur
- 🤝 Diplomate
- 🧠 Érudit
- 😂 Agent du Chaos
- 🌙 Noctambule
- 🏆 Héros du quotidien

---

# 13. Philosophie du jeu

L'application ne doit **jamais donner l'impression de contrôler la vie du joueur**.

Principes :

- Les quêtes sont facultatives.
- Le joueur peut ignorer une quête.
- Aucun système ne doit culpabiliser le joueur.
- Les séries ne doivent pas devenir une obligation.
- Les récompenses doivent encourager l'exploration plutôt que la performance permanente.
- Les quêtes doivent rester réalisables et adaptées au contexte.

L'application doit donner envie de se dire :

> **« Tiens, ça pourrait être marrant de faire ça. »**

et non :

> **« Merde, j'ai encore une tâche à faire. »**

---

# 14. Vision

IRL RPG mélange :

- RPG
- gamification
- exploration
- narration
- développement personnel léger
- événements aléatoires
- jeu social
- géolocalisation optionnelle

Le concept central reste extrêmement simple :

> ## 🎮 Tu es le héros.
> ## 🗺️ Le monde réel est ton terrain de jeu.
> ## 🧙 L'application est ton compagnon d'aventure.
