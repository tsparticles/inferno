# External Integrations

**Analysis Date:** 2026-04-10

## APIs & External Services

**Particle Engine Runtime:**
- tsParticles engine/service — used to initialize, load, and destroy particle containers from Inferno components.
  - SDK/Client: `@tsparticles/engine` (imported in `components/inferno/src/Particles.tsx` and `components/inferno/src/IParticlesProps.ts`).
  - Auth: Not applicable.

**Remote Configuration Fetch (Consumer-provided):**
- Arbitrary remote JSON URL passed through component props — used by `tsParticles.load` via `url` option.
  - SDK/Client: Internal `tsParticles.load` call in `components/inferno/src/Particles.tsx` (prop defined in `components/inferno/src/IParticlesProps.ts`).
  - Auth: Not defined in this repository; caller must handle endpoint access requirements.

**Repository/Package Hosting:**
- npm registry — package publication/distribution metadata present in `README.md` and `components/inferno/package.json`.
  - SDK/Client: Not applicable.
  - Auth: Not detected in repository files.

## Data Storage

**Databases:**
- Not detected.
  - Connection: Not applicable.
  - Client: Not applicable.

**File Storage:**
- Local filesystem only (webpack build outputs to `apps/inferno/dist` and `components/inferno/dist` as configured in each `webpack.config.js`).

**Caching:**
- GitHub Actions cache for pnpm store in `.github/workflows/nodejs.yml`.

## Authentication & Identity

**Auth Provider:**
- None for application runtime.
  - Implementation: Not applicable.

## Monitoring & Observability

**Error Tracking:**
- None detected (no Sentry/Datadog/New Relic integrations in source imports).

**Logs:**
- CI job log output from GitHub Actions steps in `.github/workflows/nodejs.yml`.
- Example/demo uses `console.log` in README snippets (`README.md`, `components/inferno/README.md`), not an integrated logging service.

## CI/CD & Deployment

**Hosting:**
- Package/release workflow oriented toward npm package distribution (metadata in `components/inferno/package.json` and top-level `README.md`).
- Demo app is bundled static assets (deployment platform not specified in repo files).

**CI Pipeline:**
- GitHub Actions workflow in `.github/workflows/nodejs.yml`.
- Pipeline installs dependencies with pnpm and runs `npx lerna run build:ci`.

## Environment Configuration

**Required env vars:**
- No mandatory runtime env vars detected in application/component source.
- Optional CI variable reference: `NX_CLOUD_ACCESS_TOKEN` (commented in `.github/workflows/nodejs.yml`).

**Secrets location:**
- GitHub Actions repository secrets (inferred from `${{ secrets.NX_CLOUD_ACCESS_TOKEN }}` reference in `.github/workflows/nodejs.yml`).
- `.env` files not detected in this repository snapshot.

## Webhooks & Callbacks

**Incoming:**
- GitHub webhook events to Actions workflow triggers (`push` and `pull_request`) in `.github/workflows/nodejs.yml`.

**Outgoing:**
- Client-side HTTP request performed by tsParticles when `url` prop is provided (through `tsParticles.load` in `components/inferno/src/Particles.tsx`).
- No server-side webhook dispatch implementation detected.

---

*Integration audit: 2026-04-10*
