import type { Metadata } from 'next/types'

// export const revalidate = 600

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'
import { Post } from '@/payload-types'
import { Search } from '@/search/Component'
import PageClient from './page.client'
import { getTranslations } from 'next-intl/server'
import { TypedLocale } from 'payload'
import Loading from './loading'

// type Args = {
//   searchParams: Promise<{
//     q: string
//   }>
//   params: Promise<{
//     locale: TypedLocale
//   }>
// }
export default async function Page({
  searchParams,
  params,
}: {
  searchParams: { q?: string }
  params: { locale: TypedLocale }
}) {
  const query = searchParams.q
  const locale = params.locale
  const payload = await getPayload({ config: configPromise })
  const t = await getTranslations()

  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    locale,
    ...(query
      ? {
          where: {
            or: [
              {
                title: {
                  like: query,
                },
              },
              {
                'meta.description': {
                  like: query,
                },
              },
              {
                'meta.title': {
                  like: query,
                },
              },
              {
                slug: {
                  like: query,
                },
              },
            ],
          },
        }
      : {}),
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1 className="sr-only">{t('search')}</h1>
          <Search />
        </div>
      </div>
      {/* <Suspense fallback={<Loading />}> */}
      {posts.totalDocs > 0 ? (
        <CollectionArchive posts={posts.docs as unknown as Post[]} />
      ) : (
        <div className="container">No results found.</div>
      )}
      {/* </Suspense> */}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Visiting Auschwitz - Search`,
  }
}
