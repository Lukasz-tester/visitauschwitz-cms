// 'use client'

// import { useState, useRef, useEffect, useId } from 'react'
// import dynamic from 'next/dynamic'
// import { ChevronDown, ChevronUp } from 'lucide-react'
// import { cn } from 'src/utilities/cn'
// import type { Page } from '@/payload-types'

// const LazyRichText = dynamic(() => import('@/components/RichText'), {
//   loading: () => <div>Loading content…</div>,
//   ssr: false,
// })

// type Props = Extract<Page['layout'][0], { blockType: 'accordion' }>

// export const AccordionBlock: React.FC<{ id?: string } & Props> = ({
//   accordionItems = [],
//   changeBackground = false,
//   addPaddingBottom = false,
//   blockName,
// }) => {
//   const [openIndices, setOpenIndices] = useState<number[]>([])

//   const handleItemClick = (index: number) => {
//     setOpenIndices((prev) =>
//       prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
//     )
//   }

//   const faqSchema = {
//     '@context': 'https://schema.org',
//     '@type': 'FAQPage',
//     mainEntity: accordionItems?.map((item) => ({
//       '@type': 'Question',
//       name: item.question ?? '',
//       acceptedAnswer: {
//         '@type': 'Answer',
//         text: (Array.isArray(item.answer) && item.answer[0]?.children?.[0]?.text) || '',
//       },
//     })),
//   }

//   return (
//     <section
//       className={cn('w-full m-0 mt-14 place-self-center', {
//         'bg-card-foreground mt-0': changeBackground,
//       })}
//     >
//       <div className="container" id={blockName || undefined}>
//         <div className={cn('md:px-[17.3%]', { 'pb-24': addPaddingBottom })}>
//           {accordionItems?.map((item, index) => (
//             <div key={index} className="pb-2">
//               <AccordionItem
//                 index={index}
//                 answer={item.answer}
//                 question={item.question ?? ''}
//                 isOpen={openIndices.includes(index)}
//                 onClick={() => handleItemClick(index)}
//                 changedBackground={!!changeBackground}
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       <script type="application/ld+json" suppressHydrationWarning>
//         {JSON.stringify(faqSchema)}
//       </script>
//     </section>
//   )
// }

// type ItemProps = {
//   index: number
//   question: string
//   answer: any
//   isOpen: boolean
//   onClick: () => void
//   changedBackground: boolean
// }

// const AccordionItem: React.FC<ItemProps> = ({
//   question,
//   answer,
//   isOpen,
//   onClick,
//   changedBackground,
// }) => {
//   const contentRef = useRef<HTMLDivElement>(null)
//   const [measuredHeight, setMeasuredHeight] = useState(0)
//   const id = useId()

//   useEffect(() => {
//     if (contentRef.current) {
//       setMeasuredHeight(contentRef.current.scrollHeight)
//     }
//   }, [isOpen])

//   return (
//     <article
//       className={cn(
//         '[&_*]:ease-in-out [&_*]:duration-700 overflow-hidden rounded-xl border hover:border-amber-600 dark:hover:border-amber-700/70',
//         isOpen ? 'border-amber-600 dark:border-amber-700/70' : 'border-slate-500/40',
//         changedBackground ? 'bg-background' : 'bg-card',
//       )}
//     >
//       <button
//         className={cn(
//           'bg-card-foreground w-full p-3 text-start text-xl opacity-85 flex place-content-between',
//           {
//             'bg-card': changedBackground,
//           },
//         )}
//         onClick={onClick}
//         id={`accordion-header-${id}`}
//       >
//         <h3 className="pr-2 text-left font-semibold">{question}</h3>
//         {isOpen ? <ChevronUp /> : <ChevronDown />}
//       </button>

//       <div
//         id={`accordion-content-${id}`}
//         ref={contentRef}
//         className="px-5 overflow-hidden transition-[max-height] duration-500 ease-in-out"
//         role="region"
//         style={{ maxHeight: isOpen ? measuredHeight : 0 }}
//       >
//         <div className="py-5">
//           <LazyRichText content={answer} enableGutter={false} />
//         </div>
//       </div>
//     </article>
//   )
// }

'use client'

