Create a file at:

```
lost_found_portal/README.md
```

And paste this:

---

# 📦 Lost & Found Portal

A full-stack Lost & Found management system built with **React (frontend)** and **FastAPI (backend)**.
This project enables users to report, search, and claim lost or found items efficiently.

---

## 🚀 Features

### 👤 User Authentication

* Login / Register using roll number & password
* JWT-based authentication
* Authorization for admin actions

### 🎒 Lost & Found Items

* Report found items
* Report lost items
* View all items
* View item details

### 🛂 Claiming System

* Users can claim found items
* Admin approves / rejects claims
* Secure verification process

### 🗂 Categories & Locations

* Manage item categories
* Manage campus locations

---

## 🛠 Tech Stack

### **Frontend**

* React JS
* React Router
* Axios
* Bootstrap

### **Backend**

* FastAPI
* SQLAlchemy
* MySQL(Data Base)
* JWT Authentication (python-jose)
* Passlib (password hashing)

---

# 📁 Folder Structure

```
lost_found_portal/
│
├── lost_found_frontend/        # React Application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .gitignore
│
├── lost_found_backend/         # FastAPI Application
│   ├── app/
│   │   ├── routers/
│   │   ├── models.py
│   │   ├── database.py
│   │   ├── auth.py
│   │   ├── main.py
│   │   └── schemas.py
│   ├── requirements.txt
│   ├── uploads/
│   └── .gitignore
│
└── README.md
```

---

# ⚙️ Setup Guide (Run on ANY system)

## 🟢 1. Clone the Repository

```
git clone https://github.com/punithsai2006/lost_found_portal.git
cd lost_found_portal
```

---

# 🟡 BACKEND SETUP — FastAPI

Go to backend folder:

```
cd lost_found_backend
```

### ✔ Create virtual environment

```
python -m venv venv
```

### ✔ Activate it

Windows:

```
venv\Scripts\activate
```

### ✔ Install dependencies

```
pip install -r requirements.txt
```

### ✔ Create `.env` file

Create:

```
lost_found_backend/.env
```

Add:

```
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
DATABASE_URL=mysql://root:password@localhost/lost_found
```

### ✔ Run FastAPI

```
uvicorn app.main:app --reload
```

Backend Running:
👉 [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

# 🔵 FRONTEND SETUP — React

Go to frontend:

```
cd ../lost_found_frontend
```

### ✔ Install node modules

```
npm install
```

### ✔ Create `.env`

```
lost_found_frontend/.env
```

Add:

```
REACT_APP_API_URL=http://localhost:8000
```

### ✔ Start the front-end

```
npm start
```

Frontend Running:
👉 [http://localhost:3000](http://localhost:3000)

---

# 🗄 Database Setup (MySQL)

Create a MySQL database:

```
CREATE DATABASE lost_found;
```

Import schema:

```
lost_found_backend/lost_and_found_schema.sql
```

Your tables will be created automatically.

---

# 🔐 Environment Variables Summary

### Backend (.env)

```
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
DATABASE_URL=mysql://root:password@localhost/lost_found
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:8000
```

---

# 📡 API Routes Overview

### 🔐 Authentication

| Method | Route       | Description      |
| ------ | ----------- | ---------------- |
| POST   | /auth/login | Login user       |
| GET    | /auth/me    | Get current user |

### 👤 Users

| GET | /users/ | Get all users |

### 🎒 Items

| POST | /items/ | Add item |
| GET | /items/ | Get all items |

### 🧾 Reports

| POST | /reports/ | Create report |
| GET | /reports/ | List reports |

### 🛂 Claims

| POST | /claims/ | Create a claim |
| PUT | /claims/{id}/approve | Approve claim |
| PUT | /claims/{id}/reject | Reject claim |

---

# 📸 Screenshots (Add your images later)

```
![Home Page](screenshots/home.png)
![Login Page](screenshots/login.png)
![Dashboard](screenshots/dashboard.png)
```

---

# 🤝 Contributing

Pull requests are welcome!

---

# 📄 License

MIT License

---
<img width="1896" height="884" alt="image" src="https://github.com/user-attachments/assets/db10c7fa-b400-438c-8c7c-d48db23dafc9" />

<img width="1899" height="877" alt="image" src="https://github.com/user-attachments/assets/03e302a6-8c88-4435-ac8d-357c29fb9f80" />

<img width="1895" height="885" alt="image" src="https://github.com/user-attachments/assets/7dcdc6dd-049f-40cd-8918-f33cc7dfbbb8" />

<img width="1893" height="881" alt="image" src="https://github.com/user-attachments/assets/316b6a91-8fe9-48ce-9556-a0c482bf147e" />
<img width="1919" height="883" alt="image" src="https://github.com/user-attachments/assets/fe1a25e5-8dbe-428a-a99f-4cdc0e382162" />

<img width="1899" height="884" alt="image" src="https://github.com/user-attachments/assets/588b12c4-d9a4-42c1-8f6f-7b8fe978fce2" />

<img width="1919" height="884" alt="image" src="https://github.com/user-attachments/assets/708b501d-9208-4a78-9792-41227d9fcb4d" />

<img width="1919" height="888" alt="image" src="https://github.com/user-attachments/assets/39d35593-1ecc-45d1-9104-b40a933f84f5" />







