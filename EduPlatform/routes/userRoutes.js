const express = require('express');
const router = express.Router();
const { createUser, getUsers, getUser } = require('../controllers/userController');
const { createProfile, getProfile, updateProfile } = require('../controllers/profileController');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUser);

router.post('/:userId/profile', createProfile);
router.get('/:userId/profile', getProfile);
router.put('/:userId/profile', updateProfile);

module.exports = router;
