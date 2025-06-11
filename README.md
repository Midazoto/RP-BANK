# Projet-dev-web

# 📘 API Routes

## 🔐 Auth Routes (`/api/auth`)

### `POST /api/auth/register/:type`  
**Description** : Inscription d’un nouvel utilisateur (client ou employé).  
**Paramètres** :
- `:type` → `"client"` ou `"employe"` (dans l’URL)
- Body JSON requis :
  - Pour **client** : `email`, `password`, `nom`, `prenom`, `adresse`, `telephone`, `banquier`
  - Pour **employe** : `email`, `password`, `nom`, `prenom`, `poste`, `resp_id (optionnel)`

**Protection** :  
- Token JWT obligatoire (`Authorization: Bearer <token>`)  
- L'utilisateur doit être un employé (`verifierEmploye`)

**Réponses** :
- `201 Created` → `{ id: <nouvel_id> }`
- `400 Bad Request` → Champs manquants ou invalides
- `500 Internal Server Error` → Erreur interne SQL ou serveur

---

### `POST /api/auth/login/:type`  
**Description** : Connexion d’un utilisateur existant (client ou employé).  
**Paramètres** :
- `:type` → `"client"` ou `"employe"`
- Body JSON requis : `email`, `password`

**Réponses** :
- `200 OK` → `{ token: <jwt_token> }`
- `400 Bad Request` → Champs manquants ou type invalide
- `401 Unauthorized` → Email ou mot de passe incorrect
- `404 Not Found` → Utilisateur non trouvé
- `500 Internal Server Error` → Erreur serveur ou SQL

---

### `GET /api/auth/user`  
**Description** : Vérifie si un utilisateur est connecté à partir du token.  
**Headers** :
- `Authorization: Bearer <token>`

**Réponses** :
- `200 OK` :
  - Si connecté : `{ isLoggedIn: true, type: "client" | "employe" }`
  - Si non connecté ou token invalide : `{ isLoggedIn: false, type: null }`

---

---

## 👤 Client Routes (`/api/client`)

Toutes les routes clients nécessitent un token JWT dans l’en-tête `Authorization: Bearer <token>`. Certaines routes sont également protégées par une vérification du rôle employé (`verifierEmploye`).

---

### `GET /api/client/:id_client/compte`  
**Description** : Récupère la liste des comptes bancaires du client.  
**Paramètres** :  
- `:id_client` → Identifiant du client (URL)  
**Protection** : Token JWT obligatoire.  
**Réponses** :  
- `200 OK` avec liste des comptes et leur type.  
- `400 Bad Request` si ID client manquant.  
- `404 Not Found` si aucun compte trouvé.  
- `500 Internal Server Error` en cas d’erreur serveur.

---

### `GET /api/client/:id_client/info`  
**Description** : Récupère les informations du client, ainsi que celles de son banquier référent.  
**Paramètres** :  
- `:id_client` → Identifiant du client (URL)  
**Protection** : Token JWT obligatoire.  
**Réponses** :  
- `200 OK` avec les infos client et banquier.  
- `400 Bad Request` si ID client manquant.  
- `404 Not Found` si client non trouvé.  
- `500 Internal Server Error` en cas d’erreur serveur.

---

### `PUT /api/client/:id/info/modifier`  
**Description** : Modifier le profil d’un client (nom, prénom, email, adresse, téléphone, mot de passe optionnel).  
**Paramètres** :  
- `:id` → Identifiant du client à modifier (URL)  
- Body JSON :  
  - `nom`, `prenom`, `email`, `adresse`, `telephone` (requis)  
  - `modif_mdp` (booléen), `password` (si modif_mdp = true)  
**Protection** : Token JWT + rôle employé obligatoire.  
**Réponses** :  
- `200 OK` message succès.  
- `400 Bad Request` si données manquantes.  
- `500 Internal Server Error` en cas d’erreur.

---

### `GET /api/client/:id_client/carte`  
**Description** : Liste des cartes liées aux comptes du client.  
**Paramètres** :  
- `:id_client` → Identifiant du client (URL)  
**Protection** : Token JWT obligatoire.  
**Réponses** :  
- `200 OK` liste des cartes.  
- `404 Not Found` si aucune carte.  
- `400` ou `500` selon erreurs.

---

### `GET /api/client/:id_client/histo`  
**Description** : Historique des montants journaliers des opérations et virements du client sur 3 derniers mois.  
**Paramètres** :  
- `:id_client` → Identifiant du client (URL)  
**Protection** : Token JWT obligatoire.  
**Réponses** :  
- `200 OK` avec données par jour.  
- `404 Not Found` si aucune opération.  
- `400` ou `500` selon erreurs.

---

### `GET /api/client/:id_client/beneficiaire`  
**Description** : Liste des bénéficiaires du client.  
**Paramètres** :  
- `:id_client` → Identifiant du client (URL)  
**Protection** : Token JWT obligatoire.  
**Réponses** :  
- `200 OK` liste bénéficiaires.  
- `404 Not Found` si aucun bénéficiaire.  
- `400` ou `500` selon erreurs.

---

