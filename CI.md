CI workflow

A GitHub Actions workflow was added at `.github/workflows/ci.yml` which:

- Installs dependencies in root, api, and web
- Builds the web and api packages
- Runs backend tests (api)

To run equivalent steps locally:

```
# install (root workspace)
npm ci
# build frontend
cd web && npm run build
# build backend
cd ../api && npm run build
# run backend tests
npm test
```
