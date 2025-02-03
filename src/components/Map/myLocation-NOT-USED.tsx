import L from 'leaflet'
// import useGeolocation from 'react-hook-geolocation'
import { Marker } from 'react-leaflet'
import { LocateIcon } from 'lucide-react'
import { forwardRef } from 'react'

const markerIcon = new L.Icon({
  // iconUrl: scope,
  iconSize: [40, 40],
  iconAnchor: [17, 46], //[left/right, top/bottom]
  popupAnchor: [0, -46], //[left/right, top/bottom]
})

// export const LocationMarker = () => {
//   const location = useGeolocation()

//   if (!location?.longitude || !location?.latitude) return null

//   return <Marker icon={markerIcon} position={[location.latitude, location.longitude]} />
// }

export const LocateMeButton = forwardRef(({}, ref) => {
  // const location = useGeolocation()

  const showMyLocation = () => {
    if (!location) return

    // ref?.current.flyTo([location.latitude, location.longitude], ref?.current.ZOOM_LEVEL, {
    //   animate: true,
    // })
  }

  return (
    <button
      // onClick={showMyLocation}
      className="bg-card bottom-20 right-0 w-14 h-14 rounded-s-3xl flex items-center justify-center fixed z-[10001] dark:text-white/80"
      // disabled={!location}
    >
      <LocateIcon strokeWidth={1} size={32} />
    </button>
  )
})
