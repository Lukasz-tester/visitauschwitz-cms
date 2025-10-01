import type { Metadata } from 'next'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  title: 'Auschwitz Visitor Guidelines & Tips',
  description:
    'Plan your visit to the Auschwitz-Birkenau Memorial. Discover practical tips, tour options, regulations, and everything you need to know for a meaningful experience.',
  images: [
    {
      url: process.env.NEXT_PUBLIC_SERVER_URL
        ? `${process.env.NEXT_PUBLIC_SERVER_URL}/website-template-OG.jpg`
        : '/website-template-OG.jpg',
    },
  ],
  siteName: 'Auschwitz Visiting Guide',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
