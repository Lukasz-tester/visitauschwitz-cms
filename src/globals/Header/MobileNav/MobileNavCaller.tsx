import LocaleSwitcher from '../LocaleSwitcher'
import Link from 'next/link'

import { SearchIcon } from 'lucide-react'

import type { Header as HeaderType } from '@/payload-types'
import NavItems from '../NavItems'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

import { useTranslations } from 'next-intl'
import { useLockBodyScroll } from '@/utilities/helpers'
import { LogoLink } from '@/components/ui/logoLink'

export const MobileNavCaller: React.FC<{
  header: HeaderType
  modalOpen: boolean
  setModalOpen: (open: boolean) => void
}> = ({ header, modalOpen, setModalOpen }) => {
  const t = useTranslations()
  useLockBodyScroll(modalOpen)

  const links = {
    '/supplement': 'tips',
    // '/posts': 'posts',
    '/#about-me': 'about',
    // '/contact': 'contact',
    // TODO - odkomentuj ponizej i dodaj odpowiedni link jak bedzie
    // '/': 'books',
  }

  return (
    <div>
      <button
        className={`z-30 top-0 right-0 ease-in-out duration-1000 ${modalOpen ? 'w-16 h-16' : 'bg-background/70 md:hover:bg-card-foreground lg:bottom-0 lg:right-0 rounded-bl-3xl w-16 h-16'} flex items-center justify-center fixed dark:text-white/80 text-3xl`}
        onClick={() => setModalOpen(!modalOpen)}
        aria-label="Open Navigation"
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
        <div className="fixed inset-0 w-full z-20 bg-black/40" onClick={() => setModalOpen(false)}>
          <div
            className="pt-2 bg-card h-screen gap-6 md:w-fit md:absolute md:right-0 md:bg-card/95"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              aria-label="Search"
              className="w-12 h-16 flex items-center justify-center fixed top-0 right-16 "
              href="/search"
              onClick={() => setModalOpen(!modalOpen)}
            >
              <SearchIcon size={26} className="opacity-85" />
            </Link>
            {/* TODO: jak ponizej daje opacity-85 to powyzej lupka przestaje byc linkiem...? */}
            <div className="flex place-items-center text-xl top-0">
              <div
                className="pl-5 py-2 flex items-center justify-center gap-1"
                aria-label="Select Language"
              >
                <LocaleSwitcher />
              </div>
              <div aria-label="Change Theme">
                <ThemeSelector />
              </div>
            </div>
            <div className="flex flex-col my-16 py-2 pr-36">
              <NavItems
                header={header}
                onClick={() => setModalOpen(false)}
                aria-label="Main Navigation"
              />
              <div className="pl-2 mt-2 w-full flex flex-col text-xl text-slate-700 dark:text-slate-400 font-semibold ">
                {Object.entries(links).map(([href, label]) => (
                  <Link
                    aria-label="Secondary Navigation"
                    key={href}
                    className="p-2 px-3 lg:text-2xl hover:text-amber-700/90"
                    onClick={() => setModalOpen(false)}
                    href={href}
                  >
                    {t(label)}
                    {label === 'tips' && ' FAQ'}
                  </Link>
                ))}
              </div>
            </div>
            <div className="absolute bottom-5 left-1" onClick={() => setModalOpen(false)}>
              <LogoLink className="text-slate-700 dark:text-slate-400 hover:text-amber-700/90" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MobileNavCaller
