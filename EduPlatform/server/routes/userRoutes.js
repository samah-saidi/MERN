const express = require('express');
const router = express.Router();
const { createUser, getUsers, getUser, getUserCourses } = require('../controllers/userController');
const { createProfile, getProfile, updateProfile } = require('../controllers/profileController');
const { getUserReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

//Routes protégées
router.get('/profile', protect, async (req, res) => {
    //req.userId contient l’ID utilisateur connecté
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
});

router.post('/', createUser);
router.get('/', getUsers);

// GET USER'S ENROLLED COURSES - Must be before /:id to avoid conflict
router.get('/:userId/courses', getUserCourses);

// GET USER'S REVIEWS - Must be before /:id to avoid conflict
router.get('/:userId/reviews', protect, getUserReviews);

router.get('/:id', getUser);

router.post('/:userId/profile', createProfile);
router.get('/:userId/profile', getProfile);
router.put('/:userId/profile', updateProfile);

module.exports = router;
