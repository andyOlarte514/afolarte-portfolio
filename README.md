# Andy Olarte — Portfolio

Personal portfolio site for **Andy Francisco Olarte Cardona**, Senior Frontend / Full-Stack Engineer (10+ years). Built to let a hiring manager or recruiter understand his level, see concrete technical impact, and reach out — in one visit.

**Live:** [andyolarte.dev](https://andyolarte.dev)

## What's on the site

- **Hero** — name, title, current dual roles (NVIDIA + Mekan), one-line bio, CTA
- **Experience timeline** — all 7 positions, reverse-chronological, with quantified impact bullets
- **Skills** — grouped by domain (Frontend, Backend, Mobile, DevOps/CI, Testing)
- **Contact** — email, GitHub, LinkedIn, location + availability
- **PDF CV export** — one-click download, generated from the same data source as the page (no duplication)
- Dark mode, fully responsive (320px → desktop), WCAG 2.1 AA accessible

## Stack

| Layer           | Choice                                                 |
| --------------- | ------------------------------------------------------ |
| Framework       | [Next.js 16](https://nextjs.org) (App Router)          |
| Language        | TypeScript, `strict` mode                              |
| Styling         | Tailwind CSS v4                                        |
| Components      | [shadcn/ui](https://ui.shadcn.com) on Radix primitives |
| Icons           | [Lucide React](https://lucide.dev)                     |
| PDF export      | `@react-pdf/renderer`                                  |
| Package manager | Yarn 4 (Berry)                                         |
| Unit tests      | Jest 30 + React Testing Library                        |
| E2E tests       | Playwright                                             |
| Perf/SEO gate   | Lighthouse CI                                          |
| Hosting         | Vercel (auto-deploy on `main`)                         |

No backend for v1.0 — fully static, content lives in `src/lib/*Content.ts`.

## Architecture

Atomic Design, one-way data flow: `pages → templates → organisms → molecules → atoms`.

```
src/
  app/                # Next.js App Router — routes, layout, metadata
  components/
    atoms/             # Smallest units — no logic, no data fetching (Button, Badge, RoleBadge...)
    molecules/          # Composed atoms — still no data fetching (TimelineEntry, SkillGroup...)
    organisms/           # Sections that may fetch data / use context (HeroSection, Navbar...)
    templates/            # Layout-only wrappers, no logic
    ui/                    # shadcn/ui primitives
  hooks/                # Custom hooks (useTheme, useActiveSection...)
  lib/                  # Pure content/utils, no React (heroContent.ts, experienceContent.ts...)
  types/                # Shared TypeScript types
e2e/                    # Playwright specs
```

Content is data-driven: everything under `src/lib/*Content.ts` feeds both the rendered page **and** the PDF CV — change the data once, both outputs update.

## Getting started

```bash
corepack enable      # Yarn 4 via Corepack
yarn install
yarn dev              # http://localhost:3000
```

## Commands

```bash
yarn dev              # Dev server
yarn build             # Production build
yarn start              # Serve production build

yarn test                # Unit tests
yarn test:coverage        # Unit tests, 100% coverage gate
yarn test:e2e               # Playwright E2E
yarn test:e2e:ui             # Playwright UI mode

yarn lint                     # ESLint
yarn format                    # Prettier — write
yarn format:check               # Prettier — check only
yarn type-check                  # tsc --noEmit
```

## Quality gates

Every push/PR to `main` runs, in order: type-check → lint → format check → unit tests (100% branches/functions/lines/statements) → build → Playwright E2E (Chromium + Mobile Chrome) → Lighthouse CI.

Locally, Husky + lint-staged run ESLint + Prettier on every commit.

Non-negotiables (see `CLAUDE.md`):

- No `any` — `@typescript-eslint/no-explicit-any: error`
- Every exported function declares its return type
- `import type` for type-only imports
- Every new component/utility ships with a test — 100% coverage is enforced, not aspirational

## Project status

v1.0 "Portfolio Launch" — **complete**, all 6 phases shipped (Layout, Hero, Experience, Skills+Contact, Polish, PDF Export). Deferred to v1.1+: projects showcase, contact form backend, analytics, Spanish toggle, blog.

Full requirements, phase history, and decisions live in `.planning/` (gitignored — local planning artifacts, managed via GSD).

## Deploy

Auto-deploys on Vercel: pushes to `main` go to production, PRs get preview URLs.

---

Andy Francisco Olarte Cardona — Medellín, Colombia · [andy.olarte514@gmail.com](mailto:andy.olarte514@gmail.com) · [GitHub](https://github.com/andyOlarte514)
