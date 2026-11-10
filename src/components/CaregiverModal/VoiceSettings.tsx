import React from 'react'
import {
  Bell,
  BellRing,
  CheckCircle2,
  Mic,
  Sparkles,
  Volume2,
} from 'lucide-react'
import { playChimeSound, playUrgentAlarmSound } from '../../services/audioService'
import type { UnifiedVoice } from '../../hooks/useSpeech'
import type { CaregiverSettings } from '../../types/aac'

interface VoiceSettingsProps {
  settings: CaregiverSettings
  onUpdateSettings: (updated: Partial<CaregiverSettings>) => void
  availableVoices: UnifiedVoice[]
  onTestPhrase: (text: string) => void
}

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  settings,
  onUpdateSettings,
  availableVoices,
  onTestPhrase,
}) => {
  const isDefaultNeuralVoice =
    !settings.voiceURI ||
    settings.voiceURI === 'neural-male' ||
    settings.voiceURI === 'default'

  return (
    <div className="flex flex-col gap-5">
      {/* 1. Voice Source Selector: Masculine Neural (Default) vs Device System Voices */}
      <div className="bg-slate-850 p-4 sm:p-5 rounded-3xl border-2 border-slate-700 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-sky-400" strokeWidth={2.5} />
            Selección de Voz
          </label>
          <span className="text-xs text-sky-400 font-semibold">
            {availableVoices.length} voces en el dispositivo
          </span>
        </div>

        {/* Option A: Masculine Neural Voice (Default & Recommended) */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onUpdateSettings({ voiceURI: 'neural-male' })}
          className={`
            p-4 rounded-2xl border-2 cursor-pointer transition-all duration-150 flex flex-col gap-2
            ${
              isDefaultNeuralVoice
                ? 'bg-sky-950/80 border-sky-400 text-white shadow-lg ring-2 ring-sky-400/50'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base font-black uppercase tracking-wide text-white">
                Voz Masculina Neuronal (Por Defecto)
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/50 px-2 py-0.5 rounded-full">
                Recomendada
              </span>
            </div>

            {isDefaultNeuralVoice && (
              <span className="p-1 rounded-full bg-sky-500 text-white">
                <CheckCircle2 className="w-4 h-4" strokeWidth={3} />
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300">
            Voz masculina con pronunciación pausada y clara, optimizada con latencia instantánea a 0ms en todos los botones y frases rápidas.
          </p>
        </div>

        {/* Option B: Search / Choose other voices from device system */}
        <div
          className={`
            p-4 rounded-2xl border-2 transition-all duration-150 flex flex-col gap-3
            ${
              !isDefaultNeuralVoice
                ? 'bg-slate-900 border-amber-400 text-white shadow-lg ring-2 ring-amber-400/40'
                : 'bg-slate-900/60 border-slate-700 text-slate-400'
            }
          `}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wide text-slate-200">
              Otras Voces del Sistema / Dispositivo
            </span>
            {!isDefaultNeuralVoice && (
              <span className="text-[10px] font-black uppercase bg-amber-950 text-amber-300 border border-amber-500/50 px-2 py-0.5 rounded-full">
                Voz de Sistema Activa
              </span>
            )}
          </div>

          <select
            value={settings.voiceURI || 'neural-male'}
            onChange={(e) => onUpdateSettings({ voiceURI: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold text-sm focus:border-sky-500 focus:outline-none cursor-pointer"
          >
            <option value="neural-male">
              ★ Voz Masculina Neuronal (Por Defecto - Recomendada)
            </option>
            {availableVoices.map((voice) => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name} ({voice.lang}) {voice.isMale ? '👤 [Hombre]' : ''} {voice.isDefault ? '• Predeterminada' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Test Current Voice Button */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-700/60">
          <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            {isDefaultNeuralVoice ? 'Probando Voz Masculina Neuronal' : 'Probando Voz Seleccionada'}
          </span>

          <button
            type="button"
            onClick={() => onTestPhrase('Quiero ir al baño, por favor.')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md transition-transform"
          >
            <Volume2 className="w-4 h-4" strokeWidth={2.5} />
            <span>Escuchar Voz</span>
          </button>
        </div>
      </div>

      {/* 2. Cooldown Duration Slider */}
      <div className="bg-slate-850 p-4 rounded-3xl border border-slate-700 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 uppercase">
            Bloqueo Anti-Temblor (Cooldown):
          </label>
          <span className="text-sm font-black text-amber-400">
            {(settings.cooldownDurationMs / 1000).toFixed(1)} segundos
          </span>
        </div>
        <input
          type="range"
          min="1000"
          max="5000"
          step="250"
          value={settings.cooldownDurationMs}
          onChange={(e) => onUpdateSettings({ cooldownDurationMs: parseInt(e.target.value, 10) })}
          className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-900 rounded-lg"
        />
        <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
          <span>1.0s (Mínimo)</span>
          <span>2.5s (Estándar clínico recomendado)</span>
          <span>5.0s (Máxima protección para espasmos)</span>
        </div>
      </div>

      {/* 3. Audio Toggles: Human Voice Preference, Chime */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Prefer Recorded Human Voice Audio */}
        <div className="bg-slate-850 p-4 rounded-3xl border border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-900/60 rounded-xl text-emerald-300">
              <Mic className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Priorizar voz humana grabada</p>
              <p className="text-xs text-slate-400">Si un botón tiene audio real de micrófono, usarlo</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.preferRecordedAudio}
            onChange={(e) => onUpdateSettings({ preferRecordedAudio: e.target.checked })}
            className="w-6 h-6 accent-emerald-500 rounded cursor-pointer"
          />
        </div>

        {/* Chime toggle */}
        <div className="bg-slate-850 p-4 rounded-3xl border border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-900/60 rounded-xl text-indigo-300">
              <Bell className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Tono campana previo (300ms)</p>
              <p className="text-xs text-slate-400">Avisa a cuidadores antes de hablar</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.chimeEnabled}
            onChange={(e) => onUpdateSettings({ chimeEnabled: e.target.checked })}
            className="w-6 h-6 accent-indigo-500 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* 4. Acoustic Alert Testing */}
      <div className="bg-slate-850 p-4 rounded-3xl border border-slate-700 flex flex-col gap-3">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Pruebas sonoras de alertas de habitación:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => playChimeSound()}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/60 text-indigo-200 font-bold active:scale-95 text-sm transition-transform"
          >
            <Bell className="w-4 h-4" strokeWidth={2.5} />
            <span>Probar Campana Suave (300ms)</span>
          </button>

          <button
            type="button"
            onClick={() => playUrgentAlarmSound()}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-950/80 hover:bg-red-900 border border-red-500/60 text-red-200 font-bold active:scale-95 text-sm transition-transform"
          >
            <BellRing className="w-4 h-4" strokeWidth={2.5} />
            <span>Probar Alarma Urgente (Dolor)</span>
          </button>
        </div>
      </div>
    </div>
  )
}
