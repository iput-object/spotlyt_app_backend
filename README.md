

# Spotlyt Backend

Backend API for Spotlyt — a micro-task and service management platform built with Node.js, Express, and MongoDB.

## 🧩 Features
- User roles: admin, client, employee
- Manage services, orders, tasks, and withdrawals
- File uploads with Multer
- JWT authentication
- Mongoose pagination and plugins
- Dummy payment + transaction tracking

## ⚙️ Setup

### 1. Clone & Install
`Just clone this Repo `

### 2. Configure Environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Example:

```env
PORT=5000
MONGODB_URL=mongodb://localhost:27017/Spotlyt
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=7d
```

### 3. Run Server

```bash
npm run dev
```

Server runs on:
👉 `http://<Your Local IP>:3000/`

---

## 📡 Routes

| Module       | Base Path       |
| :----------- | :-------------- |
| Auth         | `/auth`         |
| Users        | `/users`        |
| Services     | `/services`     |
| Orders       | `/orders`       |
| Tasks        | `/tasks`        |
| Transactions | `/transactions` |

---

## 🧪 Testing (Postman)

A Postman collection (`Spotlyt.postman_collection.json`) will be available for all endpoints.

---

## 🧑‍💻 Scripts

```bash
npm start     # Run in production
npm run dev   # Run with nodemon
```
## Status
<h5>Half cooked code, and maybe Unstable for Production.</h5>