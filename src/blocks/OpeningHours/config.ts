import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const OpeningHours: Block = {
  slug: 'oh',
  interfaceName: 'OpeningHoursBlock',
  fields: [
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    {
      name: 'enterBetweenTitle',
      type: 'text',
      localized: true,
      label: 'You can enter between',
    },
    {
      name: 'freeFromTitle',
      type: 'text',
      localized: true,
      label: 'Without a guide only after',
    },
    {
      name: 'leaveBeforeTitle',
      type: 'text',
      localized: true,
      label: 'Leave the Museum before',
    },
    {
      name: 'months',
      type: 'array',
      fields: [
        {
          name: 'month',
          required: true,
          type: 'text',
          localized: true,
          label: 'Month',
        },
        {
          name: 'enterBetween',
          type: 'text',
          localized: true,
          label: 'Enter Between',
        },
        {
          name: 'freeFrom',
          type: 'text',
          localized: true,
          label: 'Free entry from',
        },
        {
          name: 'leaveBefore',
          type: 'text',
          localized: true,
          label: 'Leave Before',
        },
      ],
    },
  ],
  labels: {
    plural: 'Opening Hours',
    singular: 'Opening Hours',
  },
}
