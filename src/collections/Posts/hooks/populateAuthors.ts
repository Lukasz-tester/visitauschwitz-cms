import type { CollectionAfterReadHook } from 'payload'
import { User } from 'src/payload-types'

// const DEFAULT_AUTHOR_ID = '675f51ab4d074485ad8b59af' // Replace with an actual user ID

// export const populateAuthors: CollectionAfterReadHook = async ({ doc, req, req: { payload } }) => {
//   if (doc?.authors) {
//     const authorDocs: User[] = []
//     for (const author of doc.authors) {
//       try {
//         const authorDoc = await payload.findByID({
//           id: typeof author === 'object' ? author?.id : author,
//           collection: 'users',
//           depth: 0,
//           req,
//         })

//         if (authorDoc) {
//           authorDocs.push(authorDoc)
//         }
//       } catch (error) {
//         console.warn(`Author not found: ${author}. Using default author.`)
//         const defaultAuthor = await payload.findByID({
//           id: DEFAULT_AUTHOR_ID,
//           collection: 'users',
//           depth: 0,
//           req,
//         })
//         if (defaultAuthor) {
//           authorDocs.push(defaultAuthor)
//         }
//       }
//     }

//     doc.populatedAuthors = authorDocs.map((authorDoc) => ({
//       id: authorDoc.id,
//       name: authorDoc.name,
//     }))
//   }

//   return doc
// }

// The `user` collection has access control locked so that users are not publicly accessible
// This means that we need to populate the authors manually here to protect user privacy
// GraphQL will not return mutated user data that differs from the underlying schema
// So we use an alternative `populatedAuthors` field to populate the user data, hidden from the admin UI
export const populateAuthors: CollectionAfterReadHook = async ({ doc, req, req: { payload } }) => {
  if (doc?.authors) {
    const authorDocs: User[] = []
    for (const author of doc.authors) {
      const authorDoc = await payload.findByID({
        id: typeof author === 'object' ? author?.id : author,
        collection: 'users',
        depth: 0,
        req,
      })

      authorDocs.push(authorDoc)
    }

    doc.populatedAuthors = authorDocs.map((authorDoc) => ({
      id: authorDoc.id,
      name: authorDoc.name,
    }))
  }

  return doc
}
