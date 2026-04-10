<!-- GSD:project-start source:PROJECT.md -->
## Project

**tsParticles Inferno Modernization**

This project modernizes the `@tsparticles/inferno` package and its demo app inside the tsParticles monorepo. It upgrades dependencies to the latest compatible versions, keeps tsParticles packages aligned on the 4.0.0 beta line being actively developed, and migrates legacy patterns toward modern TypeScript/Inferno syntax and tooling conventions. It is for maintainers and contributors who need the Inferno integration to stay current, consistent, and easy to evolve.

**Core Value:** The Inferno integration remains fully functional while being aligned with the latest ecosystem versions and modern code conventions, so future development is faster and lower-risk.

### Constraints

- **Compatibility**: Keep `@tsparticles/inferno` behavior stable for current consumers — avoid breaking runtime API contracts during modernization.
- **Versioning**: Use tsParticles `4.0.0-beta` family where requested — this is an explicit maintainer direction.
- **Workspace**: Respect existing monorepo orchestration (pnpm + Lerna + Nx) — changes must work within current workspace conventions.
- **Quality**: Preserve buildability and type correctness in both library and demo packages — modernization is not complete if pipelines fail.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 6.x (via `typescript` `^6.0.2`) for library and demo source in `components/inferno/src/*.ts`, `components/inferno/src/*.tsx`, and `apps/inferno/src/*.tsx` (declared in `components/inferno/package.json` and `apps/inferno/package.json`).
- JavaScript (Node/CommonJS config) for build and tooling config in `apps/inferno/webpack.config.js`, `components/inferno/webpack.config.js`, and `components/inferno/.eslintrc.js`.
- CSS/SCSS for demo styling in `apps/inferno/src/main.css` and `apps/inferno/src/components/Incrementer.scss`.
- YAML for CI and workspace orchestration in `.github/workflows/nodejs.yml` and `pnpm-workspace.yaml`.
## Runtime
- Node.js for build/CI/package workflows; CI pins Node.js `16` in `.github/workflows/nodejs.yml`.
- Browser runtime for rendered Inferno app and canvas particles in `apps/inferno/src/index.tsx` and `components/inferno/src/Particles.tsx`.
- pnpm `10.33.0` declared in root `package.json` (`packageManager` field).
- Lockfile: present (`pnpm-lock.yaml`).
## Frameworks
- Inferno `^9.1.0` for UI component model (`apps/inferno/src/index.tsx`, `components/inferno/src/Particles.tsx`; dependency in `apps/inferno/package.json`, peer/dev in `components/inferno/package.json`).
- tsParticles engine (`@tsparticles/engine` `^4.0.0-beta.11` in component, `^3.9.1` in demo) for particle container lifecycle and options loading (`components/inferno/src/Particles.tsx`, `apps/inferno/src/index.tsx`).
- Not detected (no `jest.config.*`, `vitest.config.*`, or test scripts in `package.json` files).
- Webpack 5 (`webpack`, `webpack-cli`, `webpack-dev-server`) for bundling and dev server in `apps/inferno/webpack.config.js` and `components/inferno/webpack.config.js`.
- Babel 7 (`@babel/core`, presets/plugins, `babel-loader`) for TS/JS transpilation configured through package deps and `.babelrc` files in `apps/inferno/.babelrc` and `components/inferno/.babelrc`.
- TypeScript compiler (`tsc`) for type checking (`check` scripts in `apps/inferno/package.json` and `components/inferno/package.json`; options in both `tsconfig.json` files).
- Lerna `^8.2.4` + Nx `^22.6.4` for monorepo task orchestration (`lerna.json`, `nx.json`, root scripts in `package.json`).
- ESLint + Prettier for code quality in `components/inferno/.eslintrc.js` and `components/inferno/package.json` scripts.
## Key Dependencies
- `@tsparticles/engine` — core engine API used by the exported component (`components/inferno/src/Particles.tsx`, `components/inferno/src/IParticlesProps.ts`).
- `inferno` — framework runtime and component base class (`components/inferno/src/Particles.tsx`, `apps/inferno/src/index.tsx`).
- `fast-deep-equal` — prop-diff optimization for `shouldComponentUpdate` in `components/inferno/src/Particles.tsx`.
- `webpack`, `babel-loader`, `@babel/*` — build/transpile pipeline (`apps/inferno/webpack.config.js`, `components/inferno/webpack.config.js`).
- `lerna`, `nx`, `pnpm` — workspace orchestration (`lerna.json`, `nx.json`, `pnpm-workspace.yaml`, root `package.json`).
- `husky`, `@commitlint/*` — commit policy tooling from root `package.json` dependencies.
## Configuration
- No runtime `.env` configuration file detected in repository root/workspaces (`glob` over `.env*` returned none).
- Optional CI secret reference exists for Nx Cloud token in comments (`NX_CLOUD_ACCESS_TOKEN`) in `.github/workflows/nodejs.yml`.
- Root task orchestration: `package.json`, `lerna.json`, `nx.json`, `pnpm-workspace.yaml`.
- Package build config: `apps/inferno/webpack.config.js`, `components/inferno/webpack.config.js`, `apps/inferno/tsconfig.json`, `components/inferno/tsconfig.json`, `components/inferno/.eslintrc.js`.
## Platform Requirements
- Use Node.js and pnpm workspace tooling as defined in root `package.json` and `pnpm-workspace.yaml`.
- Use pnpm workspaces (`apps/*`, `components/*`) for dependency linking (`package.json`, `pnpm-workspace.yaml`).
- Library distribution target is CommonJS bundle output from `components/inferno/webpack.config.js` (`output.libraryTarget: "commonjs"`, output file `dist/particles.js`).
- Demo deployment target is static bundle output from `apps/inferno/webpack.config.js` (`dist/bundle.js` + generated HTML).
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- Use `PascalCase.tsx` for class-based UI components (for example `components/inferno/src/Particles.tsx`, `apps/inferno/src/components/Incrementer.tsx`).
- Use `I*.ts` for TypeScript interfaces (for example `components/inferno/src/IParticlesProps.ts`, `components/inferno/src/IParticlesState.ts`).
- Use lowercase `index.ts` / `index.tsx` as module or app entry files (`components/inferno/src/index.ts`, `apps/inferno/src/index.tsx`).
- Use `camelCase` for methods and functions (`components/inferno/src/Particles.tsx`: `destroy`, `refresh`, `loadParticles`; `apps/inferno/src/utils/math.ts`: `addOne`).
- Prefix event/handler methods with action-oriented names (`apps/inferno/src/components/Incrementer.tsx`: `doMath`; `apps/inferno/src/index.tsx`: `particlesInit`).
- Use `camelCase` for local variables and constants (`components/inferno/src/Particles.tsx`: `cb`, `container`; `apps/inferno/src/index.tsx`: `container`).
- Use descriptive prop/state keys (`components/inferno/src/IParticlesProps.ts`: `canvasClassName`, `className`; `components/inferno/src/IParticlesState.ts`: `library`, `init`).
- Use `PascalCase` for interfaces and exported types (`IParticlesProps`, `IParticlesState`, `ParticlesProps`, `ParticlesState` in `components/inferno/src/index.ts`).
## Code Style
- Tool used: Prettier via shared config package in `components/inferno/package.json` (`"prettier": "@tsparticles/prettier-config"`).
- Apply formatting through scripts in `components/inferno/package.json`: `prettify:src`, `prettify:readme`, and CI checks `prettify:ci:*`.
- Use tab indentation based on `.editorconfig` in `components/inferno/.editorconfig` and `apps/inferno/.editorconfig` (`indent_style = tab`).
- Keep trailing commas in multiline objects/arrays as shown in `components/inferno/src/Particles.tsx`.
- Tool used: ESLint with TypeScript plugin in `components/inferno/.eslintrc.js`.
- Run lint with autofix locally (`components/inferno/package.json`: `lint`) and non-fixing mode in CI (`lint:ci`).
- Key rules from `components/inferno/.eslintrc.js`:
## Import Organization
- Not detected in `components/inferno/tsconfig.json` or `apps/inferno/tsconfig.json` (only `baseUrl: "./src"`, no `paths` mapping).
## Error Handling
- Use guard clauses for null/undefined runtime objects (`components/inferno/src/Particles.tsx`: `destroy()` checks `if (!this.state.library) return;`, `loadParticles()` checks `if (!this.state.init) return;`).
- Handle async lifecycle work with `async/await` in component methods and callbacks (`components/inferno/src/Particles.tsx`: `componentDidMount`, `refresh`, `loadParticles`).
- No centralized error boundary or explicit `try/catch` pattern detected in `components/inferno/src/*` or `apps/inferno/src/*`.
## Logging
- Runtime source files do not log in the library implementation (`components/inferno/src/*`).
- Console logging appears in README examples (`components/inferno/README.md`, `README.md`) as demonstration only.
## Comments
- Keep comments for API explanation and examples; source comments are sparse in library code (`components/inferno/src/*`).
- Demo app includes explanatory comments for TypeScript learning context (`apps/inferno/src/components/Incrementer.tsx`, `apps/inferno/src/components/Visualizer.tsx`).
- Minimal JSDoc usage is present (`components/inferno/src/Particles.tsx` class `@param` comment), but not consistently applied across all exported symbols.
## Function Design
- Keep component helper methods focused and short (for example `destroy`, `refresh`, `loadParticles` in `components/inferno/src/Particles.tsx`).
- Type public APIs with explicit interfaces (`components/inferno/src/IParticlesProps.ts`, `components/inferno/src/IParticlesState.ts`).
- Prefer typed callback signatures for async hooks (`init?: (engine: Engine) => Promise<void>`, `loaded?: (container: Container) => Promise<void>` in `components/inferno/src/IParticlesProps.ts`).
- Use explicit return types on methods and functions (`components/inferno/src/Particles.tsx`, `apps/inferno/src/utils/math.ts`).
## Module Design
- Use a default export for primary component plus named export mirror (`components/inferno/src/index.ts`).
- Re-export public types from the package entrypoint (`components/inferno/src/index.ts`).
- Use single entry barrel at `components/inferno/src/index.ts` for package API surface.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- Keep reusable Inferno integration logic in `components/inferno/src/` and expose it through `components/inferno/src/index.ts`.
- Keep runtime demonstration and manual verification in `apps/inferno/src/`, with browser bootstrap in `apps/inferno/src/index.tsx`.
- Centralize build orchestration at workspace root using `package.json`, `lerna.json`, `pnpm-workspace.yaml`, and `nx.json`.
## Layers
- Purpose: Manage multi-package build/version workflow and shared workspace behavior.
- Location: `package.json`, `lerna.json`, `pnpm-workspace.yaml`, `nx.json`.
- Contains: Workspace package definitions, build scripts, task caching defaults.
- Depends on: `lerna`, `pnpm`, `nx` configured in `package.json`.
- Used by: Both package directories `apps/inferno/` and `components/inferno/`.
- Purpose: Implement and export the reusable Inferno `Particles` component wrapping the tsParticles engine.
- Location: `components/inferno/src/`.
- Contains: Component implementation in `components/inferno/src/Particles.tsx`, public API in `components/inferno/src/index.ts`, types in `components/inferno/src/IParticlesProps.ts` and `components/inferno/src/IParticlesState.ts`.
- Depends on: `inferno`, `@tsparticles/engine`, `fast-deep-equal` (`components/inferno/package.json`).
- Used by: Consumers via package entrypoints `components/inferno/index.js` and type declarations `components/inferno/index.d.ts`; demo app imports package from `apps/inferno/src/index.tsx`.
- Purpose: Provide runnable app showing library integration and TSX usage patterns.
- Location: `apps/inferno/src/`.
- Contains: App bootstrap `apps/inferno/src/index.tsx`, sample UI components in `apps/inferno/src/components/`, utility function in `apps/inferno/src/utils/math.ts`, static assets/styles in `apps/inferno/src/*.css` and `apps/inferno/src/index.html`.
- Depends on: Library package `@tsparticles/inferno` (workspace), `inferno`, and `tsparticles` (`apps/inferno/package.json`).
- Used by: Local development/build scripts in `apps/inferno/package.json` and bundling in `apps/inferno/webpack.config.js`.
- Purpose: Bundle sources and publish distributable artifacts.
- Location: `components/inferno/webpack.config.js`, `apps/inferno/webpack.config.js`, `components/inferno/index.js`.
- Contains: Webpack entry/output definitions, externals for library mode, CommonJS bridge entrypoint.
- Depends on: Babel + Webpack toolchain in each package `package.json`.
- Used by: `build` / `build:ci` scripts in package manifests and CI workflow `.github/workflows/nodejs.yml`.
## Data Flow
- Use class component state inside component boundaries (`components/inferno/src/Particles.tsx`, `apps/inferno/src/components/Incrementer.tsx`).
- No global state store is present; state is local and lifecycle-driven.
## Key Abstractions
- Purpose: Abstract direct tsParticles engine interaction behind Inferno component props.
- Examples: `components/inferno/src/Particles.tsx`, `components/inferno/src/IParticlesProps.ts`.
- Pattern: Class-based UI adapter with lifecycle-managed resource creation/destruction.
- Purpose: Keep consumer contract explicit and stable.
- Examples: `components/inferno/src/IParticlesProps.ts`, `components/inferno/src/IParticlesState.ts`, `components/inferno/src/index.ts`, `components/inferno/index.d.ts`.
- Pattern: Separate interface files + barrel export.
- Purpose: Separate reusable component (`components/inferno/`) from executable demo (`apps/inferno/`).
- Examples: `pnpm-workspace.yaml`, `lerna.json`, package manifests in `apps/inferno/package.json` and `components/inferno/package.json`.
- Pattern: Monorepo package partitioning with independent scripts and shared orchestration.
## Entry Points
- Location: `apps/inferno/src/index.tsx`
- Triggers: Loaded by webpack `entry` in `apps/inferno/webpack.config.js`.
- Responsibilities: Mount app, initialize engine loader callback, provide sample `Particles` props and sample UI components.
- Location: `components/inferno/src/index.ts`
- Triggers: Bundled by webpack `entry` in `components/inferno/webpack.config.js`.
- Responsibilities: Export component and public TypeScript types.
- Location: `components/inferno/index.js`
- Triggers: Required by consumers through `main` field in `components/inferno/package.json`.
- Responsibilities: Re-export built artifact from `components/inferno/dist/particles` and merge named exports onto default export.
- Location: `.github/workflows/nodejs.yml`
- Triggers: Push and pull-request events targeting `main`/`legacy`.
- Responsibilities: Install dependencies and run `npx lerna run build:ci` across packages.
## Error Handling
- Early-return guard before destroy logic when no library instance is present (`components/inferno/src/Particles.tsx`).
- Async lifecycle methods use `await` directly without local `try/catch`; failures bubble to caller/runtime (`components/inferno/src/Particles.tsx`, `apps/inferno/src/index.tsx`).
## Cross-Cutting Concerns
- No built-in logging framework detected in runtime source (`components/inferno/src/Particles.tsx`, `apps/inferno/src/index.tsx`).
- Primary validation is static typing via TypeScript interfaces and strict compiler checks in `apps/inferno/tsconfig.json` and `components/inferno/tsconfig.json`.
- Not applicable for this codebase scope; no auth layer detected in `apps/inferno/src/` or `components/inferno/src/`.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
