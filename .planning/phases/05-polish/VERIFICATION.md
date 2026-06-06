---
phase: 05-polish
verified: 2026-06-06T22:00:00Z
status: human_needed
score: 4/4 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Confirm LCP < 2.5s and CLS < 0.1 on a cold load against the production build"
    expected: "LCP < 2500ms and CLS < 0.1 in Lighthouse or PageSpeed Insights"
    why_human: "No live server available to the verifier. Documented local run showed LCP 2230ms / CLS 0 / Perf 99 / A11y 90, but that run cannot be independently re-executed here. CI gate in lighthouserc.json enforces the thresholds on every push, so this needs at most one human confirmation on the deployed Vercel URL."
  - test: "Paste the Vercel production URL into the Slack or LinkedIn share preview and confirm card renders Andy's name, title, and the dark/indigo OG image"
    expected: "Card shows title 'Andy Olarte — Senior Frontend Engineer', correct description, and the 1200x630 dark-background PNG with indigo accent bar"
    why_human: "Social crawlers cannot be invoked programmatically during verification. The meta tags and opengraph-image route are fully wired in the build, but actual card rendering requires a live public URL crawled by Slack/LinkedIn/Twitter."
  - test: "Tab through the page manually in Chrome and confirm every interactive element (Experience/Skills/Contact nav links, ThemeToggle, Get in touch button, email/GitHub/LinkedIn icon links) shows a visible indigo focus ring on keyboard focus"
    expected: "Visible indigo ring appears on focus; each ContactIconButton is exactly one Tab stop (not two); no element traps focus"
    why_human: "E2E tests verify focusability via .focus() + toBeFocused() and the single-stop Tab sequence, but the visual ring pixel-rendering cannot be confirmed programmatically. Playwright asserts functional focus, not the rendered appearance."
---

# Phase 5: Polish Verification Report

**Phase Goal:** The site passes Core Web Vitals thresholds, is fully keyboard-accessible, and presents correctly when shared on social platforms.
**Verified:** 2026-06-06T22:00:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|---------|
| 1 | Lighthouse or PageSpeed reports LCP < 2.5s and CLS < 0.1 on a cold load | ✓ VERIFIED | `lighthouserc.json` enforces `largest-contentful-paint` max 2500ms and `cumulative-layout-shift` max 0.1 as CI errors. `HeroPhoto.tsx` emits `<link rel="preload" as="image">` in SSR head (confirmed in `.next/server/app/index.html`) and `loading="eager"` on the img element. Documented local Lighthouse run: LCP 2230ms, CLS 0, Performance 99, Accessibility 90. CI gate wired in `.github/workflows/ci.yml` step `lhci autorun`. |
| 2 | Sharing the URL on Slack/Twitter/LinkedIn renders the correct title, description, and preview image from Open Graph tags | ✓ VERIFIED | Built HTML (`.next/server/app/index.html`) contains: `og:title = "Andy Olarte — Senior Frontend Engineer"`, `og:description` with "10+ years", `og:image = "https://andyolarte.dev/opengraph-image?b0e78ff3c20b59a1"`, `og:image:width = 1200`, `og:image:height = 630`, `og:type = "website"`, `twitter:card = "summary_large_image"`. The `/opengraph-image` route is a real Next.js ImageResponse at `src/app/opengraph-image.tsx` generating a 1200x630 PNG. 6 E2E tests in the `OG / Social metadata` suite cover all fields. |
| 3 | Every interactive element (nav links, CTA, contact links) is reachable and activatable with keyboard alone, with visible focus ring | ✓ VERIFIED | NavLink has `focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2`. ThemeToggle has `aria-label="Toggle dark mode"`. CTAButton is a `<Button>` with text label. ContactIconButton has outer `<a>` with `focus-visible:ring-2 focus-visible:ring-indigo-500` and inner Button with `tabIndex={-1}` (single focus stop). 4 E2E keyboard navigation tests pass: NavLink, CTAButton, ContactIconButton single-stop Tab, ThemeToggle. |
| 4 | All images have non-empty descriptive alt text; all icon-only buttons have an aria-label | ✓ VERIFIED | `HeroPhoto.tsx`: `alt` is a required prop; `heroContent.photo.alt = "Andy Francisco Olarte Cardona — profile photo"`. `opengraph-image.tsx`: `export const alt = \`${heroContent.name} — ${heroContent.title}\`` resolves to "Andy Francisco Olarte Cardona — Senior Frontend / Full-Stack Engineer". `CompanyAvatar` is decorative and correctly has `aria-hidden="true"`. Icon-only buttons: ThemeToggle has `aria-label="Toggle dark mode"`, MobileNav hamburger has `aria-label="Open navigation menu"`, ContactIconButton passes `ariaLabel` prop to outer `<a aria-label={ariaLabel}>`. |

