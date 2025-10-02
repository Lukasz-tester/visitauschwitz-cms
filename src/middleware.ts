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
  // 1. Whitelist dobrych botów i legalnych UA Google
  // ----------------------
  const allowedBots = [
    /googlebot/i,
    /bingbot/i,
    /yandexbot/i,
    /duckduckbot/i,
    /applebot/i,
    /google-inspectiontool/i, // Google Search Console / PageSpeed
    /google/i, // catch-all Google UA variants
  ]

  // jeśli UA pasuje do whitelisty → przepuszczamy
  if (allowedBots.some((bot) => bot.test(ua))) {
    console.log(`[ALLOW] Good bot or Google UA: ${ua}`)
    return intlMiddleware(request)
  }

  // ----------------------
  // 2. Blokada złych botów (agresywna)
  // ----------------------
  const badBots = [
    /ahrefs/i,
    /semrush/i,
    /mj12/i,
    /ChatGPT-User/i,
    /facebookexternalhit/i,
    /chrome\/140/i, //TODO - to kiedys trzeba bedzie zmienic jak ta wersja wejdzie do uzytku
    /python-urllib/i,
    /pinterest/i,
    /slurp/i,
    /baiduspider/i,
    /sogou/i,
    /exabot/i,
    /ia_archiver/i,
    /seznambot/i,
    /rogerbot/i,
    /dotbot/i,
    /gigabot/i,
    /heritrix/i,
    /ltx71/i,
    /proximic/i,
    /surveybot/i,
    /wotbox/i,
    /yeti/i,
    /zoominfobot/i,
    /curlbot/i,
    /trendictionbot/i,
    /tweetmemebot/i,
    /unwindfetchor/i,
    /urlappendbot/i,
    /vagabondo/i,
    /wbsearchbot/i,
    /yanga/i,
    /yioop/i,
    /zealbot/i,
    /zipbot/i,
    /zyborg/i,
    /mj12bot/i,
    /netcraft/i,
    /uptimebot/i,
    /pingdom/i,
    /uptimebot/i,
    /crawler/i,
    /spider/i,
    /scrapy/i,
    /curl/i,
    /python-requests/i,
    /wget/i,
    /httpie/i,
    /libwww-perl/i,
  ]

  if (badBots.some((bot) => bot.test(ua))) {
    console.warn(`[BLOCK] Bad bot detected: ${ua}`)
    return new Response('Blocked - Bad bot detected', { status: 403 })
  }

  // ----------------------
  // 3. Blokada UA oznaczonych jako bot przez Next.js, które nie są w whitelist
  // ----------------------
  if (uaInfo.isBot) {
    // dopuszczamy tylko przeglądarki desktop/mobile
    if (!/chrome|safari|firefox|edge|opr|opera|webkit/i.test(ua)) {
      console.warn(`[BLOCK] Detected as bot by Next.js: ${ua}`)
      return new Response('Blocked - Detected as bot by Next.js', { status: 403 })
    }
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
