---
phase: 05-polish
plan: "01"
subsystem: metadata/seo
tags: [og-metadata, twitter-card, opengraph-image, next-og, seo]
dependency_graph:
  requires: []
  provides: [og-metadata, opengraph-image-route]
  affects: [src/app/layout.tsx, src/app/opengraph-image.tsx]
tech_stack:
  added:
    - next/og (ImageResponse — bundled in Next.js 16, no new package needed)
  patterns:
    - Next.js opengraph-image.tsx file convention (auto-wired og:image via metadataBase)
    - Satori JSX constraints (inline style only, display flex, hex literals)
    - noPropertyAccessFromIndexSignature bracket notation for process.env
key_files:
  modified:
    - src/app/layout.tsx
  created:
    - src/app/opengraph-image.tsx
decisions:
  - Import ImageResponse from "next/og" not "@vercel/og" (bundled in Next.js 16)
  - No images array in openGraph/twitter — Next.js auto-resolves from opengraph-image.tsx when metadataBase is set
  - No runtime="edge" export — default Node.js runtime uses static optimization at build time
  - Bracket notation process.env["NEXT_PUBLIC_SITE_URL"] required by noPropertyAccessFromIndexSignature tsconfig rule
  - Fallback "https://andyolarte.dev" prevents TypeError when NEXT_PUBLIC_SITE_URL is absent
metrics:
  duration: "~8 minutes"
  completed: "2026-06-06T18:42:31Z"
  tasks_completed: 2
  files_changed: 2
requirements_met:
  - SEO-01
---

# Phase 05 Plan 01: OG Metadata + opengraph-image.tsx Summary

**One-liner:** OG/Twitter Card metadata injected into layout.tsx plus a 1200x630 PNG opengraph-image.tsx route using Next.js ImageResponse with dark zinc background, indigo accent bar, and Andy's name/title/domain text.

## Tasks Completed

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Extend layout.tsx metadata with metadataBase, openGraph, twitter | 1a9a51d | src/app/layout.tsx |
| 2 | Create opengraph-image.tsx OG image route (1200x630 PNG) | 81f2f08 | src/app/opengraph-image.tsx |

## What Was Built

### Task 1: layout.tsx metadata extension

The existing `export const metadata: Metadata` object was extended with three new fields:

- `metadataBase`: `new URL(process.env["NEXT_PUBLIC_SITE_URL"] ?? "https://andyolarte.dev")` — bracket notation required by tsconfig `noPropertyAccessFromIndexSignature`; fallback prevents TypeError when env var is absent
- `openGraph`: type "website", title, description, url "/" — no `images` array (Next.js auto-resolves from opengraph-image.tsx)
- `twitter`: card "summary_large_image", title, description — no `images` array

RootLayout JSX was not touched.

### Task 2: opengraph-image.tsx new file

New file `src/app/opengraph-image.tsx` in the Next.js App Router root implements the opengraph-image file convention:

- Named exports: `alt` (full name + title), `size` ({ width: 1200, height: 630 }), `contentType` ("image/png")
- Default export: `Image(): ImageResponse` — explicit return type per project rules
- JSX layout: dark zinc (#09090b) background, 8px left indigo (#6366f1) accent bar, content column with name (56px bold white), title (28px zinc-400), domain (20px indigo-500)
- All styles via inline `style={{}}` objects — zero className attributes (Satori constraint)
- Imports from `next/og`, not `@vercel/og`; no edge runtime export

## Verification Results

1. `yarn tsc --noEmit` — exits 0 (no TypeScript errors)
2. `yarn build` — exits 0, static optimization applied, 4/4 pages generated
3. `grep -c "metadataBase" layout.tsx` — 1
4. `grep -c "openGraph" layout.tsx` — 1
5. `grep -c "twitter" layout.tsx` — 1
6. No `images` array in openGraph or twitter — verified via grep
7. `grep -c "ImageResponse" opengraph-image.tsx` — 3 (import + return type + instantiation)
8. `grep -c "className" opengraph-image.tsx` — 0
9. `grep -c "runtime" opengraph-image.tsx` — 0
10. `grep -c "@vercel/og" opengraph-image.tsx` — 0

## Deviations from Plan

None — plan executed exactly as written. All constraints from the interface spec and PATTERNS.md were followed without deviation.

## Known Stubs

None. Both files contain real production values. The domain fallback "andyolarte.dev" is a real domain, not a placeholder.

## Threat Flags

None. No new network endpoints, auth paths, or trust boundary changes introduced. The opengraph-image route is a statically optimized GET handler returning a PNG — no user input, no data mutation.

## Self-Check: PASSED

- [x] src/app/layout.tsx modified and committed (1a9a51d)
- [x] src/app/opengraph-image.tsx created and committed (81f2f08)
- [x] yarn tsc --noEmit exits 0
- [x] yarn build exits 0
- [x] No className in opengraph-image.tsx JSX
- [x] No @vercel/og import
- [x] No runtime export
- [x] metadataBase has NEXT_PUBLIC_SITE_URL fallback
- [x] No images array in openGraph/twitter objects
