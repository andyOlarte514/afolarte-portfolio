# Requirements: Andy Olarte — Portfolio

**Defined:** 2026-06-02
**Core Value:** Hiring managers can understand Andy's level, see concrete impact, and reach out — in one visit.

## v1 Requirements

### Layout & Navigation

- [ ] **LAYOUT-01**: Visitor sees a single-page layout with smooth scroll navigation to all sections
- [ ] **LAYOUT-02**: Navigation header sticks to top on scroll and highlights the active section
- [ ] **LAYOUT-03**: Site renders correctly on mobile (320px+), tablet (768px+), and desktop (1280px+)
- [ ] **LAYOUT-04**: Site supports dark mode (system preference + manual toggle)
- [ ] **LAYOUT-05**: Page loads with no layout shift (CLS < 0.1) and LCP < 2.5s

### Hero Section

- [ ] **HERO-01**: Visitor sees Andy's full name, title ("Senior Frontend / Full-Stack Engineer"), and current dual roles (NVIDIA + Mekan) immediately on page load
- [ ] **HERO-02**: Visitor sees a professional one-liner bio (10+ years, Medellín-based, targeting senior roles)
- [ ] **HERO-03**: Visitor can click a CTA that scrolls to the contact section or opens email
- [ ] **HERO-04**: Hero section includes a professional photo (placeholder-ready if photo not available)

### Experience Timeline

- [x] **EXPER-01**: Visitor sees all 7 work positions listed in reverse-chronological order
- [x] **EXPER-02**: Each position shows: company name, role title, date range, and 3–5 impact bullet points
- [x] **EXPER-03**: NVIDIA and Mekan entries prominently show key differentiators (commits, migrations, tooling built)
- [x] **EXPER-04**: Experience section is scannable — visitor can identify senior/lead indicators at a glance
- [x] **EXPER-05**: Company logos or visual indicators differentiate entries

### Skills Section

- [ ] **SKILLS-01**: Visitor sees skills grouped by domain: Frontend, Backend, Mobile, DevOps/CI, Testing
- [ ] **SKILLS-02**: Each skill group displays technology names with recognizable icons or badges
- [ ] **SKILLS-03**: Most-used/expert skills are visually distinguished from secondary skills

### Contact Section

- [ ] **CONTACT-01**: Visitor can click to open a pre-filled email to andy.olarte514@gmail.com
- [ ] **CONTACT-02**: Visitor can navigate to Andy's GitHub profile (andyOlarte514)
- [ ] **CONTACT-03**: Visitor can navigate to Andy's LinkedIn profile
- [ ] **CONTACT-04**: Contact section includes location (Medellín, Colombia) and availability status

### SEO & Accessibility

- [ ] **SEO-01**: Page has correct `<title>`, meta description, and Open Graph tags for sharing
- [ ] **SEO-02**: All interactive elements are keyboard-navigable with visible focus states
- [ ] **SEO-03**: All images have descriptive `alt` text; icon-only buttons have `aria-label`
- [ ] **SEO-04**: HTML uses semantic elements (`<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`)

### PDF CV Export

- [ ] **PDF-01**: Visitor can click "Download CV" button and receive a PDF file that downloads immediately
- [ ] **PDF-02**: PDF contains all sections: contact info, professional summary, full work history (7 positions) with impact bullets, skills grouped by domain, and education
- [ ] **PDF-03**: PDF layout matches the visual quality and structure of Andy's existing CV (professional formatting, readable typography, company names + dates clearly separated)
- [ ] **PDF-04**: PDF content stays in sync with portfolio data — updating the portfolio data source automatically updates the exported PDF (single source of truth)

## v2 Requirements

### Projects Showcase

- **PROJ-01**: Visitor can view a curated projects section with screenshots and links
- **PROJ-02**: Each project shows tech stack, role, and key outcome

### Enhanced Features

- **ENHANCE-01**: Contact form with backend (email delivery)
- **ENHANCE-02**: Analytics integration (Vercel Analytics or Plausible)
- **ENHANCE-03**: Spanish language toggle for local market
- **ENHANCE-04**: Blog/writing section

## Out of Scope

| Feature | Reason |
|---------|--------|
| Blog | Adds content maintenance; not critical for recruiter conversion in v1.0 |
| Contact form backend | Email link sufficient; avoids spam and infra complexity |
| Live project demos | No public linkable projects currently |
| Analytics | Defer to v1.1 after site is live |
| i18n / Spanish toggle | English-first for international targeting |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| LAYOUT-01 | Phase 1 | Pending |
| LAYOUT-02 | Phase 1 | Pending |
| LAYOUT-03 | Phase 1 | Pending |
| LAYOUT-04 | Phase 1 | Pending |
| LAYOUT-05 | Phase 5 | Pending |
| HERO-01 | Phase 2 | Pending |
| HERO-02 | Phase 2 | Pending |
| HERO-03 | Phase 2 | Pending |
| HERO-04 | Phase 2 | Pending |
| EXPER-01 | Phase 3 | Complete |
| EXPER-02 | Phase 3 | Complete |
| EXPER-03 | Phase 3 | Complete |
| EXPER-04 | Phase 3 | Complete |
| EXPER-05 | Phase 3 | Complete |
| SKILLS-01 | Phase 4 | Pending |
| SKILLS-02 | Phase 4 | Pending |
| SKILLS-03 | Phase 4 | Pending |
| CONTACT-01 | Phase 4 | Pending |
| CONTACT-02 | Phase 4 | Pending |
| CONTACT-03 | Phase 4 | Pending |
| CONTACT-04 | Phase 4 | Pending |
| SEO-01 | Phase 5 | Pending |
| SEO-02 | Phase 5 | Pending |
| SEO-03 | Phase 5 | Pending |
| SEO-04 | Phase 1 | Pending |
| PDF-01 | Phase 6 | Pending |
| PDF-02 | Phase 6 | Pending |
| PDF-03 | Phase 6 | Pending |
| PDF-04 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0 ✓

---
*Requirements defined: 2026-06-02*
*Last updated: 2026-06-02 after initial definition*
