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
        className="w-12 h-12 flex items-center justify-center fixed bottom-4 right-4 text-white z-[1000]"
        onClick={() => setModalOpen(!modalOpen)}
      >
        MAP
      </button>
      {modalOpen && (
        <div className="fixed inset-0 height-screen p-4 bg-black z-[10000] flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-2xl">Map of the Auschwitz Memorial</h1>
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
