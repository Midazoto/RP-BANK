const fs = require('fs');
const path = require('path');

/**
 * Importe les cartes depuis un fichier JSON dans la base SQLite.
 * @param {sqlite3.Database} db - Instance de la base SQLite ouverte.
 */
function importCarte(db) {
    const filePath = path.join(__dirname, '..', 'data', 'carte_sample.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const cartes = JSON.parse(rawData);

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        const stmt = db.prepare(`
            INSERT OR IGNORE INTO carte (id, numero, date_expiration, type, compte_id)
            VALUES (?, ?, ?, ?, ?)
        `);

        for (const carte of cartes) {
            stmt.run(
                carte.id,
                carte.numero,
                carte.date_expiration,
                carte.type,
                carte.compte_id
            );
        }

        stmt.finalize();
        db.run("COMMIT", () => {
            console.log("Import des cartes terminé.");
        });
    });
}

module.exports = { importCarte };
