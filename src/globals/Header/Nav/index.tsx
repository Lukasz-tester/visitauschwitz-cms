// 'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'
// import { useTranslations } from 'next-intl'
import NavItems from '../NavItems'
import { useMediaQuery } from '@/utilities/helpers'

export const HeaderNav: React.FC<{ header: HeaderType }> = ({ header }) => {
  // const t = useTranslations()
  const isWideScreen = useMediaQuery('(min-width: 768px)')

  return (
    <nav className={`flex-wrap ease-in-out duration-1000 ${isWideScreen ? '' : 'hidden'}`}>
      <div className="flex items-center">
        <NavItems header={header} />
        {/* <Link href="/search">
          <span className="sr-only">{t('search')}</span>
          <SearchIcon className="ml-4 w-6 dark:text-white/90" />
        </Link> */}
      </div>
    </nav>
  )
}
