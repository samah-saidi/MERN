const express = require('express');
const router = express.Router();
const { createUser, getUsers, getUser } = require('../controllers/userController');
const { createProfile, getProfile, updateProfile } = require('../controllers/profileController');
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
router.get('/:id', getUser);

router.post('/:userId/profile', createProfile);
router.get('/:userId/profile', getProfile);
router.put('/:userId/profile', updateProfile);

module.exports = router;
