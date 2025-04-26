// 'use client'

// import { useHeaderTheme } from '@/providers/HeaderTheme'
// import { useEffect } from 'react'

// const PageClient: React.FC = () => {
//   const { setHeaderTheme } = useHeaderTheme()

//   useEffect(() => {
//     setHeaderTheme('light')
//   }, []) // dependency removed for consistent static behavior

//   return null // cleaner than <React.Fragment /> when rendering nothing
// }

// export default PageClient

// BEFORE:
'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

const PageClient: React.FC = () => {
  /* Force the header to be dark mode while we have an image behind it */
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])
  return <React.Fragment />
}

export default PageClient
