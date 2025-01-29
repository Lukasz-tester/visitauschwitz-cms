'use client'
import { useState } from 'react'
import LocaleSwitcher from '../LocaleSwitcher'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

import type { Header as HeaderType } from '@/payload-types'
import NavItems from '../NavItems'
import { Favicion } from '@/components/ui/Icons'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

import { useTranslations } from 'next-intl'

export const MobileNavCaller: React.FC<{ header: HeaderType }> = ({ header }) => {
  const [modalOpen, setModalOpen] = useState(false)

  const t = useTranslations()

  return (
    <>
      <button
        className={`ease-in-out duration-1000 ${modalOpen ? 'bg-card top-7 right-6 w-14 h-14' : 'bg-background/70 top-0 right-0 lg:bottom-0 lg:right-0 pr-2 rounded-bl-3xl w-16 h-16'} flex items-center justify-center fixed z-[10000] dark:text-white/80 text-3xl`}
        onClick={() => setModalOpen(!modalOpen)}
      >
        <div
          className={`ease-in-out duration-1000 ${modalOpen ? 'rotate-45 translate-x-2' : 'pb-1'}`}
        >
          |
        </div>
        <div className={`ease-in-out duration-1000 ${modalOpen ? 'opacity-0 text-amber-500' : ''}`}>
          |
        </div>
        <div
          className={`ease-in-out duration-1000 ${modalOpen ? '-rotate-45 -translate-x-2' : 'pt-1'}`}
        >
          |
        </div>
      </button>
      {modalOpen && (
        <div className="fixed inset-0 height-screen p-4 bg-white dark:bg-background z-[1000] flex flex-col gap-6">
          <div onClick={() => setModalOpen(false)}>
            <div
              className={`bg-card rounded- w-14 h-14 flex items-center justify-center fixed top-28 right-6`}
            >
              <Link href="/search">
                <SearchIcon className="w-fit text-primary" />
              </Link>
            </div>
            <div className="flex flex-col py-1 mr-16">
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
          <div className="flex fixed bottom-4 left-5">
            <Link href="/" onClick={() => setModalOpen(false)}>
              <Favicion color2="#b45309" />
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export default MobileNavCaller
