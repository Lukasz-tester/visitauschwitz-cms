'use client'
import { useState } from 'react'
import LocaleSwitcher from '../LocaleSwitcher'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

import type { Header as HeaderType } from '@/payload-types'
import NavItems from '../NavItems'
import { Logo } from '@/components/ui/Icons'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

import { useTranslations } from 'next-intl'

export const MobileNavCaller: React.FC<{ header: HeaderType }> = ({ header }) => {
  const [modalOpen, setModalOpen] = useState(false)

  const t = useTranslations()

  return (
    <>
      <button
        className="rounded w-12 h-12 flex items-center justify-center fixed top-3 right-4 z-[1000] dark:text-white text-2xl"
        onClick={() => setModalOpen(!modalOpen)}
      >
        |||
      </button>
      {modalOpen && (
        <div className="fixed inset-0 height-screen p-4 bg-white dark:bg-black z-[10000] flex flex-col gap-6">
          <div onClick={() => setModalOpen(false)}>
            <div className=" w-12 h-12 flex items-center justify-center fixed top-20 right-4">
              <Link href="/search">
                <SearchIcon className="w-fit text-primary" />
              </Link>
            </div>
            <button className="w-12 h-12 flex items-center justify-center fixed top-5 right-4 text-2xl">
              X
            </button>
            <div className="flex flex-col py-1 text-black dark:text-white">
              <NavItems header={header} />
            </div>
          </div>
          <div className="flex flex-col gap-4 fixed bottom-24 right-4 text-lg items-end text-slate-500">
            <LocaleSwitcher />
            <ThemeSelector />
            <a className="pr-5 pt-2" href="/contact">
              {t('contact')}
            </a>
          </div>
          <div className="flex fixed bottom-8 left-5">
            <Link href="/" onClick={() => setModalOpen(false)}>
              <Logo />
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export default MobileNavCaller
