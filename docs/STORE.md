# Fiche store — checklist (Android / iOS)

Référence produit : `com.pegasuscorp.irlrpg` · Capacitor · V1 on-device.

## Classement d’âge

| Store | Valeur |
|---|---|
| Décision produit (D6) | **16+** |
| Google Play (IARC / questionnaire) | Viser **PEGI 16** / équivalent regional (Violence: none; Social features: users may interact IRL via suggested activities; no user-generated online content in-app) |
| Apple (App Store) | **17+** si le questionnaire force ce palier pour « unrestricted web » / social IRL ; sinon le plus proche de 16+. Documenter le choix réel à la soumission. |

**Descripteurs typiques à cocher avec prudence :** interactions sociales suggérées
dans le monde réel ; pas de contenu sexuel, pas de drogue, pas de violence
graphique, pas de pubs. **Achats in-app : oui** — un seul, non consommable,
cosmétique (« Collection des Mondes », thèmes visuels + voix du compagnon ;
jamais de contenu de jeu ni d’avantage, D12).

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
| ID produit | `collection_des_mondes` (doit correspondre à `COLLECTION_PRODUCT` dans `www/js/platform/billing.js`) |
| Type | **Produit non consommable** (achat unique, à vie) |
| Prix | ~6,99 € (référence analyse §17 ; ajustable par région) |
| Nom / description | « Collection des Mondes » — débloque les 6 thèmes visuels et voix du compagnon. Aucun avantage de jeu. |

Le même ID sert pour App Store Connect (produit non consommable) le jour d’un
build iOS.

**Vérification sur appareil (impossible dans l’env de dev)** — sur un build
signé, piste de test fermée, avec un compte de testeur de licence :

- [ ] `npm i` + `npx cap sync` + AAB signé uploadé sur une piste de test
- [ ] Le produit apparaît avec son prix dans la boutique (`billing.listProducts`)
- [ ] Achat → les 6 thèmes se débloquent, le thème cliqué s’active
- [ ] Fermer / rouvrir l’app → toujours débloqué (`getPurchases` au lancement)
- [ ] « Restaurer mes achats » sur un autre appareil / après réinstall → OK
- [ ] Acquittement (`acknowledgePurchase`) effectif — sinon Google rembourse
      sous 3 jours
- [ ] Annulation d’achat → message neutre, rien de débloqué
- [ ] Revérifier les noms d’événements (`purchasesUpdated` / `setPurchases`) et
      la forme des payloads contre le plugin installé (commentaires
      `billing.js`)

## Textes listing (brouillon)

**Titre :** IRL RPG  
**Court FR :** Ta vie quotidienne en quêtes RPG — sans culpabiliser.  
**Court EN :** Everyday life as RPG quests — guilt-free.  
**Long FR :** IRL RPG est ton compagnon d’aventure. Chaque jour, de petites quêtes
dans le monde réel (social, exploration, curiosité, création…). Tu acceptes,
ignores ou valides en confiance. XP, compétences, titres, journal — tout reste
sur ton téléphone. Pas de classement, pas de compte, pas de pub. 16+.  
**Long EN :** IRL RPG is your adventure companion. Each day, small real-world
quests (social, exploration, curiosity, creation…). Accept, skip, or complete
on the honor system. XP, skills, titles, journal — everything stays on your
phone. No rankings, no account, no ads. Ages 16+.

## Avant soumission

- [ ] Héberger `privacy.html` et coller l’URL
- [ ] Captures d’écran (utiliser `www/demo.html` si besoin)
- [ ] Icône / feature graphic
- [ ] Questionnaire âge + data safety alignés sur ce doc (achats in-app = oui)
- [ ] Déclarer le produit `collection_des_mondes` (voir section « Achat in-app »)
- [ ] `npx cap sync` + AAB signé (keystore hors git)
- [ ] Vérifier que la case 16+ onboarding apparaît au premier lancement
- [ ] Piste de test fermée : dérouler toute la checklist « Vérification sur
      appareil » de la section « Achat in-app »
