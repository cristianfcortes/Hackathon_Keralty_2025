# ❤️ Sistema de Iconos de Corazón y Barra de Energía

## 📋 Resumen

Este documento describe la implementación del sistema de iconos personalizados con forma de corazón para los landmarks del mapa, y la barra de energía gamificada que incentiva la interacción del usuario.

---

## 💗 Sistema de Iconos de Corazón

### Categorías y Colores

Los landmarks se clasifican en 4 categorías, cada una con su propio color de corazón:

| Categoría | Color | Hex | Descripción |
|-----------|-------|-----|-------------|
| `medical` | 🔴 Rojo | `#EF4444` | Centros médicos, EPS, clínicas |
| `organizacion` | 💜 Púrpura | `#A855F7` | Organizaciones sociales y comunitarias |
| `servicios` | 💙 Azul | `#3B82F6` | Servicios comunitarios y de bienestar |
| `education` | 💚 Verde | `#10B981` | Educación (reservado para futuro) |

### Archivos SVG

Los iconos de corazón se encuentran en:
```
frontend/public/icons/
├── heart-red.svg
├── heart-purple.svg
├── heart-blue.svg
└── heart-green.svg
```

### Componente HeartIcon

**Ubicación:** `frontend/app/components/map/HeartIcon.tsx`

**Funciones principales:**
- `getHeartColor(category)` - Retorna el color según la categoría
- `getHeartIconHTML(category, size)` - Genera HTML del SVG para Leaflet
- `HeartIcon` - Componente React para renderizar el corazón

**Uso:**
```typescript
import HeartIcon from '@/app/components/map/HeartIcon';

<HeartIcon category="medical" size={32} />
```

### Integración con Leaflet

Los iconos se integran usando `L.divIcon`:

```typescript
const heartIcon = createHeartIcon(landmark.category);
const marker = L.marker([lat, lng], { icon: heartIcon });
```

**Efectos visuales:**
- Hover: Escala a 1.15x
- Drop shadow para destacar sobre el mapa
- Transiciones suaves

---

## ⚡ Sistema de Energía

### Barra de Energía

**Ubicación:** `frontend/app/components/energy/EnergyBar.tsx`

**Componentes visuales:**
1. **Corazones (5 máximo):**
   - ❤️ Lleno (energía alta)
   - 🖤 Vacío (sin energía)
   - Animación de pulso cuando energía < 30%

2. **Estadísticas:**
   - Energía actual / máxima (ej: 75/100)
   - Puntos acumulados
   - Color dinámico según nivel:
     - Verde (≥70%)
     - Amarillo (40-69%)
     - Rojo (<40%)

3. **Barra de progreso:**
   - Visual con gradiente de color
   - Transición suave al cambiar

4. **Advertencia:**
   - ⚠️ Mensaje cuando energía < 30%
   - Animación de pulso

### Hook de Energía

**Ubicación:** `frontend/hooks/useEnergy.ts`

**Estado:**
```typescript
{
  energy: number,           // 0-100
  maxEnergy: number,        // 100
  score: number,            // Puntos acumulados
  energyPercentage: number, // Porcentaje calculado
}
```

**Funciones:**
```typescript
increaseEnergy(amount: number, scoreIncrease: number)
decreaseEnergy(amount: number)
resetEnergy()
```

**Persistencia:**
- Guarda en `localStorage`
- Claves: `keralty_energy`, `keralty_score`
- Se restaura al recargar la página

---

## 🎮 Sistema de Recompensas

### Acciones que Aumentan Energía

| Acción | Energía | Puntos | Descripción |
|--------|---------|--------|-------------|
| **Visitar Landmark** | +10 | +10 | Al hacer clic en un marcador |
| **Confirmar Asistencia** | +20 | +25 | Al confirmar visita a un lugar |

### Valores Iniciales

- **Energía inicial:** 60/100
- **Score inicial:** 0
- **Energía máxima:** 100

### Lógica de Interacción

**En `frontend/app/page.tsx`:**

```typescript
const handleMarkerClick = (landmark) => {
  // Abrir modal
  setSelectedLandmark(landmark);
  setIsModalOpen(true);
  
  // Recompensa por visitar
  increaseEnergy(10, 10);
};

const handleConfirmAttendance = (landmarkId) => {
  // Confirmar asistencia
  await confirmAttendance(landmarkId);
  
  // Recompensa por confirmar
  increaseEnergy(20, 25);
};
```

