import { addPopup,setHeader } from "./utils/index.js";

setHeader();
document.addEventListener("DOMContentLoaded", () => {
    const type = window.location.pathname.split('/').pop();
    const form = document.getElementById("login-form");

    form.addEventListener("submit", async (e) => {
      e.preventDefault(); // empêcher l'envoi classique du formulaire

      const email = form.mail.value;
      const password = form.password.value;

      try {
        const response = await fetch(`/api/auth/login/${type}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
          // Connexion réussie : stocke le token par exemple
          localStorage.setItem("token", data.token);
          addPopup("Vous êtes maintenant connecté.", "success");
          // Redirection éventuelle
          window.location.href = `/${type}/home`;
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
  });