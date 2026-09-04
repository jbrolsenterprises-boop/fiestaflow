# FiestaFlow

FiestaFlow is a Vite + React operations dashboard with optional Supabase-backed auth and data sync.

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment template:
   ```bash
   cp .env.example .env
   ```
3. Set required Supabase variables in `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Start dev server:
   ```bash
   npm run dev
   ```

If Supabase variables are not configured, the app runs in demo/offline fallback mode.

## Supabase notes

- Supabase client initialization is centralized in `src/lib/supabase.ts`.
- Browser-entered credentials from the Supabase config modal are saved to local storage and override empty env vars.
- Apply the SQL schema shown in the in-app **Supabase Database Connection** modal before using live data tables.

## GitHub Pages deployment

The workflow at `.github/workflows/deploy-pages.yml` builds `dist/` and deploys it with `actions/deploy-pages`.

- Build command: `npm run build`
- Output directory: `dist`
- Pages artifact upload: `actions/upload-pages-artifact@v3`
- Deploy action: `actions/deploy-pages@v4`

Vite base path is auto-set for Actions builds using the repository name (`/<repo>/`), which ensures assets resolve correctly on project Pages URLs like:

`https://jbrolsenterprises-boop.github.io/fiestaflow/`

### One-time repository settings

In GitHub repository settings:

1. Go to **Settings → Pages**.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Ensure Actions are allowed to deploy Pages for the repository.

## Validation commands

```bash
npm run lint
npm run build
```
