import React, { Fragment } from 'react'
import type { Page } from '@/payload-types'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component.client'
import { TypedLocale } from 'payload'
import { OpeningHoursBlock } from './OpeningHours/Component.client'
import { AccordionBlock } from './Accordion/Component.client'
import { extractTextFromRichText, removeSpecialChars } from '@/utilities/helpersSsr'

type FAQItem = {
  '@type': 'Question'
  name: string
  acceptedAnswer: {
    '@type': 'Answer'
    text: string
  }
}

const blockComponents: Record<string, React.FC<{ locale: TypedLocale } & any>> = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  oh: OpeningHoursBlock,
  accordion: AccordionBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
  locale: TypedLocale
  url: string
}> = ({ blocks, locale, url }) => {
  if (!blocks || blocks.length === 0) return null

  // ✅ Collect all FAQ items directly from blocks
  const faqItems: FAQItem[] = blocks
    .filter((block) => block.blockType === 'accordion' && (block as any).isFAQ)
    .flatMap(
      (block) =>
        (block as any).accordionItems?.map((item: any) => ({
          '@type': 'Question',
          name: item.question ?? 'Untitled Question',
          acceptedAnswer: {
            '@type': 'Answer',
            text: removeSpecialChars(extractTextFromRichText(item.answer)),
          },
        })) ?? [],
    )

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const { blockType } = block

        if (blockType && blockType in blockComponents) {
          const Block = blockComponents[blockType]
          return (
            <div key={index}>
              <Block {...block} locale={locale} fullUrl={url} />
            </div>
          )
        }
        return null
      })}

      {/* ✅ Inject FAQPage schema once */}
      {faqItems.length > 0 && (
        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems,
          })}
        </script>
      )}
    </Fragment>
  )
}
