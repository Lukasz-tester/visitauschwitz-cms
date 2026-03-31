import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: true,
})

// Content endpoints safe to cache at Vercel's edge
const CACHEABLE_API_PREFIXES = [
  '/api/pages',
  '/api/posts',
  '/api/media',
  '/api/categories',
  '/api/globals/header',
  '/api/globals/footer',
  '/api/search',
]

function handleApiRoute(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl

  // Block /api/media/file/* — media is served directly from R2, not through Vercel.
  // Prevents broken S3 credential errors from consuming serverless invocations.
  if (
    pathname.startsWith('/api/media/file') &&
    process.env.NODE_ENV === 'production' &&
    !request.cookies.has('payload-token')
  ) {
    return new NextResponse(null, { status: 404 })
  }

  const response = NextResponse.next()

  // Only cache GET requests from unauthenticated clients (i.e. the CF Pages frontend)
  if (request.method !== 'GET') return response
  if (request.cookies.has('payload-token')) return response

  const isCacheable = CACHEABLE_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  if (isCacheable) {
    // Vercel-CDN-Cache-Control only affects Vercel's edge — not the browser.
    // Shifts traffic from Fast Origin Transfer → Fast Data Transfer.
    response.headers.set(
      'Vercel-CDN-Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400',
    )
  }

  return response
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Block sitemap — real sitemap lives on CF Pages, not Vercel
  if (pathname === '/sitemap.xml') {
    return new NextResponse(null, { status: 404 })
  }

  // API routes: block media files, cache content endpoints
  if (pathname.startsWith('/api/')) {
    return handleApiRoute(request)
  }

  // Frontend routes: intl middleware + noindex (Vercel CMS is not the public site)
  const response = intlMiddleware(request)

  const existingVary = response.headers.get('Vary')
  response.headers.set('Vary', [existingVary, 'RSC'].filter(Boolean).join(', '))
  response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=300')
  response.headers.set('X-Robots-Tag', 'noindex, nofollow')

  return response
}

export const config = {
  matcher: [
    // Frontend routes (excludes admin, _next, static files)
    '/((?!_next|_next/static|_next/image|favicon.ico|icon.ico|robots.txt|_vercel|admin|next|.*\\..*).*)',
    // Sitemap — blocked (real sitemap is on CF Pages)
    '/sitemap.xml',
    // API routes — for edge caching
    '/api/:path*',
  ],
}
