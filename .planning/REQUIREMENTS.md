# Requirements: tsParticles Inferno Modernization

**Defined:** 2026-04-10
**Core Value:** The Inferno integration remains fully functional while being aligned with the latest ecosystem versions and modern code conventions, so future development is faster and lower-risk.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Dependency Alignment

- [ ] **DEPS-01**: Maintainer can update workspace/package dependencies to current stable versions where compatible without breaking existing package behavior
- [ ] **DEPS-02**: Maintainer can align tsParticles-related dependencies to a single `4.0.0-beta` line across `components/inferno` and `apps/inferno`
- [ ] **DEPS-03**: Consumer can install `@tsparticles/inferno` without unresolved peer dependency conflicts for supported Inferno and tsParticles ranges

### Runtime Parity

- [ ] **RT-01**: User can render `Particles` with existing props and observe the same lifecycle semantics (init, load, refresh, destroy) as before modernization
- [ ] **RT-02**: User can run the demo app and see particles initialize and render with the expected sample options

### Build and Quality

- [ ] **QUAL-01**: Maintainer can run workspace build commands successfully after modernization
- [ ] **QUAL-02**: Maintainer can run TypeScript checks for both Inferno component and demo packages without new type regressions
- [ ] **QUAL-03**: Maintainer can run lint/CI quality gates relevant to this package set with passing status

### Packaging and Release

- [ ] **PKG-01**: Consumer receives correct package metadata (`peerDependencies`, type declarations, entry points) compatible with existing consumption patterns
- [ ] **PKG-02**: Consumer can follow release notes/migration notes to upgrade to the modernized version with clear version and compatibility guidance
- [ ] **PKG-03**: Maintainer can publish modernization changes with semver-consistent signaling for any behavioral or compatibility changes

### Modern Syntax and Tooling

- [ ] **MOD-01**: Maintainer can migrate legacy syntax patterns in Inferno package sources to modern TypeScript/Inferno conventions while preserving behavior
- [ ] **MOD-02**: Maintainer can replace deprecated tooling paths required by the modernization scope (for example deprecated styling/build plugins) with supported equivalents

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Validation and Automation

- **AUTO-01**: Maintainer can run a dedicated consumer smoke-test fixture that validates external install-and-render behavior
- **AUTO-02**: Maintainer can run a compatibility matrix for selected Inferno/tsParticles combinations in CI
- **AUTO-03**: Maintainer can enforce additional release automation guardrails for changelog/version quality

### Packaging Evolution

- **PKG-04**: Consumer can use an explicitly hardened `exports` map with documented migration path and compatibility fallbacks

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| New end-user demo capabilities unrelated to modernization | Not needed to achieve dependency and syntax modernization goals |
| Cross-framework abstraction refactors beyond Inferno package needs | Adds complexity and coupling outside this project scope |
| Full API redesign of `Particles` props/events during modernization | High break risk; should be handled in dedicated major redesign effort |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DEPS-01 | Phase 1 | Pending |
| DEPS-02 | Phase 1 | Pending |
| DEPS-03 | Phase 1 | Pending |
| MOD-01 | Phase 2 | Pending |
| MOD-02 | Phase 2 | Pending |
| RT-01 | Phase 3 | Pending |
| RT-02 | Phase 3 | Pending |
| QUAL-01 | Phase 4 | Pending |
| QUAL-02 | Phase 4 | Pending |
| QUAL-03 | Phase 4 | Pending |
| PKG-01 | Phase 5 | Pending |
| PKG-02 | Phase 5 | Pending |
| PKG-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 13 total
- Mapped to phases: 13
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-10*
*Last updated: 2026-04-10 after roadmap creation*
