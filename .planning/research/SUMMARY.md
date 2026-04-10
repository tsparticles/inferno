# Project Research Summary

**Project:** tsParticles Inferno Modernization
**Domain:** Brownfield framework-wrapper modernization in a JS/TS monorepo
**Researched:** 2026-04-10
**Confidence:** HIGH

## Executive Summary

This is a brownfield modernization of the `@tsparticles/inferno` wrapper and its demo app, not a net-new product build. The research is consistent across all four tracks: experts handle this kind of work as a **contract-preserving stabilization effort** first (dependency/runtime alignment, CI/runtime compatibility, packaging correctness), then iterate on internal modernization. The central technical truth is that wrapper API behavior must remain stable while tooling and dependency lines move forward.

The recommended approach is opinionated: lock the runtime/tooling baseline to modern Node + pnpm, align all tsParticles packages to a single 4.0.0-beta line across both wrapper and demo, keep webpack architecture in this milestone, and modernize internals behind a compatibility shell. Launch scope should be strict P1 table stakes only (parity, alignment, quality gates, metadata correctness, migration notes), with smoke fixtures and matrix automation in follow-up phases.

Primary risks are phase-coupling risks: mixing dependency upgrades with refactors, hidden CI/runtime engine mismatch, and accidental public API drift during internal cleanup. Mitigation is sequencing discipline: compatibility matrix first, dependency alignment second, tooling deprecations/config drift third, wrapper internals fourth, and release hardening last.

## Key Findings

### Recommended Stack

Research strongly supports a modernized but conservative stack path: Node 22 LTS floor (with 24 in CI matrix), TypeScript 6, Inferno 9.1, and a single pinned tsParticles `4.0.0-beta.11` line workspace-wide. Monorepo orchestration should remain pnpm + Nx + Lerna 9, with centralized version control via pnpm catalog/workspace protocol and shared task caching via `nx targetDefaults`.

**Core technologies:**
- **Node.js 22.22.x LTS (CI also 24.x):** toolchain/runtime baseline — required for current ecosystem compatibility.
- **TypeScript 6.0.2:** typing/transpile baseline — already aligned and compatible with modern lint/test stack.
- **Inferno 9.1.0:** peer framework contract — stable wrapper compatibility floor.
- **tsParticles 4.0.0-beta.11 (single line):** engine contract — avoids mixed-major drift between wrapper and demo.
- **pnpm 10 + Nx 22 + Lerna 9:** workspace orchestration — maintained monorepo path with deterministic builds/releases.
- **Sass (Dart Sass):** styling path — replace EOL `node-sass`.
- **Vitest 4 + ESLint 10 + @typescript-eslint 8:** modern quality gates.

Critical version constraints: Vite/Lerna ecosystems require modern Node; mixed tsParticles 3.x/4.x is explicitly unsafe; `node-sass` is EOL and must be removed.

### Expected Features

The feature research is clear: this milestone is judged by modernization reliability, not new UI capability. Users expect behavior parity, install compatibility, and strong release hygiene.

**Must have (table stakes):**
- Runtime API/lifecycle parity (init/load/refresh/destroy semantics preserved).
- Dependency alignment (Inferno + tsParticles line consistency across wrapper/demo).
- Correct package metadata (`peerDependencies`, `types`, stable entry compatibility).
- Green quality gates (build/typecheck/lint for library + demo).
- Changelog/migration guidance with semver clarity.

**Should have (competitive):**
- Consumer smoke-test fixture (external-style install-and-render validation).
- Compatibility matrix automation across supported Inferno/tsParticles combinations.
- Release automation guardrails (changeset/release discipline).

**Defer (v2+):**
- Restrictive `exports` hardening without transition.
- API redesign or cross-framework abstraction work.

### Architecture Approach

Architecture research recommends a **compatibility-shell modernization**: preserve contract boundaries (`Particles.tsx` behavior + `index.js`/`index.d.ts` publish surface), treat demo as integration harness (not source of truth), and stage changes in dependency-first order. Major components are: (1) workspace orchestration (pnpm/Lerna/Nx), (2) wrapper package contract surface and lifecycle engine management, and (3) demo app as executable integration verifier. Core pattern: do version alignment before refactor; do tooling migration before deeper internals; defer high-risk bundler/entrypoint format shifts.

### Critical Pitfalls

1. **Runtime/CI engine mismatch** — modern deps fail under old Node/pnpm.  
   **Avoid by:** enforcing Node/pnpm/tooling compatibility matrix and CI engine checks first.

2. **Mixed tsParticles major lines (wrapper vs demo)** — false confidence and late breakage.  
   **Avoid by:** single workspace-wide tsParticles beta line + CI checks rejecting mixed majors.

3. **Deprecated tooling retained during “upgrade”** — modernization debt persists.  
   **Avoid by:** replacing `node-sass`, removing deprecated Babel proposal path, and addressing deprecation warnings immediately.

4. **Webpack config drift after version bumps** — schema-valid but behavior wrong.  
   **Avoid by:** explicit config migration pass (e.g., `devServer` semantics), with known-good fixtures.

5. **Accidental public API drift in internal refactor** — consumer breakage masked as cleanup.  
   **Avoid by:** contract freeze, lifecycle regression tests, and compatibility shims until explicit major.

## Implications for Roadmap

Based on combined findings, suggested phase structure:

