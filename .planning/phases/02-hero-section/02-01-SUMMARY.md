---
phase: 02-hero-section
plan: "01"
subsystem: types-and-data
tags: [typescript, types, data, hero, content]
dependency_graph:
  requires: []
  provides:
    - src/types/hero.ts (RoleBadgeData, HeroContent interfaces)
    - src/lib/heroContent.ts (heroContent typed const)
  affects:
    - src/components/atoms/HeroPhoto.tsx (02-02)
    - src/components/atoms/RoleBadge.tsx (02-02)
    - src/components/atoms/CTAButton.tsx (02-02)
    - src/components/organisms/HeroSection.tsx (02-03)
tech_stack:
  added: []
  patterns:
    - Pure TypeScript type-only file with zero runtime imports (src/types/hero.ts)
    - Typed named export const with import type (src/lib/heroContent.ts)
    - exactOptionalPropertyTypes-compliant optional src field
    - readonly tuple to enforce exactly two role badges
key_files:
  created:
    - src/types/hero.ts
    - src/lib/heroContent.ts
  modified: []
decisions:
  - ctaTargetId (not ctaHref) used in HeroContent — atom calls document.querySelector to scroll
  - photo.src omitted entirely (not set to undefined) to satisfy exactOptionalPropertyTypes: true
  - as const applied to heroContent for maximum type narrowing
  - No default exports — lib layer named export pattern followed
metrics:
  duration: "1m 29s"
  completed: "2026-06-03T22:56:47Z"
  tasks_completed: 2
  tasks_total: 2
  files_created: 2
  files_modified: 0
---

# Phase 02 Plan 01: Hero Types and Content Data Summary

**One-liner:** RoleBadgeData/HeroContent TypeScript interfaces and heroContent const with exact canonical copy strings for single-source-of-truth hero data.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create src/types/hero.ts | 11f9089 | src/types/hero.ts |
| 2 | Create src/lib/heroContent.ts | 64c6b1d | src/lib/heroContent.ts |

## What Was Built

**src/types/hero.ts** — Pure TypeScript type definitions with zero imports:
- `RoleBadgeData` interface: `readonly company: string` and `readonly role: string`
- `HeroContent` interface: all readonly fields including `roles: readonly [RoleBadgeData, RoleBadgeData]` (tuple enforcing exactly two) and `photo.src?: string | undefined` (exactOptionalPropertyTypes-compliant)
- `ctaTargetId: string` field (not ctaHref) — aligns with scroll-to-contact atom pattern

**src/lib/heroContent.ts** — Typed named export const:
- Imports only `HeroContent` type via `import type { HeroContent } from "@/types/hero"`
- Exports `heroContent` with exact canonical copy strings per UI-SPEC §8
- `photo.src` is intentionally omitted (not set to `undefined`) satisfying `exactOptionalPropertyTypes: true`
- No React imports — importable in Node context for Phase 6 PDF export

## Verification Results

- `yarn type-check`: 0 errors
- `grep "export interface RoleBadgeData" src/types/hero.ts`: found
- `grep "export interface HeroContent" src/types/hero.ts`: found
- `grep "export const heroContent" src/lib/heroContent.ts`: found
- `grep "ctaTargetId" src/lib/heroContent.ts`: found (not ctaHref)
- `grep "src: undefined" src/lib/heroContent.ts`: not found (property omitted)

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — heroContent contains complete real data (Andy's actual professional copy). No placeholder values.

## Threat Flags

None — files contain only intentionally public professional information (name, title, bio). No secrets, no new network endpoints, no auth paths.

## Self-Check: PASSED

- [x] src/types/hero.ts exists at worktree path
- [x] src/lib/heroContent.ts exists at worktree path
- [x] Commit 11f9089 confirmed in git log
- [x] Commit 64c6b1d confirmed in git log
- [x] yarn type-check passes with zero errors
- [x] All acceptance criteria verified
