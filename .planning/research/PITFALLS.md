# Domain Pitfalls

**Domain:** Modernizing an existing framework wrapper library + demo app in a JS/TS monorepo (`@tsparticles/inferno`)
**Researched:** 2026-04-10
**Confidence:** HIGH (official docs + npm registry metadata + current codebase)

## Critical Pitfalls

### Pitfall 1: Runtime/CI engine mismatch hidden by incremental local installs
**What goes wrong:** Modernized dependencies install locally but fail in CI or for contributors due to Node/pnpm engine constraints.

**Why it happens:** Current CI is pinned to Node 16 and pnpm 7, while current stack choices require newer runtimes (`webpack-dev-server@5` needs Node >=18.12, `webpack-cli@7` needs Node >=20.9, root `pnpm@10.33.0` needs Node >=18.12).

**Consequences:** Unreproducible builds, “works on my machine” merges, repeated lockfile churn, blocked releases.

**Prevention:**
- Create and enforce a compatibility matrix first (Node, pnpm, webpack-cli/dev-server, eslint/typescript-eslint).
- Upgrade CI/runtime constraints **before** broad dependency bumps.
- Add engines policy checks in CI (fail fast if runtime is below baseline).

**Detection / warning signs:**
- Install failures citing `Unsupported engine`.
- CI-only failures after dependency bump PRs.
- Frequent lockfile changes without source changes.

**Phase to address:** Phase 1 — Baseline & Compatibility Matrix

---

### Pitfall 2: Mixed tsParticles major lines between wrapper and demo
**What goes wrong:** Wrapper package validates against `@tsparticles/* 4.0.0-beta` while demo still runs 3.9.x, masking real integration breakage.

**Why it happens:** Modernization updates happen per-package, but wrapper libraries and demo apps are tightly coupled in behavior and typings.

**Consequences:** False confidence from demo runs, late API mismatch discovery, avoidable rework near release.

**Prevention:**
- Align all `@tsparticles/*` and `tsparticles` dependencies to the intended beta line in one coordinated phase.
- Add a workspace-level check that rejects mixed major lines for tsparticles packages.
- Validate wrapper + demo in the same CI job after alignment.

**Detection / warning signs:**
- `package.json` shows wrapper on 4.0.0-beta and demo on 3.9.x.
- Type mismatches around Engine/Container/options between packages.
- Runtime behavior differs between local demo and package consumer sample.

**Phase to address:** Phase 2 — Dependency Alignment

---

### Pitfall 3: “Modernization” that keeps deprecated toolchain parts
**What goes wrong:** Project appears upgraded but still depends on deprecated or frozen pieces (e.g., `node-sass`, legacy Babel proposal plugin).

**Why it happens:** Teams prioritize passing builds over dependency quality; deprecations are ignored until they become hard blockers.

**Consequences:** Future upgrades become harder, security/maintenance risk increases, build breakage when transitive ecosystem support drops.

**Prevention:**
- Replace `node-sass` with `sass` (Dart Sass) as part of tooling modernization.
- Replace `@babel/plugin-proposal-class-properties` with maintained transform path.
- Treat deprecation warnings as actionable backlog items, not noise.

**Detection / warning signs:**
- npm deprecation notices during install.
- Archived/maintenance-mode upstream repos.
- Repeated suppressions/workarounds in build config.

**Phase to address:** Phase 3 — Build/Tooling Modernization

---

### Pitfall 4: Config drift in Webpack modernization (schema-valid, behavior-wrong)
**What goes wrong:** Build config passes basic checks but dev behavior regresses due to stale options (`devServer.contentBase` in library config, legacy output patterns).

**Why it happens:** Teams update package versions without applying migration docs to config semantics.

**Consequences:** Broken dev server behavior, confusing local debugging, extra migration churn.

**Prevention:**
- Run explicit config migration pass (not just dependency bump).
- Replace outdated dev-server options with current schema (`static`, etc.).
- Keep a small “known-good” webpack config fixture for both app and library targets.

**Detection / warning signs:**
- Webpack schema/deprecation warnings in CI logs.
- Dev server starts but serves wrong static content / hot reload anomalies.
- Config contains v4-era keys in v5 stack.

**Phase to address:** Phase 3 — Build/Tooling Modernization

---

