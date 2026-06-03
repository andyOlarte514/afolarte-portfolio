---
phase: 02-hero-section
plan: "02"
subsystem: atoms
tags: [react, atoms, tdd, coverage, rsc, next-image, tailwind]
dependency_graph:
  requires:
    - src/types/hero.ts (RoleBadgeData, HeroContent interfaces — 02-01)
    - src/lib/heroContent.ts (heroContent data — 02-01)
  provides:
    - src/components/atoms/RoleBadge.tsx (pill badge atom for HeroSection)
    - src/components/atoms/RoleBadge.test.tsx (100% coverage for RoleBadge)
    - src/components/atoms/HeroPhoto.tsx (photo-or-initials placeholder atom)
    - src/components/atoms/HeroPhoto.test.tsx (100% coverage for HeroPhoto)
  affects:
    - src/components/organisms/HeroSection.tsx (02-03 — consumes both atoms)
tech_stack:
  added: []
  patterns:
    - TDD RED/GREEN cycle (test file committed before implementation)
    - import type React from "react" (RSC pattern — no use client)
    - next/image with fill prop inside relative parent div (no deprecated layout prop)
    - exactOptionalPropertyTypes-compliant optional src field (src?: string | undefined)
    - aria-hidden dot indicator for decorative element
key_files:
  created:
    - src/components/atoms/RoleBadge.tsx
    - src/components/atoms/RoleBadge.test.tsx
    - src/components/atoms/HeroPhoto.tsx
    - src/components/atoms/HeroPhoto.test.tsx
  modified: []
decisions:
  - RoleBadge placed in atoms/ (not molecules/) per CONTEXT.md and PATTERNS.md note
  - bg-primary used for indigo dot (CSS variable token, not raw hex bg-indigo-500)
  - HeroPhoto uses if (!src) branch pattern — both branches covered for 100% coverage
  - No jest.mock("next/image") needed — nextJest auto-mocks it per jest.config.mjs
  - aria-hidden="true" on decorative dot span (WCAG 2.1 AA compliance)
metrics:
  duration: "3m 45s"
  completed: "2026-06-03T23:04:36Z"
  tasks_completed: 2
  tasks_total: 2
  files_created: 4
  files_modified: 0
---

# Phase 02 Plan 02: RoleBadge and HeroPhoto Atoms Summary

**One-liner:** RSC-compatible RoleBadge (pill with aria-hidden indigo dot) and HeroPhoto (AO-initials placeholder or next/image fill) atoms, both TDD at 100% branch/function/line/statement coverage.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 (RED) | RoleBadge test | 6c8e6e2 | src/components/atoms/RoleBadge.test.tsx |
| 1 (GREEN) | RoleBadge implementation | 47c5649 | src/components/atoms/RoleBadge.tsx |
| 2 (RED) | HeroPhoto test | c34e998 | src/components/atoms/HeroPhoto.test.tsx |
| 2 (GREEN) | HeroPhoto implementation | 7cbea90 | src/components/atoms/HeroPhoto.tsx |

## What Was Built

**src/components/atoms/RoleBadge.tsx** — Pill badge atom:
- No "use client" directive — RSC-compatible
- `import type React from "react"` (RSC pattern)
- `RoleBadgeProps` interface: `company: string`, `role: string`
- Returns `<span>` with `inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-sm font-normal text-card-foreground`
- Decorative indigo dot: `<span className="h-2 w-2 flex-shrink-0 rounded-full bg-primary" aria-hidden="true" />`
- Text content: company, separator `·`, role

**src/components/atoms/RoleBadge.test.tsx** — 4 tests at 100% coverage:
- Renders company name in DOM
- Renders role title in DOM
- Renders aria-hidden indigo dot element
- Renders different content with different props

