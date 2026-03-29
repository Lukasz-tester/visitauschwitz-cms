import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') || 'en'

  const payload = await getPayload({ config })
  const emailContent = await payload.findGlobal({
    slug: 'newsletter-email',
    locale: locale as 'en' | 'pl',
  })

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const checklistUrl = `${baseUrl}/api/checklist-print?locale=${locale}`

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(emailContent.subject || '')}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:#1a1a1a;padding:24px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">visitauschwitz.info</h1>
            </td>
          </tr>
          <!-- Subject -->
          <tr>
            <td style="padding:32px 32px 0;">
              <h2 style="margin:0;font-size:18px;color:#333333;">${escapeHtml(emailContent.subject || '')}</h2>
            </td>
          </tr>
          <!-- Intro -->
          <tr>
            <td style="padding:16px 32px 24px;font-size:15px;line-height:1.6;color:#555555;">
              ${escapeHtml(emailContent.intro || '').replace(/\n/g, '<br />')}
            </td>
          </tr>
          <!-- Checklist CTA -->
          <tr>
            <td style="padding:0 32px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f8f8;border-radius:6px;border:1px solid #e0e0e0;">
                <tr>
                  <td style="padding:20px 24px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:16px;font-weight:600;color:#333333;">Before You Go &mdash; Preparation Checklist</p>
                    <p style="margin:0 0 14px;font-size:13px;color:#666666;">Print it or save it &mdash; everything you need to prepare for your visit.</p>
                    <a href="${escapeHtml(checklistUrl)}" target="_blank" style="display:inline-block;padding:10px 28px;background-color:#1a1a1a;color:#ffffff;text-decoration:none;border-radius:4px;font-size:14px;font-weight:500;">View &amp; Print Checklist</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;">
              <hr style="border:none;border-top:1px solid #e0e0e0;margin:0;" />
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px 24px;font-size:13px;line-height:1.5;color:#999999;">
              ${escapeHtml(emailContent.footer || '').replace(/\n/g, '<br />')}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
