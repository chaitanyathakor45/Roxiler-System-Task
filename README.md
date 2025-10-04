# Store Ratings — Fullstack Challenge

A small fullstack monorepo implementing a role-based store ratings system. This repository contains an Express + Prisma backend (API) and a React + Vite frontend. The app supports roles (ADMIN, OWNER, USER), store ratings (1-5), and admin/owner dashboards.

## Features

- Signup & Login with JWT authentication
- Role-based access control: ADMIN, OWNER, USER
- Create stores and rate them (1-5), one rating per user per store
- Admin pages: create/list users & stores
- Owner dashboard: view store ratings and rater list
- Client-side and server-side validation using zod
- Toast notifications and interactive admin UI with Bootstrap
- Tests: Jest + supertest (smoke + e2e)
- CI: GitHub Actions workflow to build and test

## Tech Stack

- Backend: Node.js, Express, TypeScript, Prisma, MySQL (configured via DATABASE_URL)
- Frontend: React, Vite, TypeScript, React Query, react-hook-form, zod
- Auth: JWT, bcryptjs for password hashing
- Testing: Jest, supertest
- Styling: Custom CSS + Bootstrap + react-hot-toast

## Repository layout

- `api/` — Express + Prisma API
  - `src/` — TypeScript source
  - `prisma/` — Prisma schema and seed
  - `scripts/` — helper scripts (listUsers, testSignupLogin, checkAuth)
  - `test/` — Jest tests (smoke + e2e)

- `web/` — React frontend (Vite)
  - `src/` — React source

## Quickstart (development)

Prerequisites:
- Node.js 18+ and npm
- MySQL or PostgreSQL (configured via `api/.env` -> `DATABASE_URL`)

1. Install dependencies (root workspace uses workspaces):

```bash
# from repo root
npm install
cd api && npm install
cd ../web && npm install
```

2. Configure database in `api/.env` (example uses MySQL):

```
DATABASE_URL=mysql://root:password@127.0.0.1:3306/store_ratings
JWT_SECRET=change-this-secret
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

3. Migrate and seed (applies migrations and populates sample data):

```bash
cd api
npx prisma migrate dev --name init
npm run seed
```

4. Start dev servers (root helper):

```bash
# From repo root
npm run dev
# or run separately
cd api && npm run dev
cd web && npm run dev
```

- Backend: http://localhost:3000 (Swagger docs: /docs)
- Frontend: http://localhost:5173

## Build & Test

Build both packages:

```bash
npm run build
# or per package
cd web && npm run build
cd api && npm run build
```

Run backend tests (smoke + e2e):

```bash
cd api
npm test
```

## Helper scripts

- `node api/scripts/listUsers.js` — prints first 50 users from the database
- `node api/scripts/testSignupLogin.js` — quick signup/login check
- `node api/scripts/checkAuth.js` — helper for auth checks

## Notes on validation & security

- Passwords are validated server-side and must be 8–16 characters, include an uppercase and a special character.
- Emails are normalized on the client (trim + lowercase) to avoid login issues.
- For local development, `JWT_SECRET` defaults to `change-this-secret` if not set; do not use this in production.





## ScreenShots
