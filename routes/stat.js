const express = require('express');
const router = express.Router();
const db = require("../db");


router.get('/nbClients', (req, res) => {
    db.get('SELECT COUNT(*) AS nbClients FROM client', [], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ nbClients: row.nbClients });
    });
});

router.get('/nbEmployes', (req, res) => {
    db.get('SELECT COUNT(*) AS nbEmployes FROM employe', [], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ nbEmployes: row.nbEmployes });
    });
});

router.get('/nbComptes', (req, res) => {
    db.get('SELECT COUNT(*) AS nbComptes FROM compte', [], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ nbComptes: row.nbComptes });
    });
});

router.get('/nbOperations', (req, res) => {
    db.get('SELECT (SELECT COUNT(*) FROM operation) + (SELECT COUNT(*) FROM virement) AS nbOperations', [], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ nbOperations: row.nbOperations });
    });
});

router.get('/nbCartes', (req, res) => {
    db.get('SELECT COUNT(*) AS nbCartes FROM carte', [], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ nbCartes: row.nbCartes });
    });
});

router.get('/totalSolde', (req, res) => {
    db.get('SELECT SUM(solde) AS totalSolde FROM compte', [], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ totalSolde: row.totalSolde });
    });
});

router.get('/type_compte', (req, res) => {
    db.all('SELECT * FROM type_compte', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});




module.exports = router;