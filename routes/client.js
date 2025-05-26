const express = require("express");
const router = express.Router();
const db = require("../db");
const verifierToken = require("../middleware/authMiddleware");
const verifierEmploye = require("../middleware/EmpMiddleware");
const verifierClient = require("../middleware/profilCliMiddleware");

router.get("/:id_client/compte",verifierToken,verifierClient,async (req,res)=>{
    const id_client = req.params.id_client;
    if(!id_client){
        return res.status(400).json({message:"ID client manquant"});
    }
    db.all('SELECT * FROM compte WHERE client_id = ?',[id_client],(err,rows)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        if(rows.length === 0){
            return res.status(404).json({message:"Aucun compte trouvé"});
        }
        return res.status(200).json(rows);
    })
})

router.get("/:id_client/compte/:id_compte",verifierToken,(req,res)=>{

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