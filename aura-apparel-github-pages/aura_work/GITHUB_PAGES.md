# GitHub Pages deployment

This project is configured for GitHub Pages using Vite + GitHub Actions.

## Deploy

1. Create a GitHub repository and upload this project.
2. Push the project to the `main` branch.
3. In **Settings → Pages**, set **Source** to **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` builds and deploys the `dist` folder.

The Vite base is relative (`./`) so assets work on GitHub Pages project URLs.

## Important: backend/API

This project contains an Express/Node backend and the frontend calls `/api/*`. GitHub Pages only hosts static files; it does **not** run `server.ts` or the database/API.

Therefore GitHub Pages can publish the frontend bundle, but features that require the backend (products loaded from the API, checkout/order submission, admin login/dashboard, settings, etc.) require a separately hosted backend and an API URL configured in the frontend.
