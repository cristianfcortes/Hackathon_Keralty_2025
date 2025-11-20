# Tareas: Implementación de Cálculo de Ruta Óptima

**Especificación**: [spec.md](./spec.md)  
**Fecha de Inicio**: 2025-11-20  
**Prioridad**: Alta  
**Estimación Total**: 3-4 días

---

## Fase 1: Core - Servicio de Enrutamiento (Día 1)

### Tarea 1.1: Crear servicio OSRM
**Estimación**: 3 horas  
**Prioridad**: Alta  
**Dependencias**: Ninguna

**Pasos:**
1. Crear archivo `frontend/lib/routing/osrm.ts`
2. Implementar tipos TypeScript:
   - `RoutePoint`
   - `RouteStep`
   - `Route`
   - `RoutingResponse`
   - `TransportMode`
3. Implementar función `calculateRoute()`
4. Implementar funciones auxiliares:
   - `generateInstruction()` - Traduce instrucciones a español
   - `formatDistance()` - Formatea metros a km/m
   - `formatDuration()` - Formatea segundos a horas/min
5. Agregar manejo de errores robusto
6. Documentar con JSDoc

**Criterios de Aceptación:**
- [ ] Función devuelve ruta válida con coordenadas
- [ ] Soporta 3 modos de transporte (foot, bike, car)
- [ ] Instrucciones en español
- [ ] Manejo de errores de red y API
- [ ] Tipos TypeScript completos

**Archivos a crear:**
- `frontend/lib/routing/osrm.ts`

---

### Tarea 1.2: Crear hook useRouting
**Estimación**: 2 horas  
**Prioridad**: Alta  
**Dependencias**: 1.1

**Pasos:**
1. Crear archivo `frontend/hooks/useRouting.ts`
2. Implementar estado del hook:
   - `currentRoute`
   - `alternativeRoutes`
   - `loading`
   - `error`
   - `mode`
3. Implementar funciones:
   - `calculateOptimalRoute()` - Calcula ruta
   - `clearRoute()` - Limpia ruta actual
   - `setTransportMode()` - Cambia modo de transporte
4. Agregar optimización con useCallback
5. Implementar manejo de estado de carga y errores

**Criterios de Aceptación:**
- [ ] Hook gestiona estado correctamente
- [ ] Funciones son estables (memoizadas)
- [ ] Estados de carga reflejan operaciones async
- [ ] Errores son capturados y expuestos

**Archivos a crear:**
- `frontend/hooks/useRouting.ts`

---

### Tarea 1.3: Agregar visualización de ruta en mapa
**Estimación**: 3 horas  
**Prioridad**: Alta  
**Dependencias**: 1.1, 1.2

**Pasos:**
1. Modificar `frontend/app/components/map/InteractiveMap.tsx`
2. Importar y usar `useRouting()` hook
3. Agregar ref para capa de ruta: `routeLayerRef`
4. Modificar `handleMarkerClick` para calcular ruta
5. Implementar useEffect para dibujar ruta:
   - Convertir coordenadas OSRM a Leaflet
   - Crear polyline con estilo azul
   - Ajustar bounds del mapa
6. Agregar limpieza de ruta al desmontar

**Criterios de Aceptación:**
- [ ] Ruta se dibuja en el mapa al hacer clic en landmark
- [ ] Línea es visible y clara (azul, 5px grosor)
- [ ] Mapa se ajusta para mostrar toda la ruta
- [ ] Ruta se limpia correctamente al cerrar
- [ ] No hay memory leaks

**Archivos a modificar:**
- `frontend/app/components/map/InteractiveMap.tsx`

---

## Fase 2: UI/UX - Panel de Ruta (Día 2)

### Tarea 2.1: Crear componente RoutePanel
**Estimación**: 4 horas  
**Prioridad**: Alta  
**Dependencias**: 1.1, 1.2

**Pasos:**
1. Crear archivo `frontend/app/components/map/RoutePanel.tsx`
2. Implementar estructura básica con props
3. Crear sección de header con botón cerrar
4. Implementar selector de modo de transporte:
   - Botones para: a pie 🚶, bicicleta 🚴, auto 🚗
   - Destacar modo activo
   - Callback al cambiar
5. Agregar estados de carga y error
6. Implementar diseño responsive
7. Agregar animaciones de entrada/salida

