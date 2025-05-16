import { setHeader,requireAuthEmploye } from "../utils/index.js";


requireAuthEmploye();
setHeader();

const token = localStorage.getItem('token');

const id = window.location.pathname.split('/').pop();

fetch('/api/employe/profil/' + id, {
    headers: {
        'Authorization': `Bearer ${token}`
    }
    /*
    example of response:
    {
        "id": 4,
        "email": "alagane@rpbank.lol",
        "nom": "Lagane",
        "prenom": "Antoine",
        "poste": "Stagiaire Café",
        "resp_id": 3,
        "r_email": "eheulot@rpbank.lol",
        "r_nom": "Heulot",
        "r_prenom": "Evan",
        "r_poste": "DRH"
    }

    */
})
.then(res => res.json())
.then(data => {
    const userInfo = document.getElementById("user-info");
    userInfo.innerHTML = `
        <h2>${data.prenom} ${data.nom}</h2>
        <p>Email: ${data.email}</p>
        <p>Poste: ${data.poste}</p>
        <p>Responsable: ${data.r_prenom} ${data.r_nom} (${data.r_poste})</p>
    `;
})
.catch(err => {
    console.error("Erreur lors de la récupération des données de l'employé :", err);
    const userInfo = document.getElementById("user-info");
    userInfo.innerHTML = `
        <p>Erreur lors de la récupération des données de l'employé.</p>
    `;
});

