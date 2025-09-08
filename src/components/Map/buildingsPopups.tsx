import { LatLngExpression } from 'leaflet'
import { ReactNode } from 'react'
import MapLink from './MapLink' // Adjust the import path as needed

export const buildings: {
  [slug: string]: {
    positions: LatLngExpression[] | LatLngExpression[][]
    popup?: ReactNode
  }
} = {
  blok4: {
    positions: [
      [50.0266755, 19.2048827],
      [50.0265755, 19.2047662],
      [50.0263347, 19.2052642],
      [50.0264349, 19.2053808],
      [50.0266755, 19.2048827],
    ],
    popup: (
      <>
        <strong>Extermination exhibition</strong>
        <br />
        Details about the mass murder of Jews at Auschwitz.
        <br /> <br />
        <strong>
          <MapLink url="tour#block-4">See block 4 →</MapLink>
        </strong>
      </>
    ),
  },
  blok5: {
    positions: [
      [50.0264887, 19.2046667],
      [50.0263902, 19.2045501],
      [50.0261451, 19.20505],
      [50.0262438, 19.2051664],
      [50.0264887, 19.2046667],
    ],
    popup: (
      <>
        <strong>Material Evidence of Crime</strong>
        <br />
        Personal belongings of victims.
        <br /> <br />
        <strong>
          <MapLink url="tour#block-5">See block 5 →</MapLink>
        </strong>
      </>
    ),
  },
  blok6: {
    positions: [
      [50.0262303, 19.2043685],
      [50.0261341, 19.2042553],
      [50.0258922, 19.204753],
      [50.0259884, 19.2048663],
      [50.0262303, 19.2043685],
    ],
    popup: (
      <>
        <strong>Everyday Life of Prisoners</strong>
        <br />
        How prisoners lived inside the camp.
        <br /> <br />
        <strong>
          <MapLink url="tour#block-6">See block 6 →</MapLink>
        </strong>
      </>
    ),
  },
  blok7: {
    positions: [
      [50.0260464, 19.2041515],
      [50.0259491, 19.2040395],
      [50.0257098, 19.2045402],
      [50.025807, 19.2046522],
      [50.0260464, 19.2041515],
    ],
    popup: (
      <>
        <strong>Living Conditions</strong>
        <br />
        Example of typical prisoner accommodation.
        <br /> <br />
        <strong>
          <MapLink url="tour#block-7">See block 7 →</MapLink>
        </strong>
      </>
    ),
  },
  blok11wewnetrznewiezieniebloksmierci: {
    positions: [
      [50.0253061, 19.2032949],
      [50.0252081, 19.2031833],
      [50.0250951, 19.2034127],
      [50.0250787, 19.2034055],
      [50.0250688, 19.2034267],
      [50.0250777, 19.2034491],
      [50.0249656, 19.2036803],
      [50.0250636, 19.2037948],
      [50.0253061, 19.2032949],
    ],
    popup: (
      <>
        <strong>The Death Block</strong>
        <br />
        Internal prison, torture, and executions.
        <br /> <br />
        <strong>
          <MapLink url="tour#block-11">See block 11 →</MapLink>
        </strong>
      </>
    ),
  },
  komoragazowakrematoriumi: {
    positions: [
      [50.0282422, 19.204818],
      [50.0281888, 19.2047573],
      [50.0281385, 19.2047001],
      [50.0279994, 19.2049968],
      [50.0281031, 19.2051147],
      [50.0282422, 19.204818],
    ],
    popup: (
      <>
        <strong>Gas Chamber and Crematorium I</strong>
        <br />
        Place of mass extermination and body burning.
        <br /> <br />
        <strong>
          <MapLink url="tour#gas-chamber">See the place →</MapLink>
        </strong>
      </>
    ),
  },
  // Main Gate (dot marker)
  mainGate: {
    positions: [[50.027448, 19.203385]], // Coordinates for the "Arbeit Macht Frei" gate
    popup: (
      <>
        <strong>Main Gate: "Arbeit Macht Frei"</strong>
        <br />
        The infamous entrance to Auschwitz I.
        <br /> <br />
        <strong>
          <MapLink url="tour#auschwitz-gate">See the gate →</MapLink>
        </strong>
      </>
    ),
  },
  // Roll Call Square (dot marker)
  rollCallSquare: {
    positions: [[50.026673, 19.203565]], // Approximate center of Appellplatz
    popup: (
      <>
        <strong>Roll Call Square</strong>
        <br />
        Daily roll calls under brutal conditions.
        <br /> <br />
        <strong>
          <MapLink url="tour#roll-call">See the square →</MapLink>
        </strong>
      </>
    ),
  },
}
