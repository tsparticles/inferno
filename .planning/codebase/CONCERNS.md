# Codebase Concerns

**Analysis Date:** 2026-04-10

## Tech Debt

**Package identity and import naming drift:**
- Issue: The published package identity uses `@tsparticles/inferno`, while internal docs and demo code still reference `inferno-particles`, creating a split API surface and migration ambiguity.
- Files: `components/inferno/package.json`, `apps/inferno/package.json`, `apps/inferno/src/index.tsx`, `components/inferno/README.md`, `README.md`
- Impact: Consumers can follow the wrong import path and fail builds or install the wrong package name.
- Fix approach: Standardize package name and import examples across docs, demo, and source entrypoints; keep one canonical import path.

**Legacy scaffold and placeholder metadata in shipped workspace app:**
- Issue: Demo package metadata and README still contain placeholders (`TODO`) and scaffold artifacts.
- Files: `apps/inferno/package.json`, `apps/inferno/README.md`
- Impact: Increases maintenance noise and lowers trust in demo correctness.
- Fix approach: Replace placeholders with accurate package description and usage, or mark demo as internal-only and exclude from release-facing docs.

**Build pipeline still carries obsolete or inconsistent tooling choices:**
- Issue: The codebase uses modern Webpack 5, but includes legacy/deprecated choices (`node-sass`, `devServer.contentBase`) and mixed Nx/Lerna workflows with Nx distributed settings commented out.
- Files: `apps/inferno/package.json`, `components/inferno/package.json`, `components/inferno/webpack.config.js`, `.github/workflows/nodejs.yml`, `nx.json`, `lerna.json`
- Impact: Higher chance of breakage during dependency updates and cross-environment build variance.
- Fix approach: Remove deprecated tooling, align Webpack config to current APIs, and choose one primary CI orchestration path (Nx affected or Lerna full-build).

**Generated/transpiled artifacts committed in source folders:**
- Issue: Both source SCSS and generated CSS/CSS sourcemap are present in app source.
- Files: `apps/inferno/src/components/Incrementer.scss`, `apps/inferno/src/components/Incrementer.css`, `apps/inferno/src/components/Incrementer.css.map`
- Impact: Increases merge conflicts and creates risk of stale generated assets in commits.
- Fix approach: Keep SCSS as source-of-truth, generate CSS at build time, and avoid committing generated style artifacts.

## Known Bugs

**Demo app imports a package name that is not declared in dependencies:**
- Symptoms: Demo entrypoint imports `inferno-particles`, but app dependencies declare `@tsparticles/inferno`.
- Files: `apps/inferno/src/index.tsx`, `apps/inferno/package.json`
- Trigger: Running demo build/install in a clean environment without a compatibility alias for `inferno-particles`.
- Workaround: Change the import in `apps/inferno/src/index.tsx` to the package actually declared in `apps/inferno/package.json`.

**Demo app imports a config package that is not listed in dependencies:**
- Symptoms: Demo imports `tsparticles-demo-configs`, while dependency list includes `@tsparticles/configs`.
- Files: `apps/inferno/src/index.tsx`, `apps/inferno/package.json`
- Trigger: Running `webpack` build for the demo app in a fresh install.
- Workaround: Replace the import with the installed package or add the missing dependency explicitly.

**Demo TSX intentionally violates type contract in render path:**
- Symptoms: `Visualizer` expects `number`, but caller passes concatenated string expression.
- Files: `apps/inferno/src/components/Incrementer.tsx`, `apps/inferno/src/components/Visualizer.tsx`
- Trigger: Running `tsc` (`pnpm run check`) for `apps/inferno`.
- Workaround: Pass a numeric value only, or update prop typing and usage intentionally.

## Security Considerations

**Runtime options URL is accepted without origin controls:**
- Risk: Passing untrusted `url` to `tsParticles.load` can fetch external JSON and create a remote configuration injection surface in consuming apps.
- Files: `components/inferno/src/Particles.tsx`, `components/inferno/src/IParticlesProps.ts`
- Current mitigation: No allowlist/origin validation is implemented in component code.
- Recommendations: Validate or restrict `url` origin in wrapper logic, and document trusted-source requirements for consumers.

**CI installs with `--no-frozen-lockfile`:**
- Risk: Non-deterministic dependency resolution in CI can introduce drift from committed lockfile and reduce supply-chain reproducibility.
- Files: `.github/workflows/nodejs.yml`
- Current mitigation: `pnpm-lock.yaml` is present in repository.
- Recommendations: Use frozen lockfile mode in CI and fail on lock drift.

## Performance Bottlenecks

