export function requireAuth(redirectUrl = '/login') {
    const token = localStorage.getItem('token');

    if (!token) {
        localStorage.setItem('popupMessage', JSON.stringify({
            message: 'Vous devez être connecté pour accéder à cette page.',
            type: 'error'
        }));
        window.location.href = redirectUrl;
        return;
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
            localStorage.setItem('popupMessage', JSON.stringify({
                message: 'Vous devez être connecté pour accéder à cette page.',
                type: 'error'
            }));
            window.location.href = redirectUrl;
        }
    })
    .catch(err => {
        console.error('Erreur de vérification de session', err);
        localStorage.setItem('popupMessage', JSON.stringify({
            message: 'Vous devez être connecté pour accéder à cette page.',
            type: 'error'
        }));
        window.location.href = redirectUrl;
    });
}