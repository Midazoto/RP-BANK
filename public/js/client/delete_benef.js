import { addPopup, requireAuth,setHeader } from '../utils/index.js';


requireAuth();
setHeader();

const token = localStorage.getItem('token');
if (!token) {
    addPopup('Vous devez être connecté pour accéder à cette page.', 'error');
    window.location.href = '/login';
}

const clientId = window.location.pathname.split('/')[2];
const beneficiaireId = window.location.pathname.split('/')[4];
if (!clientId || !beneficiaireId) {
    addPopup('ID de client ou de bénéficiaire manquant.', 'error');
    window.location.href = document.referrer;
}

Promise.all([
    fetch(`/api/client/${clientId}/beneficiaire/${beneficiaireId}/info`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }}).then(r => r.json())

]).then(([infoBenef]) => {
    console.log('Informations du bénéficiaire:', infoBenef);
    document.getElementById('benef_name').textContent = 'Nom : '+infoBenef.nom;
    document.getElementById('num_compte').textContent = 'N° de compte : '+infoBenef.numero_compte;

}).catch(err => {
    console.error('Erreur lors de la récupération des données :', err);
    addPopup('Une erreur est survenue lors de la récupération des données.', 'error');
});

document.addEventListener('DOMContentLoaded', () => {
    const btnYes = document.getElementById('LogoutYes');
    const btnNo = document.getElementById('LogoutNo');

    btnYes.addEventListener('click', () => {
        // Supprimer le token de session
        fetch(`/api/client/${clientId}/beneficiaire/${beneficiaireId}/supprimer`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (!response.ok) {
                addPopup('Erreur lors de la suppression du bénéficiaire.', 'error');
            }
            else {
                addPopup('Le bénéficiaire a bien été supprimé', 'success');
            }
        }).catch(err => {
            console.error('Erreur lors de la suppression du bénéficiaire :', err);
            addPopup('Une erreur est survenue lors de la suppression du bénéficiaire.', 'error');
        });

        // Redirection vers la page d'accueil ou de login
        window.location.href = document.referrer;
    });

    btnNo.addEventListener('click', () => {
        // Retour à la page précédente ou à un dashboard
        window.history.back();
    });
});