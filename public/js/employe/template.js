import { setHeader,requireAuthEmploye } from "../utils/index.js";

requireAuthEmploye();
setHeader();

alert('Le JS de la page est toujours template.js, il faut le changer !');