/**
 * One-time script to populate the `usedIn` field on all Media items.
 * Scans all Pages, Posts, and Users for media references.
 * Safe to re-run — clears existing usedIn data before rebuilding.
 *
 * Usage:
 *   npx tsx scripts/seed-media-usage.ts
 */

import { readFileSync } from 'fs'

// Load .env before importing Payload
const envContent = readFileSync('.env', 'utf-8')
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) process.env[match[1].trim()] = match[2].trim()
}

async function main() {
  const { getPayload } = await import('payload')
  const configPromise = (await import('@payload-config')).default
  const { extractPageMedia, extractPostMedia, extractUserMedia } = await import(
    '../src/hooks/syncMediaUsage'
  )

  const payload = await getPayload({ config: configPromise })

  type UsedInEntry = { document: { relationTo: string; value: string }; location: string }
  const usageMap = new Map<string, UsedInEntry[]>()

  function addEntry(mediaId: string, docId: string, collection: string, location: string) {
    if (!usageMap.has(mediaId)) usageMap.set(mediaId, [])
    usageMap.get(mediaId)!.push({
      document: { relationTo: collection, value: docId },
      location,
    })
  }

  // Scan Pages
  const { docs: pages } = await payload.find({ collection: 'pages', limit: 0, depth: 0 })
  for (const page of pages) {
    const mediaMap = extractPageMedia(page)
    for (const [mediaId, locations] of mediaMap) {
      for (const loc of locations) {
        addEntry(mediaId, page.id, 'pages', loc)
      }
    }
  }
  console.log(`Scanned ${pages.length} pages`)

  // Scan Posts
  const { docs: posts } = await payload.find({ collection: 'posts', limit: 0, depth: 0 })
  for (const post of posts) {
    const mediaMap = extractPostMedia(post)
    for (const [mediaId, locations] of mediaMap) {
      for (const loc of locations) {
        addEntry(mediaId, post.id, 'posts', loc)
      }
    }
  }
  console.log(`Scanned ${posts.length} posts`)

  // Scan Users
  const { docs: users } = await payload.find({
    collection: 'users',
    limit: 0,
    depth: 0,
    overrideAccess: true,
  })
  for (const user of users) {
    const mediaMap = extractUserMedia(user)
    for (const [mediaId, locations] of mediaMap) {
      for (const loc of locations) {
        addEntry(mediaId, user.id, 'users', loc)
      }
    }
  }
  console.log(`Scanned ${users.length} users`)

  // Update all media items
  const { docs: allMedia } = await payload.find({ collection: 'media', limit: 0, depth: 0 })
  let updated = 0

  for (const media of allMedia) {
    const entries = usageMap.get(media.id) || []
    await payload.update({
      collection: 'media',
      id: media.id,
      data: { usedIn: entries },
      overrideAccess: true,
      depth: 0,
    })
    if (entries.length > 0) {
      console.log(`  ${media.filename}: ${entries.length} reference(s)`)
      updated++
    }
  }

  console.log(`\nDone. Updated ${updated}/${allMedia.length} media items.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
