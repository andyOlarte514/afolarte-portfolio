# Phase 5: Polish - Pattern Map

**Mapped:** 2026-06-06
**Files analyzed:** 6 new/modified files
**Analogs found:** 5 / 6 (ci.yml has partial analog only)

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/app/layout.tsx` | config/metadata | request-response | `src/app/layout.tsx` itself (current state) | self-extension |
| `src/app/opengraph-image.tsx` | route handler | request-response | `src/app/layout.tsx` (metadata export pattern) | partial-match |
| `src/components/atoms/HeroPhoto.tsx` | atom/component | request-response | `src/components/atoms/HeroPhoto.tsx` itself | self-extension |
| `src/components/atoms/ContactIconButton.tsx` | atom/component | request-response | `src/components/atoms/NavLink.tsx` (focus-ring pattern) | role-match |
| `.github/workflows/ci.yml` | CI config | batch | `.github/workflows/ci.yml` itself (current state) | self-extension |
| `lighthouserc.json` | CI config | batch | none | no analog |

---

## Pattern Assignments

### `src/app/layout.tsx` (config/metadata, request-response)

**Analog:** `src/app/layout.tsx` (current file — self-extension)

**Current imports pattern** (lines 1-6):
```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "@/components/organisms/Navbar";

import "./globals.css";
```

**Current metadata pattern** (lines 18-22):
```typescript
export const metadata: Metadata = {
  title: "Andy Olarte — Senior Frontend Engineer",
  description:
    "Portfolio of Andy Olarte, Senior Frontend / Full-Stack Engineer with 10+ years of experience building scalable web applications.",
};
```

**Target metadata pattern** — extend lines 18-22 to add `metadataBase`, `openGraph`, and `twitter` fields. The `images` array must NOT be added to `openGraph` or `twitter` — Next.js auto-resolves the image from `opengraph-image.tsx` when `metadataBase` is set:
```typescript
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

**Key constraint:** `new URL(undefined)` throws at build time. Always use the `?? "https://andyolarte.dev"` string fallback.

**No layout component changes** — the JSX of `RootLayout` is untouched. This is a metadata-only change.

---

### `src/app/opengraph-image.tsx` (route handler, request-response) — NEW FILE

**Analog:** `src/app/layout.tsx` (same directory convention; closest structural analog for App Router root-level exports). No existing `opengraph-image.tsx` in the project.

**Imports pattern** — copy from `src/app/layout.tsx` for the `import type` convention, then add `next/og` and the data import:
```typescript
import { ImageResponse } from "next/og";
import { heroContent } from "@/lib/heroContent";
```

