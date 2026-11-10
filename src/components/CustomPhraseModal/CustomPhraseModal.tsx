import React, { useState } from 'react'
import {
  CornerDownLeft,
  Delete,
  RotateCcw,
  Volume2,
  X,
} from 'lucide-react'
import { QUICK_CUSTOM_PHRASES } from '../../constants/defaultButtons'

interface CustomPhraseModalProps {
  isOpen: boolean
  onClose: () => void
  onSpeak: (phrase: string) => void
  isCooldownActive: boolean
}

const KEYBOARD_ROWS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '?'],
]

export const CustomPhraseModal: React.FC<CustomPhraseModalProps> = ({
  isOpen,
  onClose,
  onSpeak,
  isCooldownActive,
}) => {
  const [text, setText] = useState<string>('')

  if (!isOpen) return null

  const handleKeyPress = (key: string) => {
    setText((prev) => prev + key)
  }

  const handleBackspace = () => {
    setText((prev) => prev.slice(0, -1))
  }

  const handleClear = () => {
    setText('')
  }

  const handleSpace = () => {
    setText((prev) => prev + ' ')
  }

  const handleSpeak = () => {
    if (text.trim() && !isCooldownActive) {
      onSpeak(text.trim())
    }
  }

  const handleQuickPhrase = (phrase: string) => {
    setText(phrase)
    if (!isCooldownActive) {
      onSpeak(phrase)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Panel de escritura libre y frases rápidas"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col p-3 sm:p-5 select-none touch-none overflow-hidden"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Modal Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-600 rounded-xl text-white">
            <Volume2 className="w-7 h-7" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wide">
              Expresión Libre
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold">
              Toca una frase rápida o usa el teclado táctil para hablar
            </p>
          </div>
        </div>

        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault()
            onClose()
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 border-2 border-slate-600 text-white rounded-2xl font-black text-lg transition-transform"
        >
          <X className="w-6 h-6" strokeWidth={3} />
          <span className="hidden sm:inline">VOLVER AL TABLERO</span>
        </button>
      </div>

      {/* Main Content: Split into Quick Phrases (Top/Left) and Large Input + Keyboard */}
      <div className="flex-1 flex flex-col lg:flex-row gap-3 py-3 overflow-hidden min-h-0">
        {/* Quick Phrases Bank */}
        <div className="lg:w-1/3 flex flex-col bg-slate-900/90 border-2 border-slate-700 rounded-3xl p-3 overflow-hidden">
          <span className="text-sm font-black text-sky-400 uppercase tracking-wider mb-2 px-1">
            Frases Rápidas Frecuentes
          </span>
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-1 gap-2 overflow-y-auto pr-1">
            {QUICK_CUSTOM_PHRASES.map((phrase) => (
              <button
                key={phrase}
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault()
                  handleQuickPhrase(phrase)
                }}
                className="
                  flex items-center justify-start text-left p-3 rounded-2xl
                  bg-slate-800 hover:bg-slate-700 border-2 border-slate-600
                  active:scale-95 active:bg-sky-900 text-white font-black text-base sm:text-lg
                  shadow transition-transform
                "
              >
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 mr-2.5 shrink-0" />
                <span className="truncate">{phrase}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input & Virtual Keyboard Area */}
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          {/* Large Text Display & Action Buttons */}
          <div className="flex items-center gap-2 bg-slate-900 border-3 border-sky-500/60 rounded-3xl p-3 shadow-inner">
            <div className="flex-1 min-h-[56px] flex items-center px-3 bg-black/40 rounded-2xl border border-slate-700 overflow-x-auto">
              <span className="text-2xl sm:text-3xl font-black text-yellow-300 tracking-wide break-all">
                {text || (
                  <span className="text-slate-500 font-semibold italic text-xl">
                    Toca las letras o una frase rápida...
                  </span>
                )}
              </span>
            </div>

            {/* Clear Button */}
            {text && (
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault()
                  handleClear()
                }}
                title="Borrar todo"
                className="p-3 bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-600 text-slate-300 rounded-2xl transition-transform"
              >
                <RotateCcw className="w-6 h-6" strokeWidth={2.5} />
              </button>
            )}

            {/* Giant Speak Button */}
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault()
                handleSpeak()
              }}
              disabled={!text.trim() || isCooldownActive}
              className={`
                flex items-center gap-3 px-6 py-3 rounded-2xl border-3 border-emerald-400
                bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl sm:text-2xl
                shadow-lg shadow-emerald-950/50 transition-all duration-100
                ${
                  text.trim() && !isCooldownActive
                    ? 'active:scale-95 cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                }
              `}
            >
              <Volume2 className="w-7 h-7" strokeWidth={2.5} />
              <span>DECIR</span>
            </button>
          </div>

          {/* Large On-Screen Tactile Keyboard */}
          <div className="flex-1 flex flex-col justify-between bg-slate-900/90 border-2 border-slate-700 rounded-3xl p-2 sm:p-3 gap-1.5 sm:gap-2">
            {KEYBOARD_ROWS.map((row, rIdx) => (
              <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5 flex-1">
                {row.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onPointerDown={(e) => {
                      e.preventDefault()
                      handleKeyPress(key)
                    }}
                    className="
                      flex-1 min-w-[28px] max-w-[72px] flex items-center justify-center
                      rounded-xl sm:rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-sky-600
                      border-2 border-slate-600 text-white font-black text-xl sm:text-2xl
                      shadow-md active:scale-90 transition-transform
                    "
                  >
                    {key}
                  </button>
                ))}
              </div>
            ))}

            {/* Bottom Row: Spacebar & Backspace */}
            <div className="flex justify-center gap-2 h-12 sm:h-14">
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault()
                  handleSpace()
                }}
                className="
                  flex-1 flex items-center justify-center gap-2 rounded-2xl
                  bg-slate-800 hover:bg-slate-700 active:bg-sky-600 border-2 border-slate-600
                  text-white font-black text-lg sm:text-xl shadow-md active:scale-95 transition-transform
                "
              >
                <CornerDownLeft className="w-5 h-5 text-slate-400" strokeWidth={2.5} />
                <span>ESPACIO</span>
              </button>

              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault()
                  handleBackspace()
                }}
                className="
                  w-24 sm:w-32 flex items-center justify-center gap-2 rounded-2xl
                  bg-rose-950/80 hover:bg-rose-900 active:bg-rose-800 border-2 border-rose-600
                  text-rose-100 font-black text-base sm:text-lg shadow-md active:scale-95 transition-transform
                "
              >
                <Delete className="w-6 h-6" strokeWidth={2.5} />
                <span className="hidden sm:inline">BORRAR</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
