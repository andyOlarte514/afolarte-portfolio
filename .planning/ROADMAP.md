# Roadmap: Andy Olarte — Portfolio

# Milestone: v1.0 Portfolio Launch

**Defined:** 2026-06-02
**Granularity:** Standard
**Coverage:** 28/28 v1 requirements mapped

## Phases

- [ ] **Phase 1: Layout Foundation** - Responsive shell, sticky nav, dark mode, semantic HTML
- [x] **Phase 2: Hero Section** - Name, title, dual roles, bio, CTA, photo (completed 2026-06-03)
- [ ] **Phase 3: Experience Timeline** - All 7 positions with impact bullets and visual differentiation
- [ ] **Phase 4: Skills + Contact** - Grouped skills with icons and complete contact section
- [ ] **Phase 5: Polish** - Performance, SEO meta/OG tags, and accessibility audit
- [ ] **Phase 6: PDF CV Export** - Download CV button generating an up-to-date PDF from portfolio data

## Phase Details

### Phase 1: Layout Foundation

**Goal**: Visitors can navigate a responsive, dark-mode-capable site with a properly structured semantic shell
**Depends on**: Nothing (first phase)
**Requirements**: LAYOUT-01, LAYOUT-02, LAYOUT-03, LAYOUT-04, SEO-04
**Success Criteria** (what must be TRUE):

  1. Visitor can click any nav link and the page smoothly scrolls to the correct section
  2. Navigation header remains visible and highlights the active section while scrolling
  3. Site is fully usable on a 320px mobile screen, 768px tablet, and 1280px desktop without horizontal scrolling
  4. Toggling dark mode (manually or via system preference) switches the entire site without layout shift
  5. Page source contains `<header>`, `<main>`, `<nav>`, `<section>`, and `<footer>` semantic elements

**Plans**: 6 plans
Plans:
**Wave 1**

- [x] 01-01-PLAN.md — shadcn/ui init + globals.css color tokens + layout.tsx anti-flash script

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 01-02-PLAN.md — useTheme + useActiveSection hooks with 100% unit test coverage

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 01-03-PLAN.md — ThemeToggle + NavLink atoms with 100% unit test coverage

**Wave 4** *(blocked on Wave 3 completion)*

- [x] 01-04-PLAN.md — MobileNav molecule (Sheet + hamburger) with 100% unit test coverage

**Wave 5** *(blocked on Wave 4 completion)*

- [x] 01-05-PLAN.md — Navbar organism + page.tsx section stubs + layout.tsx wiring

**Wave 6** *(blocked on Wave 5 completion)*

- [ ] 01-06-PLAN.md — Playwright E2E tests + human visual verification

### Phase 2: Hero Section

**Goal**: Visitors immediately understand who Andy is, what he does, and how to reach him
**Depends on**: Phase 1
**Requirements**: HERO-01, HERO-02, HERO-03, HERO-04
**Success Criteria** (what must be TRUE):

  1. Visitor sees Andy's full name, "Senior Frontend / Full-Stack Engineer" title, and both NVIDIA and Mekan roles without scrolling
  2. Visitor reads a bio that communicates 10+ years of experience, Medellín base, and international targeting in one sentence
  3. Visitor can click the CTA button and either reach the contact section or open a pre-filled email
  4. A photo (or clearly styled placeholder) is visible in the hero section

**Plans**: 5 plans
Plans:
**Wave 1**

- [x] 02-01-PLAN.md — Types + heroContent data file (src/types/hero.ts, src/lib/heroContent.ts)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 02-02-PLAN.md — RoleBadge atom + HeroPhoto atom with 100% unit test coverage
- [x] 02-03-PLAN.md — CTAButton "use client" atom with 100% unit test coverage

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 02-04-PLAN.md — HeroSection organism with 100% unit test coverage

**Wave 4** *(blocked on Wave 3 completion)*

- [x] 02-05-PLAN.md — page.tsx integration + E2E tests + human visual verification

**UI hint**: yes

### Phase 3: Experience Timeline

