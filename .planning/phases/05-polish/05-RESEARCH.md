# Phase 5: Polish - Research

**Researched:** 2026-06-06
**Domain:** Next.js 16 OG image generation, metadata API, Core Web Vitals, WCAG 2.1 AA accessibility, Lighthouse CI
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Use `src/app/opengraph-image.tsx` — Next.js App Router route-based OG image, auto-served at `/opengraph-image`. No manual URL wiring needed.
- **D-02:** OG image design: 1200×630px, dark background (`#09090b`), 8px left indigo accent bar, name in 56px white bold, title in 28px muted, domain in 20px indigo.
- **D-03:** Complete meta tags in `layout.tsx`: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`. URL base from `NEXT_PUBLIC_SITE_URL` env var.
- **D-04:** Real photo at `public/andy-olarte.jpg` (or `.webp`).
- **D-05:** `HeroPhoto` atom: add priority/preload to `<Image>` when `src` is present — hero photo is the LCP candidate.
- **D-06:** OG image visual design is Claude's discretion (text/gradient, no custom font loading needed for v1.0).
- **D-07:** Audit and fix a11y gaps — do NOT add axe-playwright to CI for v1.0.
- **D-08:** Accessibility audit scope: `NavLink`, `CTAButton`, `ThemeToggle`, `MobileNav`, `ContactIconButton`, `HeroPhoto` (alt), `CompanyAvatar`.
- **D-09:** `NavLink` already has `focus-visible:ring-2 focus-visible:ring-indigo-500`. shadcn `Button` has focus ring built-in. Verify no `outline-none` suppression without replacement.
- **D-10:** `HeroPhoto` placeholder (no `src`) — the initials `<div>` is not interactive, no focus ring needed.
- **D-11:** Run Lighthouse locally against production build before merge.
- **D-12:** Add Lighthouse CI to `.github/workflows/ci.yml`. Use `@lhci/cli` with thresholds: LCP < 2500ms, CLS < 0.1. Blocks PRs degrading CWV.
- **D-13:** LHCI storage: `temporary-public-storage` (no external LHCI server for v1.0).

### Claude's Discretion

- Exact visual design of `opengraph-image.tsx` (typography layout, gradient vs solid background)
- `lighthouserc.json` exact configuration
- Order of meta tags in `<head>`

### Deferred Ideas (OUT OF SCOPE)

- axe-playwright in CI for a11y regression — v1.1
- Schema.org structured data (Person, WebSite) — not in v1.0 requirements
- Sitemap.xml / robots.txt — v1.1
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| LAYOUT-05 | Page loads with CLS < 0.1 and LCP < 2.5s | `preload` prop (not `priority`) on HeroPhoto; Lighthouse CI in CI pipeline; local Lighthouse run before merge |
| SEO-01 | Correct `<title>`, meta description, and Open Graph tags for sharing | Next.js 16 `Metadata` API with `metadataBase`, `openGraph`, `twitter` fields in `layout.tsx`; `opengraph-image.tsx` route for generated OG image |
| SEO-02 | All interactive elements keyboard-navigable with visible focus states | shadcn Button CVA has focus-visible ring built-in; `NavLink` already has it; `ContactIconButton` outer `<a>` needs explicit ring + `tabIndex={-1}` on inner `Button` |
| SEO-03 | All images have descriptive `alt` text; icon-only buttons have `aria-label` | `HeroPhoto.alt` already set in heroContent; `CompanyAvatar` is `aria-hidden="true"` (decorative); contact button aria-labels exist in contactContent.ts |
</phase_requirements>

---

## Summary

Phase 5 is a refinement phase with no new content — it adds three independent capabilities: OG image / metadata for social sharing (SEO-01), accessibility compliance (SEO-02, SEO-03), and Core Web Vitals gating via Lighthouse CI (LAYOUT-05).

**Critical Next.js 16 breaking change discovered:** The `priority` prop on `next/image` is **deprecated** in Next.js 16.0.0, replaced by the new `preload` prop. The CONTEXT.md and UI-SPEC refer to adding `priority`, but this must be implemented as `preload` instead. Using `priority` still compiles (backward-compat) but generates a deprecation warning and TypeScript may flag it — `preload={true}` is the correct Next.js 16 implementation. The current `HeroPhoto.tsx` has no such prop at all, so implementing `preload` directly is clean.

**ContactIconButton double-focus-stop** is confirmed: the outer `<a>` is focusable by default and the inner `Button` (Base UI primitive) is also focusable. The fix requires adding `tabIndex={-1}` to the inner `Button` and adding focus-visible ring Tailwind classes to the outer `<a>`. This change requires updating the existing test to reflect the new tabIndex behavior.

**OG image generation** uses `ImageResponse` from `next/og` (not `@vercel/og` directly). The export is bundled inside Next.js 16. No separate package install needed. The image function can run on either Node.js (default) or Edge runtime — for a purely static, data-only image with no `fs` calls, the default Node.js runtime with static optimization is fine; edge runtime is optional.

**Primary recommendation:** Implement all four work streams as independent tasks in a single wave: (1) metadata + OG image, (2) HeroPhoto preload, (3) ContactIconButton a11y fix, (4) Lighthouse CI setup. None depend on each other.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| OG image generation | Frontend Server (SSR/SSG) | — | `opengraph-image.tsx` is a Next.js Route Handler, statically generated at build time; no client involvement |
| Meta tag injection | Frontend Server (SSR) | — | `export const metadata` in `layout.tsx` is a Server Component export; Next.js injects `<head>` tags server-side |
| Focus ring display | Browser / Client | — | CSS `:focus-visible` is rendered by the browser; implementation is in component Tailwind classes |
| Keyboard tab order | Browser / Client | — | DOM tab order is a browser concern; implementation is `tabIndex` attributes in component markup |
| Image preloading (LCP) | Frontend Server (SSR) | Browser | `preload={true}` on `<Image>` causes Next.js to emit a `<link rel="preload">` in SSR output; browser executes the preload |
| Lighthouse CI assertions | CI/CD | — | Runs `@lhci/cli` as a GitHub Actions job post-build; no runtime application involvement |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next/og` (bundled in `next`) | 16.2.7 | `ImageResponse` for OG image generation | Built into Next.js 16; no separate install; uses Satori under the hood |
| `@lhci/cli` | 0.15.1 | Lighthouse CI assertions in GitHub Actions | Official Google Chrome Labs tool; de-facto standard for CI Lighthouse gating |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `next/image` (bundled) | 16.2.7 | LCP-optimized image with `preload` prop | Already in use in `HeroPhoto.tsx`; add `preload={true}` when `src` is defined |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `next/og` (bundled) | `@vercel/og` (separate install) | `next/og` re-exports `@vercel/og` internals; importing from `next/og` is the documented approach and avoids version conflicts |
| `@lhci/cli` in CI | `treosh/lighthouse-ci-action` (GitHub Action) | The action wraps `@lhci/cli` anyway; using the CLI directly gives more control over configuration and avoids GitHub Actions marketplace dependency |

