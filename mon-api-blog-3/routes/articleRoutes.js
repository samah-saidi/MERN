const express = require('express');
const router = express.Router();

// On importe les fonctions du contrôleur
const { getAllArticles, createArticle } = require('../controllers/articleController');
// Définition des routes
// Note : le chemin '/' ici correspondra à la racine de ce routeur
// telle qu’elle sera définie dans server.js (ex: app.use('/api/articles', router))

// Route pour récupérer tous les articles
router.get('/', getAllArticles);

// Route pour créer un nouvel article
router.post('/', createArticle);

// On exporte le routeur pour utilisation dans server.js
module.exports = router;
