import { setHeader } from "./utils/index.js";

setHeader();


document.addEventListener('DOMContentLoaded', () => {
    const endpoints = {
        nbClients: '/api/stat/nbClients',
        nbEmployes: '/api/stat/nbEmployes',
        nbComptes: '/api/stat/nbComptes',
        nbOperations: '/api/stat/nbOperations',
        nbCartes: '/api/stat/nbCartes',
        totalSolde: '/api/stat/totalSolde'
    };

    for (const [id, url] of Object.entries(endpoints)) {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                const key = Object.keys(data)[0];
                const value = data[key];

                if (id === 'totalSolde') {
                    // Format le total avec des milliers et deux décimales
                    document.getElementById(id).textContent = Number(value).toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                    });
                } else {
                    document.getElementById(id).textContent = value;
                }
            })
            .catch(err => {
                console.error(`Erreur lors du chargement de ${id} :`, err);
                document.getElementById(id).textContent = 'Erreur';
            });
    }
});