### Pitfall 5: Breaking wrapper API while refactoring internals
**What goes wrong:** Syntax modernization (class lifecycle cleanup, typing changes) unintentionally changes public behavior (`options` vs `params`, callback timing, `id` defaults, ref container handling).

**Why it happens:** Refactors focus on code style and miss contract-level backward compatibility for published wrapper consumers.

**Consequences:** Consumer breakages after publish, emergency patch releases, trust loss in wrapper stability.

**Prevention:**
- Freeze and document the current public contract before refactor.
- Add API-level regression tests around lifecycle (`init`, `load`, `refresh`, `destroy`) and callback invocation order.
- Keep compatibility shims (e.g., `params` alias) until major-version boundary.

**Detection / warning signs:**
- Type-level breaking changes in exported interfaces.
- Consumer examples need code changes for same behavior.
- Callback race conditions/duplicate loads after prop updates.

**Phase to address:** Phase 4 — Syntax/API Modernization

---

### Pitfall 6: No test safety net in modernization branch
**What goes wrong:** Build/type-check pass but runtime lifecycle regressions ship because there is no targeted test coverage.

**Why it happens:** Existing repo currently lacks detected test framework in this package area; modernization relies on manual demo checks.

**Consequences:** Regressions discovered post-merge/post-release, slower root-cause analysis.

**Prevention:**
- Add minimal but high-value tests first: mount/unmount, prop change refresh, callback execution, container cleanup.
- Add one demo smoke test that validates engine init + render path.
- Gate modernization PRs on test + check + build.

**Detection / warning signs:**
- PRs changing lifecycle code without test updates.
- Frequent “fix after release” patches for wrapper behavior.
- Confidence depends on manual visual verification only.

**Phase to address:** Phase 1 (test harness bootstrap) and Phase 5 (release hardening)

## Moderate Pitfalls

### Pitfall: Partial monorepo upgrades causing dependency graph skew
**What goes wrong:** One package updates tooling while sibling package remains older, producing inconsistent build behavior.

**Prevention:** Use synchronized dependency policies for shared build packages and run workspace-wide checks after each upgrade batch.

### Pitfall: CI using non-reproducible install mode during migration
**What goes wrong:** `--no-frozen-lockfile` can hide lockfile drift and allow accidental transient changes.

**Prevention:** Move back to frozen-lockfile installs once upgrade window closes; require explicit lockfile update PRs.

## Minor Pitfalls

### Pitfall: Over-modernizing outputs during same milestone
**What goes wrong:** Simultaneously changing module format/output strategy (e.g., CJS packaging shape) with dependency upgrades increases blast radius.

**Prevention:** Keep output format stable during dependency/syntax modernization; schedule packaging format changes separately.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Baseline setup | Engine mismatch (Node/pnpm/tooling) | Define runtime matrix and enforce in CI before dependency work |
| Dependency alignment | Mixed tsParticles majors | Enforce single major/beta line across app + wrapper |
| Tooling migration | Deprecated packages/config drift | Replace deprecated packages and run config migration checklist |
| Syntax/API refactor | Public contract drift | Add contract tests and keep compatibility shims |
| Release hardening | “Green build, broken runtime” | Add smoke tests + lifecycle regression checks |

## Sources

- Project context and baseline architecture/stack:
  - `.planning/PROJECT.md`
  - `.planning/codebase/STACK.md`
  - `.planning/codebase/ARCHITECTURE.md`
- Current repo files:
  - `.github/workflows/nodejs.yml`
  - `components/inferno/package.json`
  - `apps/inferno/package.json`
  - `components/inferno/src/Particles.tsx`
  - `components/inferno/src/IParticlesProps.ts`
- Official docs / authoritative metadata:
  - Webpack dev-server docs (Node requirement, config schema): https://webpack.js.org/configuration/dev-server/
  - Webpack migration guide (config changes): https://webpack.js.org/migrate/5/
  - Sass official announcement (Node Sass EOL): https://sass-lang.com/blog/node-sass-is-end-of-life/
  - npm registry metadata (engines, deprecations, deps) via `npm view` for:
    - `webpack-dev-server@5`
    - `webpack-cli@7`
    - `pnpm@10.33.0`
    - `node-sass`
    - `@babel/plugin-proposal-class-properties`
    - `tsparticles@3.9.1` / `tsparticles@4.0.0-beta.11`
