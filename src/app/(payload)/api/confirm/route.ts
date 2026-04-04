import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getUnsubscribeUrl } from '@/lib/resend'
import { generateNewsletterEmail } from '@/email/generateNewsletterEmail'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const frontendUrl = process.env.FRONTEND_URL || baseUrl

  if (!token) {
    return new Response('Missing token', { status: 400 })
  }

  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'subscribers',
    where: { token: { equals: token } },
    limit: 1,
  })

  if (result.docs.length === 0) {
    return NextResponse.redirect(`${frontendUrl}/newsletter?invalid=true`, 302)
  }

  const subscriber = result.docs[0]

  // Already confirmed — skip update, just redirect
  if (!subscriber.confirmed) {
    // Mark as confirmed
    await payload.update({
      collection: 'subscribers',
      id: subscriber.id,
      data: {
        confirmed: true,
        confirmedAt: new Date().toISOString(),
      },
    })

    // Send lead magnet email
    try {
      const emailContent = await payload.findGlobal({
        slug: 'newsletter-email',
        locale: subscriber.locale as 'en' | 'pl',
      })

      if (emailContent.subject) {
        const checklistUrl = `${baseUrl}/api/checklist-print?locale=${subscriber.locale}`
        const unsubscribeUrl = getUnsubscribeUrl(subscriber.token!)

        const { subject, html } = generateNewsletterEmail({
          locale: subscriber.locale,
          subject: emailContent.subject,
          intro: emailContent.intro || '',
          footer: emailContent.footer || '',
          checklistUrl,
          unsubscribeUrl,
        })

        await payload.sendEmail({
          to: subscriber.email,
          subject,
          html,
          headers: {
            'List-Unsubscribe': `<${unsubscribeUrl}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        })
      }
    } catch (error) {
      payload.logger.error(
        { err: error, email: subscriber.email },
        'Failed to send lead magnet email',
      )
    }

    payload.logger.info({ email: subscriber.email }, 'Subscriber confirmed')
  }

  return NextResponse.redirect(`${frontendUrl}/${subscriber.locale}/newsletter?confirmed=true`, 302)
}
