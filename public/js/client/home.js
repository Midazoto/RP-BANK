import { setHeader } from "../utils/index.js";

setHeader();

const token = localStorage.getItem('token');
const clientId = window.location.pathname.split('/')[2];

Promise.all([
  fetch(`/api/client/${clientId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json()),
  fetch(`/api/client/${clientId}/compte`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json()),
  fetch(`/api/client/${clientId}/carte`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json()),
  fetch(`/api/client/${clientId}/beneficiaire`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json()),
  fetch(`/api/client/${clientId}/operations`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json()),
  fetch(`/api/client/${clientId}/solde-evolution`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json())
]).then(([client, comptes, cartes, beneficiaires, operations, evolution]) => {
  // Profil
  document.getElementById('consulter_profil').href = `/client/${client.id}/profil/info`;
  document.getElementById('modifier_profil').href = `/client/${client.id}/profil/info/modifier`;

  // Comptes (table)
  const compteTbody = document.getElementById('liste_comptes');
    compteTbody.innerHTML = ''; // reset
    console.log(comptes);
    comptes.forEach(c => {
    compteTbody.innerHTML += `
        <tr>
        <td>${c.numero}</td>
        <td>${c.solde.toFixed(2)} €</td>
        <td class="hide-on-small">${c.type_nom}</td>
        <td class="hide-on-small">${c.droit_decouvert}€</td>
        <td>
            <div class="button-row">
                <a href="/client/${client.id}/compte/${c.id}/Consulter" class="button">Consulter</a>
                <a href="/client/${client.id}/compte/${c.id}/Modifier" class="button hide-on-small">Modifier</a>
            </div>
        </tr>
    `;
    });

  // Solde total
  const soldeTotal = comptes.reduce((acc, c) => acc + c.solde, 0);
  console.log('Solde total:', soldeTotal);
  document.getElementById('solde_total').textContent = soldeTotal.toFixed(2) + ' €';

});
