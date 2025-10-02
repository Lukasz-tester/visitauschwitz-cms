import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse, userAgent } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: true,
})

export default function middleware(request: NextRequest) {
  const uaInfo = userAgent(request)
  const ua = request.headers.get('user-agent') || 'unknown'
  const { pathname } = request.nextUrl

  // ----------------------
  // 1. Whitelist dobrych botów
  // ----------------------
  const allowedBots = [/googlebot/i, /bingbot/i, /yandexbot/i, /duckduckbot/i, /applebot/i]

  if (allowedBots.some((bot) => bot.test(ua))) {
    console.log(`[ALLOW] Good bot: ${ua}`)
    return intlMiddleware(request)
  }

  // ----------------------
  // 2. Blokada złych botów
  // ----------------------
  const badBots = [
    /ahrefs/i,
    /semrush/i,
    /mj12/i,
    /ChatGPT-User/i,
    /facebookexternalhit/i,
    /chrome\/140/i,
    /pingdom/i,
    /uptimebot/i,
    /crawler/i,
    /spider/i,
    /scrapy/i,
    /curl/i,
    /python-requests/i,
  ]

  if (badBots.some((bot) => bot.test(ua))) {
    console.warn(`[BLOCK] Bad bot detected: ${ua}`)
    return new Response('Blocked', { status: 403 })
  }

  // ----------------------
  // 3. Blokada wszystkich "isBot", które nie są w whitelist
  // ----------------------
  if (uaInfo.isBot) {
    console.warn(`[BLOCK] Detected as bot by Next.js: ${ua}`)
    return new Response('Blocked', { status: 403 })
  }

  // ----------------------
  // 4. Obsługa statycznych plików (media)
  // ----------------------
  if (pathname.startsWith('/api/media/')) {
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    console.log(`[CACHE] Media file cached: ${pathname}`)
    return response
  }

  // ----------------------
  // 5. Normalny ruch (ludzie + dozwolone boty)
  // ----------------------
  const response = intlMiddleware(request)

  const existingVary = response.headers.get('Vary')
  response.headers.set('Vary', [existingVary, 'RSC'].filter(Boolean).join(', '))
  response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=300')

  console.log(`[ALLOW] Human/Browser: ${ua} -> ${pathname}`)

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next|_next/static|_next/image|favicon.ico|icon.ico|apple-touch-icon.png|robots.txt|sitemap.xml|_vercel|admin|next|.*\\..*).*)',
  ],
}
