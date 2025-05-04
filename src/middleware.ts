// import createMiddleware from 'next-intl/middleware'
// // import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { routing } from './i18n/routing'

// const intlMiddleware = createMiddleware({
//   ...routing,
//   localeDetection: true,
// })

// export default function middleware(request: NextRequest) {
//   const response = intlMiddleware(request)

//   // Less aggressive cache policy than `no-store`
//   response.headers.set('Cache-Control', 'no-cache, must-revalidate')

//   return response
// }

// export const config = {
//   matcher: ['/((?!api|_next|_vercel|admin|next|.*\\..*).*)'],
// }

// SOLUTION SUGGESTED BY AI WHICH HOWEVER REMOVES CACHE SO NO BENEFITS FROM IT!!!
// import createMiddleware from 'next-intl/middleware'
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { routing } from './i18n/routing'

// const intlMiddleware = createMiddleware({
//   ...routing,
//   localeDetection: true,
// })

// export default function middleware(request: NextRequest) {
//   const response = intlMiddleware(request)

//   // Force no-cache to prevent serving stale RSC JSON
//   response.headers.set('Cache-Control', 'no-store')

//   return response
// }

// export const config = {
//   matcher: ['/((?!api|_next|_vercel|admin|next|.*\\..*).*)'],
// }

// GOOD OLD VERSION - which however resulted in raw json response like in this article:
// https://www.reddit.com/r/nextjs/comments/184zfz1/rsc_raw_json_response_on_page_load/
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware({
  ...routing,
  localeDetection: true,
})

// see https://next-intl-docs.vercel.app/docs/routing/middleware
export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next`, `/_vercel`, or `/admin`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|admin|next|.*\\..*).*)',
  ],
}
