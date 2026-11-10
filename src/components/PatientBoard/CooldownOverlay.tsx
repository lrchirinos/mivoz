import React from 'react'
import { AlertCircle, Volume2, X } from 'lucide-react'
import type { SpeechStatus } from '../../types/aac'

interface CooldownOverlayProps {
  status: SpeechStatus
  onStop: () => void
}

export const CooldownOverlay: React.FC<CooldownOverlayProps> = ({ status, onStop }) => {
  if (!status.isSpeaking && status.cooldownRemainingMs <= 0) {
    return null
  }

  const secondsRemaining = (status.cooldownRemainingMs / 1000).toFixed(1)

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full bg-slate-900/95 border-b-2 border-indigo-500/40 px-4 py-2 flex items-center justify-between gap-4 z-30 shadow-lg"
    >
      <div className="flex items-center gap-3 flex-1 overflow-hidden">
        {status.isUrgent ? (
          <div className="p-1.5 rounded-lg bg-red-600 animate-pulse text-white">
            <AlertCircle className="w-5 h-5" strokeWidth={2.5} />
          </div>
        ) : (
          <div className="p-1.5 rounded-lg bg-sky-600 text-white animate-bounce">
            <Volume2 className="w-5 h-5" strokeWidth={2.5} />
          </div>
        )}

        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
            {status.isUrgent ? '¡ALERTA DE EMERGENCIA EMITIDA!' : 'EMITIENDO VOZ...'}
          </span>
          <p className="text-sm sm:text-base font-extrabold text-white truncate">
            {status.activeLabel || 'Mensaje de voz'}
          </p>
        </div>
      </div>

      {/* Cooldown progress indicator & cancel button */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs font-semibold text-slate-300">
            Bloqueo anti-temblor: {secondsRemaining}s
          </span>
          <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700 mt-0.5">
            <div
              className="h-full bg-indigo-500 transition-all duration-75"
              style={{ width: `${(1 - status.cooldownProgress) * 100}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onStop}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-500/50 rounded-xl text-red-200 text-xs font-bold active:scale-95 transition-transform"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
          <span>Silenciar</span>
        </button>
      </div>
    </div>
  )
}
