// https://your-domain.vercel.app/api/revalidate?secret=yourSuperSecretToken&path=/your-page
// to revalidate homepage in en use:
// https://muzeums.vercel.app/api/revalidate?secret=432432ggrwgeVERVregevalatiorrey&path=/en
//to revalidate tickets in en use:
// https://muzeums.vercel.app/api/revalidate?secret=432432ggrwgeVERVregevalatiorrey&path=/en/tickets
// app/api/revalidate/route.ts

//TODO add env secret for protection

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { path, secret } = await req.json()

  console.log('[API REVALIDATE]', path)

  if (secret !== process.env.REVALIDATION_KEY) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 403 })
  }

  try {
    if (!path) {
      throw new Error('No path provided')
    }

    // revalidate the specific path
    await fetch(`${req.nextUrl.origin}/api/revalidate-on-demand?path=${path}`)

    return NextResponse.json({ revalidated: true, path })
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating', error: err }, { status: 500 })
  }
}
