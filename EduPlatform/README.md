# 🎓 EduPlatform - Plateforme de Gestion de Cours
----

Application complète de gestion de cours en ligne avec authentification JWT, développée avec la stack MERN (MongoDB, Express, React, Node.js).

----

## 🎬 Fonctionnalités Principales

![Démonstration du projet](client/src/assets/Video-Project.gif)

*Aperçu : inscription, connexion, navigation, recherche/pagination, détails de cours, avis, gestion du profil.*

### ✨ Authentification & Utilisateurs
- ✅ Inscription avec email, username et mot de passe
- ✅ Connexion avec génération de token JWT
- ✅ Protection des routes nécessitant l'authentification
- ✅ Déconnexion sécurisée
- ✅ Profil utilisateur avec bio et site web

### 📚 Gestion des Cours
- ✅ Liste complète des cours disponibles
- ✅ Pagination (10 cours par page)
- ✅ Recherche de cours par titre en temps réel
- ✅ Détails complets d'un cours
- ✅ Inscription à un cours (pour utilisateurs authentifiés)
- ✅ Visualisation des étudiants inscrits

### ⭐ Système d'Avis (Reviews)
- ✅ Ajout d'avis sur un cours (1-5 étoiles + commentaire)
- ✅ Visualisation des avis d'un cours
- ✅ Page "Mes Avis" avec tous les avis de l'utilisateur
- ✅ Suppression des avis

### 👤 Gestion du Profil
- ✅ Affichage du profil utilisateur
- ✅ Édition du profil (bio et site web)
- ✅ Liste des cours auxquels l'utilisateur est inscrit

### 🎨 Interface & Expérience Utilisateur
- ✅ Design moderne avec thème violet
- ✅ Dégradés de couleurs pour les boutons
- ✅ Alertes SweetAlert2 pour les notifications
- ✅ Navigation responsive avec Navbar
- ✅ Page 404 pour les routes inexistantes
- ✅ Loader pendant le chargement des données

-----

## 🛠 Technologies Utilisées

### Backend
- **Node.js** - Environnement d'exécution JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** (jsonwebtoken) - Authentification par token
- **bcryptjs** - Hashage des mots de passe
- **CORS** - Gestion des requêtes cross-origin
- **dotenv** - Gestion des variables d'environnement
- **express-async-handler** - Gestion des erreurs async

### Frontend
- **React 18** - Bibliothèque UI
- **Vite** - Build tool ultra-rapide
- **React Router** - Gestion du routing
- **Axios** - Client HTTP
- **SweetAlert2** - Alertes modernes
- **CSS moderne** - Dégradés et animations

### Outils de Développement
- 📮 **Postman / Thunder Client** - Tests des APIs REST
- 🔧 **Nodemon** - Rechargement automatique du serveur
- 📦 **npm** - Gestionnaire de paquets Node.js
- 🐙 **Git** - Contrôle de version

----

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 14 ou supérieure)
- **npm** ou **yarn**
- **MongoDB** (local ou MongoDB Atlas)

-----

## 🚀 Installation Rapide

### 1. Cloner le repository

```bash
git clone <repository-url>
cd EduPlatform
```

### 2. Installation des dépendances Backend

```bash
cd backend
npm install
```

### 3. Installation des dépendances Frontend

```bash
cd ../client
npm install
```

-----
## ⚙️ Configuration

### Backend (.env)

Créez un fichier `.env` dans le dossier `backend` :

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/eduplatform
JWT_SECRET=votre_secret_jwt_super_securise_ici
```

**Variables d'environnement:**
- `PORT` : Port du serveur backend (par défaut 3000)
- `MONGO_URI` : URI de connexion MongoDB
- `JWT_SECRET` : Clé secrète pour signer les tokens JWT

### Frontend

Le frontend est configuré pour communiquer avec le backend sur `http://localhost:3000/api`.

Configuration dans `client/src/api/axios.js` :

```javascript
const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});
```
-----

## 🎯 Démarrage

### 1. Démarrer MongoDB

Assurez-vous que MongoDB est en cours d'exécution :

```bash
# Si MongoDB est installé localement
mongodb
```

Ou utilisez [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud gratuit).

### 2. Démarrer le Backend

```bash
cd backend
npm start
```

