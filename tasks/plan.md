# Plan de Implementación: PWA de Comunicación Aumentativa y Alternativa (CAA / AAC) de Grado Clínico

## Resumen del Proyecto
Desarrollar una Progressive Web App (PWA) de Comunicación Aumentativa y Alternativa (CAA / AAC) diseñada para pacientes post-ACV (derrame cerebral) con afasia expresiva y hemiparesia severa (uso de una sola mano con control motor fino reducido). La aplicación debe operar 100% offline, con audio Web Speech + Web Audio Chime de alerta para familiares, anti-temblor de 2.5s, activación inmediata en `onPointerDown`, codificación visual triple (número gigante 1-6 + icono `strokeWidth={2.5}` + texto en mayúsculas), bloqueo de gestos accidentales, modo paciente fijo 100vw x 100vh, y modo familiar protegido por pulsación larga continua de 3 segundos.

---

## Decisiones de Arquitectura
1. **React 19 + TypeScript + Vite + Tailwind CSS + Lucide React**:
   - PWA ligera, rápida, sin dependencias externas pesadas.
   - Tailwind CSS para diseño de alto contraste, bordes gruesos de 4px, y escala de botones táctiles.
   - Lucide React con trazo engrosado (`strokeWidth={2.5}`) para máxima legibilidad clínica.
2. **Eventos Motores & Accesibilidad (`onPointerDown` vs `onClick`)**:
   - Pacientes con hemiparesia o temblores involuntarios deslizan o arrastran los dedos. El evento estándar `onClick` se cancela en la mayoría de navegadores móviles si hay un movimiento de arrastre. Por tanto, todas las tarjetas del tablero del paciente usarán `onPointerDown` con prevención de comportamientos por defecto indeseados.
   - Bloqueo global de cooldown (2.5s por defecto, configurable de 1.5s a 5s) con feedback visual de progreso (barra animada o borde pulsante) para prevenir disparos repetidos por espasmos o toques involuntarios.
3. **Audio de Doble Capa (Web Audio API + Web Speech API)**:
   - Capa 1: Web Audio API sintetiza un tono chime melódico (C5-E5-G5 de campana suave) 300ms antes de la voz, o un tono de alarma urgente (dos tonos pulsantes intensos) en el botón de dolor/emergencia. Esto despierta o alerta a cuidadores en habitaciones contiguas.
   - Capa 2: Web Speech API sintetiza la frase en español (`es-PE`, `es-ES`, `es-MX`, `es-*`), a velocidad pausada (`rate: 0.9`).
4. **Protección de Modo Familiar (3-segundos Hold-to-Unlock)**:
   - Previene que el paciente entre por error a la configuración y descalibre la interfaz.
   - Implementado con temporizador visual circular/lineal que requiere contacto ininterrumpido durante 3000ms. Si se levanta el dedo antes, se aborta y reinicia inmediatamente.
5. **Persistencia Local Segura**:
   - `localStorage` con esquema versionado y tipado para guardar botones personalizados, ajustes de voz, cooldown y frases rápidas, con botón de restauración a configuración de fábrica.
6. **Políticas de Pantalla y PWA**:
   - `Screen Wake Lock API` activa para que la tablet nunca apague la pantalla en la mesa del paciente.
   - Fullscreen API para modo Kiosko sin distracciones.
   - Viewport meta sin zoom de pellizco (`user-scalable=no`).

---

## Estructura de Archivos
```
├── tasks/
│   ├── plan.md
│   └── todo.md
├── public/
│   ├── manifest.json
│   ├── favicon.svg
│   └── icon-192.png / icon-512.png
├── src/
│   ├── types/
│   │   └── aac.ts                     # Definiciones de tipos: AACButton, CaregiverSettings, SpeechState, etc.
│   ├── constants/
│   │   ├── defaultButtons.ts          # Los 6 botones iniciales con textos, colores e iconos clínicos
│   │   ├── icons.ts                   # Catálogo de iconos Lucide disponibles para selección
│   │   └── colorThemes.ts             # Paletas de alto contraste accesibles
│   ├── services/
│   │   ├── audioService.ts            # Web Audio API: Chimes suaves y alarmas de emergencia
│   │   └── storageService.ts          # Persistencia en localStorage con defaults y validación
│   ├── hooks/
│   │   ├── useSpeech.ts               # Hook de Web Speech API con chime integrado y cooldown
│   │   ├── useWakeLock.ts             # Hook de Screen Wake Lock API con re-adquisición automática
│   │   └── useFullscreen.ts           # Hook de pantalla completa
│   ├── components/
│   │   ├── PatientBoard/
│   │   │   ├── PatientBoard.tsx       # Tablero principal 100vw x 100vh
│   │   │   ├── QuickActionBar.tsx     # Barra rápida: SÍ, NO, HABLAR, Cuidador (Hold 3s)
│   │   │   ├── AACCard.tsx            # Tarjeta gigante con número, icono y texto
│   │   │   └── CooldownOverlay.tsx    # Indicador visual de anti-temblor
│   │   ├── CustomPhraseModal/
│   │   │   └── CustomPhraseModal.tsx  # Modal de frase libre, teclado táctil gigante y frases rápidas
│   │   ├── CaregiverModal/
│   │   │   ├── CaregiverModal.tsx     # Modal familiar completo con pestañas
│   │   │   ├── ButtonEditor.tsx       # Editor individual de botones 1-6
│   │   │   ├── VoiceSettings.tsx      # Selector de voz, velocidad, tono, cooldown
│   │   │   └── UnlockButton.tsx       # Botón discreto con indicador de 3 segundos continuo
│   │   └── common/
│   │       └── HeaderBar.tsx          # Barra superior con estado de batería/wakelock y modo pantalla completa
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
```

---

## Fases de Implementación
- **Fase 1: Configuración de Dependencias y Tipado Base**: Instalar Tailwind, Lucide, configurar Vite y definir `src/types/aac.ts`, `src/constants/*`.
- **Fase 2: Servicios de Audio y Hooks de Dispositivo**: Implementar `audioService.ts` (Web Audio API), `useSpeech.ts` (Web Speech API + Chime + Cooldown), `useWakeLock.ts` y `useFullscreen.ts`.
- **Fase 3: Tablero Principal del Paciente (PatientBoard & AACCard)**: Crear la grilla 2x3 de alto contraste, activación `onPointerDown`, barra anti-temblor y barra de respuesta rápida SÍ / NO.
- **Fase 4: Modal de Expresión Libre (CustomPhraseModal)**: Teclado táctil adaptado para motricidad reducida, banco de frases comunes y botón de emisión.
- **Fase 5: Modo Familiar / Edición Protegido**: Botón con 3 segundos de pulsación continua, editor de los 6 botones, selector de voces de sistema y ajustes.
- **Fase 6: PWA, Accesibilidad y Verificación**: Metadatos PWA, prevención de gestos accidentales, compilación `npm run build` y validación de ejecución.