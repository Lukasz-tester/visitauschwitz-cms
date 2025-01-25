'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import LocaleSwitcher from '../LocaleSwitcher'
import NavItems from '../NavItems'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

export const HeaderNav: React.FC<{ header: HeaderType }> = ({ header }) => {
  const t = useTranslations()

  return (
    <nav className="flex-wrap">
      <div className="flex items-center">
        <NavItems header={header} />
        <Link href="/search">
          <span className="sr-only">{t('search')}</span>
          <SearchIcon className="ml-4 w-6 dark:text-white" />
        </Link>
      </div>

      <div className="flex p-1 items-center right-4 gap-2 absolute text-sm lg:text-base text-slate-500">
        <div>
          <a className="text-amber-700 hover:font-bold pr-3" href="/contact">
            {/* maybe className="text-[#E0713B]" for brand color */}
            {t('contact')}
          </a>
        </div>
        <div className="hover:font-bold">
          <a href="/faq">FAQ</a>
        </div>
        <div className="hover:font-bold">
          <LocaleSwitcher />
        </div>
        <div className="hover:font-bold">
          <ThemeSelector />
        </div>
      </div>
    </nav>
  )
}
