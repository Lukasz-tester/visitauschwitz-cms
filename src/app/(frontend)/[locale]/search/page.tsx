// import type { Metadata } from 'next/types'

// // export const revalidate = 600

// import { CollectionArchive } from '@/components/CollectionArchive'
// import configPromise from '@payload-config'
// import { getPayload } from 'payload'
// import React, { Suspense } from 'react'
// import { Post } from '@/payload-types'
// import { Search } from '@/search/Component'
// import PageClient from './page.client'
// import { getTranslations } from 'next-intl/server'
import { TypedLocale } from 'payload'
// import Loading from './loading'

type Args = {
  searchParams: Promise<{
    q: string
  }>
  params: Promise<{
    locale: TypedLocale
  }>
}
// export default async function Page({
//   searchParams: searchParamsPromise,
//   params: paramsPromise,
// }: Args) {
//   const { q: query } = await searchParamsPromise
//   const { locale } = await paramsPromise
//   const payload = await getPayload({ config: configPromise })
//   const t = await getTranslations()

//   const posts = await payload.find({
//     collection: 'search',
//     depth: 1,
//     limit: 12,
//     locale,
//     ...(query
//       ? {
//           where: {
//             or: [
//               {
//                 title: {
//                   like: query,
//                 },
//               },
//               {
//                 'meta.description': {
//                   like: query,
//                 },
//               },
//               {
//                 'meta.title': {
//                   like: query,
//                 },
//               },
//               {
//                 slug: {
//                   like: query,
//                 },
//               },
//             ],
//           },
//         }
//       : {}),
//   })

//   return (
//     <div className="pt-24 pb-24">
//       <PageClient />
//       <div className="container mb-16">
//         <div className="prose dark:prose-invert max-w-none">
//           <h1 className="sr-only">{t('search')}</h1>
//           <Search />
//         </div>
//       </div>
//       {/*
//       {posts.totalDocs > 0 ? (
//         <CollectionArchive posts={posts.docs as unknown as Post[]} />
//       ) : (
//         <div className="container">No results found.</div>
//       )} */}
//       {/* Wrapping CollectionArchive component with Suspense */}
//       <Suspense fallback={<Loading />}>
//         {posts.totalDocs > 0 ? (
//           <CollectionArchive posts={posts.docs as unknown as Post[]} />
//         ) : (
//           <div className="container">No results found.</div>
//         )}
//       </Suspense>
//     </div>
//   )
// }

// export function generateMetadata(): Metadata {
//   return {
//     title: `Visiting Auschwitz - Search`,
//   }
// }

import type { Metadata } from 'next/types'

export default async function Page({
  searchParams: searchParamsPromise,
  params: paramsPromise,
}: Args) {
  // For debugging, let's use hardcoded values
  const query = 'search term' // Replace with a hardcoded query for testing
  const locale = 'en' // Replace with a hardcoded locale for testing

  // Remove Payload API calls for now
  const posts = [
    { title: 'Post 1', slug: 'post-1' }, // Sample static data
    { title: 'Post 2', slug: 'post-2' }, // Sample static data
  ]

  return (
    <div className="pt-24 pb-24">
      {/* Temporarily remove other components for simplicity */}
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Search Results</h1>
          <p>Displaying search results for: {query}</p>
        </div>
      </div>

      {/* Simplify rendering of posts */}
      <div className="container">
        {posts.length > 0 ? (
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>{post.title}</li>
            ))}
          </ul>
        ) : (
          <div>No results found.</div>
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Visiting Auschwitz - Search`,
  }
}
