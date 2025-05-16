const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/index.html'));
    }
);

router.get('/employe/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/employe/home.html'));
});


router.get('/login',(req,res) => {
    res.sendFile(path.join(__dirname, '../public/html/login.html'));
});

router.get('/logout', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/logout.html'));
}
);

router.get('/login/:type', (req, res) => {
    const { type } = req.params;
    if (type !== 'client' && type !== 'employe') {
        return res.status(404).send('Type d’utilisateur inconnu');
    }

    res.sendFile(path.join(__dirname, '../public/html/login_type.html'));
});

router.get('/employe/organigramme', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/employe/organigramme.html'));
});

router.get('/employe/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/employe/register.html'));
});

router.get('/employe/register/:type', (req, res) => {
    const { type } = req.params;
    if (type !== 'client' && type !== 'employe') {
        return res.status(404).send('Type d’utilisateur inconnu');
    }

    res.sendFile(path.join(__dirname, '../public/html/employe/register_type.html'));
});

router.get('/employe/:id/profil', (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(404).send('ID d’employé manquant');
    }

    res.sendFile(path.join(__dirname, '../public/html/employe/profil.html'));
});

router.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../public/html/404.html'));
});

module.exports = router;