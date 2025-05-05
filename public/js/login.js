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
          alert("Connexion réussie !");
          // Redirection éventuelle
          // window.location.href = "/accueil.html";
        } else {
          alert(data.message || "Échec de la connexion");
        }

      } catch (err) {
        console.error("Erreur :", err);
        alert("Une erreur est survenue");
      }
    });
  });