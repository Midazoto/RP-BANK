// Fonction pour l'état anonyme (non connecté)
function headerAnonymous() {
    const navLinks = document.getElementById('nav-links');


    // Ajouter les liens pour les utilisateurs non connectés
    navLinks.innerHTML = `
        <li><a href="/">Accueil</a></li>
        <li><a href="/login">Se connecter</a></li>
    `;
}

// Fonction pour le header de l'employé
function headerEmploye() {
    const navLinks = document.getElementById('nav-links');


    // Ajouter les liens spécifiques pour un employé
    navLinks.innerHTML = `
        <li><a href="/dashboard">Tableau de bord</a></li>
        <li><a href="/gestion">Gestion</a></li>
        <li><a href="/logout">Déconnexion</a></li>
    `;
}

// Fonction pour le header du client
function headerClient() {
    const navLinks = document.getElementById('nav-links');


    // Ajouter les liens spécifiques pour un client
    navLinks.innerHTML = `
        <li><a href="/produits">Produits</a></li>
        <li><a href="/profil">Mon compte</a></li>
        <li><a href="/logout">Déconnexion</a></li>
    `;
}


fetch('/api/auth/user', {
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token') // ou depuis un cookie
    }
})
.then(res => res.json())
.then(user => {
    if (user.isLoggedIn) {
        console.log(`Utilisateur connecté, type: ${user.type}`); // Affiche 'client' ou 'employe'
        if (user.type === 'client') {
            headerClient(); // Appelle la fonction pour le header client
        } else if (user.type === 'employe') {
            headerEmploye(); // Appelle la fonction pour le header employé
        }
    } else {
        console.log('Utilisateur non connecté');
        headerAnonymous(); // Appelle la fonction pour l'état anonyme
        // Rediriger vers la page de login ou afficher un message
    }
})
.catch(err => {
    console.error('Erreur lors de la récupération des données', err);
});