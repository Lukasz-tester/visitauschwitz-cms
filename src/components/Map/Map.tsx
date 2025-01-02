'use client'

import Head from 'next/head'
import { useState } from 'react'

export const Map = () => {
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <>
      <button className="rounded bg-white w-12 h-12 flex items-center justify-center fixed bottom-3 right-3 text-black z-[1000]"
        onClick={() => setModalOpen(!modalOpen)}>
        MAP
      </button>
      {modalOpen && (
        <div className="fixed inset-0 height-screen p-4 bg-black z-[10000] flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-2xl">Modal</h1>
            <button
              className="rounded bg-blue-900 w-12 h-12 flex items-center justify-center fixed bottom-3 right-3"
              onClick={() => setModalOpen(false)}
            >
              X
            </button>
          </div>

  {/* <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
     */}


          <Head>
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
     integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    //  crossorigin=""
    />
     <script 
     type="text/javascript"
     async
     src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
     integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    //  crossorigin=""
     />
    </Head>
    
  {/* <body>
    <div id="map"></div>
    <script>
      // initialize Leaflet
      var map = L.map('map').setView({lon: 0, lat: 0}, 2);

      // add the OpenStreetMap tiles
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
      }).addTo(map);

      // show the scale bar on the lower left corner
      L.control.scale({imperial: true, metric: true}).addTo(map);

      // show a marker on the map
      L.marker({lon: 0, lat: 0}).bindPopup('The center of the world').addTo(map);
    </script>
  </body> */}


          <div className="py-4">Tu hjkh narazie jest czarna cerata ale kiedyś będzie mapa</div>
          <div id="map"></div>
          <div>
          {/* var map = L.map('map', {
    center: [51.505, -0.09],
    zoom: 13
}); */}
          </div>
        </div>
      )}
    </>
  )
}
