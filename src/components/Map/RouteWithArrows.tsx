import { useRef, useEffect } from 'react'
import { Polyline } from 'react-leaflet'
import L from 'leaflet'

export function RouteWithArrows({ positions }: { positions: [number, number][] }) {
  const polylineRef = useRef<L.Polyline>(null)

  useEffect(() => {
    if (polylineRef.current) {
      ;(polylineRef.current as any).arrowheads({
        size: '10px',
        frequency: '200px',
        yawn: 60,
      })
    }
  }, [])

  return (
    <Polyline
      ref={polylineRef}
      positions={positions}
      pathOptions={{ color: 'green' }} // Hardcode color as green
    />
  )
}
