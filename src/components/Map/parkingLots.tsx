import { LatLngExpression } from 'leaflet'
import Link from 'next/link'
import MapLink from './MapLink'

export const carparkMuzeum: LatLngExpression = [50.02997, 19.20587]
export const carparkSzajny: LatLngExpression = [50.02717, 19.19931]
export const carparkBirkenau1: LatLngExpression = [50.03555, 19.18403]
export const carparkBirkenau2: LatLngExpression = [50.04003, 19.18164]
export const carparkImperiale: LatLngExpression = [50.02856, 19.1986]
export const carparkRide: LatLngExpression = [50.04275, 19.20224]
export const carparkJaracza: LatLngExpression = [50.03236, 19.19818]

export const carparkRadius = 25
export const carparkColor = 'blue'

export const parkingLots = [
  {
    center: carparkMuzeum,
    popupContent: (
      <>
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
        <br />
        <strong>
          <MapLink url="museum#main-entry">See the location →</MapLink>
        </strong>
      </>
    ),
  },
  {
    center: carparkSzajny,
    popupContent: <p>Józefa Szajny Street parking lot.</p>,
  },
  {
    center: carparkImperiale,
    popupContent: <p>Hotel Imperiale parking lot.</p>,
  },
  {
    center: carparkBirkenau1,
    popupContent: <p>40 PLN for vehicles not higher than 240 cm and 80 PLN for others.</p>,
  },
  {
    center: carparkBirkenau2,
    popupContent: (
      <>
        Car (up to 20 people): 20 PLN
        <br />
        Camper: 30 PLN
        <br />
        Bus: 40 PLN
        <br />
        Motorcycle: 10 PLN
      </>
    ),
  },
  {
    center: carparkRide,
    popupContent: <p>Park & Ride by the railway station.</p>,
  },
  {
    center: carparkJaracza,
    popupContent: <p>Stefana Jaracza Street parking lot.</p>,
  },
]
