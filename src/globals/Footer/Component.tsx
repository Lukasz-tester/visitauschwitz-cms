import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { Logo } from '@/components/ui/Icons'
import { CMSLink } from '@/components/Link'
import { TypedLocale } from 'payload'

export async function Footer({ locale }: { locale: TypedLocale }) {
  const footer: Footer = await getCachedGlobal('footer', 1, locale)()

  const navItems = footer?.navItems || []

  const date = new Date()
  const year = date.getFullYear()

  return (
    <footer className="border-t border-border bg-black dark:bg-card">
      <div className="container py-8 gap-8 flex flex-col">
        <div className="flex flex-col items-start gap-4">
          <nav className="flex flex-row gap-6 text-lg">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white/80" key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
      <div className="container items-center py-6 pl-6 p-4 gap-5 text-sm text-slate-500 flex-col flex">
        <>
          <Link className="flex" href="/">
            <Logo />
          </Link>
        </>
        <>© {year} All Rights Reserved</>
      </div>
    </footer>
  )
}