**Installation:** No new production dependencies. `@lhci/cli` is a devDependency installed only in CI:

```bash
# In CI job (not in package.json devDependencies — installed per-run):
npx --no-install @lhci/cli@0.15.1 autorun
# OR add as devDependency:
yarn add --dev @lhci/cli
```

**Version verification:** [VERIFIED: npm registry] `@lhci/cli@0.15.1` — latest as of 2025-06-25. `next@16.2.7` already installed in project.

---

## Package Legitimacy Audit

> slopcheck was not available at research time (pip/pip3/pip3 not installed in this environment). All packages marked `[ASSUMED]` for slopcheck column. However, `@lhci/cli` was manually verified against authoritative sources (see notes).

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| `@lhci/cli` | npm | ~6 years (2019-09-09) | High (Google Chrome Labs official) | github.com/GoogleChrome/lighthouse-ci | [ASSUMED] | Approved — manually verified against official Google Chrome Labs GitHub organization; Apache-2.0 license; no postinstall script detected |

**Packages removed due to slopcheck [SLOP] verdict:** none

**Packages flagged as suspicious [SUS]:** none — `@lhci/cli` is a well-known Google-maintained tool. Manual verification is HIGH confidence. [CITED: github.com/GoogleChrome/lighthouse-ci]

*slopcheck was unavailable at research time. `@lhci/cli` is tagged `[ASSUMED]` for the slopcheck column but HIGH confidence based on manual verification of Google Chrome Labs GitHub authorship.*

---

## Architecture Patterns

### System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                     Build Time (SSG)                              │
│                                                                    │
│  src/app/opengraph-image.tsx                                      │
│    └─ ImageResponse (next/og)                                     │
│         ├─ heroContent.name / .title (static data)               │
│         └─ NEXT_PUBLIC_SITE_URL (env var)                        │
│              → /opengraph-image route (PNG, 1200×630)            │
│                                                                    │
│  src/app/layout.tsx                                               │
│    └─ export const metadata (Metadata)                           │
│         ├─ metadataBase: new URL(NEXT_PUBLIC_SITE_URL)           │
│         ├─ openGraph: { type, title, description, url }          │
│         └─ twitter: { card, title, description }                 │
│              → <head> tags (og:*, twitter:*) injected by Next.js │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                     Component Layer (SSR)                         │
│                                                                    │
│  HeroPhoto.tsx                                                    │
│    └─ <Image src={src} preload={true} alt={alt} />               │
│         → <link rel="preload"> in <head> (LCP optimization)      │
│                                                                    │
│  ContactIconButton.tsx                                            │
│    └─ <a aria-label tabIndex=0 focus-visible:ring-*>             │
│         └─ <Button tabIndex={-1}>                                │
│              (single focus stop; ring on outer <a>)              │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                     CI/CD (GitHub Actions)                        │
│                                                                    │
│  .github/workflows/ci.yml                                        │
│    └─ lhci job (after build job):                                │
│         ├─ yarn build && yarn start (port 3000)                  │
│         ├─ lhci collect (3 runs)                                 │
│         ├─ lhci assert (LCP < 2500ms, CLS < 0.1, perf >= 0.85)  │
│         └─ lhci upload (temporary-public-storage)               │
└──────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure

