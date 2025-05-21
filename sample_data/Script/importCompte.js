const fs = require('fs');
const path = require('path');

/**
 * Importe les employés depuis un fichier JSON dans la base SQLite.
 * @param {sqlite3.Database} db - Instance de la base SQLite ouverte.
 */
function importCompte(db) {
    const filePath = path.join(__dirname, '..', 'data', 'compte_sample.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const comptes = JSON.parse(rawData);

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        const stmt = db.prepare(`
            INSERT OR IGNORE INTO compte (id, numero, solde, type, client_id)
            VALUES (?, ?, ?, ?, ?)
        `);

        for (const compte of comptes) {
            stmt.run(
                compte.id,
                compte.numero,
                compte.solde,
                compte.type,
                compte.client_id
            );
        }

        stmt.finalize();
        db.run("COMMIT", () => {
            console.log("Import des compte terminé.");
        });
    });
}

module.exports = { importCompte };