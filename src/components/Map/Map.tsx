"use client";

// START: Preserve spaces to avoid auto-sorting
import "leaflet/dist/leaflet.css";

import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";

import "leaflet-defaulticon-compatibility";
// END: Preserve spaces to avoid auto-sorting
import { CircleMarker, LayerGroup, LayersControl, MapContainer, Marker, Polygon, Polyline, Popup, TileLayer } from "react-leaflet";

import { LatLngExpression } from "leaflet";
import { buildings } from "./buildings";
import { routes } from "./routes";

const entranceAuschwitz: LatLngExpression = [50.02949, 19.20553]
const entranceBirkenau: LatLngExpression = [50.03439, 19.18107];

const carparkMuzeum: LatLngExpression = [50.02997, 19.20587];
const carparkSzajny: LatLngExpression = [50.02717, 19.19931];
const carparkBirkenau1: LatLngExpression = [50.03555, 19.18403];
const carparkBirkenau2: LatLngExpression = [50.04003, 19.18164];
const carparkImperiale: LatLngExpression = [50.02856, 19.1986];
const carparkRide: LatLngExpression = [50.04275, 19.20224];
const carparkJaracza: LatLngExpression = [50.03236, 19.19818];
const carparkRadius = 25;
const carparkColor = "blue";

const layers = [
  {
    name: "Auschwitz I buildings",
    // anchors: ["A1"],
    markers: Object.keys(buildings).map((slug) => (
      <Polygon key={slug} positions={buildings[slug]} />
    )),
  },
  {
    name: "Auschwitz routes",
    // anchors: ["A1"],
    markers: Object.keys(routes).map((slug) => (
      <Polyline key={slug} positions={routes[slug]} />
    )),
  },
  {
    name: "Museum entrances",
    markers: (
      <>
        <Marker position={entranceAuschwitz}>
          <Popup>
            <h4>Auschwitz I Main Camp</h4>Start your tour here and continue in{" "}
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
            <h4>Auschwitz II Birkenau</h4>You start the second part of your
            tour here.
          </Popup>
        </Marker>
      </>
    ),
  },
  {
    name: "Parking lots",
    // anchors: ["car", "default"],
    markers: (
      <>
        <CircleMarker
          center={carparkMuzeum}
          pathOptions={{ color: "", fillColor: carparkColor }}
          radius={carparkRadius}
        >
          <Popup>
            Car: 20 PLN
            <br />
            Minibus: 30 PLN
            <br />
            Bus: 40 PLN
            <br />
            Camper: 90 PLN
            <br />
            Motorcycle: 15 PLN
            <br />
            <h5>
              <a
                href="https://visitauschwitz.info/get-ready/#on-site"
                target="_blank"
              >
                Learn what is on site.
              </a>
            </h5>
          </Popup>
        </CircleMarker>
        <CircleMarker
          center={carparkSzajny}
          pathOptions={{ color: "", fillColor: carparkColor }}
          radius={carparkRadius}
        >
          <Popup>Józefa Szajny Street parking lot.</Popup>
        </CircleMarker>
        <CircleMarker
          center={carparkImperiale}
          pathOptions={{ color: "", fillColor: carparkColor }}
          radius={carparkRadius}
        >
          <Popup>Hotel Imperiale parking lot.</Popup>
        </CircleMarker>
        <CircleMarker
          center={carparkBirkenau1}
          pathOptions={{ color: "", fillColor: carparkColor }}
          radius={carparkRadius}
        >
          <Popup>
            40 PLN for vehicles not higher than 240 cm and 80 PLN for others.
          </Popup>
        </CircleMarker>
        <CircleMarker
          center={carparkBirkenau2}
          pathOptions={{ color: "", fillColor: carparkColor }}
          radius={carparkRadius}
        >
          <Popup>
            Car (up to 20 people): 20 PLN
            <br />
            Camper: 30 PLN
            <br />
            Bus: 40 PLN
            <br />
            Motorcycle: 10 PLN
          </Popup>
        </CircleMarker>
        <CircleMarker
          center={carparkRide}
          pathOptions={{ color: "", fillColor: carparkColor }}
          radius={carparkRadius}
        >
          <Popup>Park & Ride by the railway station.</Popup>
        </CircleMarker>
        <CircleMarker
          center={carparkJaracza}
          pathOptions={{ color: "", fillColor: carparkColor }}
          radius={carparkRadius}
        >
          <Popup>Stefana Jaracza Street parking lot.</Popup>
        </CircleMarker>
      </>
    ),
  },
];

export default function Map() {
  return (
    <div id="map-container">
    <MapContainer
      preferCanvas={true}
      center={entranceAuschwitz}
      zoom={14}
      scrollWheelZoom={true}
      style={{ height: "600px", width: "800px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={entranceAuschwitz}>
        <Popup>
          This cdcMarker icon is displayed correctly with{" "}
          <i>leaflet-defaulticon-compatibility</i>.
        </Popup>
      </Marker>
      <LayersControl position="topright" collapsed={true}>
              {layers.map((layer) => (
                <LayersControl.Overlay
                  name={layer.name}
                  key={layer.name}
                >
                  <LayerGroup>{layer.markers}</LayerGroup>
                </LayersControl.Overlay>
              ))}
            </LayersControl>
    </MapContainer>
    </div>
  );
}
