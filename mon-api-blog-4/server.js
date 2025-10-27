require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
connectDB();
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

// --- Lancement du serveur ---
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);  
});