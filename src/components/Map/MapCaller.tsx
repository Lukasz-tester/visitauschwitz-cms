'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const LazyMap = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

function MapCaller(props) {

      const [modalOpen, setModalOpen] = useState(false)

    return (
        <>
      <button className="rounded bg-white w-12 h-12 flex items-center justify-center fixed bottom-3 right-3 text-black z-[1000]"
        onClick={() => setModalOpen(!modalOpen)}>
        MAP
      </button>
      {modalOpen && (
        <div className="fixed inset-0 height-screen p-4 bg-black z-[10000] flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-2xl">Modal</h1>
            <button
              className="rounded bg-blue-900 w-12 h-12 flex items-center justify-center fixed bottom-3 right-3"
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

export default MapCaller;