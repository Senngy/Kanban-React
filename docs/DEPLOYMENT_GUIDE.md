# Guide de Déploiement Continu (CD)

Pour passer d'un projet local à un projet "Pro", il est crucial d'automatiser le déploiement. Voici comment configurer une pipeline CD simple et efficace.

## 1. Choix de la plateforme
Services recommandés pour un projet Node/React/Postgres :
- **Render.com** (Très simple, gratuit/pas cher, gère le déploiement auto sur push GitHub)
- **Railway.app** (Excellent pour les bases de données Postgres)

## 2. Configuration Render (Déploiement Automatique)

### Backend (API)
Créez un "Web Service" sur Render lié à votre repo GitHub :
- **Build Command**: `cd api && npm install`
- **Start Command**: `cd api && node app.js`
- **Environnement**: Ajoutez vos variables du `.env` (PG_URL, JWT_SECRET, etc.)
- **Auto-Deploy**: Activé. Dès que vous pushez sur `main`, Render reconstruit et déploie.

### Frontend (React)
Créez un "Static Site" sur Render lié à votre repo :
- **Build Command**: `cd client && npm install && npm run build`
- **Publish Directory**: `client/dist`
- **Environnement**: `VITE_API_URL` pointant vers votre API Render.

## 3. Stratégie de Branches (Workflow Intermédiaire)
- **main/master**: Branche de production. Tout push ici déclenche un déploiement sur l'URL de production.
- **develop**: (Optionnel) Pour un environnement de "Staging". Push ici déploie sur une URL de test pour vérifier que tout marche avant de fusionner vers `main`.

## 4. Exemple de fichier Render Blueprint (render.yaml)
Vous pouvez ajouter ce fichier à la racine pour automatiser toute la stack :

```yaml
services:
  - type: web
    name: kanban-api
    env: node
    buildCommand: cd api && npm install
    startCommand: cd api && node app.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PG_URL
        fromDatabase:
          name: kanban-db
          property: connectionString

  - type: web
    name: kanban-client
    env: static
    buildCommand: cd client && npm install && npm run build
    staticPublishPath: client/dist
    envVars:
      - key: VITE_API_BASE_URL
        fromService:
          name: kanban-api
          type: web
          property: host

databases:
  - name: kanban-db
    plan: free
```
