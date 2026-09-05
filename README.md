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
| Onboarding (écran d'ouverture, langue, thème, prénom, confort, familles, rappel, **ack 16+**) | ✅ |
| 4 onglets (Aventure / Monde / Journal / Personnage) + réglages, 3 thèmes | ✅ |
| 98 quêtes bilingues curées + 42 templates génératifs (slots), tirage quotidien budgété | ✅ |
| XP / niveau / 6 compétences / 12 titres / style / série sans coût | ✅ |
| Journal (fragments + moments mémorables), 34 événements | ✅ |
| Monde : carte symbolique, 10 régions, découvertes progressives | ✅ |
| Musée / inventaire (souvenirs, jalons de niveau) | ✅ |
| Cérémonie de validation de quête, transitions en fondu | ✅ |
| Défi d'ami = partage de texte (pas de classement) | ✅ |
| FR/EN + bouton de bascule, sauvegarde on-device + export/import | ✅ |
| Rappel quotidien (`@capacitor/local-notifications`, repli web) | ✅ |
| Multijoueur, géoloc, générateur libre (LLM) | ⬜ non prévu (D2/D3) |

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

Héberger `privacy.html` publiquement (URL à coller dans la console store le
jour de la soumission) · politique de version Android (`versionCode`/
`versionName` encore à 1/1.0) · pipeline pour étoffer durablement la banque
de quêtes · équilibrage de la courbe d'XP. Décisions produit en attente
(dont le choix « 3 quêtes/jour » d'un nouveau plan UX vs le moteur actuel) :
voir `docs/DECISIONS.md` (D9).
