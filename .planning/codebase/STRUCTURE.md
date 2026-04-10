# Codebase Structure

**Analysis Date:** 2026-04-10

## Directory Layout

```text
inferno/
├── apps/                      # Executable application packages
│   └── inferno/               # Demo app consuming the component package
├── components/                # Reusable library packages
│   └── inferno/               # Published Inferno particles component
├── .github/workflows/         # CI pipeline definitions
├── .planning/codebase/        # Generated architecture/quality/stack mapping docs
├── package.json               # Workspace root scripts and shared dev dependencies
├── pnpm-workspace.yaml        # Workspace package globs
├── lerna.json                 # Lerna package orchestration settings
└── nx.json                    # Nx task caching defaults
```

## Directory Purposes

**`apps/inferno/`:**
- Purpose: Host runnable demo for development verification and usage examples.
- Contains: Demo source in `apps/inferno/src/`, package-local build config (`apps/inferno/webpack.config.js`, `apps/inferno/tsconfig.json`), local scripts in `apps/inferno/package.json`.
- Key files: `apps/inferno/src/index.tsx`, `apps/inferno/src/components/Incrementer.tsx`, `apps/inferno/webpack.config.js`.

**`components/inferno/`:**
- Purpose: Implement and package reusable Inferno wrapper around tsParticles.
- Contains: Core source in `components/inferno/src/`, package entrypoints (`components/inferno/index.js`, `components/inferno/index.d.ts`), packaging config (`components/inferno/webpack.config.js`, `components/inferno/package.json`).
- Key files: `components/inferno/src/Particles.tsx`, `components/inferno/src/index.ts`, `components/inferno/src/IParticlesProps.ts`.

**`.github/workflows/`:**
- Purpose: Define CI jobs for build validation.
- Contains: GitHub Actions workflow file.
- Key files: `.github/workflows/nodejs.yml`.

**Workspace root (`/`):**
- Purpose: Coordinate packages and shared tooling.
- Contains: Monorepo orchestration configs and lockfiles.
- Key files: `package.json`, `pnpm-workspace.yaml`, `lerna.json`, `nx.json`, `pnpm-lock.yaml`.

## Key File Locations

**Entry Points:**
- `apps/inferno/src/index.tsx`: Browser app bootstrap and demo composition.
- `components/inferno/src/index.ts`: Library source barrel export.
- `components/inferno/index.js`: Package runtime CommonJS entrypoint.

**Configuration:**
- `package.json`: Root build scripts (`build`, `build:ci`) and workspace metadata.
- `pnpm-workspace.yaml`: Workspace package inclusion (`apps/*`, `components/*`).
- `lerna.json`: Package discovery + release/version command settings.
- `nx.json`: Task input defaults and build caching.
- `apps/inferno/webpack.config.js`: Demo bundling and dev server.
- `components/inferno/webpack.config.js`: Library bundling with externals.
- `apps/inferno/tsconfig.json`: Demo TypeScript compiler behavior.
- `components/inferno/tsconfig.json`: Library TypeScript compiler behavior.

**Core Logic:**
- `components/inferno/src/Particles.tsx`: Core tsParticles lifecycle wrapper.
- `components/inferno/src/IParticlesProps.ts`: Public props contract.
- `components/inferno/src/IParticlesState.ts`: Internal state contract.

**Testing:**
- Not detected: no dedicated test directories or `*.test.*` / `*.spec.*` files in `apps/inferno/` or `components/inferno/`.

## Naming Conventions

**Files:**
- Component/type files use PascalCase for significant types and classes: `components/inferno/src/Particles.tsx`, `components/inferno/src/IParticlesProps.ts`.
- Entry/barrel files use lowercase conventional names: `components/inferno/src/index.ts`, `apps/inferno/src/index.tsx`.
- Demo utility files use lowercase descriptive naming: `apps/inferno/src/utils/math.ts`.

**Directories:**
- Top-level package grouping uses plural domain folders: `apps/`, `components/`.
- Package folder uses framework/domain identifier: `apps/inferno/`, `components/inferno/`.
- Within `src/`, use feature grouping folders such as `components/` and `utils/` (`apps/inferno/src/components/`, `apps/inferno/src/utils/`).

## Where to Add New Code

**New Feature:**
- Primary code: `components/inferno/src/` for reusable library behavior; `apps/inferno/src/` for demo-only behavior.
- Tests: Not established; create package-local tests under `components/inferno/src/` or `apps/inferno/src/` using `*.test.ts`/`*.test.tsx` naming if introducing tests.

**New Component/Module:**
- Implementation: Add new reusable component modules under `components/inferno/src/` and re-export via `components/inferno/src/index.ts`.
- Demo visualization of new module: add usage example under `apps/inferno/src/components/` and wire it in `apps/inferno/src/index.tsx`.

**Utilities:**
- Shared helpers inside demo app: `apps/inferno/src/utils/`.
- Library-specific helpers: colocate under `components/inferno/src/` near `Particles.tsx` and export only when part of public API.

## Special Directories

**`components/inferno/dist/`:**
- Purpose: Bundled library output (`particles.js`) referenced by `components/inferno/index.js`.
- Generated: Yes (from `components/inferno/webpack.config.js`).
- Committed: Not detected in current tree listing.

**`apps/inferno/dist/`:**
- Purpose: Demo bundle output (`bundle.js`) from webpack build.
- Generated: Yes (from `apps/inferno/webpack.config.js`).
- Committed: Not detected in current tree listing.

**`.planning/codebase/`:**
- Purpose: Generated codebase mapping documents for planner/executor commands.
- Generated: Yes.
- Committed: Yes (intended documentation artifact location).

**`node_modules/`:**
- Purpose: Installed dependencies at root and package level.
- Generated: Yes.
- Committed: No (excluded by `.gitignore` behavior, not source-managed code).

---

*Structure analysis: 2026-04-10*
