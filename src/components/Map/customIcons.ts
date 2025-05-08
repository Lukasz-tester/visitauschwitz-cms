import L from 'leaflet'
import { renderToStaticMarkup } from 'react-dom/server'
import { Placeholder } from '@/components/ui/Icons'
import React from 'react'

export const placeholderIcon = L.divIcon({
  className: 'placeholder-icon',
  html: `<div class="placeholder-icon-wrapper">
           ${renderToStaticMarkup(React.createElement(Placeholder))}
         </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 37], // Center it
})
