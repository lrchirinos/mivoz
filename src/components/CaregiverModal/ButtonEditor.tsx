import React, { useState } from 'react'
import { COLOR_THEMES } from '../../constants/colorThemes'
import { AVAILABLE_ICONS } from '../../constants/icons'
import type { AACButton, ColorThemeKey } from '../../types/aac'
import { AlertTriangle, Check, Volume2 } from 'lucide-react'
import { VoiceRecorderWidget } from './VoiceRecorderWidget'

interface ButtonEditorProps {
  buttons: AACButton[]
  onSaveButton: (updated: AACButton) => void
  onTestSpeech: (text: string, isUrgent?: boolean) => void
  onAudioChanged?: () => void
}

export const ButtonEditor: React.FC<ButtonEditorProps> = ({
  buttons,
  onSaveButton,
  onTestSpeech,
  onAudioChanged,
}) => {
  const [selectedId, setSelectedId] = useState<number>(1)

  const currentButton = buttons.find((b) => b.id === selectedId) || buttons[0]

  const handleChange = (fields: Partial<AACButton>) => {
    const updated: AACButton = {
      ...currentButton,
      ...fields,
    }
    onSaveButton(updated)
  }

  const themeKeys = Object.keys(COLOR_THEMES) as ColorThemeKey[]

  return (
    <div className="flex flex-col gap-4">
      {/* Button 1 to 6 selector tabs */}
      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          Selecciona la tarjeta a personalizar:
        </label>
        <div className="grid grid-cols-6 gap-2">
          {buttons.map((btn, idx) => {
            const isSelected = btn.id === selectedId
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => setSelectedId(btn.id)}
                className={`
                  flex flex-col items-center justify-center py-2 px-1 rounded-2xl border-2
                  transition-all duration-150 font-black
                  ${
                    isSelected
                      ? 'bg-sky-600 border-white text-white shadow-lg scale-102 ring-2 ring-sky-400'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }
                `}
              >
                <span className="text-xl sm:text-2xl font-black">#{idx + 1}</span>
                <span className="text-[10px] truncate max-w-full font-bold uppercase mt-0.5">
                  {btn.label.split(' ')[0]}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Editor Fields for Selected Button */}
      <div className="bg-slate-850 p-4 rounded-3xl border border-slate-700 flex flex-col gap-4">
        {/* Real Human Voice Microphone Recorder */}
        <VoiceRecorderWidget
          buttonKey={`btn-${currentButton.id}`}
          buttonLabel={`Botón ${currentButton.id}: ${currentButton.label}`}
          onAudioChanged={onAudioChanged}
        />

        {/* Texts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Texto visible en la tarjeta (Mayúsculas):
            </label>
            <input
              type="text"
              value={currentButton.label}
              onChange={(e) => handleChange({ label: e.target.value.toUpperCase() })}
              placeholder="Ej: QUIERO IR AL BAÑO"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-lg focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Frase completa hablada (si no hay grabación):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentButton.spokenText}
                onChange={(e) => handleChange({ spokenText: e.target.value })}
                placeholder="Ej: Quiero ir al baño, por favor."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium text-base focus:border-sky-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => onTestSpeech(currentButton.spokenText, currentButton.isUrgent)}
                title="Probar audio TTS de esta frase"
                className="px-3 py-2 bg-sky-600 hover:bg-sky-500 active:scale-95 text-white rounded-xl flex items-center gap-1 font-bold shrink-0"
              >
                <Volume2 className="w-5 h-5" strokeWidth={2.5} />
                <span className="text-xs">Probar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Urgency checkbox */}
        <div className="flex items-center gap-3 p-3 bg-red-950/30 border border-red-900/50 rounded-2xl">
          <input
            id="urgent-toggle"
            type="checkbox"
            checked={!!currentButton.isUrgent}
            onChange={(e) => handleChange({ isUrgent: e.target.checked })}
            className="w-5 h-5 accent-red-600 rounded cursor-pointer"
          />
          <label htmlFor="urgent-toggle" className="text-sm font-bold text-red-200 cursor-pointer flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" strokeWidth={2.5} />
            Marcar como botón de emergencia / dolor (reproduce alarma audible previa)
          </label>
        </div>

        {/* Color Palette Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
            Color de alto contraste:
          </label>
          <div className="flex flex-wrap gap-2">
            {themeKeys.map((themeKey) => {
              const def = COLOR_THEMES[themeKey]
              const isSelected = currentButton.themeKey === themeKey
              return (
                <button
                  key={themeKey}
                  type="button"
                  onClick={() => handleChange({ themeKey })}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 text-xs font-bold transition-transform
                    ${def.bg} ${def.border} ${def.text}
                    ${isSelected ? 'scale-105 ring-2 ring-white' : 'opacity-80 hover:opacity-100'}
                  `}
                >
                  <span className={`w-3 h-3 rounded-full ${def.numberBg}`} />
                  <span>{def.name}</span>
                  {isSelected && <Check className="w-4 h-4" strokeWidth={3} />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Icon Picker */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
            Icono clínico / pictograma representativo:
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-900/80 rounded-2xl border border-slate-700">
            {AVAILABLE_ICONS.map((opt) => {
              const IconComp = opt.icon
              const isSelected = currentButton.iconName === opt.name
              return (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() => handleChange({ iconName: opt.name })}
                  className={`
                    flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all
                    ${
                      isSelected
                        ? 'bg-sky-600 border-white text-white shadow-md ring-2 ring-sky-400'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }
                  `}
                >
                  <IconComp className="w-8 h-8 mb-1" strokeWidth={2.5} />
                  <span className="text-[10px] leading-tight font-semibold line-clamp-1">
                    {opt.label.split('/')[0]}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Voice Recorder for SÍ and NO */}
      <div className="bg-slate-850 p-4 rounded-3xl border border-slate-700 flex flex-col gap-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Grabar voz real para respuestas rápidas (SÍ y NO):
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <VoiceRecorderWidget
            buttonKey="btn-yes"
            buttonLabel="Respuesta SÍ"
            onAudioChanged={onAudioChanged}
          />
          <VoiceRecorderWidget
            buttonKey="btn-no"
            buttonLabel="Respuesta NO"
            onAudioChanged={onAudioChanged}
          />
        </div>
      </div>
    </div>
  )
}
