# Architecture

**Analysis Date:** 2026-04-10

## Pattern Overview

**Overall:** Monorepo with package-oriented architecture (library package + demo application package) orchestrated from a workspace root.

**Key Characteristics:**
- Keep reusable Inferno integration logic in `components/inferno/src/` and expose it through `components/inferno/src/index.ts`.
- Keep runtime demonstration and manual verification in `apps/inferno/src/`, with browser bootstrap in `apps/inferno/src/index.tsx`.
- Centralize build orchestration at workspace root using `package.json`, `lerna.json`, `pnpm-workspace.yaml`, and `nx.json`.

## Layers

**Workspace Orchestration Layer:**
- Purpose: Manage multi-package build/version workflow and shared workspace behavior.
- Location: `package.json`, `lerna.json`, `pnpm-workspace.yaml`, `nx.json`.
- Contains: Workspace package definitions, build scripts, task caching defaults.
- Depends on: `lerna`, `pnpm`, `nx` configured in `package.json`.
- Used by: Both package directories `apps/inferno/` and `components/inferno/`.

**Component Library Layer:**
- Purpose: Implement and export the reusable Inferno `Particles` component wrapping the tsParticles engine.
- Location: `components/inferno/src/`.
- Contains: Component implementation in `components/inferno/src/Particles.tsx`, public API in `components/inferno/src/index.ts`, types in `components/inferno/src/IParticlesProps.ts` and `components/inferno/src/IParticlesState.ts`.
- Depends on: `inferno`, `@tsparticles/engine`, `fast-deep-equal` (`components/inferno/package.json`).
- Used by: Consumers via package entrypoints `components/inferno/index.js` and type declarations `components/inferno/index.d.ts`; demo app imports package from `apps/inferno/src/index.tsx`.

**Demo Application Layer:**
- Purpose: Provide runnable app showing library integration and TSX usage patterns.
- Location: `apps/inferno/src/`.
- Contains: App bootstrap `apps/inferno/src/index.tsx`, sample UI components in `apps/inferno/src/components/`, utility function in `apps/inferno/src/utils/math.ts`, static assets/styles in `apps/inferno/src/*.css` and `apps/inferno/src/index.html`.
- Depends on: Library package `@tsparticles/inferno` (workspace), `inferno`, and `tsparticles` (`apps/inferno/package.json`).
- Used by: Local development/build scripts in `apps/inferno/package.json` and bundling in `apps/inferno/webpack.config.js`.

**Build & Distribution Layer:**
- Purpose: Bundle sources and publish distributable artifacts.
- Location: `components/inferno/webpack.config.js`, `apps/inferno/webpack.config.js`, `components/inferno/index.js`.
- Contains: Webpack entry/output definitions, externals for library mode, CommonJS bridge entrypoint.
- Depends on: Babel + Webpack toolchain in each package `package.json`.
- Used by: `build` / `build:ci` scripts in package manifests and CI workflow `.github/workflows/nodejs.yml`.

## Data Flow

**Particle Component Lifecycle Flow:**

1. Consumer renders `<Particles />` via export from `components/inferno/src/index.ts`.
2. In `components/inferno/src/Particles.tsx`, `componentDidMount` optionally calls `props.init(tsParticles)` and marks internal `state.init` true.
3. `loadParticles()` invokes `tsParticles.load({ id, url, options })`, stores returned container in component state, and invokes `props.loaded(container)` callback when provided.

**Reconfiguration Flow on Prop Changes:**

1. `shouldComponentUpdate` in `components/inferno/src/Particles.tsx` uses deep equality (`fast-deep-equal/react`) to detect prop changes.
2. `componentDidUpdate` calls `refresh()`, which destroys existing container and reloads via `loadParticles()`.
3. `componentWillUnmount` calls `destroy()` to release container resources.

**Demo Initialization Flow:**

1. Browser entrypoint `apps/inferno/src/index.tsx` mounts `MyComponent` into `#app` from `apps/inferno/src/index.html`.
2. `MyComponent.particlesInit` calls `loadFull(engine)` from `tsparticles`.
3. Demo passes `basic` options and init callback to `Particles` component, then renders additional sample UI (`Incrementer`).

**State Management:**
- Use class component state inside component boundaries (`components/inferno/src/Particles.tsx`, `apps/inferno/src/components/Incrementer.tsx`).
- No global state store is present; state is local and lifecycle-driven.

## Key Abstractions

**Particles Wrapper Component:**
- Purpose: Abstract direct tsParticles engine interaction behind Inferno component props.
- Examples: `components/inferno/src/Particles.tsx`, `components/inferno/src/IParticlesProps.ts`.
- Pattern: Class-based UI adapter with lifecycle-managed resource creation/destruction.

**Typed Public API Surface:**
- Purpose: Keep consumer contract explicit and stable.
- Examples: `components/inferno/src/IParticlesProps.ts`, `components/inferno/src/IParticlesState.ts`, `components/inferno/src/index.ts`, `components/inferno/index.d.ts`.
- Pattern: Separate interface files + barrel export.

**Workspace Package Boundary:**
- Purpose: Separate reusable component (`components/inferno/`) from executable demo (`apps/inferno/`).
- Examples: `pnpm-workspace.yaml`, `lerna.json`, package manifests in `apps/inferno/package.json` and `components/inferno/package.json`.
- Pattern: Monorepo package partitioning with independent scripts and shared orchestration.

## Entry Points

**Demo Runtime Entry Point:**
- Location: `apps/inferno/src/index.tsx`
- Triggers: Loaded by webpack `entry` in `apps/inferno/webpack.config.js`.
- Responsibilities: Mount app, initialize engine loader callback, provide sample `Particles` props and sample UI components.

**Library Source Entry Point:**
- Location: `components/inferno/src/index.ts`
- Triggers: Bundled by webpack `entry` in `components/inferno/webpack.config.js`.
- Responsibilities: Export component and public TypeScript types.

**Library Package Runtime Entry Point:**
- Location: `components/inferno/index.js`
- Triggers: Required by consumers through `main` field in `components/inferno/package.json`.
- Responsibilities: Re-export built artifact from `components/inferno/dist/particles` and merge named exports onto default export.

**CI Entry Point:**
- Location: `.github/workflows/nodejs.yml`
- Triggers: Push and pull-request events targeting `main`/`legacy`.
- Responsibilities: Install dependencies and run `npx lerna run build:ci` across packages.

## Error Handling

**Strategy:** Guard-based lifecycle safety with minimal explicit exception handling.

**Patterns:**
- Early-return guard before destroy logic when no library instance is present (`components/inferno/src/Particles.tsx`).
- Async lifecycle methods use `await` directly without local `try/catch`; failures bubble to caller/runtime (`components/inferno/src/Particles.tsx`, `apps/inferno/src/index.tsx`).

## Cross-Cutting Concerns

**Logging:**
- No built-in logging framework detected in runtime source (`components/inferno/src/Particles.tsx`, `apps/inferno/src/index.tsx`).

**Validation:**
- Primary validation is static typing via TypeScript interfaces and strict compiler checks in `apps/inferno/tsconfig.json` and `components/inferno/tsconfig.json`.

**Authentication:**
- Not applicable for this codebase scope; no auth layer detected in `apps/inferno/src/` or `components/inferno/src/`.

---

*Architecture analysis: 2026-04-10*
