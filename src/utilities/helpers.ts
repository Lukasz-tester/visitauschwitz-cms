'use client'

import { useEffect, useState } from 'react'

export const useLockBodyScroll = (flag: boolean) =>
  useEffect(() => {
    document.body.style.overflow = flag ? 'hidden' : 'auto'
  }, [flag])

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

export const scrolledFromTop = () => {
  const [visible, setVisible] = useState(false)

  const scrolledDown = () => {
    if (window.scrollY > 200) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', scrolledDown)
    return () => {
      window.removeEventListener('scroll', scrolledDown)
    }
  }, [])

  return visible
}

// export const scrollToAnchor = (id) => {
//   const yOffset = 0
//   const element = document.querySelector(id)

//   if (element) {
//     const pageY = document.querySelector('#root')?.scrollTop
//     const y = element.getBoundingClientRect().top + pageY + yOffset
//     document.querySelector('#root')?.scrollTo({ top: y, behavior: 'smooth' })
//   }
// }
