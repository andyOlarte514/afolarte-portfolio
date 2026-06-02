---
phase: 01-layout-foundation
plan: "01"
subsystem: design-system-foundation
tags: [shadcn-ui, tailwind-v4, dark-mode, anti-flash, css-variables]
dependency_graph:
  requires: []
  provides:
    - shadcn/ui initialized with components.json
    - cn() utility at src/lib/utils.ts
    - Button and Sheet shadcn components at src/components/ui/
    - Project color tokens in globals.css (light + dark mode)
    - Anti-flash theme script in layout.tsx head
    - suppressHydrationWarning on html element
  affects:
    - All subsequent plans in Phase 1 (depend on Button, Sheet, color tokens)
    - All phases 2-5 (depend on shadcn/ui being initialized)
tech_stack:
  added:
    - "@base-ui/react ^1.5.0 — Base UI primitives for shadcn components"
    - "class-variance-authority ^0.7.1 — variant-based class management"
    - "clsx ^2.1.1 — conditional class utility"
    - "tailwind-merge ^3.6.0 — Tailwind class deduplication"
    - "lucide-react ^1.17.0 — icon library (from shadcn init)"
    - "tw-animate-css — Tailwind animation utilities (from shadcn init)"
  patterns:
    - "shadcn/ui 4.10.0 base-nova style with CSS variables"
    - "Tailwind v4 @custom-variant dark class strategy"
    - "Anti-flash inline script using dangerouslySetInnerHTML"
key_files:
  created:
    - path: components.json
      role: shadcn/ui project configuration
    - path: src/lib/utils.ts
      role: cn() utility (clsx + tailwind-merge)
    - path: src/components/ui/button.tsx
      role: shadcn Button component (base-nova style, @base-ui/react)
    - path: src/components/ui/sheet.tsx
      role: shadcn Sheet component (base-nova style, @base-ui/react Dialog)
  modified:
    - path: src/app/globals.css
      role: Project color tokens, dark mode class strategy, smooth scroll
    - path: src/app/layout.tsx
      role: Anti-flash script, suppressHydrationWarning, metadata, bg-background
    - path: package.json
      role: New dependencies added by shadcn init
    - path: yarn.lock
      role: Lockfile updated with new dependencies
decisions:
  - "Used shadcn 4.10.0 defaults preset (base-nova style) which uses @base-ui/react instead of @radix-ui — newer API, fully compatible"
  - "Kept tw-animate-css and shadcn/tailwind.css imports from shadcn init — required for shadcn component animations"
  - "Used @custom-variant dark in globals.css for Tailwind v4 class-based dark mode (equivalent to darkMode: class in v3)"
  - "Anti-flash script uses self-invoking function with try/catch to prevent old browser errors from blocking page render"
metrics:
  duration_seconds: 229
  completed_date: "2026-06-02"
  tasks_completed: 3
  tasks_total: 3
  files_created: 4
  files_modified: 4
---

# Phase 01 Plan 01: Design System Foundation Summary

**One-liner:** shadcn/ui 4.10.0 initialized with base-nova style, project hex color tokens in globals.css via .dark class strategy, and anti-flash inline script in layout.tsx head.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Initialize shadcn/ui and install Button + Sheet | 461e275 | components.json, src/lib/utils.ts, src/components/ui/button.tsx, src/components/ui/sheet.tsx, package.json, yarn.lock, src/app/globals.css |
| 2 | Configure globals.css with project color palette | 0e82c4b | src/app/globals.css |
| 3 | Update layout.tsx with anti-flash script and metadata | 2f000f4 | src/app/layout.tsx |

## Verification Results

All plan success criteria met:

