# Testing Patterns

**Analysis Date:** 2026-04-10

## Test Framework

**Runner:**
- Not detected (no Jest/Vitest/Mocha/AVA/Cypress/Playwright config files found in repository root, `components/inferno/`, or `apps/inferno/`).
- Config: Not applicable.

**Assertion Library:**
- Not detected.

**Run Commands:**
```bash
Not applicable (no test script in `package.json`, `components/inferno/package.json`, or `apps/inferno/package.json`)
pnpm --filter @tsparticles/inferno run check    # TypeScript static check only
pnpm --filter @tsparticles/inferno-demo run check # TypeScript static check only
```

## Test File Organization

**Location:**
- Not detected. No `*.test.*` or `*.spec.*` files found under `components/inferno/` or `apps/inferno/`.

**Naming:**
- Not applicable.

**Structure:**
```
No automated test directory structure detected.
```

## Test Structure

**Suite Organization:**
```typescript
Not applicable: no `describe`/`it`/`test` suites are present in source tree.
```

**Patterns:**
- Setup pattern: Not detected.
- Teardown pattern: Not detected.
- Assertion pattern: Not detected.

## Mocking

**Framework:** Not detected

**Patterns:**
```typescript
Not applicable: no mocking framework usage (`jest.fn`, `vi.fn`, sinon, etc.) detected in `components/inferno/src/*` or `apps/inferno/src/*`.
```

**What to Mock:**
- No established project-level mock guidelines detected.

**What NOT to Mock:**
- No established project-level non-mock guidelines detected.

## Fixtures and Factories

**Test Data:**
```typescript
Not applicable: no fixture/factory files detected.
```

**Location:**
- Not detected.

## Coverage

**Requirements:** None enforced (no coverage tooling or thresholds configured).

**View Coverage:**
```bash
Not applicable.
```

## Test Types

**Unit Tests:**
- Not used in current codebase state.

**Integration Tests:**
- Not used in current codebase state.

**E2E Tests:**
- Not used.

## Common Patterns

**Async Testing:**
```typescript
Not applicable: no async test files detected.
```

**Error Testing:**
```typescript
Not applicable: no error assertion tests detected.
```

---

*Testing analysis: 2026-04-10*
