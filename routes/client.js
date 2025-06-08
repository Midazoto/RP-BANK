const express = require("express");
const router = express.Router();
const db = require("../db");
const verifierToken = require("../middleware/authMiddleware");
const verifierEmploye = require("../middleware/empMiddleware");
const verifierClient = require("../middleware/profilCliMiddleware");
const bcrypt = require("bcryptjs");

router.get("/:id_client/compte",verifierToken,async (req,res)=>{
    const id_client = req.params.id_client;
    if(!id_client){
        return res.status(400).json({message:"ID client manquant"});
    }
    db.all('SELECT compte.*, type_compte.libelle AS type_nom FROM compte JOIN type_compte ON compte.type = type_compte.id WHERE client_id = ?',[id_client],(err,rows)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        if(rows.length === 0){
            return res.status(404).json({message:"Aucun compte trouvé"});
        }
        return res.status(200).json(rows);
    })
})

router.get("/:id_client/info",verifierToken,async (req,res)=>{
    const id_client = req.params.id_client;
    if(!id_client){
        return res.status(400).json({message:"ID client manquant"});
    }
    db.get('SELECT client.*, employe.email as banquier_email,employe.nom as banquier_nom,employe.prenom as banquier_prenom,employe.poste as banquier_poste FROM client LEFT JOIN employe on client.banquier = employe.id where client.id = ?',[id_client],(err,row)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        if(!row){
            return res.status(404).json({message:"Client non trouvé"});
        }
        return res.status(200).json(row);
    })
})

router.put('/:id/info/modifier', verifierToken, verifierEmploye, async (req, res) => {
  const cibleId = req.params.id;
  const userId = req.user.id;
  const { nom, prenom, email, adresse, telephone, modif_mdp, password } = req.body;
  const hash = modif_mdp && password ? await bcrypt.hash(password, 10) : null;
  
  if (!cibleId || !userId) {
    return res.status(400).json({ message: "ID manquant" });
  }


    if (!nom || !prenom || !email || !adresse || !telephone) {
        return res.status(400).json({ message: "Champs requis manquants." });
    }

    let sql = `UPDATE client SET nom = ?, prenom = ?, email = ?, adresse = ?, telephone = ?`;
    const params = [nom, prenom, email, adresse, telephone];

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
    }
  );
});

router.get("/:id_client/carte",verifierToken,async (req,res)=>{
    const id_client = req.params.id_client;
    if(!id_client){
        return res.status(400).json({message:"ID client manquant"});
    }
    db.all('SELECT * FROM carte WHERE compte_id in (select id from compte where client_id = ?)',[id_client],(err,rows)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        if(rows.length === 0){
            return res.status(404).json({message:"Aucune carte trouvée"});
        }
        return res.status(200).json(rows);
    })
})

router.get("/:id_client/histo",verifierToken,async (req,res)=>{
    const id_client = req.params.id_client;
    if(!id_client){
        return res.status(400).json({message:"ID client manquant"});
    }
    db.all(`
        SELECT
            jour,
            SUM(montant_jour) AS total_montant_jour
        FROM (
            SELECT
                date(date) AS jour,
                montant AS montant_jour
            FROM operation
            WHERE compte_id IN (SELECT id FROM compte WHERE client_id = :id_client)

            UNION ALL

            SELECT
                date(date) AS jour,
                CASE
                    WHEN compte_source_id IN (SELECT id FROM compte WHERE client_id = :id_client) THEN -montant
                    WHEN compte_destination_id IN (SELECT id FROM compte WHERE client_id = :id_client) THEN montant
                    ELSE 0
                END AS montant_jour
            FROM virement
            WHERE compte_source_id IN (SELECT id FROM compte WHERE client_id = :id_client)
            OR compte_destination_id IN (SELECT id FROM compte WHERE client_id = :id_client)
        ) t
        WHERE jour >= date('now', '-3 month')
        GROUP BY jour
        ORDER BY jour asc;
        `, { ':id_client': id_client }, (err,rows)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        if(rows.length === 0){
            return res.status(404).json({message:"Aucune opération trouvée"});
        }
        return res.status(200).json(rows);
    })
})

router.get("/:id_client/beneficiaire",verifierToken,async (req,res)=>{
    const id_client = req.params.id_client;
    if(!id_client){
        return res.status(400).json({message:"ID client manquant"});
    }
    db.all('SELECT beneficiaire.*,compte.numero as numero_compte FROM beneficiaire inner join compte on beneficiaire.compte_id = compte.id WHERE beneficiaire.client_id = ?',[id_client],(err,rows)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        if(rows.length === 0){
            return res.status(404).json({message:"Aucun bénéficiaire trouvé"});
        }
        return res.status(200).json(rows);
    })
})

