# Feature Research

**Domain:** Framework integration package modernization (tsParticles Inferno wrapper)
**Researched:** 2026-04-10
**Confidence:** MEDIUM-HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = maintainers/users lose trust quickly.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Runtime API parity (no wrapper behavior regressions) | Modernization releases are expected to preserve existing init/load/refresh/destroy behavior unless explicitly version-bumped as breaking | MEDIUM | Keep `@tsparticles/inferno` public API stable while updating internals; any break requires major semver communication. |
| Dependency alignment and compatibility floor | Users expect updated packages to install without peer conflict hell | MEDIUM | Align Inferno peer range + tsParticles beta line consistently across wrapper and demo; avoid mixed 3.x/4.x lines in same workspace. |
| Correct package metadata for library consumption (`peerDependencies`, `types`, entry points) | Integration packages are consumed by other apps, so metadata correctness is core functionality | MEDIUM | Ensure peer deps remain broad but correct; keep `types`; if adding `exports`, map legacy entry points to avoid breakage. |
| Green quality gates (build + typecheck + lint + CI) | “Modernized” package is expected to be verifiably healthy, not just dependency-bumped | LOW-MEDIUM | Minimum release gate: clean install, `check`, build, lint CI path. |
| Release notes + migration guidance | Consumers expect clear upgrade instructions, especially with beta-aligned dependencies | LOW | Include changed versions, possible breakpoints, and exact upgrade path. |
| SemVer-disciplined release + deprecation hygiene | Consumers rely on semantic versioning signals and deprecation warnings | LOW | Use semver correctly for breaking vs non-breaking; prefer deprecating bad versions over unpublishing. |

### Differentiators (Competitive Advantage)

Features that set this modernization apart from a “basic dependency bump.”

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Automated compatibility matrix for canary/stable (Inferno + tsParticles lines) | Gives maintainers confidence to ship faster and detect breakage before release day | MEDIUM-HIGH | Add matrix CI jobs for current supported Inferno and tsParticles beta/stable combos. |
| Consumer smoke-test fixture (real external-style app) | Proves package works as installed dependency, not only inside monorepo | MEDIUM | A tiny install-and-render fixture catches packaging/peer/export mistakes early. |
| Progressive module packaging strategy (CJS baseline + planned `exports` hardening) | Improves future-proofing while minimizing immediate break risk | HIGH | Keep current compatibility now, then phase in explicit exports in a controlled major if needed. |
| Framework-idiomatic modernization (Inferno syntax/conventions, not generic abstractions) | Better maintainer DX and lower bug rate than “one abstraction layer for all frameworks” | MEDIUM | Prioritize idiomatic Inferno component lifecycle + typings over cross-framework indirection. |
| Release automation guardrails (changeset quality checks, pre-release channel discipline) | Reduces human error in beta-line updates and speeds repeatable releases | MEDIUM | Automate versioning checks/changelog quality; keep beta tags explicit. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that look attractive but are counterproductive for this modernization milestone.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| API redesign bundled into modernization | “If touching code, let’s redesign props/events too” | Blends migration with product redesign, creates avoidable breaking surface and delays release | Keep API parity now; open separate RFC/major for API redesign later |
| Broad legacy compatibility matrix (very old Inferno/tsParticles support) | Fear of dropping users | Explodes maintenance cost and blocks dependency/tooling modernization | Define explicit support floor, publish compatibility table, and use deprecation messaging |
| Cross-framework abstraction layer in this package | Desire to reduce duplicated code across wrappers | Hides framework-specific lifecycle nuances and increases coupling/rewrite risk | Keep Inferno wrapper explicit; share only small utilities/config where proven |
| “Feature creep” demo expansion | Demo is visible, so extra UX features are tempting | Out of scope for modernization and diverts effort from reliability gates | Keep demo minimal as integration validation harness |
| Hard switch to restrictive `exports` map without transition | Seen as “modern package standard” | Can break undocumented deep imports immediately | Introduce only with mapped legacy subpaths or major version with migration note |

## Feature Dependencies

