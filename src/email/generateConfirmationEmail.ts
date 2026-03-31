import en from '@/i18n/messages/en.json'
import pl from '@/i18n/messages/pl.json'

const messages: Record<string, Record<string, string>> = { en, pl }

function t(locale: string, key: string): string {
  return messages[locale]?.[key] ?? messages['en']?.[key] ?? key
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function generateConfirmationEmail({
  locale,
  confirmUrl,
}: {
  locale: 'en' | 'pl'
  confirmUrl: string
}): { subject: string; html: string } {
  const subject = t(locale, 'confirmation-email-subject')
  const greeting = t(locale, 'confirmation-email-greeting')
  const explanation = t(locale, 'confirmation-email-explanation')
  const instruction = t(locale, 'confirmation-email-instruction')
  const cta = t(locale, 'confirmation-email-cta')
  const expiry = t(locale, 'confirmation-email-expiry')
  const ignore = t(locale, 'confirmation-email-ignore')
  const footer = t(locale, 'confirmation-email-footer')

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(subject)}</title>
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
          <!-- Greeting -->
          <tr>
            <td style="padding:32px 32px 0;">
              <h2 style="margin:0;font-size:18px;color:#333333;">${escapeHtml(greeting)}</h2>
            </td>
          </tr>
          <!-- Explanation -->
          <tr>
            <td style="padding:16px 32px 0;font-size:15px;line-height:1.6;color:#555555;">
              ${escapeHtml(explanation)}
            </td>
          </tr>
          <!-- Instruction -->
          <tr>
            <td style="padding:12px 32px 0;font-size:15px;line-height:1.6;color:#555555;">
              ${escapeHtml(instruction)}
            </td>
          </tr>
          <!-- CTA Button -->
          <tr>
            <td style="padding:24px 32px;text-align:center;">
              <a href="${escapeHtml(confirmUrl)}" target="_blank" style="display:inline-block;padding:14px 36px;background-color:#1a1a1a;color:#ffffff;text-decoration:none;border-radius:4px;font-size:16px;font-weight:600;">${escapeHtml(cta)}</a>
            </td>
          </tr>
          <!-- Expiry note -->
          <tr>
            <td style="padding:0 32px 24px;font-size:13px;line-height:1.5;color:#888888;font-style:italic;text-align:center;">
              ${escapeHtml(expiry)}
            </td>
          </tr>
          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;">
              <hr style="border:none;border-top:1px solid #e0e0e0;margin:0;" />
            </td>
          </tr>
          <!-- Ignore note -->
          <tr>
            <td style="padding:16px 32px 8px;font-size:13px;line-height:1.5;color:#999999;">
              ${escapeHtml(ignore)}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:8px 32px 24px;font-size:13px;line-height:1.5;color:#999999;">
              ${escapeHtml(footer)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return { subject, html }
}
