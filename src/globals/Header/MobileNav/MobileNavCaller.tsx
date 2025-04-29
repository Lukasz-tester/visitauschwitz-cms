'use client'
import { useState } from 'react'
import LocaleSwitcher from '../LocaleSwitcher'
import Link from 'next/link'

import { SearchIcon, Settings } from 'lucide-react'
import { Favicion, MapPlaceholder } from '@/components/ui/Icons'

import type { Header as HeaderType } from '@/payload-types'
import NavItems from '../NavItems'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

import { useTranslations } from 'next-intl'
import { scrolledFromTop, useLockBodyScroll } from '@/utilities/helpers'

export const MobileNavCaller: React.FC<{ header: HeaderType }> = ({ header }) => {
  const [modalOpen, setModalOpen] = useState(false)

  const t = useTranslations()
  useLockBodyScroll(modalOpen)

  return (
    <div>
      <div
        className={`${scrolledFromTop() && modalOpen ? 'z-[10000] fixed bottom-24 right-5 opacity-50' : 'hidden'}`}
      >
        <MapPlaceholder />
      </div>
      <button
        className={`ease-in-out duration-1000 ${modalOpen ? 'rounded top-7 right-6 w-14 h-14 bg-slate-500/30' : 'bg-background/70 hover:bg-card-foreground top-0 right-0 lg:bottom-0 lg:right-0 pr-2 rounded-bl-3xl w-16 h-16'} flex items-center justify-center fixed z-[10000] dark:text-white/80 text-3xl`}
        onClick={() => setModalOpen(!modalOpen)}
      >
        <div
          className={`ease-in-out duration-1000 ${modalOpen ? 'rotate-45 translate-x-2' : 'pb-1'}`}
        >
          |
        </div>
        <div className={`ease-in-out duration-1000 ${modalOpen ? 'opacity-0' : ''}`}>|</div>
        <div
          className={`ease-in-out duration-1000 ${modalOpen ? '-rotate-45 -translate-x-2' : 'pt-1'}`}
        >
          |
        </div>
      </button>
      {modalOpen && (
        <div className="fixed inset-0 w-full" onClick={() => setModalOpen(false)}>
          <div className="pt-2 bg-card z-[1000] h-screen gap-6 md:w-fit md:absolute md:right-0 md:bg-card/95">
            <Link
              className="ease-in-out duration-1000 rounded bg-slate-500/30 w-14 h-14 flex items-center justify-center fixed top-28 right-6"
              href="/search"
            >
              <SearchIcon className="ease-in-out duration-1000 w-fit text-primary" />
            </Link>
            <Link className="fixed top-48 right-6 opacity-35" href="/">
              <Favicion />
            </Link>
            <div className="flex flex-col py-2 pr-36">
              <NavItems header={header} />
            </div>
            <div className="pl-2 w-full flex flex-col fixed bottom-3 text-xl text-slate-500 font-semibold">
              <a className="pt-2 pb-1 px-3 text-amber-700/90 lg:text-2xl" href="contact">
                {t('contact')}
              </a>
              <a className="p-2 px-3 lg:text-2xl" href="supplement">
                {t('tips')}
              </a>
              <div>
                <Settings className="m-2 mb-1 mt-6 h-11 w-11 opacity-50" strokeWidth={1.5} />
              </div>
              <div className="p-1 pl-0.5" onClick={(e) => e.stopPropagation()}>
                <LocaleSwitcher />
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <ThemeSelector />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MobileNavCaller
