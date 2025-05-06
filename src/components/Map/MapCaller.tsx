'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { scrolledFromTop, useLockBodyScroll } from '@/utilities/helpers'
import { MapPlaceholder } from '../ui/Icons'
import { X } from 'lucide-react'

const LazyMap = dynamic(() => import('./mapModal'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

// function MapCaller(props) {
//   const [modalOpen, setModalOpen] = useState(false)

//   useLockBodyScroll(modalOpen)

//   return (
//     <div className={`z-50 fixed ${scrolledFromTop() ? '' : 'hidden'}`}>
//       <button
//         className={`z-50 ease-in-out duration-1000 ${modalOpen ? 'bg-card bottom-4 right-0 w-14 h-14 rounded-s-3xl' : 'pb-2 bg-background/70 bottom-0 right-0 rounded-tl-3xl w-16 h-16 md:hover:bg-card-foreground'} pr-1 flex items-center justify-center font-thin fixed dark:text-white/80 text-3xl`}
//         onClick={() => setModalOpen(!modalOpen)}
//       >
//         <div
//           className={`transition-opacity ease-in-out duration-1000 right-3 fixed ${
//             modalOpen ? 'opacity-100' : 'opacity-0'
//           }`}
//         >
//           <X strokeWidth={1} size={32} />
//         </div>
//         <div
//           className={` transition-opacity ease-in-out duration-1000 ${
//             modalOpen ? 'opacity-0' : 'opacity-100'
//           }`}
//         >
//           <MapPlaceholder />
//         </div>
//       </button>

//       {modalOpen && (
//         <div className="fixed inset-0">
//           <LazyMap {...props} />
//         </div>
//       )}
//     </div>
//   )
// }

function MapCaller({ setMobileNavOpen }) {
  const [modalOpen, setModalOpen] = useState(false)
  useLockBodyScroll(modalOpen)

  const handleToggle = () => {
    const newState = !modalOpen
    setModalOpen(newState)
    if (!newState) {
      // Close MobileNav when map closes
      setMobileNavOpen(false)
    }
  }

  return (
    <div className={`z-50 fixed ${scrolledFromTop() ? '' : 'hidden'}`}>
      <button
        className={`z-50 ease-in-out duration-1000 ${modalOpen ? 'bg-card bottom-4 right-0 w-14 h-14 rounded-s-3xl' : 'pb-2 bg-background/70 bottom-0 right-0 rounded-tl-3xl w-16 h-16 md:hover:bg-card-foreground'} pr-1 flex items-center justify-center font-thin fixed dark:text-white/80 text-3xl`}
        onClick={handleToggle}
      >
        <div
          className={`transition-opacity ease-in-out duration-1000 right-3 fixed ${
            modalOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <X strokeWidth={1} size={32} />
        </div>
        <div
          className={` transition-opacity ease-in-out duration-1000 ${
            modalOpen ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <MapPlaceholder />
        </div>
      </button>

      {modalOpen && (
        <div className="fixed inset-0">
          <LazyMap />
        </div>
      )}
    </div>
  )
}

export default MapCaller
