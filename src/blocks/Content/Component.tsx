// import React from 'react'
// import dynamic from 'next/dynamic'
// import { cn } from 'src/utilities/cn'
// import type { Page } from '@/payload-types'
// import RichText from '@/components/RichText'

// const ImageMedia = dynamic(() =>
//   import('@/components/Media/ImageMedia').then((mod) => mod.ImageMedia),
// )

// type Props = Extract<Page['layout'][0], { blockType: 'content' }>

// export const ContentBlock: React.FC<{ id?: string } & Props> = ({
//   columns,
//   heading,
//   changeBackground,
//   addMarginTop,
//   addMarginBottom,
//   addPaddingBottom,
//   blockName,
// }) => {
//   const colsSpanClasses = {
//     full: '12',
//     half: '6',
//     oneThird: '4',
//     twoThirds: '8',
//     oneSixth: '2',
//   }

//   return (
//     <section
//       id={blockName || undefined}
//       className={cn('pt-14', {
//         'bg-card-foreground': changeBackground,
//         'mt-14': addMarginTop,
//         'mb-14': addMarginBottom,
//         'pb-14': addPaddingBottom,
//         'pt-24': heading?.root.direction === null && columns && columns?.length > 3,
//       })}
//     >
//       <div className="container">
//         {heading && (
//           <RichText
//             className={cn('md:px-[17.3%] pt-10 ', {
//               'pb-14': heading.root.direction !== null && columns && columns.length > 0,
//               hidden: heading.root.direction === null,
//             })}
//             content={heading}
//             enableGutter={false}
//           />
//         )}

//         <div
//           className={cn(
//             'grid grid-cols-4 lg:grid-cols-12 gap-6 md:gap-14',
//             changeBackground ? 'pb-14' : 'mb-14',
//           )}
//         >
//           {columns?.map((col, index) => {
//             const { enableMedia, richText, richTextEnd, size, media } = col
//             const colSpan = colsSpanClasses[size!] || '4'

//             return (
//               <article
//                 key={col.id || index}
//                 className={cn(`col-span-4 lg:col-span-${colSpan}`, {
//                   'md:col-span-2': !['full', 'twoThirds', 'oneThird'].includes(size!),
//                   'col-span-4 md:col-span-2 lg:col-span-6 xl:col-span-4': size === 'oneThird',
//                   'hidden lg:block': size === 'oneSixth',
//                 })}
//               >
//                 {richText && (
//                   <RichText
//                     className={cn({
//                       'prose-a:bg-card': changeBackground,
//                       'mb-6': richText.root.direction !== null && enableMedia,
//                       'pb-1 md:pb-0': richText.root.direction !== null,
//                       hidden: richText.root.direction === null,
//                     })}
//                     content={richText}
//                     enableGutter={false}
//                     styleLink={true}
//                   />
//                 )}

//                 {enableMedia && <ImageMedia imgClassName="rounded" resource={media} />}

//                 {richTextEnd && (
//                   <RichText
//                     className={cn({
//                       'mt-4': enableMedia,
//                       hidden: richTextEnd.root.direction === null,
//                     })}
//                     content={richTextEnd}
//                     enableGutter={false}
//                   />
//                 )}
//               </article>
//             )
//           })}
//         </div>
//       </div>
//     </section>
//   )
// }
// BEFORE adding schema

import React from 'react'
import dynamic from 'next/dynamic'
import { cn } from 'src/utilities/cn'
import type { Page } from '@/payload-types'
import RichText from '@/components/RichText'
import { extractTextFromRichText } from '@/utilities/helpersSsr'

const ImageMedia = dynamic(() =>
  import('@/components/Media/ImageMedia').then((mod) => mod.ImageMedia),
)

type Props = Extract<Page['layout'][0], { blockType: 'content' }> & {
  fullUrl: string // Already passed URL as a prop
}

