# 📚 Projet de Gestion Universitaire

Plateforme de gestion universitaire complète :

- **Backend** Django + DRF + MySQL
- **Frontend** Vite + React.js

---

## 🎯 Objectif

Permettre de gérer :

- Étudiants
- Enseignants
- Matières
- Notes\
  Le tout via une API performante et une interface web moderne.

---

## 🏗️ Structure du Projet

```
/backend/  → API Django REST Framework (MySQL)
/frontend/ → Application Vite + React.js
```

---

## 🚀 Installation et exécution

### 1. Cloner le projet

```bash
git clone https://github.com/ton-repo/gestion-universitaire.git
cd gestion-universitaire
```

---

## ⚙️ Backend - Django + DRF

### Prérequis

- Python 3.10+
- MySQL Server
- pip

### Installation

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

pip install -r requirements.txt
```

### Configuration

Créer un fichier `.env` dans `backend/` :

```env
DB_NAME=gestion_univ_database
DB_USER=ton_utilisateur
DB_PASSWORD=ton_mot_de_passe
DB_HOST=localhost
DB_PORT=3306
SECRET_KEY=ta_cle_secrete
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

⚠️ Assure-toi que ta base MySQL existe avant de migrer.

### Migration de la base de données

```bash
python manage.py makemigrations
python manage.py migrate
```

### Démarrer le serveur

```bash
python manage.py runserver
```

👉 Accès à l'API : `http://127.0.0.1:8000/api/`

---

## 🎨 Frontend - Vite + React.js

### Prérequis

- Node.js 18+
- npm

### Installation

```bash
cd frontend
npm install
```

### Configuration

Créer un fichier `.env` dans `frontend/` :

```env
VITE_API_URL=http://127.0.0.1:8000/api/
```

### Démarrer le serveur

```bash
npm run dev
```

👉 L'application sera accessible sur : `http://localhost:5173`

---

## 🛠️ Technologies utilisées

| Technologie                 | Description                   |
| --------------------------- | ----------------------------- |
| Django                      | Backend et logique métier     |
| Django REST Framework (DRF) | API REST                      |
| MySQL                       | Base de données relationnelle |
| React.js                    | Frontend interactif           |
| Vite                        | Build et développement rapide |
| Axios                       | Requêtes HTTP vers l'API      |

---

## ✅ Résumé rapide

| Action             | Commande                          |
| ------------------ | --------------------------------- |
| Installer Backend  | `pip install -r requirements.txt` |
| Démarrer Backend   | `python manage.py runserver`      |
| Installer Frontend | `npm install`                     |
| Démarrer Frontend  | `npm run dev`                     |

---

## 📩 Contact

Pour toute question ou aide :\
📧 **[mathieudjakpata@yahoo.com](mailto\:mathieudjakpata@yahoo.com)**

---
