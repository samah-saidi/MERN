const express = require('express');
const router = express.Router();

const { getAllUsers, createUser } = require('../controllers/userController');

// Route pour récupérer tous les utilisateurs
router.get('/', getAllUsers);

// Route pour créer un nouvel utilisateur
router.post('/', createUser);

module.exports = router;