import type { Block } from 'payload'

import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

export const Accordion: Block = {
  slug: 'accordion',
  interfaceName: 'AccordionBlock',
  fields: [
    {
      name: 'isFAQ',
      type: 'checkbox',
    },
    {
      name: 'changeBackground',
      type: 'checkbox',
    },
    {
      name: 'addPaddingBottom',
      type: 'checkbox',
    },
    {
      name: 'accordionItems',
      type: 'array',
      fields: [
        {
          name: 'question',
          type: 'text',
          localized: true,
          label: 'Question',
        },
        {
          name: 'answer',
          type: 'richText',
          localized: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h4'] }),
                FixedToolbarFeature(),
              ]
            },
          }),
          label: 'Answer',
        },
      ],
    },
  ],
}
