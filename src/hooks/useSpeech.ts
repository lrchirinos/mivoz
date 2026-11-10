import { Capacitor } from '@capacitor/core'
import { TextToSpeech } from '@capacitor-community/text-to-speech'
import { useCallback, useEffect, useRef, useState } from 'react'
import { playChimeSound, playUrgentAlarmSound } from '../services/audioService'
import { getPreloadedMaleAudioUrl } from '../services/maleVoiceCache'
import { synthesizePiperMaleVoice } from '../services/piperService'
import { getAllRecordedAudioKeys, getRecordedAudio } from '../services/voiceRecordStorage'
import type { CaregiverSettings, SpeechStatus } from '../types/aac'

interface SpeakOptions {
  buttonId?: number
  buttonKey?: string
  label?: string
  isUrgent?: boolean
  skipChime?: boolean
  forceTTS?: boolean
}

export interface UnifiedVoice {
  voiceURI: string
  name: string
  lang: string
  isMale: boolean
  isDefault: boolean
}

const MALE_VOICE_KEYWORDS = [
  'male',
  'hombre',
  'jorge',
  'pablo',
  'diego',
  'carlos',
  'raul',
  'raúl',
  'eef',
  'esf',
  'sfb',
  'std-c',
  'std-b',
  'wavenet-b',
  'wavenet-c',
  'neural2-b',
]

function isMaleVoiceName(name: string, uri: string): boolean {
  const combined = `${name} ${uri}`.toLowerCase()
  return MALE_VOICE_KEYWORDS.some((kw) => combined.includes(kw))
}

