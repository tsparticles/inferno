# Architecture Research

**Domain:** Monorepo package modernization (Inferno wrapper + demo app)
**Researched:** 2026-04-10
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌────────────────────────────────────────────────────────────────────────────┐
│                    Workspace Orchestration Layer                           │
├────────────────────────────────────────────────────────────────────────────┤
│  pnpm workspace  │  Lerna task runner  │  Nx cache/task defaults          │
│  (root lockfile) │  (build/build:ci)   │  (target caching)                │
└───────────────┬───────────────────────────────┬─────────────────────────────┘
                │                               │
┌───────────────▼──────────────────────┐  ┌─────▼────────────────────────────┐
│    Library Package: components/inferno│  │   Demo App: apps/inferno         │
├───────────────────────────────────────┤  ├──────────────────────────────────┤
│ src/Particles.tsx lifecycle wrapper  │  │ src/index.tsx mounts demo        │
│ src/index.ts public API              │  │ imports workspace @tsparticles/...│
│ webpack lib bundle + CJS bridge      │  │ webpack app bundle + dev server  │
└──────────────────┬────────────────────┘  └───────────────┬─────────────────┘
                   │                                       │
                   └──────────────► tsParticles Engine ◄───┘
                                  (runtime library)
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Workspace orchestration (root) | Version alignment, install graph, CI build order | `pnpm-workspace.yaml`, root `package.json`, `lerna.json`, `nx.json` |
| Inferno wrapper package | Stable consumer API and lifecycle-safe engine management | Class component (`Particles.tsx`) + typed exports + `index.js` bridge |
| Demo app | Integration proof and manual regression surface | `src/index.tsx` calling `loadFull(engine)` and rendering wrapper |
| Build adapters | Convert TS/TSX to distributable outputs | package-local webpack + babel + tsc checks |
| tsParticles runtime | Particle container creation, refresh, destroy | `tsParticles.load(...)` + callbacks (`init`, `loaded`) |

## Recommended Project Structure (for modernization work)

```
components/inferno/
├── src/
│   ├── Particles.tsx          # runtime behavior contract (must stay stable)
│   ├── IParticlesProps.ts     # public API typing
│   ├── IParticlesState.ts     # wrapper internals
│   └── index.ts               # source export surface
├── index.js                   # published CJS bridge (compat boundary)
├── index.d.ts                 # published type boundary
├── package.json               # package deps/peers/scripts
└── webpack.config.js          # library bundling

apps/inferno/
├── src/index.tsx              # demo entry/integration harness
├── src/components/*           # non-contract sample UI
├── package.json               # app deps/scripts
└── webpack.config.js          # dev/prod app bundling

tooling (root)
├── package.json               # orchestration commands
├── pnpm-workspace.yaml        # workspace package topology
├── lerna.json                 # multi-package task execution
└── nx.json                    # cache behavior
```

### Structure Rationale

- **Contract-first boundary:** Treat `components/inferno/src/Particles.tsx`, `components/inferno/index.js`, and `components/inferno/index.d.ts` as the compatibility core. Modernize internals around these files, not through breaking public contract changes.
- **Demo as safety net, not source of truth:** `apps/inferno` should validate integration and tooling, but not define API behavior.
- **Separate dependency tracks:** Align tsParticles versions across library+demo first; defer optional stylistic refactors until dependency graph is stable.

## Architectural Patterns

### Pattern 1: Compatibility Shell + Internal Modernization

**What:** Keep external API surface unchanged while modernizing internals (types, syntax, build config).
**When to use:** Brownfield package with existing consumers and no feature expansion goal.
**Trade-offs:** Lowest regression risk; slightly slower modernization because wrappers/adapters remain temporarily.

**Example:**
```typescript
// External contract stays stable
export type { IParticlesProps } from "./IParticlesProps";
export default Particles;

// Internal modernization can still happen inside Particles.tsx
// (typing tightening, lifecycle guards, async flow cleanup)
```

### Pattern 2: Version Alignment Gate Before Refactor

**What:** Make dependency major/minor alignment a standalone stage before syntax or architecture refactors.
**When to use:** Monorepo packages currently on mixed major lines (here: tsParticles 3.x vs 4.0.0-beta).
**Trade-offs:** Adds one phase upfront; dramatically reduces ambiguous failures during refactors.

**Example:**
```text
Phase A: align @tsparticles/* versions in components+app
Phase B: run build/check for both packages
Phase C: only then modernize syntax/tooling
```

### Pattern 3: Demo-Driven Contract Verification

**What:** Use the demo app as an executable integration test harness after every package-level change.
**When to use:** No automated tests exist.
**Trade-offs:** Manual/CI smoke checks catch many regressions, but not exhaustive edge cases.

## Data Flow

### Runtime Flow (explicit direction)

```
Inferno consumer (demo or downstream app)
    ↓ props (id/options/url/init/loaded)
Particles wrapper (components/inferno/src/Particles.tsx)
    ↓ init callback (optional)
tsParticles engine instance
    ↓ load({ id, url, options })
Container instance
    ↓ setState + loaded callback + optional ref assignment
Consumer observable side effects
```

### Reconfiguration Flow

```
Prop change
    ↓ shouldComponentUpdate (deep-equal diff)
componentDidUpdate
    ↓
destroy existing container
    ↓
load new container
    ↓
loaded callback
```

### Build/Release Flow

