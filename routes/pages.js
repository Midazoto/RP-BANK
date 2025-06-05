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

router.get('/client/home', (req, res) => {

   res.sendFile(path.join(__dirname, '../public/html/client/redirect_home.html'));
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

router.get('/employe/:id/profil/modifier', (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(404).send('ID d’employé manquant');
    }

    res.sendFile(path.join(__dirname, '../public/html/employe/profil_modifier.html'));
});

router.get('/client/:id/profil', (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(404).send('ID de client manquant');
    }

    res.sendFile(path.join(__dirname, '../public/html/client/home.html'));
});

router.get('/client/:id/compte/:compteId/consulter', (req, res) => {
    const { id, compteId } = req.params;
    if (!id || !compteId) {
        return res.status(404).send('ID de client ou de compte manquant');
    }

    res.sendFile(path.join(__dirname, '../public/html/client/compte_consulter.html'));
});

router.get('/client/:id/beneficiaire/:idBeneficiaire/supprimer', (req, res) => {
    const { id, idBeneficiaire } = req.params;
    if (!id || !idBeneficiaire) {
        return res.status(404).send('ID de client ou de bénéficiaire manquant');
    }
    res.sendFile(path.join(__dirname, '../public/html/client/delete_benef.html'));
});

router.get('/client/:id/beneficiaire/ajouter', (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(404).send('ID de client manquant');
    }
    res.sendFile(path.join(__dirname, '../public/html/client/add_benef.html'));
});

router.get('/client/:id/virement', (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(404).send('ID de client manquant');
    }
    res.sendFile(path.join(__dirname, '../public/html/client/virement.html'));
});

router.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../public/html/404.html'));
});

module.exports = router;