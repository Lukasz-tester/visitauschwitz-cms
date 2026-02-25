import { PutObjectCommand } from '@aws-sdk/client-s3'
import type { CollectionAfterChangeHook } from 'payload'

import { r2Client, R2_BUCKET } from '../../../lib/r2Client'

export const syncMediaToR2: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create' && operation !== 'update') return doc

  const { mimeType, filename } = doc

  if (!filename || !req.file?.data) return doc

  try {
    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: filename,
        Body: req.file.data,
        ContentType: mimeType || 'application/octet-stream',
      }),
    )

    console.log(`R2 sync: uploaded ${filename}`)
  } catch (error) {
    console.error(`R2 sync: error uploading ${filename}`, error)
  }

  return doc
}
