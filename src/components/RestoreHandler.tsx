'use client'

import { useEffect } from 'react'

export function RestoreHandler() {
  useEffect(() => {
    const handler = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Page was restored from bfcache
        window.location.reload()
      }
    }

    window.addEventListener('pageshow', handler)
    return () => window.removeEventListener('pageshow', handler)
  }, [])

  return null
}
