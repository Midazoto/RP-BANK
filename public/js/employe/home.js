import { setHeader,requireAuthEmploye } from "../utils/index.js";

requireAuthEmploye();
setHeader();

Promise.all([
    fetch('/api/employe/current', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then(res => res.json())
])