**Required named exports** — three named exports are required by Next.js 16 for this file convention:
```typescript
export const alt = `${heroContent.name} — ${heroContent.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
```

**Core route handler pattern** — explicit return type `ImageResponse` required (project rule: all exported functions must declare return type):
```typescript
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
        {/* Left indigo accent bar — 8px, consistent with site accent color */}
        <div style={{ width: 8, backgroundColor: "#6366f1", flexShrink: 0 }} />
        {/* Content column */}
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

**Critical Satori constraints (NO exceptions):**
- All styles must be inline `style={{}}` objects — `className` / Tailwind classes are silently ignored
- Only `display: "flex"` and `display: "none"` — `display: "block"` breaks Satori layout
- No CSS variables (e.g., `var(--primary)` does not resolve) — use hex literals: `#6366f1` (indigo-500 from `globals.css`)
- No `import` from `@vercel/og` — import `ImageResponse` from `"next/og"` (bundled in Next.js 16)
- Function must be synchronous — all data is static (`heroContent` is a `const`)
- Do NOT add `export const runtime = "edge"` — default Node.js runtime uses static optimization at build time

**Test coverage note:** `src/app/**` is excluded from Jest unit coverage (see `jest.config.mjs` `!src/app/**` rule). OG image coverage is provided by E2E tests in `e2e/home.spec.ts`. The planner must add E2E assertions for:
1. `/opengraph-image` route returns HTTP 200 with `Content-Type: image/png`
2. `og:title`, `og:description`, `og:image` meta tags present in page `<head>`

---

### `src/components/atoms/HeroPhoto.tsx` (atom/component, request-response)

**Analog:** `src/components/atoms/HeroPhoto.tsx` itself (self-extension — one prop addition to existing `src`-present branch)

**Current file** (lines 1-25 — full file, 25 lines):
```typescript
import type React from "react";

import Image from "next/image";

interface HeroPhotoProps {
  src?: string | undefined;
  alt: string;
  initials: string;
}

export default function HeroPhoto({ src, alt, initials }: HeroPhotoProps): React.ReactNode {
  if (!src) {
    return (
      <div className="relative aspect-square w-full max-w-[320px] rounded-2xl bg-primary ring-2 ring-primary ring-offset-2 ring-offset-background flex items-center justify-center">
        <span className="text-4xl font-bold text-primary-foreground">{initials}</span>
      </div>
    );
  }

  return (
    <div className="relative aspect-square w-full max-w-[320px] rounded-2xl ring-2 ring-primary ring-offset-2 ring-offset-background overflow-hidden">
      <Image src={src} alt={alt} fill className="object-cover object-top" />
    </div>
  );
}
```

**Target change** — single prop addition on line 22. Change only the `<Image>` tag in the `src`-present branch:
```tsx
{/* BEFORE: */}
<Image src={src} alt={alt} fill className="object-cover object-top" />

{/* AFTER: */}
<Image src={src} alt={alt} fill preload={true} className="object-cover object-top" />
```

**Critical:** Use `preload={true}`, NOT `priority={true}`. The `priority` prop is deprecated in Next.js 16.0.0. Both compile (backward-compat TypeScript types), but `priority` generates deprecation warnings in build output. `preload` emits a `<link rel="preload">` in SSR output for LCP optimization.

**Test impact:** The placeholder branch (`!src`) is unchanged. The `src`-present branch gains a prop that is a render hint — it does not alter the DOM structure. The existing test at `src/components/atoms/HeroPhoto.test.tsx` line 12 (`getByAltText("Andy Olarte")`) still passes. A new test should be added to verify the `src`-present `<img>` does NOT have a `priority` attribute (catching the deprecated API). No new branches are introduced — 100% coverage is maintained by the existing tests plus the new assertion.

---

### `src/components/atoms/ContactIconButton.tsx` (atom/component, request-response)

**Analog:** `src/components/atoms/NavLink.tsx` — exact pattern for `focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2` on an `<a>` element (lines 29-30 of NavLink.tsx)

**NavLink focus-ring pattern to copy** (lines 27-30 of `src/components/atoms/NavLink.tsx`):
```tsx
className={[
  "relative py-1 text-base transition-colors",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
  // ...
```

**Current ContactIconButton** (lines 16-20 — the JSX):
```tsx
<a href={href} aria-label={ariaLabel} target="_blank" rel="noopener noreferrer">
  <Button variant="outline" size="icon" className="h-11 w-11 rounded-full">
    {icon}
  </Button>
</a>
```

**Target change** — two modifications:
1. Add `focus-visible:*` classes and `rounded-full` to outer `<a>` (the focus stop)
2. Add `tabIndex={-1}` to inner `<Button>` (removes it from tab order)

```tsx
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
```

**Why this fixes WCAG 2.1 SC 2.4.3:** Both `<a>` and Base UI `Button` are natively focusable. This creates two consecutive tab stops for a single interactive control. `tabIndex={-1}` on the inner `Button` removes it from tab order; the outer `<a>` (which carries `aria-label`) remains the single focus stop with a visible ring.

**Test impact:** The existing 6 tests in `src/components/atoms/ContactIconButton.test.tsx` all query `container.firstChild` (the `<a>`) — they pass unchanged. A new test must be added to cover the `tabIndex={-1}` behavior (query the `<button>` element inside the anchor and assert `tabIndex === -1`). The test pattern to follow:
```typescript
it("inner button has tabIndex -1 to prevent double focus stop", () => {
  const { container } = render(
    <ContactIconButton href="mailto:test@test.com" ariaLabel="Test label" icon={testIcon} />,
  );
  const anchor = container.firstChild as HTMLAnchorElement;
  const button = anchor.querySelector("button");
  expect(button).toHaveAttribute("tabindex", "-1");
});
```

---

### `.github/workflows/ci.yml` (CI config, batch)

**Analog:** `.github/workflows/ci.yml` itself (current state — self-extension)

**Current ci job structure** (lines 9-46 — full file):
```yaml
jobs:
  ci:
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
      - name: Type check
        run: yarn tsc --noEmit
      - name: Lint
        run: yarn lint
      - name: Format check
        run: yarn format:check
      - name: Unit tests (100% coverage)
        run: yarn test:coverage
      - name: Build
        run: yarn build
      - name: Install Playwright browsers
        run: yarn playwright install --with-deps chromium
      - name: E2E tests
        run: yarn test:e2e
```

**Target change** — append LHCI steps to the existing `ci` job, after the E2E tests step. This avoids a redundant build (the build already ran at line 38). LHCI must run against `yarn start` (production build), not `yarn dev`:
```yaml
      - name: Install Lighthouse CI
        run: yarn global add @lhci/cli@0.15.1
      - name: Run Lighthouse CI
        run: lhci autorun
```

**Why append to existing job rather than separate job:** A separate job would need its own `yarn build` step (duplicating ~2 minutes of CI time). The existing job already builds, so LHCI can `yarn start` directly from the artifact. `lhci autorun` picks up `lighthouserc.json` from the project root automatically.

**Anti-pattern to avoid:** Do NOT add `LHCI_GITHUB_APP_TOKEN` secret if not configured — the `upload.target: "temporary-public-storage"` does not require authentication. The step works without the secret for v1.0.

---

### `lighthouserc.json` (CI config, batch) — NEW FILE

**No analog found** — no existing `lighthouserc.json` in the project. Pattern comes from RESEARCH.md documentation.

**Full file content:**
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

**Key constraint:** `startServerCommand` must be `"yarn start"` (production), NOT `"yarn dev"`. Running against the dev server produces artificially low Lighthouse scores (50–60 range vs expected 90+) due to unminified builds and HMR overhead.

---

## Shared Patterns

### Focus-Visible Ring (Keyboard Accessibility)
**Source:** `src/components/atoms/NavLink.tsx` lines 29-30
**Apply to:** `ContactIconButton.tsx` outer `<a>` element
```tsx
"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
```
The `focus-visible:outline-none` suppresses the browser default outline only when replacing it with a custom ring — never suppress without replacement. Add `rounded-full` to the `<a>` on `ContactIconButton` to match the circular button shape.

### Explicit Return Types (Project Rule)
**Source:** All existing atoms (e.g., `HeroPhoto.tsx` line 11, `ContactIconButton.tsx` line 13)
**Apply to:** `opengraph-image.tsx` default export
```typescript
export default function Image(): ImageResponse { ... }
export default function HeroPhoto(...): React.ReactNode { ... }
```
All exported functions must declare their return type explicitly — enforced by project rules.

### `import type` Convention (Project Rule)
**Source:** `src/components/atoms/HeroPhoto.tsx` line 1, `src/components/atoms/ContactIconButton.tsx` line 1
**Apply to:** Any type-only imports in new/modified files
```typescript
import type React from "react";
import type { Metadata } from "next";
```

### `process.env` Bracket Notation (TypeScript noPropertyAccessFromIndexSignature)
**Source:** RESEARCH.md patterns; project tsconfig has `noPropertyAccessFromIndexSignature: true`
**Apply to:** `opengraph-image.tsx` and `layout.tsx` env var access
```typescript
// CORRECT — bracket notation required by tsconfig
process.env["NEXT_PUBLIC_SITE_URL"] ?? "https://andyolarte.dev"

// WRONG — dot notation blocked by noPropertyAccessFromIndexSignature
process.env.NEXT_PUBLIC_SITE_URL
```

### Jest Test Structure (100% Coverage)
**Source:** `src/components/atoms/HeroPhoto.test.tsx` and `src/components/atoms/ContactIconButton.test.tsx`
**Apply to:** Updated tests for both atoms
```typescript
import { render, screen } from "@testing-library/react";
import ComponentName from "./ComponentName";

describe("ComponentName", () => {
  it("behavior under condition", () => {
    // Arrange + Act
    render(<ComponentName ...props />);
    // Assert behavior visible to the user
    expect(element).toHaveAttribute("...");
  });
});
```
Never test implementation details — test behavior visible to the user (attribute values, presence in DOM). Mock only at system boundaries.

### E2E Test Structure
**Source:** `e2e/home.spec.ts` (full file — Playwright test patterns)
**Apply to:** New OG/SEO assertions in `e2e/home.spec.ts`
```typescript
test.describe("OG / Social metadata", () => {
  test("og:title meta tag is present", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "Andy Olarte — Senior Frontend Engineer",
    );
  });
});
```

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `lighthouserc.json` | CI config | batch | No LHCI configuration exists in the project; pattern comes from RESEARCH.md documentation |
| `src/app/opengraph-image.tsx` | route handler | request-response | No existing `opengraph-image.tsx` route in the project; `src/app/` contains only `favicon.ico`, `globals.css`, `layout.tsx`, `page.tsx` |

Both files have complete patterns defined in RESEARCH.md (code examples verified against Next.js 16 docs and LHCI docs). The planner should use RESEARCH.md Patterns 1 and 5 as the implementation reference.

---

## Metadata

**Analog search scope:** `src/app/`, `src/components/atoms/`, `src/components/organisms/`, `src/lib/`, `e2e/`, `.github/workflows/`
**Files scanned:** 9 source files read (layout.tsx, HeroPhoto.tsx, ContactIconButton.tsx, ci.yml, HeroPhoto.test.tsx, ContactIconButton.test.tsx, heroContent.ts, NavLink.tsx, home.spec.ts)
**Pattern extraction date:** 2026-06-06