```
[Dependency alignment + compatibility floor]
    └──requires──> [Runtime API parity validation]
                         └──requires──> [Consumer smoke-test fixture]

[Correct package metadata]
    └──requires──> [Type declarations integrity]

[Green quality gates]
    └──requires──> [Dependency alignment + compatibility floor]

[Release notes + migration guidance]
    └──requires──> [SemVer-disciplined release]

[Progressive module packaging strategy]
    └──conflicts (same phase)──> [Hard switch to restrictive exports without transition]
```

### Dependency Notes

- **Dependency alignment requires runtime parity validation:** version updates are only safe when wrapper lifecycle behavior is unchanged (or explicitly versioned as breaking).
- **Quality gates require aligned dependencies first:** CI signal is noisy/useless if dependency graph is still inconsistent.
- **Release notes depend on semver decisions:** migration guidance is only credible when release type (patch/minor/major/beta) is explicit.
- **Progressive packaging conflicts with immediate restrictive exports:** introducing strict encapsulation without transition creates avoidable consumer breakage.

## MVP Definition

### Launch With (v1)

Minimum viable modernization release.

- [ ] Dependency alignment to maintainer target (`@tsparticles/*` on 4.0.0-beta line where intended) — core project objective.
- [ ] Runtime API parity + wrapper lifecycle stability — avoids churn for existing consumers.
- [ ] Green CI quality gates (build/typecheck/lint) for library and demo — minimum release credibility.
- [ ] Accurate package metadata (`peerDependencies`, `types`, entry compatibility) — prevents install/runtime surprises.
- [ ] Changelog + migration notes — required for safe adoption.

### Add After Validation (v1.x)

- [ ] Consumer smoke-test fixture in CI — add once baseline modernization is merged.
- [ ] Compatibility matrix expansion — add when active support policy is finalized.
- [ ] Release automation hardening (extra guardrails) — add after first successful modernized release.

### Future Consideration (v2+)

- [ ] Controlled `exports` encapsulation strategy — defer to dedicated major with clear migration path.
- [ ] Any API redesign/refactor beyond modernization scope — only after stabilization period.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Runtime API parity | HIGH | MEDIUM | P1 |
| Dependency alignment (tsParticles + Inferno) | HIGH | MEDIUM | P1 |
| Green CI quality gates | HIGH | LOW-MEDIUM | P1 |
| Correct package metadata (`peerDependencies`, `types`, entry points) | HIGH | MEDIUM | P1 |
| Migration notes + semver clarity | HIGH | LOW | P1 |
| Consumer smoke-test fixture | MEDIUM-HIGH | MEDIUM | P2 |
| Compatibility matrix automation | MEDIUM-HIGH | MEDIUM-HIGH | P2 |
| Progressive module packaging hardening | MEDIUM | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | Competitor A | Competitor B | Our Approach |
|---------|--------------|--------------|--------------|
| Modernization baseline (deps + CI + docs) | Common in actively maintained framework wrappers (general ecosystem pattern) | Common in actively maintained framework wrappers (general ecosystem pattern) | Treat as non-negotiable table stakes |
| Strict package encapsulation (`exports`) | Increasingly common in newer packages | Mixed in legacy wrappers due to break risk | Phase in carefully, not as a surprise break in modernization |

## Sources

- Project context and constraints: `.planning/PROJECT.md` (HIGH)
- Current stack baseline: `.planning/codebase/STACK.md` (HIGH)
- Current package metadata: `components/inferno/package.json`, `apps/inferno/package.json` (HIGH)
- npm `package.json` reference (`peerDependencies`, `exports`, metadata behavior): https://docs.npmjs.com/cli/v10/configuring-npm/package-json (HIGH)
- Node.js package entry points and `exports` breaking-change behavior: https://nodejs.org/api/packages.html#package-entry-points (HIGH)
- TypeScript declaration publishing guidance (`types` field): https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html (HIGH)
- Semantic Versioning 2.0.0 spec: https://semver.org/ (HIGH)
- npm deprecate/undeprecate guidance: https://docs.npmjs.com/deprecating-and-undeprecating-packages-or-package-versions (HIGH)

---
*Feature research for: tsParticles Inferno modernization*
*Researched: 2026-04-10*
