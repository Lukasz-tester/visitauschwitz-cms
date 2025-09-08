const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://visitauschwitz.info'

export async function GET() {
  const content = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${serverUrl}/sitemap.xml`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
