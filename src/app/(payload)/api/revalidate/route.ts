// https://your-domain.vercel.app/api/revalidate?secret=yourSuperSecretToken&path=/your-page

import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const path = request.nextUrl.searchParams.get('path')

  if (secret !== process.env.REVALIDATION_SECRET || !path) {
    return new Response('Unauthorized or missing path', { status: 401 })
  }

  try {
    await fetch(`http://localhost:3000/api/revalidate-path?path=${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    return new Response(`Revalidated ${path}`, { status: 200 })
  } catch (err) {
    return new Response('Failed to revalidate', { status: 500 })
  }
}
