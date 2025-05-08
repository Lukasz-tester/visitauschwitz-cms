'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { scrolledFromTop, useLockBodyScroll } from '@/utilities/helpers'
import { MapPlaceholder } from '../ui/Icons'
import { X } from 'lucide-react'
import { useMapModal } from '@/providers/MapModalContext'

const LazyMap = dynamic(() => import('./mapModal'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

type MapCallerProps = {
  setMobileNavOpen: (open: boolean) => void
}

function MapCaller({ setMobileNavOpen }: MapCallerProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const { currentUrl, setCurrentUrl } = useMapModal()

  useLockBodyScroll(modalOpen)

  useEffect(() => {
    // Close the modal if currentUrl is null and modalOpen is true
    if (currentUrl === null && modalOpen) {
      setModalOpen(false)
    }
  }, [currentUrl, modalOpen])

  const handleToggle = () => {
    if (!modalOpen) {
      // Open modal and set currentUrl
      setCurrentUrl('/map') // Use any non-null string
      setModalOpen(true)
      setMobileNavOpen(false)
    } else {
      // Close modal and reset currentUrl
      setCurrentUrl(null)
      setModalOpen(false)
    }
  }

  return (
    <div className={`z-50 fixed ${scrolledFromTop() ? '' : 'hidden'}`}>
      <button
        className={`z-50 ease-in-out duration-1000 ${
          modalOpen
            ? 'bg-card bottom-4 right-0 w-14 h-14 rounded-s-3xl'
            : 'pb-2 bg-background/70 bottom-0 right-0 rounded-tl-3xl w-16 h-16 md:hover:bg-card-foreground'
        } pr-1 flex items-center justify-center font-thin fixed dark:text-white/80 text-3xl`}
        onClick={handleToggle}
      >
        {/* X Icon visibility logic */}
        <div
          className={`transition-opacity ease-in-out duration-500 fixed right-3 ${modalOpen ? 'opacity-100' : 'opacity-0'}`}
        >
          <X strokeWidth={1} size={32} />
        </div>

        {/* Map Icon visibility logic */}
        <div
          className={`transition-opacity ease-in-out duration-500 ${modalOpen ? 'opacity-0' : 'opacity-100'}`}
        >
          <MapPlaceholder />
        </div>
      </button>

      {/* Modal */}
      {modalOpen && currentUrl && (
        <div className="fixed inset-0">
          <LazyMap />
        </div>
      )}
    </div>
  )
}

export default MapCaller
