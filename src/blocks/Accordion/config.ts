import type { Block } from 'payload'

import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

export const Accordion: Block = {
  slug: 'accordion',
  interfaceName: 'AccordionBlock',
  fields: [
    {
      name: 'changeBackground',
      type: 'checkbox',
    },
    {
      name: 'heading',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
          ]
        },
      }),
      label: false,
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