export function useSpeech(settings: CaregiverSettings) {
  const [availableVoices, setAvailableVoices] = useState<UnifiedVoice[]>([])
  const [recordedKeys, setRecordedKeys] = useState<string[]>([])
  const [speechStatus, setSpeechStatus] = useState<SpeechStatus>({
    isSpeaking: false,
    activeButtonId: null,
    activeLabel: null,
    isUrgent: false,
    isRecordedAudio: false,
    cooldownRemainingMs: 0,
    cooldownProgress: 0,
  })

  const cooldownTimerRef = useRef<number | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const cooldownEndTimestampRef = useRef<number>(0)
  const currentAudioElRef = useRef<HTMLAudioElement | null>(null)
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Load custom recorded audio keys from IndexedDB
  const refreshRecordedAudios = useCallback(async () => {
    try {
      const keys = await getAllRecordedAudioKeys()
      setRecordedKeys(keys)
    } catch {
      // Ignored
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    getAllRecordedAudioKeys()
      .then((keys) => {
        if (isMounted) setRecordedKeys(keys)
      })
      .catch(() => {})
    return () => {
      isMounted = false
    }
  }, [])

  // Scan and list system voices from device so user can pick from them if they want
  useEffect(() => {
    let isCancelled = false

    const loadVoices = async () => {
      const list: UnifiedVoice[] = []

      // Native Capacitor voices if on Android / iOS
      if (Capacitor.isNativePlatform()) {
        try {
          const capResult = await TextToSpeech.getSupportedVoices()
          if (capResult && capResult.voices) {
            capResult.voices.forEach((v) => {
              const uri = v.voiceURI || v.name
              list.push({
                voiceURI: uri,
                name: v.name,
                lang: v.lang,
                isMale: isMaleVoiceName(v.name, uri),
                isDefault: !!v.default,
              })
            })
          }
        } catch {
          // Ignored
        }
      }

      // Web Speech API voices
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const synth = window.speechSynthesis
        const webVoices = synth.getVoices()
        webVoices.forEach((v) => {
          if (!list.some((existing) => existing.voiceURI === v.voiceURI)) {
            list.push({
              voiceURI: v.voiceURI,
              name: v.name,
              lang: v.lang,
              isMale: isMaleVoiceName(v.name, v.voiceURI),
              isDefault: !!v.default,
            })
          }
        })
      }

      if (isCancelled || list.length === 0) return

      // Sort: Spanish voices first
      const sorted = [...list].sort((a, b) => {
        const aEs = a.lang.toLowerCase().startsWith('es')
        const bEs = b.lang.toLowerCase().startsWith('es')
        if (aEs && !bEs) return -1
        if (!aEs && bEs) return 1
        return 0
      })

      setAvailableVoices(sorted)
    }

    loadVoices()

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        if (!isCancelled) loadVoices()
      }
    }

    return () => {
      isCancelled = true
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null
      }
    }
  }, [])

  // Clear animation frames and timers on unmount
  useEffect(() => {
    const timer = cooldownTimerRef.current
    const frame = animFrameRef.current
    return () => {
      if (timer) clearTimeout(timer)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  // Start visual cooldown progress
  const startCooldown = useCallback(
    (
      durationMs: number,
      buttonId: number | null,
      label: string | null,
      isUrgent: boolean,
      isRecorded: boolean = false
    ) => {
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)

      const start = performance.now()
      const end = start + durationMs
      cooldownEndTimestampRef.current = end

      setSpeechStatus({
        isSpeaking: true,
        activeButtonId: buttonId,
        activeLabel: label,
        isUrgent,
        isRecordedAudio: isRecorded,
        cooldownRemainingMs: durationMs,
        cooldownProgress: 0,
      })

      const updateProgress = () => {
        const now = performance.now()
        const remaining = Math.max(0, end - now)
        const progress = Math.min(1, (now - start) / durationMs)

        if (remaining > 0) {
          setSpeechStatus((prev) => ({
            ...prev,
            cooldownRemainingMs: Math.round(remaining),
            cooldownProgress: progress,
          }))
          animFrameRef.current = requestAnimationFrame(updateProgress)
        } else {
          setSpeechStatus({
            isSpeaking: false,
            activeButtonId: null,
            activeLabel: null,
            isUrgent: false,
            isRecordedAudio: false,
            cooldownRemainingMs: 0,
            cooldownProgress: 1,
          })
        }
      }

      animFrameRef.current = requestAnimationFrame(updateProgress)
    },
    []
  )

  const stop = useCallback(() => {
    if (currentAudioElRef.current) {
      currentAudioElRef.current.pause()
      currentAudioElRef.current = null
    }

    if (Capacitor.isNativePlatform()) {
      TextToSpeech.stop().catch(() => {})
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }

    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current)
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)

    setSpeechStatus({
      isSpeaking: false,
      activeButtonId: null,
      activeLabel: null,
      isUrgent: false,
      isRecordedAudio: false,
      cooldownRemainingMs: 0,
      cooldownProgress: 1,
    })
  }, [])

  const playAudioUrl = useCallback(
    (
      url: string,
      durationEstimateMs: number,
      buttonId: number | null,
      label: string,
      isUrgent: boolean,
      isRecorded: boolean
    ) => {
      if (currentAudioElRef.current) {
        currentAudioElRef.current.pause()
        currentAudioElRef.current = null
      }

      const audio = new Audio(url)
      currentAudioElRef.current = audio

      startCooldown(durationEstimateMs, buttonId, label, isUrgent, isRecorded)

      return new Promise<boolean>((resolve) => {
        audio.onended = () => {
          currentAudioElRef.current = null
          resolve(true)
        }
        audio.onerror = () => {
          currentAudioElRef.current = null
          resolve(false)
        }
        audio.play().catch(() => {
          currentAudioElRef.current = null
          resolve(false)
        })
      })
    },
    [startCooldown]
  )

  const speak = useCallback(
    async (text: string, options: SpeakOptions = {}): Promise<boolean> => {
      if (!text || !text.trim()) return false

      // Anti-tremor cooldown guard
      const now = performance.now()
      if (now < cooldownEndTimestampRef.current) {
        return false
      }

      const isUrgent = !!options.isUrgent
      const buttonId = options.buttonId ?? null
      const buttonKey = options.buttonKey || (buttonId ? `btn-${buttonId}` : undefined)
      const label = options.label ?? text
      const defaultDurationMs = settings.cooldownDurationMs || 2500

      // Step 1: Pre-speech acoustic cue (chime / emergency alarm)
      let preDelayMs = 0
      if (isUrgent) {
        preDelayMs = 350
        playUrgentAlarmSound().catch(() => {})
      } else if (settings.chimeEnabled && !options.skipChime) {
        preDelayMs = 300
        playChimeSound().catch(() => {})
      }

      if (preDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, preDelayMs))
      }

      // Step 2: Check for Human-Recorded Real Voice (Microphone)
      if (settings.preferRecordedAudio && buttonKey && !options.forceTTS) {
        try {
          const recorded = await getRecordedAudio(buttonKey)
          if (recorded && recorded.url) {
            const durationMs = Math.max(1800, recorded.durationMs + 300)
            return await playAudioUrl(recorded.url, durationMs, buttonId, label, isUrgent, true)
          }
        } catch {
          // Fallback to voice package
        }
      }

      // Step 3: Check if User Explicitly Selected a System Voice from device
      const isCustomSystemVoice =
        settings.voiceURI &&
        settings.voiceURI !== 'neural-male' &&
        settings.voiceURI !== 'default'

      if (isCustomSystemVoice && !options.forceTTS) {
        startCooldown(defaultDurationMs, buttonId, label, isUrgent, false)

        // Try Native Capacitor TTS
        if (Capacitor.isNativePlatform()) {
          try {
            await TextToSpeech.speak({
              text: text.trim(),
              lang: 'es-ES',
              rate: settings.voiceRate || 0.9,
              pitch: settings.voicePitch || 1.0,
              volume: settings.voiceVolume ?? 1.0,
              voice: settings.voiceURI ? undefined : undefined,
            })
            return true
          } catch {
            // Fallback to Web Speech
          }
        }

        // Web Speech API
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          const synth = window.speechSynthesis
          synth.cancel()

          const utterance = new SpeechSynthesisUtterance(text.trim())
          utterance.rate = settings.voiceRate || 0.9
          utterance.pitch = settings.voicePitch || 1.0
          utterance.volume = settings.voiceVolume ?? 1.0

          const allWebVoices = synth.getVoices()
          const matched = allWebVoices.find((v) => v.voiceURI === settings.voiceURI)
          if (matched) utterance.voice = matched

          activeUtteranceRef.current = utterance

          return new Promise<boolean>((resolve) => {
            utterance.onend = () => resolve(true)
            utterance.onerror = () => resolve(false)
            try {
              synth.speak(utterance)
            } catch {
              resolve(false)
            }
          })
        }
      }

      // Step 4: DEFAULT VOICE — Pre-rendered Male Neural Audio Cache (Instant 0ms Latency)
      const preloadedUrl = getPreloadedMaleAudioUrl(buttonKey, text)
      if (preloadedUrl) {
        return await playAudioUrl(preloadedUrl, defaultDurationMs, buttonId, label, isUrgent, false)
      }

      // Step 5: DEFAULT VOICE — Piper WebAssembly Neural Voice (es_MX-ald-medium) for custom text
      try {
        const synthesizedUrl = await synthesizePiperMaleVoice(text)
        if (synthesizedUrl) {
          return await playAudioUrl(synthesizedUrl, defaultDurationMs, buttonId, label, isUrgent, false)
        }
      } catch (piperErr) {
        console.warn('Piper WASM custom synthesis error:', piperErr)
      }

      startCooldown(defaultDurationMs, buttonId, label, isUrgent, false)
      return true
    },
    [settings, startCooldown, playAudioUrl]
  )

  return {
    speak,
    stop,
    speechStatus,
    recordedKeys,
    availableVoices,
    refreshRecordedAudios,
    isCooldownActive: speechStatus.cooldownRemainingMs > 0,
  }
}
