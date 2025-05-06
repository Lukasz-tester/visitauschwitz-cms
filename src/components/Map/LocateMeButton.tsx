'use client'

import { LocateIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

export function LocateMeButton() {
  const [loading, setLoading] = useState(false)
  const [position, setPosition] = useState<[number, number] | null>(null)
  const map = useMap()

  // Custom Geolocation Icon
  const geolocationIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/622/622669.png', // Custom geolocation icon (you can replace with any URL)
    iconSize: [30, 30], // Size of the icon
    iconAnchor: [15, 30], // Anchor point of the icon (bottom center)
    popupAnchor: [0, -30], // Popup position relative to the icon
  })

  const handleClick = () => {
    setLoading(true)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setPosition([latitude, longitude]) // Store position for marker
          map.setView([latitude, longitude], map.getZoom()) // Keep current zoom level
          setLoading(false)
        },
        (error) => {
          alert('Could not get your location')
          setLoading(false)
        },
      )
    } else {
      alert('Geolocation is not supported by this browser.')
      setLoading(false)
    }
  }

  // Ensure custom geolocation icon is added after position update
  useEffect(() => {
    if (position) {
      // Create a new marker with the custom geolocation icon after position update
      const marker = L.marker(position, { icon: geolocationIcon })
      marker.addTo(map).bindPopup('Your current location')

      // Cleanup marker on unmount or position change
      return () => {
        map.removeLayer(marker)
      }
    }
  }, [position, map])

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading}
        className="bg-card bottom-20 right-0 w-14 h-14 rounded-s-3xl flex items-center justify-center fixed z-[10001] dark:text-white/80"
      >
        {loading ? (
          <div className="spinner"></div> // Show spinner when loading
        ) : (
          <LocateIcon strokeWidth={1} size={32} />
        )}
      </button>

      {/* Loading Spinner CSS */}
      <style jsx>{`
        .spinner {
          border: 4px solid #f3f3f3; /* Light gray */
          border-top: 4px solid #3498db; /* Blue */
          border-radius: 50%;
          width: 24px;
          height: 24px;
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  )
}
