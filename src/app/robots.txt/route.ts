const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://visitauschwitz.info'

export async function GET() {
  // Crawl-delay: [seconds] -> limit aggressive crawlers
  const content = `User-agent: *
  Allow: /
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
