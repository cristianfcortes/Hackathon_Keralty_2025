# 002: Cálculo de Ruta Óptima a Puntos de Referencia

## 📋 Información General

- **ID**: 002-route-calculation-feature
- **Estado**: 🟡 Propuesta
- **Prioridad**: Alta
- **Fecha de Creación**: 2025-11-20
- **Estimación**: 3-4 días de desarrollo

---

## 📄 Documentos

### [spec.md](./spec.md)
**Especificación técnica completa** que incluye:
- Resumen ejecutivo y objetivos
- Arquitectura de la solución
- Implementación detallada con código
- Flujos de usuario
- Consideraciones de accesibilidad
- Manejo de errores
- Métricas de éxito

### [tasks.md](./tasks.md)
**Plan de implementación detallado** dividido en:
- **Fase 1**: Core - Servicio de enrutamiento (1 día)
- **Fase 2**: UI/UX - Panel de ruta (1.5 días)
- **Fase 3**: Mejoras y pulido (1 día)
- **Fase 4**: Testing y accesibilidad (1 día)

Total: **14 tareas principales** con estimaciones, criterios de aceptación y dependencias.

### [diagrams.md](./diagrams.md)
**Diagramas visuales** en formato Mermaid:
- Flujo de datos principal
- Arquitectura de componentes
- Diagrama de estados
- Secuencia de cálculo
- Modelo de datos
- Flujo de manejo de errores

---

## 🎯 Descripción

Esta feature permite a los usuarios calcular y visualizar rutas óptimas desde su ubicación actual hasta cualquier punto de referencia (landmark) en el mapa.

### Características Principales

✅ **Cálculo Automático**: Ruta se calcula al hacer clic en un landmark  
✅ **3 Modos de Transporte**: A pie 🚶, bicicleta 🚴, auto 🚗  
✅ **Visualización en Mapa**: Ruta dibujada con línea azul clara  
✅ **Información Detallada**: Distancia, tiempo estimado, instrucciones paso a paso  
✅ **Integración Nativa**: Abrir en Google Maps o Apple Maps  
✅ **Accesible**: WCAG AAA, navegación por teclado, lectores de pantalla

---

## 🛠️ Tecnologías

- **API de Enrutamiento**: [OSRM](http://project-osrm.org/) (gratuito)
- **Mapa**: Leaflet.js (ya implementado)
- **Tipos**: TypeScript
- **Hooks**: React custom hooks
- **UI**: Tailwind CSS

---

## 📊 Arquitectura

```
InteractiveMap
    ↓
useRouting Hook
    ↓
OSRM Service
    ↓
OSRM Public API
```

### Componentes Nuevos

1. **`lib/routing/osrm.ts`** - Servicio de comunicación con OSRM
2. **`hooks/useRouting.ts`** - Hook para gestión de estado de rutas
3. **`components/map/RoutePanel.tsx`** - Panel UI con información de ruta
4. **Modificación**: `components/map/InteractiveMap.tsx` - Integración

---

## 🚀 Estados

- [x] Especificación creada
- [x] Plan de tareas definido
- [x] Diagramas completados
- [ ] Aprobación de Product Owner
- [ ] Aprobación de Tech Lead
- [ ] Aprobación de UX Designer
- [ ] Implementación iniciada
- [ ] Testing completado
- [ ] Documentación actualizada
- [ ] Deploy a producción

---

## 📈 Métricas de Éxito

| Métrica | Objetivo |
|---------|----------|
| Tasa de uso | > 60% de usuarios calculan al menos 1 ruta |
| Tiempo de cálculo | < 2 segundos promedio |
| Tasa de error | < 5% de solicitudes fallidas |
| Satisfacción | Rating positivo > 80% |

---

## 🔗 Enlaces Relacionados

- [Especificación completa](./spec.md)
- [Plan de tareas](./tasks.md)
- [Diagramas](./diagrams.md)
- [OSRM Documentation](http://project-osrm.org/)
- [Leaflet Routing](https://www.lrm.io/)

---

## 👥 Equipo

- **Autor**: Asistente AI
- **Revisor Técnico**: Pendiente
- **Revisor UX**: Pendiente
- **Product Owner**: Pendiente

---

**Última actualización**: 2025-11-20

