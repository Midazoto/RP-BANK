const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/index.html'));
    }
);

router.get('/login/:type', (req, res) => {
    const { type } = req.params;
    if (type !== 'client' && type !== 'employe') {
        return res.status(404).send('Type d’utilisateur inconnu');
    }

    res.sendFile(path.join(__dirname, '../public/html/login.html'));
});

router.get('/organigramme', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/organigramme.html'));
});

router.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../public/html/404.html'));
});

module.exports = router;