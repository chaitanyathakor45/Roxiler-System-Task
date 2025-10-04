Quick helper scripts and test commands

API helper scripts:

- node api/scripts/listUsers.js — list first 50 users from DB
- node api/scripts/testSignupLogin.js — quick signup/login check
- node api/scripts/checkAuth.js — helper for auth checks

Run backend tests:

cd api
npm install
npm test

Build:

cd web
npm run build
cd api
npm run build

Notes:
- Start the API server with `npm run dev` before using the scripts if you prefer to run them against a running server. Tests import the `app` directly and do not require the server to be started.
- Ensure `api/.env` has a working DATABASE_URL.
