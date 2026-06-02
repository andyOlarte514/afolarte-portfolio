---
phase: 01-layout-foundation
plan: "05"
subsystem: navbar-organism
tags: [organisms, navbar, scroll-detection, active-section, semantic-html, layout, unit-tests]
dependency_graph:
  requires:
    - 01-03 (ThemeToggle atom, NavLink atom)
    - 01-04 (MobileNav molecule)
    - 01-02 (useActiveSection hook)
  provides:
    - Navbar organism at src/components/organisms/Navbar.tsx
    - 100% unit test coverage for Navbar
    - Semantic HTML page structure: header + main + footer
    - Four semantic section stubs with scroll-mt-20 offsets
  affects:
    - src/app/layout.tsx (Navbar wired in, children wrapped in main, footer added)
    - src/app/page.tsx (scaffold replaced with semantic section stubs)
tech_stack:
  added: []
  patterns:
    - "Navbar: inline scroll state via useState + useEffect with window scroll listener (80px threshold)"
    - "SECTIONS derived from NAV_LINKS as unknown as readonly string[] to satisfy useActiveSection type"
    - "Scroll tests: wrap window.dispatchEvent in act() to flush React state updates in jsdom"
    - "Navbar test: jest.mock useActiveSection + useTheme; Sheet mock reused from MobileNav pattern"
    - "layout.tsx: Server Component can import 'use client' Navbar — Next.js handles boundary automatically"
key_files:
  created:
    - path: src/components/organisms/Navbar.tsx
      role: Sticky fixed navbar composing NavLink atoms, ThemeToggle atom, MobileNav molecule
    - path: src/components/organisms/Navbar.test.tsx
      role: 9 unit tests covering all navbar behavior branches at 100% coverage
  modified:
    - path: src/app/page.tsx
      role: Next.js scaffold replaced with four semantic section stubs (hero/experience/skills/contact)
    - path: src/app/layout.tsx
      role: Navbar imported and rendered above main; children wrapped in main; footer stub added
decisions:
  - "Inlined scroll state in Navbar component (useState+useEffect) rather than extracting a separate useNavScroll hook — the plan explicitly specified this approach to avoid over-engineering a single-use pattern"
  - "Used act() wrapper for scroll event dispatch in tests — window.dispatchEvent triggers React state updates that require act() to flush in jsdom; without it, the isScrolled state change does not propagate before assertion"
  - "Added import type React from 'react' in page.tsx to satisfy TypeScript explicit return type requirement for React.ReactNode without using implicit JSX types"
metrics:
  duration_seconds: 320
  completed_date: "2026-06-02"
  tasks_completed: 2
  tasks_total: 2
  files_created: 2
  files_modified: 2
---

# Phase 01 Plan 05: Navbar Organism + Layout Wiring Summary

**One-liner:** Navbar organism with sticky fixed header, transparent-to-solid scroll transition at 80px, "Andy Olarte" wordmark, desktop NavLinks with active section highlighting, ThemeToggle and MobileNav controls — 9 unit tests at 100% coverage; layout.tsx wired with Navbar + main + footer; page.tsx has four semantic section stubs.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Implement Navbar organism with unit tests | 0725c02 | src/components/organisms/Navbar.tsx, src/components/organisms/Navbar.test.tsx |
| 2 | Wire Navbar into layout.tsx and add semantic section stubs to page.tsx | e847b50 | src/app/page.tsx, src/app/layout.tsx |

## Verification Results

All plan success criteria met:

1. `yarn build` — PASS (Next.js 16, TypeScript, static pages generated without errors)
2. `yarn type-check` — PASS (zero TypeScript errors)
3. Navbar test suite — 9 tests pass, 100% coverage on Navbar.tsx (statements/branches/functions/lines)
4. Section IDs in page.tsx — 4 matches (hero, experience, skills, contact)
5. scroll-mt-20 in page.tsx — 4 matches
6. Navbar import in layout.tsx — 1 match
7. main element in layout.tsx — 1 match
8. footer element in layout.tsx — 1 match
9. header element in Navbar.tsx — 1 match (semantic `<header>`, not `<div>`)

## Semantic HTML Contract

The page structure matches the UI-SPEC contract exactly:

```
html > body > [header (Navbar, fixed)] + [main > sections (hero/experience/skills/contact)] + [footer]
```

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added act() wrapper for scroll event tests**
- **Found during:** Task 1 — initial test run
- **Issue:** Tests "becomes solid after scrolling past 80px" and "returns to transparent when scrolled back to top" failed because `window.dispatchEvent(new Event("scroll"))` triggers React state updates that are not flushed before assertions without `act()`
- **Fix:** Wrapped `Object.defineProperty` + `window.dispatchEvent` in `act(() => { ... })` for both scroll tests
- **Files modified:** src/components/organisms/Navbar.test.tsx
- **Commit:** 0725c02 (included in same task commit)

## Known Stubs

The following section stubs exist by design — they are temporary scaffolding for the Phase 1 shell:

| Stub | File | Reason |
|------|------|--------|
| `<section id="hero">` with only `<h2 className="sr-only">Hero</h2>` | src/app/page.tsx | Phase 2 delivers hero content (name, title, bio) |
| `<section id="experience">` with only `<h2>Experience</h2>` | src/app/page.tsx | Phase 3 delivers experience timeline |
| `<section id="skills">` with only `<h2>Skills</h2>` | src/app/page.tsx | Phase 4 delivers skills grid |
| `<section id="contact">` with only `<h2>Contact</h2>` | src/app/page.tsx | Phase 4 delivers contact section |

These stubs are intentional — they fulfill the Semantic HTML Contract from UI-SPEC (correct IDs, scroll-mt-20 offsets) while Phase 1's goal is the navigation shell, not content. Future phases replace these headings with real content.

## Pre-existing Issue: sheet.tsx Coverage

`src/components/ui/sheet.tsx` (shadcn/ui generated component) reports 0% coverage in the full test suite. This is a pre-existing condition introduced when shadcn/ui was installed in Plan 01. All test suites (MobileNav, Navbar) correctly mock the Sheet component to avoid jsdom portal issues. The shadcn/ui sheet.tsx is an external library component, not portfolio code requiring unit testing. This issue predates Plan 05.

## Threat Flags

No new threat surface beyond the plan's threat model.
- T-05-01 (client bundle): Navbar + all dependencies are static UI code with no secrets.
- T-05-02 (scrollY): Only drives a CSS class change — no security implications.
- T-05-03 (scroll cleanup): Verified — removeEventListener called on unmount, covered by test case.
- T-05-04 (footer year): `new Date().getFullYear()` is server-rendered at build time, no user input.

## Self-Check: PASSED

Files verified present:
- `src/components/organisms/Navbar.tsx` — FOUND
- `src/components/organisms/Navbar.test.tsx` — FOUND
- `src/app/page.tsx` (modified) — FOUND
- `src/app/layout.tsx` (modified) — FOUND

Commits verified:
- 0725c02 feat(01-05): implement Navbar organism with unit tests — FOUND
- e847b50 feat(01-05): wire Navbar into layout.tsx and add semantic section stubs to page.tsx — FOUND
