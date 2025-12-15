const { getModel } = require('../config/gemini');
const Course = require('../models/Course');
const Review = require('../models/Review');

// @desc Générer un rapport d’analyse des reviews d’un cours
// @route POST /api/ai/analyze-reviews/:courseId
// @access Private
exports.analyzeReviews = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Récupérer le cours et ses reviews
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    // Récupérer toutes les reviews du cours
    const reviews = await Review.find({ course: courseId }).populate('user', 'username');

    if (reviews.length === 0) {
      return res.status(400).json({ message: 'Aucune review disponible pour ce cours' });
    }

    // Préparer les données pour Gemini
    const reviewsText = reviews
      .map((review, index) => `Review ${index + 1} (${review.rating}/5): "${review.comment}"`)
      .join('\n\n');

    // Créer le prompt
    const prompt = `Tu es un expert en analyse de feedback éducatif.

Analyse ces ${reviews.length} reviews du cours "${course.title}":

${reviewsText}

Génère un rapport structuré au format suivant :

## Sentiment Général
[Positif / Neutre / Négatif avec justification]

## Note Moyenne Calculée
[La note moyenne est ${(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)}/5]

## Points Forts (Top 3)
1. [Point fort 1]
2. [Point fort 2]
3. [Point fort 3]

## Points d’Amélioration (Top 3)
1. [Amélioration 1]
2. [Amélioration 2]
3. [Amélioration 3]

## Recommandations pour l’Instructeur
[2−3 recommandations concrètes]

## Résumé en une phrase
[Une phrase résumant l’opinion générale]`;

    // Appel à Gemini
    const model = getModel();
    const result = await model.generateContent(prompt);
    const analysis = result.response.text();

    res.json({
      success: true,
      data: {
        courseTitle: course.title,
        reviewCount: reviews.length,
        analysis
      }
    });
  } catch (error) {
    console.error('Erreur analyse IA :', error);
    res.status(500).json({
      message: 'Erreur lors de l\'analyse',
      error: error.message
    });
  }
};

