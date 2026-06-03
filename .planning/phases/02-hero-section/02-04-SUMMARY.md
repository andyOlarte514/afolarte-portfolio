---
phase: 02-hero-section
plan: "04"
subsystem: hero-section-organism
tags: [react, organisms, rsc, tdd, coverage, tailwind, atomic-design]
dependency_graph:
  requires:
    - src/types/hero.ts (RoleBadgeData, HeroContent interfaces — 02-01)
    - src/lib/heroContent.ts (heroContent data — 02-01)
    - src/components/atoms/RoleBadge.tsx (pill badge atom — 02-02)
    - src/components/atoms/HeroPhoto.tsx (photo/placeholder atom — 02-02)
    - src/components/atoms/CTAButton.tsx (scroll CTA atom — 02-03)
  provides:
    - src/components/organisms/HeroSection.tsx (Hero section RSC organism)
    - src/components/organisms/HeroSection.test.tsx (100% coverage with mocked atoms)
  affects:
    - src/app/page.tsx (consumes HeroSection — Phase 2 wiring step)
tech_stack:
  added: []
  patterns:
    - React Server Component (import type React from "react" — no use client)
    - jest.mock atom dependencies with typed mock functions for 100% isolation
    - getAllByText for text that appears in multiple elements (bio + badge)
    - Exact title regex /Senior Frontend \/ Full-Stack Engineer/ to avoid partial matches
    - heroContent direct named import (not type import) — used at render time
key_files:
  created:
    - src/components/organisms/HeroSection.tsx
    - src/components/organisms/HeroSection.test.tsx
  modified: []
decisions:
  - getAllByText used instead of getByText for NVIDIA/Mekan tests — both strings appear in bio paragraph AND mocked RoleBadge output, making getByText throw "multiple elements found"
  - Full title string /Senior Frontend \/ Full-Stack Engineer/ used to distinguish p tag from Mekan badge text "Mekan Senior Frontend"
  - HeroSection renders no wrapping section tag — plan specifies page.tsx owns the section id="hero" wrapper (per UI-SPEC §6.1)
  - heroContent.photo.src passed directly to HeroPhoto (undefined when omitted) — type-safe because HeroPhotoProps allows src undefined
metrics:
  duration: "2m 43s"
  completed: "2026-06-03T23:10:58Z"
  tasks_completed: 1
  tasks_total: 1
  files_created: 2
  files_modified: 0
---

# Phase 02 Plan 04: HeroSection Organism Summary

**One-liner:** RSC HeroSection organism composing all Phase 2 atoms (RoleBadge, HeroPhoto, CTAButton) from heroContent with two-column responsive grid, 6 TDD tests at 100% coverage.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 (RED) | HeroSection failing tests | cdfc949 | src/components/organisms/HeroSection.test.tsx |
| 1 (GREEN) | HeroSection implementation | da0bf7e | src/components/organisms/HeroSection.tsx + HeroSection.test.tsx (query fix) |

## What Was Built

**src/components/organisms/HeroSection.tsx** — RSC hero organism:
- No "use client" directive — React Server Component
- `import type React from "react"` (RSC pattern)
- Imports `{ heroContent }` from `"@/lib/heroContent"` (named import, used at render)
- Imports `CTAButton`, `HeroPhoto`, `RoleBadge` from their atom paths
- No props — reads heroContent directly
- `export default function HeroSection(): React.ReactNode`

Layout structure (per UI-SPEC §5 and §6.1):
- Outer: `<div className="flex items-center pt-24 pb-20">`
- Inner container: `<div className="mx-auto w-full max-w-5xl px-4 md:px-8">`
- Grid: `<div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-5 lg:gap-16">`
- Text column: `<div className="order-1 flex flex-col lg:col-span-3">` with h1, title p, badges div, bio p, CTA div
- Photo column: `<div className="order-2 flex justify-center lg:col-span-2">` with HeroPhoto

**src/components/organisms/HeroSection.test.tsx** — 6 tests at 100% coverage:
- Test 1: h1 heading contains "Andy" (getByRole heading level 1)
- Test 2: title text matches full string `/Senior Frontend \/ Full-Stack Engineer/` (avoids ambiguity with Mekan badge)
- Test 3: NVIDIA company text present via `getAllByText(/NVIDIA/)` (appears in bio + badge mock)
- Test 4: Mekan company text present via `getAllByText(/Mekan/)` (appears in bio + badge mock)
- Test 5: bio paragraph contains `10+` via `getByText(/10\+/)`
- Test 6: CTA button rendered via `getByTestId("cta-button")` (CTAButton mock)

