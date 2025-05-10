import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { TypedLocale } from 'payload'
import { LogoLink } from '../../components/ui/logoLink'

export async function Footer({ locale }: { locale: TypedLocale }) {
  const footer: Footer = await getCachedGlobal('footer', 1, locale)()

  const navItems = footer?.navItems || []

  const date = new Date()
  const year = date.getFullYear()

  return (
    <footer className="border-t border-border bg-black dark:bg-card">
      <div className="container gap-8 flex flex-col">
        <nav className="pt-5 pl-2 flex flex-wrap gap-6 text-xl">
          {navItems.map(({ link }, i) => {
            return (
              <CMSLink
                className="text-white/80 font-semibold hover:text-amber-700 ease-in-out duration-500"
                key={i}
                {...link}
              />
            )
          })}
        </nav>

        <div className="py-6 gap-5 text-sm text-white/60 flex-col flex">
          <LogoLink className="hover:text-amber-700 ease-in-out duration-500" />
          <div className="pl-1">© {year} All Rights Reserved</div>
        </div>
      </div>
    </footer>
  )
}
