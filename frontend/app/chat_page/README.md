# Chat con Kery - Asistente Virtual de Keralty

## 🤖 Características

### Mensaje de Bienvenida Automático
- Al entrar a la página, Kery saluda automáticamente después de 0.5 segundos
- El mensaje se escribe con animación tipo LLM (Large Language Model)
- Incluye información sobre las capacidades del bot

### Respuestas Inteligentes Simuladas
Kery puede responder preguntas sobre:
- 📍 **Ubicaciones**: Información sobre sedes de Keralty
- 👨‍⚕️ **Profesionales**: Directorio de médicos y especialistas
- 📅 **Citas**: Proceso de agendamiento
- 🏥 **Servicios**: Servicios de salud disponibles
- ♿ **Accesibilidad**: Información sobre accesibilidad en las sedes

### Animación de Escritura (Typing Effect)
- Cada respuesta del bot se escribe carácter por carácter
- Velocidad configurable (30ms por defecto)
- Cursor parpadeante durante la escritura
- Simula la experiencia de un LLM real

### Indicador de Estado
- Muestra cuando el bot está "pensando" con animación de puntos
- Indicador verde de "en línea"
- Avatar distintivo para Kery (letra K en círculo con degradado)

### Experiencia de Usuario
- Interfaz limpia y moderna
- Diferenciación visual entre mensajes del usuario y del bot
- Marca de tiempo en cada mensaje
- Auto-scroll a nuevos mensajes
- Atajos de teclado:
  - `Enter`: Enviar mensaje
  - `Shift + Enter`: Nueva línea
  - `Esc`: Limpiar input

## 🎨 Diseño

- **Colores**: Degradado azul-púrpura para Kery, azul para usuario
- **Tipografía**: Clara y legible
- **Espaciado**: Mensajes bien separados para fácil lectura
- **Responsivo**: Funciona en móviles y escritorio

## 🧠 Inteligencia del Bot

El bot usa reconocimiento de patrones en las preguntas para determinar respuestas apropiadas:
- Detección de saludos
- Reconocimiento de preguntas sobre ubicaciones
- Identificación de consultas sobre profesionales
- Detección de solicitudes de citas
- Respuestas sobre accesibilidad

Cada tipo de pregunta tiene múltiples respuestas posibles para mayor variedad.

## 📝 Uso

```typescript
import { useKeryChat } from '@/hooks/useKeryChat';

const { messages, isLoading, sendMessage } = useKeryChat();

// Enviar mensaje
await sendMessage("¿Dónde están ubicadas las sedes?");
```

## 🔧 Personalización

Para agregar nuevas respuestas o categorías, editar `frontend/lib/keryBot.ts`:

```typescript
const KERY_KNOWLEDGE = {
  // Agregar nueva categoría
  nuevaCategoria: [
    "Respuesta 1",
    "Respuesta 2",
  ],
};
```

