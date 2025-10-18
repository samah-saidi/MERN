# 🌱 MERN – Semaine 3 : Intégration de MongoDB & Mongoose

## 🧠 Objectifs Pédagogiques
À la fin de cette séance, vous serez capables de :

- 💾 Expliquer les principes du **NoSQL** et de **MongoDB** (documents, collections)

- ⚙️ Maîtriser la **programmation asynchrone** avec `async/await`

- ☁️ Configurer un **cluster MongoDB Atlas** (ou bien **MongoDB local**) et le connecter à Node.js

- 🧱 Définir et utiliser un **modèle Mongoose**

- 🔁 Implémenter des opérations CRUD avec gestion d’erreurs

- 🚀 Tester votre API avec Postman

## Configuration de l'Environnement

J'ai organisé le projet selon l'architecture MVC (Model-View-Controller) :

```bash
mon-api-blog-3/
├── config/
│   └── db.js                 # Configuration MongoDB
├── controllers/
│   ├── articleController.js  # Logique métier des articles
│   └── userController.js     # Logique métier des utilisateurs
├── models/
│   ├── Article.js            # Schéma et modèle Article
│   └── User.js               # Schéma et modèle User
├── images/                   # Les captures d'écran des résultats
├── routes/
│   ├── articleRoutes.js      # Routes des articles
│   └── userRoutes.js         # Routes des utilisateurs
├── .env                      # Variables d'environnement
├── .gitignore                # Fichiers à ignorer
├── package.json              # Dépendances du projet
├── README.md                 # Dépendances du projet
└── server.js                 # Point d'entrée de l'application
```

## Architecture MVC de l'Application
```bsh
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Postman)                         │
│                    Envoie des requêtes HTTP                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                          SERVER.JS                               │
│                    (Point d'entrée)                              │
│  • Charge les variables d'environnement (.env)                   │
│  • Établit la connexion à MongoDB                                │
│  • Configure les middlewares (express.json)                      │
│  • Monte les routes                                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                          ROUTES                                  │
│           (articleRoutes.js / userRoutes.js)                     │
│                                                                   │
│  GET  /api/users      ──────► getAllUsers()                     │
│  POST /api/users      ──────► createUser()                      │
│  GET  /api/articles   ──────► getAllArticles()                  │
│  POST /api/articles   ──────► createArticle()                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       CONTROLLERS                                │
│        (articleController.js / userController.js)                │
│                   (Logique métier)                               │
│                                                                   │
│  • Reçoit la requête (req) et la réponse (res)                  │
│  • Utilise async/await pour les opérations asynchrones          │
│  • Appelle les méthodes du Modèle                               │
│  • Gère les erreurs avec try...catch                            │
│  • Envoie la réponse au client                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MODELS                                   │
│              (Article.js / User.js)                              │
│                  (Schéma + Modèle Mongoose)                      │
│                                                                   │
│  SCHÉMA : Définit la structure des données                       │
│  • Champs (title, email, password...)                           │
│  • Types (String, Number, Date...)                              │
│  • Validations (required, unique, minlength...)                 │
│                                                                   │
│  MODÈLE : Interface pour interagir avec MongoDB                 │
│  • Model.find()      → Lire tous les documents                  │
│  • Model.findById()  → Lire un document par ID                  │
│  • Model.save()      → Créer/Modifier un document               │
│  • Model.delete()    → Supprimer un document                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MONGOOSE (ODM)                              │
│              Object Data Modeling Library                        │
│                                                                   │
│  • Traduit les objets JavaScript en documents MongoDB           │
│  • Valide les données selon le schéma                           │
│  • Gère les connexions et les requêtes                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas (Cloud)                         │
│                      Base de Données                             │
│                                                                   │
│  Database: blogDB                                                │
│  ├── Collection: users                                           │
│  │   ├── Document 1: { _id, username, email, password... }     │
│  │   ├── Document 2: { _id, username, email, password... }     │
│  │   └── Document 3: ...                                        │
│  │                                                               │
│  └── Collection: articles                                        │
│      ├── Document 1: { _id, title, content, author... }        │
│      ├── Document 2: { _id, title, content, author... }        │
│      └── Document 3: ...                                        │
└─────────────────────────────────────────────────────────────────┘
```
---

## 🧩 Partie 1 – Concepts Techniques

### ⚡ Le Monde Asynchrone de Node.js
Node.js exécute les opérations I/O de manière **asynchrone** pour ne pas bloquer le thread principal.

#### 🧵 Niveaux d’asynchronisme :
1. **Callbacks** 😵‍💫 – Méthode historique, difficile à lire ("Callback Hell")

2. **Promises** 🧱 – Plus propre, mais peut devenir verbeux

