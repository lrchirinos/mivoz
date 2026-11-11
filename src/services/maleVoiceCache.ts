/**
 * Pre-rendered Male Neural Audio Cache (Instant 0ms Latency)
 * Pre-synthesized with Spanish Male Neural Voice (es-PE-AlexNeural).
 */

const BASE = import.meta.env.BASE_URL ? (import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`) : '/'
const getAudioPath = (file: string) => `${BASE}audio/male/${file}`

const STATIC_AUDIO_MAP: Record<string, string> = {
  // Main 6 Buttons
  'btn-1': getAudioPath('btn-1.mp3'),
  'btn-2': getAudioPath('btn-2.mp3'),
  'btn-3': getAudioPath('btn-3.mp3'),
  'btn-4': getAudioPath('btn-4.mp3'),
  'btn-5': getAudioPath('btn-5.mp3'),
  'btn-6': getAudioPath('btn-6.mp3'),

  // Binary Responses & Identity
  'btn-yes': getAudioPath('btn-yes.mp3'),
  'btn-no': getAudioPath('btn-no.mp3'),
  'btn-whoami': getAudioPath('btn-whoami.mp3'),

  // Quick Preset Phrases
  'phrase-0': getAudioPath('phrase-0.mp3'),
  'phrase-1': getAudioPath('phrase-1.mp3'),
  'phrase-2': getAudioPath('phrase-2.mp3'),
  'phrase-3': getAudioPath('phrase-3.mp3'),
  'phrase-4': getAudioPath('phrase-4.mp3'),
  'phrase-5': getAudioPath('phrase-5.mp3'),
  'phrase-6': getAudioPath('phrase-6.mp3'),
  'phrase-7': getAudioPath('phrase-7.mp3'),
  'phrase-8': getAudioPath('phrase-8.mp3'),
  'phrase-9': getAudioPath('phrase-9.mp3'),
}

// Normalized phrase text to pre-rendered audio
const TEXT_TO_AUDIO_MAP: Record<string, string> = {
  'quiero ir al baño, por favor.': getAudioPath('btn-1.mp3'),
  'quiero ir al baño': getAudioPath('btn-1.mp3'),
  'tengo hambre o sed.': getAudioPath('btn-2.mp3'),
  'tengo hambre o sed': getAudioPath('btn-2.mp3'),
  'tengo calor, por favor abre la ventana.': getAudioPath('btn-3.mp3'),
  'tengo calor': getAudioPath('btn-3.mp3'),
  'quiero salir o cambiar de posición.': getAudioPath('btn-4.mp3'),
  'cambiar de posicion': getAudioPath('btn-4.mp3'),
  'cambiar de posición': getAudioPath('btn-4.mp3'),
  '¡atención por favor, me duele algo y necesito ayuda urgente!': getAudioPath('btn-5.mp3'),
  'me duele algo y necesito ayuda urgente': getAudioPath('btn-5.mp3'),
  'me duele algo': getAudioPath('btn-5.mp3'),
  'necesito otra cosa, por favor ven a verme.': getAudioPath('btn-6.mp3'),
  'necesito otra cosa': getAudioPath('btn-6.mp3'),
  'sí.': getAudioPath('btn-yes.mp3'),
  'sí': getAudioPath('btn-yes.mp3'),
  'si': getAudioPath('btn-yes.mp3'),
  'no.': getAudioPath('btn-no.mp3'),
  'no': getAudioPath('btn-no.mp3'),
  'soy juan antonio ramirez vereau, y soy más listo que aíroman.': getAudioPath('btn-whoami.mp3'),
  'soy juan antonio ramirez vereau y soy más listo que aíroman': getAudioPath('btn-whoami.mp3'),
  'soy juan antonio ramírez vereáu, y soy más listo que aíroman.': getAudioPath('btn-whoami.mp3'),
  'soy juan antonio ramírez vereáu y soy más listo que aíroman': getAudioPath('btn-whoami.mp3'),
  'soy juan antonio ramirez vereau, soy más listo que ayroman.': getAudioPath('btn-whoami.mp3'),
  'soy juan antonio ramirez vereau soy más listo que ayroman': getAudioPath('btn-whoami.mp3'),
  'soy juan antonio ramírez vereáu, soy más listo que ayroman.': getAudioPath('btn-whoami.mp3'),
  'soy juan antonio ramírez vereáu soy más listo que ayroman': getAudioPath('btn-whoami.mp3'),
  'soy juan antonio ramirez vereau y soy más listo que ayroman.': getAudioPath('btn-whoami.mp3'),
  'soy juan antonio ramirez vereau y soy más listo que ayroman': getAudioPath('btn-whoami.mp3'),
  'soy juan antonio ramirez vereau y soy más listo que ironman.': getAudioPath('btn-whoami.mp3'),
  'soy juan antonio ramirez vereau y soy más listo que ironman': getAudioPath('btn-whoami.mp3'),
  'soy juan antonio ramírez vereau y soy más listo que ironman.': getAudioPath('btn-whoami.mp3'),
  'soy juan antonio ramírez vereau y soy más listo que ironman': getAudioPath('btn-whoami.mp3'),

  // Common quick phrases
  'gracias': getAudioPath('phrase-0.mp3'),
  'muchas gracias': getAudioPath('phrase-0.mp3'),
  'muchas gracias.': getAudioPath('phrase-0.mp3'),
  'por favor': getAudioPath('phrase-1.mp3'),
  'por favor.': getAudioPath('phrase-1.mp3'),
  'tengo frío': getAudioPath('phrase-2.mp3'),
  'tengo frio': getAudioPath('phrase-2.mp3'),
  'quiero dormir': getAudioPath('phrase-3.mp3'),
  '¿qué hora es?': getAudioPath('phrase-4.mp3'),
  'que hora es': getAudioPath('phrase-4.mp3'),
  'llama a mi familia': getAudioPath('phrase-5.mp3'),
  'llama a mi familia, por favor': getAudioPath('phrase-5.mp3'),
  'todo está bien': getAudioPath('phrase-6.mp3'),
  'todo esta bien': getAudioPath('phrase-6.mp3'),
  'un vaso de agua': getAudioPath('phrase-7.mp3'),
  'por favor, un vaso de agua': getAudioPath('phrase-7.mp3'),
  'quiero descansar': getAudioPath('phrase-8.mp3'),
  'encender la televisión': getAudioPath('phrase-9.mp3'),
  'encender la television': getAudioPath('phrase-9.mp3'),
  'por favor, enciende la televisión.': getAudioPath('phrase-9.mp3'),
}

function normalizeKey(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[¿?¡!.,]/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/**
 * Returns pre-rendered audio URL if available for 0ms latency.
 */
export function getPreloadedMaleAudioUrl(
  buttonKey?: string,
  phraseText?: string
): string | null {
  // 1. Direct button key match
  if (buttonKey && STATIC_AUDIO_MAP[buttonKey]) {
    return STATIC_AUDIO_MAP[buttonKey]
  }

  // 2. Direct phrase match
  if (phraseText) {
    const rawMatch = TEXT_TO_AUDIO_MAP[phraseText.toLowerCase().trim()]
    if (rawMatch) return rawMatch

    const normalized = normalizeKey(phraseText)
    for (const [key, url] of Object.entries(TEXT_TO_AUDIO_MAP)) {
      if (normalizeKey(key) === normalized) {
        return url
      }
    }
  }

  return null
}
