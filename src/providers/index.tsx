import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import ServiceWorkerProvider from './ServiceWorkerProvider'
// import { TabFocusProvider } from './TabFocusProvider'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ServiceWorkerProvider>
      <ThemeProvider>
        {/* <TabFocusProvider> */}
        <HeaderThemeProvider>{children}</HeaderThemeProvider>
        {/* </TabFocusProvider> */}
      </ThemeProvider>
    </ServiceWorkerProvider>
  )
}
