const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require('bcryptjs');
const verifierToken = require("../middleware/authMiddleware");
const verifierEmploye = require("../middleware/empMiddleware");


//GET tout les subordonnées d'un employé connecté

router.get("/subordonnes", verifierToken,verifierEmploye, (req, res) => {
  const id = req.user.id;
  if (!id) {
    return res.status(400).json({ message: "ID d'employé manquant" });
  }
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

router.put('/profil/:id/modifier', verifierToken, verifierEmploye, async (req, res) => {
  const cibleId = req.params.id;
  const userId = req.user.id;
  const { nom, prenom, email, poste, responsable, modif_mdp, password } = req.body;
  const hash = modif_mdp && password ? await bcrypt.hash(password, 10) : null;
  
  if (!cibleId || !userId) {
    return res.status(400).json({ message: "ID manquant" });
  }

  db.all(
    `WITH RECURSIVE hierarchie(id, resp_id) AS (
        SELECT id, resp_id
        FROM employe
        WHERE id = ?

        UNION ALL

        SELECT e.id, e.resp_id
        FROM employe e
        INNER JOIN hierarchie h ON e.id = h.resp_id
    )
    SELECT id FROM hierarchie WHERE id = ?`,
    [cibleId, userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const isSuperieur = rows.length > 0;
      if (!isSuperieur && cibleId !== String(userId)) {
        return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce profil." });
      }


      if (!nom || !prenom || !email || !poste) {
        return res.status(400).json({ message: "Champs requis manquants." });
      }

      let sql = `UPDATE employe SET nom = ?, prenom = ?, email = ?, poste = ?, resp_id = ?`;
      const params = [nom, prenom, email, poste, responsable || null];

      if (modif_mdp && password && password.trim() !== '') {
        sql += `, password = ?`;
        params.push(hash);
      }

      sql += ` WHERE id = ?`;
      params.push(cibleId);

      db.run(sql, params, function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.json({ message: "Profil mis à jour avec succès." });
      });
    }
  );
});


router.get('/getClient', verifierToken,verifierEmploye, (req, res) => {
  const id = req.user.id;
  db.all('SELECT client.id,nom,prenom,count(client_id) as nb_compte FROM client LEFT JOIN compte on client.id = compte.client_id WHERE banquier = ? GROUP BY client.id,nom,prenom',[id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
  }
);

router.get('/profil/:id/isSuperieur', verifierToken, verifierEmploye, (req, res) => {
  const cibleId = req.params.id;     // Employé à vérifier
  const userId = req.user.id;        // Utilisateur connecté

  if (!cibleId || !userId) {
    return res.status(400).json({ message: "ID manquant" });
  }

  db.all(
    `WITH RECURSIVE hierarchie(id, resp_id) AS (
        SELECT id, resp_id
        FROM employe
        WHERE id = ?

        UNION ALL

        SELECT e.id, e.resp_id
        FROM employe e
        INNER JOIN hierarchie h ON e.id = h.resp_id
    )
    SELECT id FROM hierarchie WHERE id = ?`,
    [cibleId, userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Si on trouve une ligne, alors userId est un supérieur de cibleId
      const isSuperieur = rows.length > 0;
      console
      res.json({ isSuperieur });
    }
  );
});

module.exports = router;