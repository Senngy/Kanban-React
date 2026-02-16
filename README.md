# Kanban [🛠️ EN TRAVAUX 🚧]

Application de gestion de tâches inspirée des tableaux Kanban classiques.  
Projet full-stack avec API backend Node.js/Express et frontend React.

## 📝 Description du projet

### API Backend

L'API backend est construite avec **Node.js**, **Express** et **Sequelize** pour gérer les données dans une base de données PostgreSQL. Elle expose des endpoints pour gérer les listes, les cartes et les tags.

### Client Frontend

Le client est développé avec **React** et utilise **Vite** comme outil de build. Il offre une interface utilisateur intuitive pour interagir avec les données fournies par l'API.

---

## 🚀 Objectifs

- Apprendre et mettre en place des **bonnes pratiques DevOps / sécurité**
- Authentification JWT sécurisée via cookies httpOnly
- Mettre en place un système de rôles (admin, utilisateur).
- UI responsive et UX améliorée (drag-and-drop)
- Préparer un projet portfolio complet, testable et maintenable

---

## 🛠️ Technologies utilisées

### Backend

- Node.js + Express
- PostgreSQL via Sequelize ORM
- Joi (validation)
- dotenv (variables d'environnement)
- Auth JWT (à migrer vers httpOnly cookies)

### Frontend

- React + Vite
- Tailwind CSS + DaisyUI
- @dnd-kit/core (drag-and-drop)
- react-markdown

### DevOps

- Git + GitHub Actions
- Docker + docker-compose (en cours)

---

## 📂 Structure du projet

- **`api/`** : backend.
- **`client/`** : frontend.

---

## ⚙️ Installation et lancement

### Prérequis

- **Node.js** (version 16 ou supérieure)
- **PostgreSQL** (base de données)

### Étapes

1. **Cloner le dépôt**

2. **Configurer les variables d'environnement**

- Backend : Copier le fichier `.env.example` dans `api/.env` et configurer les valeurs (notamment PG_URL pour la base de données PostgreSQL).

- Frontend : Copier le fichier `.env.example` dans `client/.env` et configurer l'URL de l'API (`VITE_API_URL`).

3. **Installer les dépendances et lancer les projets**

- Backend

```sh
cd api
npm install
npm run db:create
npm run db:seed
npm run dev
```

- Frontend

```sh
cd client
npm install
npm run dev
```

## Authentification

- JWT (à migrer vers cookies httpOnly + refresh token)

- Middleware pour sécuriser les endpoints

- Gestion rôles admin / utilisateur

## Améliorations en cours

- Drag-and-drop complet des cartes

- CI/CD automatisé avec tests

- Dockerisation backend + frontend

- Logging structuré

- Documentation Swagger pour API
