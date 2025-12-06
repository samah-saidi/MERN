const Review = require('../models/Review');
const Course = require('../models/Course');

// @desc    Créer une critique pour un cours
// @route   POST /api/courses/:courseId/reviews
// @access  Private (JWT required)
const addReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé.' });
    }

    // Vérifier que l'utilisateur est inscrit au cours
    const userId = req.userId;
    if (!course.students.includes(userId)) {
      return res.status(403).json({ message: 'Vous devez être inscrit au cours pour laisser un avis.' });
    }

    const review = await Review.create({
      rating,
      comment,
      course: courseId, // Lier la critique au cours
      user: userId, // Utiliser l'ID de l'utilisateur authentifié
    });

    // Populate l'utilisateur pour la réponse
    await review.populate('user', 'username email');

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Récupérer toutes les critiques d'un cours
// @route   GET /api/courses/:courseId/reviews
// @access  Public
const getCourseReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ course: req.params.courseId })
      .populate('user', 'username email')
      .populate('course', 'title');

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Récupérer toutes les critiques d'un utilisateur
// @route   GET /api/users/:userId/reviews
// @access  Private (JWT required)
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.userId })
      .populate('course', 'title instructor')
      .populate('user', 'username email');

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addReview,
  getCourseReviews,
  getUserReviews,
};