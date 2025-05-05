// Fonction pour récupérer les données de l'API et afficher les cartes
function fetchAndDisplayPersonnes() {
    // Utilisation de fetch pour récupérer les données de l'API
    fetch('http://localhost:3630/api/test')
        .then(response => response.json())  // Convertir la réponse en JSON
        .then(data => {
            const container = document.getElementById('personnes-container');
            container.innerHTML = ''; // Effacer le contenu existant

            // Boucle pour créer une carte pour chaque personne
            data.forEach(personne => {
                // Créer un élément div pour chaque carte
                const card = document.createElement('div');
                card.classList.add('card');

                // Ajouter les informations de la personne dans la carte
                card.innerHTML = `
                    <h2>${personne.prenom} ${personne.nom}</h2>
                    <p>Age: ${personne.age}</p>
                    <button class="btn">Voir Détails</button>
                `;

                // Ajouter la carte au conteneur
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
        });
}

// Appeler la fonction pour afficher les cartes lors du chargement de la page
window.onload = fetchAndDisplayPersonnes;