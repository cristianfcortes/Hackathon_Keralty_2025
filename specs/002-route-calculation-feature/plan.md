# Implementation Plan: Route Calculation Feature

**Branch**: `feature/002-route-calculation` | **Date**: 2025-11-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-route-calculation-feature/spec.md`

## Summary

Implementar funcionalidad para calcular y visualizar rutas óptimas desde la ubicación del usuario hasta landmarks seleccionados. El sistema utilizará OSRM API (gratuita) para el cálculo de rutas, Leaflet para visualización en mapa, y componentes React para la interfaz de usuario. Incluye soporte para 3 modos de transporte (a pie, bicicleta, auto), visualización de instrucciones paso a paso, e integración con aplicaciones de mapas nativas.

## Technical Context

**Language/Version**: TypeScript 5.x, JavaScript ES2022  
**Primary Dependencies**: 
- React 19.1.0 (ya presente)
- Next.js 15.5.3 (ya presente, configurado para static export)
- Leaflet 1.9.x (ya presente)
- OSRM API (externa, sin SDK adicional - fetch API nativo)

**Storage**: 
- localStorage para caché de rutas calculadas
- Sin base de datos adicional

**Testing**: 
- React Testing Library (ya configurado)
- Jest para tests unitarios
- Tests de integración para componentes de mapa

**Target Platform**: 
- Web estática (Next.js Static Export)
- Compatible con navegadores modernos (Chrome, Firefox, Safari, Edge)
- Responsive: Desktop y Mobile

**Project Type**: Web application (frontend only, static export)

**Performance Goals**: 
- Cálculo de ruta: < 2 segundos promedio
- Renderizado de ruta en mapa: < 500ms
- Tamaño del bundle: < 50KB adicionales (gzipped)
- First Contentful Paint sin degradación

**Constraints**: 
- Debe funcionar como static site (no SSR)
- Todas las llamadas a OSRM API deben ser client-side
- Sin API routes de Next.js (cumple constitution)
- Debe funcionar sin conexión para rutas cacheadas
- Rate limiting de OSRM API pública: respetar límites razonables

**Scale/Scope**: 
- ~5 archivos nuevos
- ~1000 líneas de código nuevas
- 3 componentes React nuevos
- 1 custom hook
- 1 servicio de API
- Integración con 1 mapa existente

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Static Site Generation (SSG)
**Status**: COMPLIANT
- Todas las rutas se calculan client-side
- No requiere SSR ni API routes
- Componentes son CSR (Client-Side Rendered)
- OSRM API se llama desde el navegador vía fetch

### ✅ II. Next.js Static Export
**Status**: COMPLIANT
- No agrega páginas nuevas que requieran SSR
- Integración en componentes existentes que ya son estáticos
- `output: 'export'` permanece válido

### ✅ III. TypeScript Compliance
**Status**: COMPLIANT
- Todos los archivos nuevos serán `.ts` o `.tsx`
- Tipos estrictos para API responses
- Interfaces completas para todos los datos

### ✅ IV. Build Requirements
**Status**: COMPLIANT
- No modifica proceso de build
- Compatible con `npm install` y `npm run build` existente
- Output sigue siendo `out/` directory

### ✅ V. Dependency Management
**Status**: COMPLIANT
- **No dependencies adicionales necesarias**
- OSRM API es externa (fetch nativo)
- Leaflet ya está instalado
- React, Next.js, TypeScript ya presentes

**GATE RESULT**: ✅ **PASSED** - No violations, proyecto cumple todos los requisitos constitucionales

## Project Structure

### Documentation (this feature)

```text
specs/002-route-calculation-feature/
├── plan.md              # This file
├── spec.md              # Feature specification (already exists)
├── tasks.md             # Implementation tasks (already exists)
├── diagrams.md          # Technical diagrams (already exists)
├── README.md            # Feature overview (already exists)
├── research.md          # Phase 0 output (to be created)
├── data-model.md        # Phase 1 output (to be created)
├── quickstart.md        # Phase 1 output (to be created)
└── contracts/           # Phase 1 output (to be created)
    └── osrm-api.md      # OSRM API contract documentation
```

### Source Code (repository root)

```text
frontend/
├── lib/
│   └── routing/
│       └── osrm.ts                    # NEW: OSRM service integration
│
├── hooks/
│   └── useRouting.ts                  # NEW: Route calculation hook
│
├── app/
│   └── components/
│       └── map/
│           ├── InteractiveMap.tsx     # MODIFIED: Add routing integration
│           ├── RoutePanel.tsx         # NEW: Route information panel
│           └── (existing components)
│
├── types/
│   └── routing.ts                     # NEW: TypeScript types for routing
│
└── __tests__/
    ├── lib/
    │   └── routing/
    │       └── osrm.test.ts           # NEW: OSRM service tests
    └── hooks/
        └── useRouting.test.ts         # NEW: Hook tests
```

**Structure Decision**: Web application structure (Option 2 variant) - El proyecto ya tiene una estructura frontend establecida con Next.js. Los nuevos archivos se organizan siguiendo las convenciones existentes: servicios en `lib/`, hooks en `hooks/`, componentes en `app/components/`, y types en `types/`. No requiere cambios estructurales mayores.

## Complexity Tracking

> **Not applicable** - No constitution violations present

---

## Phase 0: Research & Discovery ✅ COMPLETE

### Research Tasks

1. **OSRM API Investigation** ✅
   - ✅ Endpoint structure and parameters
   - ✅ Response format and data structures
   - ✅ Rate limiting policies
   - ✅ Error handling patterns
   - ✅ Alternative routing services comparison

2. **Leaflet Routing Integration** ✅
   - ✅ Best practices for drawing routes with Leaflet
   - ✅ Polyline performance with large geometries
   - ✅ Z-index management for route layers
   - ✅ Animation options for route rendering

3. **Client-Side API Patterns** ✅
   - ✅ Error handling for external APIs
   - ✅ Retry strategies and exponential backoff
   - ✅ Caching strategies in localStorage
   - ✅ AbortController for request cancellation

4. **Mobile Integration** ✅
   - ✅ URL schemes for Apple Maps and Google Maps
   - ✅ Platform detection methods
   - ✅ Fallback strategies for unsupported browsers

**Output**: ✅ research.md created with all decisions documented

---

## Phase 1: Design Artifacts ✅ COMPLETE

### Generated:

1. ✅ **data-model.md** - Complete TypeScript type system with 15 interfaces
2. ✅ **contracts/osrm-api.md** - Full OSRM API documentation with examples
3. ✅ **quickstart.md** - Comprehensive developer guide with testing checklist

---

## Next Steps

1. ✅ Branch created: `feature/002-route-calculation`
2. ✅ Execute Phase 0: Generate research.md
3. ✅ Execute Phase 1: Generate design artifacts
4. ⬜ Update agent context with new technologies
5. ✅ Re-validate Constitution Check after design (all gates passed)
6. ✅ Tasks already exist in tasks.md (14 detailed tasks ready)

## Phase 1 Complete - Ready for Implementation

**Design artifacts generated**:
- ✅ research.md (8 sections, all research complete)
- ✅ data-model.md (15 TypeScript interfaces + utilities)
- ✅ contracts/osrm-api.md (Complete API documentation)
- ✅ quickstart.md (Developer guide with examples)

**Constitution re-check**: ✅ All gates still passing
- No SSR required
- No new dependencies
- Full TypeScript compliance
- Static export compatible

**Implementation can now begin** following tasks.md (Phase 1-4)

---

**Last Updated**: 2025-11-20  
**Status**: Phase 0 - Ready for research generation

