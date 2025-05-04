'use client'

import { useEffect } from 'react'

export function RestoreHandler() {
  useEffect(() => {
    const onRestore = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Only reload if the page was loaded from bfcache
        window.location.reload()
      }
    }

    window.addEventListener('pageshow', onRestore)

    return () => {
      window.removeEventListener('pageshow', onRestore)
    }
  }, [])

  return null
}
