import { Metadata } from 'next'
import { mergeOpenGraph } from './mergeOpenGraph'
import type { Page, Post } from '../payload-types'

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.visitauschwitz.info'
const locales = ['en', 'pl'] as const
// TODO - add locales when translated!
// const locales = ['en', 'pl', 'de', 'fr', 'es', 'it', 'nl', 'ru', 'uk']

// Helper to match sitemap-style slug formatting
const getSafeSlug = (doc: Page | Post): string => {
  const rawSlug = Array.isArray(doc?.slug) ? doc.slug.join('/') : doc?.slug
  if (!rawSlug || rawSlug === 'home') return ''
  const isPost = 'layout' in doc === false // or any reliable post-only field check
  return isPost ? `posts/${rawSlug}` : rawSlug
}

export const generateMeta = async ({
  doc,
  locale,
}: {
  doc: Page | Post
  locale: string
}): Promise<Metadata> => {
  const date = new Date()

  const title = doc?.meta?.title
    ? `${doc.meta.title} | ${date.getFullYear()}`
    : `Auschwitz Visitor Information | ${date.getFullYear()}`

  const safeSlug = getSafeSlug(doc)

  const formatUrl = (lng: string) =>
    `${baseUrl}/${lng}/${safeSlug}`.replace(/([^:]\/)\/+/g, '$1').replace(/\/$/, '')

  const canonicalUrl = formatUrl(locale)

  const ogImage =
    typeof doc?.meta?.image === 'object' &&
    doc.meta.image !== null &&
    'url' in doc.meta.image &&
    `${baseUrl}${doc.meta.image.url}`

  const languages = Object.fromEntries(locales.map((lng) => [lng, formatUrl(lng)]))
  languages['x-default'] = formatUrl('en')

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage ? [{ url: ogImage }] : undefined,
      title,
      url: canonicalUrl,
    }),
    title,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
  }
}

//BEFORE below, new above is with logic from the sitemap
// import { Metadata } from 'next'
// import { mergeOpenGraph } from './mergeOpenGraph'
// import type { Page, Post } from '../payload-types'

// export const generateMeta = async (args: {
//   doc: Page | Post
//   locale: string
// }): Promise<Metadata> => {
//   const { doc, locale } = args || {}

//   const ogImage =
//     typeof doc?.meta?.image === 'object' &&
//     doc.meta.image !== null &&
//     'url' in doc.meta.image &&
//     `${process.env.NEXT_PUBLIC_SERVER_URL}${doc.meta.image.url}`

//   const date = new Date()
//   const title = doc?.meta?.title
//     ? `${doc.meta.title} | ${date.getFullYear()}`
//     : `Auschwitz Visitor Information | ${date.getFullYear()}`

//   const rawSlug = Array.isArray(doc?.slug) ? doc?.slug.join('/') : doc?.slug
//   const slug = rawSlug === 'home' ? '' : rawSlug

//   const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://visitauschwitz.info'

//   const locales = ['en', 'pl', 'de', 'fr', 'es', 'it', 'nl', 'ru', 'uk'] as const

//   // Canonical URL should match current locale (self-canonical)
//   const canonicalUrl = `${baseUrl}/${locale}/${slug}`
//     .replace(/([^:]\/)\/+/g, '$1')
//     .replace(/\/$/, '')

//   // Hreflang alternates for all supported languages
//   const languages = Object.fromEntries(
//     locales.map((lng) => [
//       lng,
//       `${baseUrl}/${lng}/${slug}`.replace(/([^:]\/)\/+/g, '$1').replace(/\/$/, ''),
//     ]),
//   )

//   // x-default points to your default language (EN)
//   const xDefaultUrl = `${baseUrl}/en/${slug}`.replace(/([^:]\/)\/+/g, '$1').replace(/\/$/, '')
//   languages['x-default'] = xDefaultUrl

//   return {
//     description: doc?.meta?.description,
//     openGraph: mergeOpenGraph({
//       description: doc?.meta?.description || '',
//       images: ogImage
//         ? [
//             {
//               url: ogImage,
//             },
//           ]
//         : undefined,
//       title,
//       url: canonicalUrl,
//     }),
//     title,
//     alternates: {
//       canonical: canonicalUrl, // self-referencing canonical
//       languages, // includes all languages incl. 'en'
//     },
//   }
// }
