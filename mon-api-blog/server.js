const express = require('express');
const app = express();
const PORT = 3000;

// --- Middleware JSON ---
app.use(express.json());

// --- Routes GET ---
app.get('/', (req, res) => {
    res.status(200).send('<h1>Page d\'accueil de notre API de Blog !</h1>');
});

app.get('/api/test', (req, res) => {
    res.status(200).json({ 
        message: 'Le test a fonctionné !', 
        success: true  
    });
});

// --- Routes POST ---
app.post('/api/articles', (req, res) => {
    const articleData = req.body;
    console.log('Données reçues :', articleData);
    
    res.status(201).json({
        message: 'Article créé avec succès !',
        article: { id: Date.now(), ...articleData }
    });
});

// --- Route À Propos ---
app.get('/about', (req, res) => {
  res.status(200).send('<h1>À Propos</h1><p>Ceci est une API de blog développée avec Node.js et Express.js dans le cadre du cours MERN.</p>');
});

// --- Route API Users ---
app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'Samah SAIDI', email: 'samah.saidi@polytechnicien.tn', role: 'admin' },
    { id: 2, name: 'Maroua', email: 'maroua@gmail.com', role: 'editor' },
    { id: 3, name: 'Mariem', email: 'Mariem@gmail.com', role: 'user' },
    { id: 4, name: 'Issra', email: 'issra@gmail.com', role: 'user' }
  ];
  
  res.status(200).json({
    success: true,
    count: users.length,
    users: users
  });
});


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