import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from 'src/utilities/cn'
import type { Page } from '@/payload-types'
import { extractTextFromRichText, removeSpecialChars } from '@/utilities/helpersSsr'

const LazyRichText = dynamic(() => import('@/components/RichText'), {
  loading: () => <div>Loading content…</div>,
  ssr: true, // ✅ Enabled SSR for better SEO and crawlability
})

type Props = Extract<Page['layout'][0], { blockType: 'accordion' }> & {
  fullUrl?: string
}

export const AccordionBlock: React.FC<{ id?: string } & Props> = ({
  accordionItems = [],
  changeBackground = false,
  addPaddingBottom = false,
  blockName,
  fullUrl,
}) => {
  const [openIndices, setOpenIndices] = useState<number[]>([])

  const handleItemClick = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    )
  }

  const mainEntity = accordionItems?.map((item, index) => {
    const extractedAnswer = extractTextFromRichText(item.answer)
    const cleanAnswer = removeSpecialChars(extractedAnswer)
    const uniqueId = `accordion-item-${item.id}` // : `accordion-item-${index}`

    return {
      '@type': 'WebPageElement',
      name: removeSpecialChars(item.question ?? 'Untitled Item'),
      url: `${fullUrl}#${uniqueId}`, // Unique anchor URL
      description: cleanAnswer || 'No content available.',
    }
  })

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Auschwitz Tour Expert Tips',
    url: fullUrl,
    mainEntity: mainEntity,
  }

  // console.log('Generated contentSchema:', JSON.stringify(pageSchema, null, 2))

  return (
    <section
      className={cn('w-full m-0 mt-14 place-self-center', {
        'bg-card-foreground mt-0': changeBackground,
      })}
    >
      <div className="container" id={blockName || undefined}>
        <div className={cn('md:px-[17.3%]', { 'pb-24': addPaddingBottom })}>
          {accordionItems?.map((item, index) => {
            const uniqueId = `accordion-item-${item.id}` // : `accordion-item-${index}`
            return (
              <div key={index} className="pb-2">
                <AccordionItem
                  index={index}
                  uniqueId={uniqueId} // Pass uniqueId as a prop
                  answer={item.answer}
                  question={item.question ?? ''}
                  isOpen={openIndices.includes(index)}
                  onClick={() => handleItemClick(index)}
                  changedBackground={!!changeBackground}
                />
              </div>
            )
          })}
        </div>
      </div>

      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify(pageSchema)}
      </script>
    </section>
  )
}

type ItemProps = {
  index: number
  uniqueId: string
  question: string
  answer: any
  isOpen: boolean
  onClick: () => void
  changedBackground: boolean
}

const AccordionItem: React.FC<ItemProps> = ({
  question,
  answer,
  isOpen,
  onClick,
  changedBackground,
  uniqueId,
}) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [measuredHeight, setMeasuredHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current && isOpen) {
      setMeasuredHeight(contentRef.current.scrollHeight)
    }
  }, [isOpen])

  return (
    <article
      className={cn(
        '[&_*]:ease-in-out [&_*]:duration-700 overflow-hidden rounded-xl border hover:border-amber-600 dark:hover:border-amber-700/70',
        isOpen ? 'border-amber-600 dark:border-amber-700/70' : 'border-slate-500/40',
        changedBackground ? 'bg-background' : 'bg-card',
      )}
    >
      <button
        className={cn(
          'bg-card-foreground w-full p-3 text-start text-xl opacity-85 flex place-content-between',
          {
            'bg-card': changedBackground,
          },
        )}
        onClick={onClick}
        id={`${uniqueId}`} // Use uniqueId for the button ID
      >
        <h3 className="pr-2 text-left font-semibold">{question}</h3>
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </button>

      <div
        id={`content-${uniqueId}`} // Use uniqueId for the content ID
        ref={contentRef}
        className="px-5 overflow-hidden transition-[max-height] duration-500 ease-in-out"
        role="region"
        style={{
          maxHeight: isOpen ? measuredHeight : 0,
          transition: 'max-height 0.5s ease-in-out',
        }}
      >
        <div className="py-5">
          <LazyRichText content={answer} enableGutter={false} />
        </div>
      </div>
    </article>
  )
}
