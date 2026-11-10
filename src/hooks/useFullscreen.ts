import { useCallback, useEffect, useState } from 'react'

export function useFullscreen() {
  const [isSupported] = useState<boolean>(() => {
    return (
      typeof document !== 'undefined' &&
      !!(
        document.fullscreenEnabled ||
        (document as unknown as { webkitFullscreenEnabled?: boolean }).webkitFullscreenEnabled
      )
    )
  })

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)

  useEffect(() => {
    const updateState = () => {
      const full = !!(
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement
      )
      setIsFullscreen(full)
    }

    document.addEventListener('fullscreenchange', updateState)
    document.addEventListener('webkitfullscreenchange', updateState)

    return () => {
      document.removeEventListener('fullscreenchange', updateState)
      document.removeEventListener('webkitfullscreenchange', updateState)
    }
  }, [])

  const toggleFullscreen = useCallback(async () => {
    if (typeof document === 'undefined') return

    try {
      if (!document.fullscreenElement) {
        const root = document.documentElement
        if (root.requestFullscreen) {
          await root.requestFullscreen()
        } else if ((root as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
          await (root as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else if ((document as unknown as { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
          await (document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen()
        }
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err)
    }
  }, [])

  return {
    isFullscreen,
    isSupported,
    toggleFullscreen,
  }
}
