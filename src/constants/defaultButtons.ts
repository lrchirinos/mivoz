import type { AACButton, CaregiverSettings, VoiceProfileDefinition, VoiceProfileId } from '../types/aac'

export const VOICE_PROFILES: Record<VoiceProfileId, VoiceProfileDefinition> = {
  'male-clear': {
    id: 'male-clear',
    name: 'Hombre - Claro (Por defecto)',
    description: 'Timbre masculino natural y definido con pitch optimizado',
    pitch: 0.72,
    rate: 0.92,
  },
  'male-deep': {
    id: 'male-deep',
    name: 'Hombre - Profundo',
    description: 'Timbre masculino grave y pausado',
    pitch: 0.60,
    rate: 0.90,
  },
  'standard-female': {
    id: 'standard-female',
    name: 'Estándar / Femenina',
    description: 'Tono estándar original del sistema',
    pitch: 1.0,
    rate: 0.90,
  },
  custom: {
    id: 'custom',
    name: 'Personalizado',
    description: 'Ajuste manual de tono y velocidad',
    pitch: 0.72,
    rate: 0.92,
  },
}

export const DEFAULT_AAC_BUTTONS: AACButton[] = [
  {
    id: 1,
    label: 'QUIERO IR AL BAÑO',
    spokenText: 'Quiero ir al baño, por favor.',
    iconName: 'Bath',
    themeKey: 'blue',
  },
  {
    id: 2,
    label: 'TENGO HAMBRE O SED',
    spokenText: 'Tengo hambre o sed.',
    iconName: 'Utensils',
    themeKey: 'amber',
  },
  {
    id: 3,
    label: 'TENGO CALOR / VENTANA',
    spokenText: 'Tengo calor, por favor abre la ventana.',
    iconName: 'Wind',
    themeKey: 'cyan',
  },
  {
    id: 4,
    label: 'CAMBIAR DE POSICIÓN',
    spokenText: 'Quiero salir o cambiar de posición.',
    iconName: 'Armchair',
    themeKey: 'violet',
  },
  {
    id: 5,
    label: 'ME DUELE / AYUDA URGENTE',
    spokenText: '¡Atención por favor, me duele algo y necesito ayuda urgente!',
    iconName: 'AlertTriangle',
    themeKey: 'rose',
    isUrgent: true,
  },
  {
    id: 6,
    label: 'NECESITO OTRA COSA',
    spokenText: 'Necesito otra cosa, por favor ven a verme.',
    iconName: 'MessageSquarePlus',
    themeKey: 'emerald',
  },
]

export const DEFAULT_CAREGIVER_SETTINGS: CaregiverSettings = {
  voiceProfile: 'male-clear',
  voiceURI: null,
  voiceRate: 0.92,
  voicePitch: 0.72,
  voiceVolume: 1.0,
  cooldownDurationMs: 2500,
  chimeEnabled: true,
  wakeLockEnabled: true,
  patientName: '',
  preferRecordedAudio: true,
}

export const QUICK_CUSTOM_PHRASES: string[] = [
  'GRACIAS',
  'POR FAVOR',
  'TENGO FRÍO',
  'QUIERO DORMIR',
  '¿QUÉ HORA ES?',
  'LLAMA A MI FAMILIA',
  'TODO ESTÁ BIEN',
  'UN VASO DE AGUA',
  'QUIERO DESCANSAR',
  'ENCENDER LA TELEVISIÓN',
]
