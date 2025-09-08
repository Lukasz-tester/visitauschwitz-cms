'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMapModal } from '@/providers/MapModalContext'
import Link from 'next/link'

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

  // Check if the URL is external by looking for 'http'
  const isExternal = url.startsWith('http')

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // For external URLs, open them normally
    if (isExternal) {
      window.open(url, '_blank')
    } else {
      // For internal links, use Next.js router and close the map modal
      router.push(url)
      setCurrentUrl(null) // Close the map modal by setting the current URL to null
    }
  }

  // If the link is external, we don't need to prevent the default behavior
  if (isExternal) {
    return (
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-500 underline"
      >
        {children}
      </Link>
    )
  }

  // If the link is internal, handle it using Next.js router
  return (
    //TODO improve the lonk looks!
    <Link href={url} onClick={handleClick} className="font-bold text-lg">
      {children}
    </Link>
  )
}

export default MapLink
