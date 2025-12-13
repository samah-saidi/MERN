# Backend - Intégration IA avec Gemini API

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [Routes API](#routes-api)
- [Contrôleurs](#contrôleurs)
- [Utilisation](#utilisation)
- [Tests](#tests)
- [Gestion des erreurs](#gestion-des-erreurs)
- [Limites et considérations](#limites-et-considérations)

## 🎯 Vue d'ensemble

Cette partie du backend ajoute des fonctionnalités d'intelligence artificielle à l'application EduPlatform en utilisant l'API Google Gemini. Elle permet de :

- ✅ Analyser automatiquement les avis (reviews) des cours
- ✅ Générer des descriptions de cours attractives
- ✅ Suggérer des cours similaires
- ✅ Créer des biographies professionnelles
- ✅ Obtenir des insights sur la plateforme

## 📦 Prérequis

- Node.js (v14 ou supérieur)
- MongoDB en cours d'exécution
- Clé API Google Gemini (gratuite sur [https://ai.google.dev/](https://ai.google.dev/))
- Application EduPlatform de base fonctionnelle (User, Profile, Course, Review)

## 🚀 Installation

### 1. Installer la dépendance Gemini

```bash
cd server
npm install @google/generative-ai
```

### 2. Structure des fichiers à créer

```
server/
├── config/
│   └── gemini.js          # Configuration Gemini
├── controllers/
│   └── aiController.js    # Contrôleurs IA
├── routes/
│   └── aiRoutes.js        # Routes IA
└── server.js              # (Modifier)
```

## ⚙️ Configuration

### 1. Créer le fichier de configuration Gemini

**`server/config/gemini.js`**

```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getModel = () => {
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
  });
};

module.exports = { getModel };
```

### 2. Configurer les variables d'environnement

**`server/.env`**

```env
# Ajouter cette ligne
GEMINI_API_KEY=votre_clé_api_gemini_ici
```

> 🔑 **Obtenir votre clé API** : Rendez-vous sur [https://ai.google.dev/](https://ai.google.dev/) et créez une clé API gratuite.

### 3. Enregistrer les routes dans server.js

**`server/server.js`**

```javascript
// Importer les routes IA
const aiRoutes = require('./routes/aiRoutes');

// Après les autres routes (courses, reviews, etc.)
app.use('/api/ai', aiRoutes);
```

## 🏗️ Architecture

### Modèles de données utilisés

L'intégration IA s'appuie sur les modèles existants :

- **Course** : Contient les informations des cours (title, description, instructor)
- **Review** : Contient les avis des étudiants (rating, comment, user)
- **User** : Référencé dans les reviews

### Flux de données

```
Client → Route IA → Contrôleur IA → Gemini API
                        ↓
                   Base de données (Course, Review)
                        ↓
                   Réponse formatée → Client
```

## 🛣️ Routes API

### Routes protégées (authentification requise)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/ai/analyze-reviews/:courseId` | Analyse les reviews d'un cours |
| POST | `/api/ai/generate-description` | Génère une description de cours |
| POST | `/api/ai/generate-bio` | Génère une bio professionnelle |
| GET | `/api/ai/platform-insights` | Obtient les insights de la plateforme |

### Routes publiques

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/ai/similar-courses/:courseId` | Suggère des cours similaires |

## 🎮 Contrôleurs

### 1. analyzeReviews

Génère un rapport d'analyse des avis d'un cours.

**Endpoint** : `POST /api/ai/analyze-reviews/:courseId`

**Paramètres** :
- `courseId` (URL param) : ID du cours à analyser

**Réponse** :
```json
{
  "success": true,
  "data": {
    "courseTitle": "Introduction to React",
    "reviewCount": 15,
    "analysis": "## Sentiment Général\n[Analyse]..."
  }
}
```

**Fonctionnalités** :
- Récupère toutes les reviews du cours
- Calcule la note moyenne
- Envoie les données à Gemini pour analyse
- Retourne un rapport structuré avec :
  - Sentiment général (Positif/Négatif/Neutre)
  - Note moyenne
  - Points forts (Top 3)
  - Points d'amélioration (Top 3)
  - Recommandations pour l'instructeur

### 2. generateCourseDescription

Génère une description attractive pour un cours.

**Endpoint** : `POST /api/ai/generate-description`

**Body** :
```json
{
  "title": "Développement Web avec React",
  "instructor": "Dr. Marie Dupont",
  "keywords": ["React", "JavaScript", "Frontend"]
}
```

**Réponse** :
```json
{
  "success": true,
  "data": {
    "description": "Plongez dans l'univers du développement web moderne..."
  }
}
```

### 3. suggestSimilarCourses

Recommande des cours similaires basés sur le contenu.

**Endpoint** : `POST /api/ai/similar-courses/:courseId`

**Paramètres** :
- `courseId` (URL param) : ID du cours de référence

**Réponse** :
```json
{
  "success": true,
  "data": {
    "referenceCourse": "Introduction to React",
    "suggestions": "1. Advanced React Patterns - ...\n2. ...",
    "availableCourses": [
      { "id": "123", "title": "Advanced React" }
    ]
  }
}
```

### 4. generateBio

Génère une biographie professionnelle pour un utilisateur.

**Endpoint** : `POST /api/ai/generate-bio`

**Body** :
```json
{
  "interests": "Web development, AI, Cloud computing",
  "experience": "5 ans en tant que développeur full-stack",
  "goals": "Devenir architecte logiciel"
}
```

**Réponse** :
```json
{
  "success": true,
  "data": {
    "bio": "Passionné par le développement web depuis 5 ans..."
  }
}
```

### 5. getPlatformInsights

Génère des insights sur l'ensemble de la plateforme (Admin uniquement).

**Endpoint** : `GET /api/ai/platform-insights`

**Réponse** :
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalCourses": 25,
      "totalReviews": 150,
      "averageRating": "4.32"
    },
    "insights": "## Santé Générale de la Plateforme\n..."
  }
}
```

## 💡 Utilisation

### Exemple avec cURL

```bash
# Analyser les reviews d'un cours
curl -X POST http://localhost:3000/api/ai/analyze-reviews/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Générer une description de cours
curl -X POST http://localhost:3000/api/ai/generate-description \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Node.js Masterclass",
    "instructor": "John Doe",
    "keywords": ["Node.js", "Express", "MongoDB"]
  }'
```

### Exemple avec Axios (Frontend)

```javascript
import api from '../api/axios';

// Analyser les reviews
const analyzeReviews = async (courseId) => {
  try {
    const response = await api.post(`/ai/analyze-reviews/${courseId}`);
    console.log(response.data);
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// Générer une description
const generateDescription = async () => {
  try {
    const response = await api.post('/ai/generate-description', {
      title: 'Python for Data Science',
      instructor: 'Dr. Smith',
      keywords: ['Python', 'Data Science', 'ML']
    });
    console.log(response.data.data.description);
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

## 🧪 Tests

### Test manuel avec Postman

1. **Importer la collection** (créer ces requêtes) :
   - POST Analyze Reviews
   - POST Generate Description
   - POST Similar Courses
   - POST Generate Bio
   - GET Platform Insights

2. **Configurer les variables** :
   - `baseUrl`: `http://localhost:3000/api`
   - `token`: Votre JWT token

3. **Tester chaque endpoint** avec des données variées

### Vérifications importantes

- ✅ Les reviews existent pour le cours testé
- ✅ Le token JWT est valide
- ✅ La clé API Gemini est correctement configurée
- ✅ Les réponses sont formatées correctement
- ✅ Les erreurs sont gérées proprement

## ⚠️ Gestion des erreurs

### Erreurs courantes

| Code | Message | Solution |
|------|---------|----------|
| 400 | "Aucune review disponible" | Ajouter des reviews au cours |
| 401 | "Non autorisé" | Vérifier le token JWT |
| 404 | "Cours non trouvé" | Vérifier l'ID du cours |
| 500 | "Erreur lors de l'analyse" | Vérifier la clé API Gemini |

### Structure des erreurs

```javascript
try {
  // Code de l'API
} catch (error) {
  console.error('Erreur analyse IA:', error);
  res.status(500).json({
    message: 'Erreur lors de l\'analyse',
    error: error.message
  });
}
```

## 🔒 Sécurité

### Bonnes pratiques implémentées

1. **Protection des routes** : Utilisation du middleware `protect` pour l'authentification
2. **Variables d'environnement** : Clé API stockée dans `.env`
3. **Validation des données** : Vérification des champs requis
4. **Gestion des erreurs** : Messages d'erreur appropriés sans exposer de détails sensibles

### À ne PAS faire

- ❌ Ne jamais exposer la clé API côté client
- ❌ Ne jamais commiter le fichier `.env`
- ❌ Ne jamais faire confiance aux données utilisateur sans validation

## 📊 Limites et considérations

### Limitations techniques

1. **Temps de réponse** : 2-10 secondes selon la complexité
2. **Rate limiting** : Respecter les limites de l'API Gemini
3. **Coûts** : Surveiller l'utilisation (gratuit jusqu'à un certain seuil)
4. **Qualité** : Dépend de la qualité des données d'entrée

### Optimisations possibles

- 🚀 Implémenter un cache pour les résultats similaires
- 🚀 Ajouter des files d'attente pour les requêtes volumineuses
- 🚀 Mettre en place un système de retry en cas d'échec
- 🚀 Ajouter des logs détaillés pour le monitoring

## 📝 Prompts utilisés

### Structure type d'un prompt efficace

```javascript
const prompt = `
Tu es un [rôle/expert].

[Contexte et données]
${data}

[Instructions spécifiques]
- Point 1
- Point 2

Format de réponse attendu :
## Section 1
[Contenu]

## Section 2
[Contenu]
`;
```

### Principes de bons prompts

1. **Définir le rôle** : "Tu es un expert en..."
2. **Fournir le contexte** : Données pertinentes
3. **Être spécifique** : Format de sortie détaillé
4. **Structurer** : Utiliser des sections claires
5. **Donner des exemples** : Si nécessaire

## 🔧 Debugging

### Logs utiles

```javascript
// Dans aiController.js
console.log('Nombre de reviews:', reviews.length);
console.log('Prompt envoyé à Gemini:', prompt);
console.log('Réponse de Gemini:', result.response.text());
```

### Vérifier la connexion à Gemini

```javascript
// Test simple
const testGemini = async () => {
  try {
    const model = getModel();
    const result = await model.generateContent('Hello, test!');
    console.log('Gemini répond:', result.response.text());
  } catch (error) {
    console.error('Erreur Gemini:', error);
  }
};
```

## 📚 Ressources

- [Documentation officielle Gemini](https://ai.google.dev/docs)
- [Guide des prompts](https://developers.google.com/machine-learning/resources/prompt-eng)
- [API Reference Gemini](https://ai.google.dev/api)
- [Meilleures pratiques IA](https://ai.google.dev/docs/best_practices)

## 🎓 Exercices pratiques

1. Ajouter une route pour générer des quiz à partir d'une description de cours
2. Implémenter un système de cache pour les analyses de reviews
3. Créer un chatbot simple pour répondre aux questions sur les cours
4. Ajouter des logs détaillés pour tracker l'utilisation de l'API

---
