import { setHeader,requireAuthEmploye,requireIsSuperieur,addPopup } from "../utils/index.js";


requireAuthEmploye();
setHeader();
const parts = window.location.pathname.split('/');
const id = parts[parts.indexOf('employe') + 1];
requireIsSuperieur(id, '/employe/home');

const token = localStorage.getItem('token');

Promise.all([
    fetch(`/api/employe/profil/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()),

    fetch('/api/employe/current', {
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()),

    fetch('/api/employe/subordonnes', {
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json())
])
.then(([employe, currentUser, subordonnes]) => {
    // Remplissage du formulaire
    document.querySelector('input[name="nom"]').value = employe.nom || '';
    document.querySelector('input[name="prenom"]').value = employe.prenom || '';
    document.querySelector('input[name="mail"]').value = employe.email || '';
    document.querySelector('input[name="poste"]').value = employe.poste || '';
    // document.querySelector('input[name="password"]').value = ''; // Champ volontairement vide

    const select = document.querySelector('select[name="responsable"]');
    select.innerHTML = ''; // Vider d'abord le select (au cas où)

    if (employe.id === currentUser.id) {
        // Cas où l'employé modifie son propre profil : afficher uniquement son supérieur
        if (employe.r_id !== null) {
            const option = document.createElement('option');
            option.value = employe.resp_id;
            option.textContent = `${employe.r_prenom} ${employe.r_nom} — ${employe.r_poste}`;
            option.selected = true;
            select.appendChild(option);
            select.disabled = true;
        } else {
            // Aucun responsable (cas possible pour l'admin ?)
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Aucun responsable';
            option.selected = true;
            select.appendChild(option);
            select.disabled = true;
        }
    } else {
        // Cas classique : liste de choix possible
        const optionUser = document.createElement('option');
        optionUser.value = currentUser.id;
        optionUser.textContent = `${currentUser.prenom} ${currentUser.nom} — ${currentUser.poste}`;
        select.appendChild(optionUser);

        subordonnes.forEach(e => {
            if (e.id != id){
                const option = document.createElement('option');
                option.value = e.id;
                option.textContent = `${e.prenom} ${e.nom} — ${e.poste}`;
                select.appendChild(option);
            }
        });

        // Sélectionner le bon responsable
        console.log(employe.resp_id);
        if (employe.resp_id) {
            const options = select.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value == employe.resp_id) {
                    options[i].selected = true;
                    break;
                }
            }
        }
    }
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
    const poste = document.querySelector('input[name="poste"]').value.trim();
    const responsable = document.querySelector('select[name="responsable"]').value;
    const modif_mdp = document.getElementById('admin').checked;
    const passwordInput = document.querySelector('input[name="password"]');
    const password = modif_mdp ? passwordInput.value.trim() : null;

    const body = {
        nom,
        prenom,
        email: mail,
        poste,
        responsable,
        modif_mdp,
        password
    };

    try {
        const response = await fetch(`/api/employe/profil/${id}/modifier`, {
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
        window.location.href = '/employe/home';

    } catch (err) {
        console.error('Erreur lors de la modification du profil :', err);
        addPopup('Erreur lors de la modification du profil', 'error');
    }
});