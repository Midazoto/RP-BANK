import { addPopup,setHeader,requireAuthEmploye } from "../utils/index.js";


requireAuthEmploye();
setHeader();

const token = localStorage.getItem('token');
const parts = window.location.pathname.split('/');
const clientId = parts[parts.indexOf('client') + 1];

Promise.all([
    fetch(`/api/client/${clientId}/compte`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json())
])
.then(([comptes]) => {
    const comptesSelect = document.getElementById('compte');
    console.log(comptes);
    comptes.forEach(compte => {
        const option = document.createElement('option');
        option.value = compte.id;
        option.textContent = `${compte.numero} - ${compte.solde} €`;
        comptesSelect.appendChild(option);
    });
})
.catch(err => {
    console.error("Erreur lors du chargement des types de compte :", err);
});

document.getElementById('add_account_form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Empêche le rechargement de la page

    const compte = document.getElementById('compte').value;

    try {
        const response = await fetch(`/api/client/${clientId}/compte/${compte}/carte/add`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
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