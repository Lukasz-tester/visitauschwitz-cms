import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

// see https://next-intl-docs.vercel.app/docs/routing/middleware
export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next`, `/_vercel`, or `/admin`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|admin|next|.*\\..*).*)',
  ],
}

// import createMiddleware from 'next-intl/middleware'
// import { NextRequest, NextResponse } from 'next/server'
// import { routing } from './i18n/routing'

// const intlMiddleware = createMiddleware({
//   ...routing,
// })

// export default function middleware(request: NextRequest) {
//   const { pathname, searchParams } = request.nextUrl

//   console.log('Middleware triggered for path:', pathname)

//   if (searchParams.has('_rsc')) {
//     searchParams.delete('_rsc')
//     const newUrl = `${pathname}?${searchParams.toString()}`
//     return NextResponse.rewrite(newUrl)
//   }

//   const response = intlMiddleware(request)

//   const existingVary = response.headers.get('Vary')
//   response.headers.set('Vary', [existingVary, 'RSC'].filter(Boolean).join(', '))
//   response.headers.set('Cache-Control', 'public, max-age=2592000, must-revalidate')

//   return response
// }

// export const config = {
//   matcher: [
//     // Match all pathnames except for
//     // - … if they start with `/api`, `/_next`, `/_vercel`, or `/admin`
//     // - … the ones containing a dot (e.g. `favicon.ico`)
//     '/((?!api|_next|_vercel|admin|next|.*\\..*).*)',
//   ],
// }

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
