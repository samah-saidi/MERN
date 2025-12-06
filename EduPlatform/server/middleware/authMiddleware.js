const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    // Récupérer le token du header Authorization
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extraire le token
            token = req.headers.authorization.split(' ')[1];

            // Vérifier le token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Ajouter l’ID utilisateur à la requête
            req.userId = decoded.userId;

            next();
        } catch (error) {
            res.status(401).json({ message: 'Token invalide' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Pas de token, accès refusé' });
    }
};

module.exports = { protect };
