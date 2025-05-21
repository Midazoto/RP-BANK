const fs = require('fs');
const bcrypt = require('bcryptjs');
const path = require('path');

/**
 * Importe les employés depuis un fichier JSON dans la base SQLite.
 * @param {sqlite3.Database} db - Instance de la base SQLite ouverte.
 */
function importClient(db) {
    const filePath = path.join(__dirname, '..', 'data', 'client_sample.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const clients = JSON.parse(rawData);

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        const stmt = db.prepare(`
            INSERT OR IGNORE INTO client (id, email, password, nom, prenom, adresse, telephone, banquier)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const client of clients) {
            const hashedPassword = bcrypt.hashSync(client.password, 10);
            stmt.run(
                client.id,
                client.email,
                hashedPassword,
                client.nom,
                client.prenom,
                client.adresse,
                client.telephone,
                client.banquier || null
            );
        }
        stmt.finalize();
        db.run("COMMIT", () => {
            console.log("Import des clients terminé.");
        });
    });
}

module.exports = { importClient };