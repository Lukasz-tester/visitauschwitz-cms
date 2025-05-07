import L from 'leaflet'

export const markerIcon = L.divIcon({
  className: 'marker-icon',
  html: '📍',
  iconSize: [30, 30],
  iconAnchor: [16, 40],
})
