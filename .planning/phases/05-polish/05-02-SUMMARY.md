---
phase: 05-polish
plan: "02"
subsystem: accessibility
tags: [accessibility, wcag, keyboard-navigation, focus-management, atoms]
dependency_graph:
  requires: []
  provides:
    - src/components/atoms/ContactIconButton.tsx (single focus stop with visible focus ring)
  affects:
    - src/components/organisms/ContactSection.tsx (uses ContactIconButton)
tech_stack:
  added: []
  patterns:
    - focus-visible ring on outer <a> matching NavLink pattern (Tailwind focus-visible utilities)
    - tabIndex={-1} on inner Button to remove from tab order (Base UI forwarded prop)
    - TDD RED/GREEN cycle for accessibility regression prevention
key_files:
  created: []
  modified:
    - src/components/atoms/ContactIconButton.tsx
    - src/components/atoms/ContactIconButton.test.tsx
decisions:
  - tabIndex={-1} on inner Button (not aria-hidden) — removes from tab order while keeping visible; Base UI Button forwards unknown props to underlying <button>
  - focus-visible:outline-none included alongside ring classes — suppresses browser default only because custom ring replaces it (never suppress without replacement)
  - rounded-full added to <a> className — matches circular Button shape so ring wraps correctly
metrics:
  duration: "1m 32s"
  completed: "2026-06-06T18:42:22Z"
  tasks_completed: 1
  tasks_total: 1
  files_created: 0
  files_modified: 2
---

# Phase 05 Plan 02: ContactIconButton Double Focus Stop Fix Summary

**One-liner:** WCAG 2.4.3 fix — outer `<a>` gets focus-visible ring, inner Button gets `tabIndex={-1}` so keyboard users hit one tab stop per contact icon instead of two.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| RED  | Add failing tabIndex test | a37001b | src/components/atoms/ContactIconButton.test.tsx |
| GREEN | Fix double focus stop | 88c081c | src/components/atoms/ContactIconButton.tsx |

## What Was Built

**ContactIconButton.tsx fix (2 JSX changes):**
- Outer `<a>`: added `className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-full"` — matches NavLink.tsx focus pattern, ring wraps circular shape
- Inner `<Button>`: added `tabIndex={-1}` — removes button from tab order so keyboard navigation has one stop per interactive control

**ContactIconButton.test.tsx addition (1 new test):**
- "inner button has tabIndex -1 to prevent double focus stop" — queries inner `<button>` element via `anchor.querySelector("button")`, asserts `tabindex="-1"` attribute

Total: 7 unit tests (6 existing unchanged + 1 new), 100% coverage maintained.

## Verification Results

- `grep -c "tabIndex={-1}" ...ContactIconButton.tsx` → 1
- `grep -c "focus-visible:ring-2" ...ContactIconButton.tsx` → 1
- `grep -c "focus-visible:outline-none" ...ContactIconButton.tsx` → 1
- `grep -c "tabindex" ...ContactIconButton.test.tsx` → 1
- `yarn test:coverage --testPathPatterns=ContactIconButton`: ContactIconButton.tsx → 100% branches/functions/lines/statements

## Deviations from Plan

None — plan executed exactly as written. TDD RED/GREEN cycle followed as specified.

## Known Stubs

None — this is a pure accessibility fix, no content or data stubs.

## Threat Flags

None — changes are limited to focus management attributes on an existing component. No new network endpoints, auth paths, or trust boundary changes.

## TDD Gate Compliance

- [x] RED commit exists: a37001b — `test(05-02): add failing test for ContactIconButton double focus stop`
- [x] GREEN commit exists: 88c081c — `feat(05-02): fix ContactIconButton double focus stop (WCAG 2.4.3)`

## Self-Check: PASSED

- [x] src/components/atoms/ContactIconButton.tsx modified with tabIndex={-1} and focus ring classes
- [x] src/components/atoms/ContactIconButton.test.tsx has 7 tests including tabIndex assertion
- [x] RED commit a37001b confirmed in git log
- [x] GREEN commit 88c081c confirmed in git log
- [x] ContactIconButton.tsx coverage: 100% branches/functions/lines/statements
