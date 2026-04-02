import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { generateNewsletterEmail } from '@/email/generateNewsletterEmail'

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') || 'en'

  const payload = await getPayload({ config })
  const emailContent = await payload.findGlobal({
    slug: 'newsletter-email',
    locale: locale as 'en' | 'pl',
  })

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const checklistUrl = `${baseUrl}/api/checklist-print?locale=${locale}`
  const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=preview-test-token`

  const { html } = generateNewsletterEmail({
    locale,
    subject: emailContent.subject || '',
    intro: emailContent.intro || '',
    footer: emailContent.footer || '',
    checklistUrl,
    unsubscribeUrl,
  })

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
