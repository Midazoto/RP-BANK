import { addPopup } from "./popup.js";

export function requireAuth(redirectUrl = '/login') {
    const token = localStorage.getItem('token');

    if (!token) {
        addPopup('Vous devez être connecté pour accéder à cette page.', 'error');
        window.location.href = redirectUrl;
    }

    // Vérifie la validité du token
    fetch('/api/auth/user', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(res => res.json())
    .then(user => {
        if (!user.isLoggedIn) {
            addPopup('Vous devez être connecté pour accéder à cette page.', 'error');
            window.location.href = redirectUrl;
        }
    })
    .catch(err => {
        console.error('Erreur de vérification de session', err);
        addPopup('Vous devez être connecté pour accéder à cette page.', 'error');
        window.location.href = redirectUrl;
    });
}