**Any prop change triggers full particle container destroy/reload:**
- Problem: `componentDidUpdate` always calls `refresh()`, which destroys and recreates the particle instance.
- Files: `components/inferno/src/Particles.tsx`
- Cause: Update strategy is full reinitialization instead of incremental option diff/update.
- Improvement path: Compare only impactful props and apply partial updates when possible; avoid teardown on harmless prop changes.

**Deep equality check runs on complete prop tree every update cycle:**
- Problem: `shouldComponentUpdate` uses deep equality for all props, including large options objects.
- Files: `components/inferno/src/Particles.tsx`
- Cause: `fast-deep-equal` on frequently recreated objects can be CPU-heavy in reactive render loops.
- Improvement path: Stabilize props via memoized options and use narrower update predicates for high-frequency updates.

## Fragile Areas

**Async lifecycle sequencing with mutable state references:**
- Files: `components/inferno/src/Particles.tsx`
- Why fragile: `componentDidMount`, `forceUpdate`, and `componentDidUpdate` can queue overlapping async `refresh/load` calls without cancellation guards.
- Safe modification: Add request/version tokens or mounted-state checks to prevent stale async completions from overwriting current state.
- Test coverage: No automated tests detected for lifecycle race scenarios.

**Type declaration drift between source types and published declarations:**
- Files: `components/inferno/src/IParticlesState.ts`, `components/inferno/index.d.ts`
- Why fragile: Source state includes `init`, but declaration omits it; declaration also references `CSSProperties` without a local type import.
- Safe modification: Generate declaration files from source TS config or enforce declaration parity checks in CI.
- Test coverage: No type-level contract tests detected for package declarations.

**CommonJS export mutation pattern in package entrypoint:**
- Files: `components/inferno/index.js`
- Why fragile: Iterating keys and mutating `InfernoParticles.default` relies on export shape assumptions and can break on bundler output changes.
- Safe modification: Export explicit named/default mappings without runtime mutation.
- Test coverage: No entrypoint compatibility tests detected.

## Scaling Limits

**CI build strategy scales by rebuilding everything:**
- Current capacity: CI runs `npx lerna run build:ci` for all packages on each push/PR.
- Limit: Build time grows linearly with monorepo package count.
- Scaling path: Use Nx affected graph execution in CI for changed projects only (already partially scaffolded in commented workflow sections).

**Consumer bundle size scales with `loadFull` default usage in examples:**
- Current capacity: Demo and docs load full tsParticles bundle.
- Limit: Application startup and bundle size increase as plugin surface grows.
- Scaling path: Use selective feature loaders in examples and document minimal loaders as default guidance.

## Dependencies at Risk

**`node-sass` in devDependencies:**
- Risk: Deprecated ecosystem package with recurring native build and compatibility issues.
- Impact: Install/build instability across Node versions and CI runners.
- Migration plan: Replace with `sass` (Dart Sass) in `apps/inferno/package.json` and `components/inferno/package.json`.

**Version skew across tsParticles ecosystem packages:**
- Risk: Component package uses `@tsparticles/engine` `^4.0.0-beta.11`, while demo consumes `tsparticles`/engine-config packages on `^3.9.1` line.
- Impact: API incompatibility risk, subtle runtime/type mismatches, and hard-to-diagnose integration failures.
- Migration plan: Align major versions for `@tsparticles/engine`, `tsparticles`, and configs across workspace packages.

## Missing Critical Features

**No automated test suite for package behavior:**
- Problem: No unit/integration/E2E test files are present for component or demo app behavior.
- Blocks: Safe refactors for lifecycle, typing, export compatibility, and build pipeline modernization.

**No declaration validation gate in CI:**
- Problem: `index.d.ts` is maintained separately from source and is not validated against generated declarations.
- Blocks: Reliable typed consumer experience across releases.

## Test Coverage Gaps

**Component lifecycle and update behavior untested:**
- What's not tested: `destroy()`, `refresh()`, `componentDidUpdate`, and `forceUpdate` interaction under rapid prop changes.
- Files: `components/inferno/src/Particles.tsx`
- Risk: Regression in memory usage, stale state, or race-condition-induced runtime errors.
- Priority: High

**Entrypoint/package-resolution behavior untested:**
- What's not tested: CJS export compatibility and import path correctness for `@tsparticles/inferno` vs `inferno-particles`.
- Files: `components/inferno/index.js`, `apps/inferno/src/index.tsx`, `apps/inferno/package.json`
- Risk: Consumer install/build failures that are not caught before release.
- Priority: High

**Demo/typecheck path untested in CI as an explicit gate:**
- What's not tested: `apps/inferno` type-check command (`check`) is not invoked in workflow; only build command is run.
- Files: `apps/inferno/package.json`, `.github/workflows/nodejs.yml`
- Risk: Type regressions can ship unnoticed when webpack transpilation succeeds.
- Priority: Medium

---

*Concerns audit: 2026-04-10*
