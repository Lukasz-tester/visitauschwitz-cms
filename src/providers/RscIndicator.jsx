'use client'
import { useEffect, useState } from 'react'

export const RscIndicator = () => {
  const [visible, setVisible] = useState(false)

  const handleClose = () => {
    setVisible(false)
  }

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'RSC_DETECTED') {
        setVisible(true)
      }
    }

    navigator.serviceWorker.addEventListener('message', handleMessage)

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage)
    }
  }, [])

  if (!visible) return null

  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white p-8 rounded-md shadow-md z-50">
      <span>🛠️ RSC Detected & Reloaded! Big success!</span>
      <button onClick={handleClose} className="p-2 bg-green-950 text-white font-bold">
        close-X
      </button>
    </div>
  )
}
