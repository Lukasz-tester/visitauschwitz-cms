import createMiddleware from 'next-intl/middleware'
import { NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const locales = ['en', 'pl', 'de', 'fr', 'es', 'it', 'nl', 'ru', 'uk']

const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: true,
})

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Match localized homepage like /en, /pl, etc.
  const isLocalizedHome = locales.some((locale) => pathname === `/${locale}`)

  const response = intlMiddleware(request)

  if (isLocalizedHome) {
    response.headers.set('Cache-Control', 'no-cache, must-revalidate')
  }

  return response
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next`, `/_vercel`, or `/admin`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|admin|next|.*\\..*).*)',
  ],
}

// BEFORE:
// https://www.reddit.com/r/nextjs/comments/184zfz1/rsc_raw_json_response_on_page_load/
// import createMiddleware from 'next-intl/middleware'
// import { routing } from './i18n/routing'

// export default createMiddleware({
//   ...routing,
//   localeDetection: true,
// })

// // see https://next-intl-docs.vercel.app/docs/routing/middleware
// export const config = {
//   matcher: [
//     // Match all pathnames except for
//     // - … if they start with `/api`, `/_next`, `/_vercel`, or `/admin`
//     // - … the ones containing a dot (e.g. `favicon.ico`)
//     '/((?!api|_next|_vercel|admin|next|.*\\..*).*)',
//   ],
// }

// Less aggressive cache policy than `no-store`
// response.headers.set('Cache-Control', 'no-cache, must-revalidate')

// ok, now i would like to fix my hero as when opening pages i see only half of the buttons in the screen bottom - they are behind the mobile android navigation bar, the hero component at the moment is: ""
