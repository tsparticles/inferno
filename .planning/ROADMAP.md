# Roadmap: tsParticles Inferno Modernization

## Overview

This roadmap delivers modernization as a contract-preserving sequence: first stabilize dependency alignment, then modernize tooling and internals without behavior drift, validate runtime and quality gates, and finish with packaging and release readiness so maintainers and consumers can upgrade confidently.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Dependency Alignment** - Align workspace dependencies and tsParticles versions to a stable, compatible baseline.
- [ ] **Phase 2: Tooling and Syntax Modernization** - Replace deprecated tooling paths and migrate legacy code patterns to modern TypeScript/Inferno conventions.
- [ ] **Phase 3: Runtime Parity Validation** - Confirm wrapper lifecycle semantics and demo behavior remain intact after modernization changes.
- [ ] **Phase 4: Build and Quality Gate Stabilization** - Ensure build, type-check, and lint/CI quality commands are consistently green.
- [ ] **Phase 5: Packaging and Release Readiness** - Finalize package metadata and release guidance for safe consumer adoption.

## Phase Details

### Phase 1: Dependency Alignment
**Goal**: Maintainers can keep dependencies current and consistent, with tsParticles aligned to one 4.0.0-beta line across wrapper and demo.
**Depends on**: Nothing (first phase)
**Requirements**: DEPS-01, DEPS-02, DEPS-03
**Success Criteria** (what must be TRUE):
  1. Maintainer can upgrade dependencies to current compatible versions and still run the existing package behavior without breakage.
  2. Maintainer can install and inspect workspace packages and see tsParticles-related dependencies aligned to one `4.0.0-beta` line in both `components/inferno` and `apps/inferno`.
  3. Consumer can install `@tsparticles/inferno` in supported setups without unresolved peer dependency conflicts.
**Plans**: TBD

### Phase 2: Tooling and Syntax Modernization
**Goal**: Maintainers can work on a modernized Inferno codebase and supported build toolchain without introducing behavioral regressions.
**Depends on**: Phase 1
**Requirements**: MOD-01, MOD-02
**Success Criteria** (what must be TRUE):
  1. Maintainer can review Inferno package source and find legacy syntax patterns replaced with modern TypeScript/Inferno conventions while behavior remains unchanged.
  2. Maintainer can run the modernization-targeted tooling paths and verify deprecated required tooling has been replaced with supported equivalents.
  3. Maintainer can apply routine updates going forward without relying on deprecated plugins or unsupported build paths.
**Plans**: TBD

### Phase 3: Runtime Parity Validation
**Goal**: Users can run the modernized wrapper and demo with the same expected runtime lifecycle behavior as before.
**Depends on**: Phase 2
**Requirements**: RT-01, RT-02
**Success Criteria** (what must be TRUE):
  1. User can render `Particles` with existing props and observe expected lifecycle semantics (init, load, refresh, destroy).
  2. User can run the Inferno demo app and see particles initialize and render with expected sample options.
  3. Maintainer can execute parity checks and confirm no user-visible runtime regressions from modernization.
**Plans**: TBD

### Phase 4: Build and Quality Gate Stabilization
**Goal**: Maintainers can reliably validate the modernized packages through workspace build and quality commands.
**Depends on**: Phase 3
**Requirements**: QUAL-01, QUAL-02, QUAL-03
**Success Criteria** (what must be TRUE):
  1. Maintainer can run workspace build commands and get successful completion for Inferno component and demo packages.
  2. Maintainer can run TypeScript checks for both packages and observe no new type regressions.
  3. Maintainer can run lint/CI quality gates relevant to this scope and get passing status.
**Plans**: TBD
**UI hint**: yes

### Phase 5: Packaging and Release Readiness
**Goal**: Consumers can adopt the modernized package with correct metadata and clear upgrade guidance, and maintainers can publish with semver-consistent signaling.
**Depends on**: Phase 4
**Requirements**: PKG-01, PKG-02, PKG-03
**Success Criteria** (what must be TRUE):
  1. Consumer can install and use published artifacts with correct `peerDependencies`, type declarations, and entry points compatible with current consumption patterns.
  2. Consumer can follow release/migration notes and understand version compatibility and upgrade expectations.
  3. Maintainer can publish modernization changes with semver-consistent signaling for any compatibility-impacting changes.
**Plans**: TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Dependency Alignment | 0/TBD | Not started | - |
| 2. Tooling and Syntax Modernization | 0/TBD | Not started | - |
| 3. Runtime Parity Validation | 0/TBD | Not started | - |
| 4. Build and Quality Gate Stabilization | 0/TBD | Not started | - |
| 5. Packaging and Release Readiness | 0/TBD | Not started | - |
