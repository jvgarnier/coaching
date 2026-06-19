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

### Configuration Netlify (une seule fois)

1. Déployer ce repo (`jvgarnier/coaching`) sur Netlify.
2. Onglet **Identity** → *Enable Identity*.
3. **Identity → Services → Git Gateway** → *Enable Git Gateway*.
4. **Identity → Registration** → passer en *Invite only*.
5. **Identity → Invite users** → s'inviter par email, puis accepter l'invitation reçue
   (le lien renvoie vers le site et ouvre l'admin pour définir le mot de passe).

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