Le serveur démarre sur `http://localhost:3000`

### 3. Démarrer le Frontend

Dans un nouveau terminal :

```bash
cd client
npm run dev
```

Le frontend démarre sur `http://localhost:5173`

### 4. Accéder à l'application

Ouvrez votre navigateur et accédez à :
```
http://localhost:5173
```

----
## 📁 Structure du Projet

```
EduPlatform/
├── backend/
│   ├── config/
│   │   └── db.js                    # Configuration MongoDB
│   ├── controllers/
│   │   ├── authController.js        # Auth (login, register)
│   │   ├── courseController.js      # Gestion des cours
│   │   ├── profileController.js     # Gestion des profils
│   │   ├── reviewController.js      # Gestion des avis
│   │   └── userController.js        # Gestion des utilisateurs
│   ├── middleware/
│   │   ├── authMiddleware.js        # Middleware JWT (protect)
│   │   └── errorMiddleware.js       # Gestion des erreurs
│   ├── models/
│   │   ├── User.js                  # Modèle Utilisateur
│   │   ├── Course.js                # Modèle Cours
│   │   ├── Profile.js               # Modèle Profil
│   │   └── Review.js                # Modèle Avis
│   ├── routes/
│   │   ├── authRoutes.js            # Routes authentification
│   │   ├── courseRoutes.js          # Routes cours
│   │   └── userRoutes.js            # Routes utilisateurs
│   ├── images/                      # Images/uploads
│   ├── .env                         # Variables d'environnement
│   ├── server.js                    # Point d'entrée backend
│   └── package.json
│
└── client/
    ├── src/
    │   ├── api/
    │   │   └── axios.js             # Configuration Axios
    │   ├── components/
    │   │   ├── Navbar.jsx           # Barre de navigation
    │   │   └── ProtectedRoute.jsx   # Route protégée
    │   ├── context/
    │   │   └── AuthContext.jsx      # Contexte authentification
    │   ├── pages/
    │   │   ├── Home.jsx             # Accueil
    │   │   ├── Login.jsx            # Connexion
    │   │   ├── Register.jsx         # Inscription
    │   │   ├── Courses.jsx          # Liste des cours
    │   │   ├── CourseDetails.jsx    # Détails cours + avis
    │   │   ├── Profile.jsx          # Profil utilisateur
    │   │   ├── ProfileEdit.jsx      # Édition profil
    │   │   ├── MyReviews.jsx        # Mes avis
    │   │   └── NotFound.jsx         # Page 404
    │   ├── App.jsx                  # Composant principal
    │   ├── App.css                  # Styles (violet theme)
    │   ├── index.css                # Styles globaux
    │   └── main.jsx                 # Point d'entrée
    ├── index.html
    ├── vite.config.js
    └── package.json
```

-----

## 🔌 API Routes

### 🔐 Authentification
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/auth/register` | Inscription utilisateur |
| POST | `/auth/login` | Connexion utilisateur |

### 👥 Utilisateurs
| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/users` | Liste des utilisateurs | ✅ |
| GET | `/users/:id` | Détails utilisateur | ✅ |
| GET | `/users/:userId/courses` | Cours de l'utilisateur | ✅ |
| GET | `/users/:userId/reviews` | Avis de l'utilisateur | ✅ |

### 👤 Profils
| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | `/users/:userId/profile` | Créer profil | ✅ |
| GET | `/users/:userId/profile` | Obtenir profil | ✅ |
| PUT | `/users/:userId/profile` | Modifier profil | ✅ |

### 📚 Cours
| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/courses` | Liste tous les cours | ❌ |
| GET | `/courses/:courseId` | Détails d'un cours | ❌ |
| POST | `/courses` | Créer un cours | ✅ |
| POST | `/courses/:courseId/enroll` | S'inscrire au cours | ✅ |
| GET | `/courses/:courseId/students` | Étudiants du cours | ❌ |

### ⭐ Avis
| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| GET | `/courses/:courseId/reviews` | Avis d'un cours | ❌ |
| POST | `/courses/:courseId/reviews` | Ajouter un avis | ✅ |

## 📄 Pages Frontend

### Pages Publiques
- **/** - Accueil
- **/login** - Connexion
- **/register** - Inscription
- **/courses** - Liste des cours (recherche + pagination)
- **/courses/:id** - Détails d'un cours

### Pages Protégées (authentification requise)
- **/profile** - Profil utilisateur
- **/profile/edit** - Édition du profil
- **/my-reviews** - Mes avis

### Gestion d'erreur
- **\*** - Page 404 Not Found

![img](client/src/assets/not_found.png)


---------

## 🎨 Thème & Couleurs

L'application utilise un thème violet moderne avec :
- **Couleur primaire** : `#9b59b6` (Violet)
- **Couleur primaire hover** : `#8e44ad` (Violet foncé)
- **Couleur succès** : `#27ae60` (Vert)
- **Couleur danger** : `#e74c3c` (Rouge)

