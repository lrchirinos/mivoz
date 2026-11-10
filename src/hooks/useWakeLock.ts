import { useCallback, useEffect, useRef, useState } from 'react'

export function useWakeLock(enabled: boolean = true) {
  const [isSupported] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' && 'wakeLock' in navigator
  })
  const [isActive, setIsActive] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const sentinelRef = useRef<WakeLockSentinel | null>(null)

  const releaseLock = useCallback(async () => {
    if (sentinelRef.current && !sentinelRef.current.released) {
      try {
        await sentinelRef.current.release()
      } catch {
        // Ignored
      }
      sentinelRef.current = null
    }
    setIsActive(false)
  }, [])

  const requestLock = useCallback(async () => {
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) {
      return false
    }

    try {
      if (sentinelRef.current && !sentinelRef.current.released) {
        setIsActive(true)
        return true
      }

      const sentinel = await navigator.wakeLock.request('screen')
      sentinelRef.current = sentinel
      setIsActive(true)
      setError(null)

      sentinel.addEventListener('release', () => {
        setIsActive(false)
        sentinelRef.current = null
      })

      return true
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo activar WakeLock'
      setError(msg)
      setIsActive(false)
      return false
    }
  }, [])

  useEffect(() => {
    if (!enabled || !isSupported) {
      if (sentinelRef.current) {
        sentinelRef.current.release().catch(() => {})
        sentinelRef.current = null
      }
      return
    }

    let isCancelled = false

    const acquire = async () => {
      try {
        if (sentinelRef.current && !sentinelRef.current.released) {
          if (!isCancelled) setIsActive(true)
          return
        }

        const sentinel = await navigator.wakeLock.request('screen')
        if (isCancelled) {
          sentinel.release().catch(() => {})
          return
        }

        sentinelRef.current = sentinel
        setIsActive(true)
        setError(null)

        sentinel.addEventListener('release', () => {
          if (!isCancelled) {
            setIsActive(false)
            sentinelRef.current = null
          }
        })
      } catch (err: unknown) {
        if (!isCancelled) {
          const msg = err instanceof Error ? err.message : 'No se pudo activar WakeLock'
          setError(msg)
          setIsActive(false)
        }
      }
    }

    acquire()

    // Re-acquire lock on visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enabled) {
        acquire()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      isCancelled = true
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (sentinelRef.current) {
        sentinelRef.current.release().catch(() => {})
        sentinelRef.current = null
      }
    }
  }, [enabled, isSupported])

  return {
    isSupported,
    isActive,
    error,
    requestLock,
    releaseLock,
  }
}