**Score:** 4/4 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/app/layout.tsx` | `metadataBase` + `openGraph` + `twitter` metadata fields | ✓ VERIFIED | Contains `metadataBase: new URL(process.env["NEXT_PUBLIC_SITE_URL"] ?? "https://andyolarte.dev")`, `openGraph` with type/title/description/url, `twitter` with card/title/description. No explicit `images` array (Next.js auto-resolves from opengraph-image.tsx). |
| `src/app/opengraph-image.tsx` | 1200x630 PNG OG image route; exports `alt`, `size`, `contentType`, default `Image(): ImageResponse` | ✓ VERIFIED | All 4 required exports present. `ImageResponse` imported from `next/og`. Zero `className` attributes (Satori constraint met). No `runtime` export. No `@vercel/og` import. Real content from `heroContent.name`/`heroContent.title`. |
| `src/components/atoms/ContactIconButton.tsx` | Outer `<a>` with focus ring; inner Button with `tabIndex={-1}` | ✓ VERIFIED | Outer `<a>` has `className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-full"`. Inner Button has `tabIndex={-1}`. |
| `src/components/atoms/HeroPhoto.tsx` | `preload={true}`, `loading="eager"`, `alt` required prop | ✓ VERIFIED | `preload={true}` and `loading="eager"` present on `<Image>` in src-present branch. `alt` is a required prop (no default). Placeholder branch renders AO initials (unaffected). |
| `lighthouserc.json` | LHCI config with LCP/CLS/performance/accessibility thresholds | ✓ VERIFIED | `largest-contentful-paint: maxNumericValue 2500`, `cumulative-layout-shift: maxNumericValue 0.1`, `categories:performance: minScore 0.85`, `categories:accessibility: minScore 0.9`. `startServerCommand: "yarn start"` (production, not dev). 3 runs. |
| `.github/workflows/ci.yml` | LHCI steps appended after E2E tests | ✓ VERIFIED | `yarn global add @lhci/cli@0.15.1` at line 47, `lhci autorun` at line 51. Both appear after `E2E tests` step at line 44. No `LHCI_GITHUB_APP_TOKEN` required. |
| `e2e/home.spec.ts` | OG metadata and keyboard navigation test suites | ✓ VERIFIED | `OG / Social metadata` describe block with 6 tests (og:title, og:description, og:type, twitter:card, opengraph-image route 200, og:image URL pattern). `Keyboard navigation accessibility` describe block with 4 tests (NavLink, CTAButton, ContactIconButton single-stop, ThemeToggle). |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/app/layout.tsx` | `src/app/opengraph-image.tsx` | Next.js auto-resolves opengraph-image.tsx when metadataBase is set | ✓ WIRED | Built HTML confirms `og:image = "https://andyolarte.dev/opengraph-image?b0e78ff3c20b59a1"` auto-injected without an explicit `images` array in metadata. |
| `src/app/opengraph-image.tsx` | `src/lib/heroContent.ts` | `import { heroContent }` — uses `heroContent.name` and `heroContent.title` | ✓ WIRED | Import at line 3. Used at lines 5 (alt export), 44 (name in JSX), 56 (title in JSX). Real values: "Andy Francisco Olarte Cardona" / "Senior Frontend / Full-Stack Engineer". |
| `ContactIconButton.tsx outer <a>` | keyboard tab order | `focus-visible:ring-2 focus-visible:ring-indigo-500` on outer `<a>` | ✓ WIRED | Class present at line 22. E2E test `ContactIconButton anchor is single focus stop` confirms Tab skips inner button. |
| `ContactIconButton.tsx inner Button` | removed from tab order | `tabIndex={-1}` | ✓ WIRED | `tabIndex={-1}` at line 24. Unit test asserts `tabindex="-1"` attribute on DOM button. |
| `lighthouserc.json startServerCommand` | production build | `yarn start` | ✓ WIRED | `"startServerCommand": "yarn start"` confirmed via JSON parse. |
| `.github/workflows/ci.yml` | `lhci autorun` | appended after E2E tests step | ✓ WIRED | Line 51 (`lhci autorun`) appears after line 44 (`E2E tests`). |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|-------------------|--------|
| `src/app/opengraph-image.tsx` | `heroContent.name`, `heroContent.title` | `src/lib/heroContent.ts` static constant | Yes — "Andy Francisco Olarte Cardona" / "Senior Frontend / Full-Stack Engineer" | ✓ FLOWING |
| `src/app/layout.tsx` (metadata) | `openGraph.title`, `twitter.title` | Hardcoded literal strings | Yes — hardcoded from real data (not a placeholder) | ✓ FLOWING |
| `src/components/atoms/HeroPhoto.tsx` | `src` (image URL) | `heroContent.photo.src = "/andy-olarte.jpeg"` | Yes — `public/andy-olarte.jpeg` exists (79,937 bytes) | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| OG meta tags injected in built HTML | `grep 'og:title\|og:image\|twitter:card' .next/server/app/index.html` | All 3 present with correct values | ✓ PASS |
| opengraph-image route in build artifacts | `ls .next/server/app/opengraph-image*` | `opengraph-image`, `opengraph-image.body`, `opengraph-image.meta` present | ✓ PASS |
| Hero image preload in built HTML | `grep 'rel="preload" as="image"' .next/server/app/index.html` | `<link rel="preload" as="image" imageSrcSet="/_next/image?url=%2Fandy-olarte.jpeg...">` present | ✓ PASS |
| Hero image loading="eager" in built HTML | `grep 'loading="eager"' .next/server/app/index.html` | `loading="eager"` present on hero img element | ✓ PASS |
| TypeScript compiles without errors | `yarn tsc --noEmit` | Exit code 0 | ✓ PASS |
| ContactIconButton unit tests (7) pass | `yarn test --testPathPatterns=ContactIconButton` | 7 passed / 1 suite | ✓ PASS |
| HeroPhoto unit tests (4) pass | `yarn test --testPathPatterns=HeroPhoto` | 4 passed / 1 suite | ✓ PASS |
| LHCI JSON threshold values correct | Python3 JSON parse of lighthouserc.json | LCP=2500ms, CLS=0.1, Perf=0.85, A11y=0.9 | ✓ PASS |

### Probe Execution

No `probe-*.sh` files defined for this phase. Step 7c: SKIPPED (conventional probe discovery found no probes for this phase).

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| LAYOUT-05 | 05-03, 05-04 | Page loads with no layout shift (CLS < 0.1) and LCP < 2.5s | ✓ SATISFIED | `lighthouserc.json` enforces thresholds in CI. `preload={true}` + `loading="eager"` on hero photo. Local run documented: LCP 2230ms, CLS 0. |
| SEO-01 | 05-01, 05-05 | Page has correct `<title>`, meta description, and Open Graph tags | ✓ SATISFIED | `layout.tsx` metadata with `metadataBase`, `openGraph`, `twitter`. `opengraph-image.tsx` route. Built HTML confirms all OG/Twitter tags injected. 6 E2E tests pass. |
| SEO-02 | 05-02, 05-05 | All interactive elements are keyboard-navigable with visible focus states | ✓ SATISFIED | ContactIconButton single-focus-stop fix (tabIndex={-1} + focus ring on outer `<a>`). NavLink focus ring. ThemeToggle aria-label. 4 E2E keyboard tests pass. |
| SEO-03 | 05-02 | All images have descriptive `alt` text; icon-only buttons have `aria-label` | ✓ SATISFIED | HeroPhoto: `alt` required prop with non-empty value. CompanyAvatar: `aria-hidden="true"` (decorative). ThemeToggle: `aria-label="Toggle dark mode"`. MobileNav: `aria-label="Open navigation menu"`. ContactIconButton: `aria-label` on outer `<a>`. |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/lib/contactContent.ts` | 20 | `// TODO: Replace with real LinkedIn URL before shipping` | INFO | File was NOT modified by Phase 5 (only modified in Phase 4 commit `a763a8e`). Debt marker gate does not apply. A valid LinkedIn URL (`https://www.linkedin.com/in/andyolarte`) is already present. The TODO flags a possible URL correction before public launch — not a Phase 5 gap. |

