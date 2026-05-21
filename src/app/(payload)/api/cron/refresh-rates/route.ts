// Daily FX rate refresh. Triggered by GitHub Actions cron (see .github/workflows/refresh-fx.yml).
// Local manual test:
//   curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/refresh-rates

import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const FRANKFURTER_URL = 'https://api.frankfurter.app/latest?base=PLN&symbols=EUR,USD,GBP'

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization') ?? ''
  const secret = process.env.CRON_SECRET
  if (!secret || auth !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const res = await fetch(FRANKFURTER_URL, { cache: 'no-store' })
    if (!res.ok) {
      return new Response(`Frankfurter responded ${res.status}`, { status: 502 })
    }
    const json = (await res.json()) as { rates: { EUR: number; USD: number; GBP: number } }

    const payload = await getPayload({ config })
    await payload.updateGlobal({
      slug: 'exchange-rates',
      data: {
        baseCurrency: 'PLN',
        rates: {
          EUR: json.rates.EUR,
          USD: json.rates.USD,
          GBP: json.rates.GBP,
        },
        updatedAt: new Date().toISOString(),
        source: 'frankfurter.app',
      },
    })

    return Response.json({ ok: true, rates: json.rates, updatedAt: new Date().toISOString() })
  } catch (err) {
    return new Response(`Refresh failed: ${(err as Error).message}`, { status: 500 })
  }
}
