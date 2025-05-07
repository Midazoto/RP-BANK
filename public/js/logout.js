import { addPopup, requireAuth,setHeader } from './utils/index.js';


requireAuth();
setHeader();
document.addEventListener('DOMContentLoaded', () => {
    const btnYes = document.getElementById('LogoutYes');
    const btnNo = document.getElementById('LogoutNo');

    btnYes.addEventListener('click', () => {
        // Supprimer le token de session
        localStorage.removeItem('token');
        addPopup('Vous êtes maintenant déconnecté.', 'success');

        // Redirection vers la page d'accueil ou de login
        window.location.href = '/';
    });

    btnNo.addEventListener('click', () => {
        // Retour à la page précédente ou à un dashboard
        window.history.back();
    });
});