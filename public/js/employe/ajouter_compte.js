import { addPopup,setHeader,requireAuthEmploye } from "../utils/index.js";


requireAuthEmploye();
setHeader();

const token = localStorage.getItem('token');
const parts = window.location.pathname.split('/');
const clientId = parts[parts.indexOf('client') + 1];

Promise.all([
    fetch(`/api/stat/type_compte`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json())
])
.then(([typesCompte]) => {
    const typeCompteSelect = document.getElementById('type_compte');
    console.log(typesCompte);
    typesCompte.forEach(type => {
        const option = document.createElement('option');
        option.value = type.id;
        option.textContent = type.libelle;
        typeCompteSelect.appendChild(option);
    });
})
.catch(err => {
    console.error("Erreur lors du chargement des types de compte :", err);
});

document.getElementById('add_account_form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Empêche le rechargement de la page

    const typeCompte = document.getElementById('type_compte').value;
    const decouvert = document.querySelector('input[name="decouvert_autorise"]').value.trim();

    const body = {
        type_compte: typeCompte,
        decouvert: parseFloat(decouvert)
    };

    try {
        const response = await fetch(`/api/client/${clientId}/compte/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            addPopup("Compte ajouté avec succès !");
            setTimeout(() => {
                window.location.href = `/employe/action/client/${clientId}`;
            }, 2000);
        } else {
            const errorData = await response.json();
            addPopup(`Erreur : ${errorData.message}`);
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout du compte :", error);
        addPopup("Erreur lors de l'ajout du compte.");
    }
});