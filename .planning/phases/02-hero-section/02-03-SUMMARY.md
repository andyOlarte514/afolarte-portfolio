---
phase: 02-hero-section
plan: "03"
subsystem: cta-button-atom
tags: [typescript, react, atoms, use-client, shadcn, accessibility, tdd]
dependency_graph:
  requires:
    - src/types/hero.ts (02-01)
    - src/lib/heroContent.ts (02-01)
    - src/components/ui/button.tsx (Phase 1 scaffold)
  provides:
    - src/components/atoms/CTAButton.tsx (client boundary CTA atom with scroll-to-contact)
    - src/components/atoms/CTAButton.test.tsx (100% coverage)
  affects:
    - src/components/organisms/HeroSection.tsx (02-04 — consumes CTAButton)
tech_stack:
  added: []
  patterns:
    - '"use client" atom pattern — isolates client boundary to smallest possible surface'
    - 'querySelector + optional chaining for null-safe DOM scrollIntoView'
    - 'userEvent + jest.spyOn(document, querySelector) mock pattern for browser API testing'
    - 'shadcn Button wrapping with variant/size props'
    - 'min-h-11 (44px) WCAG 2.1 AA touch target enforcement'
key_files:
  created:
    - src/components/atoms/CTAButton.tsx
    - src/components/atoms/CTAButton.test.tsx
  modified: []
decisions:
  - '"use client" on CTAButton atom keeps HeroSection as RSC — client boundary isolated to smallest surface'
  - 'No React import needed — "use client" components get React globally in Next.js 16 App Router'
  - 'handleClick has no event parameter (Button onClick is () => void, not MouseEvent handler)'
  - 'Optional chaining on target?.scrollIntoView prevents throw when querySelector returns null'
metrics:
  duration: "2m 16s"
  completed: "2026-06-03T23:03:09Z"
  tasks_completed: 1
  tasks_total: 1
  files_created: 2
  files_modified: 0
---

# Phase 02 Plan 03: CTAButton Atom Summary

**One-liner:** "use client" CTAButton atom wrapping shadcn Button with scroll-to-contact onClick, 100% TDD coverage including null querySelector branch.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 (RED) | CTAButton failing tests | c47b50a | src/components/atoms/CTAButton.test.tsx |
| 1 (GREEN) | CTAButton implementation | 25efdab | src/components/atoms/CTAButton.tsx |

## What Was Built

**src/components/atoms/CTAButton.tsx** — Client boundary CTA atom:
- First line: `"use client";` (isolates client boundary; HeroSection remains RSC)
- Imports `{ Button }` from `@/components/ui/button` — no React import (not needed in "use client" context)
- Props interface `CTAButtonProps`: `label: string` and `targetId: string` (both required)
- `handleClick()` calls `document.querySelector('#${targetId}')?.scrollIntoView({ behavior: 'smooth' })`
- Optional chaining (`?.`) prevents throw when `querySelector` returns null
- Returns `<Button variant="default" size="default" onClick={handleClick} className="min-h-11">`
- `min-h-11` (44px) satisfies WCAG 2.1 AA touch target requirement

**src/components/atoms/CTAButton.test.tsx** — 100% coverage tests:
- Test 1: renders button with label prop accessible by `role="button"`
- Test 2: clicking calls `document.querySelector("#contact")` (selector correctness)
- Test 3: clicking calls `scrollIntoView({ behavior: "smooth" })` on found element
- Test 4: null querySelector result does not throw (optional chaining safety)
- Test 5: accessible by `role="button"` with label as accessible name (WCAG)

## TDD Gate Compliance

| Gate | Commit | Status |
|------|--------|--------|
| RED | c47b50a | test(02-03): add failing tests for CTAButton atom |
| GREEN | 25efdab | feat(02-03): implement CTAButton atom with use client and scroll-to-contact |
| REFACTOR | N/A | Not needed — implementation clean on first pass |

## Verification Results

- `yarn test --testPathPatterns="CTAButton"`: 5/5 tests pass
- `yarn test --collectCoverageFrom="...CTAButton.tsx"`: 100% statements/branches/functions/lines
- `yarn type-check`: 0 TypeScript errors
- `head -1 src/components/atoms/CTAButton.tsx`: `"use client";`
- `grep "scrollIntoView"`: found (1 occurrence)
- `grep "behavior.*smooth"`: found (1 occurrence)
- `grep "targetId"`: found (3 occurrences — prop, handler, template literal)
- `grep "min-h-11"`: found (1 occurrence)
- `grep 'variant="default"'`: found (1 occurrence)

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — CTAButton is fully implemented. It will receive `targetId="contact"` from HeroSection (02-04).

## Threat Flags

None — targetId is a static compile-time constant, not derived from user input or URL. No injection risk.

## Self-Check: PASSED

- [x] src/components/atoms/CTAButton.tsx exists in worktree
- [x] src/components/atoms/CTAButton.test.tsx exists in worktree
- [x] RED commit c47b50a confirmed in git log
- [x] GREEN commit 25efdab confirmed in git log
- [x] All 5 tests pass
- [x] 100% CTAButton.tsx coverage verified
- [x] yarn type-check passes with zero errors
- [x] "use client" is first line
- [x] scrollIntoView with behavior: smooth present
- [x] min-h-11 WCAG touch target class present
- [x] variant="default" present