router.get("/:id_client/last_operations",verifierToken,async (req,res)=>{
    const id_client = req.params.id_client;
    if(!id_client){
        return res.status(400).json({message:"ID client manquant"});
    }
    db.all(`
        SELECT 'Carte' AS type, o.id, o.date, o.montant, o.libelle, c.numero AS numero_compte
        FROM operation o
        JOIN compte c ON o.compte_id = c.id
        WHERE o.compte_id IN (SELECT id FROM compte WHERE client_id = ?)

        UNION ALL

        SELECT 'Virement' AS type, v.id, v.date, -v.montant AS montant, v.libelle AS libelle, c.numero AS numero_compte
        FROM virement v
        JOIN compte c ON v.compte_source_id = c.id
        WHERE v.compte_source_id IN (SELECT id FROM compte WHERE client_id = ?)

        UNION ALL

        SELECT 'Virement' AS type, v.id, v.date, v.montant AS montant, v.libelle AS libelle, c.numero AS numero_compte
        FROM virement v
        JOIN compte c ON v.compte_destination_id = c.id
        WHERE v.compte_destination_id IN (SELECT id FROM compte WHERE client_id = ?)

        ORDER BY date DESC
        LIMIT 10;
        `, [id_client, id_client, id_client], (err, rows)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        if(rows.length === 0){
            return res.status(404).json({message:"Aucune opération trouvée"});
        }
        return res.status(200).json(rows);
    })
})

router.get("/:id_client/compte/:id_compte/carte",verifierToken,async (req,res)=>{
    const {id_client, id_compte} = req.params;
    if(!id_client || !id_compte){
        return res.status(400).json({message:"ID client ou compte manquant"});
    }
    db.all('SELECT * FROM carte WHERE compte_id = ?',[id_compte],(err,rows)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        if(rows.length === 0){
            return res.status(404).json({message:"Aucune carte trouvée pour ce compte"});
        }
        return res.status(200).json(rows);
    })
})

router.get("/:id_client/compte/:id_compte/histo",verifierToken,async (req,res)=>{
    const {id_client, id_compte} = req.params;
    if(!id_client || !id_compte){
        return res.status(400).json({message:"ID client ou compte manquant"});
    }
    db.all(`
        SELECT
            jour,
            SUM(montant_jour) AS total_montant_jour
        FROM (
            SELECT
                date(date) AS jour,
                montant AS montant_jour
            FROM operation
            WHERE compte_id = :id_compte

            UNION ALL

            SELECT
                date(date) AS jour,
                CASE
                    WHEN compte_source_id = :id_compte THEN -montant
                    WHEN compte_destination_id = :id_compte THEN montant
                    ELSE 0
                END AS montant_jour
            FROM virement
            WHERE compte_source_id = :id_compte
            OR compte_destination_id = :id_compte
        ) t
        WHERE jour >= date('now', '-3 month')
        GROUP BY jour
        ORDER BY jour asc;
        `, { ':id_compte': id_compte }, (err,rows)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        if(rows.length === 0){
            return res.status(404).json({message:"Aucune opération trouvée"});
        }
        return res.status(200).json(rows);
    })
})

router.get("/:id_client/compte/:id_compte/last_operations",verifierToken,async (req,res)=>{
    const {id_client, id_compte} = req.params;
    if(!id_client || !id_compte){
        return res.status(400).json({message:"ID client ou compte manquant"});
    }
    db.all(`
        SELECT 'Carte' AS type, o.id, o.date, o.montant, o.libelle, c.numero AS numero_compte
        FROM operation o
        JOIN compte c ON o.compte_id = c.id
        WHERE o.compte_id = :id_compte

        UNION ALL

        SELECT 'Virement' AS type, v.id, v.date, -v.montant AS montant, v.libelle AS libelle, c.numero AS numero_compte
        FROM virement v
        JOIN compte c ON v.compte_source_id = c.id
        WHERE v.compte_source_id = :id_compte

        UNION ALL

        SELECT 'Virement' AS type, v.id, v.date, v.montant AS montant, v.libelle AS libelle, c.numero AS numero_compte
        FROM virement v
        JOIN compte c ON v.compte_destination_id = c.id
        WHERE v.compte_destination_id = :id_compte

        ORDER BY date DESC
        LIMIT 10;
        `, { ':id_compte': id_compte }, (err, rows)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        if(rows.length === 0){
            return res.status(404).json({message:"Aucune opération trouvée"});
        }
        return res.status(200).json(rows);
    })
})

router.get("/:client_id/compte/:id_compte/info",verifierToken,async (req,res)=>{
    const {client_id, id_compte} = req.params;
    if(!client_id || !id_compte){
        return res.status(400).json({message:"ID client ou compte manquant"});
    }
    db.get('SELECT compte.*, type_compte.libelle AS type_nom FROM compte JOIN type_compte ON compte.type = type_compte.id WHERE compte.id = ? AND compte.client_id = ?',[id_compte,client_id],(err,row)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        if(!row){
            return res.status(404).json({message:"Compte non trouvé"});
        }
        return res.status(200).json(row);
    })
})

router.get("/:client_id/beneficiaire/:id_beneficiaire/info",verifierToken,async (req,res)=>{
    const {client_id, id_beneficiaire} = req.params;
    if(!client_id || !id_beneficiaire){
        return res.status(400).json({message:"ID client ou bénéficiaire manquant"});
    }
    db.get('SELECT beneficiaire.*, compte.numero AS numero_compte FROM beneficiaire JOIN compte ON beneficiaire.compte_id = compte.id WHERE beneficiaire.id = ? AND beneficiaire.client_id = ?',[id_beneficiaire,client_id],(err,row)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        if(!row){
            return res.status(404).json({message:"Bénéficiaire non trouvé"});
        }
        return res.status(200).json(row);
    })
})

