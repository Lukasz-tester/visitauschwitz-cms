'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import LocaleSwitcher from '../LocaleSwitcher'
import NavItems from '../NavItems'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { useMediaQuery } from '@/utilities/helpers'

export const HeaderNav: React.FC<{ header: HeaderType }> = ({ header }) => {
  const t = useTranslations()
  const isWideScreen = useMediaQuery('(min-width: 768px)')

  return (
    <nav className={`flex-wrap ease-in-out duration-1000 ${isWideScreen ? '' : 'hidden'}`}>
      <div className="flex items-center">
        <NavItems header={header} />
        <Link href="/search">
          <span className="sr-only">{t('search')}</span>
          <SearchIcon className="ml-4 w-6 dark:text-white" />
        </Link>
      </div>

      <div className="flex items-center [&_*]:ease-in-out [&_*]:duration-200 right-4 absolute text-sm lg:text-base text-slate-500 font-bold">
        <div className="text-amber-700 hover:text-slate-500">
          <a className="px-3" href="/contact">
            {t('contact')}
          </a>
        </div>
        <div className="hover:text-amber-700">
          <a className="pl-3 pr-4" href="/frequently-asked-questions">
            FAQ
          </a>
        </div>
        <div className="hover:text-amber-700">
          <LocaleSwitcher />
        </div>
        <div className="hover:text-amber-700">
          <ThemeSelector />
        </div>
      </div>
    </nav>
  )
}
