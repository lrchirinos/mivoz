import { DEFAULT_AAC_BUTTONS, DEFAULT_CAREGIVER_SETTINGS } from '../constants/defaultButtons'
import type { AACButton, CaregiverSettings } from '../types/aac'

const STORAGE_KEYS = {
  BUTTONS: 'vocalis_aac_buttons_v1',
  SETTINGS: 'vocalis_aac_settings_v1',
} as const

export function loadAACButtons(): AACButton[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BUTTONS)
    if (!raw) return DEFAULT_AAC_BUTTONS
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length === 6) {
      return parsed
    }
  } catch (error) {
    console.warn('Error loading AAC buttons from storage:', error)
  }
  return DEFAULT_AAC_BUTTONS
}

export function saveAACButtons(buttons: AACButton[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BUTTONS, JSON.stringify(buttons))
  } catch (error) {
    console.error('Error saving AAC buttons to storage:', error)
  }
}

export function loadCaregiverSettings(): CaregiverSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    if (!raw) return DEFAULT_CAREGIVER_SETTINGS
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') {
      return {
        ...DEFAULT_CAREGIVER_SETTINGS,
        ...parsed,
      }
    }
  } catch (error) {
    console.warn('Error loading caregiver settings from storage:', error)
  }
  return DEFAULT_CAREGIVER_SETTINGS
}

export function saveCaregiverSettings(settings: CaregiverSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
  } catch (error) {
    console.error('Error saving caregiver settings to storage:', error)
  }
}

export function resetAllToDefaults(): { buttons: AACButton[]; settings: CaregiverSettings } {
  try {
    localStorage.removeItem(STORAGE_KEYS.BUTTONS)
    localStorage.removeItem(STORAGE_KEYS.SETTINGS)
  } catch (error) {
    console.error('Error resetting storage:', error)
  }
  return {
    buttons: DEFAULT_AAC_BUTTONS,
    settings: DEFAULT_CAREGIVER_SETTINGS,
  }
}
