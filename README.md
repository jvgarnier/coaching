# Coaching — Jean-Victor Garnier

Site vitrine statique pour le mentorat & partage d'expérience de Jean-Victor Garnier.

## Structure

- `index.html` — page unique du site vitrine (structure + conteneurs)
- `content/site.json` — **tout le contenu éditable** (textes + images) : source unique de vérité
- `js/render.js` — injecte le contenu de `content/site.json` dans la page
- `js/main.js` — interactions (menu, animations, formulaire)
- `css/styles.css` — design system et styles
- `assets/` — images, favicon, placeholders (`assets/uploads/` : images ajoutées via l'admin)
- `admin/` — interface d'administration (Decap CMS)

## Développement local

Servir le dossier avec un serveur statique, par exemple :

```bash
python3 -m http.server 8000
```

Puis ouvrir http://localhost:8000

## Administration du contenu (Decap CMS)

L'admin permet de modifier tous les textes et images depuis le navigateur, à l'adresse
`https://<votre-site>.netlify.app/admin/`. Chaque modification est commitée sur GitHub et
redéploie automatiquement le site.

### Configuration (une seule fois)

Le site est hébergé sur Netlify (statique) et l'authentification de l'admin passe par
**DecapBridge** (Netlify Identity étant déprécié). DecapBridge garde un login simple
par email/mot de passe, sans compte GitHub requis pour les éditeurs.

1. Déployer ce repo (`jvgarnier/coaching`) sur Netlify (déploiement statique, sans build).
2. Créer un compte sur https://decapbridge.com puis **Add site** :
   - Provider : **GitHub**, dépôt : `jvgarnier/coaching`, branche `main`
   - URL de login Decap : `https://<votre-site>.netlify.app/admin/`
   - Fournir un **access token** GitHub avec accès au dépôt (DecapBridge l'explique pas à pas)
3. DecapBridge génère un bloc `backend:` avec un **identifiant de site**. Reporter cet
   identifiant dans [`admin/config.yml`](admin/config.yml) en remplaçant `SITE_ID` dans
   `identity_url: https://auth.decapbridge.com/sites/SITE_ID` (ou coller le bloc fourni
   tel quel à la place du bloc `backend:` existant).
4. Dans DecapBridge, onglet **collaborators** → inviter Jean-Victor par email.
5. Commiter/pousser la modif de `config.yml`, puis aller sur `https://<votre-site>.netlify.app/admin/`.

### Tester l'admin en local (optionnel)

`admin/config.yml` contient `local_backend: true`. Pour éditer sans Netlify :

```bash
npx decap-server      # dans un terminal
python3 -m http.server 8000   # dans un autre
```

Puis ouvrir http://localhost:8000/admin/ (les modifications sont écrites directement
dans les fichiers locaux, pas de commit).

## Déploiement

Site déployé sur Netlify (déploiement statique, pas de build). Formulaire de contact via
Netlify Forms.
