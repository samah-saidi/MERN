const express = require('express');
const router = express.Router();

// On importe les fonctions du contrôleur
const { getAllArticles, createArticle, getArticleById, updateArticle, deleteArticle } = require('../controllers/articleController');

// Route pour récupérer tous les articles
router.get('/', getAllArticles);

// Route pour créer un nouvel article
router.post('/', createArticle);

// NOUVELLE ROUTE : Doit correspondre à la nouvelle fonction du controleur
router.get('/:id', getArticleById);

// NOUVELLE ROUTE
router.put('/id',updateArticle);

//NOUVELLE ROUTE : Supprimer un article
router.delete('/:id', deleteArticle)

// On exporte le routeur pour utilisation dans server.js
module.exports = router;
