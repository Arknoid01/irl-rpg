# Fiche store — checklist (Android / iOS)

Référence produit : `com.pegasuscorp.irlrpg` (nom public : **Cairn**) · Capacitor · V1 on-device.

## Classement d’âge

| Store | Valeur |
|---|---|
| Décision produit (D6) | **16+** |
| Google Play (IARC / questionnaire) | Viser **PEGI 16** / équivalent regional (Violence: none; Social features: users may interact IRL via suggested activities; no user-generated online content in-app) |
| Apple (App Store) | **17+** si le questionnaire force ce palier pour « unrestricted web » / social IRL ; sinon le plus proche de 16+. Documenter le choix réel à la soumission. |

**Descripteurs typiques à cocher avec prudence :** interactions sociales suggérées
dans le monde réel ; pas de contenu sexuel, pas de drogue, pas de violence
graphique, pas de pubs. **Achats in-app : oui** — un seul, non consommable
(« Cairn Complet » : thèmes + fonctions de confort ; jamais d’avantage d’XP, de
vitesse ou de titre, D12/D19).

## Textes légaux / URLs

| Élément | Source |
|---|---|
| Politique de confidentialité | `docs/PRIVACY.md` → publier `www/privacy.html` (GitHub Pages, site perso, etc.) et coller l’URL dans Play Console / App Store Connect |
| Dans l’app | Réglages → À propos (résumé) + gate onboarding 16+ |

Sans URL privacy publique, **Play Console refuse** la publication.

## Data safety / App Privacy (questionnaires)

Réponses alignées V1 :

- Données collectées : **aucune** vers un développeur / serveur
- Données sur l’appareil : progression / préférences (pas « collectées »)
- Partage avec des tiers : **non**
- Chiffrement en transit : N/A (pas de backend) ; sauvegarde locale non chiffrée
  applicativement
- Suppression de compte : N/A (pas de compte) — proposer « Tout effacer » in-app
- Tracking : **non**
- Publicités : **non**
- Achats in-app : **oui** — traités par Google Play / Apple ; aucune donnée de
  paiement ne transite par nous ni un serveur tiers (le plugin parle
  directement au store, D11). Rien de collecté côté développeur.

## Permissions Android déclarées

- `INTERNET` (WebView / polices optionnelles)
- Notifications locales (plugin Capacitor) : `POST_NOTIFICATIONS`, boot, etc.
- `com.android.vending.BILLING` — achat in-app (plugin
  `capacitor-plugin-cdv-purchase`)

Ne pas ajouter de géoloc / contacts / micro sans feature + justification store.

## Achat in-app (Phase 4.2 — D17)

**Produit à déclarer** — Play Console → Monétisation → Produits intégrés à
l’application :

| Champ | Valeur |
|---|---|
| ID produit | `collection_des_mondes` (doit correspondre à `COLLECTION_PRODUCT` dans `www/js/platform/billing.js`) — **id conservé** malgré le nouveau nom public : il se fige à la déclaration (D19) |
| Type | **Produit non consommable** (achat unique, à vie) |
| Prix | ~6,99 € (ajustable par région) |
| Nom | **Cairn Complet** |
| Description FR | Un seul achat, à vie : les 6 mondes (police, couleurs, cadres, voix du compagnon), tes propres quêtes, la rétrospective du mois avec export du journal, jusqu'à 3 rappels par jour, l'arc narratif « Le Sentier ». Aucun avantage de progression. |
| Description EN | One purchase, for life: all 6 worlds (font, colours, frames, companion voice), your own quests, the monthly look-back with journal export, up to 3 reminders a day, the “The Path” story arc. No progression advantage. |

Le même ID sert pour App Store Connect (produit non consommable) le jour d’un
build iOS.

**Vérification sur appareil (impossible dans l’env de dev)** — sur un build
signé, piste de test fermée, avec un compte de testeur de licence :

- [ ] `npm i` + `npx cap sync` + AAB signé uploadé sur une piste de test
- [ ] Le produit apparaît avec son prix dans la boutique (`billing.listProducts`)
- [ ] Achat → les 6 thèmes se débloquent, le thème cliqué s’active, l’onglet « Mes quêtes », la rétrospective et les rappels en plus se déverrouillent (`state.complete`)
- [ ] Fermer / rouvrir l’app → toujours débloqué (`getPurchases` au lancement)
- [ ] « Restaurer mes achats » sur un autre appareil / après réinstall → OK
- [ ] Acquittement (`acknowledgePurchase`) effectif — sinon Google rembourse
      sous 3 jours
- [ ] Annulation d’achat → message neutre, rien de débloqué
- [ ] Essai 24 h d’un thème (sans achat) → thème appliqué, retour à « nordique » à l’expiration
- [ ] Rappels : 3 notifications à 3 heures différentes, permissions Android OK (`SCHEDULE_EXACT_ALARM` refusé sur l’appareil de test : vérifier la ponctualité)
- [ ] Revérifier les noms d’événements (`purchasesUpdated` / `setPurchases`) et
      la forme des payloads contre le plugin installé (commentaires
      `billing.js`)

