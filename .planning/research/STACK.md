# Stack Research

**Domain:** Inferno integration library modernization in a TypeScript monorepo  
**Researched:** 2026-04-10  
**Confidence:** MEDIUM-HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| Node.js | **22.22.x LTS** (minimum), test **24.14.x LTS** in CI matrix | Runtime for toolchain and CI | Current ecosystem baselines (Vite 8, Vitest 4, Lerna 9, ESLint 10) now expect modern Node. Moving off Node 16 is mandatory to keep tooling upgradable. | HIGH |
| TypeScript | **6.0.2** | Library + demo typing/transpile | Current stable and already aligned in repo; keeps modern syntax support without lagging typed-lint/test tooling. | HIGH |
| Inferno | **9.1.0** | UI/runtime peer for wrapper | Latest Inferno release line and current package baseline; keep as peer dependency floor for consumer compatibility. | HIGH |
| tsParticles engine family | **4.0.0-beta.11** (explicit beta pin) | Engine API consumed by wrapper + demo | Maintainer constraint is explicit beta-line alignment; use one line across workspace to remove runtime/type drift. | HIGH |
| pnpm workspaces | **10.33.0** | Workspace dependency management | Current in repo, supports `workspace:` protocol + `catalog:` for enforced version unification across packages. | HIGH |
| Nx task graph + Lerna release orchestration | **Nx 22.6.4 + Lerna 9.0.7** | Build graph/cache + version/publish workflow | Modern Lerna is Nx-backed; this is the current maintained path for JS/TS monorepo release pipelines. | HIGH |

### Supporting Libraries

| Library | Version | Purpose | When to Use | Confidence |
|---------|---------|---------|-------------|------------|
| `ts-plugin-inferno` | **6.1.1** | TSX -> Inferno-optimized output in TS pipeline | Use when building TSX through TypeScript transform path and you want Inferno-specific VNode output. | MEDIUM |
| `babel-plugin-inferno` | **6.8.5** | JSX -> Inferno-optimized output in Babel pipeline | Use only if Babel remains in path (legacy or mixed JS/TS transpilation). | MEDIUM |
| `sass` (Dart Sass) | **1.99.0** | SCSS compilation | Use for demo/UI styles; replace Node Sass entirely. | HIGH |
| `eslint` + `@typescript-eslint/*` | **10.2.0 + 8.58.1** | Static analysis for JS/TS | Use flat config + typed rules; keep formatter separate. | HIGH |
| `prettier` + `eslint-config-prettier` | **3.8.2 + 10.1.8** | Formatting + lint rule conflict suppression | Use as dedicated formatter; do not run formatting through lint rules/plugins. | HIGH |
| `vitest` | **4.1.4** | Unit/integration tests | Use as default test runner for modern TS monorepo packages. | HIGH |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `pnpm catalog` + `workspace:` protocol | Enforce single dependency line | Put shared versions (Inferno, TS, tsParticles, lint stack) in catalog to prevent per-package drift. |
| `nx targetDefaults` | Shared cache/pipeline policy | Define `build`, `check`, `lint`, `test` cache defaults once in `nx.json`. |
| Vite 8 (demo app) | Faster dev server + modern build for app package | Keep library and demo build strategies separate: Vite for app DX, library-focused bundler for publishable package. |
| `tsdown` 0.21.7 (library build) | Modern library bundling path replacing tsup | `tsup` is no longer actively maintained; tsdown is the recommended migration target by tsup itself. |

## Dependency Strategy (Prescriptive)

1. **Pin runtime/tooling floors centrally**
   - Set root engines to Node `>=22.12` (or stricter `>=22.22`).
   - Run CI on `22.x` + `24.x` to catch upcoming breakage early.

2. **Use one tsParticles line across all workspace packages**
   - Enforce `@tsparticles/*` and `tsparticles` to `4.0.0-beta.11` (or one selected beta) via pnpm catalog/overrides.
   - No mixed 3.x/4.x in demo vs component.

3. **Split dependency intent cleanly**
   - `peerDependencies`: `inferno`, external framework contracts.
   - `dependencies`: runtime needs for published wrapper (`@tsparticles/engine`, `fast-deep-equal`).
   - `devDependencies`: build/test/lint only.

4. **Modernize syntax toolchain with minimal risk**
   - Remove deprecated Babel proposal plugins.
   - Prefer TS-native output where possible; keep Inferno transform plugin only where it adds measurable value.

5. **Adopt controlled updates**
   - Weekly/biweekly dependency PR batches.
   - Group updates by risk tier: runtime peers, toolchain majors, patch/minor.
   - Require `build + check + lint + test` green in both `components/inferno` and `apps/inferno`.

