'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Trigger a soft refresh (refetches RSC, respects cache)
        router.replace(window.location.pathname)
      }
    }

    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [router])

  return <>{children}</>
}