No new directories needed. New/modified files only:

```
src/app/
├── layout.tsx              # MODIFY: add metadataBase, openGraph, twitter
└── opengraph-image.tsx     # NEW: route-based OG image (1200×630)

src/components/atoms/
├── HeroPhoto.tsx           # MODIFY: add preload prop (not priority — deprecated)
└── ContactIconButton.tsx   # MODIFY: tabIndex={-1} on Button, focus ring on outer <a>

public/
└── andy-olarte.jpg         # NEW: real photo (Andy provides file)

.github/workflows/
└── ci.yml                  # MODIFY: add lhci job after build

lighthouserc.json           # NEW: LHCI thresholds configuration
```

### Pattern 1: Next.js 16 Route-Based OG Image

**What:** `opengraph-image.tsx` placed in `src/app/` is automatically served at `/opengraph-image` and linked in `<head>` as `og:image` when `metadataBase` is configured.
**When to use:** Any time you need programmatic OG images — preferred over static image files for portfolio sites because it stays in sync with content.

```tsx
// Source: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md
// src/app/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { heroContent } from "@/lib/heroContent";

export const alt = `${heroContent.name} — ${heroContent.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image(): ImageResponse {
  const siteUrl =
    process.env["NEXT_PUBLIC_SITE_URL"] ?? "andyolarte.dev";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#09090b",
        }}
      >
        {/* Left accent bar */}
        <div style={{ width: 8, height: "100%", backgroundColor: "#6366f1" }} />
        {/* Content area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 64,
            paddingRight: 64,
          }}
        >
          <p style={{ fontSize: 56, fontWeight: 700, color: "#ffffff", margin: 0 }}>
            {heroContent.name}
          </p>
          <p style={{ fontSize: 28, fontWeight: 400, color: "#a1a1aa", margin: "16px 0 0" }}>
            {heroContent.title}
          </p>
          <p style={{ fontSize: 20, fontWeight: 400, color: "#6366f1", margin: "12px 0 0" }}>
            {siteUrl}
          </p>
        </div>
      </div>
    ),
    size,
  );
}
```

**Key constraints for `ImageResponse` JSX:**
- ALL styles must be inline (`style={{}}`); Tailwind classes do NOT work inside `ImageResponse`
- Only `display: "flex"` and `display: "none"` are supported (Satori limitation); `display: "block"` causes layout issues
- No `<img>` from `next/image` — use plain `<img>` with base64 or URL src if embedding a photo
- No font loading required for v1.0 (system sans-serif fallback per D-06)
- Function must be synchronous (no `async`) if using only static data — matches the non-dynamic data pattern [VERIFIED: Next.js 16 docs]

### Pattern 2: Next.js 16 Metadata with metadataBase

**What:** `metadataBase` makes all relative URL metadata fields absolute. When `opengraph-image.tsx` exists in the same directory, Next.js automatically picks it up for `og:image` — no explicit `images` array needed.
**When to use:** Root `layout.tsx` for site-wide social sharing metadata.

```typescript
// Source: node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md
// src/app/layout.tsx
export const metadata: Metadata = {
  title: "Andy Olarte — Senior Frontend Engineer",
  description:
    "Portfolio of Andy Olarte, Senior Frontend / Full-Stack Engineer with 10+ years of experience building scalable web applications.",
  metadataBase: new URL(
    process.env["NEXT_PUBLIC_SITE_URL"] ?? "https://andyolarte.dev"
  ),
  openGraph: {
    type: "website",
    title: "Andy Olarte — Senior Frontend Engineer",
    description:
      "Portfolio of Andy Olarte, Senior Frontend / Full-Stack Engineer with 10+ years of experience building scalable web applications.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Andy Olarte — Senior Frontend Engineer",
    description:
      "Portfolio of Andy Olarte, Senior Frontend / Full-Stack Engineer with 10+ years of experience building scalable web applications.",
  },
};
```

**Important:** `og:image` and `twitter:image` are automatically resolved by Next.js from `opengraph-image.tsx` when `metadataBase` is set. The `images` array in `openGraph` and `twitter` objects is NOT needed and should be omitted to avoid duplication. [VERIFIED: Next.js 16 docs]

### Pattern 3: HeroPhoto with `preload` (NOT `priority`)

**What:** In Next.js 16, `priority` is deprecated. Use `preload={true}` to emit a `<link rel="preload">` for the LCP image.
**When to use:** Above-the-fold images that are the LCP candidate.

```tsx
// Source: node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md (v16.0.0 changelog)
// Current HeroPhoto.tsx — src branch only:
<Image src={src} alt={alt} fill preload={true} className="object-cover object-top" />
```

**Note:** `priority` prop is still accepted (backward-compat, TypeScript type still present as `priority?: boolean`) but generates a deprecation warning in Next.js 16 build output. Use `preload={true}` directly. [VERIFIED: Next.js 16 Image docs changelog entry `v16.0.0`]

### Pattern 4: ContactIconButton — Single Focus Stop

**What:** The current `ContactIconButton` creates a double focus stop: the outer `<a>` is focusable by default, and the inner `Button` (Base UI primitive) is also focusable. Resolution: `tabIndex={-1}` on the inner `Button`; focus-visible ring on the outer `<a>`.

```tsx
// Fixed ContactIconButton.tsx
export default function ContactIconButton({
  href,
  ariaLabel,
  icon,
}: ContactIconButtonProps): React.ReactNode {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-full"
    >
      <Button variant="outline" size="icon" className="h-11 w-11 rounded-full" tabIndex={-1}>
        {icon}
      </Button>
    </a>
  );
}
```

**Test impact:** The existing `ContactIconButton.test.tsx` tests check `container.firstChild` (the `<a>`) — those pass unchanged. If a test is added for `tabIndex={-1}` on the inner button, it needs to query the `Button` element specifically.

### Pattern 5: lighthouserc.json — Temporary Storage

**What:** LHCI configuration with assertions and temporary public storage (no self-hosted server).

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "yarn start",
      "startServerReadyPattern": "Ready on",
      "url": ["http://localhost:3000"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "categories:performance": ["error", { "minScore": 0.85 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

**CI job addition (after build step):**

```yaml
# In .github/workflows/ci.yml — new job
lighthouse:
  needs: ci    # Wait for the existing ci job (which runs build)
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 20
    - name: Enable Corepack
      run: corepack enable
    - name: Install dependencies
      run: yarn install --immutable
    - name: Build
      run: yarn build
    - name: Install Lighthouse CI
      run: yarn global add @lhci/cli@0.15.1
    - name: Run Lighthouse CI
      run: lhci autorun
      env:
        LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

**Alternative (simpler, no separate job — add steps at end of existing ci job):**

```yaml
    - name: Install Lighthouse CI
      run: yarn global add @lhci/cli@0.15.1
    - name: Run Lighthouse CI
      run: lhci autorun
```

> The simpler approach (steps in existing job) avoids the need for `LHCI_GITHUB_APP_TOKEN` secret for basic assertion usage. The `upload.target: "temporary-public-storage"` does not require authentication. [ASSUMED — based on LHCI documentation patterns; exact CI structure subject to planner discretion per D-12/D-13]

### Anti-Patterns to Avoid

- **Using `priority` instead of `preload` on `next/image`:** Deprecated in Next.js 16.0.0. Will still work but generates deprecation warnings in build output and should be avoided in new code.
- **Adding `images` array to `openGraph` / `twitter` metadata when `opengraph-image.tsx` exists:** Next.js auto-resolves the image from the route file when `metadataBase` is set. Adding `images` explicitly may cause duplicate `og:image` tags.
- **Using Tailwind classes inside `ImageResponse` JSX:** Satori (the rendering engine) does not process Tailwind. All styles must be inline objects.
- **Using `display: "block"` in `ImageResponse` JSX:** Only `flex` and `none` are supported by Satori.
- **Running LHCI against `yarn dev` instead of `yarn start`:** Development server has unoptimized builds that produce artificially low Lighthouse scores. LHCI must run against the production build (`yarn build && yarn start`).
- **Importing from `@vercel/og` directly:** Import from `next/og` instead — it re-exports the same API and avoids version conflicts.
- **Marking `CompanyAvatar` for accessibility fix:** It already has `aria-hidden="true"` — it is deliberately decorative. No fix needed.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| OG image generation | Custom PNG generation, canvas API, puppeteer screenshot | `ImageResponse` from `next/og` | Satori renders JSX to PNG with full CSS subset; edge-compatible; statically cached at build time |
| Meta tag injection | Manual `<meta>` tags in `<head>` component | `export const metadata` from `layout.tsx` | Next.js 16 `Metadata` API handles deduplication, inheritance, and proper `<head>` injection — manual `<meta>` tags in server components are deprecated and may conflict |
| Lighthouse performance measurement | Custom performance monitoring, manual scripts | `@lhci/cli` | Handles server start, multi-run averaging, assertion format, and CI reporting in a single command |
| Focus ring styling | Custom CSS `:focus` overrides | Tailwind `focus-visible:ring-*` + shadcn Button CVA base | `focus-visible` only triggers on keyboard navigation (not mouse clicks) — the correct modern standard |

**Key insight:** The three capabilities in this phase (OG images, metadata, LHCI) are each well-solved by the standard Next.js/Google toolchain. Custom solutions add maintenance burden with no benefit.

---

## Common Pitfalls

### Pitfall 1: `priority` Deprecated in Next.js 16

**What goes wrong:** Adding `priority` to `<Image>` compiles without TypeScript errors (the type still accepts it) but generates a deprecation warning in the build output. Future Next.js versions may remove it entirely.
**Why it happens:** Training data and many tutorials show `priority={true}` as the canonical LCP optimization for `next/image`. The deprecation is a breaking change in Next.js 16.
**How to avoid:** Use `preload={true}` instead. [VERIFIED: Next.js 16 Image changelog `v16.0.0`]
**Warning signs:** Build output line mentioning "priority is deprecated" for `next/image`.

### Pitfall 2: Tailwind Classes Inside ImageResponse JSX

**What goes wrong:** `ImageResponse` uses Satori, which is not a browser — it has no Tailwind stylesheet, no CSS variables, and no class-based styling. All class names are silently ignored.
**Why it happens:** Natural instinct to write `className="text-white text-4xl"` inside the JSX tree.
**How to avoid:** ALL styles in `ImageResponse` JSX must use the `style` prop with camelCase CSS properties and string/number values. No `className`, no CSS variables (e.g., `var(--primary)` won't resolve — use hex literals `#6366f1`).
**Warning signs:** OG image renders with wrong colors, wrong font sizes, or no layout.

### Pitfall 3: metadataBase Causes Build Errors if NEXT_PUBLIC_SITE_URL is Missing

**What goes wrong:** If `NEXT_PUBLIC_SITE_URL` is not set and the fallback is not a valid URL string, `new URL(undefined)` throws at build time.
**Why it happens:** `new URL()` requires a valid URL string.
**How to avoid:** Always provide a string fallback: `new URL(process.env["NEXT_PUBLIC_SITE_URL"] ?? "https://andyolarte.dev")`. [VERIFIED: Next.js 16 docs — "Using a relative path in a URL-based metadata field without configuring a metadataBase will cause a build error"]
**Warning signs:** Build failure with "TypeError: Invalid URL" in the metadata generation step.

### Pitfall 4: LHCI Running Against Development Server

**What goes wrong:** Running `lhci autorun` with `startServerCommand: "yarn dev"` produces artificially low scores because the dev build is unminified, unoptimized, and includes HMR overhead.
**Why it happens:** `yarn dev` is what developers run locally, so it seems natural.
**How to avoid:** `lighthouserc.json` `startServerCommand` must be `"yarn start"` — requires that the build job runs first. In CI, build must complete before the lhci job starts.
**Warning signs:** Performance score of 50-60 on a well-optimized site; LCP values 3-5× higher than expected.

### Pitfall 5: Double Focus Stop on ContactIconButton

**What goes wrong:** Keyboard users tab through the page and each `ContactIconButton` gets TWO focus stops — once on the outer `<a>` and once on the inner `Button`. This violates WCAG 2.1 Success Criterion 2.4.3 (Focus Order).
**Why it happens:** Both `<a>` and Base UI `Button` are natively focusable. The `aria-label` is on the outer `<a>`, which is the right element to keep in tab order.
**How to avoid:** Add `tabIndex={-1}` to the inner `Button` so it is skipped during keyboard navigation. Apply the focus ring to the outer `<a>` with Tailwind `focus-visible:` classes. [VERIFIED: codebase inspection of ContactIconButton.tsx]
**Warning signs:** Two consecutive tab stops with the same visual label during keyboard navigation.

### Pitfall 6: opengraph-image.tsx Runtime vs Static Optimization

**What goes wrong:** Adding `export const runtime = "edge"` to `opengraph-image.tsx` when importing from modules that use Node.js APIs (like `fs`) causes an edge-incompatible error.
**Why it happens:** Edge runtime does not support `node:fs` or `node:path`.
**How to avoid:** Since `heroContent.ts` is a pure static import (no `fs` calls), either Node.js (default) or Edge runtime works. For v1.0 with no external data or `fs` calls, omit `export const runtime` to use the default Node.js runtime with static optimization (generated at build time). [VERIFIED: Next.js 16 opengraph-image docs]
**Warning signs:** Build error mentioning "Module not found" for `fs` or `path` in the edge runtime context.

---

## Code Examples

### OG Image Full Implementation

```tsx
// Source: Next.js 16 docs — node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md
// src/app/opengraph-image.tsx

import { ImageResponse } from "next/og";
import { heroContent } from "@/lib/heroContent";

export const alt = `${heroContent.name} — ${heroContent.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image(): ImageResponse {
  const siteUrl = process.env["NEXT_PUBLIC_SITE_URL"] ?? "andyolarte.dev";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#09090b",
        }}
      >
        <div style={{ width: 8, backgroundColor: "#6366f1", flexShrink: 0 }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 64,
            paddingRight: 64,
            flex: 1,
          }}
        >
          <p style={{ fontSize: 56, fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.1 }}>
            {heroContent.name}
          </p>
          <p style={{ fontSize: 28, fontWeight: 400, color: "#a1a1aa", margin: 0, marginTop: 16, lineHeight: 1.3 }}>
            {heroContent.title}
          </p>
          <p style={{ fontSize: 20, fontWeight: 400, color: "#6366f1", margin: 0, marginTop: 12, lineHeight: 1.5 }}>
            {siteUrl}
          </p>
        </div>
      </div>
    ),
    size,
  );
}
```

### HeroPhoto with preload (Next.js 16)

```tsx
// Source: Next.js 16 Image API — node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md
// In HeroPhoto.tsx — the src-present branch only:
<Image src={src} alt={alt} fill preload={true} className="object-cover object-top" />
```

### metadata Extension in layout.tsx

```typescript
// Source: Next.js 16 generate-metadata API — node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md
export const metadata: Metadata = {
  title: "Andy Olarte — Senior Frontend Engineer",
  description:
    "Portfolio of Andy Olarte, Senior Frontend / Full-Stack Engineer with 10+ years of experience building scalable web applications.",
  metadataBase: new URL(
    process.env["NEXT_PUBLIC_SITE_URL"] ?? "https://andyolarte.dev"
  ),
  openGraph: {
    type: "website",
    title: "Andy Olarte — Senior Frontend Engineer",
    description:
      "Portfolio of Andy Olarte, Senior Frontend / Full-Stack Engineer with 10+ years of experience building scalable web applications.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Andy Olarte — Senior Frontend Engineer",
    description:
      "Portfolio of Andy Olarte, Senior Frontend / Full-Stack Engineer with 10+ years of experience building scalable web applications.",
  },
};
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `priority` prop on `next/image` | `preload` prop on `next/image` | Next.js 16.0.0 | Must use `preload={true}` — `priority` still accepted but deprecated |
| `@vercel/og` separate install | `next/og` (bundled) | Next.js 13.3+ | Import from `next/og`, not `@vercel/og` — no separate install needed |
| `export const runtime = "edge"` required for OG images | Optional — default Node.js runtime works for static data | Next.js 13.3+ | Edge runtime only needed if you want sub-50ms cold start globally; for a portfolio, Node.js static optimization is fine |

**Deprecated/outdated:**
- `priority` prop on `next/image`: Still compiles in Next.js 16, but deprecated. Replaced by `preload`.
- Direct `<meta>` tags in Server Components `<head>`: Deprecated in App Router — use `export const metadata` object instead. (Already correct in this project.)

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | LHCI `lhci autorun` picks up `lighthouserc.json` automatically from project root | Architecture Patterns (Pattern 5) | Low risk — this is standard LHCI behavior per official docs, but file location and naming `lighthouserc.json` vs `.lighthouserc.json` may vary |
| A2 | `temporary-public-storage` upload target works without authentication in GitHub Actions | Pattern 5 (CI job) | Medium risk — `temporary-public-storage` is a Vercel-hosted server; if it is down or requires a token, `lhci upload` fails but `lhci assert` (the blocking step) still passes |
| A3 | The inner Base UI `Button` receives `tabIndex` as a forwarded prop | ContactIconButton fix | Low risk — Base UI `ButtonPrimitive` passes unknown props to the underlying element; if `tabIndex` is not forwarded, use `data-tabindex` or a different solution |
| A4 | Adding `preload={true}` to `HeroPhoto` when `src` is present does NOT break the test that checks `getByAltText` | Code patterns | Very low risk — `preload` is a render hint, not a structural change |

**If this table is empty:** Not empty — A1-A4 are flagged for planner awareness.

---

## Open Questions (RESOLVED)

1. **Will `public/andy-olarte.jpg` exist when Phase 5 executes?**
   - RESOLVED: Plan 03 uses a checkpoint:human-action gate; preload ships regardless of photo availability
   - What we know: D-04 says Andy provides the file. The HeroPhoto placeholder path (`src` absent) works without it.
   - What's unclear: If the photo is not provided before merge, the `preload` change in HeroPhoto has no effect (no `src` branch reached). The OG image does NOT use the real photo (D-06 — text/gradient design only).
   - Recommendation: Planner should create a task that is gated on human action: "Andy places `public/andy-olarte.jpg`". The `HeroPhoto` `preload` change is safe to ship regardless — it only fires when `src` is defined.

2. **Should LHCI run as a separate job or as additional steps in the existing `ci` job?**
   - RESOLVED: LHCI steps appended to existing ci job after E2E tests (avoids redundant build)
   - What we know: The `ci` job currently runs end-to-end and takes significant time. Adding LHCI steps extends it. A separate job could run in parallel with E2E but needs its own build step.
   - What's unclear: Repository secrets availability (`LHCI_GITHUB_APP_TOKEN` is optional for basic usage).
   - Recommendation: Planner discretion (Claude's Discretion per context). The simplest approach is appending LHCI steps to the existing `ci` job after the E2E step — this avoids a redundant build.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build, tests, LHCI | Yes | v24.16.0 | — |
| Yarn 4 | Package management | Yes | 4.16.0 | — |
| `next/og` | OG image generation | Yes (bundled in next@16.2.7) | Bundled | — |
| `@lhci/cli` | Lighthouse CI | Not in project | — | Install in CI (`yarn global add @lhci/cli@0.15.1`) or add as devDependency |
| Lighthouse browser | LHCI collect step | No (not in WSL) | — | Installed by LHCI in CI via `chromium` headless |
| `public/andy-olarte.jpg` | HeroPhoto real photo (LCP) | Not present yet | — | Placeholder (initials div) renders without it; `preload` is a no-op without `src` |

**Missing dependencies with no fallback:**
- None that block the phase — all missing items have either a CI install path or a graceful degradation.

**Missing dependencies with fallback:**
- `@lhci/cli`: Not in `node_modules`. Install via `yarn global add` in CI step, or add to `devDependencies`. The latter is preferred for reproducibility.
- `public/andy-olarte.jpg`: Photo not provided yet. HeroPhoto shows initials placeholder. Phase 5 ships the `preload` change regardless.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Jest 30 + React Testing Library 16 (unit); Playwright 1.60 (E2E) |
| Config file | `jest.config.mjs` / `playwright.config.ts` |
| Quick run command | `yarn test` |
| Full suite command | `yarn test:coverage && yarn test:e2e` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SEO-01 | OG meta tags present in page `<head>` | E2E (Playwright) | `yarn test:e2e` | No — Wave 0 gap: add OG tag assertions to `e2e/home.spec.ts` |
| SEO-01 | `opengraph-image.tsx` returns 200 with `Content-Type: image/png` | E2E (Playwright) | `yarn test:e2e` | No — Wave 0 gap: add route test |
| SEO-02 | `NavLink` has visible focus ring on keyboard Tab | E2E (Playwright) | `yarn test:e2e` | No — Wave 0 gap: add keyboard nav test |
| SEO-02 | `CTAButton` has visible focus ring | E2E (Playwright) | `yarn test:e2e` | No — Wave 0 gap |
| SEO-02 | `ContactIconButton` single focus stop (Tab lands on `<a>`) | unit | `yarn test` | No — Wave 0 gap: add `tabIndex` assertion to `ContactIconButton.test.tsx` |
| SEO-03 | `HeroPhoto` renders `alt` when `src` present | unit | `yarn test` | Yes — `HeroPhoto.test.tsx` has this case |
| SEO-03 | `CompanyAvatar` has `aria-hidden="true"` | unit | `yarn test` | Yes — `CompanyAvatar.tsx` has it; verify test covers it |
| LAYOUT-05 | LCP < 2500ms, CLS < 0.1 | Lighthouse CI (CI gate) | `lhci autorun` | No — added in Lighthouse CI setup task |
| LAYOUT-05 | `HeroPhoto` emits `<link rel="preload">` when `src` present | unit | `yarn test` | No — Wave 0 gap: add to `HeroPhoto.test.tsx` |

**Test coverage impact:** `src/app/opengraph-image.tsx` is excluded from unit coverage (`!src/app/**` rule in `jest.config.mjs`). The OG image route is covered by E2E only.

**100% coverage requirement:** Modifying `ContactIconButton.tsx` and `HeroPhoto.tsx` means their test files must be updated to maintain 100% coverage. No new branches are added to `HeroPhoto` (just adding a prop to an existing branch). `ContactIconButton` adds `tabIndex={-1}` to the inner `Button` and focus ring classes to the outer `<a>` — existing tests still pass; no new branches created. A new test asserting `tabIndex` should be added to reach behavior coverage.

**Modification to `layout.tsx`:** Excluded from unit tests (`!src/app/**`). The metadata change is covered by the E2E test that already checks the page title. OG tag E2E tests are a Wave 0 gap.

### Sampling Rate

- **Per task commit:** `yarn test:coverage` (unit only, fast)
- **Per wave merge:** `yarn test:coverage && yarn test:e2e`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `e2e/home.spec.ts` — add `og:title`, `og:description`, `og:image` meta tag assertions (SEO-01)
- [ ] `e2e/home.spec.ts` — add `/opengraph-image` route returns 200 test (SEO-01)
- [ ] `e2e/home.spec.ts` — add keyboard Tab navigation test for NavLink and CTAButton focus rings (SEO-02)
- [ ] `src/components/atoms/ContactIconButton.test.tsx` — add test: inner `Button` has `tabIndex={-1}` (SEO-02)
- [ ] `src/components/atoms/HeroPhoto.test.tsx` — add test: when `src` is present, rendered `<img>` has no `priority` attribute; optionally verify `preload` behavior (LAYOUT-05)

---

## Security Domain

> `security_enforcement` not set to `false` in config — section included.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | Not applicable — no auth in this phase |
| V3 Session Management | No | Not applicable |
| V4 Access Control | No | Not applicable |
| V5 Input Validation | Partial | `NEXT_PUBLIC_SITE_URL` env var used in `new URL()` — must use `?? "https://andyolarte.dev"` fallback to prevent `Invalid URL` build errors |
| V6 Cryptography | No | Not applicable |
| V13 API (OG route) | Low | `opengraph-image.tsx` serves static PNG — no user input, no data exposure risk |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| `NEXT_PUBLIC_SITE_URL` injection | Tampering | Env var is public (NEXT_PUBLIC_ prefix — baked at build time, not runtime). Not a user-supplied value. Safe. |
| OG image exposing internal data | Information Disclosure | OG image only uses `heroContent.name` and `heroContent.title` — static strings already public on the page. No risk. |
| `rel="noopener noreferrer"` on external links | Tampering (tabnapping) | Already present in `ContactIconButton` — verified. |

---

## Project Constraints (from CLAUDE.md)

| Directive | Compliance Impact in Phase 5 |
|-----------|------------------------------|
| No `any` | `opengraph-image.tsx` must not use `any`; all types explicit |
| 100% test coverage | Modifying `HeroPhoto.tsx` and `ContactIconButton.tsx` requires updating their tests; `src/app/opengraph-image.tsx` is excluded from unit coverage (covered by E2E) |
| Explicit return types on exported functions | `opengraph-image.tsx` default export must declare `): ImageResponse` |
| `import type` for type-only imports | Any type imports in new/modified files must use `import type` |
| No `Co-Authored-By: Claude` in commits | Commit-msg hook enforced |
| Conventional commits | `feat:`, `fix:`, `chore:` prefixes required |
| Read `node_modules/next/dist/docs/` before writing Next.js code | Done — `priority` deprecation discovered; `preload` is correct |
| Yarn 4 | Use `yarn add --dev @lhci/cli` not `npm install` |

---

## Sources

### Primary (HIGH confidence)

- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md` — opengraph-image.tsx route file convention, `alt`/`size`/`contentType` exports, `ImageResponse` usage
- `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md` — `preload` prop (replaces `priority` in v16.0.0), LCP optimization guidance
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md` — `metadataBase`, `openGraph`, `twitter` metadata fields
- `node_modules/next/dist/lib/metadata/types/metadata-interface.d.ts` — verified `openGraph`, `twitter`, `metadataBase` field types
- `node_modules/next/dist/lib/metadata/types/opengraph-types.d.ts` — verified `OpenGraphWebsite` type with `type: 'website'`
- `node_modules/next/dist/lib/metadata/types/twitter-types.d.ts` — verified `twitter.card: 'summary_large_image'`
- `node_modules/next/dist/client/image-component.d.ts` — confirmed `preload?: boolean` and `priority?: boolean` both in type (backward compat)
- `node_modules/next/dist/compiled/@vercel/og/index.edge.d.ts` — confirmed `ImageResponse` constructor signature
- `node_modules/next/dist/server/og/image-response.d.ts` — confirmed `next/og` export
- `src/components/atoms/ContactIconButton.tsx` — confirmed double-focus-stop issue
- `src/components/atoms/CompanyAvatar.tsx` — confirmed `aria-hidden="true"` already present
- `src/lib/contactContent.ts` — confirmed actual aria-label values differ from UI-SPEC; actual values are "Send Andy an email", "Andy's GitHub profile", "Andy's LinkedIn profile"
- `src/lib/heroContent.ts` — confirmed static data structure for OG image
- `src/app/globals.css` — confirmed `--ring: #6366f1`, `--primary: #6366f1` token values

### Secondary (MEDIUM confidence)

- `npm view @lhci/cli` registry data — confirmed package name, version 0.15.1, `git+https://github.com/GoogleChrome/lighthouse-ci.git` repo, Apache-2.0 license, no postinstall script
- `jest.config.mjs` — confirmed `!src/app/**` exclusion from unit coverage (OG image file is automatically excluded)

### Tertiary (LOW confidence)

- LHCI `lighthouserc.json` config format (temporary-public-storage) — [ASSUMED] based on LHCI documentation patterns; exact configuration validated at implementation time

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Next.js 16 docs verified in `node_modules`; `@lhci/cli` verified against npm registry and GitHub
- Architecture: HIGH — all patterns verified against official Next.js 16 source docs
- Pitfalls: HIGH — `priority` deprecation verified directly in `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md` v16.0.0 changelog; double-focus-stop verified by codebase inspection
- LHCI configuration: MEDIUM — standard configuration format; exact CI job structure is planner discretion

**Research date:** 2026-06-06
**Valid until:** 2026-07-06 (Next.js moves fast; verify Image API if any `next` update ships before then)