## Installation

```bash
# Core workspace/runtime
pnpm add -w nx@22.6.4 lerna@9.0.7
pnpm add -w -D typescript@6.0.2 eslint@10.2.0 @typescript-eslint/parser@8.58.1 @typescript-eslint/eslint-plugin@8.58.1 prettier@3.8.2 eslint-config-prettier@10.1.8 vitest@4.1.4

# Inferno + tsParticles alignment (per package as needed)
pnpm add inferno@9.1.0 @tsparticles/engine@4.0.0-beta.11

# Styling
pnpm add -D sass@1.99.0

# Optional transforms (choose one path deliberately)
pnpm add -D ts-plugin-inferno@6.1.1
pnpm add -D babel-plugin-inferno@6.8.5
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Nx + Lerna 9 | Nx-only (drop Lerna) | Use when release/version workflows are fully migrated and Lerna adds no value. |
| Vite 8 for demo app | Keep Webpack 5 | Use only short-term if migration cost is blocking milestone delivery. |
| tsdown for library bundling | Rollup 4 manual config | Use when you need deep custom bundle graphs/plugin control that tsdown abstraction cannot express. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `node-sass` | Officially end-of-life/deprecated; no supported Node.js path forward | `sass` (Dart Sass) |
| `@babel/plugin-proposal-class-properties` | Deprecated by Babel; proposal is standardized | `@babel/plugin-transform-class-properties` or remove if unnecessary |
| `tsup` as long-term default | Project marked not actively maintained by maintainer; recommends migration | `tsdown` |
| Node 16 CI baseline | Incompatible with modern toolchain requirements | Node 22/24 LTS |
| Mixed tsParticles 3.x + 4.x in one workspace | Causes API and type drift, hides integration bugs until runtime | Single pinned 4.0.0-beta line |

## Stack Patterns by Variant

**If minimizing migration risk this milestone:**
- Keep Webpack for one milestone, but modernize dependencies/syntax first.
- Because dependency alignment and deprecation cleanup give immediate reliability gains with lower blast radius.

**If maximizing long-term maintainability:**
- Move demo to Vite 8 and library to tsdown in same modernization track.
- Because this matches current Node/TS ecosystem direction and reduces custom build maintenance.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `vite@8.0.8` | Node `^20.19 || >=22.12` | Forces CI/runtime modernization floor. |
| `vitest@4.1.4` | Vite `^6 || ^7 || ^8`, Node `>=20` | Good fit once Node floor is modernized. |
| `lerna@9.0.7` | Node `^20.19 || ^22.12 || >=24` | Upgrade from Lerna 8 pairs with Node floor bump. |
| `@typescript-eslint@8.58.1` | ESLint `^8.57 || ^9 || ^10`, Node `^18.18 || ^20.9 || >=21.1` | Supports ESLint 10 stack cleanly. |
| `@tsparticles/engine@4.0.0-beta.11` | `tsparticles@4.0.0-beta.11` line | Keep exact beta-family alignment across packages. |

## Sources

- npm registry metadata (`latest`, `dist-tags`, `engines`) for: Inferno, TypeScript, pnpm, Nx, Lerna, Vite, Vitest, ESLint, Sass, tsdown, ts-plugin-inferno, babel-plugin-inferno, webpack family — **HIGH**
- pnpm docs (workspaces/catalogs; updated Mar 30, 2026): https://pnpm.io/workspaces, https://pnpm.io/catalogs — **HIGH**
- Nx `nx.json` reference: https://nx.dev/reference/nx-json — **HIGH**
- Lerna + Nx docs: https://lerna.js.org/docs/lerna-and-nx — **HIGH**
- TypeScript-ESLint dependency/version docs: https://typescript-eslint.io/users/dependency-versions/ — **HIGH**
- ESLint flat config migration guide: https://eslint.org/docs/latest/use/configure/migration-guide — **HIGH**
- Sass Node Sass EOL announcement: https://sass-lang.com/blog/node-sass-is-end-of-life/ — **HIGH**
- Babel class properties docs (proposal plugin replacement context): https://babeljs.io/docs/babel-plugin-proposal-class-properties — **HIGH**
- Inferno main repo README and plugin repos/releases (Inferno transform strategy): https://github.com/infernojs/inferno, https://github.com/infernojs/babel-plugin-inferno, https://github.com/infernojs/ts-plugin-inferno — **MEDIUM**

---
*Stack research for: tsParticles Inferno modernization (stack dimension)*
*Researched: 2026-04-10*
