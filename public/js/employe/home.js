import { setHeader,requireAuthEmploye } from "../utils/index.js";

requireAuthEmploye();
setHeader();

const token = localStorage.getItem('token');

Promise.all([
    fetch('/api/employe/current', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res => res.json()),
    fetch('/api/employe/getClient',{
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res => res.json())
]).then(([currentUser,list_client]) => {
    const consulter_profil = document.getElementById('consulter_profil');
    const modifier_profil = document.getElementById('modifier_profil');
    consulter_profil.setAttribute('href', `/employe/${currentUser.id}/profil`);
    modifier_profil.setAttribute('href', `/employe/${currentUser.id}/profil/modifier`);
    const tab_client = document.getElementById('client_list');
    list_client.forEach(client => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${client.nom}</td>
            <td>${client.prenom}</td>
            <td class="hide-on-small">${client.nb_compte}</td>
            <td>
                <div class="button-row">
                    <a href="/client/${client.id}/profil" class="button">Consulter</a>
                </div>
            </td>
        `;
        tab_client.appendChild(tr);
    });
})
