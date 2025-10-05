import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: true,
})

export default function middleware(request: NextRequest) {
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
