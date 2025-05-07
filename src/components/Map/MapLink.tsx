// 'use client'

import { useRouter } from 'next/navigation'

interface MapLinkProps {
  url: string
  children: React.ReactNode
}

const MapLink: React.FC<MapLinkProps> = ({ url, children }) => {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push(url)
  }

  return (
    <a href={url} onClick={handleClick} className="text-green-500 underline">
      {children}
    </a>
  )
}

export default MapLink
