'use client'

import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export function ConditionalCookies() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (consent === 'true') {
      setEnabled(true)
    }
  }, [])

  return enabled ? (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  ) : null
}
