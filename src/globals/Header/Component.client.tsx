'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { HeaderNav } from './Nav'
import { usePathname } from '@/i18n/routing'
import MobileNavCaller from './MobileNav/MobileNavCaller'
import { LogoLink } from '../../components/ui/logoLink'
import MapCaller from '@/components/Map/MapCaller'
import { MapModalProvider } from '@/providers/MapModalContext'

interface HeaderClientProps {
  header: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ header }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false) // ✅ New state

  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme])

  return (
    <header
      className="pr-16 relative z-20 pt-2 pb-2 flex"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <MapModalProvider>
        <>
          <div className="pl-3 pt-3 md:pl-5 mr-auto">
            <LogoLink className="text-black/70 dark:text-white/60 md:hover:text-amber-700 ease-in-out duration-500" />
          </div>
          <HeaderNav header={header} />
          <MobileNavCaller
            header={header}
            modalOpen={mobileNavOpen}
            setModalOpen={setMobileNavOpen}
          />

          <MapCaller setMobileNavOpen={setMobileNavOpen} />
        </>
      </MapModalProvider>
    </header>
  )
}
