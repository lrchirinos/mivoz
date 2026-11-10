import React from 'react'
import type { AACButton, SpeechStatus } from '../../types/aac'
import { AACCard } from './AACCard'
import { CooldownOverlay } from './CooldownOverlay'
import { QuickActionBar } from './QuickActionBar'

interface PatientBoardProps {
  buttons: AACButton[]
  speechStatus: SpeechStatus
  isCooldownActive: boolean
  wakeLockActive: boolean
  recordedAudioKeys: string[]
  onActivateButton: (button: AACButton) => void
  onSpeakYes: () => void
  onSpeakNo: () => void
  onOpenCaregiver: () => void
  onStopSpeech: () => void
}

export const PatientBoard: React.FC<PatientBoardProps> = ({
  buttons,
  speechStatus,
  isCooldownActive,
  wakeLockActive,
  recordedAudioKeys,
  onActivateButton,
  onSpeakYes,
  onSpeakNo,
  onOpenCaregiver,
  onStopSpeech,
}) => {
  return (
    <main
      className="w-screen h-screen h-[100dvh] flex flex-col bg-slate-950 overflow-hidden select-none touch-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Top Quick Response & Caregiver Action Bar */}
      <QuickActionBar
        onSpeakYes={onSpeakYes}
        onSpeakNo={onSpeakNo}
        onOpenCaregiver={onOpenCaregiver}
        isCooldownActive={isCooldownActive}
        wakeLockActive={wakeLockActive}
        hasYesAudio={recordedAudioKeys.includes('btn-yes')}
        hasNoAudio={recordedAudioKeys.includes('btn-no')}
      />

      {/* Visual Cooldown / Speaking Progress Overlay */}
      <CooldownOverlay status={speechStatus} onStop={onStopSpeech} />

      {/* Responsive Main Grid: 3x2 in Landscape, 2x3 in Portrait */}
      <section
        aria-label="Tablero de comunicación para el paciente"
        className="
          flex-1 w-full min-h-0 overflow-hidden
          grid
          grid-cols-2 grid-rows-3
          landscape:grid-cols-3 landscape:grid-rows-2
          gap-2 sm:gap-3 md:gap-4
          p-2 sm:p-3 md:p-4
        "
        style={{
          paddingLeft: 'max(0.5rem, env(safe-area-inset-left))',
          paddingRight: 'max(0.5rem, env(safe-area-inset-right))',
          paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
        }}
      >
        {buttons.map((btn, index) => (
          <AACCard
            key={btn.id}
            button={btn}
            number={index + 1}
            isActive={speechStatus.activeButtonId === btn.id}
            isCooldownActive={isCooldownActive}
            cooldownProgress={speechStatus.cooldownProgress}
            hasRecordedAudio={recordedAudioKeys.includes(`btn-${btn.id}`)}
            onActivate={onActivateButton}
          />
        ))}
      </section>
    </main>
  )
}
