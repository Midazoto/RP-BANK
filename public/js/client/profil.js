import { addPopup, requireAuth,setHeader } from '../utils/index.js';


requireAuth();
setHeader();

const token = localStorage.getItem('token');

const parts = window.location.pathname.split('/');
const id = parts[parts.indexOf('client') + 1];

Promise.all([
    fetch(`/api/client/${id}/info`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res => res.json())
])
.then(([profileData]) => {
    const data = profileData;

    const userInfo = document.getElementById("user-info");
    userInfo.innerHTML = `
        <h2>${data.prenom} ${data.nom}</h2>
        <p>Email: ${data.email}</p>
        <p>Adresse: ${data.adresse}</p>
        <p>Téléphone: ${data.telephone}</p>
        <a href="/client/${id}/profil/info/modifier" class="button">Modifier</a>
    `;

    const banquierInfo = document.getElementById("banquier-info");
    banquierInfo.innerHTML = `
        <h3>Banquier : ${data.banquier_prenom} ${data.banquier_nom}</h3>
        <p>Email: ${data.banquier_email}</p>
        <p>Poste: ${data.banquier_poste}</p>
    `;
})
.catch(err => {
    console.error("Erreur lors de la récupération des données de l'employé :", err);
    const userInfo = document.getElementById("user-info");
    userInfo.innerHTML = `
        <p>Erreur lors de la récupération des données de l'employé.</p>
    `;
});