**Criterios de Aceptación:**
- [ ] Panel aparece al calcular ruta
- [ ] Selector de transporte funciona correctamente
- [ ] Estados de carga muestran spinner
- [ ] Errores se muestran claramente
- [ ] Diseño es responsive (móvil y desktop)
- [ ] Animaciones son suaves

**Archivos a crear:**
- `frontend/app/components/map/RoutePanel.tsx`

---

### Tarea 2.2: Agregar resumen de ruta
**Estimación**: 2 horas  
**Prioridad**: Alta  
**Dependencias**: 2.1

**Pasos:**
1. Modificar `RoutePanel.tsx`
2. Crear sección de resumen con:
   - Distancia total (grande, destacada)
   - Tiempo estimado (grande, destacado)
   - Diseño atractivo con gradientes
3. Usar funciones de formato del servicio OSRM
4. Agregar iconos y colores distintivos

**Criterios de Aceptación:**
- [ ] Resumen es fácilmente legible
- [ ] Información es precisa
- [ ] Diseño visual es atractivo
- [ ] Responsive en móviles

**Archivos a modificar:**
- `frontend/app/components/map/RoutePanel.tsx`

---

### Tarea 2.3: Implementar instrucciones paso a paso
**Estimación**: 3 horas  
**Prioridad**: Media  
**Dependencias**: 2.2

**Pasos:**
1. Modificar `RoutePanel.tsx`
2. Agregar estado para mostrar/ocultar instrucciones
3. Crear botón "Ver Instrucciones"
4. Implementar lista de pasos:
   - Numeración clara
   - Instrucción legible
   - Nombre de calle (si disponible)
   - Distancia y tiempo por paso
5. Agregar scroll interno si la lista es larga
6. Implementar animación de expansión/colapso

**Criterios de Aceptación:**
- [ ] Instrucciones son claras y en español
- [ ] Lista es scrolleable si es larga
- [ ] Cada paso muestra información completa
- [ ] Animación de apertura es suave
- [ ] Funciona bien en móviles

**Archivos a modificar:**
- `frontend/app/components/map/RoutePanel.tsx`

---

### Tarea 2.4: Integrar RoutePanel en InteractiveMap
**Estimación**: 1 hora  
**Prioridad**: Alta  
**Dependencias**: 2.1, 2.2, 2.3

**Pasos:**
1. Modificar `InteractiveMap.tsx`
2. Importar componente `RoutePanel`
3. Agregar renderizado condicional del panel
4. Conectar callbacks:
   - `onModeChange` → recalcular ruta
   - `onClose` → limpiar ruta
5. Ajustar z-index para overlay correcto

**Criterios de Aceptación:**
- [ ] Panel aparece al calcular ruta
- [ ] Cambio de modo recalcula ruta
- [ ] Cerrar panel limpia la ruta del mapa
- [ ] Panel no bloquea otros controles

**Archivos a modificar:**
- `frontend/app/components/map/InteractiveMap.tsx`

---

## Fase 3: Mejoras y Pulido (Día 3)

### Tarea 3.1: Implementar apertura en apps de mapas nativas
**Estimación**: 2 horas  
**Prioridad**: Media  
**Dependencias**: 2.4

**Pasos:**
1. Modificar `InteractiveMap.tsx`
2. Crear función `handleOpenInMaps()`
3. Detectar sistema operativo:
   - iOS → `maps://` URL scheme
   - Android → `google.navigation://`
   - Web → Google Maps web
4. Construir URL con origen y destino
5. Agregar botón en RoutePanel
6. Probar en diferentes dispositivos

**Criterios de Aceptación:**
- [ ] Abre Apple Maps en iOS
- [ ] Abre Google Maps en Android
- [ ] Abre Google Maps web en desktop
- [ ] Pasa correctamente origen y destino
- [ ] Botón es claramente visible

**Archivos a modificar:**
- `frontend/app/components/map/InteractiveMap.tsx`
- `frontend/app/components/map/RoutePanel.tsx`

---

### Tarea 3.2: Mejorar manejo de errores
**Estimación**: 2 horas  
**Prioridad**: Alta  
**Dependencias**: Todas las anteriores

**Pasos:**
1. Crear tipos de error específicos en `osrm.ts`
2. Implementar mensajes de error claros:
   - Sin permiso de ubicación
   - Error de API
   - Sin conexión
   - Ruta no encontrada
3. Agregar UI para cada tipo de error en RoutePanel
4. Implementar botones de acción:
   - Reintentar
   - Solicitar permisos
   - Cambiar modo
