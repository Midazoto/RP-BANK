import { setHeader,requireAuth } from "../utils/index.js";

setHeader();
requireAuth();

const token = localStorage.getItem('token');
const clientId = window.location.pathname.split('/')[2];
const compteId = window.location.pathname.split('/')[4];

Promise.all([
    fetch(`/api/client/${clientId}/compte/${compteId}/carte`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json()),
    fetch(`/api/client/${clientId}/compte/${compteId}/histo`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json()),
    fetch(`/api/client/${clientId}/compte/${compteId}/last_operations`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json()),
    fetch(`/api/client/${clientId}/compte/${compteId}/info`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json())
]).then(([cartes,histo,operations,info]) => {
    document.getElementById('num_compte').textContent = info.numero;
    document.getElementById('solde_total').textContent = info.solde.toFixed(2) + ' €'
    document.getElementById('type_compte').textContent = info.type_nom;
    document.getElementById('droit_decouvert').textContent = info.droit_decouvert.toFixed(2) + ' €';

    const carteContainer = document.getElementById('liste_cartes');
    carteContainer.innerHTML = ''; // reset
    if (info.type == 1){
        if(cartes.message){
            console.warn(cartes.message);
            carteContainer.innerHTML = `<div class="carte">Aucune carte associée à ce compte</div>`;
        }
        else {
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
        }
    } else {
        carteContainer.parentElement.hidden=true // Masquer la section si pas de carte
    }

    const opsTbody = document.getElementById('dernieres_ops');
    opsTbody.innerHTML = ''; // reset

    operations.forEach(op => {
        const tr = document.createElement('tr');

        const date = new Date(op.date).toLocaleDateString('fr-FR');

        tr.innerHTML = `
        <td class="hide-on-small">${date}</td>
        <td>${op.libelle}</td>
        <td>
            ${op.montant.toFixed(2)} €
        </td>
        <td class="hide-on-small">${op.type}</td>
        `;

        opsTbody.appendChild(tr);
    });

    const cumule = [];
    let total = info.solde; // Commence à aujourd'hui
    // Copie du tableau pour éviter de muter l’original
    const reversedHisto = [...histo].reverse(); // On parcourt du plus récent au plus ancien

    reversedHisto.forEach(({ jour, total_montant_jour }) => {
    total -= total_montant_jour; // On soustrait pour remonter dans le passé
    cumule.push({ jour, solde: total });
    });

    // On inverse pour afficher les dates dans l'ordre croissant
    cumule.reverse();

    // Labels & data pour le graphique
    const labels = cumule.map(item => {
    const d = new Date(item.jour);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
    });
    const dataSolde = cumule.map(item => item.solde);

    // Ajouter le point d’aujourd’hui si nécessaire
    const today = new Date();
    labels.push(today.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' }));
    dataSolde.push(info.solde);

    // ensuite on génère le graphique avec Chart.js comme avant
    const ctx = document.getElementById('graph_soldes').getContext('2d');
    const styles = getComputedStyle(document.documentElement);
    const colorPrimary = styles.getPropertyValue('--color-primary').trim();
    const colorPrimaryBg = styles.getPropertyValue('--box-border-color').trim();
    let chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels,
        datasets: [{
        label: 'Solde (€)',
        data: dataSolde,
        borderColor: colorPrimary,
        backgroundColor: colorPrimaryBg,
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
    function updateChartColors(chart) {
    const styles = getComputedStyle(document.documentElement);
    const colorPrimary = styles.getPropertyValue('--color-primary').trim();
    const colorPrimaryBg = styles.getPropertyValue('--box-border-color').trim();

    chart.data.datasets[0].borderColor = colorPrimary;
    chart.data.datasets[0].backgroundColor = colorPrimaryBg;
    chart.update();
    }

    // Observer les changements d’attributs sur <html> (ou document.body si tu préfères)
    const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.attributeName === 'data-theme') {
        updateChartColors(chart);
        }
    });
    });

    observer.observe(document.documentElement, { attributes: true });
})