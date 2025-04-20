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

  const slug = Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/'
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://muzeums.vercel.app'
  console.log('Base URL:', process.env.NEXT_PUBLIC_SERVER_URL)
  const canonicalUrl = `${baseUrl}/${locale}${slug}`

  const locales = ['en', 'pl', 'de', 'fr', 'es', 'it', 'nl', 'ru', 'ua'] as const

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
      canonical: canonicalUrl,
      languages: Object.fromEntries(locales.map((lng) => [lng, `${baseUrl}/${lng}${slug}`])),
    },
  }
}

// import type { Metadata } from 'next'

// import type { Page, Post } from '../payload-types'

// import { mergeOpenGraph } from './mergeOpenGraph'

// export const generateMeta = async (args: { doc: Page | Post }): Promise<Metadata> => {
//   const { doc } = args || {}

//   const ogImage =
//     typeof doc?.meta?.image === 'object' &&
//     doc.meta.image !== null &&
//     'url' in doc.meta.image &&
//     `${process.env.NEXT_PUBLIC_SERVER_URL}${doc.meta.image.url}`

//   const date = new Date()
//   const title = doc?.meta?.title
//     ? `${doc.meta.title} | ${date.getFullYear()}`
//     : `Auschwitz Visitor Information | ${date.getFullYear()}`

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
//       url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
//     }),
//     title,
//   }
// }