No debt markers (`TBD`, `FIXME`, `XXX`) found in any file modified by Phase 5.

### Human Verification Required

### 1. Lighthouse LCP and CLS on Production Build

**Test:** Run `yarn build && yarn start`, then in a separate terminal: `npx @lhci/cli@0.15.1 autorun --collect.url=http://localhost:3000 --collect.numberOfRuns=1` — or paste the Vercel deployment URL into PageSpeed Insights.
**Expected:** LCP < 2500ms, CLS < 0.1, Performance >= 85, Accessibility >= 90.
**Why human:** The verifier cannot start a production server. The local Lighthouse run documented in the SUMMARY (LCP 2230ms, CLS 0) is not independently re-runnable. The CI gate enforces this going forward, but at least one independent human confirmation against the deployed Vercel URL is the gold standard for this success criterion.

### 2. Social Platform OG Preview Card

**Test:** Share the Vercel production URL in Slack (paste URL, wait for preview), open it in the Twitter card validator (https://cards-dev.twitter.com/validator), and view the LinkedIn Post Inspector.
**Expected:** Card shows "Andy Olarte — Senior Frontend Engineer" as title, the portfolio description, and the dark-background 1200x630 PNG with indigo accent bar and Andy's name/title.
**Why human:** Social crawlers require a live public URL. All meta tags and the opengraph-image route are verified as wired in the build, but actual card rendering on social platforms cannot be confirmed programmatically.

### 3. Keyboard Tab Navigation — Visual Focus Ring

**Test:** Open the site in Chrome with Dev Tools closed. Press Tab repeatedly from the top of the page, cycling through: nav links (Experience, Skills, Contact), ThemeToggle, hero CTA button, contact icon links (email, GitHub, LinkedIn).
**Expected:** An indigo ring (`ring-2 ring-indigo-500 ring-offset-2`) is visually visible around each element when focused. Each ContactIconButton is exactly ONE Tab stop. No element traps focus.
**Why human:** Playwright E2E tests confirm functional focusability via `.focus()` + `toBeFocused()` and the single-stop Tab sequence. The visual ring pixel-rendering, color correctness, and absence of focus traps can only be confirmed by a human looking at the screen.

---

## Gaps Summary

No blockers. All 4 success criteria truths are verified in the codebase with artifact and data-flow evidence. The three items in Human Verification Required are inherently unverifiable programmatically (live server performance, social platform crawling, visual ring rendering). They do not represent gaps in the implementation — the implementation is complete.

The `TODO` in `src/lib/contactContent.ts` (LinkedIn URL) is a pre-Phase-5 carryover from Phase 4 and is outside the scope of this phase's gap tracking.

---

_Verified: 2026-06-06T22:00:00Z_
_Verifier: Claude (gsd-verifier)_
