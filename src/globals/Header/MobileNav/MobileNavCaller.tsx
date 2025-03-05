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
import { scrolledFromTop } from '@/utilities/helpers'

export const MobileNavCaller: React.FC<{ header: HeaderType }> = ({ header }) => {
  const [modalOpen, setModalOpen] = useState(false)

  const t = useTranslations()

  return (
    <div className={`${scrolledFromTop() ? '' : 'md:hidden'}`}>
      <button
        className={`hover:text-amber-700 ease-in-out duration-1000 ${modalOpen ? 'rounded bg-card top-7 right-6 w-14 h-14 hover:bg-card-foreground' : 'bg-background/70 top-0 right-0 lg:bottom-0 lg:right-0 pr-2 rounded-bl-3xl w-16 h-16'} flex items-center justify-center fixed z-[10000] dark:text-white/80 text-3xl`}
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
        <div className="fixed inset-0 w-full " onClick={() => setModalOpen(false)}>
          <div className="p-4 bg-background z-[1000] h-screen gap-6 md:w-fit md:absolute md:right-0">
            <Link
              className="rounded bg-card hover:bg-card-foreground w-14 h-14 flex items-center justify-center fixed top-28 right-6"
              href="/search"
            >
              <SearchIcon className="w-fit text-primary" />
            </Link>
            <div className="flex flex-col py-2 pr-36 md:pl-4">
              <NavItems header={header} />
            </div>
            <div className="flex flex-col fixed bottom-24 right-4 text-lg items-end text-slate-500 font-semibold">
              <div onClick={(e) => e.stopPropagation()}>
                <LocaleSwitcher />
              </div>
              <div className="pt-4" onClick={(e) => e.stopPropagation()}>
                <ThemeSelector />
              </div>
              <a className="pt-5 pr-3" href="/frequently-asked-questions">
                FAQ
              </a>
              <a className="pt-5 pr-3" href="/contact">
                {t('contact')}
              </a>
            </div>
            <div className="flex fixed left-5 bottom-4 md:top-4 md:bg-background/70 md:p-4 md:rounded md:h-fit">
              <Link href="/" onClick={() => setModalOpen(false)}>
                <Favicion color2="#b45309" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MobileNavCaller
