# Session du 2026-09-05 — audit, différenciation, boutique de thèmes

> Récap de travail avec Claude Code, pour reprendre plus tard sans tout
> réexpliquer. Complète `DECISIONS.md` (D11, D12) — ce doc-ci raconte le fil,
> `DECISIONS.md` fait autorité sur ce qui est tranché.

## 1. Audit de départ

Revue du code existant (moteur, tests, CI, sécurité, release-readiness).
Verdict : architecture saine (reducers purs, state immuable, storage
injectable pour les tests), 37 tests verts, philosophie testée en dur
(« ignorer ne coûte rien »). Points faibles identifiés : `privacy.html` pas
hébergé (bloque Play Store), `versionCode`/`versionName` figés à 1/1.0,
3 vulnérabilités npm mineures (outillage `@capacitor/cli`, pas de runtime).
**Mis de côté à la demande de Yannick** : tout ce qui touche à la
publication Play Store, pour se concentrer sur la différenciation produit.

## 2. Différenciation face au marché

Recherche concurrentielle (Habitica, LifeUp, Finch, RPG Life, LifeForge,
IRLQUEST) : le marché 2026 converge vers IA cloud + leaderboard +
récompenses réelles. Trois axes retenus pour aller à rebours (verrouillés
**D11**, commit `50ed0c1`) :

1. **Push, pas pull** — le compagnon propose, le joueur ne crée jamais sa
   propre quête. Écran d'ouverture reformulé, réplique compagnon « callback »
   qui cite un fragment de journal passé.
2. **Anti-pression** — `docs/PHILOSOPHY_CHECKLIST.md` créé. Bug corrigé :
   `streak_break_ok` existait en i18n depuis la V1 mais n'était jamais
   affiché — câblé en toast de réassurance.
3. **Zéro cloud** — `tests/no-network.test.mjs` fait échouer la CI si un
   appel réseau apparaît dans `www/js`.

Puis (commit `2bb0576`) : écran de choix de langue explicite au tout premier
lancement (remplace la détection silencieuse), switch de langue retiré de la
topbar (restait dans Réglages), sélecteur de thème retiré (onboarding +
réglages) — l'app reste figée sur `nordique` par défaut, en préparation du
point suivant.

## 3. Modèle économique (D12)

Discussion : pubs + achat pour les enlever, ou achat unique ? **Tranché :
achat unique, jamais de pub** — une pub impliquerait du tracking tiers,
contradiction directe avec D11 et avec ce que l'app promet déjà
(`set_data_body`, `STORE.md`). Jamais de pay-to-win (cohérent D3) : le
contenu de jeu (quêtes, XP, compétences) reste identique et gratuit pour
tout le monde.

**Contenu du pack payant, décidé après plusieurs allers-retours** : pas plus
de quêtes, mais des **reskins complets** (thèmes `sombre` et `cyberpunk`,
déjà présents dans le code mais jamais poussés) — palette + police + texture
+ formes de cadres + répliques de compagnon adaptées, une identité visuelle
vraiment différente par thème plutôt qu'un simple recolorage.

Mécanique d'essai envisagée mais pas tranchée techniquement : gratuit à vie
plutôt qu'un mur de paiement après un essai chronométré (meilleur pour un
lancement sans budget marketing — moins de conversion par joueur, mais
beaucoup plus d'installs/bouche-à-oreille).

## 4. Refactor architecture + boutique (commit `9245376`)

- **1 fichier = 1 thème**, JS et CSS, même principe : `data/themes.js` et
  `styles/themes.css` deviennent de simples registres qui importent
  `data/themes/{nordique,sombre,cyberpunk}.js` et
  `styles/themes/{base-tokens,nordique,sombre,cyberpunk}.css`. Ajouter un
  thème plus tard = un nouveau fichier + une ligne d'import, rien d'autre à
  toucher.
