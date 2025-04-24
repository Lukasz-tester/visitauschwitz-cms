// import createMiddleware from 'next-intl/middleware'
// import { routing } from './i18n/routing'

// export default createMiddleware({
//   ...routing,
//   localeDetection: true, // This is the correct place for locale detection
// })

// export const config = {
//   matcher: [
//     // Exclude static pages (like sitemap.xml) and specific paths from locale detection
//     '/((?!api|_next|_vercel|admin|next|.*\\..*).*)', // Exclude non-dynamic pages like .xml files
//   ],
// }

// BEFORE BELOW:
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