// @desc Générer une description attractive pour un cours
// @route POST /api/ai/generate-description
// @access Private
exports.generateCourseDescription = async (req, res) => {
  try {
    const { title, instructor, keywords } = req.body;

    if (!title || !instructor) {
      return res.status(400).json({ message: 'Titre et instructeur requis' });
    }

    const keywordsText = keywords ? keywords.join(', ') : '';

    const prompt = `Génère une description attractive et professionnelle pour un cours en ligne.

Titre: ${title}
Instructeur: ${instructor}
Mots-clés: ${keywordsText}

La description doit :
- être engageante et motivante (2−3 paragraphes)
- mentionner les bénéfices pour l'étudiant
- inclure ce qu'ils vont apprendre
- terminer par un appel à l'action

Retourne uniquement la description sans titre.`;

    const model = getModel();
    const result = await model.generateContent(prompt);
    const description = result.response.text();

    res.json({
      success: true,
      data: { description }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Générer des suggestions de cours similaires
// @route POST /api/ai/similar-courses/:courseId
// @access Public
exports.suggestSimilarCourses = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    const allCourses = await Course.find({ _id: { $ne: courseId } }).select('title description instructor');

    if (allCourses.length === 0) {
      return res.json({ success: true, data: { suggestions: [] } });
    }

    const coursesText = allCourses
      .map((c, i) => `${i + 1}. "${c.title}" par ${c.instructor}\nDescription: ${c.description.substring(0, 100)}...`)
      .join('\n\n');

    const prompt = `Cours de référence :
Titre: ${course.title}
Description: ${course.description}

Liste des autres cours disponibles :
${coursesText}

Analyse le contenu et recommande les 3 cours les plus similaires.
Pour chaque cours, explique brièvement pourquoi il est similaire (2-3 phrases).

Format de réponse :
1. [Numéro du cours] - [Raison de similarité]
2. [Numéro du cours] - [Raison de similarité]
3. [Numéro du cours] - [Raison de similarité]`;

    const model = getModel();
    const result = await model.generateContent(prompt);
    const suggestions = result.response.text();

    res.json({
      success: true,
      data: {
        referenceCourse: course.title,
        suggestions,
        availableCourses: allCourses.map(c => ({ id: c._id, title: c.title }))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Générer une bio professionnelle pour un utilisateur
// @route POST /api/ai/generate-bio
// @access Private
exports.generateBio = async (req, res) => {
  try {
    const { interests, experience, goals } = req.body;

    if (!interests || !experience) {
      return res.status(400).json({ message: 'Intérêts et expérience requis' });
    }

    const prompt = `Génère une bio professionnelle concise et engageante (3-4 phrases maximum).

Intérêts: ${interests}
Expérience: ${experience}
Objectifs: ${goals || 'Non spécifié'}

La bio doit être écrite à la première personne et donner envie de connecter avec cette personne.`;

    const model = getModel();
    const result = await model.generateContent(prompt);
    const bio = result.response.text();

    res.json({
      success: true,
      data: { bio }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Obtenir des insights généraux sur tous les cours
// @route GET /api/ai/platform-insights
// @access Private (Admin)
exports.getPlatformInsights = async (req, res) => {
  try {
    const courses = await Course.find().select('title instructor');
    const allReviews = await Review.find().populate('course', 'title');
    const User = require('../models/User');
    const totalUsers = await User.countDocuments();

    const stats = {
      totalCourses: courses.length,
      totalReviews: allReviews.length,
      totalUsers: totalUsers,
      averageRating: allReviews.length > 0
        ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(2)
        : 0
    };

    const reviewsByCourse = {};
    allReviews.forEach(review => {
      const courseTitle = review.course.title;
      if (!reviewsByCourse[courseTitle]) {
        reviewsByCourse[courseTitle] = [];
      }
      reviewsByCourse[courseTitle].push({ rating: review.rating, comment: review.comment });
    });

    const courseSummaries = Object.entries(reviewsByCourse)
      .map(([title, reviews]) => {
        const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
        return `${title}: ${reviews.length} reviews (note moyenne: ${avgRating}/5)`;
      })
      .join('\n');

    const prompt = `Tu es un système d'analyse automatisé pour une plateforme éducative en ligne.

Voici les statistiques générales de la plateforme :
- ${stats.totalCourses} cours au total
- ${stats.totalUsers} utilisateurs inscrits
- ${stats.totalReviews} reviews au total
- Note moyenne globale : ${stats.averageRating}/5

Distribution des reviews par cours :
${courseSummaries || 'Aucune review pour le moment'}

Génère un rapport d'insights détaillé et professionnel. Ne mentionne PAS de nom d'analyste ou d'auteur du rapport. Utilise uniquement les sections suivantes :

## Santé Générale de la Plateforme
[Évaluation globale avec score /10 et justification]

## Tendances Observées
[3 tendances principales avec explication]

##  Cours Populaires
[Identifier les cours les plus actifs et pourquoi]

##  Points d'Attention
[2-3 problèmes potentiels à surveiller]

##  Recommandations Stratégiques
[4 recommandations concrètes pour améliorer la plateforme]`;

    const model = getModel();
    const result = await model.generateContent(prompt);
    const insights = result.response.text();

    res.json({
      success: true,
      data: {
        stats,
        insights,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Chatbot IA pour répondre aux questions sur les cours
// @route POST /api/ai/chatbot
// @access Public
exports.chatbot = async (req, res) => {
  try {
    const { question, courseId } = req.body;

    if (!question) {
      return res.status(400).json({ message: 'Question requise' });
    }

    let contextData = '';
    
    if (courseId) {
      // Si un cours spécifique est mentionné
      const course = await Course.findById(courseId);
      if (course) {
        const reviews = await Review.find({ course: courseId }).limit(5);
        const reviewsText = reviews.map(r => `- "${r.comment}" (${r.rating}/5)`).join('\n');
        contextData = `
Contexte du cours "${course.title}":
- Instructeur: ${course.instructor}
- Description: ${course.description}
${reviews.length > 0 ? `\nAvis récents:\n${reviewsText}` : ''}`;
      }
    } else {
      // Contexte général de la plateforme
      const courses = await Course.find().select('title instructor description').limit(10);
      const coursesText = courses.map(c => `- "${c.title}" par ${c.instructor}: ${c.description.substring(0, 100)}...`).join('\n');
      contextData = `
Cours disponibles sur la plateforme:
${coursesText}`;
    }

    const prompt = `Tu es un assistant virtuel amical et compétent pour une plateforme de cours en ligne.
Tu dois répondre aux questions des utilisateurs de manière claire, concise et utile.

${contextData}

Question de l'utilisateur: "${question}"

Réponds de manière naturelle et engageante. Si tu ne connais pas la réponse, suggère de contacter le support ou explore les cours disponibles.
Utilise des emojis pour rendre la réponse plus conviviale.`;

    const model = getModel();
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({
      success: true,
      data: {
        question,
        response,
        courseId: courseId || null
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Générer un quiz à partir de la description d'un cours
// @route POST /api/ai/generate-quiz/:courseId
// @access Private
exports.generateQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { numberOfQuestions = 5, difficulty = 'moyen' } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    const prompt = `Tu es un expert en création de quiz éducatifs.

Génère un quiz de ${numberOfQuestions} questions à choix multiples basé sur ce cours :
Titre: ${course.title}
Description: ${course.description}
Instructeur: ${course.instructor}

Difficulté demandée: ${difficulty}

IMPORTANT: Réponds UNIQUEMENT avec un JSON valide, sans aucun texte avant ou après.
Le format doit être exactement:
{
  "quizTitle": "Titre du quiz",
  "courseTitle": "${course.title}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": 1,
      "question": "Question ici",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explication de la bonne réponse"
    }
  ]
}

Génère exactement ${numberOfQuestions} questions pertinentes et éducatives.`;

    const model = getModel();
    const result = await model.generateContent(prompt);
    let quizText = result.response.text();
    
    // Nettoyer la réponse pour extraire le JSON
    quizText = quizText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const quiz = JSON.parse(quizText);
      res.json({
        success: true,
        data: quiz
      });
    } catch (parseError) {
      res.status(500).json({ 
        message: 'Erreur lors de la génération du quiz',
        rawResponse: quizText 
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Suggestions de cours personnalisés pour un utilisateur
// @route GET /api/ai/personalized-courses/:userId
// @access Private
exports.getPersonalizedCourses = async (req, res) => {
  try {
    const { userId } = req.params;
    const User = require('../models/User');
    
    const user = await User.findById(userId).populate('courses');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Récupérer tous les cours disponibles sauf ceux déjà suivis
    const enrolledCourseIds = user.courses.map(c => c._id);
    const availableCourses = await Course.find({ _id: { $nin: enrolledCourseIds } });

    if (availableCourses.length === 0) {
      return res.json({
        success: true,
        data: {
          message: "Vous êtes inscrit à tous les cours disponibles !",
          suggestions: []
        }
      });
    }

    // Préparer le contexte des cours suivis
    const enrolledCoursesText = user.courses.length > 0
      ? user.courses.map(c => `- "${c.title}" par ${c.instructor}`).join('\n')
      : 'Aucun cours suivi pour le moment';

    // Préparer la liste des cours disponibles
    const availableCoursesText = availableCourses
      .map((c, i) => `${i + 1}. "${c.title}" par ${c.instructor}\n   Description: ${c.description.substring(0, 150)}...`)
      .join('\n\n');

    const prompt = `Tu es un conseiller pédagogique expert.

Profil de l'utilisateur "${user.username}":
Cours actuellement suivis:
${enrolledCoursesText}

Cours disponibles sur la plateforme:
${availableCoursesText}

Analyse le profil de l'utilisateur et recommande les 3 cours les plus pertinents pour lui.

IMPORTANT: Réponds UNIQUEMENT avec un JSON valide:
{
  "userName": "${user.username}",
  "recommendations": [
    {
      "courseIndex": 1,
      "courseTitle": "Titre du cours",
      "matchScore": 95,
      "reason": "Explication courte pourquoi ce cours est recommandé",
      "benefits": ["Bénéfice 1", "Bénéfice 2"]
    }
  ],
  "generalAdvice": "Conseil général pour la progression de l'utilisateur"
}`;

    const model = getModel();
    const result = await model.generateContent(prompt);
    let suggestionsText = result.response.text();
    
    // Nettoyer la réponse pour extraire le JSON
    suggestionsText = suggestionsText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const suggestions = JSON.parse(suggestionsText);
      
      // Enrichir les recommandations avec les données réelles des cours
      if (suggestions.recommendations) {
        suggestions.recommendations = suggestions.recommendations.map(rec => {
          const courseIndex = rec.courseIndex - 1;
          if (courseIndex >= 0 && courseIndex < availableCourses.length) {
            const course = availableCourses[courseIndex];
            return {
              ...rec,
              courseId: course._id,
              courseTitle: course.title,
              instructor: course.instructor,
              description: course.description
            };
          }
          return rec;
        });
      }
      
      res.json({
        success: true,
        data: suggestions
      });
    } catch (parseError) {
      res.status(500).json({ 
        message: 'Erreur lors de la génération des suggestions',
        rawResponse: suggestionsText 
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};