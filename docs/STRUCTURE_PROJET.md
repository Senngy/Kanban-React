# 📋 Structure Complète du Projet Kanban

## 📂 Architecture Générale

```
Kanban/
├── api/                          # Backend - API Express.js
├── client/                        # Frontend - React + Vite
├── README.md                      # Documentation principale
└── .git/                          # Repository Git
```

---

## 🔧 API Backend (`/api`)

Structure complète du backend Node.js/Express :

```
api/
├── app.js                         # Point d'entrée de l'application
├── package.json                   # Dépendances et scripts npm
├── package-lock.json              # Lock file des dépendances
├── .env                           # Variables d'environnement (local)
├── .env.example                   # Exemple de configuration
├── .gitignore                     # Fichiers ignorés par Git
│
├── 📁 controllers/                # Contrôleurs métier
│   ├── auth.controller.js         # Authentification (login, register)
│   ├── card.controller.js         # Gestion des cartes
│   ├── list.controller.js         # Gestion des listes
│   ├── tag.controller.js          # Gestion des tags
│   └── with-poo/                  # Contrôleurs en POO
│       ├── base.controller.js     # Classe de base
│       ├── card.controller.js     # Cartes (POO)
│       └── tag.controller.js      # Tags (POO)
│
├── 📁 middlewares/                # Middlewares Express
│   ├── auth.middleware.js         # Authentification/autorisation
│   ├── card.middleware.js         # Validation des cartes
│   ├── common.middleware.js       # Middlewares communs
│   ├── list.middleware.js         # Validation des listes
│   └── tag.middleware.js          # Validation des tags
│
├── 📁 models/                     # Modèles Sequelize
│   ├── index.js                   # Initialisation des modèles
│   ├── sequelize.client.js        # Configuration Sequelize
│   ├── user.model.js              # Modèle utilisateur
│   ├── card.model.js              # Modèle carte
│   ├── list.model.js              # Modèle liste
│   ├── tag.model.js               # Modèle tag
│   └── role.model.js              # Modèle rôle
│
├── 📁 routes/                     # Routes API
│   ├── auth.routes.js             # Routes authentification
│   ├── card.routes.js             # Routes cartes
│   ├── list.routes.js             # Routes listes
│   ├── tag.routes.js              # Routes tags
│   └── demo.routes.js             # Routes de démonstration
│
├── 📁 utils/                      # Utilitaires
│   ├── common.util.js             # Fonctions utilitaires communes
│   └── scrypt.js                  # Hashage de mots de passe
│
├── 📁 migrations/                 # Migrations de base de données
│   ├── 01.createTables.js         # Création des tables
│   ├── 02.seedTables.js           # Données initiales (seed)
│   └── seedingV2.js               # Seed version 2
│
└── 📁 node_modules/               # Dépendances installées
```

### 📊 Détail des Dépendances Principales (Backend)

**Frameworks & Server:**
- `express` - Framework web
- `sequelize` - ORM pour PostgreSQL

**Base de données:**
- `pg` - Client PostgreSQL
- `pg-hstore` - Sérialisation pour Sequelize

**Authentification & Sécurité:**
- `jsonwebtoken` (JWT) - Tokens d'authentification
- `scrypt` ou `bcrypt` - Hashage des mots de passe
- `joi` - Validation des données

**Utilitaires:**
- `dotenv` - Gestion des variables d'environnement
- `cors` - Gestion des requêtes cross-origin

---

## ⚛️ Client Frontend (`/client`)

Structure complète du client React/Vite :

```
client/
├── index.html                     # Point d'entrée HTML
├── package.json                   # Dépendances et scripts npm
├── package-lock.json              # Lock file des dépendances
├── vite.config.js                 # Configuration Vite
├── eslint.config.js               # Configuration ESLint
├── .env                           # Variables d'environnement (local)
├── .env.exemple                   # Exemple de configuration
├── .gitignore                     # Fichiers ignorés par Git
├── README.md                      # Documentation locale
│
├── 📁 public/                     # Fichiers statiques publics
│
├── 📁 src/                        # Code source React
│   ├── main.jsx                   # Point d'entrée React
│   ├── App.jsx                    # Composant principal
│   ├── App.css                    # Styles App
│   ├── index.css                  # Styles globaux
│   │
│   ├── 📁 assets/                 # Ressources (images, icônes)
│   │
│   ├── 📁 components/             # Composants React
│   │   ├── Card.jsx               # Composant Carte
│   │   ├── List.jsx               # Composant Liste
│   │   ├── LoginForm.jsx          # Formulaire de connexion
│   │   ├── Navbar.jsx             # Barre de navigation
│   │   │
│   │   └── 📁 modals/             # Composants Modaux
│   │       ├── Modal.jsx          # Modal générique
│   │       ├── ModalConfirm.jsx   # Modal de confirmation
│   │       └── ModalForm.jsx      # Modal avec formulaire
│   │
│   └── 📁 lib/                    # Logique métier & utilitaires
│       │
│       ├── 📁 context/            # React Context (état global)
│       │   └── AuthContext.js     # Contexte authentification
│       │
│       ├── 📁 hooks/              # Custom Hooks React
│       │   ├── useAuth.js         # Hook pour authentification
│       │   └── useForm.js         # Hook pour gestion formulaires
│       │
│       ├── 📁 services/           # Services (appels API)
│       │   ├── api.js             # Client API générique
│       │   ├── auth.service.js    # Service authentification
│       │   ├── card.service.js    # Service cartes
│       │   └── list.service.js    # Service listes
│       │
│       └── 📁 utils/              # Fonctions utilitaires
│           └── (vide)
│
└── 📁 node_modules/               # Dépendances installées
```

