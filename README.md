# IRL RPG

> « Et si ta vie quotidienne était un RPG dont l'application était le maître du jeu ? »

Application mobile qui transforme le quotidien en RPG : le joueur est le héros, le
monde réel est le terrain de jeu, l'application propose des petites quêtes IRL
(sociales, exploration, observation, absurdes…) et fait progresser un vrai
personnage (XP, niveau, compétences, titres, journal d'aventure).

**Projet indépendant** — aucun lien avec le projet Quizz (il traînait par accident
dans `Téléchargements/Quizz-main/`).

## Plateforme

**HTML / CSS / JS + Capacitor** (décidé 2026-09-04). Pas de Godot. Le cœur reste
une app web (comme le prototype), empaquetée en app Android/iOS via Capacitor pour
les notifications natives et la présence store. Même approche que le projet
Fableris.

## État

| Élément | État |
|---|---|
| Concept + vision | Rédigé — `docs/IRL_RPG_concept.md` |
| Design gameplay (interactions, défis, générateur, sécurité) | Rédigé — `docs/IRL_RPG_interactions_defis.md` |
| Spec UI/UX (navigation, thèmes, design system, priorités) | Rédigé — `docs/IRL_RPG_ui_ux_spec.md` |
| Taxonomie canonique (familles, compétences, tags, modèle de quête) | `docs/TAXONOMIE.md` |
| Journal de décisions (plateforme, compagnon, solo-first, élan du jour…) | `docs/DECISIONS.md` |
| Revue critique des specs | `docs/REVUE_CRITIQUE.md` |
| Prototype web fonctionnel | `prototype/irl-rpg-prototype.html` (autonome, `localStorage`) |
| App HTML + Capacitor | Non démarrée |

## Prototype

Ouvrir `prototype/irl-rpg-prototype.html` dans un navigateur. Couvre : accueil
(personnage + quêtes du jour), journal, 3 thèmes (cyberpunk / fantasy nordique /
dark fantasy), tirage quotidien, XP / niveau / compétences / titres, entrée
sociale douce, quête cachée, événement aléatoire, sauvegarde locale.

## Prochaines étapes

Voir `docs/DECISIONS.md` (décisions tranchées) puis `docs/REVUE_CRITIQUE.md` §7
« MVP réaliste » et §6 items encore ouverts (périmètre MVP à acter, générateur,
objectif contenu).
