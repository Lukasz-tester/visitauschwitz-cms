'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import LocaleSwitcher from '../LocaleSwitcher'
import NavItems from '../NavItems'

export const HeaderNav: React.FC<{ header: HeaderType }> = ({ header }) => {
  const t = useTranslations()

  return (
    <nav className="flex gap-6 items-center">
      <NavItems header={header} />
      <LocaleSwitcher />
      <Link href="/search">
        <span className="sr-only">{t('search')}</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}
