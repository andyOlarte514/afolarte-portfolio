---
phase: "5"
phase-slug: "polish"
date: "2026-06-06"
---

# Phase 5: polish — Validation Strategy

## Test Framework

| Property | Value |
|----------|-------|
| Framework | Jest 30 + React Testing Library 16 (unit); Playwright 1.60 (E2E) |
| Config file | `jest.config.mjs` / `playwright.config.ts` |
| Quick run command | `yarn test` |
| Full suite command | `yarn test:coverage && yarn test:e2e` |

## Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SEO-01 | OG meta tags present in page `<head>` | E2E (Playwright) | `yarn test:e2e` | No — add in Plan 05-05 |
| SEO-01 | `opengraph-image.tsx` returns 200 with `Content-Type: image/png` | E2E (Playwright) | `yarn test:e2e` | No — add in Plan 05-05 |
| SEO-01 | `og:image` meta tag present with opengraph-image URL | E2E (Playwright) | `yarn test:e2e` | No — add in Plan 05-05 |
| SEO-02 | `NavLink` has visible focus ring on keyboard Tab | E2E (Playwright) | `yarn test:e2e` | No — add in Plan 05-05 |
| SEO-02 | `CTAButton` has visible focus ring | E2E (Playwright) | `yarn test:e2e` | No — add in Plan 05-05 |
| SEO-02 | `ContactIconButton` single focus stop (Tab lands on `<a>`) | unit | `yarn test` | No — add in Plan 05-02 |
| SEO-03 | `HeroPhoto` renders `alt` when `src` present | unit | `yarn test` | Yes — `HeroPhoto.test.tsx` |
| SEO-03 | `CompanyAvatar` has `aria-hidden="true"` | unit | `yarn test` | Yes — existing test |
| LAYOUT-05 | LCP < 2500ms, CLS < 0.1 | Lighthouse CI | `lhci autorun` | No — Plan 05-04 |
| LAYOUT-05 | `HeroPhoto` uses `preload={true}` when `src` present | unit | `yarn test` | No — add in Plan 05-03 |

## Coverage Notes

- `src/app/opengraph-image.tsx` excluded from unit coverage (`!src/app/**` in `jest.config.mjs`) — covered by E2E only
- `src/app/layout.tsx` excluded from unit coverage — OG meta tags covered by E2E
- `ContactIconButton.tsx` modified — `ContactIconButton.test.tsx` must be updated (100% coverage enforced)
- `HeroPhoto.tsx` modified — `HeroPhoto.test.tsx` must be updated (100% coverage enforced)

## Sampling Rate

| Gate | Command |
|------|---------|
| Per task commit | `yarn test:coverage` |
| Per wave merge | `yarn test:coverage && yarn test:e2e` |
| Phase gate | Full suite green before `/gsd:verify-work` |