3. **Async/Await** ✨ – Syntaxe moderne et lisible, basée sur les Promises  
   👉 C’est cette méthode que nous utiliserons avec Mongoose.

---

### 🍃 MongoDB & Mongoose
MongoDB stocke les données sous forme de **documents BSON** dans des **collections**.

Mongoose joue le rôle d’**ODM (Object Data Modeling)** :  
- 🧰 **Schema** → le plan (structure des données, types, validations)  
- 🏭 **Model** → l’usine qui crée et interagit avec les documents  

Exemple :  
```js
const articleSchema = new mongoose.Schema({ title: String });
module.exports = mongoose.model('Article', articleSchema);
```

## 🧪 Partie 2 – Intégration Pratique
### 🛠️ Étape 1 : Création du Cluster MongoDB Atlas (ou bien MongoDB local)

Créez un compte sur MongoDB Atlas

👉 ou bien installez MongoDB localement sur votre machine.
(Dans ce cas, la chaîne de connexion sera du type : mongodb://127.0.0.1:27017/blogDB)

Créez un cluster gratuit (M0) si vous utilisez Atlas

Configurez la sécurité :

👤 Créez un utilisateur (user : strongPassword123)

🌍 Autorisez l’accès : 0.0.0.0/0

🔗 Récupérez la chaîne de connexion :
```ruby
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
--- 

### ⚙️ Étape 2 : Installation et Configuration du Projet
#### 📦 Installation
```bash
npm install mongoose dotenv
```

#### 🔐 Fichier .env
```env
MONGODB_URI=mongodb+srv ://user: strongPassword123@cluster0.xxxxx.mongodb .net/ blogDB ? retryWrites = true &w= majority

<!-- pour MongoDB -->
# MONGODB_URI=mongodb://localhost:27017/mon-api-blog-3
# PORT=3000
```


#### 🧩 Fichier config/db.js
```js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion à MongoDB réussie !');
  } catch (err) {
    console.error('❌ Erreur de connexion :', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

#### 🚀 Fichier server.js
```js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

connectDB(); // Connexion à MongoDB

const app = express();
app.use(express.json());

// Routes ici...

app.listen(3000, () => console.log('🚀 Serveur sur le port 3000'));
```
---

### 🧱 Étape 3 : Création du Modèle Article

##### 📁 models/Article.js
```js
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est obligatoire.'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Le contenu est obligatoire.']
  },
  author: {
    type: String,
    default: 'Anonyme'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Article', articleSchema);
```
---

### 🧭 Étape 4 : Mise à Jour des Contrôleurs (Async/Await)

##### 📁 controllers/articleController.js
```js
const Article = require('../models/Article');

// 📰 GET /api/articles
const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération", error: err.message });
  }
};

// 🆕 POST /api/articles
const createArticle = async (req, res) => {
  try {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    });
    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (err) {
    res.status(400).json({ message: "Erreur de création", error: err.message });
  }
};

module.exports = { getAllArticles, createArticle };
```

---
### 🗺️ Étape 5 : Mise à Jour du Routeur

##### 📁 routes/articleRoutes.js
```js
const express = require('express');
const router = express.Router();
const { getAllArticles, createArticle } = require('../controllers/articleController');

router.get('/', getAllArticles);
router.post('/', createArticle);

module.exports = router;
```
### 🧪 Étape 6 : Test Final avec Postman

1. Démarrez le serveur :
```bash
npm run dev
```

✅ Vérifiez que “Connexion à MongoDB réussie !” s’affiche.
```bsh 
✅ Connexion à MongoDB réussie !
🚀 Serveur démarré sur http://localhost:3000
```

✉️ Test - Création des Articles

Méthode : POST

URL : http://localhost:3000/api/articles

Headers : Content-Type: application/json

Envoyez un JSON :
```js
{
  "title": "Les bienfaits de la méditation",
  "content": "La méditation quotidienne améliore la concentration."
}
```
✅ Résultat Attendu

Tous ces articles auront automatiquement :

author: "Anonyme" (valeur par défaut)

createdAt: Date actuelle (généré automatiquement)

![Résultat](images/Capture%201.png)

Envoyez un JSON :
```js
{
  "title": "Recette de tarte aux pommes traditionnelle",
  "content": "Une délicieuse tarte aux pommes avec une pâte feuilletée croustillante."
}
```
![Résultat](images/Capture%202.png)

📖 Test - Récupérer Tous les Articles (GET)

1. Configuration de la requête

Créez une nouvelle requête dans Postman

Méthode : Sélectionnez GET

URL : http://localhost:3000/api/articles

Pas besoin de Body ou Headers particuliers

2. Envoi et vérification

Cliquez sur "Send"

Vous devriez recevoir un tableau JSON avec tous vos articles :

![Résultat](images/Capture%204.png)

🧾 Vérifiez vos données dans MongoDB Atlas ou votre base locale.
![Résultat](images/Capture%203.png)

🧪 Test - Erreur : Titre Manquant

![Résultat](images/Capture%2010.png.png)

--- 

## 💼 Travail Pratique Complémentaire

👩‍💻 Créez un modèle Utilisateur (User.js) avec les champs :

** - username (String, requis, unique) **

** - email (String, requis, unique) ** 

** - password (String, requis) --

```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Le nom d\'utilisateur est obligatoire.'],
    unique: true,
    trim: true,
    minlength: [3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères.']
  },
  email: {
    type: String,
    required: [true, 'L\'email est obligatoire.'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez fournir un email valide.']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire.'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères.']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
```

🧠 Mettez à jour userController.js :

- createUser → enregistre un utilisateur (User.create() ou .save())

- getAllUsers → retourne tous les utilisateurs (User.find())

```js
const User = require('../models/User');

// @desc    Récupérer tous les utilisateurs
// @route   GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ 
      message: "Erreur lors de la récupération des utilisateurs.", 
      error: err.message 
    });
  }
};

// @desc    Créer un nouvel utilisateur
// @route   POST /api/users
const createUser = async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);

  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      res.status(400).json({ 
        message: `Ce ${field} est déjà utilisé.`,
        error: err.message 
      });
    } else if (err.name === 'ValidationError') {
      res.status(400).json({ 
        message: "Erreur de validation des données.",
        error: err.message 
      });
    } else {
      res.status(400).json({ 
        message: "Erreur lors de la création de l'utilisateur.", 
        error: err.message 
      });
    }
  }
};

module.exports = {
  getAllUsers,
  createUser
};
```

#### 🧪 Testez avec Postman : création et récupération des utilisateurs.

📋  Tests des Utilisateurs

🧪 Test  - Créer un Utilisateur

1. Nouvelle requête
2. Méthode : POST
3. URL : http://localhost:3000/api/users
4. Onglet "Headers" :

  - Cliquez sur "Bulk Edit"
  - Ajoutez : Content-Type: application/json

5. Onglet "Body" :
  
  - Sélectionnez "raw"
  - Format : "JSON"

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

6. Cliquez sur "Send"

Résultat attendu :

![Résultat](images/Capture%205.png)

✅ Statut : 201 Created
Sauvegardez cette requête dans le dossier "Users" avec le nom : "Create User - Success"

🧪 Test - Récupérer Tous les Utilisateurs

 - Nouvelle requête
 - Méthode : GET
 - URL : http://localhost:3000/api/users
 - Cliquez sur "Send"

Résultat attendu :

![Résultat](images/Capture%206.png)

✅ Statut : 200 OK
Sauvegardez avec le nom : "Get All Users"

🧪 Test  - Erreur : Username Dupliqué
Méthode : POST
URL : http://localhost:3000/api/users
json{
  "username": "john_doe",
  "email": "newemail@example.com",
  "password": "password123"
}
Résultat attendu :

![Résultat](images/Capture%207.png)

❌ Statut : 400 Bad Request
Sauvegardez avec le nom : "Create User - Duplicate Username"

🧪 Test - Erreur : Email Invalide

![Résultat](images/Capture%208.png)

❌ Statut : 400 Bad Request

🧪 Test  - Erreur : Champ Manquant

![Résultat](images/Capture%209.png)

❌ Statut : 400 Bad Request
(password manquant)

✅ Vérifiez vos données dans MongoDB Atlas ou votre base locale.

![Résultat](images/Capture%2011.png)

--- 

** En résumé ** 

✅ API REST fonctionnelle avec MongoDB et Mongoose
✅ Maîtrise de la programmation asynchrone (async/await)
✅ Architecture MVC propre et maintenable
✅ Validation complète des données
✅ Gestion robuste des erreurs
✅ 16/16 tests réussis (100%)
✅ Base solide pour les développements futurs

```markdown
CLIENT
  ↓ (HTTP Request)
SERVER.JS
  ↓ (Routing)
ROUTES
  ↓ (Function Call)
CONTROLLERS
  ↓ (Database Query)
MODELS
  ↓ (Data Validation)
MONGOOSE
  ↓ (BSON Translation)
MONGODB
  ↑ (Response)
CLIENT
``` 

** Prochaines étapes **

🎯 Compléter le CRUD (Update, Delete)
🎯 Implémenter l'authentification JWT
🎯 Hasher les mots de passe avec bcrypt
🎯 Ajouter des relations entre modèles
🎯 Mettre en place la pagination
🎯 Déployer l'application en production