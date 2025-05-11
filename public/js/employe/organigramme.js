import { setHeader } from "../utils/index.js";

setHeader();

const token = localStorage.getItem('token');
OrgChart.templates.glass = Object.assign({}, OrgChart.templates.ana);

    OrgChart.templates.glass.size = [250, 120];
    OrgChart.templates.glass.nodePadding = 0;
    OrgChart.templates.glass.min = [250, 120];
    OrgChart.templates.glass.node = `
      <foreignObject x="0" y="0" width="250" height="120">
        <div xmlns="http://www.w3.org/1999/xhtml" class="glass-node">
          <div class="node-content">
          </div>
        </div>
      </foreignObject>
    `;

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
  // Construire l'entrée de l'utilisateur courant sans pid
  const rootNode = {
    id: currentUser.id,
    name: `${currentUser.prenom} ${currentUser.nom}`,
    title: currentUser.poste // ou currentUser.titre_poste
    // pas de pid ici
  };

  // Transformer les subordonnés avec pid
  /* const orgData = subordonnes.map(e => ({
    id: e.id,
    pid: e.resp_id,
    name: `${e.prenom} ${e.nom}`,
    title: e.poste
  })); */

  // Ajouter l'utilisateur courant comme racine
  //orgData.push(rootNode);
  const orgData = [
  { id: 1, name: "Jean Dupont", title: "PDG" },

  // Niveau 1
  { id: 2, pid: 1, name: "Claire Martin", title: "Directrice RH" },
  { id: 3, pid: 1, name: "Luc Durand", title: "CTO" },
  { id: 4, pid: 1, name: "Marc Petit", title: "CFO" },

  // Niveau 2
  { id: 5, pid: 2, name: "Paul Lemoine", title: "Chargé RH" },
  { id: 6, pid: 2, name: "Isabelle Moreau", title: "Recruteuse" },
  { id: 7, pid: 3, name: "Sophie Bernard", title: "Dev Backend" },
  { id: 8, pid: 3, name: "Nicolas Lefevre", title: "Dev Frontend" },
  { id: 9, pid: 4, name: "Carole Gilbert", title: "Comptable" },
  { id: 10, pid: 4, name: "Julien Barra", title: "Contrôleur Financier" },

  // Niveau 3
  { id: 11, pid: 5, name: "Emma Perrot", title: "Assistant RH" },
  { id: 12, pid: 6, name: "Lucie Garnier", title: "Stagiaire RH" },
  { id: 13, pid: 7, name: "Thomas Renault", title: "Dev Junior" },
  { id: 14, pid: 7, name: "Camille Faure", title: "Dev QA" },
  { id: 15, pid: 8, name: "David Henry", title: "UI/UX Designer" },
  { id: 16, pid: 8, name: "Marine Lopez", title: "Graphiste" },
  { id: 17, pid: 9, name: "Quentin Fabre", title: "Assistant Comptable" },
  { id: 18, pid: 10, name: "Alice Mercier", title: "Auditrice" },

  // Niveau 4
  { id: 19, pid: 13, name: "Hugo Tessier", title: "Alternant" },
  { id: 20, pid: 14, name: "Léa Richard", title: "Testeuse" },
  { id: 21, pid: 15, name: "Bruno Maillot", title: "Design Systems" },
  { id: 22, pid: 16, name: "Sandra Colin", title: "Motion Designer" },

  // Niveau 5
  { id: 23, pid: 19, name: "Jules Rolland", title: "Stagiaire Dév" },
  { id: 24, pid: 20, name: "Claire Vidal", title: "QA Junior" },
  { id: 25, pid: 21, name: "Mélanie Dumas", title: "UX Researcher" },
  { id: 26, pid: 22, name: "Etienne Perrin", title: "Animateur Graphique" },

  // Quelques branches supplémentaires
  { id: 27, pid: 3, name: "Xavier Roux", title: "Architecte Logiciel" },
  { id: 28, pid: 27, name: "Loïc Delmas", title: "Expert Sécurité" },
  { id: 29, pid: 28, name: "Valérie Cousin", title: "Pentester" },
  { id: 30, pid: 6, name: "Sabrina Noël", title: "Chargée de formation" }
];
  // Initialiser l'organigramme
  const chart = new OrgChart(document.getElementById("tree"), {
    enableSearch: false,
    template:"glass",
    zoom: true,
    scaleInitial: 1.0,
    showYScroll: true,
    showXScroll: true,
    nodeBinding: {
      field_0: "name",
      field_1: "title"
    },
    nodes: orgData,
    nodeMouseClick: OrgChart.action.none,
    collapse: false,
    expand: { all: true }
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      chart.fit();
    }, 200);
  });

  // Événement clic sur un nœud
  chart.onNodeClick((args) => {
    const node = chart.get(args.node.id);
    alert(`ID: ${node.id}\nName: ${node.name}\nTitle: ${node.title}`);
  });

})
.catch(err => {
  console.error("Erreur lors du chargement de l'organigramme :", err);
});
