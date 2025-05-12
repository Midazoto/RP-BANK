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
                <li>
                    <button id="theme-toggle" title="Changer de thème">
                        <span class="icon bx bx-sun"></span>
                        <span class="slider"></span>
                        <span class="icon bx bx-moon"></span>
                    </button>
                </li>
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
                <li>
                    <button id="theme-toggle" title="Changer de thème">
                        <span class="icon bx bx-sun"></span>
                        <span class="slider"></span>
                        <span class="icon bx bx-moon"></span>
                    </button>
                </li>
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
                <li>
                    <button id="theme-toggle" title="Changer de thème">
                        <span class="icon bx bx-sun"></span>
                        <span class="slider"></span>
                        <span class="icon bx bx-moon"></span>
                    </button>
                </li>
            </ul>
        </nav>
    `;
}

// Fonction qui détermine quel header afficher et injecte les styles
export function setHeader() {



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
        const toggleBtn = document.getElementById("theme-toggle");
        const currentTheme = localStorage.getItem("theme") || "light";

        // Applique le thème au chargement
        document.documentElement.setAttribute("data-theme", currentTheme);

        toggleBtn.addEventListener("click", () => {
            const newTheme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
        });
    })
    .catch(err => {
        console.error('Erreur lors de la récupération des données', err);
        headerAnonymous(); // Affiche l'état anonyme en cas d'erreur
    });
    showPopup(); // Affiche le popup s'il y en a un dans le localStorage
}