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
OrgChart.templates.glassCurrent = Object.assign({}, OrgChart.templates.glass);
OrgChart.templates.glassCurrent.node = `
  <foreignObject x="0" y="0" width="250" height="120">
    <div xmlns="http://www.w3.org/1999/xhtml" class="glass-node current-user">
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

  fetch('/api/employe/all', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.json())
])
.then(([currentUser, allEmployees]) => {
  const orgData = allEmployees.map(e => ({
    id: e.id,
    pid: e.resp_id,
    name: `${e.prenom} ${e.nom}`,
    title: e.poste,
    tags: e.id === currentUser.id ? ["currentUser"] : []
  }));

  let direct_subordinates = allEmployees.filter(e => e.resp_id === currentUser.id).map(e => ({
    id: e.id,
    pid: e.resp_id,
    name: `${e.prenom} ${e.nom}`,
    title: e.poste,
    tags: e.id === currentUser.id ? ["currentUser"] : []
  }));

  let nodes_list = [];
  for (let i = 0; i < direct_subordinates.length; i++) {
    nodes_list.push(direct_subordinates[i].id);
  }
  nodes_list.push(currentUser.id);

  // Initialiser l'organigramme
  const chart = new OrgChart(document.getElementById("tree"), {
    enableSearch: false,
    template:"glass",
    zoom: false,
    scaleInitial: 1,
    showYScroll: true,
    showXScroll: true,
    nodeBinding: {
      field_0: "name",
      field_1: "title"
    },
    nodes: orgData,
    mouseScrool: OrgChart.action.scroll,
    nodeMouseClick: OrgChart.action.none,
    tags: {
      currentUser: {
        template: "glassCurrent" // ou une autre couleur spéciale
      }
    },
    collapse: {
        level: 1,
        allChildren: true
    },
    expand: {
      nodes:nodes_list
    },
    orientation: OrgChart.orientation.left_top
  });


  // Événement clic sur un nœud
  chart.onNodeClick((args) => {
    const node = chart.get(args.node.id);
    if (node) {
      const userId = node.id;
      window.location.href = `/employe/${userId}/profil`;
    }
  });

  orgData.forEach(node => {
    if (node.isCurrentUser) {
      chart.getNode(node.id).tags = ["currentUser"];
    }
  });

})
.catch(err => {
  console.error("Erreur lors du chargement de l'organigramme :", err);
});
