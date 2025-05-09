'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type MapModalContextType = {
  currentUrl: string | null
  setCurrentUrl: (url: string | null) => void
}

const MapModalContext = createContext<MapModalContextType | undefined>(undefined)

type MapModalProviderProps = {
  children: ReactNode
}

export const MapModalProvider = ({ children }: MapModalProviderProps) => {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)

  return (
    <MapModalContext.Provider value={{ currentUrl, setCurrentUrl }}>
      {children}
    </MapModalContext.Provider>
  )
}

export const useMapModal = () => {
  const context = useContext(MapModalContext)
  if (!context) {
    throw new Error('useMapModal must be used within a MapModalProvider')
  }
  return context
}
