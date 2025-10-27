require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
// Connect to MongoDB
connectDB();
const app = express();
const PORT = 3000;
// Importing Routes
const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');

//middleware to parse JSON bodies
app.use(express.json());

// --- Route GET ---
app.get('/', (req, res) => {
    res.status(200).send(' <h1> Welcome to the Home Page of Project MERN! </h1>');
});

// Course Routes
app.use('/api', courseRoutes);

// Student Routes
app.use('/api', studentRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});