**Goal**: Visitors can scan Andy's 10-year career, identify senior/lead indicators, and see concrete technical impact
**Depends on**: Phase 1
**Requirements**: EXPER-01, EXPER-02, EXPER-03, EXPER-04, EXPER-05
**Success Criteria** (what must be TRUE):

  1. All 7 positions appear in reverse-chronological order (NVIDIA first, Pragma last)
  2. Each entry shows company name, role title, date range, and 3–5 bullet points with quantified impact
  3. NVIDIA and Mekan entries surface key differentiators: commit counts, design system migration, custom ESLint plugin, Playwright suite
  4. A recruiter scanning for 5 seconds can identify at least two senior/lead-level indicators without reading full bullets
  5. Each entry has a company logo, color accent, or other visual indicator that distinguishes it from its neighbors

**Plans**: 5 plans
Plans:
**Wave 1**

- [x] 03-01-PLAN.md — WorkEntry type + experienceContent data file (src/types/experience.ts, src/lib/experienceContent.ts)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 03-02-PLAN.md — CompanyAvatar atom + EntryBadge atom with 100% unit test coverage

**Wave 3** *(blocked on Wave 2 completion)*

- [ ] 03-03-PLAN.md — TimelineEntry molecule with 100% unit test coverage (both tagged and untagged branches)

**Wave 4** *(blocked on Wave 3 completion)*

- [ ] 03-04-PLAN.md — ExperienceTimeline organism with 100% unit test coverage

**Wave 5** *(blocked on Wave 4 completion)*

- [ ] 03-05-PLAN.md — page.tsx wiring + E2E tests + human visual verification

**UI hint**: yes

### Phase 4: Skills + Contact

**Goal**: Visitors understand Andy's technical breadth and can immediately initiate contact via any preferred channel
**Depends on**: Phase 1
**Requirements**: SKILLS-01, SKILLS-02, SKILLS-03, CONTACT-01, CONTACT-02, CONTACT-03, CONTACT-04
**Success Criteria** (what must be TRUE):

  1. Visitor sees skills organized under exactly five domain groups: Frontend, Backend, Mobile, DevOps/CI, Testing
  2. Each group displays technology names alongside recognizable icons or badges
  3. Expert/primary skills are visually distinct from secondary skills within each group
  4. Visitor can click to open a pre-filled email to andy.olarte514@gmail.com, open GitHub (andyOlarte514), and open LinkedIn — all in new tabs
  5. Contact section displays "Medellín, Colombia" and an availability status line

**Plans**: TBD
**UI hint**: yes

### Phase 5: Polish

**Goal**: The site passes Core Web Vitals thresholds, is fully keyboard-accessible, and presents correctly when shared on social platforms
**Depends on**: Phase 2, Phase 3, Phase 4
**Requirements**: LAYOUT-05, SEO-01, SEO-02, SEO-03
**Success Criteria** (what must be TRUE):

  1. Lighthouse or PageSpeed reports LCP < 2.5s and CLS < 0.1 on a cold load
  2. Sharing the URL on Slack, Twitter, or LinkedIn renders the correct title, description, and preview image from Open Graph tags
  3. Every interactive element (nav links, CTA, contact links) is reachable and activatable with keyboard alone, with a visible focus ring
  4. All images have non-empty descriptive `alt` text; all icon-only buttons have an `aria-label`

**Plans**: TBD

### Phase 6: PDF CV Export

**Goal**: Visitor can download an always-current PDF CV that mirrors the portfolio data with professional formatting
**Depends on**: Phase 2, Phase 3, Phase 4
**Requirements**: PDF-01, PDF-02, PDF-03, PDF-04
**Success Criteria** (what must be TRUE):

  1. Clicking "Download CV" triggers a PDF download within 2 seconds
  2. Downloaded PDF contains: contact info, summary, all 7 positions with bullets, skills by domain, and education
  3. PDF layout is professional and readable — company names, roles, dates, and bullets are visually well-structured
  4. Changing the shared portfolio data source (e.g. experience JSON) updates both the rendered page AND the exported PDF without any code duplication

**Plans**: TBD
**UI hint**: yes

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Layout Foundation | 5/6 | In Progress|  |
| 2. Hero Section | 5/5 | Complete   | 2026-06-03 |
| 3. Experience Timeline | 2/5 | In Progress|  |
| 4. Skills + Contact | 0/? | Not started | - |
| 5. Polish | 0/? | Not started | - |
| 6. PDF CV Export | 0/? | Not started | - |

---
*Roadmap created: 2026-06-02*
*Last updated: 2026-06-03 after Phase 3 planning*
