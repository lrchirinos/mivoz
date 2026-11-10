# Lista de Tareas: PWA de Comunicación Aumentativa y Alternativa (CAA / AAC)

## Fase 1: Entorno, Dependencias y Tipado Base
- [x] Task 1.1: Instalar y configurar Tailwind CSS (o Tailwind v4 con Vite) y verificar renderizado con Lucide React.
- [x] Task 1.2: Definir modelos y contratos TypeScript en `src/types/aac.ts` (AACButton, CaregiverSettings, SpeechOptions, ColorTheme, etc.).
- [x] Task 1.3: Crear catálogo de datos iniciales en `src/constants/defaultButtons.ts`, lista de iconos (`src/constants/icons.ts`) y temas de color en `src/constants/colorThemes.ts`.

## Checkpoint 1: Base configurada y tipos compilando sin error.

## Fase 2: Servicios de Audio y Hooks de Dispositivo
- [x] Task 2.1: Implementar `src/services/audioService.ts` con Web Audio API (chime armónico de 3 tonos y alarma urgente de dolor/emergencia de 2 tonos pulsantes).
- [x] Task 2.2: Implementar hook `src/hooks/useSpeech.ts` integrando Web Speech API (`speechSynthesis`), pre-chime de 300ms, selección de voz en español, y cooldown global de 2.5s con tiempo restante.
- [x] Task 2.3: Implementar hooks de dispositivo: `src/hooks/useWakeLock.ts` (prevención de apagado de pantalla con auto-reactivación al volver a la pestaña) y `src/hooks/useFullscreen.ts`.
- [x] Task 2.4: Implementar servicio de persistencia `src/services/storageService.ts` con `localStorage` y validación de esquema.

## Checkpoint 2: Motores de voz, audio, wakeLock y storage probados y operativos.

## Fase 3: Tablero Principal del Paciente (PatientBoard & AACCard)
- [x] Task 3.1: Diseñar componente `AACCard.tsx` con activación estricta en `onPointerDown`, número gigante (1-6) en esquina, icono de trazo grueso `strokeWidth={2.5}`, frase en mayúsculas de alto contraste y feedback táctil físico.
- [x] Task 3.2: Diseñar barra rápida `QuickActionBar.tsx` con botones gigantes de respuesta binaria "SÍ" (Verde Esmeralda) y "NO" (Rojo Coral) y botón "HABLAR / ESCRIBIR".
- [x] Task 3.3: Integrar `PatientBoard.tsx` en layout fijo 100vw x 100vh sin scroll (`touch-none`, `select-none`, prevención de contextmenu y zoom), grilla 2x3 responsive, y barra visual de cooldown anti-temblor.

## Checkpoint 3: Tablero del paciente completamente funcional y accesible.

## Fase 4: Modal de Expresión Libre (CustomPhraseModal)
- [x] Task 4.1: Construir `CustomPhraseModal.tsx` con visualizador de texto en tamaño gigante, frases predefinidas de uso frecuente ("GRACIAS", "TENGO FRÍO", "QUIERO DORMIR", etc.), teclado táctil grande adaptado para motricidad gruesa, y botón de emisión vocal inmediata.

## Checkpoint 4: Módulo de escritura libre validado.

## Fase 5: Modo Familiar / Edición Protegido
- [x] Task 5.1: Construir botón de desbloqueo `UnlockButton.tsx` con protección de pulsación continua de 3 segundos (temporizador visual de carga con cancelación al soltar).
- [x] Task 5.2: Construir modal de configuración familiar `CaregiverModal.tsx` con edición de cualquiera de los 6 botones (texto de botón, frase hablada, selector de icono clínico, color), botón de prueba de voz y botón de restablecimiento de valores de fábrica.
- [x] Task 5.3: Agregar configuración de voz (selector de voz instalada en el sistema, velocidad de habla, duración de cooldown anti-temblor, prueba de campana/alarma).

## Checkpoint 5: Modo familiar seguro y parametrizable funcionando al 100%.

## Fase 6: Metadatos PWA, Estética de Grado Clínico y Verificación Final
- [x] Task 6.1: Configurar `index.html` con meta tags para PWA, bloqueo de zoom de pellizco, tema de color y manifiesto PWA (`manifest.json` y favicon SVG clínico).
- [x] Task 6.2: Ejecutar build de producción (`npm run build`), verificar ausencia de errores de TypeScript y linting.
- [x] Task 6.3: Preparar reporte final y puesta en marcha del servidor de desarrollo con acceso en red local (`--host`).

## Fase 7: Perfil Masculino por Defecto, Grabador Offline, Capacitor TTS y UI Refinada
- [x] Task 7.1: Actualizar tipos en `src/types/aac.ts` para Perfiles de Voz (`VoiceProfileId`), modulación acústica masculina (`pitch: 0.72`, `rate: 0.92`), y soporte de audios grabados por botón.
- [x] Task 7.2: Implementar `src/services/voiceRecordStorage.ts` con IndexedDB para guardar y reproducir audios reales de micrófono por botón (1-6 y SÍ/NO).
- [x] Task 7.3: Actualizar `src/hooks/useSpeech.ts` integrando detección inteligente de voz masculina (filtros `male`, `jorge`, `pablo`, `diego`, `carlos`, `raul`, etc.), perfiles acústicos masculinos por defecto, y compatibilidad nativa con `@capacitor-community/text-to-speech`.
- [x] Task 7.4: Refinar `AACCard.tsx` para botón 5 (máximo contraste y urgencia) y margen inferior seguro (`pb-2.5 sm:pb-3.5`) para que textos de 2 líneas nunca toquen el borde.
- [x] Task 7.5: Actualizar `QuickActionBar.tsx` para agrandar el botón de **TECLADO** (abrir expresión libre) ubicado estratégicamente junto a **SÍ** y **NO**.
- [x] Task 7.6: En `CaregiverModal.tsx` (y sus subcomponentes):
  - Añadir grabador de voz con micrófono (`MediaRecorder`) en el editor de botones con vista previa de audio, botón grabar, escuchar y borrar.
  - Añadir selector de Perfil de Voz con 1 solo toque (Masculina Natural por defecto, Masculina Profunda, Femenina/Estándar) y botón "Probar Voz Masculina".
- [x] Task 7.7: Ejecutar `npm run lint` y `npm run build`, y verificar funcionamiento sin errores.