```
Root build command
  → Lerna/Nx orchestrates package builds
    → components/inferno build + check
      → artifact: dist/particles.js (+ index.js bridge)
    → apps/inferno build + start/check (imports workspace package)
```

## Suggested Build Order (minimal regression risk)

1. **Baseline freeze + observability**
   - Capture current green commands (`pnpm -r check`, build scripts, demo start).
   - Record wrapper lifecycle behavior expectations (init/load/refresh/destroy callbacks).

2. **Dependency alignment phase (no behavior edits)**
   - Align app + component to tsParticles `4.0.0-beta` line.
   - Keep imports/API usage stable; only patch breakages needed for compile/runtime.
   - Validate both package build/check + demo runtime.

3. **Tooling compatibility phase**
   - Modernize clearly safe tooling gaps first (e.g., remove `node-sass` in favor of `sass`; keep webpack architecture intact).
   - Avoid bundler migration in this milestone unless required.

4. **Syntax/type modernization inside wrapper internals**
   - Improve type strictness, lifecycle clarity, and async safety in `Particles.tsx`.
   - Preserve prop names and callback semantics.

5. **Packaging boundary hardening**
   - Verify `index.js`/`index.d.ts`/`src/index.ts` remain coherent after internal changes.
   - Re-run consumer-like import checks via demo and package build.

6. **Optional cleanup**
   - Non-contract cosmetic refactors and README/demo cleanup only after all above are stable.

## Build Dependency Graph

```
Workspace dependency alignment
    → Component package compiles
        → Demo app compiles against workspace package
            → Runtime smoke validation
```

Implication: **Do not modernize demo syntax first**. The demo depends on the package contract; package stability must be established before app-layer cleanup.

## Anti-Patterns

### Anti-Pattern 1: Mixed-major migration + refactor in one PR

**What people do:** Upgrade tsParticles major line and refactor wrapper lifecycle/syntax simultaneously.
**Why it's wrong:** Failures become non-attributable (dependency break vs logic regression).
**Do this instead:** Separate “version alignment” and “internal refactor” into distinct phases/PRs.

### Anti-Pattern 2: Breaking API while “just modernizing”

**What people do:** Rename/remove props (`params`, callbacks, CJS bridge shape) during cleanup.
**Why it's wrong:** Consumer-facing regression masked as modernization.
**Do this instead:** Preserve API surface; if break is required, do explicit major-change planning.

### Anti-Pattern 3: Toolchain replacement during dependency stabilization

**What people do:** Attempt webpack→new bundler migration while resolving tsParticles version deltas.
**Why it's wrong:** Too many moving parts for brownfield stabilization.
**Do this instead:** Keep webpack in this milestone; isolate bundler migration to future dedicated milestone.

## Integration Points

### External Services/Libraries

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| `@tsparticles/engine` | Direct runtime API in wrapper (`tsParticles.load`) | Primary runtime contract; high regression sensitivity |
| `tsparticles` / configs | Demo-side engine feature loading (`loadFull`) | Must stay version-aligned with engine line |
| Inferno runtime | Component lifecycle + render | Peer compatibility boundary (`inferno >=7`) |
| webpack-dev-server | Local demo serving | Official docs indicate v5 requires Node >=18.12 |

### Internal Boundaries (what talks to what)

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Root orchestration ↔ package builds | CLI task orchestration (`lerna run`, `nx`) | Determines deterministic build ordering and CI behavior |
| Demo app ↔ component package | TypeScript import of workspace package | Primary integration safety check |
| Wrapper component ↔ tsParticles engine | Function calls + async callbacks | Most critical behavior boundary (init/load/refresh/destroy) |
| Source exports ↔ published entrypoints | Build artifact + CJS bridge mapping | Preserve legacy consumer import compatibility |

## Modernization Risk Matrix (for sequencing)

| Change Type | Risk | Place in Order |
|-------------|------|----------------|
| Version alignment inside current APIs | Medium | Early (Phase 2) |
| Replacing deprecated `node-sass` with `sass` | Low-Medium | Early-mid (Phase 3) |
| Wrapper internal refactor without API changes | Medium | Mid (Phase 4) |
| Export/entrypoint contract changes | High | Last or defer |
| Bundler architecture migration | High | Defer to separate milestone |

## Source-Backed Constraints (verified)

- `node-sass` is officially end-of-life (Sass team announcement, 2024-07-24) → migration to Dart Sass is recommended.
- `webpack-dev-server` v5 requires Node `>=18.12`; current CI baseline is Node 16 in this repo, so dev-server upgrades are runtime-environment sensitive.
- pnpm workspace protocol guarantees local linkage intent (`workspace:`), useful for controlling package/demo coupling during modernization.

## Sources

- Existing project docs and code:
  - `.planning/PROJECT.md`
  - `.planning/codebase/ARCHITECTURE.md`
  - `.planning/codebase/STACK.md`
  - `components/inferno/src/Particles.tsx`
  - `components/inferno/package.json`
  - `apps/inferno/src/index.tsx`
  - `apps/inferno/package.json`
  - root `package.json`, `lerna.json`, `nx.json`, `pnpm-workspace.yaml`
- Official references:
  - Webpack dev-server docs (Node requirement): https://webpack.js.org/configuration/dev-server/
  - Sass blog (Node Sass EOL): https://sass-lang.com/blog/node-sass-is-end-of-life/
  - pnpm workspace docs (workspace protocol and behavior): https://pnpm.io/workspaces

---
*Architecture research for: tsParticles Inferno modernization milestone*
*Researched: 2026-04-10*
