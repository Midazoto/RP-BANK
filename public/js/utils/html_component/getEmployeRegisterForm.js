export function getEmployeRegisterForm(){
    return `
            <h1>Création du compte employe :</h1>
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
                <input type="text" name="poste" placeholder="Poste" required>
                <i class='bx bxs-briefcase-alt-2' ></i>
            </div>
            <div class="input-box">
                <select name="responsable" aria-label="Responsable" required>
                    <option value="" disabled selected>Responsable :</option>
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