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
