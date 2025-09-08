'use client'

// import 'globals.css'
import 'leaflet-arrowheads'
import 'leaflet/dist/leaflet.css'
import {
  Circle,
  CircleMarker,
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet'

import { LatLngExpression } from 'leaflet'
import { buildings } from './buildingsPopups'
import { routes } from './routes'
import { LocateMeButton } from './LocateMeButton'
import { parkingLots, carparkRadius, carparkColor } from './parkingLots' // Import parking lots
import { RouteWithArrows } from './RouteWithArrows'
import { placeholderIcon } from './customIcons'
import MapLink from './MapLink'

const entranceAuschwitz: LatLngExpression = [50.0294894, 19.2053725]
const entranceBirkenau: LatLngExpression = [50.0343937, 19.1809423]
// TODO - enlarge text for popups!!!
// const MyPopUp = ({ children }) => (
//   <Popup>
//     <div className="!text-lg">{children}</div>
//   </Popup>
// )

const layers = [
  {
    name: 'Auschwitz I buildings',
    markers: Object.keys(buildings).map((slug) => {
      const building = buildings[slug]
      const isPoint = building.positions.length === 1 // Only one coordinate

      if (isPoint) {
        return (
          <Circle
            key={slug}
            center={building.positions[0] as [number, number]}
            radius={8}
            pathOptions={{ color: 'green', fillColor: '', fillOpacity: 0.5 }}
          >
            {building.popup && <Popup>{building.popup}</Popup>}
          </Circle>
        )
      } else {
        return (
          <Polygon
            key={slug}
            positions={building.positions}
            pathOptions={{ color: 'green', weight: 2, fillOpacity: 0.5 }}
          >
            {building.popup && <Popup>{building.popup}</Popup>}
          </Polygon>
        )
      }
    }),
  },
  {
    name: 'Auschwitz routes',
    markers: Object.keys(routes).map((slug) => (
      <RouteWithArrows key={slug} positions={routes[slug].path} />
    )),
  },
  {
    name: 'Museum entrances',
    markers: (
      <>
        <Marker position={entranceAuschwitz} icon={placeholderIcon}>
          <Popup>
            <strong>Auschwitz I Main Camp</strong>
            <br />
            Start your tour here and continue in Birkenau. <br />
            <br />
            <strong>
              <MapLink url="arrival#get-to-birkenau">Get to Birkenau →</MapLink>
            </strong>
          </Popup>
        </Marker>
        <Marker position={entranceBirkenau} icon={placeholderIcon}>
          <Popup>
            <strong>Auschwitz II-Birkenau</strong>
            <br />
            You start the second part of your tour by the main Birkenau gate.
            <br />
            <br />
            <strong>
              <MapLink url="tour#birkenau-gate">See Birkenau gate →</MapLink>
            </strong>
          </Popup>
        </Marker>
      </>
    ),
  },
  {
    name: 'Parking lots',
    markers: parkingLots.map((lot, index) => (
      <CircleMarker
        key={index}
        center={lot.center}
        pathOptions={{ color: carparkColor, fillColor: carparkColor }}
        radius={carparkRadius}
      >
        <Popup>{lot.popupContent}</Popup>
      </CircleMarker>
    )),
  },
]

const CustomAttribution = () => {
  const map = useMap()
  map.attributionControl.setPrefix(false)
  return null
}

export default function MapModal() {
  return (
    <div className="w-full h-full relative z-40">
      <MapContainer
        center={[50.027063, 19.20411]}
        zoom={16} // Set an appropriate zoom level
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a target='_blank' rel='noopener noreferrer' href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        <LayersControl position="topright" collapsed={true}>
          {layers.map((layer) => (
            <LayersControl.Overlay
              name={layer.name}
              key={layer.name}
              checked={
                layer.name === 'Museum entrances' ||
                layer.name === 'Auschwitz I buildings' ||
                layer.name === 'Auschwitz routes'
              } // Default visibility for these layers
            >
              <LayerGroup>{layer.markers}</LayerGroup>
              <CustomAttribution />
            </LayersControl.Overlay>
          ))}
        </LayersControl>
        <LocateMeButton />
      </MapContainer>
    </div>
  )
}
