import { setHeader,requireAuthEmploye } from "../utils/index.js";

requireAuthEmploye();
setHeader();

const token = localStorage.getItem('token');
const clientId = window.location.pathname.split('/')[4];

Promise.all([
    fetch(`/api/client/${clientId}/info`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json())
])
.then(([client]) => {
    const name_text = document.getElementById('client_name');
    name_text.textContent = `${client.prenom} ${client.nom}`;
    const add_accountButton = document.getElementById('add_account');
    add_accountButton.setAttribute('href', `/employe/action/client/${clientId}/ajouter_compte`);
    const add_cardButton = document.getElementById('add_card');
    add_cardButton.setAttribute('href', `/employe/action/client/${clientId}/ajouter_carte`);
    const consulter_profilButton = document.getElementById('consulter_profil');
    consulter_profilButton.setAttribute('href', `/client/${clientId}/profil/info`);
    const modifier_profilButton = document.getElementById('modifier_profil');
    modifier_profilButton.setAttribute('href', `/client/${clientId}/profil/info/modifier`);
})