---

## 📍 Posicionamiento

### Barra de Energía

```css
position: absolute
top: 16px (4 en Tailwind)
left: 16px (4 en Tailwind)
z-index: 1000
```

### Responsividad

En móviles (< 640px):
```css
transform: scale(0.85)
transform-origin: top left
```

---

## 🎨 Estilos CSS

**Ubicación:** `frontend/style/globals.css`

### Marcadores de Corazón

```css
.custom-heart-marker {
  background: transparent !important;
  border: none !important;
}

.custom-heart-marker:hover svg {
  transform: scale(1.15);
}
```

### Animaciones

```css
@keyframes energy-increase {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
```

---

## 🔧 Configuración Técnica

### Tipos TypeScript

**Landmark Type** (`frontend/types/landmark.ts`):
```typescript
interface Landmark {
  id: string;
  name: string;
  description: string;
  coordinates: { lat: number; lng: number };
  category?: string; // 'medical' | 'organizacion' | 'servicios' | 'education'
  // ...
}
```

### Datos de Landmarks

**Ubicación:** `frontend/data/landmarks.json`

Cada landmark debe tener un campo `category`:
```json
{
  "id": "landmark-001",
  "name": "Centro Médico",
  "category": "medical",
  // ...
}
```

---

## 🚀 Uso

### Integración Completa

```typescript
import { useEnergy } from '@/hooks/useEnergy';
import EnergyBar from '@/components/energy/EnergyBar';

export default function MapPage() {
  const { energy, maxEnergy, score, increaseEnergy } = useEnergy();
  
  return (
    <div className="relative w-full h-screen">
      {/* Mapa */}
      <Map landmarks={landmarks} />
      
      {/* Barra de Energía */}
      <div className="absolute top-4 left-4 z-[1000]">
        <EnergyBar
          currentEnergy={energy}
          maxEnergy={maxEnergy}
          score={score}
        />
      </div>
    </div>
  );
}
```

---

## 📊 Datos de Ejemplo

### Distribución de Categorías (landmarks.json)

- **medical:** 2 landmarks (Centro Médico Sanitas, EPS Sanitas)
- **organizacion:** 4 landmarks (Ceder, Club Rotario, Corporaciones)
- **servicios:** 1 landmark (Confa - Adulto Mayor)
- **education:** 0 landmarks (reservado)

---

## 🎯 Futuras Mejoras

### Posibles Expansiones

1. **Sistema de Niveles:**
   - Nivel 1: 0-100 puntos
   - Nivel 2: 101-250 puntos
   - Etc.

2. **Achievements:**
   - "Explorador": Visitar 5 landmarks
   - "Comprometido": Confirmar 10 asistencias
   - "Maestro": Alcanzar 500 puntos

3. **Degradación de Energía:**
   - -5 energía cada 5 minutos de inactividad
   - Timer automático

4. **Notificaciones:**
   - Toast al ganar energía/puntos
   - Celebración al subir de nivel

5. **Más Categorías:**
   - Agregar categoría `education` (verde)
   - Categoría `emergency` (naranja)

---

## 🐛 Troubleshooting

### Iconos no aparecen

1. Verificar que los SVG existan en `/public/icons/`
2. Verificar que `category` esté en el landmark
3. Revisar console para errores de Leaflet

### Energía no se guarda

1. Verificar que localStorage esté habilitado
2. Limpiar cache del navegador
3. Verificar console para errores

### Estilos CSS no aplican

1. Verificar que `globals.css` esté importado
2. Verificar z-index de otros elementos
3. Revisar responsive breakpoints

---

## 📝 Checklist de Implementación

- ✅ SVG de corazones en 4 colores
- ✅ Componente HeartIcon
- ✅ Integración con Leaflet markers
- ✅ Hook useEnergy
- ✅ Componente EnergyBar
- ✅ Posicionamiento en esquina superior izquierda
- ✅ Lógica de recompensas
- ✅ Persistencia en localStorage
- ✅ Estilos CSS y animaciones
- ✅ Responsividad móvil
- ✅ Sin errores de linter

---

**Implementado por:** AI Assistant
**Fecha:** 2024
**Versión:** 1.0.0

