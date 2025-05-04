// app/api/revalidate-path/route.ts
import { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')

  if (!path) {
    return new Response('Missing path', { status: 400 })
  }

  try {
    revalidatePath(path)
    return new Response(`Revalidated: ${path}`)
  } catch (err) {
    return new Response('Error revalidating', { status: 500 })
  }
}
