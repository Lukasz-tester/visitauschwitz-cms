// Backend for the Auschwitz Guidebook mobile app's error/content report form.
// Receives a report and emails it to the maintainer via Payload's email adapter
// (Resend) — so the app never ships an email API key. Point the app's
// REPORT_ENDPOINT at this route's deployed URL (.../api/guidebook-app).
// Mirrors the newsletter /api/subscribe pattern (CORS + honeypot + sendEmail).

import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const REPORT_TO = process.env.REPORT_TO || 'visitauschwitzinfo@gmail.com'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function json(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  })
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  let body: {
    description?: string
    email?: string
    language?: string
    context?: string
    screenshot?: { name?: string; base64?: string }
    _hp_company?: string
  }
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  // Honeypot — silently succeed if a bot filled it.
  if (body._hp_company) return json({ status: 'sent' })

  const description = (body.description || '').trim()
  if (!description) return json({ error: 'Description required' }, 400)

  const payload = await getPayload({ config })
  try {
    const meta: [string, string | undefined][] = [
      ['Language', body.language],
      ['Context', body.context],
      ['Reply-to', body.email],
    ]
    const html =
      meta
        .filter(([, v]) => v && String(v).trim())
        .map(([k, v]) => `<p><strong>${esc(k)}:</strong> ${esc(String(v))}</p>`)
        .join('') +
      `<hr/><p>${esc(description).replace(/\n/g, '<br/>')}</p>`

    // Forward an optional screenshot as a Resend attachment. The
    // @payloadcms/email-resend adapter passes `attachments` through to
    // resend.emails.send ({ filename, content: base64 }). If attachments ever
    // don't arrive, call the Resend SDK directly here instead.
    const shot = body.screenshot
    const attachments =
      shot?.base64
        ? [{ filename: shot.name || 'screenshot.jpg', content: shot.base64 }]
        : undefined

    await payload.sendEmail({
      to: REPORT_TO,
      subject: 'Guidebook error report',
      html,
      ...(attachments ? { attachments } : {}),
    } as Parameters<typeof payload.sendEmail>[0])
    return json({ status: 'sent' })
  } catch (error) {
    payload.logger.error({ err: error }, 'Failed to send guidebook error report')
    return json({ error: 'Internal error' }, 500)
  }
}
