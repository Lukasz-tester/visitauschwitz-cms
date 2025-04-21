import { Metadata } from 'next'
import { mergeOpenGraph } from './mergeOpenGraph'
import type { Page, Post } from '../payload-types'

export const generateMeta = async (args: {
  doc: Page | Post
  locale: string
}): Promise<Metadata> => {
  const { doc, locale } = args || {}

  const ogImage =
    typeof doc?.meta?.image === 'object' &&
    doc.meta.image !== null &&
    'url' in doc.meta.image &&
    `${process.env.NEXT_PUBLIC_SERVER_URL}${doc.meta.image.url}`

  const date = new Date()
  const title = doc?.meta?.title
    ? `${doc.meta.title} | ${date.getFullYear()}`
    : `Auschwitz Visitor Information | ${date.getFullYear()}`

  const slug = Array.isArray(doc?.slug) ? doc?.slug.join('/') : doc?.slug
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://muzeums.vercel.app'

  const locales = ['en', 'pl', 'de', 'fr', 'es', 'it', 'nl', 'ru', 'uk'] as const

  // Canonical URL should match current locale (self-canonical)
  const canonicalUrl = `${baseUrl}/${locale}/${slug}`.replace(/([^:]\/)\/+/g, '$1')

  // Hreflang alternates for all supported languages
  const languages = Object.fromEntries(locales.map((lng) => [lng, `${baseUrl}/${lng}/${slug}`]))

  // Add x-default pointing to your default language (EN)
  const xDefaultUrl = `${baseUrl}/en/${slug}`.replace(/([^:]\/)\/+/g, '$1')
  languages['x-default'] = xDefaultUrl

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: canonicalUrl,
    }),
    title,
    alternates: {
      canonical: canonicalUrl, // self-referencing canonical
      languages, // includes all languages incl. 'en'
    },
  }
}

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

//   const slug = Array.isArray(doc?.slug) ? doc?.slug.join('/') : doc?.slug
//   const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://muzeums.vercel.app'
//   const canonicalUrl = `${baseUrl}/en/${slug}`.replace(/([^:]\/)\/+/g, '$1')
//   const locales = ['pl', 'de', 'fr', 'es', 'it', 'nl', 'ru', 'uk'] as const

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
//       canonical: canonicalUrl,
//       languages: Object.fromEntries(locales.map((lng) => [lng, `${baseUrl}/${lng}/${slug}`])),
//     },
//   }
// }
