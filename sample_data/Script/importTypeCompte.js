const fs = require('fs');
const path = require('path');

/**
 * Importe les employés depuis un fichier JSON dans la base SQLite.
 * @param {sqlite3.Database} db - Instance de la base SQLite ouverte.
 */
function importTypeCompte(db) {
    const filePath = path.join(__dirname, '..', 'data', 'type_compte_sample.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const types = JSON.parse(rawData);

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        const stmt = db.prepare(`
            INSERT OR IGNORE INTO type_compte (id, libelle)
            VALUES (?, ?)
        `);

        for (const type of types) {
            stmt.run(type.id, type.libelle);
        }

        stmt.finalize();
        db.run("COMMIT", () => {
            console.log("Import des types de comptes terminé.");
        });
    });
}

module.exports = { importTypeCompte };