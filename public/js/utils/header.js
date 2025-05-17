import { showPopup,getAnonymousHeader,getClientHeader,getEmployeHeader } from "./index.js";

// Fonction pour l'état anonyme (non connecté)
function headerAnonymous() {
    const header = document.getElementById('main-header');

    header.innerHTML = getAnonymousHeader();
}

// Fonction pour le header de l'employé
function headerEmploye() {
    const header = document.getElementById('main-header');

    header.innerHTML = getEmployeHeader();
}

// Fonction pour le header du client
function headerClient() {
    const header = document.getElementById('main-header');

    header.innerHTML = getClientHeader();
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