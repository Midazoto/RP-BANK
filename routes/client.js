const express = require("express");
const router = express.Router();
const db = require("../db");
const verifierToken = require("../middleware/authMiddleware");
const verifierEmploye = require("../middleware/empMiddleware");
const verifierClient = require("../middleware/profilCliMiddleware");

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

router.post("/:client_id/compte/add",verifierToken,verifierEmploye,async (req,res)=>{
    const {client_id} = req.params;
    const type_compte = req.body.type_compte;
    let numero = '';
    for (let i = 0; i < 11; i++) {
        numero += Math.floor(Math.random() * 10); // chiffre de 0 à 9
    }
    if(!client_id || !type_compte){
        return res.status(400).json({message:"Tous les champs sont obligatoires"});
    }
    db.run('INSERT INTO compte (numero,client_id,type) VALUES (?,?,?)',[numero,client_id,type_compte],function(err){
        if(err){
            return res.status(500).json({error:err.message});
        }
        return res.status(201).json({id_compte:this.lastID,numero:numero});
    })
})


module.exports = router;