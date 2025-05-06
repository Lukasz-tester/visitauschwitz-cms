'use client'

import 'leaflet-arrowheads'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'
import 'leaflet-defaulticon-compatibility'
import {
  Circle,
  CircleMarker,
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  Polygon,
  Polyline,
  Popup,
  TileLayer,
} from 'react-leaflet'

import { LatLngExpression } from 'leaflet'
import { buildings } from './buildingsPopups'
import { routes } from './routes' // Import the updated routes with 'amber' color
import { LocateMeButton } from './LocateMeButton'
import { parkingLots, carparkRadius, carparkColor } from './parkingLots' // Import parking lots
import { RouteWithArrows } from './RouteWithArrows'
import Link from 'next/link'

const entranceAuschwitz: LatLngExpression = [50.02949, 19.20553]
const entranceBirkenau: LatLngExpression = [50.03439, 19.18107]

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
      <RouteWithArrows
        key={slug}
        positions={routes[slug].path}
        //color={routes[slug].color} // Pass the color property from the routes object
      />
    )),
  },
  {
    name: 'Museum entrances',
    markers: (
      <>
        <Marker position={entranceAuschwitz}>
          <Popup>
            <h4>Auschwitz I Main Camp</h4>
            Start your tour here and
            <br />
            continue in <Link href="arrival#get-to-birkenau">Birkenau.</Link>
          </Popup>
        </Marker>
        <Marker position={entranceBirkenau}>
          <Popup>
            <h4>Auschwitz II Birkenau</h4>You start the second part of your tour here.
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
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
            </LayersControl.Overlay>
          ))}
        </LayersControl>
        <LocateMeButton /> {/* Add LocateMeButton here */}
      </MapContainer>
    </div>
  )
}
