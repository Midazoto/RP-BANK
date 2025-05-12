import { setHeader,requireAuthEmploye } from "../utils/index.js";

requireAuthEmploye();
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
  const orgData = subordonnes.map(e => ({
    id: e.id,
    pid: e.resp_id,
    name: `${e.prenom} ${e.nom}`,
    title: e.poste
  }));

  // Ajouter l'utilisateur courant comme racine
  orgData.push(rootNode)
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
