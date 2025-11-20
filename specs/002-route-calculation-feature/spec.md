# Especificación: Cálculo de Ruta Óptima a Puntos de Referencia

**ID**: 002-route-calculation-feature  
**Fecha de Creación**: 2025-11-20  
**Estado**: Propuesta  
**Prioridad**: Alta

---

## Resumen Ejecutivo

Implementar funcionalidad que permita a los usuarios calcular y visualizar la ruta más óptima desde su ubicación actual hasta cualquier punto de referencia (landmark) seleccionado en el mapa. La solución incluirá visualización de la ruta en el mapa, información de distancia y tiempo estimado, e instrucciones paso a paso.

---

## Objetivos

### Objetivos Primarios
1. ✅ Calcular automáticamente la ruta óptima al hacer clic en un landmark
2. ✅ Visualizar la ruta en el mapa de forma clara e interactiva
3. ✅ Mostrar información relevante (distancia, tiempo, medio de transporte)
4. ✅ Proporcionar instrucciones paso a paso de navegación

### Objetivos Secundarios
1. ✅ Permitir selección de medio de transporte (a pie, bicicleta, auto)
2. ✅ Mostrar rutas alternativas si están disponibles
3. ✅ Integrar con aplicaciones de mapas del dispositivo
4. ✅ Guardar historial de rutas consultadas

---

## Arquitectura de la Solución

### Componentes Principales

```
┌─────────────────────────────────────────────────────────┐
│                   InteractiveMap                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │         Leaflet Map Container                    │   │
│  │  ┌────────────┐    ┌──────────────────────┐    │   │
│  │  │ Landmarks  │    │   Route Layer        │    │   │
│  │  │  Markers   │    │  - Route Line        │    │   │
│  │  └────────────┘    │  - Turn Markers      │    │   │
│  │                     └──────────────────────┘    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │         RoutePanel Component                     │   │
│  │  - Transport Mode Selector                       │   │
│  │  - Route Summary (distance, time)                │   │
│  │  - Turn-by-turn Instructions                     │   │
│  │  - Alternative Routes                            │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↓
                  ┌───────────────┐
                  │  useRouting   │
                  │     Hook      │
                  └───────────────┘
                          ↓
                  ┌───────────────┐
                  │ Routing API   │
                  │  (OSRM/       │
                  │  Mapbox/etc)  │
                  └───────────────┘
```

---

## Especificación Técnica

### 1. Servicio de Enrutamiento

#### Opciones de API

**Opción Recomendada: OSRM (Open Source Routing Machine)**
- ✅ Gratuito y open source
- ✅ Alta calidad de rutas
- ✅ Soporta múltiples modos de transporte
- ✅ API pública disponible
- ❌ Límites de rate limiting en API pública

**Alternativas:**
- **Mapbox Directions API**: Potente pero requiere API key y tiene costos
- **Google Maps Directions API**: Robusto pero costoso
- **GraphHopper**: Open source con API pública gratuita

#### Implementación con OSRM

