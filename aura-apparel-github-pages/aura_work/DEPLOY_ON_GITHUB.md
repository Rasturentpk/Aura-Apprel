# Deploy this project to GitHub Pages

1. Create a GitHub repository.
2. Upload all files from this folder to the repository's `main` branch.
3. Open **Settings → Pages**.
4. Under **Build and deployment → Source**, select **GitHub Actions**.
5. Push/commit to `main` (or run **Deploy to GitHub Pages** manually from the Actions tab).
6. Wait for the workflow to finish. GitHub will show the Pages URL in the deployment environment.

The project already includes a GitHub Actions workflow and Vite's relative `base: './'` setting for repository Pages URLs.

## Important

GitHub Pages is static hosting. This project also has an Express/Node backend (`server.ts`) and the frontend calls `/api/*`. The Pages site can publish the frontend bundle, but API/database/admin/order features need the backend hosted separately. Do not expect `server.ts` to run on GitHub Pages.
