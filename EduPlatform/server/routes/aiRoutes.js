const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    analyzeReviews,
    generateCourseDescription,
    suggestSimilarCourses,
    generateBio,
    getPlatformInsights,
    chatbot,
    generateQuiz,
    getPersonalizedCourses
} = require('../controllers/aiController');

// Routes protégées
router.post('/analyze-reviews/:courseId', protect, analyzeReviews);
router.post('/generate-description', protect, generateCourseDescription);
router.post('/generate-bio', protect, generateBio);
router.get('/platform-insights', protect, getPlatformInsights);
router.post('/generate-quiz/:courseId', protect, generateQuiz);
router.get('/personalized-courses/:userId', protect, getPersonalizedCourses);


// Route publique 
router.post('/similar-courses/:courseId', suggestSimilarCourses);
router.post('/chatbot', chatbot);

module.exports = router;
