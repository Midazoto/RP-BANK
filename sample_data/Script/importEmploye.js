const fs = require('fs');
const bcrypt = require('bcryptjs');
const path = require('path');

/**
 * Importe les employés depuis un fichier JSON dans la base SQLite.
 * @param {sqlite3.Database} db - Instance de la base SQLite ouverte.
 */
function importEmployes(db) {
    const filePath = path.join(__dirname, '..', 'data', 'employe_sample.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const employes = JSON.parse(rawData);

    db.serialize(() => {
        const stmt = db.prepare(`
            INSERT OR IGNORE INTO employe (id, email, password, nom, prenom, poste, resp_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        for (const emp of employes) {
            const hashedPassword = bcrypt.hashSync(emp.password, 10);
            stmt.run(emp.id, emp.email, hashedPassword, emp.nom, emp.prenom, emp.poste, emp.resp_id || null);
        }

        stmt.finalize(() => {
            console.log("Import des employés terminé.");
        });
    });
}

module.exports = { importEmployes };