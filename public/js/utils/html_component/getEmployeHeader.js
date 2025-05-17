export function getEmployeHeader(){
    return `
            <div class="logo-container">
                <a href="/employe/home" class="logo-container">
                    <img src="/img/logo.webp" alt="Logo" class="logo">
                    <h1>RP Bank - Espace Employé</h1>
                </a>
            </div>
            <nav>
                <ul id="nav-links">
                    <li><a href="/employe/home">Accueil</a></li>
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