### 📊 Détail des Dépendances Principales (Frontend)

**Framework UI:**
- `react` - Bibliothèque UI
- `react-dom` - Rendu React dans le DOM

**Build Tool:**
- `vite` - Outil de build moderne et rapide

**Styling:**
- `tailwindcss` - Framework CSS utilitaire
- `daisyui` - Composants Tailwind CSS

**Drag & Drop:**
- `@dnd-kit/core` - Système de drag-and-drop

**Rendu Markdown:**
- `react-markdown` - Rendu de contenu Markdown

**Autres:**
- `eslint` - Linter JavaScript

---

## 🔄 Flux de l'Application

### 1️⃣ **Authentification**
```
LoginForm.jsx 
  → useForm.js (gestion du formulaire)
  → auth.service.js (appel API)
  → /api/auth.routes.js
  → auth.controller.js
  → user.model.js
  → AuthContext.js (stockage du token/user)
```

### 2️⃣ **Gestion des Listes et Cartes**
```
List.jsx / Card.jsx
  → list.service.js / card.service.js
  → api.js (client HTTP)
  → /api/list.routes.js / /api/card.routes.js
  → list.controller.js / card.controller.js
  → list.model.js / card.model.js
```

### 3️⃣ **Gestion des Tags**
```
ModalForm.jsx
  → tag.service.js (à créer)
  → /api/tag.routes.js
  → tag.controller.js
  → tag.model.js
```

---

## 📝 Fichiers de Configuration

### Backend

**`api/app.js`**
- Initialisation Express
- Configuration des middlewares
- Montage des routes
- Gestion des erreurs

**`api/models/sequelize.client.js`**
- Connexion à la base PostgreSQL
- Configuration Sequelize

**`api/.env`**
- `DB_HOST` - Host PostgreSQL
- `DB_PORT` - Port PostgreSQL
- `DB_NAME` - Nom de la base
- `DB_USER` - Utilisateur DB
- `DB_PASSWORD` - Mot de passe DB
- `JWT_SECRET` - Secret pour les tokens JWT
- `API_PORT` - Port du serveur
- `API_URL` - URL de l'API

### Frontend

**`client/vite.config.js`**
- Configuration du bundler
- Alias des chemins
- Variables d'environnement

**`client/.env`**
- `VITE_API_URL` - URL de l'API backend

**`client/eslint.config.js`**
- Règles de linting

---

## 🎯 Points Clés de l'Architecture

### Backend
- ✅ **MVC Pattern** : Séparation Modèles/Contrôleurs/Routes
- ✅ **ORM Sequelize** : Abstraction de la base de données
- ✅ **JWT Auth** : Authentification par tokens
- ✅ **Middlewares** : Validation et authentification
- ✅ **Migrations** : Versioning de la base de données

### Frontend
- ✅ **React Hooks** : Gestion d'état avec hooks personnalisés
- ✅ **Context API** : État global (authentification)
- ✅ **Services** : Abstraction des appels API
- ✅ **Composants Réutilisables** : Modaux, formulaires
- ✅ **Vite** : Build ultra-rapide

---

## 🚀 Technologies Stack Complet

| Aspect | Technologies |
|--------|-------------|
| **Backend** | Node.js, Express, Sequelize, PostgreSQL |
| **Frontend** | React, Vite, Tailwind CSS, DaisyUI |
| **Authentification** | JWT, Scrypt/Bcrypt |
| **Validation** | Joi (backend), React (frontend) |
| **Drag & Drop** | @dnd-kit/core |
| **Rendu** | React-Markdown |

---

## 📋 Résumé des Responsabilités

### `/api` - Backend
- Gestion de la base de données PostgreSQL
- API REST pour CRUD (Create, Read, Update, Delete)
- Authentification et autorisation
- Validation des données
- Migrations de schéma

### `/client` - Frontend
- Interface utilisateur avec React
- Gestion de l'état local (formulaires, modaux)
- Gestion de l'état global (authentification)
- Appels API au backend
- Affichage des données

---

**Dernière mise à jour:** 9 janvier 2026
