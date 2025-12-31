# FastRider Auth Service (Docker Setup)

FastRider Auth Service is a microservice for secure user registration, code verification, and authentication. Built with Node.js, Prisma, PostgreSQL, and JWT, it demonstrates modern authentication and security best practices.

---

## 🚀 Run with Docker Compose

1. Clone the repository:

```bash
git clone https://github.com/your-repo/fastrider-auth.git
cd fastrider-auth
```

2. Create a `.env` file with environment variables:

```
DATABASE_URL=postgresql://user:password@db:5432/dbname
JWT_SECRET=your_secret_key
CODE_EXPIRATION_MINUTES=5
```

3. Build and start the services:

```bash
docker compose up --build
```

4. Services will be available at:

* API: `http://localhost:3000`

---

## ⚡ API Endpoints

* `POST /register` — user registration (email/phone, password)
* `POST /verify` — code verification
* `POST /login` — login
* `GET /profile` — user profile (requires JWT token)

---

## 🔐 Security Principles

1. **Code Expiration** – short-lived verification codes (5–15 min)
2. **Rate Limiting** – limits login/code attempts (e.g., 5 per 15 min)
3. **Replay Protection** – codes invalidated immediately after use
4. **Secure Token Generation** – JWT with a long, random secret
5. **Session Integrity** – JWT signature verification
6. **Additional Measures** – bcrypt password hashing, audit logging

---

## 🛠 Tech Stack

* Node.js + Express
* Prisma ORM
* PostgreSQL
* JWT for authentication
* Bcrypt for password hashing
* Docker + Docker Compose for containerization
