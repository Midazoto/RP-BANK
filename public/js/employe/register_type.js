import { setHeader,addPopup,requireAuthEmploye,getClientRegisterForm,getEmployeRegisterForm } from "../utils/index.js";

requireAuthEmploye();
setHeader();
const token = localStorage.getItem('token');
if (!token) {
    addPopup('Vous devez être connecté pour accéder à cette page.', 'error');
    window.location.href = '/login';
}
document.addEventListener("DOMContentLoaded", () => {
    const type = window.location.pathname.split('/').pop();
    const form = document.getElementById("register-form");

    if (!form) {
        console.error("Le formulaire n'a pas été trouvé.");
        return;
    }
    if(type !== 'client' && type !== 'employe') {
        console.error("Type de formulaire non valide.");
        return;
    }
    if(type === 'client') {
        form.innerHTML=getClientRegisterForm();

        Promise.all([
            fetch('/api/employe/current', {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            }).then(res => res.json()),

            fetch('/api/employe/subordonnes', {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            }).then(res => res.json())
            ])
            .then(([currentUser, subordonnes]) => {
            // Récupérer le <select>
            const select = document.querySelector('select[name="banquier"]');
            if (!select) {
                console.error("Le <select> responsable est introuvable.");
                return;
            }

            // Vider d'abord les options sauf la première (placeholder)
            select.innerHTML = `
                <option value="" disabled selected>Banquier :</option>
            `;

            // Ajouter l'utilisateur courant
            const optionUser = document.createElement('option');
            optionUser.value = currentUser.id;
            optionUser.textContent = `${currentUser.prenom} ${currentUser.nom} — ${currentUser.poste}`;
            select.appendChild(optionUser);

            // Ajouter les subordonnés
            subordonnes.forEach(e => {
                const option = document.createElement('option');
                option.value = e.id;
                option.textContent = `${e.prenom} ${e.nom} — ${e.poste}`;
                select.appendChild(option);
            });
            })
            .catch(err => {
            console.error("Erreur lors de la récupération des employés :", err);
        });
    }
    else if(type === 'employe') {
        form.innerHTML=getEmployeRegisterForm();
        Promise.all([
            fetch('/api/employe/current', {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            }).then(res => res.json()),

            fetch('/api/employe/subordonnes', {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            }).then(res => res.json())
            ])
            .then(([currentUser, subordonnes]) => {
            // Récupérer le <select>
            const select = document.querySelector('select[name="responsable"]');
            if (!select) {
                console.error("Le <select> responsable est introuvable.");
                return;
            }

            // Vider d'abord les options sauf la première (placeholder)
            select.innerHTML = `
                <option value="" disabled selected>Responsable :</option>
            `;

            if(currentUser.resp_id === null) {
                const no_resp = document.createElement('option');
                no_resp.value = 'null';
                no_resp.textContent = "Pas de responsable";
                select.appendChild(no_resp);
            }


            // Ajouter l'utilisateur courant
            const optionUser = document.createElement('option');
            optionUser.value = currentUser.id;
            optionUser.textContent = `${currentUser.prenom} ${currentUser.nom} — ${currentUser.poste}`;
            select.appendChild(optionUser);

            // Ajouter les subordonnés
            subordonnes.forEach(e => {
                const option = document.createElement('option');
                option.value = e.id;
                option.textContent = `${e.prenom} ${e.nom} — ${e.poste}`;
                select.appendChild(option);
            });
            })
            .catch(err => {
            console.error("Erreur lors de la récupération des responsables :", err);
        });
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // empêcher l'envoi classique du formulaire

        const nom = form.nom.value;
        const prenom = form.prenom.value;
        const email = form.mail.value;
        const password = form.password.value;
        var body = JSON.stringify({ nom, prenom, email, password });
        if (type === 'employe'){
            const poste = form.poste ? form.poste.value : null;
            const resp_id = form.responsable.value === 'null' ? null : parseInt(form.responsable.value);
            body = JSON.stringify({ nom, prenom, email, password, poste, resp_id });
        }
        else if (type === 'client'){
            const adresse = form.adresse.value;
            const telephone = form.telephone.value;
            const banquier = parseInt(form.banquier.value);
            body = JSON.stringify({ nom, prenom, email, password, adresse, telephone, banquier });
        }
        try {
            const response = await fetch(`/api/auth/register/${type}`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: body
            });

            const data = await response.json();

            if (response.ok) {
                // Connexion réussie : stocke le token par exemple
                addPopup("Le compte à bien été créé", "success");
                if (type === "client") {
                    const id_client = data.id;
                    try {
                        const compteResponse = await fetch(`/api/client/${id_client}/compte/add`, {
                            method: "POST",
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ type_compte: "Compte Courant" })
                        });

                        const compteData = await compteResponse.json();
                        if (!compteResponse.ok) {
                            console.error("Erreur à la création du compte client :", compteData);
                            addPopup(compteData.message || "Erreur lors de la création du compte bancaire", "error");
                            return;
                        }
                    } catch (compteError) {
                        console.error("Exception lors de la création du compte client :", compteError);
                        addPopup("Erreur lors de la création du compte bancaire", "error");
                        return;
                    }
                }
                // Redirection éventuelle
                window.location.href = "/";
            } else {
                addPopup(data.message || "Échec de la connexion", "error");
                window.location.reload();
            }

        } catch (err) {
            console.error("Erreur :", err);
            addPopup("Erreur lors de la connexion", "error");
            window.location.reload();
        }
    });
})