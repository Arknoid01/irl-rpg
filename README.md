# IRL RPG

> « Et si ta vie quotidienne était un RPG, et cette appli ton compagnon d'aventure ? »
> *“What if your everyday life were an RPG, and this app your adventure companion?”*

Application mobile qui transforme le quotidien en RPG : le joueur est le héros, le
monde réel est le terrain de jeu, un **compagnon** propose des petites quêtes IRL
(sociales, exploration, curiosité, création, absurdes…) et fait progresser un vrai
personnage (XP, niveau, compétences, titres, journal d'aventure). Philosophie :
« tiens, ça pourrait être marrant » — jamais « merde, encore une tâche ».

**Projet indépendant**, aucun lien avec Quizz. Bilingue **FR / EN**.

## V1 jouable — `www/`

Application complète, testée, dans **`www/`** (voir `www/README.md`).

```bash
npm run serve      # http://localhost:8123
npm test           # moteur + parcours DOM (jsdom)
npm run sim        # simulation d'une partie de 45 jours
```

Empaquetage Android/iOS : `npm install && npx cap add android && npx cap sync`.

| Élément | État |
|---|---|
| Plateforme : HTML/CSS/JS + Capacitor (D1) | ✅ |
| Onboarding (langue, thème, prénom, confort, familles, rappel, **ack 16+**) | ✅ |
| 3 onglets (Aventure / Journal / Personnage) + réglages, 3 thèmes | ✅ |
| ~95 quêtes bilingues, tirage quotidien budgété, accepter/ignorer/valider | ✅ |
| XP / niveau / 6 compétences / 12 titres / style / série sans coût | ✅ |
| Journal (fragments + moments mémorables), événements | ✅ |
| Défi d'ami = partage de texte (pas de classement) | ✅ |
| FR/EN + bouton de bascule, sauvegarde on-device + export/import | ✅ |
| Rappel quotidien (`@capacitor/local-notifications`, repli web) | ✅ |
| Monde/carte, inventaire complet, générateur libre, multijoueur, géoloc | ⬜ post-V1 |

## Documentation

| Fichier | Contenu |
|---|---|
| `docs/DECISIONS.md` | Décisions tranchées (fait autorité en cas de conflit) |
| `docs/TAXONOMIE.md` | Familles, compétences, matrice, modèle de quête |
| `docs/PRIVACY.md` · `www/privacy.html` | Confidentialité (on-device, 16+) |
| `docs/STORE.md` | Checklist publication Play / App Store |
| `docs/REVUE_CRITIQUE.md` | Revue critique des specs + périmètre MVP |
| `docs/IRL_RPG_concept.md` · `_interactions_defis.md` · `_ui_ux_spec.md` | Specs d'origine |
| `prototype/irl-rpg-prototype.html` | Prototype initial (conservé pour référence) |

## Reste ouvert

Générateur modulaire de quêtes (post-V1) · équilibrage fin de la courbe d'XP
et des paliers de titres · héberger `privacy.html` et coller l'URL dans la
console store le jour de la soumission.
