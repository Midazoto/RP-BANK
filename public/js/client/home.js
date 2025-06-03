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
  fetch(`/api/client/${clientId}/last_operations`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json()),
  fetch(`/api/client/${clientId}/histo`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json())
]).then(([client, comptes, cartes, beneficiaires, operations,histo]) => {
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

  const carteContainer = document.getElementById('liste_cartes');
  carteContainer.innerHTML = ''; // reset

  cartes.forEach(carte => {
    // Format numéro de carte avec un espace tous les 4 chiffres (ex: 1234 5678 9012 3456)
    const formattedNumber = carte.numero.replace(/(.{4})/g, '$1 ').trim();

    // Format date expiration MM/YY
    let formattedExpiration = carte.date_expiration;
    const [year, month] = carte.date_expiration.split('-');
    if (year && month) {
      formattedExpiration = `${month} / ${year.slice(2)}`; // "06 / 30"
    }

    carteContainer.innerHTML += `
      <div class="carte">
        <div class="type">${carte.type}</div>
        <div class="numero">${formattedNumber}</div>
        <div class="expiration">Exp: ${formattedExpiration}</div>
      </div>
    `;
  });
  const beneficiairesTbody = document.getElementById('liste_beneficiaires');
  beneficiairesTbody.innerHTML = ''; // reset

  beneficiaires.forEach(b => {
    beneficiairesTbody.innerHTML += `
      <tr>
        <td>${b.nom}</td>
        <td class="hide-on-small">${b.numero_compte}</td>
        <td>
          <div class="button-row">
            <a href="/client/${client.id}/beneficiaire/${b.id}/virement" class="button">Virement</a>
            <a href="/client/${client.id}/beneficiaire/${b.id}/supprimer" class="button">Supprimer</a>
          </div>
        </td>
      </tr>
    `;
  });
  const opsTbody = document.getElementById('dernieres_ops');
  opsTbody.innerHTML = ''; // reset

  operations.forEach(op => {
    const tr = document.createElement('tr');

    const date = new Date(op.date).toLocaleDateString('fr-FR');

    tr.innerHTML = `
      <td>${date}</td>
      <td>${op.numero_compte}</td>
      <td>${op.libelle}</td>
      <td>
        ${op.montant.toFixed(2)} €
      </td>
      <td>${{
        operation: "Opération",
        virement_envoye: "Virement émis",
        virement_recu: "Virement reçu"
      }[op.type] || op.type}</td>
    `;

    opsTbody.appendChild(tr);
  });
  // tri au cas où (dates dans l'ordre croissant)
histo.sort((a, b) => new Date(a.jour) - new Date(b.jour));

// solde cumulé jour par jour
const cumule = [];
let total = 0;
histo.forEach(({ jour, total_montant_jour }) => {
  total += total_montant_jour;
  cumule.push({ jour, solde: total });
});

// labels et data pour le graphique
const labels = cumule.map(item => {
  const d = new Date(item.jour);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
});
const dataSolde = cumule.map(item => item.solde);

// Optionnel : si soldeTotal (solde actuel) diffère du dernier point, on peut l’ajouter
const derniereDate = cumule.length ? new Date(cumule[cumule.length - 1].jour) : null;
const today = new Date();
if (derniereDate && Math.abs(soldeTotal - cumule[cumule.length - 1].solde) > 1) {
  labels.push(today.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' }));
  dataSolde.push(soldeTotal);
}

// ensuite on génère le graphique avec Chart.js comme avant
const ctx = document.getElementById('graph_soldes').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels,
    datasets: [{
      label: 'Solde (€)',
      data: dataSolde,
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
      tension: 0.3,
      pointRadius: 3,
      pointHoverRadius: 6,
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: {
        title: { display: true, text: 'Date' }
      },
      y: {
        title: { display: true, text: 'Solde (€)' },
        beginAtZero: false
      }
    }
  }
});
});
