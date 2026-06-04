---
phase: 03-experience-timeline
plan: 01
subsystem: ui
tags: [typescript, react, nextjs, experience-timeline, atomic-design]

# Dependency graph
requires: []
provides:
  - WorkEntry TypeScript interface with exactOptionalPropertyTypes-safe readonly fields
  - experienceContent array: 7 WorkEntry objects in reverse-chronological order with real impact bullets
affects:
  - 03-02 (CompanyAvatar atom)
  - 03-03 (TimelineEntry molecule)
  - 03-04 (ExperienceTimeline organism)
  - 06-pdf-export (imports experienceContent directly)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "WorkEntry interface: readonly fields + exactOptionalPropertyTypes (description?: string | undefined, tags?: readonly string[] | undefined)"
    - "Content file pattern: import type, named export, as const, omit optional fields instead of setting undefined"

key-files:
  created:
    - src/types/experience.ts
    - src/lib/experienceContent.ts
  modified: []

key-decisions:
  - "Spec-Atelier (Jan 2021 – Dec 2021) confirmed no Concurrent Role badge despite Wolox overlap — CV does not flag it"
  - "tags field omitted entirely for 5 entries (Redbee, CodeBranch, Wolox, Spec-Atelier, Pragma) per exactOptionalPropertyTypes"
  - "experienceContent is the single source of truth — no data duplication; Phase 6 PDF export imports this file directly"

patterns-established:
  - "Optional fields omitted (not set to undefined) in content files — mirrors heroContent.ts pattern"
  - "readonly WorkEntry[] as const — enforces immutability end-to-end"

requirements-completed:
  - EXPER-01
  - EXPER-02
  - EXPER-03

# Metrics
duration: 1min
completed: 2026-06-04
---

# Phase 3 Plan 01: Experience Data Layer Summary

**WorkEntry interface and experienceContent array: 7 entries in reverse-chronological order with real impact bullets for all positions including NVIDIA's design-system migration and 1,490+ commit scope**

## Performance

- **Duration:** 1 min
- **Started:** 2026-06-04T01:32:24Z
- **Completed:** 2026-06-04T01:33:25Z
- **Tasks:** 2 (Task 0 was a content gate checkpoint cleared by the user before execution)
- **Files modified:** 2

## Accomplishments

- Created WorkEntry interface with all 8 fields typed correctly per exactOptionalPropertyTypes constraints (readonly description?: string | undefined, readonly tags?: readonly string[] | undefined, readonly bullets: readonly string[])
- Created experienceContent with 7 real-bullet entries: NVIDIA, Mekan, Redbee, CodeBranch, Wolox (Accenture), Spec-Atelier, Pragma S.A. — no placeholder text, no TODO markers
- Confirmed Spec-Atelier has no Concurrent Role badge (CV does not flag it); only NVIDIA and Mekan carry tags

## Task Commits

Each task was committed atomically:

1. **Task 1: WorkEntry type definition** - `298e5af` (feat)
2. **Task 2: Experience content data file (7 entries)** - `1e5a5ed` (feat)

**Plan metadata:** (final docs commit)

## Files Created/Modified

- `src/types/experience.ts` - WorkEntry interface: 8 readonly fields with exactOptionalPropertyTypes-safe optional typing
- `src/lib/experienceContent.ts` - 7 WorkEntry objects as readonly WorkEntry[] as const; NVIDIA first, Pragma last; real CV bullets throughout

## Decisions Made

- Spec-Atelier (Jan 2021 – Dec 2021) does NOT receive a Concurrent Role badge. The user confirmed the CV does not flag this role as concurrent despite overlapping with Wolox (Sep 2018 – Jan 2023).
- Only NVIDIA (tags: ["Tech Lead", "Full-stack"]) and Mekan (tags: ["Concurrent Role"]) carry tags fields. All other 5 entries omit the field entirely per exactOptionalPropertyTypes.
- experienceContent is the canonical single source of truth for all downstream consumers (Phase 3 components and Phase 6 PDF export).

## Deviations from Plan

None — plan executed exactly as written. Task 0 content gate was pre-cleared by the user before this executor was spawned.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- WorkEntry interface ready for consumption by CompanyAvatar atom (03-02), TimelineEntry molecule (03-03), and ExperienceTimeline organism (03-04)
- experienceContent array is the single source of truth — all downstream plans import from src/lib/experienceContent.ts
- yarn type-check exits 0; no TypeScript errors introduced

---
*Phase: 03-experience-timeline*
*Completed: 2026-06-04*
