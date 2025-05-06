'use client'
import { useState } from 'react'
import LocaleSwitcher from '../LocaleSwitcher'
import Link from 'next/link'

import { SearchIcon } from 'lucide-react'

import type { Header as HeaderType } from '@/payload-types'
import NavItems from '../NavItems'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

import { useTranslations } from 'next-intl'
import { scrolledFromTop, useLockBodyScroll } from '@/utilities/helpers'

export const MobileNavCaller: React.FC<{ header: HeaderType }> = ({ header }) => {
  const [modalOpen, setModalOpen] = useState(false)

  const t = useTranslations()
  useLockBodyScroll(modalOpen)

  const links = {
    '/supplement': 'tips',
    '/posts': 'posts',
    '/#created-by': 'author',
    '/contact': 'contact',
  }

  return (
    <div>
      <div
        className={`${scrolledFromTop() && modalOpen ? 'z-[10000] fixed bottom-16 right-4 opacity-50' : 'hidden'}`}
      >
        MAP
      </div>
      <button
        className={`top-0 right-0 ease-in-out duration-1000 ${modalOpen ? 'w-16 h-16' : 'bg-background/70 md:hover:bg-card-foreground lg:bottom-0 lg:right-0 rounded-bl-3xl w-16 h-16'} flex items-center justify-center fixed z-[10000] dark:text-white/80 text-3xl`}
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
        //
        <div className="fixed inset-0 w-full" onClick={() => setModalOpen(false)}>
          <div
            className="pt-2 bg-card z-[1000] h-screen gap-6 md:w-fit md:absolute md:right-0 md:bg-card/95"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              className="w-12 h-16 flex items-center justify-center fixed top-0 right-16 "
              href="/search"
              onClick={() => setModalOpen(!modalOpen)}
            >
              <SearchIcon size={26} className="opacity-85" />
            </Link>
            {/* jak ponizej daje opacity-85 to powyzej lupka przestaje byc linkiem... */}
            <div className="flex place-items-center text-xl top-0 ">
              <div className="pl-4 py-2 flex items-center justify-center gap-1 ">
                <LocaleSwitcher />
              </div>
              <div>
                <ThemeSelector />
              </div>
            </div>
            <div className="flex flex-col my-16 py-2 pr-36">
              <NavItems header={header} onClick={() => setModalOpen(false)} />
              <div className="pl-2 mt-2 w-full flex flex-col text-xl text-slate-600 dark:text-slate-400 font-semibold ">
                {Object.entries(links).map(([href, label]) => (
                  <Link
                    key={href}
                    className="p-2 px-3 lg:text-2xl hover:text-amber-700/90"
                    onClick={() => setModalOpen(false)}
                    href={href}
                  >
                    {/* TODO remove any */}
                    {t(label as any)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MobileNavCaller
