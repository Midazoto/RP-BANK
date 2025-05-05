const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../db');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

function verifierToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token manquant ou invalide' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        if(req.user.type === 'employe'){
            next();
        }
        else{
            return res.status(403).json({ message: 'Accès refusé' });
        }
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expiré' });
        }
        return res.status(401).json({ message: 'Token invalide' });
    }
}

module.exports = verifierToken;