//set up a Service Worker for more reliability.

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

//BELOW improved version:
// 'use client'
// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'

// const REFRESH_THRESHOLD = 10 * 60 * 1000 // 10 minutes
// const PREFETCH_LIMIT = 30 * 60 * 1000    // 30 minutes

// export const TabFocusProvider = ({ children }: { children: React.ReactNode }) => {
//   const [lastFocus, setLastFocus] = useState(() => {
//     const stored = localStorage.getItem('lastFocus')
//     return stored ? parseInt(stored, 10) : Date.now()
//   })
//   const [refreshKey, setRefreshKey] = useState(0)
//   const router = useRouter()

//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.visibilityState === 'visible') {
//         const now = Date.now()
//         const offlineDuration = now - lastFocus

//         if (offlineDuration > REFRESH_THRESHOLD) {
//           setRefreshKey((prev) => prev + 1)

//           if (offlineDuration <= PREFETCH_LIMIT) {
//             // 🚀 Warm up the cache only if sleep was less than 30 minutes
//             router.prefetch(window.location.pathname)
//           } else {
//             // 🔄 Hard refresh if it was longer
//             window.location.reload()
//           }
//         }
//         setLastFocus(now)
//         localStorage.setItem('lastFocus', now.toString())
//       }
//     }

//     window.addEventListener('focus', handleVisibilityChange)
//     document.addEventListener('visibilitychange', handleVisibilityChange)

//     return () => {
//       window.removeEventListener('focus', handleVisibilityChange)
//       document.removeEventListener('visibilitychange', handleVisibilityChange)
//     }
//   }, [lastFocus, router])

//   return <div key={refreshKey}>{children}</div>
// }
