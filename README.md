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

**Protection** : Token JWT obligatoire (`Authorization: Bearer <token>`), et vérification du rôle employé (`verifierEmploye`)

**Réponses** :
- `201 Created` avec `{ id: <nouvel_id> }`
- `400 Bad Request` ou `500 Internal Server Error` selon l'erreur

---

### `POST /api/auth/login/:type`  
**Description** : Connexion d’un utilisateur (`client` ou `employe`).

**Paramètres** :
- `:type` → `"client"` ou `"employe"`
- Body JSON : `email`, `password`

**Réponses** :
- `200 OK` → `{ token: <jwt> }` si succès
- `401 Unauthorized` ou `404 Not Found` si les identifiants sont incorrects
- `500 Internal Server Error` en cas d'erreur

---

### `GET /api/auth/user`  
**Description** : Vérifie si l’utilisateur est connecté en analysant le token JWT.

**Header attendu** :
- `Authorization: Bearer <token>`

**Réponses** :
- `{ isLoggedIn: true, type: "client" | "employe" }` si connecté
- `{ isLoggedIn: false, type: null }` si non connecté ou token invalide
