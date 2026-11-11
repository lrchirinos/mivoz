# MiVoz — Manual Integral de Contexto, Arquitectura y Despliegue

> **IMPORTANTE PARA CUALQUIER AGENTE DE IA O DESARROLLADOR:**  
> Este documento contiene el contexto histórico, las restricciones clínicas inviolables, la arquitectura de audio y el flujo de compilación nativa de **MiVoz**. Léelo atentamente antes de realizar cualquier cambio en el código.

---

## 1. Identidad y Repositorio del Proyecto
- **Nombre de la Aplicación:** codegeass (anteriormente MiVoz / Vocalis AAC)
- **ID de Paquete Android:** `com.mivoz.app`
- **Repositorio Oficial:** `https://github.com/lrchirinos/mivoz.git`
- **Rama Principal:** `main`
- **Tipo de Proyecto:** Aplicación Híbrida — Progressive Web App (PWA) + Aplicación Nativa Android con Capacitor 8.
- **Público Objetivo Clínico:** Pacientes post-Accidente Cerebrovascular (ACV / Ictus) que cursan con **afasia expresiva** (imposibilidad de emitir lenguaje oral inteligible) y **hemiparesia severa** (pérdida funcional de un hemicuerpo con control motor fino reducido en la mano hábil remanente).

---

## 2. Reglas Clínicas Inviolables (No Modificar sin Aprobación)

### 2.1 CERO eventos `onClick` (Usar siempre `onPointerDown`)
- **Razón médica:** Los pacientes con paresia o hipertonía muscular arrastran el dedo involuntariamente al tocar la pantalla.
- **Fallo del `onClick`:** Los navegadores móviles cancelan el evento `click` si detectan desplazamiento (`drag threshold`), dejando al paciente incomunicado.
- **Regla:** Todos los botones de acción del paciente deben activarse en el evento `onPointerDown` con `e.preventDefault()`.

### 2.2 Sistema Anti-Temblor (Visual Cooldown Obligatorio)
- **Razón médica:** Espasmos o temblores de intención provocan pulsaciones múltiples accidentales en menos de un segundo.
- **Regla:** Al tocar cualquier tarjeta se activa un bloqueo temporal configurable (2.5 segundos por defecto) con barra visual de progreso. Durante el cooldown no se aceptan nuevos disparos.

### 2.3 Orientación Fija en Horizontal (Landscape Permanente)
- **Razón médica:** Evitar desorientación espacial o giros accidentales por el temblor de la cama o soporte.
- **Configuración:**
  - Android: `android:screenOrientation="sensorLandscape"` en `AndroidManifest.xml`.
  - PWA: `"orientation": "landscape"` en `public/manifest.json`.
  - Grid: 3 columnas x 2 filas en el tablero principal.

### 2.4 Pantalla Completa Inmersiva por Defecto (Sin Barras de Sistema)
- **Razón médica:** Evitar que el paciente cierre o minimice la app accidentalmente al tocar los bordes o los botones del sistema.
- **Configuración:**
  - `MainActivity.java`: `WindowInsetsControllerCompat.hide(WindowInsetsCompat.Type.systemBars())` con `BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE`.
  - `styles.xml`: `<item name="android:windowFullscreen">true</item>`.
  - Notches / Cámaras: `LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES` activo para ocupar el 100% de la pantalla sin franjas negras.

### 2.5 Pantalla Siempre Encendida (Wake Lock)
- **Razón médica:** El paciente no debe encontrar el dispositivo apagado en un momento de auxilio o necesidad fisiológica.
- **Configuración:** `WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON` en `MainActivity.java` y hook `useWakeLock` vía Screen Wake Lock API en web.

### 2.6 Acceso Protegido al Modo Cuidador (Pulsación de 3 Segundos)
- El botón de ajustes para familiares requiere mantener presionado de forma continua durante 3 segundos con indicador circular. Previene que el paciente desconfigure sus botones por error.

---

## 3. Arquitectura del Sistema de Audio y Voz

El sistema utiliza una arquitectura híbrida de **Voz Masculina Offline Garantizada**:

```
[Paciente presiona Botón]
        │
        ▼
¿Tiene audio grabado con micrófono?
   ├── SÍ ──► Reproduce audio humano instantáneo (Base64 / IndexedDB: 'mivoz_audio_*')
   └── NO ──► ¿Existe audio pre-renderizado en cache?
                ├── SÍ ──► Reproduce audio neuronal 0ms ('/audio/male/*.mp3')
                └── NO ──► Síntesis local con Piper WASM TTS ('es_MX-ald-medium.onnx')
```

1. **Audios Pre-renderizados (Latencia 0ms):**
   - Ubicados en `public/audio/male/` para los 6 botones estándar (`btn-1.mp3` a `btn-6.mp3`), SÍ (`btn-yes.mp3`), NO (`btn-no.mp3`), presentación (`btn-whoami.mp3`) y frases rápidas.
2. **Motor Neuronal WebAssembly Offline (Piper TTS):**
   - Modelo: `public/piper/es_MX-ald-medium.onnx` y `es_MX-ald-medium.onnx.json`.
   - Se ejecuta 100% en el dispositivo con `onnxruntime-web` para sintetizar frases nuevas creadas por la familia o frases libres desde el teclado.
   - Guarda el `.wav` resultante en `IndexedDB` (`mivoz_tts_cache`) para que la segunda vez que se presione suene al instante.
