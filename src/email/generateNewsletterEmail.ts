import en from '@/i18n/messages/en.json'
import pl from '@/i18n/messages/pl.json'

const messages: Record<string, Record<string, string>> = { en, pl }

function t(locale: string, key: string): string {
  return messages[locale]?.[key] ?? messages['en']?.[key] ?? key
}

function linkify(html: string, color = '#999999'): string {
  const style = `color:${color};text-decoration:underline;`
  // Replace emails first, using a placeholder to protect them from URL matching
  const emailPlaceholders: string[] = []
  let result = html.replace(
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
    (match) => {
      const idx = emailPlaceholders.length
      emailPlaceholders.push(`<a href="mailto:${match}" style="${style}">${match}</a>`)
      return `\x00EMAIL${idx}\x00`
    },
  )
  // Then linkify URLs, skipping placeholders
  result = result.replace(
    /\b((?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s<]*)?)/g,
    (match) => {
      const href = match.startsWith('http') ? match : `https://${match}`
      return `<a href="${href}" style="${style}">${match}</a>`
    },
  )
  // Restore email placeholders
  result = result.replace(/\x00EMAIL(\d+)\x00/g, (_, idx) => emailPlaceholders[Number(idx)])
  return result
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function generateNewsletterEmail({
  locale,
  subject,
  intro,
  footer,
  checklistUrl,
  unsubscribeUrl,
}: {
  locale: string
  subject: string
  intro: string
  footer: string
  checklistUrl: string
  unsubscribeUrl: string
}): { subject: string; html: string } {
  const checklistTitle = t(locale, 'newsletter-email-checklist-title')
  const checklistDescription = t(locale, 'newsletter-email-checklist-description')
  const checklistCta = t(locale, 'newsletter-email-checklist-cta')
  const unsubscribe = t(locale, 'email-unsubscribe')

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
          <!-- Subject -->
          <tr>
            <td style="padding:32px 32px 0;">
              <h2 style="margin:0;font-size:18px;color:#333333;">${escapeHtml(subject)}</h2>
            </td>
          </tr>
          <!-- Intro -->
          <tr>
            <td style="padding:16px 32px 24px;font-size:15px;line-height:1.6;color:#555555;">
              ${linkify(escapeHtml(intro), '#555555').replace(/\n/g, '<br />')}
            </td>
          </tr>
          <!-- Checklist CTA -->
          <tr>
            <td style="padding:0 32px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f8f8;border-radius:6px;border:1px solid #e0e0e0;">
                <tr>
                  <td style="padding:20px 24px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:16px;font-weight:600;color:#333333;">${escapeHtml(checklistTitle)}</p>
                    <p style="margin:0 0 14px;font-size:13px;color:#666666;">${escapeHtml(checklistDescription)}</p>
                    <a href="${escapeHtml(checklistUrl)}" target="_blank" style="display:inline-block;padding:10px 28px;background-color:#1a1a1a;color:#ffffff;text-decoration:none;border-radius:4px;font-size:14px;font-weight:500;">${escapeHtml(checklistCta)}</a>
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
            <td style="padding:16px 32px 8px;font-size:13px;line-height:1.5;color:#999999;">
              ${linkify(escapeHtml(footer)).replace(/\n/g, '<br />')}
            </td>
          </tr>
          <!-- Unsubscribe -->
          <tr>
            <td style="padding:4px 32px 24px;font-size:12px;color:#bbbbbb;">
              <a href="${escapeHtml(unsubscribeUrl)}" style="color:#bbbbbb;text-decoration:underline;">${escapeHtml(unsubscribe)}</a>
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
