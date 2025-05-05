'use client'

import { useEffect } from 'react'

export function RestoreHandler() {
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      console.log('[RestoreHandler] pageshow detected. Persisted:', event.persisted)

      if (event.persisted) {
        // ✅ Force reload to rehydrate React
        // ⚠️ Use reload with `window.location.reload()` or soft navigation
        window.location.reload()
      }
    }

    window.addEventListener('pageshow', onPageShow)

    return () => window.removeEventListener('pageshow', onPageShow)
  }, [])

  return null
}
