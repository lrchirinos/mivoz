import React, { useState } from 'react'
import {
  PenTool,
  RotateCcw,
  Sliders,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react'
import { QUICK_CUSTOM_PHRASES } from '../../constants/defaultButtons'
import type { UnifiedVoice } from '../../hooks/useSpeech'
import type { AACButton, CaregiverSettings } from '../../types/aac'
import { ButtonEditor } from './ButtonEditor'
import { VoiceSettings } from './VoiceSettings'

interface CaregiverModalProps {
  isOpen: boolean
  onClose: () => void
  buttons: AACButton[]
  settings: CaregiverSettings
  availableVoices: UnifiedVoice[]
  onSaveButton: (updated: AACButton) => void
  onUpdateSettings: (updated: Partial<CaregiverSettings>) => void
  onResetDefaults: () => void
  onTestSpeech: (text: string, isUrgent?: boolean) => void
  onAudioChanged?: () => void
}

type TabType = 'buttons' | 'speech' | 'freeText'

export const CaregiverModal: React.FC<CaregiverModalProps> = ({
  isOpen,
  onClose,
  buttons,
  settings,
  availableVoices,
  onSaveButton,
  onUpdateSettings,
  onResetDefaults,
  onTestSpeech,
  onAudioChanged,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('buttons')
  const [confirmReset, setConfirmReset] = useState<boolean>(false)
  const [customText, setCustomText] = useState<string>('')

  if (!isOpen) return null

  const handleReset = () => {
    if (confirmReset) {
      onResetDefaults()
      setConfirmReset(false)
    } else {
      setConfirmReset(true)
      setTimeout(() => setConfirmReset(false), 5000)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Panel de Ajustes y Modo Familiar"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none"
    >
      <div className="w-full max-w-4xl h-[92vh] flex flex-col bg-slate-900 border-2 border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b-2 border-slate-800 bg-slate-950 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-600/30 border border-amber-500/50 rounded-2xl text-amber-300">
              <Sliders className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
                codegeass — Modo Familiar y Ajustes
              </h2>
              <p className="text-xs text-slate-400 font-semibold">
                Personaliza botones, voces y tiempos según las necesidades del paciente
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 border border-slate-700 transition-transform"
          >
            <X className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-4 sm:px-6 pt-3 gap-2 bg-slate-950/60 border-b border-slate-800 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('buttons')}
            className={`
              flex items-center gap-2 px-4 sm:px-5 py-3 rounded-t-2xl font-black text-xs sm:text-sm uppercase tracking-wider border-t-2 border-x-2 transition-all shrink-0
              ${
                activeTab === 'buttons'
                  ? 'bg-slate-900 border-slate-700 text-white'
                  : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
              }
            `}
          >
            <Sparkles className="w-4 h-4 text-sky-400" strokeWidth={2.5} />
            <span>Editar 6 Botones y Grabar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('speech')}
            className={`
              flex items-center gap-2 px-4 sm:px-5 py-3 rounded-t-2xl font-black text-xs sm:text-sm uppercase tracking-wider border-t-2 border-x-2 transition-all shrink-0
              ${
                activeTab === 'speech'
                  ? 'bg-slate-900 border-slate-700 text-white'
                  : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
              }
            `}
          >
            <Volume2 className="w-4 h-4 text-amber-400" strokeWidth={2.5} />
            <span>Paquete de Voz Masculino</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('freeText')}
            className={`
              flex items-center gap-2 px-4 sm:px-5 py-3 rounded-t-2xl font-black text-xs sm:text-sm uppercase tracking-wider border-t-2 border-x-2 transition-all shrink-0
              ${
                activeTab === 'freeText'
                  ? 'bg-slate-900 border-slate-700 text-white'
                  : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
              }
            `}
          >
            <PenTool className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
            <span>Frase Libre (Cuidador)</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900">
          {activeTab === 'buttons' && (
            <ButtonEditor
              buttons={buttons}
              onSaveButton={onSaveButton}
              onTestSpeech={onTestSpeech}
              onAudioChanged={onAudioChanged}
            />
          )}

          {activeTab === 'speech' && (
            <VoiceSettings
              settings={settings}
              onUpdateSettings={onUpdateSettings}
              availableVoices={availableVoices}
              onTestPhrase={onTestSpeech}
            />
          )}

          {activeTab === 'freeText' && (
            <div className="flex flex-col gap-4">
              <div className="bg-slate-850 p-4 rounded-3xl border border-slate-700 flex flex-col gap-3">
                <label className="text-sm font-bold text-white uppercase tracking-wider">
                  Escribir frase para que la tablet la pronuncie:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Escribe lo que deseas que la voz diga..."
                    className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white font-medium text-base focus:border-sky-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={!customText.trim()}
                    onClick={() => {
                      if (customText.trim()) onTestSpeech(customText.trim())
                    }}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-40 text-white font-black rounded-2xl flex items-center gap-2 shrink-0 transition-transform"
                  >
                    <Volume2 className="w-5 h-5" strokeWidth={2.5} />
                    <span>Hablar</span>
                  </button>
                </div>
              </div>

              {/* Quick Preset buttons for the caregiver */}
              <div className="bg-slate-850 p-4 rounded-3xl border border-slate-700 flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Frases rápidas para emitir:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {QUICK_CUSTOM_PHRASES.map((phrase) => (
                    <button
                      key={phrase}
                      type="button"
                      onClick={() => {
                        setCustomText(phrase)
                        onTestSpeech(phrase)
                      }}
                      className="text-left px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs sm:text-sm truncate active:scale-95 transition-transform"
                    >
                      {phrase}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-t-2 border-slate-800 bg-slate-950 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-bold transition-all
              ${
                confirmReset
                  ? 'bg-red-600 text-white border-red-400 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }
            `}
          >
            <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
            <span>{confirmReset ? '¿Confirmar reinicio?' : 'Restaurar Predeterminados'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-950/40 transition-transform"
          >
            <span>LISTO, VOLVER AL PACIENTE</span>
          </button>
        </div>
      </div>
    </div>
  )
}
