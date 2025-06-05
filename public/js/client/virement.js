import { addPopup, requireAuth,setHeader } from '../utils/index.js';


requireAuth();
setHeader();

const token = localStorage.getItem('token');
if (!token) {
    addPopup('Vous devez être connecté pour accéder à cette page.', 'error');
    window.location.href = '/login';
}

const clientId = window.location.pathname.split('/')[2];

document.addEventListener('DOMContentLoaded', () => {
    Promise.all([
        fetch(`/api/client/${clientId}/compte`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json()),
        fetch(`/api/client/${clientId}/beneficiaire`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json()),
    ]).then(([comptes, beneficiaires]) => {
        const compteSelect = document.getElementById('compte');
        if (!compteSelect) {
            console.error("Le sélecteur de compte n'a pas été trouvé.");
            return;
        }
        comptes.forEach(c => {
            compteSelect.innerHTML += `<option value="${c.id}">${c.type_nom} - ${c.solde.toFixed(2)} €</option>`;
        });

        const beneficiaireSelect = document.getElementById('beneficiaire');
        if (!beneficiaireSelect) {
            console.error("Le sélecteur de bénéficiaire n'a pas été trouvé.");
            return;
        }
        beneficiaires.forEach(b => {
            beneficiaireSelect.innerHTML += `<option value="${b.compte_id}">${b.nom} - ${b.numero_compte}</option>`;
        });

        const urlParams = new URLSearchParams(window.location.search);
        const beneficiaireId = urlParams.get("beneficiaire_id");
        if (beneficiaireId) {
            const option = beneficiaireSelect.querySelector(`option[value="${beneficiaireId}"]`);
            if (option) {
                option.selected = true;
            } else {
                console.warn(`Aucun bénéficiaire trouvé avec l'ID ${beneficiaireId}`);
            }
        }
    })

    const form = document.getElementById('virement-form');
    if (!form) {
        console.error("Le formulaire n'a pas été trouvé.");
        return;
    }
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const compte_source = form.source.value;
        const compte_dest = form.destinataire.value;
        const montant = form.montant.value;
        const reference = form.ref.value;
        const date = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
        const data = JSON.stringify({
                compte_source,
                compte_dest,
                montant: parseFloat(montant),
                reference,
                date
            })
        
        console.log('Données du virement:', data);

        fetch(`/api/client/${clientId}/virement`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: data
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || 'Erreur lors du virement');
                });
            }
            return response.json();
        })
        .then(data => {
            addPopup('Virement effectué avec succès !', 'success');
            window.location.href = document.referrer;
        })
    });
});