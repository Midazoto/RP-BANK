export function getClientHeader(){
    return `
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