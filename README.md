# Elvira & Jacob — site de mariage

La version digitale de la carte d'invitation d'**Elvira DAGROU & Jacob BADIBA**
(mariage civil le 5 novembre 2026, mariage religieux le 7 novembre 2026, Abidjan).

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS 4 · Framer Motion · zod · Auth.js · Google Sheets API.

## Lancer en local

```bash
npm install
cp .env.example .env.local   # facultatif : sans Google, les RSVP vont dans .data/
npm run dev                  # http://localhost:3000
npm run build && npm run lint
```

## Modifier le contenu

Tout le contenu est dans **`data/wedding.ts`** : prénoms, ordre d'affichage, textes officiels,
versets, événements, repas, contacts, dress code, date limite et maximum du RSVP, photos, musique, SEO.
Les champs à confirmer sont marqués `// TODO:` (`grep -rn "TODO" data lib app`).

- **Photos** : déposer les fichiers dans `public/images/`, puis les importer en haut de `data/wedding.ts`
  (l'import statique donne automatiquement dimensions et flou de chargement). Galerie vide = section masquée.
- **Polices officielles** (Burgues Script, TT Ramillas, commerciales) : déposer les `.woff2` sous licence
  dans `public/fonts/` et suivre le commentaire de **`lib/fonts.ts`** (seul fichier à modifier).
  En attendant : Pinyon Script et Cormorant Garamond (libres, OFL).
- **Musique** : mettre un fichier dans `public/audio/`, puis `music.enabled = true` et `music.src`.
  Elle démarre au clic sur « Ouvrir l'invitation », jamais en autoplay, avec un bouton de coupure.
- **Carte** : `public/invitation/carte-invitation.pdf` (version compressée, < 1 Mo) et `page-1.jpg` / `page-2.jpg`.

## RSVP et administration

- `POST /api/rsvp` : validation zod (même schéma côté client et serveur), honeypot, limite de 8 envois / 10 min par IP,
  fermeture automatique après la date limite.
- Stockage derrière l'interface `RsvpRepository` (`lib/rsvp/repository.ts`) :
  **Google Sheets** si `GOOGLE_*` est renseigné, sinon fichiers JSON dans `.data/` (ignoré par Git).
- **En production, Google Sheets est obligatoire** : sur Vercel, le disque n'est pas persistant.
- `/admin/rsvp` : connexion Google (Auth.js), liste blanche `ADMIN_EMAILS`, protégé par `proxy.ts`
  et vérifié à nouveau dans la page et l'API. `noindex`, aucun lien depuis le site.
- Statuts : *Confirmé* (oui), *Absent* (non), *En attente* (dans l'onglet `Invités` sans réponse).
  En local, une liste d'invités peut être mise dans `.data/invites.json` (`[{ "firstName", "lastName", "phone" }]`).

Guide pas à pas : **[docs/GOOGLE_SETUP.md](docs/GOOGLE_SETUP.md)**.

## Déployer sur Vercel

1. Importer le dépôt sur [vercel.com/new](https://vercel.com/new) (framework détecté : Next.js).
2. Renseigner les variables de `.env.example` (voir le guide Google).
3. Déployer, puis ajouter l'URL de callback OAuth `https://<domaine>/api/auth/callback/google`.

## Choix faits (à valider)

- **QR codes de la carte** : les deux QR codes imprimés (« Scannez-moi » et celui de l'église) pointent tous deux
  vers `https://maps.app.goo.gl/175yEJs6nrCfNewM7` (Google Maps de l'église). La carte ne mène donc pas au site :
  l'adresse du site est libre, et le lien doit être partagé autrement (WhatsApp…).
- **Ordre des prénoms** : « Elvira & Jacob », comme sur la carte (`nameOrder` dans `wedding.ts`).
- **Date limite RSVP** : aucune (formulaire toujours ouvert, `rsvp.deadline = null`) ; **maximum** : 2 personnes par réponse.
- **Mairie d'Adjamé** : lien Maps de recherche générique, à remplacer par le lien exact.
- **Or → beige** : tous les ornements dorés de la carte deviennent des filets beige (`#E8DDCB`) ;
  un beige plus soutenu (`beige-ornament`) sert aux ornements posés sur l'ivoire, pour rester visibles.
- **Compte à rebours** : vise le prochain événement (civil, puis religieux), message « C'est aujourd'hui »
  pendant l'événement, remerciement ensuite.
- **Hero** : photo plein écran sur mobile ; sur grand écran, composition en deux temps (texte sur navy, photo à droite)
  car les photos fournies sont toutes en portrait.