3. **Grabación de Voz Real (Micrófono):**
   - En el modal de cuidador, cada botón permite grabar la voz real de un familiar querido mediante `MediaRecorder`, almacenándose localmente.

---

## 4. Arquitectura Android y Capacitor

- **Versión de Capacitor:** `@capacitor/core` y `@capacitor/android` v8.x.
- **Versión de Java:** JDK 21 (Eclipse Temurin).
- **Versión de Android SDK:**
  - `compileSdkVersion = 36` (Obligatorio: la dependencia `androidx.core:core:1.17.0` que integra Capacitor 8 rechaza compilar con SDK 35 o inferior).
  - `targetSdkVersion = 36`.
  - `minSdkVersion = 24` (Android 7.0+).
- **AAPT (Compresión de Assets):**  
  En `android/app/build.gradle` está configurado:
  ```groovy
  aaptOptions {
      noCompress = ['onnx', 'wasm', 'mp3', 'wav', 'bin']
  }
  ```
  Esto evita que Gradle comprima o dañe los pesos de los modelos neuronales y audios en el APK.
- **Permisos Activos:** `INTERNET`, `RECORD_AUDIO`, `WAKE_LOCK`, `MODIFY_AUDIO_SETTINGS`, y `largeHeap="true"`.

---

## 5. Compilación y Despliegue en CI/CD (GitHub Actions)

Como el entorno local puede carecer del SDK completo de Android o herramientas pesadas de compilación, el empaquetado del archivo `.apk` está automatizado mediante GitHub Actions:

- **Archivo de Workflow:** [`.github/workflows/build-apk.yml`](file:///.github/workflows/build-apk.yml)
- **Disparador:** Automático al hacer `git push origin main` o manual desde la pestaña "Actions" en GitHub.
- **Pasos del Workflow:**
  1. Clona el repositorio con Node 22 y Java 21 Temurin.
  2. Descarga e instala los paquetes oficiales de Android SDK 36 (`platforms;android-36`, `build-tools;36.0.0`).
  3. Ejecuta `npm ci` y `npm run build`.
  4. Sincroniza Capacitor (`npx cap sync android`).
  5. Compila el APK nativo con `./gradlew assembleDebug`.
  6. Sube el artefacto **`MiVoz-apk`** con el instalador final **`MiVoz.apk`**.

### Cómo descargar el APK generado:
1. Ir al repositorio: [https://github.com/lrchirinos/mivoz](https://github.com/lrchirinos/mivoz)
2. Hacer clic en la pestaña **Actions**.
3. Seleccionar la última ejecución exitosa (marcada con check verde ✅).
4. Bajar hasta la sección **Artifacts** y descargar **`MiVoz-apk`**.
5. Descomprimir el ZIP y abrir `MiVoz.apk` en el teléfono móvil.

---

## 6. Comandos de Desarrollo Frecuentes

```bash
# Iniciar servidor de desarrollo web local
npm run dev

# Generar bundle de producción web en dist/
npm run build

# Sincronizar cambios web hacia el proyecto nativo de Android
npx cap sync android

# Subir cambios al repositorio remoto y disparar compilación de nuevo APK
git add .
git commit -m "feat/fix: descripcion del cambio"
git push origin main
```

---

## 7. Estructura de Directorios Clave

```
mivoz/
├── .github/workflows/build-apk.yml    # Pipeline CI/CD para compilar APK
├── android/                          # Proyecto nativo Android (Capacitor)
│   ├── app/src/main/
│   │   ├── AndroidManifest.xml       # Permisos, orientación sensorLandscape
│   │   ├── java/com/mivoz/app/       # MainActivity.java (inmersivo, keep screen on)
│   │   └── res/values/styles.xml     # Tema sin action bar y con windowFullscreen
│   └── variables.gradle              # compileSdkVersion = 36, targetSdkVersion = 36
├── public/
│   ├── audio/male/                   # Audios base masculinos 0ms (mp3)
│   ├── piper/                        # Modelo local es_MX-ald-medium.onnx
│   └── manifest.json                 # PWA manifest (fullscreen, landscape)
├── src/
│   ├── components/
│   │   ├── CaregiverModal/           # Ajustes protegidos, grabadora micrófono
│   │   └── PatientBoard/             # Tablero 6 botones, SÍ/NO gigantes, cooldown
│   ├── hooks/
│   │   ├── useSpeech.ts              # Orquestador de audio (grabado -> mp3 -> piper)
│   │   └── useWakeLock.ts            # Bloqueo de apagado de pantalla
│   ├── services/
│   │   ├── audioService.ts           # Web Audio API (chimes armónicos y alarmas)
│   │   ├── piperService.ts           # Inicialización y síntesis Piper WASM
│   │   └── storageService.ts         # Persistencia localStorage e IndexedDB
│   ├── App.tsx                       # Contenedor raíz y atajos de accesibilidad
│   └── index.css                     # Estilos Tailwind y control de gestos
└── capacitor.config.ts               # Configuración central de Capacitor
```
