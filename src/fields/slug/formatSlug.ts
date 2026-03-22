import type { FieldHook } from 'payload'

export const formatSlug = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

export const formatSlugHook =
  (fallback: string): FieldHook =>
  ({ originalDoc, value, req }) => {
    if (req?.locale && req.locale !== 'en' && originalDoc?.slug) {
      return originalDoc.slug
    }
    return value ? formatSlug(value) : originalDoc?.slug
  }
