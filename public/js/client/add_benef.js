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
    const form = document.getElementById('add-benef-form');
    if (!form) {
        console.error("Le formulaire n'a pas été trouvé.");
        return;
    }
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nom = form.nom.value;
        const numero_compte = form.num_compte.value;
        if (!nom || !numero_compte) {
            addPopup('Veuillez remplir tous les champs.', 'error');
            window.location.reload();
        } else {
            fetch(`/api/client/${clientId}/beneficiaire/ajouter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ nom, numero_compte })
            }).then(response => {
                if (!response.ok) {
                    console.error(response);
                    addPopup('Erreur lors de l\'ajout du bénéficiaire.', 'error');
                    window.location.reload();

                }
                else {
                    addPopup('Le bénéficiaire a bien été ajouté.', 'success');
                    window.location.href = document.referrer;
                }
            })
        }
    });
});