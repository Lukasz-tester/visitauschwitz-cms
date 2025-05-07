'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMapModal } from '@/providers/MapModalContext'

interface MapLinkProps {
  url: string
  children: React.ReactNode
}

const MapLink: React.FC<MapLinkProps> = ({ url, children }) => {
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const { setCurrentUrl } = useMapModal() // Get the setCurrentUrl from context

  // Ensure useRouter is only used once the component is mounted
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // If not mounted, render nothing or a loading state to prevent the error
  if (!isMounted) {
    return null
  }

  // Check if the URL is external by looking for 'http' or 'https'
  const isExternal = url.startsWith('http://') || url.startsWith('https://')

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // For external URLs, open them normally
    if (isExternal) {
      window.open(url, '_blank')
    } else {
      // For internal links, use Next.js router and close the map modal
      router.push(url)
      console.log('[MapLink] clicked — setting currentUrl to null')
      setCurrentUrl(null) // Close the map modal by setting the current URL to null
    }
  }

  // If the link is external, we don't need to prevent the default behavior
  if (isExternal) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-green-500 underline">
        {children}
      </a>
    )
  }

  // If the link is internal, handle it using Next.js router
  return (
    <a href={url} onClick={handleClick} className="text-green-500 underline">
      {children}
    </a>
  )
}

export default MapLink