- **Bug de cascade CSS attrapé et corrigé** : `@import` doit précéder toutes
  les autres règles CSS ; le `:root` partagé devait donc être importé *avant*
  les thèmes (`base-tokens.css` en premier), sinon ses valeurs par défaut
  auraient gagné sur les couleurs des thèmes pour `<html>` (même
  spécificité, l'ordre décide).
- **Cyberpunk** : identité complète — police Orbitron (titres) + Share Tech
  Mono (corps), embarquées en local (licence SIL OFL, zéro appel réseau,
  cohérent D11), texture de page en grille/scanlines, cadres nets, couleurs
  d'onglets propres, effets d'ambiance (scanline animée, halo qui pulse),
  ripple au clic (`ui/ripple.js`, gated sur le thème + `prefers-reduced-motion`).
- **Sombre** : palette enfin complète (fond/encre propres au lieu d'hériter
  du parchemin chaud de nordique) — pas encore poussé au niveau de
  cyberpunk (pas d'effets dédiés, pas de vidéo).
- **Boutique** (`ui/shop.js`, Réglages → Apparence → « Voir les thèmes ») :
  aperçu live en CSS de chaque thème (police, couleurs, vraie réplique de
  compagnon via `companionLineFor`, animations) — pas de vidéo/GIF au
  départ (impossible à produire dans cet environnement sans navigateur).
  Déblocage **local pour l'instant** (`unlockedThemes` en sauvegarde,
  `game.unlockTheme()`) ; `game.setTheme()` refuse un thème non débloqué —
  prêt à recevoir un vrai plugin IAP Capacitor sans rien changer d'autre.
- CSS validé avec un vrai parseur (`css-tree`, transitif via jsdom) plutôt
  qu'à l'œil — a attrapé le bug de cascade ci-dessus.

## 5. Vidéo d'aperçu réelle (commits `2d0cbf6`, `a9fa0a9`)

Deux bugs UX trouvés en testant sur un vrai appareil (rien n'a pu être vérifié
visuellement ici, pas de navigateur dans cet environnement) :

- **« Débloquer » ne semblait rien faire** : ça ajoutait le thème aux
  thèmes possédés sans l'activer. Corrigé — débloquer active désormais tout
  de suite le thème acheté ; « Activer » reste utile pour rebasculer entre
  thèmes déjà possédés sans repayer.
- **Format vidéo** : la première vidéo (enregistrement brouillon de
  Yannick, portrait, fournie via `/sdcard/Movies/Recorder0/`) était
  affichée dans une case pensée pour un ratio fixe, d'abord portrait, puis
  16:9 forcé — les deux étaient faux. Corrigé en une case qui **s'adapte au
  format réel de la vidéo** (`width` contrainte + `height: auto` +
  `max-height`/`object-fit: contain` en garde-fou), fonctionne quelle que
  soit l'orientation des prochains enregistrements.

Vidéo compressée de 3,9 Mo (1080×2400, 5,7 s) à 340 Ko (480 px de large,
piste audio déjà absente) via `ffmpeg` (installé pour l'occasion,
`apt-get install ffmpeg`), intégrée à `www/assets/videos/cyberpunk-preview.mp4`.
**Marquée comme brouillon par Yannick** — à remplacer par un vrai
enregistrement qualitatif plus tard, même procédé (déposer le fichier, je
compresse et branche `previewVideo` dans `data/themes/<thème>.js`).

## 6. Poussée visuelle cyberpunk (commits `2f989b0`, `ee7532a`)

Deux passes, sur demande explicite de pousser encore le thème :

1. **Effets génériques du genre cyberpunk** (pas une marque précise —
   cohérent avec `REVUE_CRITIQUE.md` §1.5 sur les assets/marques de jeux
   existants) : glitch chromatique bref sur titres/logo/chiffres, néon
   renforcé sur XP/niveau, bande de danger jaune/noir sur les panneaux
   d'événement, boutons primaires à coins coupés.
2. **Panneau principal vraiment sombre** : `.page`/`.panel` étaient restés
   clairs (`#eef2f6`) alors que le fond extérieur (`body`) était déjà
   sombre — le thème ne « lisait » pas comme sombre puisque la zone où on
   passe le plus de temps était claire. Palette inversée (panneau sombre,
   texte clair), accents éclaircis pour ressortir. Rattrapage des contrôles
   secondaires (boutons, champs, pastilles, sélecteur de langue, filtres
   musée, jauge d'élan) qui étaient câblés en dur pour un fond clair.

**Pas encore rattrapé** (mineur, à corriger si repéré en testant) :
`.quest-fallback`, `.refresh-btn`, quelques badges plus rares.

## 7. État des tests

42/42 tests passent (`npm test`), simulation 45 jours inchangée
(`npm run sim` — niveau 12, aucune violation de la philosophie anti-pression).
CSS validé avec `css-tree` à chaque changement (pas de rendu visuel possible
dans cet environnement).

## 8. Reste ouvert pour la suite

- **QA visuelle réelle** : jamais vérifiée ici (pas de navigateur). Tout ce
  qui a été construit doit être revu sur appareil avant d'aller plus loin
  visuellement.
- **Vidéo cyberpunk actuelle** : brouillon, à remplacer par un enregistrement
  qualitatif (paysage ou portrait, la case s'adapte).
- **Thème sombre** : palette complète mais pas encore de pass visuel poussé
  (effets, police dédiée, vidéo d'aperçu) comme cyberpunk.
- **Voix du compagnon par thème** : la boutique affiche déjà les
  `companionLines` de base (existaient depuis le début, une par thème),
  mais la cérémonie de quête, les chapitres de journal, etc. ne sont pas
  encore réécrits par thème — juste esquissé dans D12, jamais fait.
- **Vrai plugin IAP Capacitor** : le déblocage est local/gratuit pour
  l'instant. `unlockTheme()`/`setTheme()` sont prêts à recevoir un vrai
  paiement validé par le store sans changement d'architecture.
- **Play Store** : explicitement mis de côté ce jour-là (hébergement
  `privacy.html`, `versionCode`/`versionName`) — à reprendre quand le
  contenu payant sera prêt à être vendu pour de vrai.

## Commits de la session

```
50ed0c1 Verrouiller 3 axes de différenciation face au marché (D11)
2bb0576 Choix de langue explicite au premier lancement, thème figé par défaut
9245376 Ajoute la boutique de thèmes payants (D12) : architecture, effets, déblocage local
2d0cbf6 Corrige le déblocage de thème + intègre la première vraie vidéo d'aperçu
a9fa0a9 Aperçu boutique : s'adapte au format réel de la vidéo (portrait ou paysage)
2f989b0 Pousse le visuel cyberpunk : glitch chromatique, néon renforcé, coins coupés
ee7532a Cyberpunk : panneau principal vraiment sombre (plus un fond clair sur fond noir)
```
