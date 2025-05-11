'use client'
import { useEffect, useState } from 'react'

const clearCache = async () => {
  // Clear caches if not already cleared
  const cacheNames = await caches.keys()
  cacheNames.forEach((name) => caches.delete(name))
}

export const TabFocusProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Check if we're offline
        if (!navigator.onLine) {
          setIsOffline(true)
          return
        }

        // Check if <html> is missing
        if (!document.documentElement.outerHTML.includes('<html')) {
          clearCache().finally(() => {
            window.location.reload()
          })
        }
      }
    }

    const handleOnline = () => {
      window.location.reload()
    }

    // Event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('online', handleOnline)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  return (
    <>
      {isOffline && (
        <div className="fixed bottom-4 left-4 bg-red-600 text-white p-2 rounded-lg shadow-lg">
          ⚠️ You are offline. Reconnect to reload the page.
        </div>
      )}
      {children}
    </>
  )
}