router.delete("/:client_id/beneficiaire/:id_beneficiaire/supprimer",verifierToken,async (req,res)=>{
    const {client_id, id_beneficiaire} = req.params;
    if(!client_id || !id_beneficiaire){
        return res.status(400).json({message:"ID client ou bénéficiaire manquant"});
    }
    db.run('DELETE FROM beneficiaire WHERE id = ? AND client_id = ?', [id_beneficiaire, client_id], function(err){
        if(err){
            return res.status(500).json({error:err.message});
        }
        if(this.changes === 0){
            return res.status(404).json({message:"Bénéficiaire non trouvé"});
        }
        return res.status(200).json({message:"Bénéficiaire supprimé avec succès"});
    })
})

router.post("/:client_id/beneficiaire/ajouter",verifierToken,async (req,res)=>{
    const {client_id} = req.params;
    const {nom,numero_compte} = req.body;
    if(!client_id || !nom || !numero_compte){
        return res.status(400).json({message:"Tous les champs sont obligatoires"});
    }
    db.get('SELECT id FROM compte WHERE numero = ?', [numero_compte], (err,row)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        if(!row){
            return res.status(404).json({message:"Compte non trouvé"});
        }
        const compte_id = row.id;
        db.run('INSERT INTO beneficiaire (nom,compte_id,client_id) VALUES (?,?,?)',[nom,compte_id,client_id],function(err){
            if(err){
                return res.status(500).json({error:err.message});
            }
            return res.status(201).json({id_beneficiaire:this.lastID});
        })
    })
})

router.post("/:client_id/virement",verifierToken,async (req,res)=>{
    const {client_id} = req.params;
    const {compte_source,compte_dest,montant,reference,date} = req.body;
    if(!client_id || !compte_source || !compte_dest || !montant || !reference || !date){
        return res.status(400).json({message:"Tous les champs sont obligatoires"});
    }
    db.get('SELECT id FROM compte WHERE id = ? AND client_id = ?', [compte_source, client_id], (err,row)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        if(!row){
            return res.status(404).json({message:"Compte source non trouvé"});
        }
        const compte_source_id = row.id;
        db.get('SELECT compte_id FROM beneficiaire WHERE compte_id = ? AND client_id = ?', [compte_dest, client_id], (err,row)=>{
            if(err){
                return res.status(500).json({error:err.message});
            }
            if(!row){
                return res.status(404).json({message:"Compte destination non trouvé"});
            }
            const compte_dest_id = row.compte_id;
            db.run('INSERT INTO virement (compte_source_id,compte_destination_id,montant,libelle,date) VALUES (?,?,?,?,?)',[compte_source_id,compte_dest_id,montant,reference,date],function(err){
                if(err){
                    return res.status(500).json({error:err.message});
                }
                return res.status(201).json({id_virement:this.lastID});
            })
        })
    })
})

router.post("/:client_id/compte/add",verifierToken,verifierEmploye,async (req,res)=>{
    const {client_id} = req.params;
    const type_compte = req.body.type_compte;
    const decouvert = req.body.decouvert || 0; // valeur par défaut si non fourni
    let numero = '';
    for (let i = 0; i < 11; i++) {
        numero += Math.floor(Math.random() * 10); // chiffre de 0 à 9
    }
    if(!client_id || !type_compte){
        return res.status(400).json({message:"Tous les champs sont obligatoires"});
    }
    db.run('INSERT INTO compte (numero,client_id,type,droit_decouvert) VALUES (?,?,?,?)',[numero,client_id,type_compte,decouvert],function(err){
        if(err){
            return res.status(500).json({error:err.message});
        }
        return res.status(201).json({id_compte:this.lastID,numero:numero});
    })
})

router.post("/:client_id/compte/:id_compte/carte/add",verifierToken,verifierEmploye,async (req,res)=>{
    const {client_id, id_compte} = req.params;
    if(!client_id || !id_compte){
        return res.status(400).json({message:"ID client ou compte manquant"});
    }
    db.get('SELECT id FROM compte WHERE id = ? AND client_id = ?', [id_compte, client_id], (err,row)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        if(!row){
            return res.status(404).json({message:"Compte non trouvé"});
        }
        let numero = "" // Génère un numéro de carte aléatoire
        for (let i = 0; i < 16; i++) {
            numero += Math.floor(Math.random() * 10); // chiffre de 0 à 9
        }
        db.run('INSERT INTO carte (numero,compte_id,type,date_expiration) VALUES (?,?,?,?)',[numero,id_compte,"Visa", new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().split('T')[0]],function(err){
            if(err){
                return res.status(500).json({error:err.message});
            }
            return res.status(201).json({id_carte:this.lastID,numero:numero});
        })
    })
})


module.exports = router;