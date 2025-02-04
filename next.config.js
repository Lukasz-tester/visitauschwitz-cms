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
    // formats: ['image/avif'], 
    unoptimized: true,
  },
  reactStrictMode: true,
  redirects,
}

export default withNextIntl(withPayload(nextConfig))