```typescript
// lib/routing/osrm.ts

export interface RoutePoint {
  lat: number;
  lng: number;
}

export interface RouteStep {
  distance: number; // metros
  duration: number; // segundos
  instruction: string;
  name: string;
  maneuver: {
    type: string;
    modifier?: string;
    location: [number, number];
  };
}

export interface Route {
  distance: number; // metros
  duration: number; // segundos
  geometry: [number, number][]; // Coordenadas [lng, lat]
  steps: RouteStep[];
  summary: string;
}

export interface RoutingResponse {
  routes: Route[];
  waypoints: {
    location: [number, number];
    name: string;
  }[];
}

export type TransportMode = 'foot' | 'bike' | 'car';

const OSRM_ENDPOINTS = {
  foot: 'https://routing.openstreetmap.de/routed-foot',
  bike: 'https://routing.openstreetmap.de/routed-bike',
  car: 'https://routing.openstreetmap.de/routed-car',
};

/**
 * Calcula la ruta óptima entre dos puntos usando OSRM
 */
export async function calculateRoute(
  origin: RoutePoint,
  destination: RoutePoint,
  mode: TransportMode = 'foot'
): Promise<RoutingResponse> {
  const baseUrl = OSRM_ENDPOINTS[mode];
  const url = `${baseUrl}/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&steps=true&geometries=geojson`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error al calcular la ruta: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.code !== 'Ok') {
      throw new Error(`OSRM Error: ${data.message || 'Error desconocido'}`);
    }

    return {
      routes: data.routes.map((route: any) => ({
        distance: route.distance,
        duration: route.duration,
        geometry: route.geometry.coordinates,
        steps: route.legs[0].steps.map((step: any) => ({
          distance: step.distance,
          duration: step.duration,
          instruction: step.maneuver.instruction || generateInstruction(step.maneuver),
          name: step.name || 'Carretera sin nombre',
          maneuver: {
            type: step.maneuver.type,
            modifier: step.maneuver.modifier,
            location: step.maneuver.location,
          },
        })),
        summary: `${formatDistance(route.distance)} - ${formatDuration(route.duration)}`,
      })),
      waypoints: data.waypoints.map((wp: any) => ({
        location: wp.location,
        name: wp.name || 'Punto de ruta',
      })),
    };
  } catch (error) {
    console.error('Error calculating route:', error);
    throw error;
  }
}

/**
 * Genera instrucción en español basada en la maniobra
 */
function generateInstruction(maneuver: any): string {
  const type = maneuver.type;
  const modifier = maneuver.modifier;
  
  const instructions: Record<string, string> = {
    'depart': 'Sal',
    'arrive': 'Has llegado a tu destino',
    'turn': modifier === 'left' ? 'Gira a la izquierda' : 'Gira a la derecha',
    'continue': 'Continúa',
    'merge': 'Incorpórate',
    'roundabout': 'Toma la rotonda',
    'fork': modifier === 'left' ? 'Mantente a la izquierda' : 'Mantente a la derecha',
  };
  
  return instructions[type] || 'Continúa';
}

/**
 * Formatea la distancia a un formato legible
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Formatea la duración a un formato legible
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return `${hours} h ${remainingMinutes} min`;
}
```

---

### 2. Hook de Enrutamiento

```typescript
// hooks/useRouting.ts

import { useState, useCallback } from 'react';
import { calculateRoute, type Route, type TransportMode } from '@/lib/routing/osrm';

interface RoutingState {
  currentRoute: Route | null;
  alternativeRoutes: Route[];
  loading: boolean;
  error: Error | null;
  mode: TransportMode;
}

export function useRouting() {
  const [state, setState] = useState<RoutingState>({
    currentRoute: null,
    alternativeRoutes: [],
    loading: false,
    error: null,
    mode: 'foot',
  });

  const calculateOptimalRoute = useCallback(
    async (
      origin: { lat: number; lng: number },
      destination: { lat: number; lng: number },
      mode: TransportMode = 'foot'
    ) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await calculateRoute(origin, destination, mode);
        
        setState({
          currentRoute: result.routes[0] || null,
          alternativeRoutes: result.routes.slice(1),
          loading: false,
          error: null,
          mode,
        });

        return result.routes[0];
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Error desconocido');
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err,
        }));
        throw err;
      }
    },
    []
  );

  const clearRoute = useCallback(() => {
    setState({
      currentRoute: null,
      alternativeRoutes: [],
      loading: false,
      error: null,
      mode: 'foot',
    });
  }, []);

  const setTransportMode = useCallback((mode: TransportMode) => {
    setState((prev) => ({ ...prev, mode }));
  }, []);

  return {
    currentRoute: state.currentRoute,
    alternativeRoutes: state.alternativeRoutes,
    loading: state.loading,
    error: state.error,
    mode: state.mode,
    calculateOptimalRoute,
    clearRoute,
    setTransportMode,
  };
}
```

