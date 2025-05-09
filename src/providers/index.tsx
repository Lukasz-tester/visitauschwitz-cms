import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { TabFocusProvider } from './TabFocusProvider'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <TabFocusProvider>{children}</TabFocusProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
