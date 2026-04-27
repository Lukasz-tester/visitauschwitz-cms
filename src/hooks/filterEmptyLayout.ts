import type { CollectionBeforeReadHook } from 'payload'
import { filterLayout } from '../utilities/filterEmptyContent'

export const filterEmptyLayout: CollectionBeforeReadHook = ({ doc, req }) => {
  // Skip filtering for admin users (they need to see all content including spacer columns)
  if (req.user) {
    return doc
  }

  // Filter the layout array to remove empty content
  if (doc?.layout) {
    doc.layout = filterLayout(doc.layout)
  }

  return doc
}