---

### 3. Componente de Panel de Ruta

Ver código completo en [tasks.md](./tasks.md)

---

## Flujo de Usuario

### Escenario 1: Usuario con ubicación habilitada

```
1. Usuario abre el mapa
2. Sistema solicita permisos de ubicación
3. Usuario concede permisos
4. Mapa muestra ubicación del usuario
5. Usuario hace clic en un landmark
   ├─ Modal del landmark se abre
   └─ Sistema inicia cálculo de ruta automáticamente
6. Panel de ruta aparece mostrando:
   ├─ Distancia total
   ├─ Tiempo estimado
   ├─ Modos de transporte disponibles
   └─ Ruta dibujada en el mapa
7. Usuario puede:
   ├─ Ver instrucciones detalladas
   ├─ Cambiar modo de transporte
   ├─ Abrir en app de mapas nativa
   └─ Cerrar el panel
```

### Escenario 2: Usuario sin ubicación

```
1. Usuario abre el mapa sin conceder permisos
2. Usuario hace clic en un landmark
3. Sistema muestra mensaje:
   "Para calcular la ruta, necesitamos tu ubicación"
   [Botón: Activar Ubicación]
4. Usuario puede:
   ├─ Activar ubicación → Volver al Escenario 1
   └─ Ver información del landmark sin ruta
```

---

## Consideraciones de Accesibilidad

### ARIA Labels
```typescript
// Ejemplos de labels para lectores de pantalla
<div role="navigation" aria-label="Panel de navegación de ruta">
  <button aria-label="Cambiar a modo a pie">🚶 A pie</button>
  <button aria-label="Ver instrucciones paso a paso">Ver Instrucciones</button>
</div>

// Anuncios dinámicos
<div aria-live="polite" aria-atomic="true">
  {routeCalculated && "Ruta calculada exitosamente"}
</div>
```

### Contraste de Colores
- Línea de ruta: Azul brillante (#3B82F6) con grosor de 5px
- Fondo del panel: Blanco con sombra para contraste
- Texto: Cumple con WCAG AAA (contraste mínimo 7:1)

### Navegación por Teclado
- Todos los botones son accesibles con Tab
- Enter/Space para activar controles
- Escape para cerrar el panel

---

## Manejo de Errores

### Errores Posibles

1. **Sin permiso de ubicación**
2. **Error de API de enrutamiento**
3. **Sin conexión a internet**
4. **Ruta no disponible**

Ver detalles en [tasks.md](./tasks.md)

---

## Optimizaciones de Rendimiento

1. **Caché de Rutas**: Cachear rutas calculadas
2. **Debouncing**: Evitar recálculos innecesarios
3. **Cancelación de Peticiones**: Usar AbortController

---

## Fases de Implementación

- **Fase 1: Core** (1-2 días)
- **Fase 2: UI/UX** (1 día)
- **Fase 3: Mejoras** (1 día)
- **Fase 4: Extras** (opcional)

Ver plan detallado en [tasks.md](./tasks.md)

---

## Métricas de Éxito

### KPIs
1. **Tasa de uso**: % de usuarios que calculan al menos una ruta
2. **Tiempo de cálculo**: < 2 segundos promedio
3. **Tasa de error**: < 5% de solicitudes fallidas
4. **Satisfacción**: Rating positivo > 80%

---

## Referencias

- [OSRM Documentation](http://project-osrm.org/)
- [Leaflet Routing Machine](https://www.lrm.io/)
- [Mapbox Directions API](https://docs.mapbox.com/api/navigation/directions/)

---

## Aprobaciones Requeridas

- [ ] Product Owner
- [ ] Tech Lead
- [ ] UX Designer
- [ ] QA Lead

---

**Última actualización**: 2025-11-20  
**Autor**: Asistente AI

