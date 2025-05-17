export function getClientRegisterForm(){
    return `
            <h1>Création du compte client :</h1>
            <div class="input-box">
                <input type="text" name="nom" placeholder="Nom" required>
                <i class="bx bxs-user"></i>
            </div>
            <div class="input-box">
                <input type="text" name="prenom" placeholder="Prenom" required>
                <i class="bx bxs-user"></i>
            </div>
            <div class="input-box">
                <input type="text" name="mail" placeholder="Email" required>
                <i class='bx bxs-envelope'></i>
            </div>
            <div class="input-box">
                <input type="text" name="adresse" placeholder="Adresse" required>
                <i class='bx bxs-home' ></i>
            </div>
            <div class="input-box">
                <input type="text" name="telephone" placeholder="N° de téléphone" required>
                <i class='bx bxs-phone' ></i>
            </div>
            <div class="input-box">
                <select name="banquier" aria-label="Banquier" required>
                    <option value="" disabled selected>Banquier :</option>
                </select>
                <i class='bx bxs-user-badge' ></i>
            </div>
            <div class="input-box">
                <input type="password" name="password" placeholder="Mot de passe" required>
                <i class="bx bxs-lock-alt"></i>
            </div>
            <button type="submit" class="button">Se connecter</button>
        `;
}