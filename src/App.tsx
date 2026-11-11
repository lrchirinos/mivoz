import { useCallback, useEffect, useState } from 'react'
import { CaregiverModal } from './components/CaregiverModal/CaregiverModal'
import { CustomPhraseModal } from './components/CustomPhraseModal/CustomPhraseModal'
import { PatientBoard } from './components/PatientBoard/PatientBoard'
import { useSpeech } from './hooks/useSpeech'
import { useWakeLock } from './hooks/useWakeLock'
import {
  loadAACButtons,
  loadCaregiverSettings,
  resetAllToDefaults,
  saveAACButtons,
  saveCaregiverSettings,
} from './services/storageService'
import type { AACButton, CaregiverSettings } from './types/aac'

export function App() {
  const [buttons, setButtons] = useState<AACButton[]>(() => loadAACButtons())
  const [settings, setSettings] = useState<CaregiverSettings>(() => loadCaregiverSettings())
  const [isCaregiverOpen, setIsCaregiverOpen] = useState<boolean>(false)
  const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false)

  // Hooks
  const speech = useSpeech(settings)
  const wakeLock = useWakeLock(settings.wakeLockEnabled)

  // Save changes to storage
  const handleSaveButton = useCallback((updated: AACButton) => {
    setButtons((prev) => {
      const next = prev.map((b) => (b.id === updated.id ? updated : b))
      saveAACButtons(next)
      return next
    })
  }, [])

  const handleUpdateSettings = useCallback((partial: Partial<CaregiverSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial }
      saveCaregiverSettings(next)
      return next
    })
  }, [])

  const handleResetDefaults = useCallback(() => {
    const { buttons: defButtons, settings: defSettings } = resetAllToDefaults()
    setButtons(defButtons)
    setSettings(defSettings)
  }, [])

  // Speech triggers (with automatic fallback: human recorded voice first, then TTS)
  const handleActivateButton = useCallback(
    (button: AACButton) => {
      speech.speak(button.spokenText, {
        buttonId: button.id,
        buttonKey: `btn-${button.id}`,
        label: button.label,
        isUrgent: button.isUrgent,
      })
    },
    [speech]
  )

  const handleSpeakYes = useCallback(() => {
    speech.speak('Sí.', {
      buttonKey: 'btn-yes',
      label: 'SÍ',
      skipChime: false,
    })
  }, [speech])

  const handleSpeakNo = useCallback(() => {
    speech.speak('No.', {
      buttonKey: 'btn-no',
      label: 'NO',
      skipChime: false,
    })
  }, [speech])

  const handleSpeakWhoAmI = useCallback(() => {
    speech.speak('Soy Juan Antonio Ramírez Vereáu, y soy más listo que aíroman.', {
      buttonKey: 'btn-whoami',
      label: 'JARV',
      skipChime: false,
    })
  }, [speech])

  const handleSpeakCustom = useCallback(
    (phrase: string) => {
      speech.speak(phrase, {
        label: phrase.toUpperCase(),
        skipChime: false,
      })
    },
    [speech]
  )

  // Auto-request fullscreen on first user touch if running on a mobile browser
  useEffect(() => {
    const isMobileTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

    if (!isMobileTouch) return

    const handleFirstTouch = () => {
      if (!document.fullscreenElement && document.fullscreenEnabled) {
        document.documentElement.requestFullscreen?.().catch(() => {})
      }
    }

    window.addEventListener('pointerdown', handleFirstTouch, { once: true })
    return () => window.removeEventListener('pointerdown', handleFirstTouch)
  }, [])

  // Accessibility keyboard switch shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCaregiverOpen || isKeyboardOpen) return
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      const key = e.key.toLowerCase()

      if (['1', '2', '3', '4', '5', '6'].includes(key)) {
        const num = parseInt(key, 10)
        const targetBtn = buttons[num - 1]
        if (targetBtn) {
          handleActivateButton(targetBtn)
        }
      } else if (key === ' ' || key === 't' || key === 'h') {
        e.preventDefault()
        setIsKeyboardOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCaregiverOpen, isKeyboardOpen, buttons, handleActivateButton])

  return (
    <div className="w-full h-full overflow-hidden select-none touch-none bg-slate-950 text-white font-sans">
      {/* Main Patient AAC Board with Compact SÍ/NO, QUIÉN SOY & Voice badges */}
      <PatientBoard
        buttons={buttons}
        speechStatus={speech.speechStatus}
        isCooldownActive={speech.isCooldownActive}
        wakeLockActive={wakeLock.isActive}
        recordedAudioKeys={speech.recordedKeys}
        onActivateButton={handleActivateButton}
        onSpeakYes={handleSpeakYes}
        onSpeakNo={handleSpeakNo}
        onSpeakWhoAmI={handleSpeakWhoAmI}
        onOpenCaregiver={() => setIsCaregiverOpen(true)}
        onStopSpeech={speech.stop}
      />

      {/* Virtual Keyboard & Free Speech Modal */}
      <CustomPhraseModal
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        onSpeak={handleSpeakCustom}
        isCooldownActive={speech.isCooldownActive}
      />

      {/* Caregiver Settings Modal (3-second continuous hold) */}
      <CaregiverModal
        isOpen={isCaregiverOpen}
        onClose={() => setIsCaregiverOpen(false)}
        buttons={buttons}
        settings={settings}
        availableVoices={speech.availableVoices}
        onSaveButton={handleSaveButton}
        onUpdateSettings={handleUpdateSettings}
        onResetDefaults={handleResetDefaults}
        onTestSpeech={(text, isUrgent) => speech.speak(text, { isUrgent, forceTTS: true })}
        onAudioChanged={speech.refreshRecordedAudios}
      />
    </div>
  )
}

export default App
