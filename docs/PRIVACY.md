# Politique de confidentialité — IRL RPG

**Dernière mise à jour : 2026-09-04**  
Éditeur : Pegasus Corp (`com.pegasuscorp.irlrpg`)

Version publique bilingue (hébergeable) : [`www/privacy.html`](../www/privacy.html).

## En bref

IRL RPG fonctionne **entièrement sur ton appareil**. Pas de compte, pas de
serveur de jeu, pas de publicité, pas d’analytics, pas de tracking.

## Données stockées

Sur l’appareil uniquement (`localStorage` / stockage WebView Capacitor) :

- prénom / nom de héros choisi ;
- préférences (langue, thème, confort, familles, rappels) ;
- progression (XP, niveau, compétences, titres, série) ;
- quêtes du jour, journal, souvenirs d’événements ;
- acquittement d’âge 16+ (`ageAck`).

Tu peux **exporter** (réglages) ou **effacer** (réglages) cette sauvegarde à tout
moment. Effacer l’app ou les données de l’app les supprime aussi.

## Ce que l’app ne fait pas

- Pas de collecte vers un serveur IRL RPG
- Pas de vente / partage de données personnelles à des tiers
- Pas de compte utilisateur, e-mail ou identifiant publicitaire
- Pas de géolocalisation (V1)
- Pas de réseau social intégré

## Fonctions optionnelles liées au système / réseau

| Fonction | Comportement |
|---|---|
| Rappel quotidien | Notifications **locales** du système (Capacitor). Aucun push serveur. |
| Défi d’ami | Partage de **texte** via la feuille de partage du système (SMS, messagerie…). Le contenu partagé ne passe pas par nos serveurs (il n’y en a pas). |
| Polices | Embarquées dans l’app (pas de CDN externe). |

## Sauvegardes Android

`android:allowBackup` peut inclure les données de l’app dans une sauvegarde
système Google selon les réglages de l’appareil. Ce n’est pas un envoi vers un
backend IRL RPG.

## Enfants

L’app est **classée 16+**. Elle n’est pas destinée aux enfants de moins de 16 ans.

## Contact

Pour une question vie privée liée à cette app : ouvrir une issue sur le dépôt
du projet, ou le canal de contact indiqué sur la fiche store le jour de la
publication.

## Modifications

Toute évolution substantielle de cette politique sera datée ici et reflétée dans
`www/privacy.html`.
