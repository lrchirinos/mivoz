export type ColorThemeKey =
  | 'blue'
  | 'amber'
  | 'cyan'
  | 'violet'
  | 'rose'
  | 'emerald'
  | 'orange'
  | 'indigo'

export interface ColorThemeDefinition {
  name: string
  bg: string
  border: string
  text: string
  numberBg: string
  numberText: string
  activeBg: string
  shadow: string
}

export type VoiceProfileId = 'male-clear' | 'male-deep' | 'standard-female' | 'custom'

export interface VoiceProfileDefinition {
  id: VoiceProfileId
  name: string
  description: string
  pitch: number
  rate: number
}

export interface AACButton {
  id: number
  label: string
  spokenText: string
  iconName: string
  themeKey: ColorThemeKey
  isUrgent?: boolean
  hasCustomAudio?: boolean
}

export interface CaregiverSettings {
  voiceProfile: VoiceProfileId // Default: 'male-clear'
  voiceURI: string | null
  voiceRate: number // Default: 0.92
  voicePitch: number // Default: 0.72
  voiceVolume: number // 0.0 to 1.0, default 1.0
  cooldownDurationMs: number // 1000 to 5000, default 2500
  chimeEnabled: boolean // Pre-speech harmonic bell chime
  wakeLockEnabled: boolean
  patientName?: string
  preferRecordedAudio: boolean // If recorded audio exists for button, use it
}

export interface SpeechStatus {
  isSpeaking: boolean
  activeButtonId: number | null
  activeLabel: string | null
  isUrgent: boolean
  isRecordedAudio?: boolean
  cooldownRemainingMs: number
  cooldownProgress: number // 0 (start) to 1 (finished)
}

export type ModalType = 'none' | 'customPhrase' | 'caregiverSettings'
