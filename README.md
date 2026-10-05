# MindBridge Frontend

React and Vite frontend for MindBridge.

Repository: [MindbridgeTeam/frontend](https://github.com/MindbridgeTeam/frontend)

The setup below assumes package.json is at the repository root and defines dev, build and preview scripts. If the app is in a subfolder, enter that folder before running npm commands. Backend connection and required configuration should be confirmed with the team.

## Requirements

- Git
- Node.js compatible with the project's Vite version, and npm
- Access to the GitHub repository (required for private repositories)

## Run on your computer

```bash
git clone https://github.com/MindbridgeTeam/frontend.git
cd frontend
npm install
npm run dev
```

Cloning checks out the repository default branch. To review the frontend contribution before it is merged, first check out its branch (after it has been pushed):

```bash
git switch feature/mindbridge-frontend
```

Then run npm install and npm run dev. After merging, use the team-approved target branch.

Open the local URL printed by the development server. Keep the terminal running.

On Windows PowerShell, use npm.cmd instead of npm if npm.ps1 is blocked:

```powershell
npm.cmd install
npm.cmd run dev
```

If npm reports a missing package.json, navigate to the folder containing that file before running npm commands.

## Environment configuration

If the project provides .env.example, copy it to .env and fill in the documented values. If no example is supplied, confirm required configuration with the frontend developer. Never commit credentials or private .env files. Client-side Vite environment variables are visible in the built application and must not contain secrets.

## Contributing

Clone the repository, then create a branch from the agreed target branch:

```bash
git switch -c feature/mindbridge-frontend
```

Add the project files and README. Keep node_modules, dist, private .env files and any copied .git directory out of the contribution. Run the build, then review and push your changes:

```bash
git status
git add .
git diff --cached --stat
git commit -m "Add MindBridge frontend and setup documentation"
git push -u origin feature/mindbridge-frontend
```

On GitHub, open a pull request with feature/mindbridge-frontend as the compare branch and the agreed target branch as the base. Request review from the team.

## Review before merging

1. Check out feature/mindbridge-frontend and install dependencies.
2. Run the app and inspect the changed screens on desktop and mobile sizes.
3. Test navigation, forms, loading states and error states relevant to the changes.
4. Run npm run build and any additional checks defined in package.json.
5. Review the pull request's Files changed tab for unintended changes.
6. Merge into the agreed target branch after the team's required reviews and checks pass.

For an existing clean checkout, update remote branches with git fetch origin before switching branches. Commit or stash local work before switching or pulling.

## Production build and preview

Run these commands from the directory containing package.json:

```bash
npm run build
npm run preview
```

With standard Vite configuration, the production output is dist. Preview checks the production build locally; it is not the production hosting service.

## Deployment

Connect the team repository to the chosen hosting provider and configure:

| Setting | Value |
| --- | --- |
| Production branch | Team-approved branch, commonly main |
| Root directory | Folder containing package.json |
| Install command | npm ci when a matching package-lock.json is committed; otherwise npm install |
| Build command | npm run build |
| Output directory | dist, unless changed in Vite configuration |

Configure any required public environment variables on the host and rebuild after changing them. If the app uses browser-based URL routing, configure the host's single-page application fallback to index.html. GitHub Pages also requires a suitable Vite base path when hosting under a repository URL.

After deployment, verify the live page, assets, navigation, mobile layout and direct page refreshes.

## Backend handoff

Before connecting the backend, agree on endpoint URLs, request and response formats, authentication and error responses. Identify any mock data and replace it with the agreed API calls. Document required configuration in .env.example. A working frontend build alone does not confirm a working backend connection.
