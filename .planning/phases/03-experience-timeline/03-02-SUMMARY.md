---
phase: 03-experience-timeline
plan: "02"
subsystem: atoms
tags: [atoms, company-avatar, entry-badge, tdd, coverage]
dependency_graph:
  requires:
    - 03-01
  provides:
    - CompanyAvatar atom (colored initial avatar with data-testid for E2E)
    - EntryBadge atom (outline indigo pill badge)
  affects:
    - src/components/molecules/TimelineEntry.tsx (consumes both atoms — Phase 03-03)
    - e2e tests (CompanyAvatar data-testid used in Plan 05 Test 6)
tech_stack:
  added: []
  patterns:
    - TDD RED/GREEN with failing tests committed first
    - Inline style for dynamic color (not runtime Tailwind class)
    - data-testid on root element for E2E selector targeting
key_files:
  created:
    - src/components/atoms/CompanyAvatar.tsx
    - src/components/atoms/CompanyAvatar.test.tsx
    - src/components/atoms/EntryBadge.tsx
    - src/components/atoms/EntryBadge.test.tsx
  modified: []
decisions:
  - "backgroundColor applied via inline style to avoid Tailwind v4 JIT not detecting runtime class strings"
  - "data-testid='company-avatar' hardcoded on root div — required for Playwright selector in Plan 05 Test 6"
  - "EntryBadge uses border-primary/text-primary instead of RoleBadge's border-border/bg-muted — outline indigo variant per UI-SPEC"
metrics:
  duration: "1m 37s"
  completed: "2026-06-04"
  tasks_completed: 2
  tasks_total: 2
  files_created: 4
  files_modified: 0
---

# Phase 03 Plan 02: Atom Components (CompanyAvatar + EntryBadge) Summary

**One-liner:** CompanyAvatar renders colored initials with inline backgroundColor and data-testid for E2E targeting; EntryBadge renders an outline indigo pill badge — both with 100% branch coverage via TDD.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | CompanyAvatar atom + tests | d46f546 | CompanyAvatar.tsx, CompanyAvatar.test.tsx |
| 2 | EntryBadge atom + tests | f98bb7c | EntryBadge.tsx, EntryBadge.test.tsx |

## What Was Built

### CompanyAvatar (`src/components/atoms/CompanyAvatar.tsx`)

A purely props-driven Server Component atom that renders a 40×40px (md) or 32×32px (sm) rounded-lg colored square displaying 2-letter company initials in white bold text.

Key implementation details:
- Props: `initials: string`, `color: string`, `size?: "sm" | "md" | undefined` (defaults to "md")
- Dynamic background applied via `style={{ backgroundColor: color }}` — NOT a runtime Tailwind class string (Tailwind v4 JIT cannot detect `bg-[${color}]` patterns at build time)
- Root div carries `aria-hidden="true"` — the company name in the visible header line provides the accessible label
- Root div carries `data-testid="company-avatar"` — required for Playwright E2E selector `[data-testid=company-avatar]` in Plan 05 Test 6
- 7 tests: initials rendering, inline style verification, aria-hidden, md size classes (w-10 h-10), sm size classes (w-8 h-8 — covers size branch), rounded-lg shape, data-testid attribute

### EntryBadge (`src/components/atoms/EntryBadge.tsx`)

A purely props-driven Server Component atom that renders an inline outline indigo pill badge for role-level labels (e.g., "Tech Lead", "Concurrent Role", "Full-stack").

Key implementation details:
- Props: `label: string`
- Root element: `<span>` (inline element — renders inline within role title lines)
- Classes: `inline-flex items-center rounded-full border border-primary px-2.5 py-0.5 text-xs font-medium text-primary`
- Outline variant using `border-primary text-primary` (indigo-500 ring per UI-SPEC D-07/D-08) — NO background fill, NO decorative dot span
- Smaller than RoleBadge (px-2.5/py-0.5/text-xs vs px-3/py-1/text-sm)
- 4 tests: label rendering, different label rendering, span element assertion, rounded-full class

## Test Results

```
Test Suites: 2 passed, 2 total
Tests:       11 passed, 11 total
```

| File | Statements | Branches | Functions | Lines |
|------|-----------|----------|-----------|-------|
| CompanyAvatar.tsx | 100% | 100% | 100% | 100% |
| EntryBadge.tsx | 100% | 100% | 100% | 100% |

## Deviations from Plan

None — plan executed exactly as written. Both atoms implemented following the TDD RED/GREEN cycle as specified. All acceptance criteria met on first implementation pass.

## Known Stubs

None — both atoms are purely props-driven with no data dependencies. Props are supplied by parent molecules/organisms (TimelineEntry in Plan 03-03).

## Threat Flags

No new threat surface introduced. Both atoms are purely presentational Server Components with no data fetching, no user input, and no external calls — consistent with the plan's threat model.

## Self-Check: PASSED

Files created:
- FOUND: src/components/atoms/CompanyAvatar.tsx
- FOUND: src/components/atoms/CompanyAvatar.test.tsx
- FOUND: src/components/atoms/EntryBadge.tsx
- FOUND: src/components/atoms/EntryBadge.test.tsx

Commits verified:
- FOUND: d46f546 (CompanyAvatar)
- FOUND: f98bb7c (EntryBadge)
