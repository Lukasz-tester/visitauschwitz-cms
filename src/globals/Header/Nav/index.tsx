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
          <SearchIcon className="w-6 dark:text-white" />
        </Link>
      </div>
      <div className="flex p-1 items-center right-4 gap-2 absolute text-sm text-slate-500">
        <a href="/contact">
          {/* maybe className="text-[#E0713B]" for brand color */}
          {t('contact')}
        </a>
        <LocaleSwitcher />
        <ThemeSelector />
      </div>
    </nav>
  )
}