**src/components/atoms/HeroPhoto.tsx** — Photo/placeholder atom:
- No "use client" directive — RSC-compatible
- `import type React from "react"` (RSC pattern)
- `import Image from "next/image"` (not next/legacy/image)
- `HeroPhotoProps` interface: `src?: string | undefined`, `alt: string`, `initials: string`
- Branch 1 (no src): renders `<div className="relative aspect-square ...rounded-2xl bg-primary ...">` with initials span
- Branch 2 (src provided): renders `<div className="relative aspect-square ...rounded-2xl ...overflow-hidden">` with `<Image fill />` (no deprecated layout prop)
- `relative` parent div satisfies next/image fill requirement

**src/components/atoms/HeroPhoto.test.tsx** — 3 tests at 100% coverage:
- Renders "AO" initials when no src prop
- Renders img element with alt text when src provided
- Placeholder container has rounded-2xl class

## Verification Results

- All 7 tests pass (4 RoleBadge + 3 HeroPhoto)
- RoleBadge.tsx: 100% branches, functions, lines, statements
- HeroPhoto.tsx: 100% branches, functions, lines, statements (both if/else branches covered)
- `yarn type-check`: 0 errors
- Neither atom has "use client" directive
- Both use `import type React from "react"` (RSC pattern)
- `yarn test --testPathPatterns="RoleBadge|HeroPhoto"`: 7 passed, 0 failed

## TDD Gate Compliance

Both tasks followed the RED/GREEN cycle:
1. `test(02-02)` commits (RED gate): 6c8e6e2 (RoleBadge), c34e998 (HeroPhoto)
2. `feat(02-02)` commits (GREEN gate): 47c5649 (RoleBadge), 7cbea90 (HeroPhoto)
3. No REFACTOR phase needed — implementation was clean on first pass

## Deviations from Plan

**Pre-existing coverage issue (out of scope):** The global `yarn test:coverage` threshold (100%) was already failing before this plan at base commit bd9a1ec. The failure is caused by:
- `src/lib/heroContent.ts` and `src/types/hero.ts` (introduced in 02-01) having no unit tests (0% coverage)
- `src/components/ui/sheet.tsx` (shadcn/ui, pre-existing) having 0% coverage

This plan's atoms (RoleBadge and HeroPhoto) each individually achieve 100% coverage as verified with `--collectCoverageFrom`. The global threshold failure pre-dates this plan and is not caused by changes in 02-02.

[Rule 1 - Scope Boundary] Pre-existing global coverage gap logged to deferred items — not fixed here, tracked for 02-03+ or post-phase cleanup.

**RoleBadge uses bg-primary instead of bg-indigo-500:** The plan's `<action>` section specifies `bg-primary` (CSS variable token). PATTERNS.md uses `bg-indigo-500`. Used `bg-primary` as specified in the plan's `<action>` for consistency with the design token system.

## Known Stubs

None — both atoms render their props directly. No hardcoded placeholders, no TODO comments, no empty data sources.

## Threat Flags

None — both atoms receive only static strings from heroContent.ts at build time. No user input, no network endpoints, no auth paths, no file access.

## Self-Check: PASSED

- [x] src/components/atoms/RoleBadge.tsx exists in worktree
- [x] src/components/atoms/RoleBadge.test.tsx exists in worktree
- [x] src/components/atoms/HeroPhoto.tsx exists in worktree
- [x] src/components/atoms/HeroPhoto.test.tsx exists in worktree
- [x] Commit 6c8e6e2 (RoleBadge test RED) confirmed in git log
- [x] Commit 47c5649 (RoleBadge GREEN) confirmed in git log
- [x] Commit c34e998 (HeroPhoto test RED) confirmed in git log
- [x] Commit 7cbea90 (HeroPhoto GREEN) confirmed in git log
- [x] RoleBadge.tsx: 100% coverage (branches, functions, lines, statements)
- [x] HeroPhoto.tsx: 100% coverage (branches, functions, lines, statements)
- [x] yarn type-check: 0 errors
- [x] Neither atom has "use client" directive
