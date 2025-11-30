# 📚 EduPlatform API  - Cours MERN

---

**Vue d'ensemble du projet**
Ce projet est une API REST pour une plateforme de cours en ligne qui démontre la maîtrise des relations de données dans MongoDB avec Mongoose. L'API permet de gérer des utilisateurs, leurs profils, des cours, des inscriptions et des critiques.

## 🎯 Objectifs pédagogiques
Compétences démontrées

* *Implémentation complète d'un CRUD pour plusieurs ressources*
* *Modélisation et gestion des trois types de relations de données*
* *Utilisation avancée de Mongoose (références, populate)*
* *Conception d'une architecture RESTful logique*
* *Système d'authentification JWT complet*

---
## 🛠️ Technologies Utilisées

### Backend
- 🟢 **Node.js** - Runtime JavaScript côté serveur
- ⚡ **Express.js** - Framework web minimaliste et flexible
- 🍃 **MongoDB** - Base de données NoSQL orientée documents
- 🔗 **Mongoose** - ODM (Object Data Modeling) pour MongoDB
- 🔐 **bcryptjs** - Hashage sécurisé des mots de passe
- 🎫 **jsonwebtoken (JWT)** - Authentification par tokens
- 🌍 **dotenv** - Gestion des variables d'environnement


### Outils de Développement
- 📮 **Postman / Thunder Client** - Tests des APIs REST
- 🔧 **Nodemon** - Rechargement automatique du serveur
- 📦 **npm** - Gestionnaire de paquets Node.js
- 🐙 **Git** - Contrôle de version

----
## 🗂️ Structure complète

```pgsql
EduPlatform/
├─ server.js
├─ .env
├─ config/
│   └─ db.js
├─ images/
├─ models/
│   ├─ User.js
│   ├─ Profile.js
│   ├─ Course.js
│   └─ Review.js
├─ controllers/
│   ├─ userController.js
│   ├─ profileController.js
│   ├─ courseController.js
│   └─ reviewController.js
├─ routes/
│   ├─ userRoutes.js
│   └─ courseRoutes.js
└─ middleware/
    ├─ authMiddleware.js
    └─ errorMiddleware.js
```

