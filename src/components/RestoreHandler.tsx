'use client'

import { useEffect, useState } from 'react'

export function RestoreHandler() {
  const [status, setStatus] = useState('Waiting for pageshow event...')

  useEffect(() => {
    const handler = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setStatus('BFCache restore detected!')
        document.body.innerHTML = '<h1 style="color:red;">BFCache restore detected!</h1>'
      } else {
        setStatus('Normal navigation (not from bfcache)')
      }
    }

    window.addEventListener('pageshow', handler)

    return () => {
      window.removeEventListener('pageshow', handler)
    }
  }, [])

  return (
    <div
      style={{ position: 'fixed', bottom: 10, left: 10, background: 'white', padding: '0.5rem' }}
    >
      <strong>RestoreHandler:</strong> {status}
    </div>
  )
}
