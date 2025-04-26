import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Page as PageType } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { TypedLocale } from 'payload'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
  })

  const locales = ['en', 'pl', 'de', 'fr', 'es', 'it', 'nl', 'ru', 'uk']

  const params = locales.flatMap((locale) =>
    pages.docs
      .filter((doc) => doc.slug !== 'home')
      .map(({ slug }) => ({
        slug,
        locale,
      })),
  )

  return params
}

type Args = {
  params: Promise<{
    slug?: string
    locale: TypedLocale
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = 'home', locale = 'en' } = await paramsPromise
  const url = '/' + slug

  let page: PageType | null

  page = await queryPage({
    slug,
    locale,
  })
  if (!page) {
    return <PayloadRedirects url={url} />
  } else {
    // If page is found, render the content and trigger the second redirect if needed
    const { hero, layout } = page

    return (
      <article className="pt-16 pb-24">
        <PageClient />
        {/* This second PayloadRedirects will only be triggered if the page exists */}
        <PayloadRedirects disableNotFound url={url} />
        <RenderHero {...hero} />
        <RenderBlocks blocks={layout} locale={locale} />
      </article>
    )
  }
}

export async function generateMetadata({ params: paramsPromise }): Promise<Metadata> {
  const { slug = 'home', locale = 'en' } = await paramsPromise
  const page = await queryPage({
    slug,
    locale,
  })

  return generateMeta({ doc: page, locale })
}

const queryPage = cache(async ({ slug, locale }: { slug: string; locale: TypedLocale }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    locale,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

// NEW IDEAS... not working :)
// import { notFound, redirect } from 'next/navigation'
// import { getCachedRedirects } from '@/utilities/getRedirects'
// import { getCachedDocument } from '@/utilities/getDocument'
// // import type { Page, Post } from '@/payload-types'
// import configPromise from '@payload-config'
// import { RenderHero } from '@/heros/RenderHero'
// import PageClient from './page.client'
// import { RenderBlocks } from '@/blocks/RenderBlocks'
// import { draftMode } from 'next/headers'
// import { cache } from 'react'
// import { getPayload, TypedLocale } from 'payload'
// import type { Page as PageType, Post } from '@/payload-types'

// type Args = {
//   params: Promise<{
//     slug?: string
//     locale: TypedLocale
//   }>
// }

// const queryPage = cache(
//   async ({ slug, locale }: { slug: string; locale: TypedLocale }): Promise<PageType | null> => {
//     const { isEnabled: draft } = await draftMode()

//     const payload = await getPayload({ config: configPromise })

//     const result = await payload.find({
//       collection: 'pages',
//       draft,
//       limit: 1,
//       locale,
//       overrideAccess: draft,
//       where: {
//         slug: {
//           equals: slug,
//         },
//       },
//     })

//     return result.docs?.[0] || null
//   },
// )

// export default async function Page({ params: paramsPromise }: Args) {
//   const { slug = 'home', locale = 'en' } = await paramsPromise
//   const url = '/' + slug

//   const page = await queryPage({ slug, locale })

//   if (!page) {
//     // 👇 handle redirects manually here
//     const redirects = await getCachedRedirects()()
//     const redirectItem = redirects.find((redirect) => redirect.from === url)

//     if (redirectItem) {
//       if (redirectItem.to?.url) {
//         redirect(redirectItem.to.url)
//       }

//       let redirectUrl: string | null = null

//       if (typeof redirectItem.to?.reference?.value === 'string') {
//         const collection = redirectItem.to?.reference?.relationTo
//         const id = redirectItem.to?.reference?.value
//         const document = (await getCachedDocument(collection, id)()) as Page | Post

//         redirectUrl = `${collection !== 'pages' ? `/${collection}` : ''}/${document?.slug}`
//       } else if (typeof redirectItem.to?.reference?.value === 'object') {
//         const collection = redirectItem.to?.reference?.relationTo
//         const slug = redirectItem.to?.reference?.value?.slug
//         redirectUrl = `${collection !== 'pages' ? `/${collection}` : ''}/${slug}`
//       }

//       if (redirectUrl) {
//         redirect(redirectUrl)
//       }
//     }

//     // 👇 fallback to 404
//     notFound()
//   }

//   const { hero, layout } = page

//   return (
//     <article className="pt-16 pb-24">
//       <PageClient />
//       <RenderHero {...hero} />
//       <RenderBlocks blocks={layout} locale={locale} />
//     </article>
//   )
// }
