const express = require("express");
const router = express.Router();
const db = require("../db");
const verifierToken = require("../middleware/authMiddleware");
const verifierEmploye = require("../middleware/empMiddleware");


//GET tout les subordonnées d'un employé connecté

router.get("/subordonnes", verifierToken,verifierEmploye, (req, res) => {
  const id = req.user.id;
  if (!id) {
    return res.status(400).json({ message: "ID d'employé manquant" });
  }
  db.get("SELECT email FROM employe WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ message: "Employé non trouvé" });
      return;
    }
    const mail = row.email;
    if(mail !== "admin@rpbank.lol"){
      db.all(
        `WITH RECURSIVE hierarchie(id, email, nom, prenom, poste, resp_id) AS (
            SELECT id, email, nom, prenom, poste, resp_id
            FROM employe
            WHERE id = ?

            UNION ALL

            SELECT e.id, e.email, e.nom, e.prenom, e.poste, e.resp_id
            FROM employe e
            INNER JOIN hierarchie h ON e.resp_id = h.id
        )
        SELECT * FROM hierarchie where id != ?`,
        [id, id],
        (err, rows) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.json(rows);
        }
      );
    }else{
      db.all('select id, email, nom, prenom, poste, resp_id from employe where id!=?',[id], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(rows);
      });
    }
  }
  );
});

router.get('/current', verifierToken,verifierEmploye, (req, res) => {
  const id = req.user.id;
  db.get('SELECT id, nom, prenom, poste FROM employe WHERE id = ?', [id], (err, employe) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!employe) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }
    res.json(employe);
  });
});

router.get('/all', verifierToken,verifierEmploye, (req, res) => {
  db.all('SELECT * FROM employe', (err, employes) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(employes);
  });
}
);

router.get('/profil/:id', verifierToken,verifierEmploye, (req, res) => {
  const id = req.params.id;
  db.get(`SELECT
            e.id,
            e.email,
            e.nom,
            e.prenom,
            e.poste,
            e.resp_id,
            r.email AS r_email,
            r.nom AS r_nom,
            r.prenom AS r_prenom,
            r.poste AS r_poste
          FROM employe e
          LEFT JOIN employe r ON e.resp_id = r.id
          WHERE e.id = ?;`, [id], (err, employe) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!employe) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }
    res.json(employe);
  });
}
);

module.exports = router;