'use client'
import { useEffect } from 'react'

const ServiceWorkerProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => {
          console.log('[SW] Service Worker registered.')
        })
        .catch((err) => {
          console.error('[SW] Registration failed:', err)
        })

      // 👂 Listen for messages from Service Worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'RELOAD_PAGE') {
          console.warn('[SW] Reload triggered by raw RSC JSON detection.')
          window.location.reload()
        }
      })
    }
  }, [])

  return <>{children}</>
}

export default ServiceWorkerProvider
