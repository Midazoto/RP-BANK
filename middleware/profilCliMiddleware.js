const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../db');
const {response} = require("express");
let id_banquier = null;

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
        if (req.user.type === 'employe'){
            db.get('SELECT banquier FROM client WHERE id = ?', [req.params.id_client], (err, row) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                id_banquier = row.banquier;
            })
        }
        if(req.user.type === 'client' && req.user.id === req.params.id_client){
            next();
        }else if (req.user.type === 'employe' && req.user.id === id_banquier){
            next();
        }else {
            return res.status(403).json({ message: 'Accès refusé' });
        }
    }catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expiré' });
        }
        return res.status(401).json({ message: 'Token invalide' });
    }
}

module.exports = verifierToken;