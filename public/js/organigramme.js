import { setHeader } from "./utils/index.js";

setHeader();

const orgData = [
  { id: 1, name: "Jean Dupont", title: "PDG" },
  { id: 2, pid: 1, name: "Claire Martin", title: "Directrice RH" },
  { id: 3, pid: 1, name: "Luc Durand", title: "CTO" },
  { id: 4, pid: 2, name: "Paul Lemoine", title: "Chargé RH" },
  { id: 5, pid: 3, name: "Sophie Bernard", title: "Dév. Backend" },
  { id: 12, name: "Jean Dupont", title: "PDG" },
];

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

var chart = new OrgChart(document.getElementById("tree"), {
  enableSearch: false,
  template:"glass",
  zoom: false,
  mouseScrool: OrgChart.action.scroll,
  showYScroll: true,
  showXScroll: true,
  nodeBinding: {
    field_0: "name",
    field_1: "title"
  },
  nodes: orgData,
  nodeMouseClick: OrgChart.action.none,
  collapse: false,      // Désactive le repli des nœuds
  expand: { all: true }
});

chart.onNodeClick((args) => {
  const nodeId = args.node.id;
  const nodeData = chart.get(nodeId);
  const nodeName = nodeData.name;
  const nodeTitle = nodeData.title;

  // Display the clicked node's information
  alert(`ID: ${nodeId}\nName: ${nodeName}\nTitle: ${nodeTitle}`);
});