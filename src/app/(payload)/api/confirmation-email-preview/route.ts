import { NextRequest } from 'next/server'
import { generateConfirmationEmail } from '@/email/generateConfirmationEmail'

export async function GET(request: NextRequest) {
  const locale = (request.nextUrl.searchParams.get('locale') || 'en') as 'en' | 'pl'

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const dummyConfirmUrl = `${baseUrl}/api/confirm?token=preview-test-token&locale=${locale}`

  const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=preview-test-token`
  const { html } = generateConfirmationEmail({ locale, confirmUrl: dummyConfirmUrl, unsubscribeUrl })

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
