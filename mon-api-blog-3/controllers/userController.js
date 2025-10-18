const User = require('../models/User');

// @desc    Récupérer tous les utilisateurs
// @route   GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ 
      message: "Erreur lors de la récupération des utilisateurs.", 
      error: err.message 
    });
  }
};

// @desc    Créer un nouvel utilisateur
// @route   POST /api/users
const createUser = async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);

  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      res.status(400).json({ 
        message: `Ce ${field} est déjà utilisé.`,
        error: err.message 
      });
    } else if (err.name === 'ValidationError') {
      res.status(400).json({ 
        message: "Erreur de validation des données.",
        error: err.message 
      });
    } else {
      res.status(400).json({ 
        message: "Erreur lors de la création de l'utilisateur.", 
        error: err.message 
      });
    }
  }
};

module.exports = {
  getAllUsers,
  createUser
};