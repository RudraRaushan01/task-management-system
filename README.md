# Task Management System (Full-Stack)

Production-ready starter for a modern task management platform built with **React + Tailwind + Vite** and **Node.js + Express + MongoDB**.

## Project Structure

```bash
.
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── services/
│   ├── .env.example
│   └── package.json
└── server/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── utils/
    ├── .env.example
    ├── package.json
    └── server.js
```

## Features

- User registration/login/logout with hashed passwords.
- JWT authentication and session persistence via localStorage.
- Task CRUD with status, priority, deadline, and descriptions.
- Dashboard with task summary (total/completed/pending/overdue).
- Filter/search/sort tasks.
- Dark mode toggle.
- Responsive UI with sidebar + animated cards.
- Toast notifications, loading indicators, delete confirmation, and auto-refresh after updates.

## Setup Instructions

## 1) Clone and install

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

## 2) Configure environment variables

### Backend (`server/.env`)

Copy from `server/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task_management
JWT_SECRET=replace_with_secure_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)

Copy from `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 3) Run the app

In one terminal:

```bash
cd server
npm run dev
```

In another terminal:

```bash
cd client
npm run dev
```

Frontend default URL: `http://localhost:5173`
Backend default URL: `http://localhost:5000`

## API Endpoint Documentation

Base URL: `/api`

### Auth

- `POST /auth/register`
  - Body: `{ "name": "John", "email": "john@example.com", "password": "secret123" }`
- `POST /auth/login`
  - Body: `{ "email": "john@example.com", "password": "secret123" }`
- `GET /auth/me`
  - Header: `Authorization: Bearer <token>`

### Tasks (Protected)

- `GET /tasks?status=&search=&sortBy=deadline|priority|createdAt&order=asc|desc`
- `GET /tasks/summary`
- `POST /tasks`
  - Body:
    ```json
    {
      "title": "Finish report",
      "description": "Finalize quarterly metrics",
      "deadline": "2026-12-31",
      "priority": "High",
      "status": "Pending"
    }
    ```
- `PUT /tasks/:id`
- `PATCH /tasks/:id/complete`
- `DELETE /tasks/:id`

## Validation and Error Handling

- Server-side input validation via `express-validator`.
- Centralized error middleware returns clear JSON error messages.

## Production Notes

- Use a long random `JWT_SECRET`.
- Add rate limiting + helmet in strict production environments.
- Deploy MongoDB with backups + monitoring.
- Use HTTPS and secure cookies if moving token storage to cookies.