5. Agregar logging para debugging

**Criterios de Aceptación:**
- [ ] Cada error tiene mensaje específico
- [ ] UI muestra errores claramente
- [ ] Botones de acción funcionan
- [ ] Errores son logeados para debug
- [ ] Usuario puede recuperarse de errores

**Archivos a modificar:**
- `frontend/lib/routing/osrm.ts`
- `frontend/hooks/useRouting.ts`
- `frontend/app/components/map/RoutePanel.tsx`

---

### Tarea 3.3: Agregar validaciones y casos edge
**Estimación**: 2 horas  
**Prioridad**: Media  
**Dependencias**: 3.2

**Pasos:**
1. Validar que el usuario tenga ubicación antes de calcular
2. Mostrar mensaje si no hay ubicación:
   - "Para calcular la ruta, necesitamos tu ubicación"
   - Botón para activar ubicación
3. Manejar caso de landmark muy cercano (< 50m)
4. Manejar caso de landmark muy lejano (> 100km)
5. Prevenir múltiples cálculos simultáneos
6. Agregar debouncing al cambio de modo

**Criterios de Aceptación:**
- [ ] No se calcula ruta sin ubicación del usuario
- [ ] Mensaje claro cuando falta ubicación
- [ ] Casos edge manejados apropiadamente
- [ ] No hay race conditions
- [ ] UX es fluida y sin bugs

**Archivos a modificar:**
- `frontend/app/components/map/InteractiveMap.tsx`
- `frontend/hooks/useRouting.ts`

---

### Tarea 3.4: Optimizaciones de rendimiento
**Estimación**: 2 horas  
**Prioridad**: Baja  
**Dependencias**: Todas las anteriores

**Pasos:**
1. Implementar caché de rutas en useRouting
2. Agregar debouncing a calculateRoute
3. Implementar cancelación de peticiones con AbortController
4. Optimizar re-renders con React.memo
5. Lazy load del componente RoutePanel
6. Medir y documentar mejoras

**Criterios de Aceptación:**
- [ ] Rutas se cachean correctamente
- [ ] No hay peticiones duplicadas
- [ ] Peticiones antiguas se cancelan
- [ ] Re-renders son mínimos
- [ ] Tiempos de carga mejorados > 20%

**Archivos a modificar:**
- `frontend/hooks/useRouting.ts`
- `frontend/app/components/map/RoutePanel.tsx`
- `frontend/app/components/map/InteractiveMap.tsx`

---

## Fase 4: Testing y Accesibilidad (Día 4)

### Tarea 4.1: Agregar ARIA labels y accesibilidad
**Estimación**: 2 horas  
**Prioridad**: Alta  
**Dependencias**: 2.4

**Pasos:**
1. Agregar ARIA labels a todos los botones:
   - `aria-label` descriptivos
   - `aria-pressed` para botones de modo
   - `role="navigation"` al panel
2. Implementar navegación por teclado:
   - Tab entre controles
   - Enter/Space para activar
   - Escape para cerrar
3. Agregar `aria-live` para anuncios dinámicos:
   - "Ruta calculada"
   - "Cargando ruta"
   - Errores
4. Verificar contraste de colores (WCAG AAA)
5. Probar con lector de pantalla

**Criterios de Aceptación:**
- [ ] Todos los controles tienen labels
- [ ] Navegación por teclado funciona 100%
- [ ] Anuncios dinámicos funcionan
- [ ] Contraste cumple WCAG AAA
- [ ] Funciona con NVDA/JAWS/VoiceOver

**Archivos a modificar:**
- `frontend/app/components/map/RoutePanel.tsx`
- `frontend/app/components/map/InteractiveMap.tsx`

---

### Tarea 4.2: Crear tests unitarios
**Estimación**: 3 horas  
**Prioridad**: Media  
**Dependencias**: Todas las de implementación

**Pasos:**
1. Crear `__tests__/lib/routing/osrm.test.ts`:
   - Test de `calculateRoute()` exitoso
   - Test de errores de API
   - Test de formateo de distancia/tiempo
   - Test de generación de instrucciones
2. Crear `__tests__/hooks/useRouting.test.ts`:
   - Test de estados iniciales
   - Test de cálculo de ruta
   - Test de cambio de modo
   - Test de limpieza de ruta
3. Mock de fetch API
4. Alcanzar >80% coverage

