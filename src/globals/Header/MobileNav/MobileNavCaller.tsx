'use client'
import { useState } from 'react'
import LocaleSwitcher from '../LocaleSwitcher'

function MobileNavCaller(props) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <button
        className="rounded bg-transparent w-12 h-12 flex items-center justify-center fixed top-3 right-3 text-white z-[1000]"
        onClick={() => setModalOpen(!modalOpen)}
      >
        |||
      </button>
      {modalOpen && (
        <div className="fixed inset-0 height-screen p-4 bg-black z-[10000] flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-2xl">Menu Modal</h1>
            <button
              className="rounded bg-blue-900 w-12 h-12 flex items-center justify-center fixed top-3 right-3"
              onClick={() => setModalOpen(false)}
            >
              X
            </button>
          </div>
          <h1>Menu items</h1>
          <LocaleSwitcher />
        </div>
      )}
    </>
  )
}

export default MobileNavCaller
