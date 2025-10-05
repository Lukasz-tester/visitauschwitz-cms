// import { withPayload } from '@payloadcms/next/withPayload'
// import createNextIntlPlugin from 'next-intl/plugin'
// import redirects from './redirects.js'
// import bundleAnalyzer from '@next/bundle-analyzer'

// // Setup analyzer plugin
// const withBundleAnalyzer = bundleAnalyzer({
//   enabled: process.env.ANALYZE === 'true',
// })

// // Setup intl plugin
// const withNextIntl = createNextIntlPlugin()

// const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// /** @type {import('next').NextConfig} */
// const baseConfig = {
//   images: {
//     remotePatterns: [
//       ...[
//         NEXT_PUBLIC_SERVER_URL,
//         'https://**.vercel-storage.com',
//         'https://raw.githubusercontent.com',
//       ].map((item) => {
//         const url = new URL(item)
//         return {
//           hostname: url.hostname,
//           protocol: url.protocol.replace(':', ''),
//         }
//       }),
//     ],
//   },
//   reactStrictMode: true,
//   redirects,
// }

// // Compose all wrappers
// const withPlugins = withBundleAnalyzer(withNextIntl(withPayload(baseConfig)))
// // command: ANALYZE=true pnpm run build

// export default withPlugins

// BEFORE CHANGES:

import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[
        NEXT_PUBLIC_SERVER_URL,
        'https://**.vercel-storage.com',
        'https://raw.githubusercontent.com',
      ].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
  },
  images: {
    domains: ['images.visitauschwitz.info'],
  },
  reactStrictMode: true,
  redirects,
}

export default withNextIntl(withPayload(nextConfig))
