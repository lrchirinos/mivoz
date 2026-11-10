import React, { useEffect, useRef, useState } from 'react'
import { Check, Mic, Play, Square, Trash2 } from 'lucide-react'
import { deleteRecordedAudio, getRecordedAudio, saveRecordedAudio } from '../../services/voiceRecordStorage'

interface VoiceRecorderWidgetProps {
  buttonKey: string
  buttonLabel: string
  onAudioChanged?: () => void
}

export const VoiceRecorderWidget: React.FC<VoiceRecorderWidgetProps> = ({
  buttonKey,
  buttonLabel,
  onAudioChanged,
}) => {
  const [existingAudio, setExistingAudio] = useState<{ url: string; durationMs: number } | null>(null)
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerIntervalRef = useRef<number | null>(null)
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)
  const recordStartTimeRef = useRef<number>(0)

  // Load existing audio on mount or key change
  useEffect(() => {
    let isMounted = true
    const checkAudio = async () => {
      try {
        const audio = await getRecordedAudio(buttonKey)
        if (isMounted) {
          setExistingAudio(audio ? { url: audio.url, durationMs: audio.durationMs } : null)
        }
      } catch {
        if (isMounted) setExistingAudio(null)
      }
    }
    checkAudio()
    return () => {
      isMounted = false
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause()
        audioPlayerRef.current = null
      }
    }
  }, [buttonKey])

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const startRecording = async () => {
    setErrorMessage(null)
    setSaveSuccess(false)
    audioChunksRef.current = []

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage('Tu navegador no soporta grabación por micrófono.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Determine supported mimeType
      const mimeTypes = ['audio/webm', 'audio/mp4', 'audio/ogg', '']
      let selectedMime = ''
      for (const mime of mimeTypes) {
        if (!mime || MediaRecorder.isTypeSupported(mime)) {
          selectedMime = mime
          break
        }
      }

      const recorder = selectedMime
        ? new MediaRecorder(stream, { mimeType: selectedMime })
        : new MediaRecorder(stream)

      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop())
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)

        const durationMs = Math.max(800, Date.now() - recordStartTimeRef.current)
        const blob = new Blob(audioChunksRef.current, { type: selectedMime || 'audio/webm' })

        if (blob.size > 500) {
          await saveRecordedAudio(buttonKey, blob, durationMs)
          const updated = await getRecordedAudio(buttonKey)
          setExistingAudio(updated ? { url: updated.url, durationMs: updated.durationMs } : null)
          setSaveSuccess(true)
          setTimeout(() => setSaveSuccess(false), 3000)
          onAudioChanged?.()
        }
        setIsRecording(false)
      }

      recordStartTimeRef.current = Date.now()
      recorder.start(100)
      setIsRecording(true)
      setRecordingSeconds(0)

      // Timer counter (auto-stop after 8 seconds)
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 8) {
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)
    } catch (err: unknown) {
      setIsRecording(false)
      const msg = err instanceof Error ? err.message : 'Error al acceder al micrófono'
      setErrorMessage(`No se pudo acceder al micrófono: ${msg}`)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
  }

  const playRecorded = () => {
    if (!existingAudio || !existingAudio.url) return

    if (isPlaying && audioPlayerRef.current) {
      audioPlayerRef.current.pause()
      setIsPlaying(false)
      return
    }

    const audio = new Audio(existingAudio.url)
    audioPlayerRef.current = audio
    setIsPlaying(true)

    audio.onended = () => setIsPlaying(false)
    audio.onerror = () => setIsPlaying(false)

    audio.play().catch(() => setIsPlaying(false))
  }

  const handleDelete = async () => {
    await deleteRecordedAudio(buttonKey)
    setExistingAudio(null)
    setSaveSuccess(false)
    onAudioChanged?.()
  }

  return (
    <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-700 flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Mic className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
          <span>Voz Real Grabada ({buttonLabel}):</span>
        </label>

        {existingAudio ? (
          <span className="text-[11px] font-black text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" strokeWidth={3} />
            Audio Personalizado Activo
          </span>
        ) : (
          <span className="text-[11px] font-medium text-slate-400">
            Usando voz sintética TTS
          </span>
        )}
      </div>

      <p className="text-xs text-slate-400">
        Graba tu propia voz (o la de un familiar) para que el paciente escuche una voz humana cálida y real.
      </p>

      {/* Recording & Playback Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs shadow transition-transform"
          >
            <Mic className="w-4 h-4 text-emerald-200" strokeWidth={2.5} />
            <span>{existingAudio ? 'Volver a Grabar' : 'Grabar con Micrófono'}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-black text-xs animate-pulse shadow transition-transform"
          >
            <Square className="w-4 h-4 fill-white text-white" />
            <span>Detener Grabación ({recordingSeconds}s / 8s)</span>
          </button>
        )}

        {existingAudio && !isRecording && (
          <>
            <button
              type="button"
              onClick={playRecorded}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-700 hover:bg-sky-600 active:scale-95 text-white font-bold text-xs shadow transition-transform"
            >
              {isPlaying ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Escuchar Grabación</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              title="Borrar audio grabado y volver a síntesis de voz"
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/50 active:scale-95 text-red-200 text-xs font-semibold transition-transform"
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span>Quitar</span>
            </button>
          </>
        )}

        {saveSuccess && (
          <span className="text-xs font-bold text-emerald-300 animate-bounce ml-2 flex items-center gap-1">
            <Check className="w-4 h-4" strokeWidth={3} />
            ¡Audio guardado offline!
          </span>
        )}
      </div>

      {errorMessage && (
        <p className="text-xs text-red-400 font-semibold bg-red-950/40 p-2 rounded-lg border border-red-800">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
