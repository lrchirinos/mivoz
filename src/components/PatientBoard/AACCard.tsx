import React from 'react'
import { COLOR_THEMES } from '../../constants/colorThemes'
import { AACIcon } from '../../constants/icons'
import type { AACButton } from '../../types/aac'
import { Mic } from 'lucide-react'

interface AACCardProps {
  button: AACButton
  number: number
  isActive: boolean
  isCooldownActive: boolean
  cooldownProgress: number
  hasRecordedAudio?: boolean
  onActivate: (button: AACButton) => void
}

export const AACCard: React.FC<AACCardProps> = ({
  button,
  number,
  isActive,
  isCooldownActive,
  cooldownProgress,
  hasRecordedAudio,
  onActivate,
}) => {
  const theme = COLOR_THEMES[button.themeKey] || COLOR_THEMES.blue

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only respond to primary touch/click (button 0)
    if (e.button !== 0 && e.pointerType === 'mouse') return
    e.preventDefault()
    if (!isCooldownActive) {
      onActivate(button)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${number}: ${button.label}`}
      aria-disabled={isCooldownActive}
      onPointerDown={handlePointerDown}
      onContextMenu={(e) => e.preventDefault()}
      className={`
        relative flex flex-col justify-between items-center text-center
        h-full w-full p-2 sm:p-3 md:p-3.5 rounded-2xl sm:rounded-3xl
        select-none touch-none cursor-pointer transition-transform duration-100 overflow-hidden
        ${theme.bg} ${theme.border} ${theme.text} ${theme.shadow}
        ${button.isUrgent ? 'border-4 border-red-500 ring-2 ring-red-400/50 shadow-2xl shadow-red-950/80 animate-pulse' : 'border-3 sm:border-4'}
        ${!isCooldownActive ? 'active:scale-[0.96] hover:brightness-110 shadow-xl' : 'opacity-85 cursor-not-allowed'}
        ${isActive ? 'ring-4 ring-white ring-offset-4 ring-offset-slate-900 scale-[0.98]' : ''}
      `}
    >
      {/* Visual Cooldown Bar Overlay on the active card (placed at bottom z-0) */}
      {isActive && isCooldownActive && (
        <div className="absolute inset-0 rounded-[14px] sm:rounded-[22px] overflow-hidden pointer-events-none z-0">
          <div
            className="absolute bottom-0 left-0 right-0 bg-white/20 transition-all duration-75"
            style={{ height: `${(1 - cooldownProgress) * 100}%` }}
          />
        </div>
      )}

      {/* Top Header Floating Badges (Zero vertical flow impact) */}
      <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 pointer-events-none flex items-center gap-1.5">
        <span
          className={`
            inline-flex items-center justify-center
            w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
            text-xl sm:text-2xl md:text-3xl font-black
            rounded-xl sm:rounded-2xl ${theme.numberBg} ${theme.numberText}
            shadow-lg border-2 border-white/50
          `}
        >
          {number}
        </span>

        {/* Indicator if button has human recorded voice */}
        {hasRecordedAudio && (
          <span
            title="Voz grabada real"
            className="bg-emerald-600/90 text-white p-1 sm:p-1.5 rounded-lg sm:rounded-xl shadow border border-emerald-300/40"
          >
            <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-100" strokeWidth={2.5} />
          </span>
        )}
      </div>

      {button.isUrgent && (
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 pointer-events-none">
          <span className="bg-red-600 text-white font-extrabold text-[10px] sm:text-xs md:text-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wider animate-bounce shadow-lg border border-white/40">
            ¡Urgente!
          </span>
        </div>
      )}

      {/* Center: Pictogram centered in available space, cleared from corner badge */}
      <div className="flex-1 w-full min-h-0 flex items-center justify-center pointer-events-none z-10 pt-5 sm:pt-6 md:pt-7 pb-1">
        <div
          className={`
            w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-22 lg:h-22 rounded-2xl sm:rounded-3xl
            flex items-center justify-center shadow-md shrink-0 border-2
            ${button.isUrgent ? 'bg-red-900/60 border-red-400/50 shadow-red-950' : 'bg-black/30 border-white/15'}
          `}
        >
          <AACIcon
            name={button.iconName}
            className={`
              w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 drop-shadow-md
              ${button.isUrgent ? 'text-white drop-shadow-lg' : 'text-white'}
            `}
            strokeWidth={2.5}
          />
        </div>
      </div>

      {/* Bottom: Clear, High-Contrast Uppercase Phrase with SAFE BOTTOM PADDING (Never touches bottom border) */}
      <div className="w-full shrink-0 pointer-events-none z-10 px-1 pt-0.5 pb-2.5 sm:pb-3.5">
        <p
          className={`
            font-black tracking-tight uppercase drop-shadow-sm text-balance break-words line-clamp-2
            ${button.isUrgent ? 'text-white font-black' : 'text-white'}
          `}
          style={{
            fontSize: 'clamp(0.85rem, 1.3vh + 0.4vw, 1.35rem)',
            lineHeight: 1.15,
          }}
        >
          {button.label}
        </p>
      </div>
    </div>
  )
}
