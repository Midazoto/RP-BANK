const fs = require('fs');
const path = require('path');

/**
 * Importe les employés depuis un fichier JSON dans la base SQLite.
 * @param {sqlite3.Database} db - Instance de la base SQLite ouverte.
 */
function importOperation(db) {
    const filePath = path.join(__dirname, '..', 'data', 'operation_sample.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const operations = JSON.parse(rawData);

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        const stmt = db.prepare(`
            INSERT OR IGNORE INTO operation (id, montant, date, libelle, compte_id)
            VALUES (?, ?, ?, ?, ?)
        `);

        for (const op of operations) {
            stmt.run(op.id, op.montant, op.date, op.libelle, op.compte_id);
        }

        stmt.finalize();
        db.run("COMMIT", () => {
            console.log("Import des opérations terminé.");
        });
    });
}

module.exports = { importOperation };