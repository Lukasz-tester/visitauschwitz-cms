'use client'
import { useState } from 'react'
import LocaleSwitcher from '../LocaleSwitcher'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

import type { Header as HeaderType } from '@/payload-types'
import NavItems from '../NavItems'
import { Logo } from '@/components/ui/Icons'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

export const MobileNavCaller: React.FC<{ header: HeaderType }> = ({ header }) => {
  const [modalOpen, setModalOpen] = useState(false)

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
            <div className="rounded bg-blue-900">
              <div className=" w-12 h-12 flex items-center justify-center fixed top-16 right-4">
                <Link href="/search">
                  <SearchIcon className="w-fit text-primary" />
                </Link>
              </div>
              <button className="w-12 h-12 flex items-center justify-center fixed top-3 right-4 text-2xl">
                X
              </button>
            </div>
            <div className="flex flex-col p-4 gap-6 text-black dark:text-white">
              <NavItems header={header} />
            </div>
          </div>
          <div className="flex flex-col gap-4 fixed bottom-20 right-4 text-sm items-end text-slate-500">
            <LocaleSwitcher />
            <ThemeSelector />
          </div>
          <div className="flex fixed bottom-8 left-5">
            <Logo />
          </div>
        </div>
      )}
    </>
  )
}

export default MobileNavCaller
