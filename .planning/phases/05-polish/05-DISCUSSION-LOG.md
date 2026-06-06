# Phase 5: Polish - Discussion Log

> **Solo auditoría.** No usar como input para agentes de planning, research o ejecución.
> Las decisiones están capturadas en CONTEXT.md — este log preserva el análisis.

**Date:** 2026-06-06
**Phase:** 05-polish
**Mode:** discuss
**Areas analyzed:** OG/vista previa social, Foto real, Accesibilidad, Rendimiento

## Areas Discutidas

### OG / Vista Previa Social
| Pregunta | Opciones presentadas | Selección |
|----------|---------------------|-----------|
| ¿Cómo generar imagen OG? | opengraph-image.tsx / PNG estático / Solo texto | opengraph-image.tsx de Next.js |

### Foto Real
| Pregunta | Opciones presentadas | Selección |
|----------|---------------------|-----------|
| ¿Tienes foto profesional? | Sí, la agrego ahora / No, seguir con placeholder | Sí, tiene foto y la agrega en esta fase |

### Accesibilidad
| Pregunta | Opciones presentadas | Selección |
|----------|---------------------|-----------|
| ¿Profundidad de auditoría? | Auditar+corregir / Auditar+axe en CI | Solo auditar y corregir gaps existentes |

### Rendimiento
| Pregunta | Opciones presentadas | Selección |
|----------|---------------------|-----------|
| ¿Cómo medir LAYOUT-05? | Solo local / Solo CI / Ambos | Ambos: local + Lighthouse CI en pipeline |

## Correcciones Aplicadas

Ninguna — todas las selecciones siguieron la recomendación.

## Ideas Diferidas

- axe-playwright en CI — v1.1
- Schema.org structured data — fuera del scope v1.0
- Sitemap.xml / robots.txt — v1.1
