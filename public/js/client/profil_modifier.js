import { setHeader,requireAuthEmploye,requireIsSuperieur,addPopup } from "../utils/index.js";


setHeader();
const parts = window.location.pathname.split('/');
const id = parts[parts.indexOf('client') + 1];

const token = localStorage.getItem('token');

Promise.all([
    fetch(`/api/client/${id}/info`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()),
])
.then(([client]) => {
    // Remplissage du formulaire
    document.querySelector('input[name="nom"]').value = client.nom || '';
    document.querySelector('input[name="prenom"]').value = client.prenom || '';
    document.querySelector('input[name="mail"]').value = client.email || '';
    document.querySelector('input[name="adresse"]').value = client.adresse || '';
    document.querySelector('input[name="telephone"]').value = client.telephone || '';
})
.catch(err => {
    console.error("Erreur lors du chargement des données :", err);
});


const checkbox = document.getElementById('admin');
const passwordBox = document.getElementById('password-box');

if (checkbox && passwordBox) {
    checkbox.addEventListener('change', function () {
        passwordBox.style.display = this.checked ? 'block' : 'none';
    });
}

document.getElementById('register-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Empêche le rechargement de la page

    const nom = document.querySelector('input[name="nom"]').value.trim();
    const prenom = document.querySelector('input[name="prenom"]').value.trim();
    const mail = document.querySelector('input[name="mail"]').value.trim();
    const adresse = document.querySelector('input[name="adresse"]').value.trim();
    const telephone = document.querySelector('input[name="telephone"]').value.trim();
    const modif_mdp = document.getElementById('admin').checked;
    const passwordInput = document.querySelector('input[name="password"]');
    const password = modif_mdp ? passwordInput.value.trim() : null;

    const body = {
        nom,
        prenom,
        email: mail,
        adresse,
        telephone,
        modif_mdp,
        password
    };

    try {
        const response = await fetch(`/api/client/${id}/info/modifier`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const err = await response.json();
            addPopup('Erreur lors de la modification du profil', 'error');
            return;
        }

        addPopup('Profil modifié avec succès', 'success');
        // Redirection ou autre action ici
        window.location.href = `/client/${id}/profil/info`;

    } catch (err) {
        console.error('Erreur lors de la modification du profil :', err);
        addPopup('Erreur lors de la modification du profil', 'error');
        window.location.reload();
    }
});