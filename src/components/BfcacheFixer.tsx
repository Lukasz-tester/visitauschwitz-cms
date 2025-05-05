'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function BfcacheFixer() {
  const router = useRouter()

  useEffect(() => {
    if (performance?.getEntriesByType) {
      const [nav] = performance.getEntriesByType('navigation')
      if (nav && (nav as PerformanceNavigationTiming).type === 'back_forward') {
        // Soft client-side refresh to rehydrate
        router.replace(window.location.pathname)
      }
    }
  }, [router])

  return null
}
