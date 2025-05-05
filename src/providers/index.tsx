import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
// import { RouteTransitionWrapper } from '../components/RouteTransitionWrapper' // Adjust the path as needed

// export const Providers: React.FC<{
//   children: React.ReactNode
// }> = ({ children }) => {
//   return (
//     <ThemeProvider>
//       <HeaderThemeProvider>{children}</HeaderThemeProvider>
//     </ThemeProvider>
//   )
// }

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>{children}</HeaderThemeProvider>
    </ThemeProvider>
  )
}
