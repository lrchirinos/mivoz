import React, { useEffect, useRef, useState } from 'react'
import { Lock, ShieldCheck } from 'lucide-react'

interface UnlockButtonProps {
  onUnlock: () => void
}

const HOLD_DURATION_MS = 3000

export const UnlockButton: React.FC<UnlockButtonProps> = ({ onUnlock }) => {
  const [isHolding, setIsHolding] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const holdStartRef = useRef<number | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const holdTimerRef = useRef<number | null>(null)

  const cancelHold = () => {
    setIsHolding(false)
    setProgress(0)
    holdStartRef.current = null
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    e.preventDefault()

    const start = performance.now()
    holdStartRef.current = start
    setIsHolding(true)
    setProgress(0)

    const updateLoop = () => {
      if (!holdStartRef.current) return
      const elapsed = performance.now() - holdStartRef.current
      const currentProgress = Math.min(1, elapsed / HOLD_DURATION_MS)
      setProgress(currentProgress)

      if (currentProgress < 1) {
        animFrameRef.current = requestAnimationFrame(updateLoop)
      } else {
        // Complete 3 seconds
        cancelHold()
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate([100, 50, 100])
          } catch {
            // Ignored
          }
        }
        onUnlock()
      }
    }

    animFrameRef.current = requestAnimationFrame(updateLoop)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault()
    cancelHold()
  }

  const handlePointerLeave = (e: React.PointerEvent) => {
    e.preventDefault()
    cancelHold()
  }

  useEffect(() => {
    return () => {
      cancelHold()
    }
  }, [])

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Mantener presionado 3 segundos para abrir modo familiar"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={cancelHold}
      onContextMenu={(e) => e.preventDefault()}
      className={`
        relative overflow-hidden flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl
        border-2 select-none touch-none cursor-pointer transition-all duration-150 shrink-0
        ${
          isHolding
            ? 'bg-amber-950/90 border-amber-400 text-amber-200 scale-98 shadow-inner ring-2 ring-amber-400'
            : 'bg-slate-800/90 border-slate-600 text-slate-300 hover:bg-slate-700 active:scale-95'
        }
      `}
    >
      {/* Background progress fill */}
      {isHolding && (
        <div
          className="absolute inset-0 bg-amber-500/25 pointer-events-none transition-all duration-75"
          style={{ width: `${progress * 100}%` }}
        />
      )}

      {/* Circular Progress Ring */}
      <div className="relative w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center pointer-events-none shrink-0">
        <svg className="w-5 h-5 sm:w-6 sm:h-6 -rotate-90 transform" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="14"
            className="stroke-slate-600"
            strokeWidth="3"
            fill="none"
          />
          {isHolding && (
            <circle
              cx="18"
              cy="18"
              r="14"
              className="stroke-amber-400 transition-all duration-75"
              strokeWidth="4"
              strokeDasharray={88}
              strokeDashoffset={88 * (1 - progress)}
              strokeLinecap="round"
              fill="none"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {isHolding ? (
            <ShieldCheck className="w-3 h-3 text-amber-300 animate-pulse" strokeWidth={2.5} />
          ) : (
            <Lock className="w-3 h-3 text-slate-400" strokeWidth={2.5} />
          )}
        </div>
      </div>

      <div className="flex flex-col text-left pointer-events-none">
        <span className="text-[11px] sm:text-xs md:text-sm font-bold tracking-tight leading-none">
          {isHolding ? 'Mantén...' : 'Ajustes'}
        </span>
        <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium leading-tight">
          {isHolding ? `${Math.ceil((1 - progress) * 3)}s` : '3s'}
        </span>
      </div>
    </div>
  )
}
