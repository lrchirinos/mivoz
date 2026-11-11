import React from 'react'
import {
  CheckCircle2,
  Mic,
  Sun,
  XCircle,
} from 'lucide-react'
import { UnlockButton } from '../CaregiverModal/UnlockButton'
import { AvengersIcon } from './AvengersIcon'

interface QuickActionBarProps {
  onSpeakYes: () => void
  onSpeakNo: () => void
  onSpeakWhoAmI: () => void
  onOpenCaregiver: () => void
  isCooldownActive: boolean
  wakeLockActive: boolean
  hasYesAudio?: boolean
  hasNoAudio?: boolean
  hasWhoAmIAudio?: boolean
}

export const QuickActionBar: React.FC<QuickActionBarProps> = ({
  onSpeakYes,
  onSpeakNo,
  onSpeakWhoAmI,
  onOpenCaregiver,
  isCooldownActive,
  wakeLockActive,
  hasYesAudio,
  hasNoAudio,
  hasWhoAmIAudio,
}) => {
  const handleYesPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    e.preventDefault()
    if (!isCooldownActive) {
      onSpeakYes()
    }
  }

  const handleNoPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    e.preventDefault()
    if (!isCooldownActive) {
      onSpeakNo()
    }
  }

  const handleWhoAmIPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    e.preventDefault()
    if (!isCooldownActive) {
      onSpeakWhoAmI()
    }
  }

  return (
    <header
      className="w-full flex items-center justify-between gap-2.5 sm:gap-4 px-3 sm:px-6 py-2 sm:py-3 bg-slate-950/95 border-b-2 border-slate-800 shadow-md select-none touch-none shrink-0"
      style={{
        paddingLeft: 'max(0.75rem, env(safe-area-inset-left))',
        paddingRight: 'max(0.75rem, env(safe-area-inset-right))',
        paddingTop: 'max(0.5rem, env(safe-area-inset-top))',
      }}
    >
      {/* Left side: SÍ and NO buttons (Extra largos y grandes para control motor con mano izquierda en tablet) */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        {/* SÍ */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Responder SÍ"
          onPointerDown={handleYesPointerDown}
          onContextMenu={(e) => e.preventDefault()}
          className={`
            relative flex items-center justify-center gap-2 sm:gap-3
            h-12 sm:h-14 md:h-16 lg:h-18
            px-5 sm:px-8 md:px-10
            min-w-[115px] sm:min-w-[150px] md:min-w-[190px] lg:min-w-[225px]
            rounded-2xl sm:rounded-3xl
            border-3 sm:border-4 border-emerald-300 bg-emerald-600 hover:bg-emerald-500 text-white
            shadow-lg shadow-emerald-950/60 cursor-pointer select-none touch-none
            transition-transform duration-100
            ${!isCooldownActive ? 'active:scale-95 hover:brightness-105' : 'opacity-70 cursor-not-allowed'}
          `}
        >
          <CheckCircle2
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-emerald-100 shrink-0"
            strokeWidth={3}
          />
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-wider uppercase">
            SÍ
          </span>
          {hasYesAudio && (
            <span className="absolute top-1.5 right-2 text-emerald-200">
              <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
            </span>
          )}
        </div>

        {/* NO */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Responder NO"
          onPointerDown={handleNoPointerDown}
          onContextMenu={(e) => e.preventDefault()}
          className={`
            relative flex items-center justify-center gap-2 sm:gap-3
            h-12 sm:h-14 md:h-16 lg:h-18
            px-5 sm:px-8 md:px-10
            min-w-[115px] sm:min-w-[150px] md:min-w-[190px] lg:min-w-[225px]
            rounded-2xl sm:rounded-3xl
            border-3 sm:border-4 border-rose-300 bg-rose-600 hover:bg-rose-500 text-white
            shadow-lg shadow-rose-950/60 cursor-pointer select-none touch-none
            transition-transform duration-100
            ${!isCooldownActive ? 'active:scale-95 hover:brightness-105' : 'opacity-70 cursor-not-allowed'}
          `}
        >
          <XCircle
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-rose-100 shrink-0"
            strokeWidth={3}
          />
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-wider uppercase">
            NO
          </span>
          {hasNoAudio && (
            <span className="absolute top-1.5 right-2 text-rose-200">
              <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
            </span>
          )}
        </div>
      </div>

      {/* Center: JARV (Juan Antonio Ramírez Vereau) occupying middle space with Avengers emblem */}
      <div className="flex-1 flex items-center justify-center min-w-0 px-2 sm:px-3">
        <div
          role="button"
          tabIndex={0}
          aria-label="JARV: Juan Antonio Ramírez Vereau"
          onPointerDown={handleWhoAmIPointerDown}
          onContextMenu={(e) => e.preventDefault()}
          className={`
            relative flex items-center justify-center gap-2.5 sm:gap-3.5
            w-full max-w-sm sm:max-w-md md:max-w-lg
            h-12 sm:h-14 md:h-16 lg:h-18
            px-4 sm:px-6
            rounded-2xl sm:rounded-3xl
            border-3 sm:border-4 border-amber-400 bg-gradient-to-r from-red-800 via-red-600 to-red-800 hover:from-red-700 hover:via-red-500 hover:to-red-700 text-white
            shadow-lg shadow-red-950/70 cursor-pointer select-none touch-none
            transition-all duration-100
            ${!isCooldownActive ? 'active:scale-[0.98] hover:brightness-105' : 'opacity-70 cursor-not-allowed'}
          `}
        >
          {/* Avengers Emblem Icon */}
          <div className="flex items-center justify-center p-1 sm:p-1.5 rounded-full bg-black/40 border border-amber-300/60 shadow-inner shrink-0">
            <AvengersIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-amber-300 drop-shadow" />
          </div>

          {/* Button Text */}
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-black tracking-widest uppercase text-white truncate drop-shadow">
            JARV
          </span>

          {/* Right side emblem for balance */}
          <div className="hidden sm:flex items-center justify-center p-1 sm:p-1.5 rounded-full bg-black/40 border border-amber-300/60 shadow-inner shrink-0">
            <AvengersIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-300 drop-shadow" />
          </div>

          {hasWhoAmIAudio && (
            <span className="absolute top-1.5 right-2 text-amber-200">
              <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
            </span>
          )}
        </div>
      </div>

      {/* Right side: status, caregiver */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* App Title */}
        <div className="hidden md:flex items-center px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-indigo-300 font-black text-xs tracking-widest uppercase">
          codegeass
        </div>

        {/* Wake Lock */}
        <div
          title={wakeLockActive ? 'Pantalla siempre activa' : 'Normal'}
          className={`
            hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold
            ${
              wakeLockActive
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }
          `}
        >
          <Sun className="w-4 h-4 text-amber-400" strokeWidth={2.5} />
          <span>{wakeLockActive ? 'Pantalla Activa' : 'Normal'}</span>
        </div>

        {/* Unlock Button */}
        <UnlockButton onUnlock={onOpenCaregiver} />
      </div>
    </header>
  )
}