Atom mocks:
- `MockCTAButton({ label })` → `<button data-testid="cta-button">{label}</button>`
- `MockHeroPhoto({ initials })` → `<div data-testid="hero-photo">{initials}</div>`
- `MockRoleBadge({ company, role })` → `<span>{company} {role}</span>`

## Verification Results

- `yarn test --testPathPatterns="HeroSection" --no-coverage`: 6/6 tests pass
- `yarn test --testPathPatterns="HeroSection|HeroPhoto|RoleBadge|CTAButton" --no-coverage`: 30/30 tests pass
- HeroSection.tsx: 100% statements, branches, functions, lines (verified with --collectCoverageFrom)
- `yarn type-check`: 0 TypeScript errors
- `grep '"use client"' HeroSection.tsx`: NOT found (RSC confirmed)
- `grep "import type React" HeroSection.tsx`: 1 occurrence
- `grep "heroContent" HeroSection.tsx`: 9 occurrences (import + usage at every field)
- `grep "grid-cols-1" HeroSection.tsx`: 1 occurrence
- `grep "lg:grid-cols-5" HeroSection.tsx`: 1 occurrence
- `grep "order-1" HeroSection.tsx`: 1 occurrence
- `grep "order-2" HeroSection.tsx`: 1 occurrence
- `grep "<h1" HeroSection.tsx`: 1 occurrence

## TDD Gate Compliance

| Gate | Commit | Status |
|------|--------|--------|
| RED | cdfc949 | test(02-04): add failing tests for HeroSection organism |
| GREEN | da0bf7e | feat(02-04): implement HeroSection organism RSC with atom composition |
| REFACTOR | N/A | Not needed — implementation clean on first pass |

## Deviations from Plan

**[Rule 1 - Bug] Test query ambiguity for NVIDIA/Mekan and Senior Frontend**

- **Found during:** Task 1 GREEN phase (tests were failing with "multiple elements found")
- **Issue:** The plan specified `getByText(/NVIDIA/)`, `getByText(/Mekan/)`, and `getByText(/Senior Frontend/)`. Both "NVIDIA" and "Mekan" appear in the bio paragraph AND in the mocked RoleBadge output (`<span>{company} {role}</span>`). "Senior Frontend" appears in both the title `<p>` AND the Mekan badge text "Mekan Senior Frontend".
- **Fix:** Changed NVIDIA/Mekan tests to use `getAllByText` (multiple matches are correct and expected). Changed Senior Frontend test to match the full exact title string `/Senior Frontend \/ Full-Stack Engineer/` which is unique in the DOM.
- **Files modified:** `HeroSection.test.tsx` (query adjustments only — behavior contract unchanged)
- **Commit:** da0bf7e (included in GREEN commit)

## Known Stubs

None — HeroSection renders all heroContent fields directly to atoms. No placeholder values, no TODO comments, no empty data sources. The photo.src is intentionally absent from heroContent (showing initials placeholder), which is the correct state per UI-SPEC.

## Threat Flags

None — HeroSection is a pure RSC with no user input, no network endpoints, no auth paths. Only compile-time string constants flow from RSC to the "use client" CTAButton atom (label and targetId), satisfying T-02-05 in the plan's threat register.

## Self-Check: PASSED

- [x] src/components/organisms/HeroSection.tsx exists in worktree
- [x] src/components/organisms/HeroSection.test.tsx exists in worktree
- [x] RED commit cdfc949 confirmed in git log
- [x] GREEN commit da0bf7e confirmed in git log
- [x] 6 tests pass, 30 total across all Phase 2 atom + organism tests
- [x] 100% coverage on HeroSection.tsx (statements, branches, functions, lines)
- [x] yarn type-check passes with zero errors
- [x] "use client" NOT present in HeroSection.tsx
- [x] import type React present in HeroSection.tsx
- [x] heroContent imported and used (9 occurrences)
- [x] grid-cols-1, lg:grid-cols-5, order-1, order-2 all present
- [x] Single h1 element present