Tous les boutons et éléments interactifs utilisent des **dégradés de couleurs** pour une apparence premium.

-----

## 🔐 Authentification & Sécurité

### Flux d'authentification
1. L'utilisateur s'inscrit ou se connecte
2. Un token JWT est généré et stocké dans le localStorage
3. Le token est envoyé dans le header `Authorization: Bearer <token>`
4. Le middleware `protect` vérifie le token avant d'accéder aux routes protégées
5. L'ID utilisateur est extrait du token et utilisé pour les opérations

### Mesures de sécurité
- ✅ Mots de passe hashés avec **bcryptjs**
- ✅ Routes sensibles protégées par **JWT middleware**
- ✅ Tokens JWT stockés dans localStorage côté client
- ✅ CORS configuré pour accept uniquement le frontend
- ✅ Validation des données côté serveur

-------

## 📦 Modèles de Données

### Utilisateur
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashé),
  courses: [ObjectId (ref: Course)],
  createdAt: Date
}
```

### Cours
```javascript
{
  title: String,
  description: String,
  instructor: String,
  students: [ObjectId (ref: User)],
  createdAt: Date
}
```

### Profil
```javascript
{
  bio: String,
  website: String,
  user: ObjectId (ref: User),
  createdAt: Date
}
```

### Avis
```javascript
{
  rating: Number (1-5),
  comment: String,
  course: ObjectId (ref: Course),
  user: ObjectId (ref: User),
  createdAt: Date
}
```
----

## 🐛 Dépannage

### Le backend ne démarre pas
```bash
✓ Vérifiez que MongoDB est en cours d'exécution
✓ Vérifiez le fichier .env est bien configuré
✓ Vérifiez que le port 3000 n'est pas utilisé
✓ Installez les dépendances : npm install
```

### Le frontend ne se connecte pas au backend
```bash
✓ Vérifiez que le backend démarre sur le port 3000
✓ Vérifiez la configuration CORS dans server.js
✓ Vérifiez l'URL de base dans axios.js
✓ Ouvrez la console navigateur pour voir les erreurs
```

### Erreur "Vous devez être inscrit au cours pour laisser un avis"
```bash
✓ Assurez-vous d'être inscrit au cours avant d'ajouter un avis
✓ Actualisez la page pour voir l'état d'inscription mis à jour
```

### Les reviews ne s'affichent pas
```bash
✓ Vérifiez que vous êtes authentifié
✓ Vérifiez que le token JWT est valide
✓ Vérifiez les erreurs dans la console navigateur
```

-------

## 💡 Conseils de Développement

### Ajouter des cours via API

```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React Avancé",
    "description": "Maîtrisez React avec les hooks avancés",
    "instructor": "Jane Doe"
  }'
```

### Afficher les logs du serveur
```bash
# Dans le terminal backend, vous verrez les logs de chaque requête
# grâce à morgan
```

### Déboguer l'authentification
```javascript
// Vérifiez le token dans la console navigateur
console.log(localStorage.getItem('token'));
```

------

## 📚 Exemples de Cours à Créer

1. **Node.js 101** - Introduction à Node.js et Express
2. **Performance React** - Optimisation des performances React
3. **MongoDB Avancé** - Requêtes complexes et agrégations
4. **Docker Essentials** - Containerisation d'applications
5. **GraphQL Basics** - Alternative à REST API

------

## 👨‍💻 Auteur

*Samah SAIDI*
Développé pour le cours MERN - Plateforme EduPlatform

----

## 📝 Licence

Ce projet est à des fins éducatives.

---
