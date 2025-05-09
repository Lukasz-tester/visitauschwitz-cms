'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const REFRESH_THRESHOLD = 10 * 60 * 1000 // 10 minutes

export const TabFocusProvider = ({ children }: { children: React.ReactNode }) => {
  const [lastFocus, setLastFocus] = useState(Date.now())
  const [refreshKey, setRefreshKey] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const now = Date.now()
        if (now - lastFocus > REFRESH_THRESHOLD) {
          setRefreshKey((prev) => prev + 1) // 🔄 Trigger re-render
          router.prefetch(window.location.pathname) // 🚀 Warm up the cache
        }
        setLastFocus(now)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [lastFocus, router])

  return <div key={refreshKey}>{children}</div>
}
