const express = require('express');
const app = express();
const PORT = 3000;
const articleRoutes= require('./routes/articleRoutes');
const userRoutes = require('./routes/userRoutes');

// --- Middleware JSON ---
app.use(express.json());

// --- Routes GET ---
app.get('/', (req, res) => {
    res.status(200).send('<h1>Page d\'accueil de notre API de Blog !</h1>');
});

// --- Routes Articles ---
app.use('/api/articles', articleRoutes);

// --- Routes Users ---
app.use('/api/users', userRoutes);


// --- Route À Propos ---
app.get('/about', (req, res) => {
  res.status(200).send('<h1>À Propos</h1><p>Ceci est une API de blog développée avec Node.js et Express.js dans le cadre du cours MERN.</p>');
});

// --- Route API Users ---
app.get('/api/users',);


// --- Route Contact POST (Travail Pratique 3) ---
app.post('/contact', (req, res) => {
  const { email, message } = req.body;
  
  // Validation des champs requis
  if (!email || !message) {
    return res.status(400).json({
      success: false,
      message: 'L\'email et le message sont requis!'
    });
  }
  
  // Validation simple de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Format d\'email invalide!'
    });
  }
  
  console.log('Message de contact reçu:', { email, message });
  
  res.status(200).json({
    success: true,
    message: `Message reçu de ${email}!`,
    data: {
      email: email,
      receivedAt: new Date().toISOString()
    }
  });
});

// --- Gestion des routes non trouvées (404) ---
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// --- Lancement du serveur ---
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);  
});