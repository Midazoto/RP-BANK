const fs = require('fs');
const path = require('path');

/**
 * Importe les bénéficiaires depuis un fichier JSON dans la base SQLite.
 * @param {sqlite3.Database} db - Instance de la base SQLite ouverte.
 */
function importBeneficiaire(db) {
    const filePath = path.join(__dirname, '..', 'data', 'beneficiaire_sample.json');
    const rawData  = fs.readFileSync(filePath, 'utf-8');
    const beneficiaires = JSON.parse(rawData);

    db.serialize(() => {
        db.run('PRAGMA foreign_keys = ON');        // facultatif si déjà activé
        db.run('BEGIN TRANSACTION');

        const stmt = db.prepare(`
            INSERT OR IGNORE INTO beneficiaire
                (id, client_id, nom, compte_id)
            VALUES
                (?,  ?,  ?,  ?)
        `);

        for (const b of beneficiaires) {
            stmt.run(
                b.id,
                b.id_client,
                b.nom,
                b.compte_id
            );
        }

        stmt.finalize();
        db.run('COMMIT', () => {
            console.log('Import des bénéficiaires terminé.');
        });
    });
}

module.exports = { importBeneficiaire };
