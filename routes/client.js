const express = require("express");
const router = express.Router();
const db = require("../db");
const verifierToken = require("../middleware/authMiddleware");
const verifierEmploye = require("../middleware/empMiddleware");

router.get("/:id_client/compte",verifierToken,(req,res)=>{
    return res.status(500).json({message:"Route non disponible"});
})

router.get("/:id_client/compte/:id_compte",verifierToken,(req,res)=>{
    return res.status(500).json({message:"Route non disponible"});
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