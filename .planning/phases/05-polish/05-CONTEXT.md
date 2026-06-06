# Phase 5: Polish - Context

**Gathered:** 2026-06-06
**Status:** Ready for planning

<domain>
## Phase Boundary

El sitio cumple los umbrales de Core Web Vitals, es completamente accesible con teclado, y se presenta correctamente al compartir en redes sociales. Esta fase no agrega nuevo contenido ni funcionalidades — solo optimización y metadatos.

Requirements: LAYOUT-05, SEO-01, SEO-02, SEO-03

Success criteria:
1. Lighthouse/PageSpeed: LCP < 2.5s, CLS < 0.1 en carga en frío
2. Compartir la URL en Slack, Twitter o LinkedIn muestra título, descripción e imagen de preview correctos
3. Cada elemento interactivo (nav, CTA, contact links) es alcanzable y activable solo con teclado, con anillo de foco visible
4. Todas las imágenes tienen `alt` descriptivo; botones solo-icono tienen `aria-label`

</domain>

<decisions>
## Implementation Decisions

### OG / Vista Previa Social (SEO-01)
- **D-01:** Usar `src/app/opengraph-image.tsx` de Next.js — imagen generada desde código en la ruta `/opengraph-image`. Se sincroniza automáticamente con el contenido del portafolio sin actualizaciones manuales.
- **D-02:** El diseño de la imagen OG muestra: nombre completo (Andy Olarte), título profesional, acento índigo consistente con el sitio. Dimensiones estándar OG: 1200×630px.
- **D-03:** Incluir meta tags completos en `layout.tsx`: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`. URL base desde variable de entorno `NEXT_PUBLIC_SITE_URL`.

### Foto Real (LCP / OG Image)
- **D-04:** Andy agrega foto profesional real en esta fase. Ubicación: `public/andy-olarte.jpg` (o `.webp`).
- **D-05:** `HeroPhoto` atom: agregar prop `priority` a Next.js `<Image>` cuando `src` está presente — la foto del hero es el LCP candidate, debe precargarse.
- **D-06:** La imagen OG generada (`opengraph-image.tsx`) puede incluir la foto real o usar diseño de texto/gradiente. Claude decide el enfoque según facilidad de implementación con `@vercel/og`.

### Accesibilidad (SEO-02, SEO-03)
- **D-07:** Auditar y corregir gaps existentes — no agregar axe-playwright a CI para v1.0.
- **D-08:** Elementos a verificar manualmente: `NavLink`, `CTAButton`, `ThemeToggle`, `MobileNav`, `ContactIconButton`, `HeroPhoto` (alt), experiencia timeline (si tiene links), skills (badges no interactivos, ok).
- **D-09:** `NavLink` ya tiene `focus-visible:ring-2 focus-visible:ring-indigo-500` ✓. Los componentes shadcn `Button` tienen focus ring built-in ✓. Revisar que no se haya suprimido con `outline-none` sin reemplazo.
- **D-10:** `HeroPhoto` placeholder (sin `src`): el div con iniciales no es interactivo — no necesita focus. OK.

### Rendimiento (LAYOUT-05)
- **D-11:** Corrida local de Lighthouse en producción (`yarn build && yarn start`) + correcciones identificadas antes de merge.
- **D-12:** Agregar Lighthouse CI al pipeline de GitHub Actions (`.github/workflows/ci.yml`). Usar `@lhci/cli` con umbrales: LCP < 2500ms, CLS < 0.1. Bloquea PRs que degraden Core Web Vitals.
- **D-13:** El servidor LHCI usa almacenamiento temporal (`--storage.storageMethod=temporary`) para v1.0 — sin servidor externo LHCI, solo assertions locales en CI.

### Claude's Discretion
- Diseño visual exacto de la imagen `opengraph-image.tsx` (tipografía, layout, gradiente de fondo)
- Implementación del servidor LHCI en CI (configuración exacta de `lighthouserc.json`)
- Orden de las meta tags en `<head>`

</decisions>

<canonical_refs>
## Canonical References

**Los agentes downstream DEBEN leer estos antes de planificar o implementar.**

### Metadatos Next.js
- `src/app/layout.tsx` — Estructura actual de metadata, donde agregar OG tags
- `node_modules/next/dist/docs/` — API de Next.js 16 (breaking changes vs versiones anteriores)

### Componentes existentes
- `src/components/atoms/HeroPhoto.tsx` — Agregar prop `priority`, revisar alt
- `src/components/atoms/CTAButton.tsx` — Verificar focus ring via shadcn Button
- `src/components/atoms/NavLink.tsx` — Ya tiene focus ring correcto
- `src/components/atoms/ContactIconButton.tsx` — Ya tiene aria-label
- `src/components/atoms/ThemeToggle.tsx` — Verificar focus ring via shadcn Button

### CI Pipeline
- `.github/workflows/ci.yml` — Pipeline actual donde agregar Lighthouse CI step

### Contenido
- `src/lib/heroContent.ts` — Datos del hero (nombre, título, bio) para usar en opengraph-image.tsx

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/heroContent.ts`: datos del hero (nombre, título, bio) reutilizables para opengraph-image.tsx
- `src/app/globals.css`: `--ring: #6366f1` (índigo-500) ya definido como token CSS global
- shadcn `Button` component: focus ring built-in via Radix UI primitives

### Established Patterns
- Metadata exportada como `export const metadata: Metadata` desde `src/app/layout.tsx` — agregar OG fields aquí
- `src/app/opengraph-image.tsx` es el patrón estándar de Next.js App Router para OG images — no requiere configuración adicional
- Next.js `<Image>` con `fill` ya en uso en HeroPhoto — agregar `priority` prop cuando `src` está presente

### Integration Points
- `layout.tsx` metadata object: extender con `openGraph`, `twitter` fields
- `public/`: colocar foto real aquí (`andy-olarte.jpg` o `.webp`)
- `.github/workflows/ci.yml`: agregar Lighthouse CI como job separado después del build

</code_context>

<specifics>
## Specific Ideas

- La foto real va en `public/andy-olarte.jpg` (o `.webp` para mejor rendimiento)
- Variable de entorno `NEXT_PUBLIC_SITE_URL` para la URL canónica en OG tags (configurar en Vercel)
- Lighthouse CI: almacenamiento temporal (`--storage.storageMethod=temporary`) — sin servidor externo para v1.0

</specifics>

<deferred>
## Deferred Ideas

- axe-playwright en CI para regresiones de accesibilidad — v1.1
- Schema.org structured data (Person, WebSite) — no está en requirements de v1.0
- Sitemap.xml / robots.txt — v1.1

</deferred>

---

*Phase: 05-polish*
*Context gathered: 2026-06-06*
