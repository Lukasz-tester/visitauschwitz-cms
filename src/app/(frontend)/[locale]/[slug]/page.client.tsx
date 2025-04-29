'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the component to load only on the client-side
const PageClient: React.FC = () => {
  /* Force the header to be light mode while we have an image behind it */
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    // Ensure theme is set once the component is mounted
    setHeaderTheme('light')
  }, [setHeaderTheme])

  return <React.Fragment />
}

// Export dynamic component with SSR disabled
export default dynamic(() => Promise.resolve(PageClient), {
  ssr: false, // Disable server-side rendering for this component
})

// 'use client'
// import { useHeaderTheme } from '@/providers/HeaderTheme'
// import React, { useEffect } from 'react'

// const PageClient: React.FC = () => {
//   /* Force the header to be dark mode while we have an image behind it */
//   const { setHeaderTheme } = useHeaderTheme()

//   useEffect(() => {
//     setHeaderTheme('light')
//   }, [setHeaderTheme])
//   return <React.Fragment />
// }

// export default PageClient
