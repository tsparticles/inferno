# tsParticles Inferno Modernization

## What This Is

This project modernizes the `@tsparticles/inferno` package and its demo app inside the tsParticles monorepo. It upgrades dependencies to the latest compatible versions, keeps tsParticles packages aligned on the 4.0.0 beta line being actively developed, and migrates legacy patterns toward modern TypeScript/Inferno syntax and tooling conventions. It is for maintainers and contributors who need the Inferno integration to stay current, consistent, and easy to evolve.

## Core Value

The Inferno integration remains fully functional while being aligned with the latest ecosystem versions and modern code conventions, so future development is faster and lower-risk.

## Requirements

### Validated

- ✓ Inferno wrapper component mounts and manages tsParticles lifecycle (init, load, refresh, destroy) — existing
- ✓ Demo app renders the wrapper and initializes the engine with sample options — existing
- ✓ Monorepo workflows build library and app through pnpm/Lerna/Nx orchestration — existing

### Active

- [ ] All package dependencies are updated to latest stable/compatible versions where appropriate
- [ ] tsParticles-related dependencies are aligned to the 4.0.0 beta line across workspace packages
- [ ] Source code and build scripts are migrated to modern TypeScript/Inferno patterns without regressions
- [ ] Build and type-check pipelines remain green after modernization

### Out of Scope

- New end-user product features in the demo app — this initiative is focused on modernization and dependency alignment
- Cross-framework feature parity work beyond Inferno package scope — other framework packages are managed in their own tracks

## Context

This repository is a brownfield monorepo with separate library (`components/inferno`) and demo app (`apps/inferno`) packages. Existing architecture and stack analysis are available in `.planning/codebase/ARCHITECTURE.md` and `.planning/codebase/STACK.md`. The current stack includes Inferno 9.x, Webpack 5, Babel 7, TypeScript 6.x, and mixed tsParticles major lines between app and component packages; modernization needs to reduce version drift and adopt current syntax/tooling practices while preserving published package behavior.

## Constraints

- **Compatibility**: Keep `@tsparticles/inferno` behavior stable for current consumers — avoid breaking runtime API contracts during modernization.
- **Versioning**: Use tsParticles `4.0.0-beta` family where requested — this is an explicit maintainer direction.
- **Workspace**: Respect existing monorepo orchestration (pnpm + Lerna + Nx) — changes must work within current workspace conventions.
- **Quality**: Preserve buildability and type correctness in both library and demo packages — modernization is not complete if pipelines fail.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Prioritize dependency refresh as the first objective | User explicitly set dependency/version modernization as top priority | — Pending |
| Keep tsParticles dependencies on `4.0.0-beta` line | User is actively developing that beta line and needs local package alignment | — Pending |
| Migrate toward modern syntax/patterns during this initiative | Reduces technical debt and keeps package maintainable with current ecosystem practices | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check - still the right priority?
3. Audit Out of Scope - reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-10 after initialization*
