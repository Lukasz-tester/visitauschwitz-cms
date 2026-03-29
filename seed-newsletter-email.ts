
import { readFileSync } from 'fs'

// Load .env manually
const envFile = readFileSync('.env', 'utf-8')
for (const line of envFile.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) process.env[match[1].trim()] = match[2].trim()
}

import { getPayload } from 'payload'
import config from './src/payload.config'

async function seed() {
  const payload = await getPayload({ config })

  await payload.updateGlobal({
    slug: 'newsletter-email',
    locale: 'en',
    data: {
      subject: 'Your Auschwitz visit checklist is ready',
      intro: `Thank you for signing up!

Here is your free preparation checklist for visiting the Auschwitz-Birkenau Memorial:

[LINK TO CHECKLIST PAGE]

This checklist covers everything you need to know before your visit — tickets, transport from Krakow, what to bring, museum rules, and timing tips.

I've been a licensed Auschwitz guide since 2006 and created this resource to help visitors prepare properly. If you have any questions, just reply to this email.`,
      footer: `Lukasz — visitauschwitz.info
Licensed Auschwitz-Birkenau guide since 2006

You received this email because you signed up for the preparation checklist at visitauschwitz.info.`,
    },
  })

  console.log('Newsletter email content seeded (en)')
  process.exit(0)
}

seed()
