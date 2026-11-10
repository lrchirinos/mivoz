# MiVoz — PWA & App Android de Comunicación Aumentativa (CAA / AAC)

> 📘 **Documentación y Arquitectura del Proyecto:** Consulta [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md) para conocer las reglas clínicas obligatorias (control de eventos táctiles, cooldown anti-temblor, arquitectura de audio offline y proceso de compilación del APK en GitHub Actions).

**MiVoz** es una aplicación de Comunicación Aumentativa y Alternativa de grado clínico diseñada para pacientes con afasia expresiva y hemiparesia severa (post-ACV / Ictus).

## Características Principales
- **Voz Masculina Neuronal Offline por Defecto:** Audios pre-renderizados a 0ms de latencia para botones principales, SÍ, NO y frases de auxilio, más motor local WASM Piper (`es_MX-ald-medium`).
- **Control Motor Seguro:** Activación instantánea en `onPointerDown` (sin fallos por arrastre de dedo).
- **Protección Anti-Temblor:** Cooldown visual configurable (2.5s clínico por defecto).
- **Botones Binarios Gigantes:** SÍ y NO sobredimensionados para respuesta rápida.
- **Grabación de Voz Real:** Permite a familiares grabar audios reales para cada botón con el micrófono.
- **Modo Cuidador Protegido:** Desbloqueo mediante pulsación continua de 3 segundos.
- **Kiosko y Wake Lock:** Pantalla siempre encendida sin apagarse durante el uso.

## Scripts
- `npm run dev` — Servidor de desarrollo Vite.
- `npm run build` — Compilación de producción (`dist/`).
- `npm run lint` — Validación de código con Oxlint.
- `npx cap sync android` — Sincronización de assets web a la app Android.
