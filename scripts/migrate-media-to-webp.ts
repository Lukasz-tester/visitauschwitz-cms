import { MongoClient } from 'mongodb'

const DATABASE_URI =
  'mongodb+srv://visitauschwitzinfo:mmmooongo@museum-cluster.u0kan.mongodb.net/?retryWrites=true&w=majority&appName=museum-cluster'

async function migrate() {
  const client = new MongoClient(DATABASE_URI)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db()
    const media = db.collection('media')

    // Find media docs with non-webp image extensions (skip .png ebook)
    const allNonWebp = await media
      .find({
        filename: { $regex: /\.(jpg|jpeg|gif|tiff|bmp|avif)$/i },
      })
      .toArray()

    console.log(`Found ${allNonWebp.length} media documents to migrate`)

    let updated = 0

    for (const doc of allNonWebp) {
      const oldFilename = doc.filename as string
      const newFilename = oldFilename.replace(/\.(jpg|jpeg|png|gif|tiff|bmp|avif)$/i, '.webp')

      const updateFields: Record<string, string> = {
        filename: newFilename,
        mimeType: 'image/webp',
      }

      // Update url if present
      if (doc.url) {
        updateFields.url = (doc.url as string).replace(oldFilename, newFilename)
      }

      // Update thumbnailURL if present
      if (doc.thumbnailURL) {
        updateFields.thumbnailURL = (doc.thumbnailURL as string).replace(
          oldFilename,
          newFilename,
        )
      }

      const result = await media.updateOne({ _id: doc._id }, { $set: updateFields })

      if (result.modifiedCount > 0) {
        updated++
        console.log(`  ${oldFilename} → ${newFilename}`)
      }
    }

    console.log(`\nMigration complete: ${updated}/${allNonWebp.length} documents updated`)
  } catch (err) {
    console.error('Migration failed:', err)
    process.exit(1)
  } finally {
    await client.close()
    console.log('Disconnected from MongoDB')
  }
}

migrate()
