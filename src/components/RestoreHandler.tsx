'use client'

import { useEffect, useState, createContext, useContext } from 'react'

const RestoreContext = createContext(0)

export const useRestoreKey = () => useContext(RestoreContext)

export function RestoreHandler({ children }: { children: React.ReactNode }) {
  const [key, setKey] = useState(0)

  useEffect(() => {
    const onPageshow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Soft refresh by changing key (no hard reload)
        setKey((k) => k + 1)
      }
    }

    window.addEventListener('pageshow', onPageshow)
    return () => window.removeEventListener('pageshow', onPageshow)
  }, [])

  return <RestoreContext.Provider value={key}>{children}</RestoreContext.Provider>
}
