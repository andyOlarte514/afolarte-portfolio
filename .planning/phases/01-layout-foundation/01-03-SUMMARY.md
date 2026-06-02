---
phase: 01-layout-foundation
plan: "03"
subsystem: atoms-ui-primitives
tags: [atoms, theme-toggle, nav-link, dark-mode, smooth-scroll, accessibility, unit-tests]
dependency_graph:
  requires:
    - 01-01 (shadcn/ui initialized, Button component, color tokens)
    - 01-02 (useTheme hook at src/hooks/useTheme.ts)
  provides:
    - ThemeToggle atom at src/components/atoms/ThemeToggle.tsx
    - NavLink atom at src/components/atoms/NavLink.tsx
    - 100% unit test coverage for both atoms
  affects:
    - 01-04 (Navbar organism consumes ThemeToggle and NavLink)
    - 01-05 (MobileNav molecule consumes NavLink)
tech_stack:
  added: []
  patterns:
    - "ThemeToggle: shadcn Button (ghost/icon) wrapping Lucide Sun/Moon icon swap based on useTheme state"
    - "NavLink: plain anchor with handleClick calling document.querySelector + scrollIntoView; active/inactive class variants"
    - "Jest worktree testing: browser API mocks (localStorage, matchMedia) used instead of jest.mock(@/) to avoid path resolution issues"
    - "jest.config.mjs: added moduleNameMapper @/ -> rootDir/src/ for component test module mocking"
key_files:
  created:
    - path: src/components/atoms/ThemeToggle.tsx
      role: Dark mode toggle button atom — ghost icon button, delegates to useTheme, Sun/Moon icon swap
    - path: src/components/atoms/ThemeToggle.test.tsx
      role: 4 unit tests, 100% branch coverage for ThemeToggle
    - path: src/components/atoms/NavLink.tsx
      role: Smooth-scroll nav link atom with active/inactive class variants and focus ring
    - path: src/components/atoms/NavLink.test.tsx
      role: 7 unit tests, 100% branch coverage for NavLink
  modified:
    - path: jest.config.mjs
      role: Added moduleNameMapper for @/ path alias to enable jest.mock with @/ paths in component tests
decisions:
  - "Used browser API mocks (localStorage, matchMedia) in ThemeToggle tests instead of jest.mock('@/hooks/useTheme') — @/ alias not in jest moduleNameMapper so jest.mock resolution fails for @/ paths from outside src/"
  - "Added moduleNameMapper '@/(.*)' => '<rootDir>/src/$1' to jest.config.mjs as Rule 2 fix — required for component tests that need to mock @/ module paths"
  - "NavLink uses document.querySelector(href) with optional chaining target?.scrollIntoView() — null check via ?. satisfies noUncheckedIndexedAccess pattern"
  - "exactOptionalPropertyTypes enforced: NavLink optional props typed as T | undefined explicitly (isActive?: boolean | undefined, onClick?: (() => void) | undefined)"
metrics:
  duration_seconds: 520
  completed_date: "2026-06-02"
  tasks_completed: 2
  tasks_total: 2
  files_created: 4
  files_modified: 1
---

# Phase 01 Plan 03: Atom Components Summary

**One-liner:** ThemeToggle (ghost/icon Button with Sun/Moon swap via useTheme) and NavLink (smooth-scroll anchor with active indigo-500 indicator and focus ring) atoms implemented with 11 passing unit tests at 100% branch coverage.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Implement ThemeToggle atom with unit tests | ddad9dd | src/components/atoms/ThemeToggle.tsx, src/components/atoms/ThemeToggle.test.tsx, jest.config.mjs |
| 2 | Implement NavLink atom with unit tests | ee3ca39 | src/components/atoms/NavLink.tsx, src/components/atoms/NavLink.test.tsx |

## Verification Results

All plan success criteria met:

1. `yarn test --testPathPatterns="(ThemeToggle|NavLink)"` — 11 tests pass (4 + 7), 2 suites
2. Coverage: 100% branches/functions/lines/statements on both ThemeToggle.tsx and NavLink.tsx
3. `yarn type-check` — PASS (zero TypeScript errors)
4. `grep "aria-label" ThemeToggle.tsx` — returns `aria-label="Toggle dark mode"`
5. `grep "focus-visible:ring-indigo-500" NavLink.tsx` — returns 1 match
6. `grep "scrollIntoView" NavLink.tsx` — returns 1 match
7. Both files have `"use client"` as first line

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical Functionality] jest.mock with @/ paths fails in worktree tests**
- **Found during:** Task 1 (first test run)
- **Issue:** `jest.mock("@/hooks/useTheme")` in a test file located in the git worktree (`.claude/worktrees/.../src/...`) fails because Next.js jest config does not add `@/` to `moduleNameMapper`. The `@/` path alias is only resolved by the SWC transformer at compile time, not by jest's module resolver for `jest.mock()` calls. Component tests that need to mock `@/` imports would all fail without this fix.
- **Fix:** Added `moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" }` to `jest.config.mjs`. This is a legitimate missing configuration for the project — any future component test that uses `jest.mock("@/...")` will require it.
- **Secondary fix:** ThemeToggle tests were restructured to mock browser APIs (localStorage, matchMedia) directly rather than mocking `useTheme` — this tests the component's behavior through the real hook (integration-style unit test), which is more robust.
- **Files modified:** jest.config.mjs
- **Commit:** ddad9dd

## Known Stubs

None — both atoms are fully wired to their dependencies (useTheme hook for ThemeToggle; document.querySelector for NavLink). No placeholder data, no hardcoded empty values.

## Threat Flags

No new threat surface beyond the plan's threat model.
- T-03-01 (NavLink href to querySelector): href values will be static #hash fragments from Navbar — no DOM manipulation risk
- T-03-02 (NavLink onClick callback): callback provided by parent component in same codebase — not from user input
- T-03-03 (ThemeToggle aria-label): "Toggle dark mode" is intentional public label — no sensitive information

## Self-Check: PASSED

Files verified present:
- `src/components/atoms/ThemeToggle.tsx` — FOUND
- `src/components/atoms/ThemeToggle.test.tsx` — FOUND
- `src/components/atoms/NavLink.tsx` — FOUND
- `src/components/atoms/NavLink.test.tsx` — FOUND

Commits verified:
- ddad9dd feat(01-03): implement ThemeToggle atom with unit tests — FOUND
- ee3ca39 feat(01-03): implement NavLink atom with unit tests — FOUND
