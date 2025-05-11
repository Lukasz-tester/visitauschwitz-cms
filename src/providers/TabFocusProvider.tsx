'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const isRawJson = async () => {
  try {
    const response = await fetch(window.location.href, { method: 'HEAD' })
    const isJson = response.headers.get('content-type')?.includes('application/json')
    const bodyText = document.body.innerText

    // 🧐 Check if it contains the typical RSC JSON structure
    return isJson && /{"children":\s*\[/.test(bodyText)
  } catch (error) {
    console.error('Error while checking page content:', error)
    return false
  }
}

export const TabFocusProvider = ({ children }: { children: React.ReactNode }) => {
  const [refreshKey, setRefreshKey] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        console.log('[TabFocusProvider] Tab focused. Checking for raw RSC JSON...')

        const isRaw = await isRawJson() // ⏳ Await the result
        if (isRaw) {
          console.warn('[TabFocusProvider] Raw RSC JSON detected! Reloading page.')
          window.location.reload()
        } else {
          console.log('[TabFocusProvider] Page content is fine. No action needed.')
        }

        // 🔄 Force re-render if content is valid (just to refresh state)
        setRefreshKey((prev) => prev + 1)
      }
    }

    // Listen for tab visibility changes
    window.addEventListener('focus', handleVisibilityChange)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('focus', handleVisibilityChange)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [router])

  return <div key={refreshKey}>{children}</div>
}

// BELOW new imrpved but not tested logic
// // 'use client'
// // import { useEffect, useState } from 'react'
// // import { useRouter } from 'next/navigation'

// // const REFRESH_THRESHOLD = 10 * 60 * 1000 // 10 minutes

// // export const TabFocusProvider = ({ children }: { children: React.ReactNode }) => {
// //   const [lastFocus, setLastFocus] = useState(Date.now())
// //   const [refreshKey, setRefreshKey] = useState(0)
// //   const router = useRouter()

// //   useEffect(() => {
// //     const handleVisibilityChange = () => {
// //       if (document.visibilityState === 'visible') {
// //         const now = Date.now()
// //         if (now - lastFocus > REFRESH_THRESHOLD) {
// //           setRefreshKey((prev) => prev + 1) // 🔄 Trigger re-render
// //           router.prefetch(window.location.pathname) // 🚀 Warm up the cache
// //         }
// //         setLastFocus(now)
// //       }
// //     }

// //     document.addEventListener('visibilitychange', handleVisibilityChange)

// //     return () => {
// //       document.removeEventListener('visibilitychange', handleVisibilityChange)
// //     }
// //   }, [lastFocus, router])

// //   return <div key={refreshKey}>{children}</div>
// // }

// // BELOW improved version:

// 'use client'
// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'

// const REFRESH_THRESHOLD = 10 * 60 * 1000 // 10 minutes
// const PREFETCH_LIMIT = 30 * 60 * 1000 // 30 minutes

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
