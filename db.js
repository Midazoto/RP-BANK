const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');
const importEmployes = require('./sample_data/Script/importEmploye.js').importEmployes;

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS client (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            nom TEXT NOT NULL,
            prenom TEXT NOT NULL,
            adresse TEXT NOT NULL,
            telephone TEXT NOT NULL,
            banquier INTEGER,
            FOREIGN KEY (banquier) REFERENCES employe(id)

    )`);

    db.run(`
        CREATE TABLE IF NOT EXISTS employe (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            nom TEXT NOT NULL,
            prenom TEXT NOT NULL,
            poste TEXT NOT NULL,
            resp_id INTEGER,
            FOREIGN KEY (resp_id) REFERENCES employe(id)
    )`);

    db.run(`
        CREATE TABLE IF NOT EXISTS compte(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero TEXT NOT NULL UNIQUE,
            solde REAL NOT NULL DEFAULT 0,
            type TEXT NOT NULL,
            client_id INTEGER NOT NULL,
            FOREIGN KEY (client_id) REFERENCES client(id)
    )`);

    db.run(`
        CREATE TABLE IF NOT EXISTS operation(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            montant REAL NOT NULL,
            date TEXT NOT NULL,
            type TEXT NOT NULL,
            compte_id INTEGER NOT NULL,
            FOREIGN KEY (compte_id) REFERENCES compte(id)
    )`);

    db.run(`
        CREATE TABLE IF NOT EXISTS virement(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            montant REAL NOT NULL,
            date TEXT NOT NULL,
            compte_source_id INTEGER NOT NULL,
            compte_destination_id INTEGER NOT NULL,
            FOREIGN KEY (compte_source_id) REFERENCES compte(id),
            FOREIGN KEY (compte_destination_id) REFERENCES compte(id)
    )`);

    db.run(`
        CREATE TABLE IF NOT EXISTS carte(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero TEXT NOT NULL UNIQUE,
            date_expiration TEXT NOT NULL,
            type TEXT NOT NULL,
            compte_id INTEGER NOT NULL,
            FOREIGN KEY (compte_id) REFERENCES compte(id)
        )`);

    db.get('SELECT * FROM employe', (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }
        if (!row) {
            importEmployes(db);
        }else {
            console.log('Base de données déjà initialisée avec les employés.');
        }
    });

});

module.exports = db;