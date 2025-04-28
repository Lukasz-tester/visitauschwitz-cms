'use client'

import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'
import 'leaflet-defaulticon-compatibility'
import {
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
import { buildings } from './buildings'
import { routes } from './routes' // Import the updated routes with 'amber' color
import { LocateMeButton } from './LocateMeButton'
import { parkingLots, carparkRadius, carparkColor } from './parkingLots' // Import parking lots

const entranceAuschwitz: LatLngExpression = [50.02949, 19.20553]
const entranceBirkenau: LatLngExpression = [50.03439, 19.18107]

const layers = [
  {
    name: 'Auschwitz I buildings',
    markers: Object.keys(buildings).map((slug) => (
      <Polygon key={slug} positions={buildings[slug]} />
    )),
  },
  {
    name: 'Auschwitz routes',
    markers: Object.keys(routes).map((slug) => {
      // Use the route color from the routes object
      return (
        <Polyline
          key={slug}
          positions={routes[slug].path}
          pathOptions={{ color: routes[slug].color }}
        />
      )
    }),
  },
  {
    name: 'Museum entrances',
    markers: (
      <>
        <Marker position={entranceAuschwitz}>
          <Popup>
            <h4>Auschwitz I Main Camp</h4>Start your tour here and continue in{' '}
            <a
              href="https://visitauschwitz.info/auschwitz-birkenau/#get-to-birkenau"
              target="_blank"
            >
              Birkenau.
            </a>
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
    <div className="w-full h-full relative">
      <MapContainer
        center={[50.0272008, 19.2040681]} // Set initial center to Auschwitz I entrance
        zoom={17} // Set an appropriate zoom level
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