---
## 🚀 Installation
**Prérequis**
* Node.js (v14 ou supérieur)
* npm ou yarn
* Postman (pour tester l'API)

## ▶️ Lancer l'API
```
npm install
node server.js
```
Messages attendus :

>✅ MongoDB connected
>✅ Server running on port 3000

---

## 📊 Architecture des Données
*Schéma Général des Relations*
```pgsql
┌─────────────────────────────────────────────────────────────────┐
│                     EDUPLATFORM - RELATIONS                      │
└─────────────────────────────────────────────────────────────────┘

        ┌──────────────┐              ┌──────────────┐
        │     USER     │              │   PROFILE    │
        │──────────────│              │──────────────│
        │ _id          │◄────────────►│ _id          │
        │ username     │   1-to-1     │ user (ref)   │
        │ email        │              │ bio          │
        │ password     │              │ website      │
        │ courses []   │              └──────────────┘
        └──────┬───────┘
               │                      
               │ Many-to-Many         
               │                      
        ┌──────▼───────┐              ┌──────────────┐
        │    COURSE    │              │    REVIEW    │
        │──────────────│              │──────────────│
        │ _id          │◄─────────────│ _id          │
        │ title        │  1-to-Many   │ rating       │
        │ description  │              │ comment      │
        │ instructor   │              │ course (ref) │
        │ students []  │              │ user (ref)   │
        └──────────────┘              └──────────────┘
```

### 🔗 Les Relations de Données Expliquées
**1. Relation One-to-One (1:1) - User ↔ Profile**

**Concept:** Un utilisateur possède UN SEUL profil, et un profil appartient à UN SEUL utilisateur
```pgsql
┌─────────────────────────────────────────────────────────────────┐
│                      RELATION ONE-TO-ONE                         │
└─────────────────────────────────────────────────────────────────┘

   USER (Collection)              PROFILE (Collection)
   
┌──────────────────┐           ┌──────────────────────┐
│ _id: "abc123"    │           │ _id: "xyz789"        │
│ username: "alice"│◄─────────►│ user: "abc123" ──────┼── Référence unique
│ email: "a@e.com" │           │ bio: "Developer"     │
│ password: "***"  │           │ website: "..."       │
└──────────────────┘           └──────────────────────┘

        1                                 1
```

*Implémentation Mongoose:*
```js
// Profile.js - Stocke la référence vers User
const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true  // 🔑 GARANTIT la relation 1:1
  },
  bio: String,
  website: String
});
```

*Pourquoi du côté Profile?*

-  Les informations User sont essentielles (toujours présentes)
-  Le Profile est optionnel/complémentaire
-  Plus logique de référencer l'essentiel depuis l'optionnel

**Exemple d'utilisation:**
```js
// Créer un profil pour un utilisateur
const profile = await Profile.create({
  user: userId,  // ID de l'utilisateur
  bio: "Passionné de code",
  website: "https://example.com"
});

// Récupérer un profil avec les infos user
const profile = await Profile.findOne({ user: userId })
  .populate('user', 'username email');
```

**2. Relation One-to-Many (1:N) - Course → Reviews**

**Concept:** Un cours peut avoir PLUSIEURS critiques, mais une critique appartient à UN SEUL cours.

```pgsql
┌─────────────────────────────────────────────────────────────────┐
│                     RELATION ONE-TO-MANY                         │
└─────────────────────────────────────────────────────────────────┘

     COURSE (Collection)           REVIEW (Collection)
     
┌────────────────────┐          ┌─────────────────────┐
│ _id: "course1"     │          │ _id: "rev1"         │
│ title: "React 101" │◄─────────│ course: "course1"   │
│ description: "..." │          │ rating: 5           │
│ instructor: "..."  │          │ comment: "Great!"   │
└────────────────────┘          │ user: "user1"       │
         ▲                      └─────────────────────┘
         │                               
         │                      ┌─────────────────────┐
         │                      │ _id: "rev2"         │
         └──────────────────────│ course: "course1"   │
         │                      │ rating: 4           │
         │                      │ comment: "Good"     │
         │                      │ user: "user2"       │
         │                      └─────────────────────┘
         │                               
         │                      ┌─────────────────────┐
         │                      │ _id: "rev3"         │
         └──────────────────────│ course: "course1"   │
                                │ rating: 5           │
                                │ comment: "Perfect!" │
                                │ user: "user3"       │
                                └─────────────────────┘
        1                              MANY
```

*Implémentation Mongoose:*
```js
// Review.js - Référence stockée du côté "Many"
const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: String,
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true  // 🔑 Chaque review DOIT avoir un cours
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});
```

*Pourquoi pas dans Course?*

**❌ Mauvaise approche:**

```javascript
// Course.js - À ÉVITER
{
  reviews: [rev1, rev2, rev3, ...] // Tableau qui peut devenir ÉNORME
}
```
**✅ Bonne approche:**
```javascript
// Review.js - Recommandé
{
  course: courseId  // Juste une référence
}
```
**Avantages:**

- Évite les documents trop volumineux
- Facilite les requêtes (trouver toutes les reviews d'un cours)
- Meilleure scalabilité

*Exemple d'utilisation:*
```javascript
// Créer une review
const review = await Review.create({
  rating: 5,
  comment: "Excellent cours!",
  course: courseId,
  user: userId
});

// Récupérer toutes les reviews d'un cours
const reviews = await Review.find({ course: courseId })
  .populate('user', 'username');
```

**3. Relation Many-to-Many (N:M) - User ↔ Course**

**Concept:** Un utilisateur peut s'inscrire à PLUSIEURS cours, et un cours peut avoir PLUSIEURS étudiants.
```pgsql
┌─────────────────────────────────────────────────────────────────┐
│                    RELATION MANY-TO-MANY                         │
└─────────────────────────────────────────────────────────────────┘

    USER Collection                      COURSE Collection
    
┌──────────────────┐                 ┌──────────────────────┐
│ _id: "user1"     │                 │ _id: "course1"       │
│ username: "alice"│◄───────────────►│ title: "React 101"   │
│ courses: [       │                 │ students: [          │
│   "course1",     │                 │   "user1",           │
│   "course2",     │                 │   "user2"            │
│   "course3"      │    ┌────────┐   │ ]                    │
│ ]                │    │        │   └──────────────────────┘
└──────────────────┘    │ DOUBLE │   
                        │RÉFÉRENCE
┌──────────────────┐    │        │   ┌──────────────────────┐
│ _id: "user2"     │    │        │   │ _id: "course2"       │
│ username: "bob"  │◄───┼────────┼──►│ title: "Node.js"     │
│ courses: [       │    │        │   │ students: [          │
│   "course1",     │    └────────┘   │   "user1",           │
│   "course2"      │                 │   "user2",           │
│ ]                │                 │   "user3"            │
└──────────────────┘                 │ ]                    │
                                     └──────────────────────┘
┌──────────────────┐                 
│ _id: "user3"     │                 ┌──────────────────────┐
│ username: "carol"│◄───────────────►│ _id: "course3"       │
│ courses: [       │                 │ title: "MongoDB"     │
│   "course2",     │                 │ students: [          │
│   "course3"      │                 │   "user1",           │
│ ]                │                 │   "user3"            │
└──────────────────┘                 │ ]                    │
                                     └──────────────────────┘
       MANY                                  MANY
```

*Implémentation Mongoose - DOUBLE RÉFÉRENCE:*

```javascript
// User.js
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'  // 🔑 Tableau de cours
  }]
});

// Course.js
const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  instructor: String,
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'  // 🔑 Tableau d'étudiants
  }]
});
```
*⚠️ IMPORTANT: Mise à jour BIDIRECTIONNELLE*

```pgsql
┌─────────────────────────────────────────────────────────────────┐
│              INSCRIPTION - MISE À JOUR DES DEUX CÔTÉS            │
└─────────────────────────────────────────────────────────────────┘

POST /api/courses/:courseId/enroll
Body: { userId: "user1" }

ÉTAPE 1: Récupérer les documents
┌──────────────────┐           ┌──────────────────────┐
│ User: "user1"    │           │ Course: "course1"    │
│ courses: []      │           │ students: []         │
└──────────────────┘           └──────────────────────┘

ÉTAPE 2: Ajouter user1 au cours
                              ┌──────────────────────┐
                              │ Course: "course1"    │
                              │ students: ["user1"]  │◄─ AJOUT
                              └──────────────────────┘

ÉTAPE 3: Ajouter course1 à l'utilisateur
┌──────────────────┐           
│ User: "user1"    │           
│ courses:         │◄────────── AJOUT
│   ["course1"]    │           
└──────────────────┘           

ÉTAPE 4: Sauvegarder LES DEUX
await course.save();  ✅
await user.save();    ✅
```
*Exemple d'implémentation:*

```js
// POST /api/courses/:courseId/enroll
const enrollUserInCourse = async (req, res) => {
  const { courseId } = req.params;
  const { userId } = req.body;

  const course = await Course.findById(courseId);
  const user = await User.findById(userId);

  if (!course || !user) {
    return res.status(404).json({ message: 'Non trouvé' });
  }

  // 1️⃣ Ajouter l'user au cours (si pas déjà inscrit)
  if (!course.students.includes(userId)) {
    course.students.push(userId);
    await course.save();  // ✅ IMPORTANT
  }

  // 2️⃣ Ajouter le cours à l'user (si pas déjà ajouté)
  if (!user.courses.includes(courseId)) {
    user.courses.push(courseId);
    await user.save();  // ✅ IMPORTANT
  }

  res.json({ message: 'Inscription réussie' });
};
```

### 🛠️ Mongoose - Concepts Avancés

**.populate() - Le Peuplement de Références**

*Sans populate: Vous obtenez juste les IDs*

```javascript
// Sans populate
const course = await Course.findById(courseId);
console.log(course.students);
// Résultat: ["abc123", "def456", "ghi789"]  ❌ Juste des IDs
```
*Avec populate: Vous obtenez les documents complets*

```javascript
// Avec populate
const course = await Course.findById(courseId)
  .populate('students');

console.log(course.students);
// Résultat: [
//   { _id: "abc123", username: "alice", email: "alice@..." },
//   { _id: "def456", username: "bob", email: "bob@..." },
//   { _id: "ghi789", username: "carol", email: "carol@..." }
// ] ✅ Documents complets
```

*Schéma explicatif:*

```pgsql
┌─────────────────────────────────────────────────────────────────┐
│                    POPULATE - AVANT / APRÈS                      │
└─────────────────────────────────────────────────────────────────┘

AVANT .populate()
┌──────────────────────────────────────┐
│ Course                               │
│ {                                    │
│   _id: "course1",                    │
│   title: "React 101",                │
│   students: [                        │
│     "user1",    ◄─── Juste des IDs   │
│     "user2",                         │
│     "user3"                          │
│   ]                                  │
│ }                                    │
└──────────────────────────────────────┘

           .populate('students')
                    │
                    ▼

APRÈS .populate()
┌──────────────────────────────────────┐
│ Course                               │
│ {                                    │
│   _id: "course1",                    │
│   title: "React 101",                │
│   students: [                        │
│     {                                │
│       _id: "user1",                  │
│       username: "alice", ◄─── Docs   │
│       email: "alice@..."    complets │
│     },                               │
│     {                                │
│       _id: "user2",                  │
│       username: "bob",               │
│       email: "bob@..."               │
│     },                               │
│     {                                │
│       _id: "user3",                  │
│       username: "carol",             │
│       email: "carol@..."             │
│     }                                │
│   ]                                  │
│ }                                    │
└──────────────────────────────────────┘
```

*Sélection de champs spécifiques:*

```javascript
// Ne récupérer que certains champs
const course = await Course.findById(courseId)
  .populate('students', 'username email');
  //                      ^^^^^^^^^^^^^^^^ Seulement ces champs

// Résultat:
// students: [
//   { _id: "abc123", username: "alice", email: "alice@..." },
//   { _id: "def456", username: "bob", email: "bob@..." }
// ]
// Note: _id est toujours inclus par défaut
```
**Multiple populate:**

```javascript
// Peupler plusieurs références
const review = await Review.findById(reviewId)
  .populate('user', 'username')
  .populate('course', 'title instructor');

// Résultat:
// {
//   _id: "rev1",
//   rating: 5,
//   comment: "Great!",
//   user: { _id: "user1", username: "alice" },
//   course: { _id: "course1", title: "React 101", instructor: "John" }
// }
```
#### 📸 Captures d'Écran

![result](images/post_user.png)

![result](images/post_course.png)

![result](images/post_course_user_enroll.png)

![result](images/post_review.png)

---
## 🔐 Authentification JWT 
**Qu'est-ce qu'un JWT?**
`JWT = JSON Web Token`

> C'est un moyen sécurisé de transmettre des informations entre le client et le serveur.

```pgsql
┌─────────────────────────────────────────────────────────────────┐
│                     STRUCTURE D'UN JWT                           │
└─────────────────────────────────────────────────────────────────┘

    xxxxx   .   yyyyy   .   zzzzz
   ┌─────┐     ┌─────┐     ┌─────┐
   │  1  │  .  │  2  │  .  │  3  │
   └─────┘     └─────┘     └─────┘
   HEADER      PAYLOAD    SIGNATURE

1️⃣ HEADER (Base64)
┌────────────────────────────┐
│ {                          │
│   "alg": "HS256",         │ ◄─ Algorithme de signature
│   "typ": "JWT"            │ ◄─ Type de token
│ }                          │
└────────────────────────────┘

2️⃣ PAYLOAD (Base64) - Données utilisateur
┌────────────────────────────┐
│ {                          │
│   "userId": "abc123",     │ ◄─ ID de l'utilisateur
│   "email": "alice@e.com", │ ◄─ Email
│   "iat": 1234567890,      │ ◄─ Issued At (création)
│   "exp": 1235172690       │ ◄─ Expiration
│ }                          │
└────────────────────────────┘

3️⃣ SIGNATURE - Vérification
┌─────────────────────────────────────┐
│ HMACSHA256(                         │
│   base64(header) + "." +           │
│   base64(payload),                 │
│   JWT_SECRET ◄─ Clé secrète        │
│ )                                   │
└─────────────────────────────────────┘
```

*Flux d'Authentification Complet*

```pgsql
┌─────────────────────────────────────────────────────────────────┐
│              FLUX D'AUTHENTIFICATION JWT COMPLET                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────┐                                  ┌─────────────┐
│   CLIENT    │                                  │   SERVEUR   │
│   (React)   │                                  │  (Express)  │
└──────┬──────┘                                  └──────┬──────┘
       │                                                │
       │ 1️⃣ Inscription                                │
       │ POST /api/auth/register                       │
       │ { username, email, password }                 │
       ├──────────────────────────────────────────────>│
       │                                                │
       │                                2️⃣ Vérifier    │
       │                                   email unique │
       │                                3️⃣ Hasher      │
       │                                   password     │
       │                                4️⃣ Créer user  │
       │                                5️⃣ Générer JWT │
       │                                                │
       │ 6️⃣ Retour                                     │
       │ { token, user }                               │
       │<──────────────────────────────────────────────┤
       │                                                │
       │ 7️⃣ Stocker token                              │
       │ localStorage.setItem('token', ...)            │
       │                                                │
       ├────────────────────────────────────────────────
       │
       │ 8️⃣ Connexion                                  │
       │ POST /api/auth/login                          │
       │ { email, password }                           │
       ├──────────────────────────────────────────────>│
       │                                                │
       │                                9️⃣ Vérifier    │
       │                                   email existe │
       │                                🔟 Comparer    │
       │                                   password     │
       │                                1️⃣1️⃣ Générer   │
       │                                   JWT          │
       │                                                │
       │ 1️⃣2️⃣ Retour                                   │
       │ { token, user }                               │
       │<──────────────────────────────────────────────┤
       │                                                │
       ├────────────────────────────────────────────────
       │
       │ 1️⃣3️⃣ Requête protégée                         │
       │ GET /api/users/profile                        │
       │ Header: Authorization: Bearer TOKEN           │
       ├──────────────────────────────────────────────>│
       │                                                │
       │                              1️⃣4️⃣ Middleware  │
       │                                 vérifie token  │
       │                              1️⃣5️⃣ Décode JWT  │
       │                              1️⃣6️⃣ Extrait     │
       │                                 userId         │
       │                              1️⃣7️⃣ Récupère    │
       │                                 données user   │
       │                                                │
       │ 1️⃣8️⃣ Données utilisateur                      │
       │ { id, username, email, courses }              │
       │<──────────────────────────────────────────────┤
       │                                                │
       ▼                                                ▼
```

---

#### Installation et Configuration
**1. Installer les dépendances:**

```bash
npm install bcryptjs jsonwebtoken
```
```pgsql
┌─────────────────────────────────────────────────────────────────┐
│                    PACKAGES NÉCESSAIRES                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────┐
│        bcryptjs                 │
│─────────────────────────────────│
│ • Hasher les mots de passe     │
│ • Comparer hash vs plaintext   │
│ • Algorithme bcrypt (sécurisé) │
│                                 │
│ Méthodes:                       │
│ - bcrypt.hash(password, 10)    │
│ - bcrypt.compare(plain, hash)  │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│      jsonwebtoken               │
│─────────────────────────────────│
│ • Générer des tokens JWT       │
│ • Vérifier et décoder tokens   │
│ • Gérer l'expiration           │
│                                 │
│ Méthodes:                       │
│ - jwt.sign(payload, secret)    │
│ - jwt.verify(token, secret)    │
└─────────────────────────────────┘
```

**2. Mise à jour du modèle User:**

```js
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  courses: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course' 
  }]
});
module.exports = mongoose.model('User', userSchema);
```
----

#### Routes d'Authentification
##### 📝 Route Register (Inscription)

```pgsql
┌─────────────────────────────────────────────────────────────────┐
│              PROCESSUS D'INSCRIPTION (REGISTER)                  │
└─────────────────────────────────────────────────────────────────┘

POST /api/auth/register
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "password123"
}
         │
         ▼
┌──────────────────────────────┐
│ 1. Vérifier email unique     │
│    User.findOne({ email })   │
└────────┬─────────────────────┘
         │ Email existe déjà?
         ├─ OUI ──> ❌ 400 "Email déjà utilisé"
         │
         └─ NON
         ▼
┌──────────────────────────────┐
│ 2. Hasher le mot de passe    │
│    bcrypt.hash(password, 10) │
└────────┬─────────────────────┘
         │
         │ plaintext: "password123"
         │         ↓
         │ hash: "$2a$10$N9qo..."  ⬅️ 60 caractères
         ▼
┌──────────────────────────────┐
│ 3. Créer l'utilisateur       │
│    User.create({...})        │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ 4. Générer JWT               │
│    jwt.sign({                │
│      userId: user._id,       │
│      email: user.email       │
│    }, JWT_SECRET, {          │
│      expiresIn: '7d'         │
│    })                        │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ 5. Retourner token + user    │
│    {                         │
│      token: "eyJhbG...",     │
│      user: {                 │
│        id, username, email   │
│      }                       │
│    }                         │
└──────────────────────────────┘
         │
         ▼
    ✅ 201 Created
```
---

##### 🔑 Route Login (Connexion)

```pgsql
┌─────────────────────────────────────────────────────────────────┐
│                PROCESSUS DE CONNEXION (LOGIN)                    │
└─────────────────────────────────────────────────────────────────┘

POST /api/auth/login
{
  "email": "alice@example.com",
  "password": "password123"
}
         │
         ▼
┌──────────────────────────────┐
│ 1. Trouver l'utilisateur     │
│    User.findOne({ email })   │
└────────┬─────────────────────┘
         │ User trouvé?
         ├─ NON ──> ❌ 401 "Email ou mot de passe incorrect"
         │
         └─ OUI
         ▼
┌──────────────────────────────┐
│ 2. Comparer les passwords    │
│    bcrypt.compare(           │
│      plaintext,              │
│      hashedFromDB            │
│    )                         │
└────────┬─────────────────────┘
         │
         │ Input:  "password123"
         │ DB:     "$2a$10$N9qo..."
         │         ↓
         │ Match?  ✅ true / ❌ false
         │
         ├─ false ──> ❌ 401 "Email ou mot de passe incorrect"
         │
         └─ true
         ▼
┌──────────────────────────────┐
│ 3. Générer JWT               │
│    jwt.sign({                │
│      userId: user._id,       │
│      email: user.email       │
│    }, JWT_SECRET, {          │
│      expiresIn: '7d'         │
│    })                        │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ 4. Retourner token + user    │
│    {                         │
│      token: "eyJhbG...",     │
│      user: {                 │
│        id, username, email   │
│      }                       │
│    }                         │
└──────────────────────────────┘
         │
         ▼
    ✅ 200 OK
```

#### Middleware de Protection
Le middleware protect sécurise les routes en vérifiant le JWT.

```pgsql
┌─────────────────────────────────────────────────────────────────┐
│              FONCTIONNEMENT DU MIDDLEWARE PROTECT                │
└─────────────────────────────────────────────────────────────────┘

GET /api/users/profile
Headers: {
  Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
         │
         ▼
┌──────────────────────────────┐
│ MIDDLEWARE: protect()        │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ 1. Vérifier header Auth      │
│    req.headers.authorization │
└────────┬─────────────────────┘
         │ Header existe?
         ├─ NON ──> ❌ 401 "Pas de token, accès refusé"
         │
         └─ OUI: "Bearer eyJhbG..."
         ▼
┌──────────────────────────────┐
│ 2. Extraire le token         │
│    token = header.split(' ')│
│           [1]                 │
└────────┬─────────────────────┘
         │
         │ "Bearer eyJhbG..." → ["Bearer", "eyJhbG..."]
         │                              ↑
         │                           Index [1]
         ▼
┌──────────────────────────────┐
│ 3. Vérifier le token         │
│    jwt.verify(               │
│      token,                  │
│      JWT_SECRET              │
│    )                         │
└────────┬─────────────────────┘
         │
         ├─ ❌ Token invalide/expiré
         │    → 401 "Token invalide"
         │
         └─ ✅ Token valide
         ▼
┌──────────────────────────────┐
│ 4. Décoder le payload        │
│    {                         │
│      userId: "abc123",       │
│      email: "alice@...",     │
│      iat: 1234567890,        │
│      exp: 1235172690         │
│    }                         │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ 5. Ajouter à la requête      │
│    req.userId = decoded.     │
│                  userId      │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ 6. Passer au contrôleur      │
│    next()                    │
└──────────────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ CONTRÔLEUR                   │
│ - req.userId est disponible  │
│ - Peut récupérer les données │
│   de l'utilisateur connecté  │
└──────────────────────────────┘
```

##### Configuration des Variables d'Environnement

```pgsql
┌─────────────────────────────────────────────────────────────────┐
│                  FICHIER .env - CONFIGURATION                    │
└─────────────────────────────────────────────────────────────────┘

Fichier: .env (à la racine du projet backend)
┌────────────────────────────────────────────┐
│ PORT=5000                                  │
│ MONGO_URI=mongodb://localhost:27017/      │
│           eduplatform                      │
│ JWT_SECRET=ma_cle_secrete_super_longue_   │
│            et_complexe_changez_moi         │
└────────────────────────────────────────────┘
        │
        ▼
┌────────────────────────────────────────────┐
│ Chargement avec dotenv                     │
│                                            │
│ require('dotenv').config();                │
│                                            │
│ Accessible via:                            │
│ - process.env.PORT                         │
│ - process.env.MONGO_URI                    │
│ - process.env.JWT_SECRET                   │
└────────────────────────────────────────────┘

⚠️ IMPORTANT: Fichier .gitignore
┌────────────────────────────────────────────┐
│ node_modules/                              │
│ .env          ⬅️ NE PAS commit            │
│ .DS_Store                                  │
└────────────────────────────────────────────┘

✅ À FAIRE: Créer .env.example
┌────────────────────────────────────────────┐
│ PORT=5000                                  │
│ MONGO_URI=your_mongodb_connection_string   │
│ JWT_SECRET=your_super_secret_key_here      │
└────────────────────────────────────────────┘
```
----

### 🌐 Structure des Routes API

*Vue d'ensemble des Endpoints*

```pgsql
┌─────────────────────────────────────────────────────────────────┐
│                    ARCHITECTURE DES ROUTES                       │
└─────────────────────────────────────────────────────────────────┘

/api
├── /auth ⚪ PUBLIQUES
│   ├── POST /register         → Inscription
│   └── POST /login            → Connexion
│
├── /users
│   ├── POST /                 ⚪ Créer utilisateur
│   ├── GET /                  ⚪ Liste utilisateurs
│   ├── GET /:id               ⚪ Un utilisateur
│   ├── GET /:userId/profile   🔒 Profil d'un user
│   └── GET /:userId/courses   🔒 Cours d'un user
│
├── /profiles (Nested sous /users)
│   ├── POST /users/:userId/profile    🔒 Créer profil
│   ├── GET /users/:userId/profile     🔒 Voir profil
│   └── PUT /users/:userId/profile     🔒 Modifier profil
│
├── /courses
│   ├── POST /                        🔒 Créer cours
│   ├── GET /                         ⚪ Liste cours
│   ├── GET /:id                      ⚪ Un cours
│   ├── POST /:courseId/enroll        🔒 Inscription
│   ├── GET /:courseId/students       ⚪ Liste étudiants
│   └── GET /:courseId/reviews        ⚪ Liste reviews
│
└── /reviews (Nested sous /courses)
    └── POST /courses/:courseId/reviews  🔒 Ajouter review

⚪ Route publique (pas d'auth requise)
🔒 Route protégée (JWT requis)
```
------

##### 📊 Codes de Statut HTTP

```psql
┌─────────────────────────────────────────────────────────────────┐
│                   CODES HTTP - GUIDE COMPLET                     │
└─────────────────────────────────────────────────────────────────┘

2xx - SUCCÈS ✅
┌──────┬─────────────┬────────────────────────────────┐
│ Code │ Nom         │ Utilisation                    │
├──────┼─────────────┼────────────────────────────────┤
│ 200  │ OK          │ GET, PUT réussis               │
│ 201  │ Created     │ POST réussi, ressource créée   │
│ 204  │ No Content  │ DELETE réussi                  │
└──────┴─────────────┴────────────────────────────────┘

4xx - ERREURS CLIENT ❌
┌──────┬─────────────────┬──────────────────────────────┐
│ Code │ Nom             │ Utilisation                  │
├──────┼─────────────────┼──────────────────────────────┤
│ 400  │ Bad Request     │ Données invalides            │
│      │                 │ - Email déjà utilisé         │
│      │                 │ - Validation échouée         │
├──────┼─────────────────┼──────────────────────────────┤
│ 401  │ Unauthorized    │ Authentification requise     │
│      │                 │ - Pas de token               │
│      │                 │ - Token invalide/expiré      │
│      │                 │ - Mauvais credentials        │
├──────┼─────────────────┼──────────────────────────────┤
│ 403  │ Forbidden       │ Pas les permissions          │
│      │                 │ - Token valide mais pas       │
│      │                 │   autorisé pour cette action │
├──────┼─────────────────┼──────────────────────────────┤
│ 404  │ Not Found       │ Ressource introuvable        │
│      │                 │ - User/Course n'existe pas   │
└──────┴─────────────────┴──────────────────────────────┘

5xx - ERREURS SERVEUR 💥
┌──────┬─────────────────┬──────────────────────────────┐
│ Code │ Nom             │ Utilisation                  │
├──────┼─────────────────┼──────────────────────────────┤
│ 500  │ Server Error    │ Erreur interne               │
│      │                 │ - Erreur DB                  │
│      │                 │ - Exception non gérée        │
└──────┴─────────────────┴──────────────────────────────┘

EXEMPLES D'UTILISATION:

✅ Inscription réussie
res.status(201).json({ token, user });

❌ Email déjà utilisé
res.status(400).json({ message: 'Email déjà utilisé' });

❌ Pas de token
res.status(401).json({ message: 'Pas de token' });

❌ Cours introuvable
res.status(404).json({ message: 'Cours non trouvé' });

💥 Erreur serveur
res.status(500).json({ message: error.message });
```
----

##### 🔒 Sécurité - Bonnes Pratiques

```pgsql
┌─────────────────────────────────────────────────────────────────┐
│              SÉCURITÉ - CE QU'IL FAUT SAVOIR                     │
└─────────────────────────────────────────────────────────────────┘

✅ À FAIRE ABSOLUMENT

1️⃣ HASHER LES MOTS DE PASSE
┌────────────────────────────────────────┐
│ ❌ JAMAIS en clair                     │
│ password: "password123"  ⬅️ DANGER    │
│                                        │
│ ✅ Toujours hasher avec bcrypt         │
│ password: "$2a$10$N9qo..."  ⬅️ SÛRE   │
└────────────────────────────────────────┘

2️⃣ JWT_SECRET FORT
┌────────────────────────────────────────┐
│ ❌ Secrets faibles                     │
│ JWT_SECRET=secret                      │
│ JWT_SECRET=123456                      │
│                                        │
│ ✅ Secret complexe (32+ caractères)    │
│ JWT_SECRET=9k2$mP7@vL4#xR8qW3nZ1bC5    │
└────────────────────────────────────────┘

3️⃣ EXPIRATION DES TOKENS
┌────────────────────────────────────────┐
│ ✅ Toujours définir une expiration     │
│ jwt.sign({...}, secret, {              │
│   expiresIn: '7d'  ⬅️ 7 jours max     │
│ });                                    │
└────────────────────────────────────────┘

4️⃣ VALIDATION DES ENTRÉES
┌────────────────────────────────────────┐
│ ✅ Valider côté serveur                │
│ - Email valide (regex)                 │
│ - Password ≥ 6 caractères              │
│ - Username pas vide                    │
└────────────────────────────────────────┘

5️⃣ NE PAS EXPOSER LE PASSWORD
┌────────────────────────────────────────┐
│ ❌ Retourner le password               │
│ res.json(user)  ⬅️ inclut password    │
│                                        │
│ ✅ Exclure le password                 │
│ user.select('-password')               │
│ // ou                                  │
│ res.json({                             │
│   id: user._id,                        │
│   username: user.username,             │
│   email: user.email                    │
│   // pas de password                   │
│ });                                    │
└────────────────────────────────────────┘

6️⃣ MESSAGES D'ERREUR VAGUES
┌────────────────────────────────────────┐
│ ❌ Trop précis                         │
│ "Ce mot de passe est incorrect"        │
│ "Cet email n'existe pas"               │
│ ⬅️ Aide les attaquants                 │
│                                        │
│ ✅ Message générique                   │
│ "Email ou mot de passe incorrect"      │
│ ⬅️ Ne révèle pas ce qui est faux       │
└────────────────────────────────────────┘

7️⃣ HTTPS EN PRODUCTION
┌────────────────────────────────────────┐
│ ⚠️  HTTP  → Tokens visibles en clair   │
│ ✅ HTTPS → Tokens chiffrés en transit  │
└────────────────────────────────────────┘

❌ À NE JAMAIS FAIRE

1. Stocker des mots de passe en clair
2. Utiliser un JWT_SECRET simple
3. Créer des tokens sans expiration
4. Stocker des données sensibles dans le JWT
   (numéro de carte, SSN, etc.)
5. Commit le fichier .env dans Git
6. Faire confiance aux données du client
   sans validation
```

--------

## 🧪 Tests avec Postman/Thunder Client

*Tester l'Authentification*

**1️⃣ Register -- Inscription**
*Méthode*: POST

*Route*: `/api/auth/register`

*url*: http://localhost:5000/api/auth/register

*Body*: raw, JSON

*Headers*: Content-Type: application/json

*Description*: Inscription d'un nouvel utilisateur
```json
{
  "username": "user2",
  "email": "user2@example.com",
  "password": "12345678"
}
```
![result](images/register.png)

**2️⃣ Login -- Connexion**
*Méthode*: POST
*Route*: `/api/auth/login`
*url*: http://localhost:5000/api/auth/login
*Body*: raw, JSON

*Headers*: Content-Type: application/json

*Description*: Connexion d'un utilisateur existant
```json
{
  "email": "user1@example.com",
  "password": "12345678"
}
```
![result](images/login.png)

sans token
**3️⃣ Accéder à une route protégée -- Profil utilisateur**

*Méthode*: GET -- "sans Headers"

*url*: http://localhost:5000/api/users/profile

*Description*: Récupérer le profil de l'utilisateur connecté sans token

![result](images/sans_token.png)

**4️⃣ Accéder à une route protégée -- Profil utilisateur**

*Méthode*: GET

*url*: http://localhost:5000/api/users/profile

*Headers*: Authorization: Bearer <token>

*Description*: Récupérer le profil de l'utilisateur connecté avec token

![result](images/avec_token.png)

---
## 📋 Récapitulatif - Points Clés

*Relations de Données*

```pgsql
┌────────────────────────────────────────────────────────────┐
│ TYPE         │ EXEMPLE          │ RÉFÉRENCE STOCKÉE OÙ?   │
├──────────────┼──────────────────┼─────────────────────────┤
│ One-to-One   │ User ↔ Profile   │ Côté optionnel          │
│ (1:1)        │                  │ (Profile.user)          │
├──────────────┼──────────────────┼─────────────────────────┤
│ One-to-Many  │ Course → Reviews │ Côté "Many"             │
│ (1:N)        │                  │ (Review.course)         │
├──────────────┼──────────────────┼─────────────────────────┤
│ Many-to-Many │ User ↔ Course    │ Double référence        │
│ (N:M)        │                  │ (User.courses +         │
│              │                  │  Course.students)       │
└────────────────────────────────────────────────────────────┘
```

*Mongoose*

```pgsql
┌────────────────────────────────────────────────────────────┐
│ CONCEPT         │ UTILISATION                             │
├─────────────────┼─────────────────────────────────────────┤
│ ref             │ Définir une relation                    │
│                 │ ref: 'ModelName'                        │
├─────────────────┼─────────────────────────────────────────┤
│ populate()      │ Récupérer les docs complets             │
│                 │ .populate('field', 'select')            │
├─────────────────┼─────────────────────────────────────────┤
│ ObjectId        │ Type pour les références                │
│                 │ mongoose.Schema.Types.ObjectId          │
└────────────────────────────────────────────────────────────┘
```

*Authentification JWT*

```psql
┌────────────────────────────────────────────────────────────┐
│ ÉTAPE           │ ACTION                                  │
├─────────────────┼─────────────────────────────────────────┤
│ Register        │ 1. Vérifier email unique                │
│                 │ 2. Hasher password (bcrypt)             │
│                 │ 3. Créer user                           │
│                 │ 4. Générer JWT                          │
├─────────────────┼─────────────────────────────────────────┤
│ Login           │ 1. Trouver user (email)                 │
│                 │ 2. Comparer password (bcrypt.compare)   │
│                 │ 3. Générer JWT                          │
├─────────────────┼─────────────────────────────────────────┤
│ Route protégée  │ 1. Middleware vérifie token             │
│                 │ 2. Decode JWT → req.userId              │
│                 │ 3. Contrôleur utilise req.userId        │
└────────────────────────────────────────────────────────────┘
```

---

## 📚 Ressources supplémentaires

-  Documentation Mongoose - Populate
-  MongoDB - Relations de données
-  JWT.io - Déboguer les tokens
-  bcrypt - Documentation npm
-  RESTful API Design

---

## 🎓 Conclusion du TP
Ce que vous avez appris
Ce travail pratique vous a permis de maîtriser les concepts fondamentaux d'une application MERN moderne et sécurisée :

**🗄️ Modélisation de Données Avancée**

Vous savez maintenant concevoir et implémenter les trois types de relations essentielles en MongoDB :

* One-to-One pour des données liées exclusivement (User ↔ Profile)
* One-to-Many pour des hiérarchies naturelles (Course → Reviews)
* Many-to-Many pour des associations complexes (User ↔ Course)

**🔐 Sécurité et Authentification**

Vous maîtrisez les bonnes pratiques de sécurité web :

* Hashage sécurisé des mots de passe avec bcrypt
* Génération et validation de tokens JWT
* Protection des routes sensibles avec middleware
* Gestion des sessions utilisateur côté client et serveur

**🔗 API RESTful Professionnelle**

Vous pouvez désormais construire des APIs complètes :

* Routes CRUD pour toutes les ressources
* Routes imbriquées (nested) pour refléter les relations
* Codes HTTP appropriés pour chaque situation
* Gestion d'erreurs robuste et messages clairs
* 
---

## 👩‍💻 Étudiante

Nom : *Samah SAIDI*

Projet réalisé dans le cadre du cours MERN - Polytech
----

## 📝 Professeur

Mr.Abdelwaheb Gueddess

---

## 📄 License
Ce projet est sous licence MIT.
