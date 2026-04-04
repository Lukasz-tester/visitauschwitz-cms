import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import en from '@/i18n/messages/en.json'
import pl from '@/i18n/messages/pl.json'

const messages: Record<string, Record<string, string>> = { en, pl }

function t(locale: string, key: string): string {
  return messages[locale]?.[key] ?? messages['en']?.[key] ?? key
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

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
    return new Response(unsubscribedHtml(t('en', 'unsubscribe-invalid'), 'en'), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  const subscriber = result.docs[0]
  const locale = subscriber.locale || 'en'

  // Delete subscriber from DB
  await payload.delete({
    collection: 'subscribers',
    id: subscriber.id,
  })

  payload.logger.info({ email: subscriber.email }, 'Subscriber unsubscribed')

  return new Response(unsubscribedHtml(t(locale, 'unsubscribe-success'), locale), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

// Also support POST for List-Unsubscribe-Post one-click
export async function POST(request: NextRequest) {
  return GET(request)
}

function unsubscribedHtml(message: string, locale: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${t(locale, 'unsubscribe-page-title')}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:64px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background-color:#1a1a1a;padding:24px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">visitauschwitz.info</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;text-align:center;font-size:16px;color:#333333;">
              ${message}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
