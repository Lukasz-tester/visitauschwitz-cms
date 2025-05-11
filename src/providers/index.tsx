import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { TabFocusProvider } from './TabFocusProvider'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <TabFocusProvider>
        <HeaderThemeProvider>{children}</HeaderThemeProvider>
      </TabFocusProvider>
    </ThemeProvider>
  )
}
