# Coding Conventions

**Analysis Date:** 2026-04-10

## Naming Patterns

**Files:**
- Use `PascalCase.tsx` for class-based UI components (for example `components/inferno/src/Particles.tsx`, `apps/inferno/src/components/Incrementer.tsx`).
- Use `I*.ts` for TypeScript interfaces (for example `components/inferno/src/IParticlesProps.ts`, `components/inferno/src/IParticlesState.ts`).
- Use lowercase `index.ts` / `index.tsx` as module or app entry files (`components/inferno/src/index.ts`, `apps/inferno/src/index.tsx`).

**Functions:**
- Use `camelCase` for methods and functions (`components/inferno/src/Particles.tsx`: `destroy`, `refresh`, `loadParticles`; `apps/inferno/src/utils/math.ts`: `addOne`).
- Prefix event/handler methods with action-oriented names (`apps/inferno/src/components/Incrementer.tsx`: `doMath`; `apps/inferno/src/index.tsx`: `particlesInit`).

**Variables:**
- Use `camelCase` for local variables and constants (`components/inferno/src/Particles.tsx`: `cb`, `container`; `apps/inferno/src/index.tsx`: `container`).
- Use descriptive prop/state keys (`components/inferno/src/IParticlesProps.ts`: `canvasClassName`, `className`; `components/inferno/src/IParticlesState.ts`: `library`, `init`).

**Types:**
- Use `PascalCase` for interfaces and exported types (`IParticlesProps`, `IParticlesState`, `ParticlesProps`, `ParticlesState` in `components/inferno/src/index.ts`).

## Code Style

**Formatting:**
- Tool used: Prettier via shared config package in `components/inferno/package.json` (`"prettier": "@tsparticles/prettier-config"`).
- Apply formatting through scripts in `components/inferno/package.json`: `prettify:src`, `prettify:readme`, and CI checks `prettify:ci:*`.
- Use tab indentation based on `.editorconfig` in `components/inferno/.editorconfig` and `apps/inferno/.editorconfig` (`indent_style = tab`).
- Keep trailing commas in multiline objects/arrays as shown in `components/inferno/src/Particles.tsx`.

**Linting:**
- Tool used: ESLint with TypeScript plugin in `components/inferno/.eslintrc.js`.
- Run lint with autofix locally (`components/inferno/package.json`: `lint`) and non-fixing mode in CI (`lint:ci`).
- Key rules from `components/inferno/.eslintrc.js`:
  - `@typescript-eslint/explicit-member-accessibility` enforced (`no-public` style)
  - `@typescript-eslint/no-explicit-any` is warning
  - `@typescript-eslint/no-var-requires` is warning
  - `@typescript-eslint/ban-types` is warning

## Import Organization

**Order:**
1. External runtime imports first (`components/inferno/src/Particles.tsx`: `inferno`, `fast-deep-equal/react`, `@tsparticles/engine`).
2. Local type-only imports next (`components/inferno/src/Particles.tsx`: `import type { IParticlesProps } ...`).
3. Styles and local modules in app code (`apps/inferno/src/index.tsx`: local component, CSS, then engine/tsparticles imports).

**Path Aliases:**
- Not detected in `components/inferno/tsconfig.json` or `apps/inferno/tsconfig.json` (only `baseUrl: "./src"`, no `paths` mapping).

## Error Handling

**Patterns:**
- Use guard clauses for null/undefined runtime objects (`components/inferno/src/Particles.tsx`: `destroy()` checks `if (!this.state.library) return;`, `loadParticles()` checks `if (!this.state.init) return;`).
- Handle async lifecycle work with `async/await` in component methods and callbacks (`components/inferno/src/Particles.tsx`: `componentDidMount`, `refresh`, `loadParticles`).
- No centralized error boundary or explicit `try/catch` pattern detected in `components/inferno/src/*` or `apps/inferno/src/*`.

## Logging

**Framework:** console

**Patterns:**
- Runtime source files do not log in the library implementation (`components/inferno/src/*`).
- Console logging appears in README examples (`components/inferno/README.md`, `README.md`) as demonstration only.

## Comments

**When to Comment:**
- Keep comments for API explanation and examples; source comments are sparse in library code (`components/inferno/src/*`).
- Demo app includes explanatory comments for TypeScript learning context (`apps/inferno/src/components/Incrementer.tsx`, `apps/inferno/src/components/Visualizer.tsx`).

**JSDoc/TSDoc:**
- Minimal JSDoc usage is present (`components/inferno/src/Particles.tsx` class `@param` comment), but not consistently applied across all exported symbols.

## Function Design

**Size:**
- Keep component helper methods focused and short (for example `destroy`, `refresh`, `loadParticles` in `components/inferno/src/Particles.tsx`).

**Parameters:**
- Type public APIs with explicit interfaces (`components/inferno/src/IParticlesProps.ts`, `components/inferno/src/IParticlesState.ts`).
- Prefer typed callback signatures for async hooks (`init?: (engine: Engine) => Promise<void>`, `loaded?: (container: Container) => Promise<void>` in `components/inferno/src/IParticlesProps.ts`).

**Return Values:**
- Use explicit return types on methods and functions (`components/inferno/src/Particles.tsx`, `apps/inferno/src/utils/math.ts`).

## Module Design

**Exports:**
- Use a default export for primary component plus named export mirror (`components/inferno/src/index.ts`).
- Re-export public types from the package entrypoint (`components/inferno/src/index.ts`).

**Barrel Files:**
- Use single entry barrel at `components/inferno/src/index.ts` for package API surface.

---

*Convention analysis: 2026-04-10*