## Signer l'AAB (une fois)

Le projet lit la clé dans `android/keystore.properties` (ignoré par git, ainsi que
`*.keystore`). Sans ce fichier, `bundleRelease` produit un AAB **non signé**.

```bash
cd ~/Documents/irl-rpg/android
keytool -genkeypair -v -keystore app/cairn-upload.keystore -alias cairn-upload \
  -keyalg RSA -keysize 2048 -validity 10000
cat > keystore.properties <<'EOF2'
storeFile=cairn-upload.keystore
storePassword=<mot de passe>
keyAlias=cairn-upload
keyPassword=<mot de passe>
EOF2
```

**Sauvegarde le keystore ET les mots de passe ailleurs** (gestionnaire de mots de
passe, disque externe) : c'est la clé d'upload. Avec Play App Signing, Google peut
la réinitialiser en cas de perte, mais c'est long. Build :

```bash
cd ~/Documents/irl-rpg && npx cap sync android
cd android && JAVA_HOME=/usr/lib/jvm/java-21-openjdk ./gradlew bundleRelease --no-daemon
# => android/app/build/outputs/bundle/release/app-release.aab
```

Version actuelle : `versionCode 2` / `versionName "1.1"` (`android/app/build.gradle`,
à monter à chaque envoi).

## Textes listing (brouillon)

**Titre :** Cairn  
**Court FR :** Ta vie quotidienne en quêtes RPG — sans culpabiliser, sans pub.  
**Court EN :** Everyday life as RPG quests — guilt-free, ad-free.  
**Long FR :**  
Cairn est ton compagnon d’aventure. Chaque jour, trois petites quêtes dans le monde
réel : dire un mot gentil, changer de trajet, observer, créer. Tu acceptes, tu
ignores ou tu valides sur l’honneur — ignorer ne coûte jamais rien.

• XP, six compétences, titres, journal et carte du monde qui se dévoile  
• Des événements, des mini-arcs secrets, un compagnon qui te répond  
• Aucun classement, aucun compte, aucune pub : tout reste sur ton téléphone

**Cairn Complet** — un seul achat, à vie, jamais d’avantage de progression :  
• 6 mondes complets (police, couleurs, cadres, voix du compagnon)  
• Tes propres quêtes  
• La rétrospective du mois, avec export de ton journal  
• Jusqu’à 3 rappels par jour  
• « Le Sentier », un arc narratif exclusif en 7 étapes  
Chaque thème s’essaie gratuitement 24 h. 16+.

**Long EN :**  
Cairn is your adventure companion. Every day, three small real-world quests: say
something kind, take a different route, notice, create. Accept, skip, or complete
on the honor system — skipping never costs you anything.

• XP, six skills, titles, a journal and a world map that slowly unveils  
• Events, secret mini-arcs, a companion that talks back  
• No rankings, no account, no ads: everything stays on your phone

**Cairn Complete** — one purchase, for life, never a progression advantage:  
• 6 full worlds (font, colours, frames, companion voice)  
• Your own quests  
• The monthly look-back, with journal export  
• Up to 3 reminders a day  
• “The Path”, an exclusive 7-step story arc  
Every theme can be tried free for 24 h. Ages 16+.

**Notes de version 1.1 (FR) :** Cairn Complet : tes propres quêtes, rétrospective du mois et export du journal, jusqu’à 3 rappels par jour, « Le Sentier » (arc narratif exclusif), 6 mondes à essayer 24 h gratuitement. Boutique refaite.  
**Release notes 1.1 (EN):** Cairn Complete: your own quests, monthly look-back and journal export, up to 3 reminders a day, “The Path” (exclusive story arc), 6 worlds to try free for 24 h. Redesigned shop.

## Captures d'écran

Générées dans `resources/store/` (1080×2400, thème nordique sauf indication) :
accueil, boutique, mes quêtes, rétrospective, un thème payant.

## Avant soumission

- [ ] Héberger `privacy.html` et coller l’URL
- [ ] Captures d’écran : `resources/store/` (2 à 8 requises) · [ ] feature graphic 1024×500 (obligatoire)
- [x] Icône (logo « cairn + étoile », `resources/icon.png` 1024, mipmaps Android générés 2026-09-10) · [ ] feature graphic 1024×500
- [ ] Questionnaire âge + data safety alignés sur ce doc (achats in-app = oui)
- [ ] Déclarer le produit `collection_des_mondes` — nom « Cairn Complet » (voir section « Achat in-app »)
- [ ] Créer la clé d’upload + AAB signé (section « Signer l'AAB »)
- [ ] Vérifier que la case 16+ onboarding apparaît au premier lancement
- [ ] Piste de test fermée : dérouler toute la checklist « Vérification sur
      appareil » de la section « Achat in-app »
