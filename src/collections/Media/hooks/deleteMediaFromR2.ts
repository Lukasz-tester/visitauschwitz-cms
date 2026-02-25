import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import type { CollectionAfterDeleteHook } from 'payload'

import { r2Client, R2_BUCKET } from '../../../lib/r2Client'

export const deleteMediaFromR2: CollectionAfterDeleteHook = async ({ doc }) => {
  const { filename } = doc

  if (!filename) return doc

  const webpFilename = filename.replace(/\.[^.]+$/, '.webp')

  try {
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET,
        Key: webpFilename,
      }),
    )

    console.log(`R2 cleanup: deleted ${webpFilename}`)
  } catch (error) {
    console.error(`R2 cleanup: error deleting ${webpFilename}`, error)
  }

  return doc
}
