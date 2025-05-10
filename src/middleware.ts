import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const locales = ['en', 'pl', 'de', 'fr', 'es', 'it', 'nl', 'ru', 'uk']

const intlMiddleware = createMiddleware({
  ...routing,
})

export default function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // BEFORE - ended in fast Timeout on vercel
  // if (searchParams.has('_rsc')) {
  //   return NextResponse.redirect(pathname)
  // }
  // router.replace replaces the current entry in the browser's history stack, meaning users won't be able to use the browser's back button to navigate to the previous page. This can disrupt the user's navigation flow, especially when switching locales, as it alters the expected history behavior.
  // router.push, on the other hand, adds a new entry to the history stack, allowing users to navigate back to the previous page using the back button. This approach aligns better with user expectations when changing locales, as it maintains the natural navigation flow.

  if (searchParams.has('_rsc')) {
    searchParams.delete('_rsc')
    const newUrl = `${pathname}?${searchParams.toString()}`
    return NextResponse.rewrite(newUrl)
  }

  const response = intlMiddleware(request)

  const isLocalizedHome = locales.some((locale) => pathname === `/${locale}`)

  if (isLocalizedHome) {
    // response.headers.set('Cache-Control', 'no-store')
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
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
