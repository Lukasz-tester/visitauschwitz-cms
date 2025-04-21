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
  const canonicalUrl = `${baseUrl}/en/${slug}`.replace(/([^:]\/)\/+/g, '$1')
  const locales = ['pl', 'de', 'fr', 'es', 'it', 'nl', 'ru', 'uk'] as const

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
      languages: Object.fromEntries(locales.map((lng) => [lng, `${baseUrl}/${lng}/${slug}`])),
    },
  }
}
