'use client'

import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from 'src/utilities/cn'
import type { Page } from '@/payload-types'
import { extractTextFromRichText, removeSpecialChars } from '@/utilities/helpersSsr'

const LazyRichText = dynamic(() => import('@/components/RichText'), {
  loading: () => <div>Loading content…</div>,
  ssr: true,
})

type FAQItem = {
  '@type': 'Question'
  name: string
  acceptedAnswer: {
    '@type': 'Answer'
    text: string
  }
}

type Props = Extract<Page['layout'][0], { blockType: 'accordion' }> & {
  fullUrl?: string
  collectFAQSchema?: boolean
  setFAQItems?: (items: FAQItem[]) => void
}

export const AccordionBlock: React.FC<{ id?: string } & Props> = ({
  accordionItems = [],
  isFAQ = false,
  changeBackground = false,
  addPaddingBottom = false,
  blockName,
  fullUrl,
  collectFAQSchema = false,
  setFAQItems,
}) => {
  const [openIndices, setOpenIndices] = useState<number[]>([])

  const handleItemClick = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    )
  }

  // ✅ Collect FAQ schema data upward if needed
  useEffect(() => {
    if (isFAQ && collectFAQSchema && setFAQItems && accordionItems) {
      const faqItems: FAQItem[] = accordionItems.map((item) => ({
        '@type': 'Question',
        name: item.question ?? 'Untitled Question',
        acceptedAnswer: {
          '@type': 'Answer',
          text: removeSpecialChars(extractTextFromRichText(item.answer)),
        },
      }))
      setFAQItems(faqItems)
    }
  }, [isFAQ, collectFAQSchema, setFAQItems, accordionItems])

  // ✅ Build schema for non-FAQ sections
  const nonFAQSchema =
    !isFAQ && fullUrl
      ? {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: blockName || 'Accordion Section',
          url: fullUrl,
          mainEntity: accordionItems?.map((item) => ({
            '@type': 'WebPageElement',
            headline: removeSpecialChars(item.question ?? 'Untitled Item'),
            url: `${fullUrl}#accordion-item-${item.id}`,
            description: removeSpecialChars(extractTextFromRichText(item.answer)),
          })),
        }
      : null

  return (
    <section
      className={cn('w-full m-0 mt-14 place-self-center', {
        'bg-card-foreground mt-0': changeBackground,
      })}
    >
      <div className="container" id={blockName || undefined}>
        <div className={cn('md:px-[17.3%]', { 'pb-24': addPaddingBottom })}>
          {accordionItems?.map((item, index) => {
            const uniqueId = `accordion-item-${item.id}`
            return (
              <div key={index} className="pb-2">
                <AccordionItem
                  index={index}
                  uniqueId={uniqueId}
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

      {/* ✅ Only inject schema when NOT FAQ */}
      {!isFAQ && nonFAQSchema && (
        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify(nonFAQSchema)}
        </script>
      )}
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
        id={uniqueId}
      >
        <h3 className="pr-2 text-left font-semibold">{question}</h3>
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </button>

      <div
        id={`content-${uniqueId}`}
        ref={contentRef}
        className="px-5 overflow-hidden transition-[max-height] duration-500 ease-in-out"
        role="region"
        style={{
          maxHeight: isOpen ? measuredHeight : 0,
          transition: 'max-height 0.5s ease-in-out',
        }}
      >
        <div className="py-2 mb-4">
          <LazyRichText content={answer} enableGutter={false} />
        </div>
      </div>
    </article>
  )
}
