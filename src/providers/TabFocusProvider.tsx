'use client'
import { useEffect, useState } from 'react'

const REFRESH_THRESHOLD = 10 * 60 * 1000 // 10 minutes

export const TabFocusProvider = ({ children }: { children: React.ReactNode }) => {
  const [lastFocus, setLastFocus] = useState(Date.now())

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const now = Date.now()
        if (now - lastFocus > REFRESH_THRESHOLD) {
          window.location.reload()
        }
        setLastFocus(now)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [lastFocus])

  return <>{children}</>
}