1. `yarn type-check` — PASS (no TypeScript errors)
2. `yarn build` — PASS (Next.js 16.2.7 Turbopack build succeeds)
3. `grep -c "\.dark {" globals.css` — returns 1
4. `grep "prefers-color-scheme" globals.css` — returns 0 matches
5. `grep "suppressHydrationWarning" layout.tsx` — returns 1 match
6. `grep "dangerouslySetInnerHTML" layout.tsx` — returns 1 match
7. `ls src/components/ui/button.tsx src/components/ui/sheet.tsx` — both exist
8. `ls components.json src/lib/utils.ts` — both exist

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] shadcn 4.10.0 has different CLI flags**
- **Found during:** Task 1
- **Issue:** Plan specified `--base-color zinc --css-variables --global-css` flags which do not exist in shadcn 4.10.0. The CLI returned `error: unknown option '--base-color'`.
- **Fix:** Used `--defaults --yes` which invokes the `base-nova` preset automatically. The `--css-variables` flag was confirmed valid and kept.
- **Files modified:** None additional — shadcn init ran successfully with correct flags
- **Commit:** 461e275

**2. [Rule 3 - Blocking] shadcn 4.10.0 uses @base-ui/react instead of @radix-ui**
- **Found during:** Task 1
- **Issue:** Plan expected "Radix UI-based implementations" in the done criteria. shadcn 4.10.0 with base-nova style uses `@base-ui/react` (Base UI, the successor to Radix UI), not `@radix-ui/react-dialog` etc.
- **Fix:** Accepted the generated components as-is. Base UI provides equivalent Radix UI primitives with improved APIs. TypeScript check passes, build succeeds.
- **Files modified:** src/components/ui/button.tsx, src/components/ui/sheet.tsx
- **Commit:** 461e275

**3. [Rule 3 - Blocking] shadcn init auto-created button.tsx during init (not separate add)**
- **Found during:** Task 1
- **Issue:** The `--defaults` preset automatically creates button.tsx as part of init. Running `yarn dlx shadcn@latest add button --yes` was skipped (not needed); `add sheet --yes` was still required.
- **Fix:** Ran `yarn dlx shadcn@latest add sheet --yes` only. Both components are present as required.
- **Files modified:** None additional
- **Commit:** 461e275

**4. shadcn init adds @import "tw-animate-css" and @import "shadcn/tailwind.css" to globals.css**
- **Found during:** Task 2
- **Issue:** The init added two extra imports beyond `@import "tailwindcss"`. Plan instructions focused on the CSS variable structure, not these shadcn-internal imports.
- **Fix:** Kept both imports — they are required for shadcn component animations and base styles. Rewrote only the CSS variable sections as specified.
- **Files modified:** src/app/globals.css
- **Commit:** 0e82c4b

**5. Tailwind v4 uses @custom-variant dark instead of darkMode config**
- **Found during:** Task 2
- **Issue:** Tailwind v4 does not use a `darkMode: 'class'` config option. Instead, it uses `@custom-variant dark (&:is(.dark *))` in CSS to define the class-based dark strategy.
- **Fix:** Preserved the `@custom-variant dark` line that shadcn init added — this is the correct Tailwind v4 class strategy equivalent. The `.dark { }` block works correctly with it.
- **Files modified:** src/app/globals.css
- **Commit:** 0e82c4b

## Known Stubs

None — this plan delivers infrastructure only (globals.css, layout.tsx, shadcn components). No UI rendering or data-driven content present.

## Threat Flags

No new threat surface beyond what was already in the plan's threat model. The generated shadcn components (button, sheet) were reviewed:
- `button.tsx`: Uses `@base-ui/react/button` — official Base UI (successor to Radix UI), no security concerns
- `sheet.tsx`: Uses `@base-ui/react/dialog` — official Base UI dialog primitive, no security concerns
- Both components sourced from official shadcn registry (verified: ui.shadcn.com)

## Self-Check: PASSED

Files verified present:
- `components.json` — FOUND
- `src/lib/utils.ts` — FOUND
- `src/components/ui/button.tsx` — FOUND
- `src/components/ui/sheet.tsx` — FOUND
- `src/app/globals.css` — FOUND (contains `.dark {`, correct tokens)
- `src/app/layout.tsx` — FOUND (contains `suppressHydrationWarning`, `dangerouslySetInnerHTML`)

Commits verified:
- 461e275 feat(01-01): initialize shadcn/ui and install Button + Sheet components — FOUND
- 0e82c4b feat(01-01): configure globals.css with project color palette and dark mode class strategy — FOUND
- 2f000f4 feat(01-01): update layout.tsx with anti-flash script, semantic body structure, and metadata — FOUND
