/**
 * Audio Service using Web Audio API (100% Offline)
 * Synthesizes soft call chimes and urgent alert alarms.
 */

let sharedAudioContext: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  try {
    if (!sharedAudioContext) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        sharedAudioContext = new AudioCtx()
      }
    }
    if (sharedAudioContext && sharedAudioContext.state === 'suspended') {
      sharedAudioContext.resume().catch(() => {
        // Ignored if user hasn't interacted yet
      })
    }
    return sharedAudioContext
  } catch {
    return null
  }
}

/**
 * Plays a warm 3-tone harmonic chime (C5 -> E5 -> G5) to alert caregivers gently before speech starts.
 * Duration: ~350ms total.
 */
export async function playChimeSound(): Promise<void> {
  const ctx = getAudioContext()
  if (!ctx) return

  if (ctx.state === 'suspended') {
    try {
      await ctx.resume()
    } catch {
      // Continue anyway
    }
  }

  const now = ctx.currentTime

  // Notes: C5 (523.25), E5 (659.25), G5 (783.99)
  const notes = [
    { freq: 523.25, start: 0.00, duration: 0.28 },
    { freq: 659.25, start: 0.08, duration: 0.28 },
    { freq: 783.99, start: 0.16, duration: 0.35 },
  ]

  notes.forEach(({ freq, start, duration }) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, now + start)

    // Soft chime envelope: rapid attack and smooth exponential decay
    gain.gain.setValueAtTime(0.0001, now + start)
    gain.gain.linearRampToValueAtTime(0.22, now + start + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now + start)
    osc.stop(now + start + duration)
  })
}

/**
 * Plays an urgent repeating two-tone alert (A5 -> C6 -> A5 -> C6) for the pain/emergency button.
 * Cuts through ambient room noise to alert caregivers.
 * Duration: ~650ms.
 */
export async function playUrgentAlarmSound(): Promise<void> {
  const ctx = getAudioContext()
  if (!ctx) return

  if (ctx.state === 'suspended') {
    try {
      await ctx.resume()
    } catch {
      // Continue
    }
  }

  const now = ctx.currentTime
  const pulses = [
    { freq: 880.0, start: 0.00, duration: 0.14 },
    { freq: 1108.7, start: 0.15, duration: 0.18 },
    { freq: 880.0, start: 0.36, duration: 0.14 },
    { freq: 1174.6, start: 0.51, duration: 0.22 },
  ]

  pulses.forEach(({ freq, start, duration }) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    // Triangle wave adds noticeable harmonics for emergency audibility
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(freq, now + start)

    gain.gain.setValueAtTime(0.0001, now + start)
    gain.gain.linearRampToValueAtTime(0.35, now + start + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now + start)
    osc.stop(now + start + duration)
  })
}
