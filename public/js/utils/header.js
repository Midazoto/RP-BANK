import { showPopup } from "./index.js";

// Fonction pour l'état anonyme (non connecté)
function headerAnonymous() {
    const header = document.getElementById('main-header');

    header.innerHTML = `
        <div class="logo-container">
            <a href="/" class="logo-container">
                <img src="/img/logo.webp" alt="Logo" class="logo">
                <h1>RP Bank</h1>
            </a>
        </div>
        <nav>
            <ul id="nav-links">
                <li><a href="/">Accueil</a></li>
                <li><a href="/login">Se connecter</a></li>
            </ul>
        </nav>
    `;
}

// Fonction pour le header de l'employé
function headerEmploye() {
    const header = document.getElementById('main-header');

    header.innerHTML = `
        <div class="logo-container">
            <a href="/" class="logo-container">
                <img src="/img/logo.webp" alt="Logo" class="logo">
                <h1>RP Bank - Espace Employé</h1>
            </a>
        </div>
        <nav>
            <ul id="nav-links">
                <li><a href="/dashboard">Tableau de bord</a></li>
                <li><a href="/gestion">Gestion</a></li>
                <li><a href="/logout">Déconnexion</a></li>
            </ul>
        </nav>
    `;
}

// Fonction pour le header du client
function headerClient() {
    const header = document.getElementById('main-header');

    header.innerHTML = `
        <div class="logo-container">
            <a href="/" class="logo-container">
                <img src="/img/logo.webp" alt="Logo" class="logo">
                <h1>RP Bank - Espace Client</h1>
            </a>
        </div>
        <nav>
            <ul id="nav-links">
                <li><a href="/produits">Produits</a></li>
                <li><a href="/profil">Mon compte</a></li>
                <li><a href="/logout">Déconnexion</a></li>
            </ul>
        </nav>
    `;
}

// Fonction qui détermine quel header afficher et injecte les styles
export function setHeader() {
    // Injecte les assets CSS pour la page

    // Récupère les informations de l'utilisateur
    fetch('/api/auth/user', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token') // ou depuis un cookie
        }
    })
    .then(res => res.json())
    .then(user => {
        if (user.isLoggedIn) {
            if (user.type === 'client') {
                headerClient(); // Appelle la fonction pour le header client
            } else if (user.type === 'employe') {
                headerEmploye(); // Appelle la fonction pour le header employé
            }
        } else {
            headerAnonymous(); // Appelle la fonction pour l'état anonyme
        }
    })
    .catch(err => {
        console.error('Erreur lors de la récupération des données', err);
        headerAnonymous(); // Affiche l'état anonyme en cas d'erreur
    });
    showPopup(); // Affiche le popup s'il y en a un dans le localStorage
}