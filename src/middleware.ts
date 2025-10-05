import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: true,
})

const ipMap = new Map<string, number[]>()
const BURST_WINDOW = 2000 // 2 sekundy
const BURST_LIMIT = 3 // max 3 requesty w 2 sekundy

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ua = request.headers.get('user-agent') || 'unknown'

  // Log Edge requests (non-standard browsers)
  if (!/Chrome|Safari|Firefox|Edge/i.test(ua)) {
    console.log(`[Edge request] ${pathname} - UA: ${ua}`)
  }

  if (pathname.startsWith('/_next/image') || pathname.startsWith('/api/media/')) {
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    return response
  } else {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const now = Date.now()
    const timestamps = ipMap.get(ip) || []
    const recent = timestamps.filter((t) => now - t < BURST_WINDOW)
    recent.push(now)
    ipMap.set(ip, recent)

    if (recent.length > BURST_LIMIT) {
      console.warn(`[BLOCK] Burst detected from ${ip} -> ${pathname}`)
      return new Response('Too many requests', { status: 429 })
    }
  }

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
    /python-urllib/i,
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

  // Let intlMiddleware handle everything else (including setting headers)
  const response = intlMiddleware(request)

  // Optionally enhance headers here
  const existingVary = response.headers.get('Vary')
  response.headers.set('Vary', [existingVary, 'RSC'].filter(Boolean).join(', '))
  response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=300')

  return response
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next`, `/_vercel`, or `/admin`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    // the regex below can be shorter but there were some icon.ico problems so...
    '/((?!api|_next|_next/static|_next/image|favicon.ico|icon.ico|robots.txt|sitemap.xml|_vercel|admin|next|.*\\..*).*)',
  ],
}

// import createMiddleware from 'next-intl/middleware'
// import { NextRequest, NextResponse, userAgent } from 'next/server'
// import { routing } from './i18n/routing'

// const intlMiddleware = createMiddleware({
//   ...routing,
//   // localeDetection: true,
// })

// // ----------------------
// // Burst Protection (in-memory)
// // ----------------------
// const ipMap = new Map<string, number[]>()
// const BURST_WINDOW = 2000 // ms
// const BURST_LIMIT = 3 // requests in BURST_WINDOW

// export default function middleware(request: NextRequest) {
//   const uaInfo = userAgent(request)
//   const ua = request.headers.get('user-agent') || 'unknown'
//   const { pathname } = request.nextUrl
//   const accept = request.headers.get('accept') || ''

//   // ----------------------
//   // 4. Static media / _next/image -> ALWAYS return early and set long cache
//   // ----------------------
//   if (
//     pathname.startsWith('/api/media/') ||
//     pathname.startsWith('/_next/image') ||
//     pathname.startsWith('/_next/static') ||
//     pathname.startsWith('/favicon.ico') ||
//     pathname.startsWith('/icon.ico') ||
//     pathname.startsWith('/apple-touch-icon.png')
//   ) {
//     const response = NextResponse.next()
//     response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
//     console.log(`[CACHE] Media/static cached: ${pathname}`)
//     return response
//   }

//   // ----------------------
//   // 5. RSC fetches -> let Next handle them but mark as no-store so edge doesn't cache
//   // ----------------------
//   if (request.nextUrl.searchParams.has('_rsc')) {
//     const response = intlMiddleware(request)
//     // Definitely do not cache RSC payloads at edge
//     response.headers.set('Cache-Control', 'no-store')
//     return response
//   }

//   // ----------------------
//   // 1. Whitelist good bots (allow them through)
//   // ----------------------
//   const allowedBots = [
//     /googlebot/i,
//     /bingbot/i,
//     /yandexbot/i,
//     /duckduckbot/i,
//     /applebot/i,
//     /google-inspectiontool/i,
//     /google/i,
//     /facebookexternalhit/i,
//   ]
//   if (allowedBots.some((bot) => bot.test(ua))) {
//     console.log(`[ALLOW] Good bot: ${ua}`)
//     return intlMiddleware(request)
//   }

//   // ----------------------
//   // 2. Block aggressive bad bots
//   // ----------------------
//   const badBots = [
//     /ahrefs/i,
//     /semrush/i,
//     /mj12/i,
//     /ChatGPT-User/i,
//     /python-urllib/i,
//     /slurp/i,
//     /baiduspider/i,
//     /sogou/i,
//     /exabot/i,
//     /ia_archiver/i,
//     /seznambot/i,
//     /rogerbot/i,
//     /dotbot/i,
//     /gigabot/i,
//     /heritrix/i,
//     /ltx71/i,
//     /proximic/i,
//     /surveybot/i,
//     /wotbox/i,
//     /yeti/i,
//     /zoominfobot/i,
//     /curlbot/i,
//     /trendictionbot/i,
//     /tweetmemebot/i,
//     /unwindfetchor/i,
//     /urlappendbot/i,
//     /vagabondo/i,
//     /wbsearchbot/i,
//     /yanga/i,
//     /yioop/i,
//     /zealbot/i,
//     /zipbot/i,
//     /zyborg/i,
//     /mj12bot/i,
//     /netcraft/i,
//     /uptimebot/i,
//     /pingdom/i,
//     /crawler/i,
//     /spider/i,
//     /scrapy/i,
//     /curl/i,
//     /python-requests/i,
//     /wget/i,
//     /httpie/i,
//     /libwww-perl/i,
//   ]
//   if (badBots.some((bot) => bot.test(ua))) {
//     console.warn(`[BLOCK] Bad bot detected: ${ua}`)
//     return new Response('Blocked - Bad bot detected', { status: 403 })
//   }

//   // ----------------------
//   // 3. Block Next.js-detected bots that are not browsers
//   // ----------------------
//   if (uaInfo.isBot && !/chrome|safari|firefox|edge|opr|opera|webkit/i.test(ua)) {
//     console.warn(`[BLOCK] Detected as bot by Next.js: ${ua}`)
//     return new Response('Blocked - Detected as bot by Next.js', { status: 403 })
//   }

//   // ----------------------
//   // 6. Burst protection -> only for real HTML navigation requests
//   //    We consider a "human page request" when Accept includes 'text/html'
//   // ----------------------
//   const isHtmlRequest = accept.includes('text/html')
//   if (isHtmlRequest) {
//     const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
//     // shorten UA for key so we don't create insanely long map keys
//     const uaShort = ua.split(' ')[0] || ua
//     const key = `${ip}|${uaShort}`

//     const now = Date.now()
//     const timestamps = ipMap.get(key) || []
//     const recent = timestamps.filter((t) => now - t < BURST_WINDOW)
//     recent.push(now)
//     ipMap.set(key, recent)

//     if (recent.length > BURST_LIMIT) {
//       console.warn(`[BLOCK] Burst detected from ${key} -> ${pathname}`)
//       return new Response('Too many requests', { status: 429 })
//     }
//   }

//   // ----------------------
//   // 7. Normal: call intlMiddleware and set headers only for HTML responses
//   // ----------------------
//   const response = intlMiddleware(request)
//   const existingVary = response.headers.get('Vary')
//   response.headers.set('Vary', [existingVary, 'RSC'].filter(Boolean).join(', '))

//   // If response is HTML (or client requested HTML), set edge caching
//   const contentType = (response.headers.get('content-type') || '').toLowerCase()
//   if (contentType.includes('text/html') || isHtmlRequest) {
//     response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=300')
//   } else {
//     // ensure that non-HTML (JSON/RSC) isn't cached accidentally
//     if (request.nextUrl.searchParams.has('_rsc')) {
//       response.headers.set('Cache-Control', 'no-store')
//     }
//   }

//   console.log(`[ALLOW] Human/Browser: ${ua} -> ${pathname}`)
//   return response
// }

// export const config = {
//   matcher: [
//     '/((?!api|_next|_next/static|_next/image|favicon.ico|icon.ico|apple-touch-icon.png|robots.txt|sitemap.xml|_vercel|admin|next|.*\\..*).*)',
//   ],
// }

// import createMiddleware from 'next-intl/middleware'
// import { NextRequest, NextResponse } from 'next/server'
// import { routing } from './i18n/routing'

// // Create your intl middleware
// const intlMiddleware = createMiddleware(routing) // const intlMiddleware = createMiddleware({routing, localeDetection: true, })

// // // List of known bad bot user agents or patterns
// // const badBots = [/semrushbot/i, /ahrefsbot/i, /mj12bot/i, /crawler/i, /spider/i, /scrapy/i]

// export default async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl
//   const ua = request.headers.get('user-agent') || 'unknown'

//   // Handle static media files
//   if (pathname.startsWith('/_next/image') || pathname.startsWith('/api/media/')) {
//     const response = NextResponse.next()
//     response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
//     console.log(`[CACHE] Media file cached: ${pathname}`)
//     return response
//   }

//   const response = intlMiddleware(request)

//   // Optionally enhance headers here
//   const existingVary = response.headers.get('Vary')
//   response.headers.set('Vary', [existingVary, 'RSC'].filter(Boolean).join(', '))
//   response.headers.set('Cache-Control', 'public, max-age=600000, must-revalidate')

//   return response
// }

// export const config = {
//   matcher: [
//     // Match all pathnames except for
//     // - … if they start with `/api`, `/_next`, `/_vercel`, or `/admin`
//     // - … the ones containing a dot (e.g. `favicon.ico`)
//     // the regex below can be shorter but there were some icon.ico problems so...
//     '/((?!api|_next|_next/static|_next/image|favicon.ico|icon.ico|robots.txt|sitemap.xml|_vercel|admin|next|.*\\..*).*)',
//   ],
// }

// //   // Log Edge requests (non-standard browsers)
// //   if (!/Chrome|Safari|Firefox|Edge/i.test(ua)) {
// //     console.log(`[Edge request] ${pathname} - UA: ${ua}`)
// //   }

// //   // Block bad bots globally
// //   const badBots = [/ahrefs/i, /semrush/i, /mj12/i]
// //   if (badBots.some((bot) => bot.test(ua))) {
// //     return new Response('Blocked', { status: 403 })
// //   }

// //   // TODO test with this commented if the RAW RSC response still happens
// //   // if (searchParams.has('_rsc')) {
// //   //   searchParams.delete('_rsc')
// //   //   const newUrl = `${pathname}?${searchParams.toString()}`
// //   //   return NextResponse.rewrite(newUrl)
// //   // }

// //   // // ----------------------
// //   // // 5. Ignore _rsc fetches
// //   // // ----------------------
// //   // if (searchParams.has('_rsc')) {
// //   //   return NextResponse.next()
// //   // }

// //   // Handle static media files
// //   if (pathname.startsWith('/api/media/')) {
// //     const response = NextResponse.next()
// //     response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
// //     return response
// //   }

// // // ----------------------
// // // Burst Protection
// // // ----------------------
// // const ipMap = new Map<string, number[]>()
// // const BURST_WINDOW = 2000 // 2 sekundy
// // const BURST_LIMIT = 3 // max 3 requesty w 2 sekundy

// //   const uaInfo = userAgent(request)
// //   const ua = request.headers.get('user-agent') || 'unknown'
// //   const { pathname, searchParams } = request.nextUrl // searchParams not used for now
// //   const accept = request.headers.get('accept') || ''

// //   // ----------------------
// //   // 4. Static media / _next/image caching
// //   // ----------------------

// //   // ----------------------
// //   // 1. Whitelist dobrych botów i legalnych UA Google
// //   // ----------------------
// //   const allowedBots = [
// //     /googlebot/i,
// //     /bingbot/i,
// //     /yandexbot/i,
// //     /duckduckbot/i,
// //     /applebot/i,
// //     /google-inspectiontool/i, // Google Search Console / PageSpeed
// //     /google/i, // catch-all Google UA variants
// //   ]

// //   // jeśli UA pasuje do whitelisty → przepuszczamy
// //   if (allowedBots.some((bot) => bot.test(ua))) {
// //     console.log(`[ALLOW] Good bot or Google UA: ${ua}`)
// //     return intlMiddleware(request)
// //   }

// //   // ----------------------
// //   // 2. Blokada złych botów (agresywna)
// //   // ----------------------
// //   const badBots = [
// //     /ahrefs/i,
// //     /semrush/i,
// //     /mj12/i,
// //     /ChatGPT-User/i,
// //     /python-urllib/i,
// //     /slurp/i,
// //     /baiduspider/i,
// //     /sogou/i,
// //     /exabot/i,
// //     /ia_archiver/i,
// //     /seznambot/i,
// //     /rogerbot/i,
// //     /dotbot/i,
// //     /gigabot/i,
// //     /heritrix/i,
// //     /ltx71/i,
// //     /proximic/i,
// //     /surveybot/i,
// //     /wotbox/i,
// //     /yeti/i,
// //     /zoominfobot/i,
// //     /curlbot/i,
// //     /trendictionbot/i,
// //     /tweetmemebot/i,
// //     /unwindfetchor/i,
// //     /urlappendbot/i,
// //     /vagabondo/i,
// //     /wbsearchbot/i,
// //     /yanga/i,
// //     /yioop/i,
// //     /zealbot/i,
// //     /zipbot/i,
// //     /zyborg/i,
// //     /mj12bot/i,
// //     /netcraft/i,
// //     /uptimebot/i,
// //     /pingdom/i,
// //     /uptimebot/i,
// //     /crawler/i,
// //     /spider/i,
// //     /scrapy/i,
// //     /curl/i,
// //     /python-requests/i,
// //     /wget/i,
// //     /httpie/i,
// //     /libwww-perl/i,
// //   ]

// //   if (badBots.some((bot) => bot.test(ua))) {
// //     console.warn(`[BLOCK] Bad bot detected: ${ua}`)
// //     return new Response('Blocked - Bad bot detected', { status: 403 })
// //   }

// //   // ----------------------
// //   // 3. Block bots detected by Next.js UA
// //   // ----------------------
// //   if (uaInfo.isBot && !/chrome|safari|firefox|edge|opr|opera|webkit/i.test(ua)) {
// //     console.warn(`[BLOCK] Detected as bot by Next.js: ${ua}`)
// //     return new Response('Blocked - Detected as bot by Next.js', { status: 403 })
// //   }

// //   // ----------------------
// //   // 6. Burst Protection only for dynamic HTML
// //   // ----------------------
// //   if (!isCacheable && !searchParams.has('_rsc')) {
// //     const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
// //     const now = Date.now()
// //     const timestamps = ipMap.get(ip) || []
// //     const recent = timestamps.filter((t) => now - t < BURST_WINDOW)
// //     recent.push(now)
// //     ipMap.set(ip, recent)

// //     if (recent.length > BURST_LIMIT) {
// //       console.warn(`[BLOCK] Burst detected from ${ip} -> ${pathname}`)
// //       return new Response('Too many requests', { status: 429 })
// //     }
// //   }

// //   // ----------------------
// //   // 7. Normalny ruch (ludzie + dozwolone boty)
// //   // ----------------------
// //   const response = intlMiddleware(request)
// //   const existingVary = response.headers.get('Vary')
// //   response.headers.set('Vary', [existingVary, 'RSC'].filter(Boolean).join(', '))

// //   // If response is HTML (or client requested HTML), set edge caching
// //   const contentType = (response.headers.get('content-type') || '').toLowerCase()
// //   if (contentType.includes('text/html') || accept.includes('text/html')) {
// //     response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=300')
// //   } else {
// //     // ensure that non-HTML (JSON/RSC) isn't cached accidentally
// //     if (searchParams.has('_rsc')) {
// //       response.headers.set('Cache-Control', 'no-store')
// //     }
// //   }
// //   console.log(`[ALLOW] Human/Browser: ${ua} -> ${pathname}`)

// //   return response
// // }

// // export const config = {
// //   matcher: [
// //     '/((?!api|_next|_next/static|_next/image|favicon.ico|icon.ico|apple-touch-icon.png|robots.txt|sitemap.xml|_vercel|admin|next|.*\\..*).*)',
// //   ],
// // }
