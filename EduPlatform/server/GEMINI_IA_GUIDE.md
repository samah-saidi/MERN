# 🤖 Guide Complet - Intégration Gemini IA

## 📋 Table des Matières

- [Vue d'Ensemble](#-vue-densemble)
- [Architecture Technique](#-architecture-technique)
- [Configuration](#-configuration)
- [Endpoints API Détaillés](#-endpoints-api-détaillés)
- [Exemples d'Utilisation](#-exemples-dutilisation)
- [Gestion des Erreurs](#-gestion-des-erreurs)
- [Sécurité et Bonnes Pratiques](#-sécurité-et-bonnes-pratiques)
- [Performance et Optimisation](#-performance-et-optimisation)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Vue d'Ensemble

### Qu'est-ce que Gemini IA ?

**Gemini** est l'API d'intelligence artificielle générative de Google, utilisée dans EduPlatform pour enrichir l'expérience utilisateur avec des fonctionnalités intelligentes :

- ✅ **Analyse de Reviews** : Génération automatique de rapports d'analyse de sentiment
- ✅ **Génération de Contenu** : Descriptions de cours attractives et professionnelles
- ✅ **Recommandations** : Suggestions de cours similaires basées sur le contenu
- ✅ **Biographies** : Création de bios professionnelles personnalisées
- ✅ **Insights Plateforme** : Analyse globale pour les administrateurs

### Modèle Utilisé

```javascript
Model: gemini-2.5-flash
- Rapide et efficace
- Gratuit jusqu'à 1500 requêtes/jour
- Réponses en 2-10 secondes
```

---

## 🏗️ Architecture Technique

### Structure des Fichiers

```
server/
├── config/
│   └── gemini.js              # Configuration et initialisation de Gemini
├── controllers/
│   └── aiController.js        # 5 contrôleurs IA
├── routes/
│   └── aiRoutes.js            # Routes API IA
└── middleware/
    └── authMiddleware.js      # Protection des routes
```

### Flux de Données

```mermaid
graph LR
    A[Client] -->|Requête HTTP| B[Route IA]
    B -->|Authentification| C{Middleware}
    C -->|✓ Token valide| D[Contrôleur IA]
    C -->|✗ Non autorisé| E[401 Error]
    D -->|Récupère données| F[MongoDB]
    D -->|Envoie prompt| G[Gemini API]
    G -->|Réponse IA| D
    D -->|JSON formaté| A
```

### Modèles de Données Utilisés

| Modèle | Champs Utilisés | Utilisation |
|--------|----------------|-------------|
| **Course** | `_id`, `title`, `description`, `instructor` | Analyse, recommandations |
| **Review** | `course`, `rating`, `comment`, `user` | Analyse de sentiment |
| **User** | `username` | Référence dans les reviews |

---

## ⚙️ Configuration

### 1. Installation des Dépendances

```bash
cd server
npm install @google/generative-ai
```

### 2. Obtenir une Clé API Gemini

1. Visitez [Google AI Studio](https://ai.google.dev/)
2. Connectez-vous avec votre compte Google
3. Cliquez sur **"Get API Key"**
4. Créez un nouveau projet ou sélectionnez-en un existant
5. Copiez votre clé API

### 3. Configuration des Variables d'Environnement

**Fichier `.env`** (à la racine de `/server`)

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/eduplatform

# JWT
JWT_SECRET=votre_secret_jwt_super_securise

# Gemini IA
GEMINI_API_KEY=AIzaSy...votre_clé_api_ici

# Server
PORT=3000
```

> ⚠️ **Important** : Ne jamais commiter le fichier `.env` dans Git !

### 4. Fichier de Configuration Gemini

**`server/config/gemini.js`**

```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialisation avec la clé API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Fonction pour obtenir le modèle
const getModel = () => {
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });
};

module.exports = { getModel };
```

### 5. Enregistrement des Routes

**`server/server.js`**

```javascript
const aiRoutes = require('./routes/aiRoutes');

// Après les autres routes
app.use('/api/ai', aiRoutes);
```

---

## 🛣️ Endpoints API Détaillés

### 1. Analyser les Reviews d'un Cours

**Endpoint** : `POST /api/ai/analyze-reviews/:courseId`  
**Authentification** : ✅ Requise (JWT Token)  
**Rôle** : Tous les utilisateurs authentifiés

#### Paramètres

| Type | Nom | Description | Requis |
|------|-----|-------------|--------|
| URL Param | `courseId` | ID MongoDB du cours | ✅ |

#### Réponse Succès (200)

```json
{
  "success": true,
  "data": {
    "courseTitle": "Introduction to React",
    "reviewCount": 15,
    "analysis": "## Sentiment Général\nPositif - Les étudiants apprécient...\n\n## Note Moyenne Calculée\n4.3/5\n\n## Points Forts (Top 3)\n1. Explications claires et détaillées\n2. Projets pratiques pertinents\n3. Support réactif de l'instructeur\n\n## Points d'Amélioration (Top 3)\n1. Ajouter plus d'exercices avancés\n2. Améliorer la qualité audio de certaines vidéos\n3. Inclure des quiz intermédiaires\n\n## Recommandations pour l'Instructeur\n- Créer une section bonus sur les hooks avancés\n- Ajouter des sous-titres en français\n- Organiser des sessions Q&A mensuelles\n\n## Résumé en une phrase\nUn cours très apprécié avec des bases solides, qui gagnerait à approfondir certains concepts avancés."
  }
}
```

#### Erreurs Possibles

| Code | Message | Cause |
|------|---------|-------|
| 401 | "Non autorisé" | Token JWT manquant ou invalide |
| 404 | "Cours non trouvé" | `courseId` invalide |
| 400 | "Aucune review disponible" | Le cours n'a pas encore de reviews |
| 500 | "Erreur lors de l'analyse" | Problème avec l'API Gemini |

---

### 2. Générer une Description de Cours

**Endpoint** : `POST /api/ai/generate-description`  
**Authentification** : ✅ Requise (JWT Token)  
**Rôle** : Instructeurs et Admins

#### Body (JSON)

```json
{
  "title": "Développement Web Full-Stack avec MERN",
  "instructor": "Dr. Marie Dupont",
  "keywords": ["MongoDB", "Express", "React", "Node.js", "JavaScript"]
}
```

#### Paramètres

| Champ | Type | Description | Requis |
|-------|------|-------------|--------|
| `title` | String | Titre du cours | ✅ |
| `instructor` | String | Nom de l'instructeur | ✅ |
| `keywords` | Array | Mots-clés du cours | ❌ |

#### Réponse Succès (200)

```json
{
  "success": true,
  "data": {
    "description": "Plongez dans l'univers du développement web moderne avec ce cours complet sur la stack MERN. Sous la direction experte de Dr. Marie Dupont, vous maîtriserez MongoDB pour la gestion de bases de données NoSQL, Express.js pour créer des APIs robustes, React pour construire des interfaces utilisateur dynamiques, et Node.js pour le backend performant.\n\nCe cours vous permettra de développer des applications web complètes de A à Z, en suivant les meilleures pratiques de l'industrie. Vous apprendrez à créer des applications scalables, sécurisées et optimisées pour la production.\n\nRejoignez des milliers d'étudiants qui ont transformé leur carrière grâce à cette formation pratique et complète. Inscrivez-vous dès maintenant et commencez votre voyage vers le développement full-stack !"
  }
}
```

---

### 3. Suggérer des Cours Similaires

**Endpoint** : `POST /api/ai/similar-courses/:courseId`  
**Authentification** : ❌ Publique  
**Rôle** : Tous

#### Paramètres

| Type | Nom | Description | Requis |
|------|-----|-------------|--------|
| URL Param | `courseId` | ID du cours de référence | ✅ |

#### Réponse Succès (200)

```json
{
  "success": true,
  "data": {
    "referenceCourse": "Introduction to React",
    "suggestions": "1. Cours #3 - Advanced React Patterns\nCe cours est une suite logique car il approfondit les concepts de React avec les hooks avancés, le Context API et les patterns de composition que vous avez découverts dans l'introduction.\n\n2. Cours #7 - JavaScript ES6+ Masterclass\nComprendre JavaScript moderne est essentiel pour maîtriser React. Ce cours couvre les fonctionnalités ES6+ utilisées quotidiennement dans React (arrow functions, destructuring, spread operator).\n\n3. Cours #12 - Building Full-Stack Apps with MERN\nCe cours combine React avec Node.js, Express et MongoDB, vous permettant de créer des applications complètes en utilisant vos compétences React dans un contexte full-stack.",
    "availableCourses": [
      { "id": "507f1f77bcf86cd799439011", "title": "Advanced React Patterns" },
      { "id": "507f1f77bcf86cd799439012", "title": "JavaScript ES6+ Masterclass" },
      { "id": "507f1f77bcf86cd799439013", "title": "Building Full-Stack Apps with MERN" }
    ]
  }
}
```

---

### 4. Générer une Biographie Professionnelle

**Endpoint** : `POST /api/ai/generate-bio`  
**Authentification** : ✅ Requise (JWT Token)  
**Rôle** : Tous les utilisateurs authentifiés

#### Body (JSON)

```json
{
  "interests": "Développement web, Intelligence artificielle, Cloud computing",
  "experience": "5 ans en tant que développeur full-stack chez TechCorp",
  "goals": "Devenir architecte logiciel et contribuer à des projets open-source"
}
```

#### Paramètres

| Champ | Type | Description | Requis |
|-------|------|-------------|--------|
| `interests` | String | Centres d'intérêt professionnels | ✅ |
| `experience` | String | Expérience professionnelle | ✅ |
| `goals` | String | Objectifs de carrière | ❌ |

#### Réponse Succès (200)

```json
{
  "success": true,
  "data": {
    "bio": "Passionné par le développement web et l'innovation technologique, je cumule 5 ans d'expérience en tant que développeur full-stack chez TechCorp, où j'ai contribué à la création d'applications web scalables. Mon expertise s'étend au cloud computing et à l'intelligence artificielle, domaines dans lesquels je continue de me perfectionner. Mon objectif est de devenir architecte logiciel tout en partageant mes connaissances à travers des contributions open-source significatives."
  }
}
```

---

### 5. Obtenir les Insights de la Plateforme

**Endpoint** : `GET /api/ai/platform-insights`  
**Authentification** : ✅ Requise (JWT Token)  
**Rôle** : Administrateurs uniquement

#### Réponse Succès (200)

```json
{
  "success": true,
  "data": {
    "stats": {
      "totalCourses": 25,
      "totalReviews": 150,
      "averageRating": "4.32"
    },
    "insights": "## Santé Générale de la Plateforme\nLa plateforme affiche une excellente santé avec une note moyenne de 4.32/5 et un engagement élevé (150 reviews pour 25 cours, soit 6 reviews par cours en moyenne).\n\n## Tendances Observées\n1. Les cours de développement web (React, Node.js) génèrent le plus d'engagement\n2. Les étudiants apprécient particulièrement les projets pratiques\n3. Demande croissante pour des cours sur l'IA et le machine learning\n\n## Cours Populaires\n- \"Introduction to React\" : 15 reviews (note moyenne 4.5/5)\n- \"Python for Data Science\" : 12 reviews (note moyenne 4.7/5)\n- \"Full-Stack Development\" : 10 reviews (note moyenne 4.2/5)\n\n## Recommandations Stratégiques\n1. Développer davantage de cours sur l'IA et le machine learning pour répondre à la demande\n2. Encourager les instructeurs à ajouter plus de projets pratiques dans tous les cours\n3. Mettre en place un système de badges pour récompenser les étudiants actifs et augmenter l'engagement"
  }
}
```

---

## 💡 Exemples d'Utilisation

### Avec cURL

```bash
# 1. Analyser les reviews
curl -X POST http://localhost:3000/api/ai/analyze-reviews/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 2. Générer une description
curl -X POST http://localhost:3000/api/ai/generate-description \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Node.js Masterclass",
    "instructor": "John Doe",
    "keywords": ["Node.js", "Express", "MongoDB"]
  }'

# 3. Cours similaires (public)
curl -X POST http://localhost:3000/api/ai/similar-courses/507f1f77bcf86cd799439011

# 4. Générer une bio
curl -X POST http://localhost:3000/api/ai/generate-bio \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "interests": "Web dev, AI",
    "experience": "3 ans développeur",
    "goals": "Tech lead"
  }'

# 5. Insights plateforme
curl -X GET http://localhost:3000/api/ai/platform-insights \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Avec JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// 1. Analyser les reviews
const analyzeReviews = async (courseId) => {
  try {
    const { data } = await api.post(`/ai/analyze-reviews/${courseId}`);
    console.log('Analyse:', data.data.analysis);
  } catch (error) {
    console.error('Erreur:', error.response?.data?.message);
  }
};

// 2. Générer une description
const generateDescription = async (courseData) => {
  try {
    const { data } = await api.post('/ai/generate-description', courseData);
    return data.data.description;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

// 3. Suggestions de cours (pas besoin de token)
const getSimilarCourses = async (courseId) => {
  try {
    const { data } = await axios.post(
      `http://localhost:3000/api/ai/similar-courses/${courseId}`
    );
    return data.data.suggestions;
  } catch (error) {
    console.error(error);
  }
};

// 4. Générer une bio
const generateBio = async (bioData) => {
  try {
    const { data } = await api.post('/ai/generate-bio', bioData);
    return data.data.bio;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

// 5. Insights plateforme
const getPlatformInsights = async () => {
  try {
    const { data } = await api.get('/ai/platform-insights');
    console.log('Stats:', data.data.stats);
    console.log('Insights:', data.data.insights);
  } catch (error) {
    console.error(error);
  }
};
```

---

## ⚠️ Gestion des Erreurs

### Structure Standard des Erreurs

```json
{
  "message": "Description de l'erreur",
  "error": "Détails techniques (en développement uniquement)"
}
```

### Codes d'Erreur et Solutions

| Code | Erreur | Cause Probable | Solution |
|------|--------|----------------|----------|
| **400** | "Aucune review disponible" | Le cours n'a pas de reviews | Ajouter des reviews au cours |
| **400** | "Titre et instructeur requis" | Champs manquants dans le body | Vérifier les données envoyées |
| **401** | "Non autorisé" | Token JWT invalide/manquant | Se reconnecter ou vérifier le token |
| **404** | "Cours non trouvé" | `courseId` invalide | Vérifier l'ID du cours |
| **500** | "Erreur lors de l'analyse" | Problème API Gemini | Vérifier la clé API et la connexion |

### Gestion dans le Code

```javascript
// Exemple de gestion d'erreur côté client
const handleAIRequest = async (requestFn) => {
  try {
    const result = await requestFn();
    return { success: true, data: result };
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    
    switch (status) {
      case 400:
        return { success: false, error: 'Données invalides', message };
      case 401:
        // Rediriger vers login
        window.location.href = '/login';
        break;
      case 404:
        return { success: false, error: 'Ressource non trouvée', message };
      case 500:
        return { success: false, error: 'Erreur serveur', message };
      default:
        return { success: false, error: 'Erreur inconnue', message };
    }
  }
};
```

---

## 🔒 Sécurité et Bonnes Pratiques

### Protection des Routes

```javascript
// Toutes les routes sauf "similar-courses" sont protégées
router.post('/analyze-reviews/:courseId', protect, analyzeReviews);
router.post('/generate-description', protect, generateCourseDescription);
router.post('/generate-bio', protect, generateBio);
router.get('/platform-insights', protect, getPlatformInsights);

// Route publique
router.post('/similar-courses/:courseId', suggestSimilarCourses);
```

### Checklist de Sécurité

- ✅ **Clé API** : Stockée dans `.env`, jamais exposée côté client
- ✅ **Authentification** : JWT token requis pour les routes sensibles
- ✅ **Validation** : Vérification des champs requis avant traitement
- ✅ **Rate Limiting** : À implémenter pour éviter les abus
- ✅ **Sanitization** : Nettoyage des inputs utilisateur
- ✅ **HTTPS** : Utiliser en production pour chiffrer les communications

### À NE JAMAIS FAIRE

❌ Exposer la clé API Gemini dans le code frontend  
❌ Commiter le fichier `.env` dans Git  
❌ Faire confiance aux données utilisateur sans validation  
❌ Retourner des erreurs détaillées en production  
❌ Stocker des tokens JWT dans localStorage sans précautions  

---

## ⚡ Performance et Optimisation

### Temps de Réponse Moyens

| Endpoint | Temps Moyen | Facteurs |
|----------|-------------|----------|
| `analyze-reviews` | 3-8s | Nombre de reviews |
| `generate-description` | 2-4s | Longueur des keywords |
| `similar-courses` | 4-10s | Nombre de cours total |
| `generate-bio` | 2-3s | Stable |
| `platform-insights` | 5-12s | Volume de données |

### Optimisations Recommandées

#### 1. Mise en Cache

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 }); // 1 heure

exports.analyzeReviews = async (req, res) => {
  const { courseId } = req.params;
  const cacheKey = `analysis_${courseId}`;
  
  // Vérifier le cache
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json({ success: true, data: cached, cached: true });
  }
  
  // Générer et mettre en cache
  const analysis = await generateAnalysis(courseId);
  cache.set(cacheKey, analysis);
  
  res.json({ success: true, data: analysis });
};
```

#### 2. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requêtes max
  message: 'Trop de requêtes IA, réessayez dans 15 minutes'
});

router.post('/analyze-reviews/:courseId', protect, aiLimiter, analyzeReviews);
```

#### 3. Requêtes Asynchrones

```javascript
// Mauvais : Séquentiel
const course = await Course.findById(courseId);
const reviews = await Review.find({ course: courseId });

// Bon : Parallèle
const [course, reviews] = await Promise.all([
  Course.findById(courseId),
  Review.find({ course: courseId }).populate('user', 'username')
]);
```

---

## 🔧 Troubleshooting

### Problème : "GEMINI_API_KEY is not defined"

**Cause** : La clé API n'est pas chargée depuis `.env`

**Solution** :
```bash
# Vérifier que dotenv est installé
npm install dotenv

# Vérifier que server.js charge dotenv
require('dotenv').config();

# Vérifier le fichier .env
cat .env | grep GEMINI_API_KEY
```

---

### Problème : "Model not found: gemini-2.5-flash"

**Cause** : Le modèle spécifié n'existe pas ou a changé de nom

**Solution** :
```javascript
// Dans config/gemini.js, essayer un autre modèle
const getModel = () => {
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash" // ou "gemini-pro"
  });
};
```

---

### Problème : Réponses lentes (>15 secondes)

**Cause** : Trop de données envoyées à Gemini

**Solution** :
```javascript
// Limiter le nombre de reviews analysées
const reviews = await Review.find({ course: courseId })
  .limit(50) // Maximum 50 reviews
  .sort({ createdAt: -1 }); // Les plus récentes
```

---

### Problème : "Rate limit exceeded"

**Cause** : Trop de requêtes à l'API Gemini

**Solution** :
- Implémenter un système de cache
- Réduire la fréquence des appels
- Passer à un plan payant si nécessaire

---

### Problème : Réponses incohérentes de Gemini

**Cause** : Prompts mal structurés

**Solution** :
```javascript
// Améliorer la structure du prompt
const prompt = `
Tu es un expert en analyse de feedback éducatif.

CONTEXTE :
Cours : "${course.title}"
Nombre de reviews : ${reviews.length}

DONNÉES :
${reviewsText}

TÂCHE :
Génère un rapport structuré avec EXACTEMENT ces sections :
## Sentiment Général
## Note Moyenne
## Points Forts (Top 3)
## Points d'Amélioration (Top 3)
## Recommandations

IMPORTANT : Sois concis et factuel.
`;
```

---

## 📊 Monitoring et Logs

### Logs Recommandés

```javascript
// Dans aiController.js
console.log(`[AI] Analyse demandée pour le cours ${courseId}`);
console.log(`[AI] ${reviews.length} reviews trouvées`);
console.log(`[AI] Prompt envoyé (${prompt.length} caractères)`);
console.log(`[AI] Réponse reçue en ${responseTime}ms`);
```

### Métriques à Suivre

- Nombre de requêtes IA par jour
- Temps de réponse moyen par endpoint
- Taux d'erreur (%)
- Utilisation de la clé API (quota)
- Cache hit rate (%)

---

## 📚 Ressources Complémentaires

- [Documentation Officielle Gemini](https://ai.google.dev/docs)
- [Guide des Prompts](https://developers.google.com/machine-learning/resources/prompt-eng)
- [API Reference Gemini](https://ai.google.dev/api)
- [Meilleures Pratiques IA](https://ai.google.dev/docs/best_practices)
- [Limites et Quotas](https://ai.google.dev/pricing)

---

## 🎓 Exercices Pratiques

1. **Niveau Débutant** : Ajouter des logs détaillés dans chaque contrôleur
2. **Niveau Intermédiaire** : Implémenter un système de cache avec Redis
3. **Niveau Avancé** : Créer un endpoint pour générer des quiz à partir d'une description de cours
4. **Niveau Expert** : Développer un chatbot IA pour répondre aux questions sur les cours

---

**Dernière mise à jour** : Décembre 2025  
**Version** : 1.0.0  
**Auteur** : EduPlatform Team
