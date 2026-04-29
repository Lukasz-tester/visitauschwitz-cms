/*
 * Export confirmed subscribers grouped by locale.
 *
 * Usage:
 *   pnpm tsx --env-file=.env src/scripts/export-subscribers.ts
 *
 * Output:
 *   .subs  — written to the project root, two sections:
 *            [en] and [pl], each with a comma-separated list of emails.
 *
 * Requirements:
 *   - Dev server does NOT need to be running.
 *   - Needs DATABASE_URI and PAYLOAD_SECRET set in .env (loaded automatically).
 */

import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '../payload.config'
import fs from 'fs/promises'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT = path.resolve(__dirname, '../../.subs')

async function main() {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'subscribers',
    where: { confirmed: { equals: true } },
    limit: 10000,
    pagination: false,
  })

  const byLocale: Record<string, string[]> = {}

  for (const sub of docs) {
    const locale = (sub.locale as string) ?? 'en'
    if (!byLocale[locale]) byLocale[locale] = []
    byLocale[locale].push(sub.email as string)
  }

  const locales = ['en', 'pl']
  const lines: string[] = []

  for (const locale of locales) {
    const emails = byLocale[locale] ?? []
    lines.push(`[${locale}]`)
    lines.push(emails.join(', '))
    lines.push('')
  }

  await fs.writeFile(OUTPUT, lines.join('\n'), 'utf8')
  console.log(`Written to ${OUTPUT}`)
  console.log(`  en: ${(byLocale['en'] ?? []).length} subscribers`)
  console.log(`  pl: ${(byLocale['pl'] ?? []).length} subscribers`)

  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
