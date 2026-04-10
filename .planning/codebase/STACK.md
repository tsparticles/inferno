# Technology Stack

**Analysis Date:** 2026-04-10

## Languages

**Primary:**
- TypeScript 6.x (via `typescript` `^6.0.2`) for library and demo source in `components/inferno/src/*.ts`, `components/inferno/src/*.tsx`, and `apps/inferno/src/*.tsx` (declared in `components/inferno/package.json` and `apps/inferno/package.json`).
- JavaScript (Node/CommonJS config) for build and tooling config in `apps/inferno/webpack.config.js`, `components/inferno/webpack.config.js`, and `components/inferno/.eslintrc.js`.

**Secondary:**
- CSS/SCSS for demo styling in `apps/inferno/src/main.css` and `apps/inferno/src/components/Incrementer.scss`.
- YAML for CI and workspace orchestration in `.github/workflows/nodejs.yml` and `pnpm-workspace.yaml`.

## Runtime

**Environment:**
- Node.js for build/CI/package workflows; CI pins Node.js `16` in `.github/workflows/nodejs.yml`.
- Browser runtime for rendered Inferno app and canvas particles in `apps/inferno/src/index.tsx` and `components/inferno/src/Particles.tsx`.

**Package Manager:**
- pnpm `10.33.0` declared in root `package.json` (`packageManager` field).
- Lockfile: present (`pnpm-lock.yaml`).

## Frameworks

**Core:**
- Inferno `^9.1.0` for UI component model (`apps/inferno/src/index.tsx`, `components/inferno/src/Particles.tsx`; dependency in `apps/inferno/package.json`, peer/dev in `components/inferno/package.json`).
- tsParticles engine (`@tsparticles/engine` `^4.0.0-beta.11` in component, `^3.9.1` in demo) for particle container lifecycle and options loading (`components/inferno/src/Particles.tsx`, `apps/inferno/src/index.tsx`).

**Testing:**
- Not detected (no `jest.config.*`, `vitest.config.*`, or test scripts in `package.json` files).

**Build/Dev:**
- Webpack 5 (`webpack`, `webpack-cli`, `webpack-dev-server`) for bundling and dev server in `apps/inferno/webpack.config.js` and `components/inferno/webpack.config.js`.
- Babel 7 (`@babel/core`, presets/plugins, `babel-loader`) for TS/JS transpilation configured through package deps and `.babelrc` files in `apps/inferno/.babelrc` and `components/inferno/.babelrc`.
- TypeScript compiler (`tsc`) for type checking (`check` scripts in `apps/inferno/package.json` and `components/inferno/package.json`; options in both `tsconfig.json` files).
- Lerna `^8.2.4` + Nx `^22.6.4` for monorepo task orchestration (`lerna.json`, `nx.json`, root scripts in `package.json`).
- ESLint + Prettier for code quality in `components/inferno/.eslintrc.js` and `components/inferno/package.json` scripts.

## Key Dependencies

**Critical:**
- `@tsparticles/engine` — core engine API used by the exported component (`components/inferno/src/Particles.tsx`, `components/inferno/src/IParticlesProps.ts`).
- `inferno` — framework runtime and component base class (`components/inferno/src/Particles.tsx`, `apps/inferno/src/index.tsx`).
- `fast-deep-equal` — prop-diff optimization for `shouldComponentUpdate` in `components/inferno/src/Particles.tsx`.

**Infrastructure:**
- `webpack`, `babel-loader`, `@babel/*` — build/transpile pipeline (`apps/inferno/webpack.config.js`, `components/inferno/webpack.config.js`).
- `lerna`, `nx`, `pnpm` — workspace orchestration (`lerna.json`, `nx.json`, `pnpm-workspace.yaml`, root `package.json`).
- `husky`, `@commitlint/*` — commit policy tooling from root `package.json` dependencies.

## Configuration

**Environment:**
- No runtime `.env` configuration file detected in repository root/workspaces (`glob` over `.env*` returned none).
- Optional CI secret reference exists for Nx Cloud token in comments (`NX_CLOUD_ACCESS_TOKEN`) in `.github/workflows/nodejs.yml`.

**Build:**
- Root task orchestration: `package.json`, `lerna.json`, `nx.json`, `pnpm-workspace.yaml`.
- Package build config: `apps/inferno/webpack.config.js`, `components/inferno/webpack.config.js`, `apps/inferno/tsconfig.json`, `components/inferno/tsconfig.json`, `components/inferno/.eslintrc.js`.

## Platform Requirements

**Development:**
- Use Node.js and pnpm workspace tooling as defined in root `package.json` and `pnpm-workspace.yaml`.
- Use pnpm workspaces (`apps/*`, `components/*`) for dependency linking (`package.json`, `pnpm-workspace.yaml`).

**Production:**
- Library distribution target is CommonJS bundle output from `components/inferno/webpack.config.js` (`output.libraryTarget: "commonjs"`, output file `dist/particles.js`).
- Demo deployment target is static bundle output from `apps/inferno/webpack.config.js` (`dist/bundle.js` + generated HTML).

---

*Stack analysis: 2026-04-10*
