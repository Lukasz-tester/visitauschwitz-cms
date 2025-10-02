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

  // ❌ Blokuj jeśli Next.js rozpozna że to bot (ale z wyjątkiem Google itp.)
  if (uaInfo.isBot) {
    if (!/googlebot|bingbot|yandexbot|duckduckbot|applebot/i.test(ua)) {
      return new Response('Blocked', { status: 403 })
    }
  }

  // 🔎 Agresywna lista złych botów
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
    return new Response('Blocked', { status: 403 })
  }

  // 📁 Cache static media
  if (pathname.startsWith('/api/media/')) {
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    return response
  }

  // 🌍 intl middleware (locale handling)
  const response = intlMiddleware(request)

  // Headers optymalizacyjne
  const existingVary = response.headers.get('Vary')
  response.headers.set('Vary', [existingVary, 'RSC'].filter(Boolean).join(', '))
  response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=300')

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next|_next/static|_next/image|favicon.ico|icon.ico|apple-touch-icon.png|robots.txt|sitemap.xml|_vercel|admin|next|.*\\..*).*)',
  ],
}

// BELOW comment is not letting home be cached which is good for bfcache raw json response, but not good for performance
//the code was between declaring and returning response
// if neede add there as well search page which misbehaves when pasting full url .../search or changing locale while in search page (code for that is in very bottom)
// instead of the _rsc deleting strategy above which fixes raw json rsc after opening tab after some longer time consider uncommenting TabFocusProvider in providers which worked in a similar way
// const locales = ['en', 'pl', 'de', 'fr', 'es', 'it', 'nl', 'ru', 'uk']
// const isLocalizedHome = locales.some((locale) => pathname === `/${locale}`)

// if (isLocalizedHome) {
//   response.headers.set('Cache-Control', 'no-store')
// }

// BELOW is some cookie for langs however langs work well enough with autodetection now so why bother?
// // Check for NEXT_LOCALE cookie
// const localeCookie = request.cookies.get('NEXT_LOCALE')

// // If cookie exists and pathname doesn't start with a locale, redirect
// if (localeCookie && !pathname.startsWith(`/${localeCookie}`)) {
//   const url = request.nextUrl.clone()
//   url.pathname = `/${localeCookie}${pathname}`
//   return NextResponse.redirect(url)
// }

// BELOW is the logic for not caching home with extention to search page
// const locales = ['en', 'pl', 'de', 'fr', 'es', 'it', 'nl', 'ru', 'uk']
// const isLocalizedHome = locales.some((locale) => pathname === `/${locale}`)

// if (isLocalizedHome) {
//   response.headers.set('Cache-Control', 'no-store')
// solution below does not fix raw json rsc response, the one aboce does but removes cache totally
// response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
// }

// BELOW is an extention to include search as not cached which is explained below too

// const response = createMiddleware({
//   ...routing,
// })(req)
// const isHomePage = pathname === '/' //bfcache event still happens for home, no matter what magic I try
// const isHome = pathname === '/home'
// const isSearchPage = pathname.endsWith('/search') //adding the _rsc magic search page throws "Serverless Function has timed out." when you change lang on it, or paste the whole url; I tried to add /search to matcher but it timed out all the time
// const isLocalizedHome = locales.some((locale) => pathname === `/${locale}`)
// if (isHomePage || isHome || isSearchPage || isLocalizedHome) {
//   response.headers.set('Cache-Control', 'no-store') // not ideal as it removes caching benefits }
// return response }

// OPTION FOR FUTURE ???

// // middleware.ts
// import createMiddleware from 'next-intl/middleware'
// import { NextRequest, NextResponse } from 'next/server'
// import { routing } from './i18n/routing'

// const intlMiddleware = createMiddleware({
//   ...routing,
//   localeDetection: true,
// })

// export default function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl
//   const ua = (request.headers.get('user-agent') || '').toLowerCase()

//   // --------- 1️⃣ Block known bad bots ----------
//   const badBots = [
//     /ahrefs/i,
//     /semrush/i,
//     /mj12/i,
//     /chatgpt-user/i,
//     /facebookexternalhit/i,
//     /pingdom/i,
//     /uptimebot/i,
//   ]
//   if (badBots.some((bot) => bot.test(ua))) {
//     return new Response('Blocked', { status: 403 })
//   }

//   // --------- 2️⃣ Allow only real browsers ----------
//   const allowedBrowsers = [/chrome/i, /safari/i, /firefox/i, /edge/i, /mozilla/i]
//   if (!allowedBrowsers.some((b) => b.test(ua))) {
//     return new Response('Blocked', { status: 403 })
//   }

//   // --------- 3️⃣ Cache static media aggressively ----------
//   if (pathname.startsWith('/api/media/')) {
//     const res = NextResponse.next()
//     res.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
//     return res
//   }

//   // --------- 4️⃣ Protect expensive API endpoints ----------
//   if (pathname.startsWith('/api/users/me')) {
//     // return cached empty object for bots
//     if (/vercel-screenshot|chatgpt-user/i.test(ua)) {
//       return NextResponse.json(
//         { user: null },
//         { status: 200, headers: { 'Cache-Control': 'public, max-age=60' } }
//       )
//     }
//   }

//   // --------- 5️⃣ Let next-intl handle locales ----------
//   const response = intlMiddleware(request)

//   // Enhance caching headers for static pages
//   const existingVary = response.headers.get('Vary')
//   response.headers.set('Vary', [existingVary, 'RSC'].filter(Boolean).join(', '))
//   response.headers.set('Cache-Control', 'public, max-age=600000, must-revalidate')

//   return response
// }

// // --------- 6️⃣ Matcher: all pages except /api, _next, _vercel, /admin ----------
// export const config = {
//   matcher: [
//     '/((?!api|_next|_next/static|_next/image|favicon.ico|icon.ico|apple-touch-icon.png|robots.txt|sitemap.xml|_vercel|admin|next|.*\\..*).*)',
//   ],
// }
