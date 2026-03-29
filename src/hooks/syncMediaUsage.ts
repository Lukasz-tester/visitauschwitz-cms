import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, Payload } from 'payload'

type MediaRef = { mediaId: string; location: string }
type MediaMap = Map<string, Set<string>>
type MediaExtractor = (doc: any) => MediaMap
type CollectionSlug = 'pages' | 'posts' | 'users'

function getMediaId(value: unknown): string | null {
  if (!value) return null
  if (typeof value === 'string') return value
  if (typeof value === 'object' && 'id' in value) return String((value as any).id)
  return null
}

function addToMap(map: MediaMap, id: string | null, location: string) {
  if (!id) return
  if (!map.has(id)) map.set(id, new Set())
  map.get(id)!.add(location)
}

// --- Extractors ---

export function extractPageMedia(doc: any): MediaMap {
  const map: MediaMap = new Map()

  addToMap(map, getMediaId(doc.hero?.media), 'Hero')

  if (Array.isArray(doc.layout)) {
    for (const block of doc.layout) {
      switch (block.blockType) {
        case 'cta':
          if (Array.isArray(block.tiles)) {
            for (const tile of block.tiles) {
              addToMap(map, getMediaId(tile.media), 'CTA tile')
            }
          }
          break
        case 'content':
          if (Array.isArray(block.columns)) {
            for (const col of block.columns) {
              addToMap(map, getMediaId(col.media), 'Content column')
            }
          }
          break
        case 'mediaBlock':
          if (Array.isArray(block.images)) {
            for (const img of block.images) {
              addToMap(map, getMediaId(img.media), 'Media gallery')
            }
          }
          break
        case 'Image':
          addToMap(map, getMediaId(block.media), 'Image block')
          break
      }
    }
  }

  addToMap(map, getMediaId(doc.meta?.image), 'SEO image')

  return map
}

export function extractPostMedia(doc: any): MediaMap {
  const map: MediaMap = new Map()

  if (Array.isArray(doc.layout)) {
    for (const block of doc.layout) {
      if (block.blockType === 'Image') {
        addToMap(map, getMediaId(block.media), 'Image block')
      }
    }
  }

  addToMap(map, getMediaId(doc.meta?.image), 'SEO image')

  return map
}

export function extractUserMedia(doc: any): MediaMap {
  const map: MediaMap = new Map()
  addToMap(map, getMediaId(doc.photo), 'Profile photo')
  return map
}

// --- Helpers ---

function setsEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false
  for (const v of a) if (!b.has(v)) return false
  return true
}

function getDocValue(entry: any): string | null {
  const val = entry?.document?.value
  if (typeof val === 'string') return val
  if (val && typeof val === 'object' && 'id' in val) return String(val.id)
  return null
}

async function addUsedInEntries(
  payload: Payload,
  mediaId: string,
  docId: string,
  collectionSlug: CollectionSlug,
  locations: Set<string>,
) {
  const media = await payload.findByID({ collection: 'media', id: mediaId, depth: 0 })
  const existing = (media.usedIn as any[]) || []

  const newEntries = [...locations].map((location) => ({
    document: { relationTo: collectionSlug, value: docId },
    location,
  }))

  await payload.update({
    collection: 'media',
    id: mediaId,
    data: { usedIn: [...existing, ...newEntries] },
    overrideAccess: true,
    depth: 0,
  })
}

async function removeUsedInEntries(
  payload: Payload,
  mediaId: string,
  docId: string,
  collectionSlug: CollectionSlug,
) {
  const media = await payload.findByID({ collection: 'media', id: mediaId, depth: 0 })
  const existing = (media.usedIn as any[]) || []

  const filtered = existing.filter(
    (entry: any) =>
      !(entry.document?.relationTo === collectionSlug && getDocValue(entry) === String(docId)),
  )

  if (filtered.length !== existing.length) {
    await payload.update({
      collection: 'media',
      id: mediaId,
      data: { usedIn: filtered },
      overrideAccess: true,
      depth: 0,
    })
  }
}

// --- Hook factories ---

export function createSyncMediaUsageHook(
  collectionSlug: CollectionSlug,
  extractor: MediaExtractor,
): CollectionAfterChangeHook {
  return async ({ doc, previousDoc, req: { payload } }) => {
    const currentMedia = extractor(doc)
    const previousMedia = previousDoc ? extractor(previousDoc) : new Map<string, Set<string>>()

    const allIds = new Set([...currentMedia.keys(), ...previousMedia.keys()])

    const updates: Promise<void>[] = []

    for (const mediaId of allIds) {
      const wasUsed = previousMedia.has(mediaId)
      const isUsed = currentMedia.has(mediaId)

      const work = async () => {
        try {
          if (isUsed && !wasUsed) {
            await addUsedInEntries(payload, mediaId, doc.id, collectionSlug, currentMedia.get(mediaId)!)
          } else if (!isUsed && wasUsed) {
            await removeUsedInEntries(payload, mediaId, doc.id, collectionSlug)
          } else if (isUsed && wasUsed) {
            const oldLocs = previousMedia.get(mediaId)!
            const newLocs = currentMedia.get(mediaId)!
            if (!setsEqual(oldLocs, newLocs)) {
              await removeUsedInEntries(payload, mediaId, doc.id, collectionSlug)
              await addUsedInEntries(payload, mediaId, doc.id, collectionSlug, newLocs)
            }
          }
        } catch (error) {
          payload.logger.error(`Failed to sync media usage for media ${mediaId}: ${error}`)
        }
      }

      updates.push(work())
    }

    await Promise.all(updates)
    return doc
  }
}

export function createDeleteMediaUsageHook(
  collectionSlug: CollectionSlug,
  extractor: MediaExtractor,
): CollectionAfterDeleteHook {
  return async ({ doc, req: { payload } }) => {
    const mediaMap = extractor(doc)

    const updates = [...mediaMap.keys()].map(async (mediaId) => {
      try {
        await removeUsedInEntries(payload, mediaId, doc.id, collectionSlug)
      } catch (error) {
        payload.logger.error(`Failed to remove media usage for media ${mediaId}: ${error}`)
      }
    })

    await Promise.all(updates)
    return doc
  }
}

// --- Exported hooks ---

export const syncPageMediaUsage = createSyncMediaUsageHook('pages', extractPageMedia)
export const deletePageMediaUsage = createDeleteMediaUsageHook('pages', extractPageMedia)

export const syncPostMediaUsage = createSyncMediaUsageHook('posts', extractPostMedia)
export const deletePostMediaUsage = createDeleteMediaUsageHook('posts', extractPostMedia)

export const syncUserMediaUsage = createSyncMediaUsageHook('users', extractUserMedia)
export const deleteUserMediaUsage = createDeleteMediaUsageHook('users', extractUserMedia)
