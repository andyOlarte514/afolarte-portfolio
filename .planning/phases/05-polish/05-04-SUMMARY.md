---
phase: 05-polish
plan: "04"
subsystem: ci
tags: [lighthouse, ci, core-web-vitals, performance, accessibility]
dependency_graph:
  requires: []
  provides: [LHCI-CONFIG, CI-LIGHTHOUSE-GATE]
  affects: [.github/workflows/ci.yml, lighthouserc.json]
tech_stack:
  added: ["@lhci/cli@0.15.1 (CI-only, yarn global add)"]
  patterns: ["Lighthouse CI autorun", "temporary-public-storage upload"]
key_files:
  created:
    - lighthouserc.json
  modified:
    - .github/workflows/ci.yml
decisions:
  - "@lhci/cli installed via yarn global add in CI step (not devDependency) to avoid adding a heavy dep to local installs; pinned to 0.15.1"
  - "temporary-public-storage upload target chosen — no LHCI_GITHUB_APP_TOKEN secret required for v1.0"
  - "LHCI steps appended to existing ci job (not a separate job) to reuse the prior yarn build artifact and avoid duplicate 2-minute builds"
metrics:
  duration: "~3 minutes"
  completed: "2026-06-06"
  tasks_completed: 1
  tasks_total: 3
  files_changed: 2
---

# Phase 05 Plan 04: Lighthouse CI Setup Summary

**One-liner:** Lighthouse CI gating PRs on LCP<=2500ms, CLS<=0.1, performance>=0.85, accessibility>=0.9 via `@lhci/cli@0.15.1` with `temporary-public-storage`.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 2 | Create lighthouserc.json and extend ci.yml | b4454c8 | lighthouserc.json (new), .github/workflows/ci.yml |

## Tasks Skipped (Checkpoints)

- **Task 1** (checkpoint:human-verify) — package legitimacy check for `@lhci/cli` — RESOLVED before this agent ran. User confirmed: Google Chrome Labs, Apache-2.0, version 0.15.1 exists, published by patrickhulce.
- **Task 3** (checkpoint:human-verify — "lhci-ok") — local Lighthouse run against production build. PENDING. Requires user to run `yarn build && yarn start` locally, then `npx lhci collect --url=http://localhost:3000 --numberOfRuns=1` and verify LCP < 2500ms and CLS < 0.1.

## What Was Built

### lighthouserc.json (new file, project root)

Lighthouse CI configuration with four Core Web Vitals assertion thresholds:

- **LCP** `largest-contentful-paint`: error if > 2500ms
- **CLS** `cumulative-layout-shift`: error if > 0.1
- **Performance score** `categories:performance`: error if < 0.85
- **Accessibility score** `categories:accessibility`: error if < 0.9

Server configuration: `startServerCommand: "yarn start"` (production build — not dev, which would score 50-60 due to unminified output). `startServerReadyPattern: "Ready on"` matches Next.js production startup message. 3 runs per audit to average out measurement noise.

Upload target: `temporary-public-storage` — the Vercel-hosted free LHCI storage. No authentication required, no secrets needed.

### .github/workflows/ci.yml (extended)

Two steps appended after the existing "E2E tests" step:

1. **Install Lighthouse CI** — `yarn global add @lhci/cli@0.15.1` (pinned version)
2. **Run Lighthouse CI** — `lhci autorun` (picks up lighthouserc.json from project root automatically)

LHCI runs after the existing `yarn build` step so it starts the production server without a redundant build. No `LHCI_GITHUB_APP_TOKEN` env block added.

## Verification Results

All automated checks passed:

- `python3` JSON validation: startServerCommand == "yarn start", LCP maxNumericValue == 2500, CLS maxNumericValue == 0.1
- `grep -c "lhci autorun" .github/workflows/ci.yml` returns 1
- `grep -c "@lhci/cli@0.15.1" .github/workflows/ci.yml` returns 1
- `lhci autorun` line (51) appears after E2E tests line (44)
- No `LHCI_GITHUB_APP_TOKEN` reference in ci.yml

## Pending

**Task 3 checkpoint (lhci-ok)** is deferred to orchestrator. The local Lighthouse run against the production build must be verified by the user before this plan is considered fully complete. The CI gate is configured and will block regressions once the branch ships to GitHub Actions.

## Deviations from Plan

None — plan executed exactly as written. Task 1 was pre-resolved by the orchestrator before this agent ran.

## Decisions Made

1. **yarn global add vs devDependency** — kept as CI-step install to avoid adding ~50MB of Lighthouse CLI to every developer's local install. Version pinned to 0.15.1 for reproducibility.
2. **Same job as build** — appended to existing `ci` job rather than a separate job. A separate job would need its own `yarn build` (duplicating ~2 minutes). The existing artifact is reused.
3. **No LHCI_GITHUB_APP_TOKEN** — temporary-public-storage does not require authentication for v1.0. Removes one secret management concern.

## Self-Check: PASSED

- `lighthouserc.json` exists at project root: confirmed
- `.github/workflows/ci.yml` contains `lhci autorun`: confirmed
- Commit b4454c8 exists: confirmed