### `GET /api/client/:id_client/last_operations`  
**Description** : Dernières 10 opérations (carte + virements) du client.  
**Paramètres** :  
- `:id_client` → Identifiant du client (URL)  
**Protection** : Token JWT obligatoire.  
**Réponses** :  
- `200 OK` liste opérations triées par date décroissante.  
- `404 Not Found` si aucune opération.  
- `400` ou `500` selon erreurs.

---

### `GET /api/client/:id_client/compte/:id_compte/carte`  
**Description** : Liste des cartes associées à un compte spécifique du client.  
**Paramètres** :  
- `:id_client`, `:id_compte` (URL)  
**Protection** : Token JWT obligatoire.  
**Réponses** :  
- `200 OK` liste cartes.  
- `404 Not Found` si aucune carte pour ce compte.  
- `400` ou `500` selon erreurs.

---

### `GET /api/client/:id_client/compte/:id_compte/histo`  
**Description** : Historique des montants journaliers des opérations et virements pour un compte donné sur 3 derniers mois.  
**Paramètres** :  
- `:id_client`, `:id_compte` (URL)  
**Protection** : Token JWT obligatoire.  
**Réponses** :  
- `200 OK` données par jour.  
- `404 Not Found` si aucune opération.  
- `400` ou `500` selon erreurs.

---

### `GET /api/client/:id_client/compte/:id_compte/last_operations`  
**Description** : Dernières 10 opérations (carte + virements) pour un compte spécifique.  
**Paramètres** :  
- `:id_client`, `:id_compte` (URL)  
**Protection** : Token JWT obligatoire.  
**Réponses** :  
- `200 OK` liste opérations.  
- `404 Not Found` si aucune opération.  
- `400` ou `500` selon erreurs.

---

### `GET /api/client/:client_id/compte/:id_compte/info`  
**Description** : Informations détaillées sur un compte spécifique du client.  
**Paramètres** :  
- `:client_id`, `:id_compte` (URL)  
**Protection** : Token JWT obligatoire.  
**Réponses** :  
- `200 OK` infos compte avec type.  
- `404 Not Found` si compte non trouvé.  
- `400` ou `500` selon erreurs.

---

### `GET /api/client/:client_id/beneficiaire/:id_beneficiaire/info`  
**Description** : Infos détaillées sur un bénéficiaire.  
**Paramètres** :  
- `:client_id`, `:id_beneficiaire` (URL)  
**Protection** : Token JWT obligatoire.  
**Réponses** :  
- `200 OK` infos bénéficiaire.  
- `404 Not Found` si non trouvé.  
- `400` ou `500` selon erreurs.

---

### `DELETE /api/client/:client_id/beneficiaire/:id_beneficiaire/supprimer`  
**Description** : Supprime un bénéficiaire du client.  
**Paramètres** :  
- `:client_id`, `:id_beneficiaire` (URL)  
**Protection** : Token JWT obligatoire.  
**Réponses** :  
- `200 OK` message succès.  
- `404 Not Found` si bénéficiaire introuvable.  
- `400` ou `500` selon erreurs.

---

### `POST /api/client/:client_id/beneficiaire/ajouter`  
**Description** : Ajoute un bénéficiaire au client.  
**Paramètres** :  
- `:client_id` (URL)  
- Body JSON : `nom`, `numero_compte` (requis)  
**Protection** : Token JWT obligatoire.  
**Réponses** :  
- `201 Created` avec `{ id_beneficiaire: <id> }`  
- `400 Bad Request` si champs manquants.  
- `404 Not Found` si compte introuvable.  
- `500 Internal Server Error` en cas d’erreur.

---

### `POST /api/client/:client_id/virement`  
**Description** : Effectuer un virement bancaire.  
**Paramètres** :  
- `:client_id` (URL)  
- Body JSON : `compte_source`, `compte_dest`, `montant`, `reference`, `date` (requis)  
**Protection** : Token JWT obligatoire.  
**Réponses** :  
- `201 Created` avec `{ id_virement: <id> }`  
- `400 Bad Request` si champs manquants.  
- `404 Not Found` si compte source ou destination introuvable.  
- `500 Internal Server Error` en cas d’erreur.

---

### `POST /api/client/:client_id/compte/add`  
**Description** : Ajoute un compte bancaire pour un client.  
**Paramètres** :  
- `:client_id` (URL)  
- Body JSON : `type_compte` (requis), optionnel `decouvert` (droit de découvert)  
**Protection** : Token JWT + rôle employé obligatoire.  
**Réponses** :  
- `201 Created` avec `{ id_compte: <id>, numero: <numéro généré> }`  
- `400 Bad Request` si champs manquants.  
- `500 Internal Server Error` en cas d’erreur.

---

### `POST /api/client/:client_id/compte/:id_compte/carte/add`  
**Description** : Ajoute une carte bancaire à un compte donné.  
**Paramètres** :  
- `:client_id`, `:id_compte` (URL)  
**Protection** : Token JWT + rôle employé obligatoire.  
**Réponses** :  
- `201 Created` avec `{ id_carte: <id>, numero: <numéro généré> }`  
- `400 Bad Request` si champs manquants.  
- `404 Not Found` si compte introuvable.  
- `500 Internal Server Error` en cas d’erreur.

---
