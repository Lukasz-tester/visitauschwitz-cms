'use client'

import { useEffect, useState } from 'react'

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState<any | null>(null)
  useEffect(() => {
    const mediaMatch = window.matchMedia(query)
    if (!mediaMatch) return
    setMatches(mediaMatch.matches)

    const handler = (e) => setMatches(e.matches)
    mediaMatch.addEventListener('change', handler)

    return () => mediaMatch.removeEventListener('change', handler)
  })
  return matches
}