### Phase 1: Baseline & Compatibility Matrix
**Rationale:** All downstream work is noisy/failure-prone without runtime/tooling baseline alignment.  
**Delivers:** Node/pnpm/toolchain floor policy, CI matrix (22/24), engine enforcement checks, baseline command observability.  
**Addresses:** Feature table stakes for install reliability + green quality gates.  
**Avoids:** Pitfall 1 (engine mismatch), Pitfall 6 (no safety net bootstrap).

### Phase 2: Dependency Alignment (No Behavior Edits)
**Rationale:** Dependency graph must stabilize before syntax or architecture changes.  
**Delivers:** Single tsParticles `4.0.0-beta` line across wrapper/demo, aligned Inferno/peer declarations, workspace policy to prevent mixed majors.  
**Implements:** Architecture Pattern 2 (Version Alignment Gate Before Refactor).  
**Avoids:** Pitfall 2 (mixed major lines), moderate monorepo skew pitfall.

### Phase 3: Tooling & Build Modernization (Conservative)
**Rationale:** Remove deprecated blockers while minimizing blast radius.  
**Delivers:** `node-sass`→`sass`, Babel deprecation cleanup, webpack config migration sanity, retained bundler architecture for milestone safety.  
**Uses:** Stack recommendations for modern lint/test/tooling with current Node floor.  
**Avoids:** Pitfall 3 (deprecated tooling), Pitfall 4 (config drift), anti-pattern of bundler replacement during stabilization.

### Phase 4: Wrapper Internal Modernization with Contract Freeze
**Rationale:** Internal cleanup is safest after graph/tooling are stable.  
**Delivers:** Type/lifecycle/asynchronous safety improvements in `Particles.tsx` without public API breaks; metadata/entry boundary verification (`index.js`, `index.d.ts`, exports compatibility).  
**Addresses:** Must-have runtime parity + metadata correctness features.  
**Avoids:** Pitfall 5 (API drift), minor pitfall of output over-modernization.

### Phase 5: Validation, Release Hardening & Documentation
**Rationale:** Stabilization must end with consumer-proof confidence and clear adoption guidance.  
**Delivers:** Smoke fixture, lifecycle regression checks, release notes/migration guide, semver/deprecation discipline, optional release automation guardrails.  
**Addresses:** P1 migration clarity + P2 confidence differentiators.  
**Avoids:** Pitfall 6 (“green build, broken runtime”).

### Phase Ordering Rationale

- Dependencies and CI/runtime compatibility are foundational dependencies for every later phase.
- Architecture explicitly supports package-contract-first sequencing; demo verification follows package stability.
- This order isolates high-risk change classes and makes failures attributable, reducing rework.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (Tooling & Build Modernization):** Webpack config migration details and any Babel/TS transform path decisions can be implementation-sensitive.
- **Phase 5 (Release Hardening):** Best approach for compatibility matrix breadth and release automation guardrails needs policy-level decisions.

Phases with standard patterns (can likely skip extra research-phase):
- **Phase 1:** Node/pnpm/CI baseline enforcement is well-documented and source-backed.
- **Phase 2:** Workspace dependency alignment to single tsParticles line is explicit and straightforward.
- **Phase 4:** Contract-preserving internal refactor pattern is well-established for brownfield wrappers.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Strongly backed by official docs/npm metadata; version/engine constraints are concrete and recent. |
| Features | MEDIUM-HIGH | Product-scope prioritization is clear and consistent, but some differentiator choices are strategic rather than strictly technical. |
| Architecture | HIGH | Directly grounded in current repo structure plus established modernization patterns. |
| Pitfalls | HIGH | Specific, source-verified risks tied to current repo baseline and authoritative ecosystem constraints. |

**Overall confidence:** HIGH

### Gaps to Address

- **Test framework baseline specifics in this package area:** decide exact test harness stack and minimum lifecycle regression suite scope in planning.
- **Packaging evolution policy (`exports` hardening timeline):** requires explicit major-version strategy and migration communication plan.
- **Bundler future-state decision (webpack vs Vite/tsdown path):** defer for this milestone, but capture criteria/triggers for next milestone selection.
- **Supported compatibility matrix breadth:** finalize exact Inferno/tsParticles combinations to support beyond initial beta target.

## Sources

### Primary (HIGH confidence)
- `.planning/research/STACK.md` — runtime/toolchain versions, compatibility constraints, dependency strategy
- `.planning/research/FEATURES.md` — table stakes, differentiators, anti-features, MVP split
- `.planning/research/ARCHITECTURE.md` — component boundaries, modernization patterns, phase-safe sequencing
- `.planning/research/PITFALLS.md` — critical phase risks and mitigations
- `.planning/PROJECT.md` — project scope, constraints, and modernization intent
- Official documentation referenced in research files: npm package.json/metadata guidance, Node package entry points, TypeScript declaration publishing, SemVer, pnpm/Nx/Lerna docs, Sass EOL notice, webpack docs/migration guidance

### Secondary (MEDIUM confidence)
- Inferno plugin ecosystem references (`ts-plugin-inferno`, `babel-plugin-inferno`) for transform-path guidance
- Ecosystem modernization norms for wrapper-package release hygiene and matrix testing practices

### Tertiary (LOW confidence)
- None material; no major conclusions rely on single low-confidence sources.

---
*Research completed: 2026-04-10*
*Ready for roadmap: yes*
