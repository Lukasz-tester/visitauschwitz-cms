const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://visitauschwitz.info'

export async function GET() {
  const content = `
# Allow Googlebot
User-agent: Googlebot
Disallow:

# Allow Bingbot
User-agent: Bingbot
Disallow:

# Block all other bots
User-agent: *
Disallow: /

Crawl-delay: 10
Disallow: /search
Disallow: /admin
Disallow: /_next/
Disallow: /api/

Sitemap: ${serverUrl}/sitemap.xml`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}

// Crawl-delay: [seconds] -> limit aggressive crawlers
// User-agent: *
//   Allow: /
