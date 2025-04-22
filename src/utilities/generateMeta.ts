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

  console.log('slug is now:', doc?.slug)

  const rawSlug = Array.isArray(doc?.slug) ? doc?.slug.join('/') : doc?.slug
  // console.log('slug is now:', slug)
  const slug = rawSlug === 'home' ? '' : rawSlug

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://muzeums.vercel.app'

  const locales = ['en', 'pl', 'de', 'fr', 'es', 'it', 'nl', 'ru', 'uk'] as const

  // Canonical URL should match current locale (self-canonical)
  const canonicalUrl = `${baseUrl}/${locale}/${slug}`
    .replace(/([^:]\/)\/+/g, '$1')
    .replace(/\/$/, '')

  // Hreflang alternates for all supported languages
  const languages = Object.fromEntries(
    locales.map((lng) => [
      lng,
      `${baseUrl}/${lng}/${slug}`.replace(/([^:]\/)\/+/g, '$1').replace(/\/$/, ''),
    ]),
  )

  // x-default points to your default language (EN)
  const xDefaultUrl = `${baseUrl}/en/${slug}`.replace(/([^:]\/)\/+/g, '$1').replace(/\/$/, '')
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
