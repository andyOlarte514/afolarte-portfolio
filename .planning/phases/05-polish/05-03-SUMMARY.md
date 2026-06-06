---
phase: "05-polish"
plan: "03"
subsystem: "atoms"
tags: ["performance", "lcp", "next-image", "preload"]
dependency_graph:
  requires: []
  provides: ["HeroPhoto preload optimization"]
  affects: ["src/components/atoms/HeroPhoto.tsx"]
tech_stack:
  added: []
  patterns: ["Next.js 16 preload prop (replaces deprecated priority)"]
key_files:
  created: []
  modified:
    - "src/components/atoms/HeroPhoto.tsx"
    - "src/components/atoms/HeroPhoto.test.tsx"
decisions:
  - "Use preload={true} instead of priority={true} — priority is deprecated in Next.js 16.0.0 and generates build warnings"
metrics:
  duration: "5m"
  completed: "2026-06-06"
---

# Phase 05 Plan 03: HeroPhoto Preload + Real Photo Summary

**One-liner:** Added `preload={true}` to Next.js Image in HeroPhoto src-present branch for LCP optimization, with deprecated-API guard test.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Photo placement (human checkpoint) | b2abf6d | public/andy-olarte.jpeg, src/lib/heroContent.ts |
| 2 | Add preload={true} + guard test | 0e91fc4 | HeroPhoto.tsx, HeroPhoto.test.tsx |

## Changes Made

### HeroPhoto.tsx

- Added `preload={true}` to the `<Image>` component in the src-present branch (line 22).
- The prop instructs Next.js 16 to emit a `<link rel="preload" as="image">` tag in the SSR `<head>`, enabling the browser to start downloading the hero photo before render — direct LCP improvement.
- The placeholder branch (initials fallback) is untouched.

### HeroPhoto.test.tsx

- Added 1 new test: `"img rendered when src is provided does not use deprecated priority prop"`.
- The test renders HeroPhoto with a src and asserts the resulting `<img>` element does NOT have a `priority` attribute.
- This guards against future regression back to the deprecated Next.js 16 API.

## Test Results

```
Tests:  4 passed, 4 total
HeroPhoto.tsx | 100 | 100 | 100 | 100 |
```

All 4 tests pass (3 existing + 1 new) with 100% coverage on HeroPhoto.tsx.

## Deviations from Plan

None — plan executed exactly as written. Task 1 (human checkpoint) was pre-resolved with photo at `public/andy-olarte.jpeg` and `heroContent.ts` updated.

## Known Stubs

None — HeroPhoto renders the real photo when `src` is provided via `heroContent.ts`.

## Threat Flags

None — no new network endpoints, auth paths, or trust boundaries introduced.

## Self-Check: PASSED

- `src/components/atoms/HeroPhoto.tsx` — FOUND
- `src/components/atoms/HeroPhoto.test.tsx` — FOUND
- Commit `0e91fc4` — FOUND
- `grep preload={true} HeroPhoto.tsx` — 1 match
- `grep priority HeroPhoto.tsx` — 0 matches
