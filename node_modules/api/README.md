### API

Commands:

```bash
npm i
npx prisma migrate dev
npm run seed
npm run dev
```

Swagger: `http://localhost:3000/docs`
Helper scripts and tests

- `node scripts/listUsers.js` — prints first 50 users from the database (uses Prisma client).
- `node scripts/testSignupLogin.js` — simple node fetch script to POST /auth/signup and /auth/login for quick manual checks.
- `node scripts/checkAuth.js` — similar to testSignupLogin but prints full responses.

Tests:

- `npm test` — runs Jest test suites including `test/smoke.test.ts` and `test/e2e.test.ts`.

Build:

- `npm run build` — compiles TypeScript (tsc -p tsconfig.json).

Notes:

- Start the API locally before running scripts (`npm run dev`), or run tests which import the `app` directly.
- The scripts expect the server at http://localhost:3000.
