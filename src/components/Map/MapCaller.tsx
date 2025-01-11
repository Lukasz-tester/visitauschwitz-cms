'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'

const LazyMap = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

function MapCaller(props) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <button
        className="w-12 h-12 flex items-center justify-center fixed bottom-4 right-6 dark:text-white text-lg z-[1000]"
        onClick={() => setModalOpen(!modalOpen)}
      >
        MAP
      </button>
      {modalOpen && (
        <div className="fixed inset-0 height-screen bg-white dark:text-white dark:bg-black z-[10000] flex flex-col">
          <div className="flex justify-between items-center">
            <h1 className="container font-bold text-2xl text-center p-2">
              Map of the Auschwitz Memorial
            </h1>
            <button
              className="w-12 h-12 flex items-center justify-center fixed bottom-4 right-4"
              onClick={() => setModalOpen(false)}
            >
              X
            </button>
          </div>
          <LazyMap {...props} />
        </div>
      )}
    </>
  )
}

export default MapCaller
