'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/ui/Icons'
import { HeaderNav } from './Nav'
import { usePathname } from '@/i18n/routing'
import MobileNavCaller from './MobileNav/MobileNavCaller'

interface HeaderClientProps {
  header: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ header }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className="pr-8 relative z-20 pt-4 pb-2 flex"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <>
        <Link href="/" className="pl-3 pt-1 mr-auto">
          <Logo />
        </Link>
        <HeaderNav header={header} />
        <MobileNavCaller header={header} />
      </>
    </header>
  )
}