**Criterios de Aceptación:**
- [ ] Todos los tests pasan
- [ ] Coverage > 80%
- [ ] Tests son mantenibles
- [ ] Mocks son realistas

**Archivos a crear:**
- `frontend/__tests__/lib/routing/osrm.test.ts`
- `frontend/__tests__/hooks/useRouting.test.ts`

---

### Tarea 4.3: Testing manual y QA
**Estimación**: 2 horas  
**Prioridad**: Alta  
**Dependencias**: Todas

**Escenarios a probar:**
1. ✅ Calcular ruta con ubicación habilitada
2. ✅ Intentar calcular sin ubicación
3. ✅ Cambiar entre modos de transporte
4. ✅ Ver instrucciones paso a paso
5. ✅ Abrir en app de mapas nativa (iOS y Android)
6. ✅ Cerrar y abrir nueva ruta
7. ✅ Probar con conexión lenta
8. ✅ Probar sin conexión
9. ✅ Probar en móvil y desktop
10. ✅ Probar con lectores de pantalla

**Criterios de Aceptación:**
- [ ] Todos los escenarios funcionan
- [ ] No hay bugs críticos
- [ ] UX es fluida
- [ ] Performance es aceptable

**Documento a crear:**
- Checklist de QA con resultados

---

## Tareas Opcionales (Fase 5)

### Tarea 5.1: Implementar rutas alternativas
**Estimación**: 3 horas  
**Prioridad**: Baja

**Pasos:**
1. Modificar UI para mostrar múltiples rutas
2. Permitir selección entre rutas
3. Visualizar rutas alternativas en gris
4. Resaltar ruta seleccionada

---

### Tarea 5.2: Historial de rutas
**Estimación**: 3 horas  
**Prioridad**: Baja

**Pasos:**
1. Guardar rutas en localStorage
2. Crear componente de historial
3. Permitir recargar rutas pasadas
4. Limitar a últimas 10 rutas

---

### Tarea 5.3: Compartir rutas
**Estimación**: 2 horas  
**Prioridad**: Baja

**Pasos:**
1. Generar URL con parámetros de ruta
2. Botón de compartir en RoutePanel
3. Copiar al portapapeles
4. Soporte para Web Share API

---

## Resumen de Estimaciones

| Fase | Tareas | Tiempo Estimado |
|------|--------|-----------------|
| Fase 1: Core | 3 tareas | 8 horas (1 día) |
| Fase 2: UI/UX | 4 tareas | 10 horas (1.5 días) |
| Fase 3: Mejoras | 4 tareas | 8 horas (1 día) |
| Fase 4: Testing | 3 tareas | 7 horas (1 día) |
| **Total Crítico** | **14 tareas** | **33 horas (4-5 días)** |
| Fase 5: Opcionales | 3 tareas | 8 horas (1 día) |

---

## Dependencias Externas

- [ ] Acceso a API de OSRM (pública, sin costo)
- [ ] Permisos de ubicación del usuario
- [ ] Conexión a internet estable

---

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| API de OSRM caída | Media | Alto | Implementar fallback a API alternativa |
| Rate limiting | Baja | Medio | Implementar caché agresivo |
| Usuario rechaza permisos | Alta | Bajo | Mensaje claro y opción manual |
| Rutas imprecisas | Baja | Medio | Permitir reportar problemas |

---

## Checklist de Completitud

### Funcionalidad Core
- [ ] Calcular ruta al hacer clic en landmark
- [ ] Visualizar ruta en el mapa
- [ ] Mostrar distancia y tiempo
- [ ] Soportar 3 modos de transporte
- [ ] Instrucciones paso a paso

### UI/UX
- [ ] Panel de ruta atractivo
- [ ] Selector de modo intuitivo
- [ ] Responsive en móvil y desktop
- [ ] Animaciones suaves

### Robustez
- [ ] Manejo completo de errores
- [ ] Validación de casos edge
- [ ] Optimizaciones de rendimiento
- [ ] Tests unitarios >80% coverage

### Accesibilidad
- [ ] ARIA labels completos
- [ ] Navegación por teclado
- [ ] Anuncios con lectores de pantalla
- [ ] Contraste WCAG AAA

### Integración
- [ ] Abrir en apps nativas
- [ ] Sin conflictos con features existentes
- [ ] Documentación completa

---

**Estado**: 🟡 Pendiente de inicio  
**Última actualización**: 2025-11-20  
**Responsable**: Equipo de desarrollo

