# 📮 Guide Postman - Tests API Gemini IA

## 📋 Table des Matières

- [Configuration Initiale](#-configuration-initiale)
- [Collection Postman](#-collection-postman)
- [Tests par Endpoint](#-tests-par-endpoint)
- [Scénarios de Test](#-scénarios-de-test)
- [Automatisation des Tests](#-automatisation-des-tests)
- [Troubleshooting](#-troubleshooting)

---

## 🚀 Configuration Initiale

### 1. Installer Postman

Téléchargez Postman depuis [postman.com](https://www.postman.com/downloads/)

### 2. Créer un Environnement

1. Cliquez sur **Environments** (icône engrenage en haut à droite)
2. Cliquez sur **Create Environment**
3. Nommez-le `EduPlatform - Local`
4. Ajoutez les variables suivantes :

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `baseUrl` | `http://localhost:3000/api` | `http://localhost:3000/api` |
| `token` | *(vide au départ)* | *(sera rempli après login)* |
| `courseId` | `507f1f77bcf86cd799439011` | *(ID d'un cours test)* |
| `userId` | `507f1f77bcf86cd799439012` | *(ID d'un utilisateur test)* |

5. Cliquez sur **Save**

### 3. Obtenir un Token JWT

Avant de tester les endpoints IA, vous devez vous authentifier :

**Endpoint** : `POST {{baseUrl}}/auth/login`

**Body (JSON)** :
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Réponse** :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439012",
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

**Action** : Copiez le `token` et mettez-le dans la variable d'environnement `token`

---

## 📦 Collection Postman

### Créer la Collection

1. Cliquez sur **Collections** > **Create Collection**
2. Nommez-la `EduPlatform - Gemini IA`
3. Ajoutez une description :

```
Collection de tests pour les endpoints d'intelligence artificielle de EduPlatform.
Utilise l'API Google Gemini pour l'analyse de reviews, la génération de contenu, et les recommandations.
```

### Configuration de la Collection

1. Cliquez sur la collection > **Authorization**
2. Type : `Bearer Token`
3. Token : `{{token}}`

Cela appliquera automatiquement le token à toutes les requêtes de la collection.

---

## 🧪 Tests par Endpoint

### 1. Analyser les Reviews d'un Cours

#### Configuration de la Requête

- **Nom** : `Analyze Course Reviews`
- **Méthode** : `POST`
- **URL** : `{{baseUrl}}/ai/analyze-reviews/{{courseId}}`
- **Headers** :
  - `Authorization: Bearer {{token}}`

#### Tests Postman (onglet Tests)

```javascript
// Vérifier le statut de la réponse
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Vérifier la structure de la réponse
pm.test("Response has correct structure", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData).to.have.property('data');
    pm.expect(jsonData.data).to.have.property('courseTitle');
    pm.expect(jsonData.data).to.have.property('reviewCount');
    pm.expect(jsonData.data).to.have.property('analysis');
});

// Vérifier que l'analyse contient les sections attendues
pm.test("Analysis contains required sections", function () {
    var jsonData = pm.response.json();
    var analysis = jsonData.data.analysis;
    pm.expect(analysis).to.include('Sentiment Général');
    pm.expect(analysis).to.include('Points Forts');
    pm.expect(analysis).to.include('Points d\'Amélioration');
});

// Vérifier le temps de réponse
pm.test("Response time is less than 15 seconds", function () {
    pm.expect(pm.response.responseTime).to.be.below(15000);
});
```

#### Exemples de Réponses

**✅ Succès (200)** :
```json
{
  "success": true,
  "data": {
    "courseTitle": "Introduction to React",
    "reviewCount": 8,
    "analysis": "## Sentiment Général\nPositif - Les étudiants sont globalement satisfaits...\n\n## Note Moyenne Calculée\n4.25/5\n\n## Points Forts (Top 3)\n1. Explications claires et pédagogiques\n2. Projets pratiques bien conçus\n3. Bon rythme de progression\n\n## Points d'Amélioration (Top 3)\n1. Ajouter plus d'exercices intermédiaires\n2. Améliorer la qualité audio\n3. Créer une section FAQ\n\n## Recommandations pour l'Instructeur\n- Organiser des sessions live Q&A mensuelles\n- Créer des quiz après chaque section\n- Ajouter des ressources complémentaires\n\n## Résumé en une phrase\nUn cours très apprécié qui pose de solides bases en React, avec une marge d'amélioration sur les exercices pratiques."
  }
}
```

**❌ Erreur - Pas de reviews (400)** :
```json
{
  "message": "Aucune review disponible pour ce cours"
}
```

**❌ Erreur - Cours non trouvé (404)** :
```json
{
  "message": "Cours non trouvé"
}
```

---

### 2. Générer une Description de Cours

#### Configuration de la Requête

- **Nom** : `Generate Course Description`
- **Méthode** : `POST`
- **URL** : `{{baseUrl}}/ai/generate-description`
- **Headers** :
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`

#### Body (JSON)

```json
{
  "title": "Développement Web Full-Stack avec MERN",
  "instructor": "Dr. Marie Dupont",
  "keywords": ["MongoDB", "Express", "React", "Node.js", "JavaScript", "Full-Stack"]
}
```

#### Tests Postman

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response contains description", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data).to.have.property('description');
    pm.expect(jsonData.data.description.length).to.be.above(100);
});

pm.test("Description mentions course title", function () {
    var jsonData = pm.response.json();
    var description = jsonData.data.description.toLowerCase();
    pm.expect(description).to.include('mern');
});

pm.test("Response time is acceptable", function () {
    pm.expect(pm.response.responseTime).to.be.below(10000);
});
```

#### Exemples de Body Alternatifs

**Exemple 1 - Cours de Python** :
```json
{
  "title": "Python pour la Data Science",
  "instructor": "Prof. Jean Martin",
  "keywords": ["Python", "Pandas", "NumPy", "Matplotlib", "Machine Learning"]
}
```

**Exemple 2 - Cours de Design** :
```json
{
  "title": "UI/UX Design Masterclass",
  "instructor": "Sophie Dubois",
  "keywords": ["Figma", "Design Thinking", "Prototyping", "User Research"]
}
```

---

### 3. Suggérer des Cours Similaires

#### Configuration de la Requête

- **Nom** : `Suggest Similar Courses`
- **Méthode** : `POST`
- **URL** : `{{baseUrl}}/ai/similar-courses/{{courseId}}`
- **Headers** : *(Aucun - route publique)*

#### Tests Postman

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has suggestions", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data).to.have.property('suggestions');
    pm.expect(jsonData.data).to.have.property('referenceCourse');
    pm.expect(jsonData.data).to.have.property('availableCourses');
});

pm.test("Available courses is an array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.availableCourses).to.be.an('array');
});

pm.test("Response time is reasonable", function () {
    pm.expect(pm.response.responseTime).to.be.below(15000);
});
```

---

### 4. Générer une Biographie Professionnelle

#### Configuration de la Requête

- **Nom** : `Generate Professional Bio`
- **Méthode** : `POST`
- **URL** : `{{baseUrl}}/ai/generate-bio`
- **Headers** :
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`

#### Body (JSON)

```json
{
  "interests": "Développement web, Intelligence artificielle, Cloud computing",
  "experience": "5 ans en tant que développeur full-stack chez TechCorp, spécialisé en React et Node.js",
  "goals": "Devenir architecte logiciel et contribuer à des projets open-source majeurs"
}
```

#### Tests Postman

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Bio is generated", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data).to.have.property('bio');
    pm.expect(jsonData.data.bio.length).to.be.above(50);
});

pm.test("Bio mentions user interests", function () {
    var jsonData = pm.response.json();
    var bio = jsonData.data.bio.toLowerCase();
    pm.expect(bio).to.satisfy(function(text) {
        return text.includes('développement') || text.includes('intelligence artificielle');
    });
});
```

#### Exemples de Body Alternatifs

**Exemple 1 - Étudiant** :
```json
{
  "interests": "Machine Learning, Data Science, Python",
  "experience": "Étudiant en Master 2 Informatique, stage de 6 mois chez DataCorp",
  "goals": "Devenir Data Scientist dans une startup innovante"
}
```

**Exemple 2 - Designer** :
```json
{
  "interests": "UI/UX Design, Product Design, Design Systems",
  "experience": "3 ans en tant que Product Designer chez DesignStudio",
  "goals": "Créer ma propre agence de design et former la prochaine génération de designers"
}
```

---

### 5. Obtenir les Insights de la Plateforme

#### Configuration de la Requête

- **Nom** : `Get Platform Insights`
- **Méthode** : `GET`
- **URL** : `{{baseUrl}}/ai/platform-insights`
- **Headers** :
  - `Authorization: Bearer {{token}}`

#### Tests Postman

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has stats and insights", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data).to.have.property('stats');
    pm.expect(jsonData.data).to.have.property('insights');
});

pm.test("Stats contain required fields", function () {
    var jsonData = pm.response.json();
    var stats = jsonData.data.stats;
    pm.expect(stats).to.have.property('totalCourses');
    pm.expect(stats).to.have.property('totalReviews');
    pm.expect(stats).to.have.property('averageRating');
});

pm.test("Insights contain analysis sections", function () {
    var jsonData = pm.response.json();
    var insights = jsonData.data.insights;
    pm.expect(insights).to.include('Santé Générale');
    pm.expect(insights).to.include('Recommandations');
});

pm.test("Response time is acceptable", function () {
    pm.expect(pm.response.responseTime).to.be.below(20000);
});
```

---

## 🎯 Scénarios de Test

### Scénario 1 : Workflow Complet Instructeur

**Objectif** : Tester le parcours d'un instructeur créant un nouveau cours

1. **Login** : `POST /api/auth/login`
2. **Générer une description** : `POST /api/ai/generate-description`
3. **Créer le cours** : `POST /api/courses` (avec la description générée)
4. **Attendre des reviews** : *(Simuler ou créer manuellement)*
5. **Analyser les reviews** : `POST /api/ai/analyze-reviews/:courseId`

### Scénario 2 : Workflow Étudiant

**Objectif** : Tester le parcours d'un étudiant cherchant des cours

1. **Consulter un cours** : `GET /api/courses/:courseId`
2. **Obtenir des suggestions** : `POST /api/ai/similar-courses/:courseId`
3. **Créer une review** : `POST /api/reviews`
4. **Générer sa bio** : `POST /api/ai/generate-bio`

### Scénario 3 : Workflow Administrateur

**Objectif** : Tester les fonctionnalités admin

1. **Login admin** : `POST /api/auth/login`
2. **Obtenir les insights** : `GET /api/ai/platform-insights`
3. **Analyser plusieurs cours** : Boucle sur `POST /api/ai/analyze-reviews/:courseId`

---

## 🤖 Automatisation des Tests

### Collection Runner

1. Cliquez sur la collection `EduPlatform - Gemini IA`
2. Cliquez sur **Run**
3. Sélectionnez les requêtes à exécuter
4. Configurez :
   - **Iterations** : 1
   - **Delay** : 2000ms (pour éviter le rate limiting)
5. Cliquez sur **Run EduPlatform - Gemini IA**

### Tests en Ligne de Commande (Newman)

```bash
# Installer Newman
npm install -g newman

# Exporter votre collection depuis Postman
# File > Export > Collection v2.1

# Exporter votre environnement
# Environments > ... > Export

# Exécuter les tests
newman run EduPlatform-Gemini-IA.postman_collection.json \
  -e EduPlatform-Local.postman_environment.json \
  --delay-request 2000

# Générer un rapport HTML
newman run EduPlatform-Gemini-IA.postman_collection.json \
  -e EduPlatform-Local.postman_environment.json \
  -r html \
  --reporter-html-export report.html
```

### Script Pre-request Global

Pour automatiser l'obtention du token, ajoutez ce script dans **Collection > Pre-request Scripts** :

```javascript
// Vérifier si le token existe déjà
const token = pm.environment.get("token");

if (!token || token === "") {
    // Si pas de token, faire une requête de login
    const loginRequest = {
        url: pm.environment.get("baseUrl") + "/auth/login",
        method: 'POST',
        header: {
            'Content-Type': 'application/json',
        },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                email: "test@example.com",
                password: "password123"
            })
        }
    };

    pm.sendRequest(loginRequest, function (err, response) {
        if (err) {
            console.log(err);
        } else {
            const jsonResponse = response.json();
            pm.environment.set("token", jsonResponse.token);
            console.log("Token obtenu et sauvegardé");
        }
    });
}
```

---

## 🔍 Troubleshooting

### Problème : "Unauthorized" (401)

**Cause** : Token JWT invalide ou expiré

**Solution** :
1. Vérifiez que la variable `{{token}}` est bien définie dans l'environnement
2. Refaites un login pour obtenir un nouveau token
3. Vérifiez que le header `Authorization: Bearer {{token}}` est bien présent

---

### Problème : "Course not found" (404)

**Cause** : Le `courseId` n'existe pas dans la base de données

**Solution** :
1. Listez les cours disponibles : `GET /api/courses`
2. Copiez un `_id` valide
3. Mettez à jour la variable `courseId` dans l'environnement

---

### Problème : Timeout après 30 secondes

**Cause** : L'API Gemini met trop de temps à répondre

**Solution** :
1. Augmentez le timeout dans Postman :
   - Settings > General > Request timeout : `60000` ms
2. Vérifiez votre connexion internet
3. Vérifiez que la clé API Gemini est valide

---

### Problème : "GEMINI_API_KEY is not defined"

**Cause** : Le serveur n'a pas accès à la clé API

**Solution** :
1. Vérifiez que le fichier `.env` existe dans `/server`
2. Vérifiez que `GEMINI_API_KEY=...` est bien défini
3. Redémarrez le serveur : `npm start`

---

### Problème : Réponses vides ou incohérentes

**Cause** : Pas assez de données dans la base

**Solution** :
1. Créez des données de test :
   - Au moins 3-5 cours
   - Au moins 5-10 reviews par cours
2. Utilisez des scripts de seed pour peupler la base

---

## 📊 Exemple de Rapport de Tests

Après avoir exécuté tous les tests, vous devriez obtenir :

```
┌─────────────────────────┬────────────┬────────────┐
│                         │   executed │     failed │
├─────────────────────────┼────────────┼────────────┤
│              iterations │          1 │          0 │
├─────────────────────────┼────────────┼────────────┤
│                requests │          5 │          0 │
├─────────────────────────┼────────────┼────────────┤
│            test-scripts │         10 │          0 │
├─────────────────────────┼────────────┼────────────┤
│      prerequest-scripts │          5 │          0 │
├─────────────────────────┼────────────┼────────────┤
│              assertions │         25 │          0 │
├─────────────────────────┴────────────┴────────────┤
│ total run duration: 45.2s                         │
├───────────────────────────────────────────────────┤
│ total data received: 12.5KB (approx)              │
├───────────────────────────────────────────────────┤
│ average response time: 4.5s [min: 2.1s, max: 9.8s]│
└───────────────────────────────────────────────────┘
```

---

## 📥 Importer la Collection Complète

### Format JSON de la Collection

Créez un fichier `EduPlatform-Gemini-IA.postman_collection.json` :

```json
{
  "info": {
    "name": "EduPlatform - Gemini IA",
    "description": "Collection de tests pour les endpoints IA de EduPlatform",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Analyze Course Reviews",
      "request": {
        "method": "POST",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/ai/analyze-reviews/{{courseId}}",
          "host": ["{{baseUrl}}"],
          "path": ["ai", "analyze-reviews", "{{courseId}}"]
        }
      }
    },
    {
      "name": "Generate Course Description",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Développement Web Full-Stack avec MERN\",\n  \"instructor\": \"Dr. Marie Dupont\",\n  \"keywords\": [\"MongoDB\", \"Express\", \"React\", \"Node.js\"]\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/ai/generate-description",
          "host": ["{{baseUrl}}"],
          "path": ["ai", "generate-description"]
        }
      }
    },
    {
      "name": "Suggest Similar Courses",
      "request": {
        "method": "POST",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/ai/similar-courses/{{courseId}}",
          "host": ["{{baseUrl}}"],
          "path": ["ai", "similar-courses", "{{courseId}}"]
        }
      }
    },
    {
      "name": "Generate Professional Bio",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"interests\": \"Web development, AI, Cloud\",\n  \"experience\": \"5 ans développeur full-stack\",\n  \"goals\": \"Devenir architecte logiciel\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/ai/generate-bio",
          "host": ["{{baseUrl}}"],
          "path": ["ai", "generate-bio"]
        }
      }
    },
    {
      "name": "Get Platform Insights",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/ai/platform-insights",
          "host": ["{{baseUrl}}"],
          "path": ["ai", "platform-insights"]
        }
      }
    }
  ],
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{token}}",
        "type": "string"
      }
    ]
  }
}
```

**Pour importer** :
1. Postman > Import
2. Sélectionnez le fichier JSON
3. Cliquez sur Import

---

## ✅ Checklist de Tests

Avant de considérer les tests comme complets, vérifiez :

- [ ] Tous les endpoints retournent un statut 200 avec des données valides
- [ ] Les erreurs 400, 401, 404, 500 sont bien gérées
- [ ] Les temps de réponse sont acceptables (<15s)
- [ ] Les réponses contiennent les champs attendus
- [ ] L'authentification fonctionne correctement
- [ ] Les données générées par l'IA sont cohérentes
- [ ] Les tests automatisés passent à 100%
- [ ] La documentation est à jour

---

**Dernière mise à jour** : Décembre 2025  
**Version** : 1.0.0  
**Auteur** : EduPlatform Team
