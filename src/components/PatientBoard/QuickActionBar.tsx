import React from 'react'
import {
  CheckCircle2,
  Mic,
  Sun,
  XCircle,
} from 'lucide-react'
import { UnlockButton } from '../CaregiverModal/UnlockButton'

interface QuickActionBarProps {
  onSpeakYes: () => void
  onSpeakNo: () => void
  onOpenCaregiver: () => void
  isCooldownActive: boolean
  wakeLockActive: boolean
  hasYesAudio?: boolean
  hasNoAudio?: boolean
}

export const QuickActionBar: React.FC<QuickActionBarProps> = ({
  onSpeakYes,
  onSpeakNo,
  onOpenCaregiver,
  isCooldownActive,
  wakeLockActive,
  hasYesAudio,
  hasNoAudio,
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

  return (
    <header className="w-full flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 py-2 sm:py-3 bg-slate-950/95 border-b-2 border-slate-800 shadow-md select-none touch-none shrink-0">
      {/* SÍ and NO Binary buttons - Giant targets optimized for single-hand gross motor tapping */}
      <div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">
        {/* SÍ (Extra Large) */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Responder SÍ"
          onPointerDown={handleYesPointerDown}
          onContextMenu={(e) => e.preventDefault()}
          className={`
            relative flex items-center justify-center gap-2 sm:gap-3.5
            h-13 sm:h-16 md:h-18 lg:h-22
            px-6 sm:px-10 md:px-14 lg:px-18
            min-w-[110px] sm:min-w-[160px] md:min-w-[210px] lg:min-w-[250px]
            rounded-2xl sm:rounded-3xl
            border-3 sm:border-4 border-emerald-300 bg-emerald-600 hover:bg-emerald-500 text-white
            shadow-xl shadow-emerald-950/60 cursor-pointer select-none touch-none
            transition-transform duration-100
            ${!isCooldownActive ? 'active:scale-95 hover:brightness-105' : 'opacity-70 cursor-not-allowed'}
          `}
        >
          <CheckCircle2
            className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 text-emerald-100 shrink-0"
            strokeWidth={3}
          />
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-wider uppercase">
            SÍ
          </span>
          {hasYesAudio && (
            <span className="absolute top-1.5 right-1.5 text-emerald-200">
              <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
            </span>
          )}
        </div>

        {/* NO (Extra Large) */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Responder NO"
          onPointerDown={handleNoPointerDown}
          onContextMenu={(e) => e.preventDefault()}
          className={`
            relative flex items-center justify-center gap-2 sm:gap-3.5
            h-13 sm:h-16 md:h-18 lg:h-22
            px-6 sm:px-10 md:px-14 lg:px-18
            min-w-[110px] sm:min-w-[160px] md:min-w-[210px] lg:min-w-[250px]
            rounded-2xl sm:rounded-3xl
            border-3 sm:border-4 border-rose-300 bg-rose-600 hover:bg-rose-500 text-white
            shadow-xl shadow-rose-950/60 cursor-pointer select-none touch-none
            transition-transform duration-100
            ${!isCooldownActive ? 'active:scale-95 hover:brightness-105' : 'opacity-70 cursor-not-allowed'}
          `}
        >
          <XCircle
            className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 text-rose-100 shrink-0"
            strokeWidth={3}
          />
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-wider uppercase">
            NO
          </span>
          {hasNoAudio && (
            <span className="absolute top-1.5 right-1.5 text-rose-200">
              <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
            </span>
          )}
        </div>
      </div>

      {/* Right side: status, caregiver */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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
