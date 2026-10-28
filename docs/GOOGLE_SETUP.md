# Brancher le site sur Google Sheets et ouvrir l'espace admin

Ce guide est fait pour quelqu'un qui ne développe pas. Comptez 20 à 30 minutes.
Connectez-vous avec le compte propriétaire **empireadrianlopes@gmail.com**.
À aucun moment vous n'avez à donner un mot de passe au site.

## 1. Créer la Google Sheet

1. Ouvrez [Google Drive](https://drive.google.com), créez (ou choisissez) un dossier, puis **Nouveau → Google Sheets**.
2. Nommez la feuille **RSVP Elvira & Jacob**.
3. Copiez son identifiant : dans l'adresse `https://docs.google.com/spreadsheets/d/XXXXXXXX/edit`, c'est la partie `XXXXXXXX`.
   → ce sera `GOOGLE_SHEET_ID`.

Le site crée lui-même les onglets **Réponses** et **Invités** et leurs en-têtes au premier RSVP.

## 2. Créer un projet Google Cloud et activer l'API Sheets

1. Ouvrez [console.cloud.google.com](https://console.cloud.google.com) → en haut, **Sélectionner un projet → Nouveau projet** → nom : `mariage-elvira-jacob` → **Créer**.
2. Menu ☰ → **API et services → Bibliothèque** → cherchez **Google Sheets API** → **Activer**.

## 3. Créer le compte de service (le « robot » qui écrit dans la Sheet)

1. Menu ☰ → **API et services → Identifiants** → **Créer des identifiants → Compte de service**.
2. Nom : `rsvp-site` → **Créer et continuer** → pas de rôle → **OK**.
3. Cliquez sur le compte créé → onglet **Clés** → **Ajouter une clé → Créer une clé → JSON**. Un fichier se télécharge.
4. Dans ce fichier :
   - `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → `GOOGLE_PRIVATE_KEY` (copiez tout, guillemets exclus, y compris `-----BEGIN…` et les `\n`).
5. Gardez ce fichier en lieu sûr et ne l'envoyez à personne. Ne le mettez jamais dans Git.

## 4. Partager la Sheet avec le compte de service

Dans la Sheet : **Partager** → collez l'adresse `client_email` → rôle **Éditeur** → décochez « Envoyer une notification » → **Partager**.

## 5. Créer les identifiants de connexion admin (OAuth)

1. Menu ☰ → **API et services → Écran de consentement OAuth** : type **Externe**, nom de l'application `Mariage Elvira & Jacob`, votre email en assistance et en contact → enregistrez. Dans **Utilisateurs test**, ajoutez `empireadrianlopes@gmail.com`.
2. **Identifiants → Créer des identifiants → ID client OAuth** → type **Application Web**.
3. **URI de redirection autorisés** : ajoutez
   - `https://VOTRE-DOMAINE/api/auth/callback/google` (l'adresse définitive du site)
   - `http://localhost:3000/api/auth/callback/google` (pour les essais en local)
4. **Créer** → copiez **ID client** → `AUTH_GOOGLE_ID` et **Code secret** → `AUTH_GOOGLE_SECRET`.

## 6. Renseigner les variables sur Vercel

Vercel → votre projet → **Settings → Environment Variables**, ajoutez (environnement *Production*, et *Preview* si besoin) :

| Variable | Valeur |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | adresse du site, ex. `https://elvira-jacob.vercel.app` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | étape 3 |
| `GOOGLE_PRIVATE_KEY` | étape 3 |
| `GOOGLE_SHEET_ID` | étape 1 |
| `AUTH_SECRET` | une longue chaîne aléatoire (`openssl rand -base64 32`) |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | étape 5 |
| `ADMIN_EMAILS` | `empireadrianlopes@gmail.com` (plusieurs adresses : séparées par des virgules) |

Puis **Deployments → ⋯ → Redeploy** pour que les variables soient prises en compte.

## 7. Vérifier

1. Envoyez un RSVP de test depuis le site : une ligne apparaît dans l'onglet **Réponses**.
2. Ouvrez `https://VOTRE-DOMAINE/admin/rsvp` → **Se connecter avec Google** avec le compte autorisé : la réponse s'affiche.
3. Avec un autre compte Google, l'accès doit être refusé.
4. Supprimez la ligne de test dans la Sheet.

## Liste des invités (facultatif mais utile)

Pour que « Total invités » et « En attente » fonctionnent, remplissez l'onglet **Invités** :
colonnes **Prénom**, **Nom**, **Téléphone**. Le rapprochement se fait sur le téléphone
(`07 59 41 44 73`, `+225 0759414473` et `0759414473` sont reconnus comme le même numéro).
Si un invité répond plusieurs fois, c'est sa réponse la plus récente qui compte.
