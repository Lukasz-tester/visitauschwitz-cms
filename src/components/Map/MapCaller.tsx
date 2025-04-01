'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { scrolledFromTop, useLockBodyScroll } from '@/utilities/helpers'

const LazyMap = dynamic(() => import('./mapModal'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

function MapCaller(props) {
  const [modalOpen, setModalOpen] = useState(false)

  useLockBodyScroll(modalOpen)

  return (
    <div className={`ease-in-out duration-1000 visible ${scrolledFromTop() ? '' : 'hidden'}`}>
      <button
        className={`ease-in-out duration-1000 ${modalOpen ? 'bg-card bottom-4 right-0 w-14 h-14 rounded-s-3xl' : 'pb-2 bg-background/70 bottom-0 right-0 rounded-tl-3xl w-16 h-16 hover:bg-card-foreground'} pr-3 flex items-center justify-center font-thin fixed z-[10001] dark:text-white/80 text-3xl`}
        onClick={() => setModalOpen(!modalOpen)}
      >
        <div
          className={`ease-in-out duration-1000 ${modalOpen ? 'opacity-0 -rotate-90 -translate-x-24' : 'pt-1'}`}
        >
          |
        </div>
        <div className={`ease-in-out duration-1000 ${modalOpen ? 'rotate-45 translate-x-2' : ''}`}>
          |
        </div>
        <div
          className={`ease-in-out duration-1000 ${modalOpen ? 'opacity-0 -translate-y-24' : ''}`}
        >
          |
        </div>
        <div
          className={`ease-in-out duration-1000 ${modalOpen ? '-rotate-45 -translate-x-2' : 'pb-1'}`}
        >
          |
        </div>
      </button>

      {modalOpen && (
        <div className="fixed inset-0 z-[10000]">
          <LazyMap {...props} />
        </div>
      )}
    </div>
  )
}

export default MapCaller