export const ContentBlock: React.FC<{ id?: string } & Props> = ({
  columns,
  heading,
  changeBackground,
  addMarginTop,
  addMarginBottom,
  addPaddingBottom,
  blockName,
  fullUrl,
}) => {
  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
    oneSixth: '2',
  }

  const mainEntity: {
    '@type': string
    name: string
    url: string
    description: string
  }[] = []

  // 📝 Add Heading to Schema if it exists and is not empty
  if (heading && heading.root.direction !== null) {
    const headingText = extractTextFromRichText(heading)
    if (headingText.trim() !== '') {
      mainEntity.push({
        '@type': 'WebPageElement',
        name: headingText,
        url: `${fullUrl}#${blockName}`,
        description: headingText,
      })
    }
  }

  // 📝 Add Columns to Schema if they are not empty and not "oneSixth"
  columns?.forEach((col, index) => {
    if (col.size !== 'oneSixth' && col?.richText?.root.direction !== null) {
      const uniqueId = `${col.id}`
      const extractedText = extractTextFromRichText(col.richText)
      const cleanText = extractedText.trim() !== '' ? extractedText : 'No content available.'

      mainEntity.push({
        '@type': 'WebPageElement',
        name: `Content Item ${index + 1}`,
        url: `${fullUrl}#${uniqueId}`,
        description: cleanText,
      })
    }
  })

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Auschwitz Tour Expert Guide',
    url: fullUrl,
    mainEntity: mainEntity,
  }

  // console.log('Generated contentSchema:', JSON.stringify(pageSchema, null, 2))

  return (
    <section
      id={blockName || undefined}
      className={cn('pt-14', {
        'bg-card-foreground': changeBackground,
        'mt-14': addMarginTop,
        'mb-14': addMarginBottom,
        'pb-14': addPaddingBottom,
        'pt-24': heading?.root.direction === null && columns && columns?.length > 3,
      })}
    >
      <div className="container">
        {heading && (
          <RichText
            className={cn('md:px-[17.3%] pt-10 ', {
              'pb-14': heading.root.direction !== null && columns && columns.length > 0,
              hidden: heading.root.direction === null,
            })}
            content={heading}
            enableGutter={false}
          />
        )}

        <div
          className={cn(
            'grid grid-cols-4 lg:grid-cols-12 gap-6 md:gap-14',
            changeBackground ? 'pb-14' : 'mb-14',
          )}
        >
          {columns?.map((col, index) => {
            const { enableMedia, richText, richTextEnd, size, media } = col
            const colSpan = colsSpanClasses[size!] || '4'

            return (
              <article
                id={col.id || undefined}
                key={col.id || index}
                className={cn(`col-span-4 lg:col-span-${colSpan}`, {
                  'md:col-span-2': !['full', 'twoThirds', 'oneThird'].includes(size!),
                  'col-span-4 md:col-span-2 lg:col-span-6 xl:col-span-4': size === 'oneThird',
                  'hidden lg:block': size === 'oneSixth',
                })}
              >
                {richText && (
                  <RichText
                    className={cn({
                      'prose-a:bg-card': changeBackground,
                      'mb-6': richText.root.direction !== null && enableMedia,
                      'pb-1 md:pb-0': richText.root.direction !== null,
                      hidden: richText.root.direction === null,
                    })}
                    content={richText}
                    enableGutter={false}
                    styleLink={true}
                  />
                )}
                {enableMedia && (
                  <ImageMedia loading="lazy" imgClassName="rounded" resource={media} />
                )}
                {richTextEnd && (
                  <RichText
                    className={cn({
                      'mt-4': enableMedia,
                      hidden: richTextEnd.root.direction === null,
                    })}
                    content={richTextEnd}
                    enableGutter={false}
                  />
                )}
              </article>
            )
          })}
        </div>
      </div>

      <script type="application/ld+json">{JSON.stringify(pageSchema)}</script>
    </section>
  )
}
