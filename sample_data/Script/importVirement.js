const fs = require('fs');
const path = require('path');

/**
 * Importe les employés depuis un fichier JSON dans la base SQLite.
 * @param {sqlite3.Database} db - Instance de la base SQLite ouverte.
 */
function importVirement(db) {
    const filePath = path.join(__dirname, '..', 'data', 'virement_sample.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const virements = JSON.parse(rawData);

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        const stmt = db.prepare(`
            INSERT OR IGNORE INTO virement (id, montant, date, libelle, compte_source_id, compte_destination_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        for (const v of virements) {
            stmt.run(
                v.id,
                v.montant,
                v.date,
                v.libelle,
                v.compte_source_id,
                v.compte_destination_id
            );
        }

        stmt.finalize();
        db.run("COMMIT", () => {
            console.log("Import des virements terminé.");
        });
    });
}

module.exports = { importVirement };