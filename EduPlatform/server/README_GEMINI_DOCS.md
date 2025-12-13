# 📚 Documentation Gemini IA - EduPlatform

## 📖 Documents Disponibles

Ce dossier contient la documentation complète de l'intégration Gemini IA dans EduPlatform :

### 1. [GEMINI_IA_GUIDE.md](./GEMINI_IA_GUIDE.md)
**Guide technique complet** sur l'intégration de Gemini IA
- Architecture et configuration
- Documentation détaillée des 5 endpoints
- Exemples de code (cURL, JavaScript)
- Troubleshooting et optimisation
- Bonnes pratiques de sécurité

### 2. [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md)
**Guide pratique pour tester les API** avec Postman
- Configuration de l'environnement Postman
- Collection complète de tests
- Scripts de tests automatisés
- Scénarios de test complets
- Automatisation avec Newman

### 3. [README_IA.md](./README_IA.md)
**Documentation originale** de l'intégration IA
- Vue d'ensemble du projet
- Instructions d'installation
- Exemples d'utilisation basiques

---

## 🚀 Démarrage Rapide

### Prérequis
```bash
# 1. Installer les dépendances
npm install @google/generative-ai

# 2. Obtenir une clé API Gemini
# Visitez : https://ai.google.dev/
```

### Configuration
```env
# Fichier .env
GEMINI_API_KEY=votre_clé_api_ici
```

### Tester l'API
```bash
# Démarrer le serveur
npm start

# Tester avec Postman (voir POSTMAN_GUIDE.md)
```

---

## 🛣️ Endpoints Disponibles

| Endpoint | Méthode | Auth | Description |
|----------|---------|------|-------------|
| `/api/ai/analyze-reviews/:courseId` | POST | ✅ | Analyse les reviews d'un cours |
| `/api/ai/generate-description` | POST | ✅ | Génère une description de cours |
| `/api/ai/similar-courses/:courseId` | POST | ❌ | Suggère des cours similaires |
| `/api/ai/generate-bio` | POST | ✅ | Génère une bio professionnelle |
| `/api/ai/platform-insights` | GET | ✅ | Insights globaux (Admin) |

---

## 📊 Exemples Rapides

### Analyser des Reviews
```bash
curl -X POST http://localhost:3000/api/ai/analyze-reviews/COURSE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Générer une Description
```bash
curl -X POST http://localhost:3000/api/ai/generate-description \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React Masterclass",
    "instructor": "John Doe",
    "keywords": ["React", "JavaScript", "Frontend"]
  }'
```

---

## 🔧 Troubleshooting Rapide

| Problème | Solution |
|----------|----------|
| "GEMINI_API_KEY is not defined" | Vérifier le fichier `.env` |
| "Unauthorized" (401) | Vérifier le token JWT |
| "Course not found" (404) | Vérifier l'ID du cours |
| Timeout | Augmenter le délai ou vérifier la connexion |

---

## 📚 Ressources

- [Documentation Gemini](https://ai.google.dev/docs)
- [Guide des Prompts](https://developers.google.com/machine-learning/resources/prompt-eng)
- [Postman Documentation](https://learning.postman.com/)

---

## 📞 Support

Pour toute question ou problème :
1. Consultez le [GEMINI_IA_GUIDE.md](./GEMINI_IA_GUIDE.md) pour les détails techniques
2. Consultez le [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md) pour les tests
3. Vérifiez les logs du serveur pour les erreurs

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2025
