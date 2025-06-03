const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');
const importEmployes = require('./sample_data/Script/importEmploye.js').importEmployes;
const importTypeCompte = require('./sample_data/Script/importTypeCompte.js').importTypeCompte;
const importClient = require('./sample_data/Script/importClient.js').importClient;
const importCompte = require('./sample_data/Script/importCompte.js').importCompte;
const importOperation = require('./sample_data/Script/importOperation.js').importOperation;
const importVirement = require('./sample_data/Script/importVirement.js').importVirement;
const importCarte = require('./sample_data/Script/importCarte.js').importCarte;
const importBeneficiaire = require('./sample_data/Script/importBeneficiaire.js').importBeneficiaire;

db.serialize(() => {

    db.run("PRAGMA foreign_keys = ON");

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
        CREATE TABLE IF NOT EXISTS type_compte(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            libelle TEXT NOT NULL UNIQUE
    )`);

    db.run(`
        CREATE TABLE IF NOT EXISTS compte(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero TEXT NOT NULL UNIQUE,
            solde REAL NOT NULL DEFAULT 0,
            type INTEGER NOT NULL,
            droit_decouvert REAL NOT NULL DEFAULT 0,
            client_id INTEGER NOT NULL,
            FOREIGN KEY (client_id) REFERENCES client(id),
            FOREIGN KEY (type) REFERENCES type_compte(id)
    )`);

    db.run(`
        CREATE TABLE IF NOT EXISTS operation(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            montant REAL NOT NULL,
            date TEXT NOT NULL,
            libelle TEXT NOT NULL,
            compte_id INTEGER NOT NULL,
            FOREIGN KEY (compte_id) REFERENCES compte(id)
    )`);

    db.run(`
        CREATE TABLE IF NOT EXISTS virement(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            montant REAL NOT NULL,
            date TEXT NOT NULL,
            libelle TEXT NOT NULL,
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

    db.run(`
        CREATE TABLE IF NOT EXISTS beneficiaire(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_client INTEGER NOT NULL,
            nom TEXT NOT NULL,
            compte_id INTEGER NOT NULL,
            FOREIGN KEY (id_client) REFERENCES client(id),
            FOREIGN KEY (compte_id) REFERENCES compte(id)
    )`);

    db.run(`
        CREATE TRIGGER IF NOT EXISTS update_solde_apres_operation
        AFTER INSERT ON operation
        BEGIN
            UPDATE compte
            SET solde = ROUND(solde + NEW.montant, 2)
            WHERE id = NEW.compte_id;
        END;
    `);

    db.run(`
        CREATE TRIGGER IF NOT EXISTS update_comptes_apres_virement
        AFTER INSERT ON virement
        BEGIN
            UPDATE compte
            SET solde = ROUND(solde - NEW.montant, 2)
            WHERE id = NEW.compte_source_id;

            UPDATE compte
            SET solde = ROUND(solde + NEW.montant, 2)
            WHERE id = NEW.compte_destination_id;
        END;
    `);

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

    db.get('SELECT * FROM type_compte', (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }
        if (!row) {
            importTypeCompte(db);
        }else {
            console.log('Base de données déjà initialisée avec les types de compte.');
        }
    });

    db.get('SELECT * FROM client', (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }
        if (!row) {
            importClient(db);
        }else {
            console.log('Base de données déjà initialisée avec les clients.');
        }
    });

    db.get('SELECT * FROM compte', (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }
        if (!row) {
            importCompte(db);
        }else {
            console.log('Base de données déjà initialisée avec les comptes.');
        }
    });

    db.get('SELECT * FROM operation', (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }
        if (!row) {
            importOperation(db);
        }else {
            console.log('Base de données déjà initialisée avec les opérations.');
        }
    });

    db.get('SELECT * FROM virement', (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }
        if (!row) {
            importVirement(db);
        }else {
            console.log('Base de données déjà initialisée avec les virements.');
        }
    });

    db.get('SELECT * FROM carte', (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }
        if (!row) {
            importCarte(db);
        }else {
            console.log('Base de données déjà initialisée avec les cartes.');
        }
    });

    db.get('SELECT * FROM beneficiaire', (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }
        if (!row) {
            importBeneficiaire(db);
        }else {
            console.log('Base de données déjà initialisée avec les bénéficiaires.');
        }
    });

});

module.exports = db;