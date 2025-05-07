const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

//Inscription d'un nouvel utilisateur
router.post('/register/:type',async (req, res) => {
    const { email,password,nom,prenom,resp_id,adresse,telephone,banquier,poste} = req.body;
    const type = req.params.type;
    if (!email || !password || !nom || !prenom) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }
    if (type !== 'client' && type !== 'employe') {
        return res.status(400).json({ message: 'Type d\'utilisateur invalide' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    if (type === 'client') {
        if(!banquier||!adresse||!telephone){
            return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
        }
        if (banquier && !Number.isInteger(banquier)) {
            return res.status(400).json({ message: 'Le banquier doit être un entier valide' });
        }

        db.run('INSERT INTO client (email, password, nom, prenom,adresse,telephone,banquier) VALUES (?, ?, ?, ?, ?, ?, ?)',[email, hashedPassword, nom, prenom, adresse, telephone, banquier], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({ id: this.lastID });
    
        });
    }
    else if (type == 'employe'){
        if (!poste) {
            return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
        }
        if (resp_id && !Number.isInteger(resp_id)) {
            return res.status(400).json({ message: 'Le resp_id doit être un entier valide' });
        }
        db.run('INSERT INTO employe (email, password, nom, prenom, poste, resp_id) VALUES (?, ?, ?, ?, ?, ?)', [email, hashedPassword, nom, prenom, poste, resp_id || null], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({ id: this.lastID });
        });
    }
}
);

//Connexion d'un utilisateur
router.post('/login/:type', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }
    const type = req.params.type;
    if (type !== 'client' && type !== 'employe') {
        return res.status(400).json({ message: 'Type d\'utilisateur invalide' });
    }
    if (type === 'client') {

        db.get('SELECT * FROM client WHERE email = ?',[email],(err,client)=>{
            if (err){
                return res.status(500).json({ error: err.message });
            }
            if (client){
                bcrypt.compare(password, client.password, (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    if (result) {
                        const token = jwt.sign({ id: client.id, type: 'client' }, JWT_SECRET, { expiresIn: '1h' });
                        return res.json({ token });
                    } else {
                        return res.status(401).json({ message: 'Adresse e-mail ou mot de passe incorrect' })
                    }
                });
            } else {
                return res.status(404).json({ message: 'Adresse e-mail ou mot de passe incorrect' })
            }
        })
    } else if (type === 'employe') {
        db.get('SELECT * FROM employe WHERE email = ?',[email],(err,employe)=>{
            if (err){
                return res.status(500).json({ error: err.message });
            }
            if (employe){
                bcrypt.compare(password, employe.password, (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    if (result) {
                        const token = jwt.sign({ id: employe.id, type: 'employe' }, JWT_SECRET, { expiresIn: '1h' });
                        return res.json({ token });
                    } else {
                        return res.status(401).json({ message: 'Adresse e-mail ou mot de passe incorrect' });
                    }
                });
            } else {
                return res.status(404).json({ message: 'Adresse e-mail ou mot de passe incorrect' });
            }
        })
    }
});

router.get('/user', (req, res) => {
    const authHeader = req.headers.authorization;

    // Vérification si le token est présent
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.json({ isLoggedIn: false, type: null }); // Utilisateur non connecté
    }

    const token = authHeader.split(' ')[1];

    try {
        // Vérification du token
        const decoded = jwt.verify(token, JWT_SECRET);
        // Si le token est valide, on renvoie isLoggedIn: true et le type d'utilisateur
        return res.json({ isLoggedIn: true, type: decoded.type });
    } catch (err) {
        // Si le token est invalide ou expiré
        return res.json({ isLoggedIn: false, type: null });
    }
});

module.exports = router;