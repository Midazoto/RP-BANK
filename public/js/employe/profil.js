import { setHeader,requireAuthEmploye } from "../utils/index.js";


requireAuthEmploye();
setHeader();

const token = localStorage.getItem('token');

const parts = window.location.pathname.split('/');
const id = parts[parts.indexOf('employe') + 1];

Promise.all([
    fetch(`/api/employe/profil/${id}/isSuperieur`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res => res.json()),

    fetch(`/api/employe/profil/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res => res.json())
])
.then(([isSuperieurData, profileData]) => {
    const isSuperieur = isSuperieurData.isSuperieur;
    const data = profileData;

    const userInfo = document.getElementById("user-info");
    userInfo.innerHTML = `
        <h2>${data.prenom} ${data.nom}</h2>
        <p>Email: ${data.email}</p>
        <p>Poste: ${data.poste}</p>
    `;

    if (isSuperieur) {
        userInfo.innerHTML += `
        <a href="/employe/${id}/profil/modifier" class="button">Modifier</a>
        `;
    }

    if (data.resp_id !== null) {
        const responsableInfo = document.getElementById("responsable-info");
        responsableInfo.innerHTML = `
            <h3>Responsable : ${data.r_prenom} ${data.r_nom}</h3>
            <p>Email: ${data.r_email}</p>
            <p>Poste: ${data.r_poste}</p>
        `;
    } else {
        const responsableInfo = document.getElementById("responsable-info");
        responsableInfo.innerHTML = `
            <p>Aucun responsable assigné.</p>
        `;
    }
})
.catch(err => {
    console.error("Erreur lors de la récupération des données de l'employé :", err);
    const userInfo = document.getElementById("user-info");
    userInfo.innerHTML = `
        <p>Erreur lors de la récupération des données de l'employé.</p>
    `;
});

