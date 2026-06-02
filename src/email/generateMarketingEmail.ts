import en from '@/i18n/messages/en.json'
import pl from '@/i18n/messages/pl.json'
import de from '@/i18n/messages/de.json'
import es from '@/i18n/messages/es.json'
import fr from '@/i18n/messages/fr.json'
import it from '@/i18n/messages/it.json'
import nl from '@/i18n/messages/nl.json'
import ru from '@/i18n/messages/ru.json'
import uk from '@/i18n/messages/uk.json'

const messages: Record<string, Record<string, string>> = {
  en,
  pl,
  de,
  es,
  fr,
  it,
  nl,
  ru,
  uk,
}

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

function linkify(html: string, color = '#999999'): string {
  const style = `color:${color};text-decoration:underline;`
  const emailPlaceholders: string[] = []
  let result = html.replace(
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
    (match) => {
      const idx = emailPlaceholders.length
      emailPlaceholders.push(`<a href="mailto:${match}" style="${style}">${match}</a>`)
      return `\x00EMAIL${idx}\x00`
    },
  )
  result = result.replace(
    /\b((?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s<]*)?)/g,
    (match) => {
      const href = match.startsWith('http') ? match : `https://${match}`
      return `<a href="${href}" style="${style}">${match}</a>`
    },
  )
  result = result.replace(/\x00EMAIL(\d+)\x00/g, (_, idx) => emailPlaceholders[Number(idx)])
  return result
}

function renderBody(body: string): string {
  return body
    .split(/\n\n+/)
    .map((para) => {
      const escaped = linkify(escapeHtml(para.trim()), '#555555').replace(/\n/g, '<br />')
      return `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#555555;">${escaped}</p>`
    })
    .join('\n')
}

export function generateMarketingEmail({
  locale,
  subject,
  preheader,
  body,
  footer,
  unsubscribeUrl,
}: {
  locale: string
  subject: string
  preheader?: string | null
  body: string
  footer?: string | null
  unsubscribeUrl: string
}): { subject: string; html: string } {
  const unsubscribeLabel = t(locale, 'email-unsubscribe')

  const preheaderHtml = preheader
    ? `<span style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;</span>`
    : ''

  const footerHtml = footer
    ? `<tr>
          <td style="padding:16px 32px 8px;font-size:13px;line-height:1.5;color:#999999;">
            ${linkify(escapeHtml(footer)).replace(/\n/g, '<br />')}
          </td>
        </tr>`
    : ''

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  ${preheaderHtml}
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
          <!-- Body -->
          <tr>
            <td style="padding:16px 32px 24px;">
              ${renderBody(body)}
            </td>
          </tr>
          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;">
              <hr style="border:none;border-top:1px solid #e0e0e0;margin:0;" />
            </td>
          </tr>
          ${footerHtml}
          <!-- Unsubscribe -->
          <tr>
            <td style="padding:${footer ? '4px' : '16px'} 32px 24px;font-size:12px;color:#bbbbbb;">
              <a href="${escapeHtml(unsubscribeUrl)}" style="color:#bbbbbb;text-decoration:underline;">${escapeHtml(unsubscribeLabel)}</a>
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
