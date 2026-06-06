---
phase: 06-pdf-cv-export
plan: "03"
subsystem: download-cv-button-atom
tags: [pdf, react-pdf, DownloadCVButton, atoms, tdd, coverage, next-dynamic, ssr]
dependency_graph:
  requires:
    - "06-01 (@react-pdf/renderer installed)"
    - "06-02 (CVDocument atom built at src/components/atoms/CVDocument.tsx)"
  provides:
    - "DownloadCVButton atom at src/components/atoms/DownloadCVButton.tsx"
    - "100% unit test coverage for DownloadCVButton via controllable mock"
  affects:
    - "Plan 06-04 (Navbar integration imports and renders DownloadCVButton)"
tech_stack:
  added: []
  patterns:
    - "TDD red-green cycle for 'use client' atom with next/dynamic SSR-safe import"
    - "Module-level mutable variable (mockLoading) to control render-prop branch in Jest"
    - "DynamicWrapper mock captures props at render time into module-level variable for spy assertions (avoids closure-capture ordering issues)"
    - "Type cast to CapturedPDFLinkProps after render to satisfy TypeScript narrowing with exactOptionalPropertyTypes"
key_files:
  created:
    - src/components/atoms/DownloadCVButton.tsx
    - src/components/atoms/DownloadCVButton.test.tsx
  modified: []
decisions:
  - "DynamicWrapper captures props into a module-level variable at render time rather than using jest.fn spy reassignment — avoids the closure-capture ordering issue where next/dynamic factory captures PDFDownloadLink reference before the spy is installed"
  - "params typed as { loading: boolean } inline (not BlobProviderParams import) — avoids potential TypeScript type gap in @react-pdf/renderer v4.x noted in Pitfall 4 of RESEARCH.md"
  - "capturedPDFLinkProps uses interface CapturedPDFLinkProps with explicit string | undefined (not optional) to satisfy exactOptionalPropertyTypes TypeScript rule"
metrics:
  duration: "~4 minutes"
  completed: "2026-06-06T21:15:00Z"
  tasks: 1
  files_changed: 2
---

# Phase 06 Plan 03: DownloadCVButton Atom Summary

**One-liner:** Created DownloadCVButton "use client" atom wrapping PDFDownloadLink via next/dynamic(ssr:false), rendering loading/ready button states, with 100% branch coverage via TDD red-green cycle and a module-level captured-props mock strategy.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 (RED) | Failing tests for DownloadCVButton (11 behaviors) | c6463ce | src/components/atoms/DownloadCVButton.test.tsx |
| 1 (GREEN) | DownloadCVButton implementation + test fixes | b7589e3 | src/components/atoms/DownloadCVButton.tsx, src/components/atoms/DownloadCVButton.test.tsx |

## Verification Results

- `yarn test src/components/atoms/DownloadCVButton.test.tsx` — 11/11 tests passing
- `yarn type-check` — 0 errors
- `yarn test:coverage` — 100% branches / 100% functions / 100% lines / 100% statements for DownloadCVButton.tsx
- 25 test suites, 177 total tests passing (no regressions; was 166 after Plan 02)
- `"use client"` directive confirmed at line 1 of DownloadCVButton.tsx
- `ssr: false` confirmed in DownloadCVButton.tsx (critical SSR-safety check)
- `fileName="andy-olarte-cv.pdf"` confirmed in DownloadCVButton.tsx
- CVDocument import confirmed in DownloadCVButton.tsx

## Button States Implemented

| State | aria-label | Button Text | Icon | Disabled |
|-------|-----------|-------------|------|---------|
| loading=false (default) | "Download CV as PDF" | "Download CV" | Download (aria-hidden) | false |
| loading=true | "Generating PDF, please wait" | "Generating…" | Loader2 animate-spin (aria-hidden) | true |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Tests 10 and 11 failing due to closure-capture ordering in next/dynamic mock**
- **Found during:** GREEN phase (first test run — Tests 10 and 11 showed 0 calls)
- **Issue:** The original spy approach reassigned `mockRenderer.PDFDownloadLink` after the test started, but the `DynamicWrapper` function captured the `PDFDownloadLink` reference via destructuring inside the outer factory function body — at `dynamic()` call time (module initialization), not at render time. So the spy was never called.
- **Fix:** Moved the `PDFDownloadLink` lookup inside `DynamicWrapper`'s body AND added a module-level `capturedPDFLinkProps` variable that captures the props object at render time. Tests 10 and 11 read from `capturedPDFLinkProps` after render.
- **Files modified:** src/components/atoms/DownloadCVButton.test.tsx
- **Commit:** b7589e3

**2. [Rule 1 - Bug] TypeScript errors with exactOptionalPropertyTypes on capturedPDFLinkProps**
- **Found during:** `yarn type-check` after GREEN tests passed
- **Issue:** The `capturedPDFLinkProps` type `{ fileName?: string }` with `exactOptionalPropertyTypes` would not accept assignment of `{ fileName: string | undefined }`. Also, `const captured = capturedPDFLinkProps` after `capturedPDFLinkProps = null` caused TypeScript to narrow the type to `null`, making `captured!` resolve to `never`.
- **Fix:** Defined an explicit `CapturedPDFLinkProps` interface with required fields typed as `T | undefined` (not optional `T?`). Used `const captured = capturedPDFLinkProps as CapturedPDFLinkProps | null` to break the narrowing.
- **Files modified:** src/components/atoms/DownloadCVButton.test.tsx
- **Commit:** b7589e3

## TDD Gate Compliance

| Gate | Status | Commit |
|------|--------|--------|
| RED (failing test) | PASS — "Cannot find module './DownloadCVButton'" | c6463ce |
| GREEN (all 11 pass) | PASS — 11/11 tests, 100% coverage | b7589e3 |
| REFACTOR | Not needed — implementation is clean and minimal | — |

## Known Stubs

None — DownloadCVButton is a functional component with no placeholder behavior. It renders real loading/ready states driven by PDFDownloadLink's render prop. CVDocument (already built in Plan 02) provides the actual PDF document content.

## Threat Flags

None — DownloadCVButton is a pure UI atom. It triggers a browser-side PDF download via @react-pdf/renderer's PDFDownloadLink. No network requests, no user input, no data persistence, no new trust boundaries introduced.

## Self-Check: PASSED

- [x] src/components/atoms/DownloadCVButton.tsx exists
- [x] src/components/atoms/DownloadCVButton.test.tsx exists
- [x] DownloadCVButton.tsx marked "use client" at line 1
- [x] DownloadCVButton.tsx uses next/dynamic with ssr: false
- [x] DownloadCVButton.tsx imports CVDocument from @/components/atoms/CVDocument
- [x] DownloadCVButton.tsx has fileName="andy-olarte-cv.pdf"
- [x] 11 tests passing (loading=false: Tests 1-5, loading=true: Tests 6-9, invocation: Tests 10-11)
- [x] 100% coverage (branches, functions, lines, statements)
- [x] yarn type-check exits 0
- [x] Commits c6463ce and b7589e3 exist in git log
