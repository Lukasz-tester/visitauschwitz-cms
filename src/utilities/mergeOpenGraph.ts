import type { Metadata } from 'next'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'Plan your visit to the Auschwitz-Birkenau Memorial. Discover practical tips, tour options, regulations, and everything you need to know for a meaningful experience.',
  images: [
    {
      url: process.env.NEXT_PUBLIC_SERVER_URL
        ? `${process.env.NEXT_PUBLIC_SERVER_URL}/website-template-OG.webp`
        : '/website-template-OG.webp',
    },
  ],
  siteName: 'Visit Auschwitz Memorial Guide',
  title: 'Visit Auschwitz - Memorial Visitor Guide & Tips',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
