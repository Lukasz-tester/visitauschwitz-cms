import type { Block, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  OrderedListFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'oneThird',
    options: [
      {
        label: 'One Half',
        value: 'oneHalf',
      },
      {
        label: 'One Third',
        value: 'oneThird',
      },
      {
        label: 'One Sixth',
        value: 'oneSixth',
      },
    ],
  },
  {
    name: 'enableMedia',
    type: 'checkbox',
    label: 'Show donation image on top',
  },
  {
    name: 'mediaCaption',
    type: 'text',
    localized: true,
    admin: {
      condition: (_, { enableMedia }) => Boolean(enableMedia),
      description: 'Caption shown below the donation image (per column).',
    },
  },
  {
    name: 'richText',
    type: 'richText',
    localized: true,
    editor: lexicalEditor({
      features: ({ rootFeatures }) => {
        return [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          UnorderedListFeature(),
          OrderedListFeature(),
        ]
      },
    }),
    label: false,
  },
  {
    name: 'enableButtons',
    type: 'checkbox',
    label: 'Show donation buttons (locale-driven: PL = BLIK + Card, others = Card + PayPal)',
  },
]

export const DonationTrigger: Block = {
  slug: 'donationTrigger',
  interfaceName: 'DonationTriggerBlock',
  fields: [
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
            InlineToolbarFeature(),
            UnorderedListFeature(),
            OrderedListFeature(),
          ]
        },
      }),
      label: false,
    },
    {
      name: 'columns',
      type: 'array',
      fields: columnFields,
    },
    {
      name: 'changeBackground',
      type: 'checkbox',
    },
    {
      name: 'addMarginTop',
      type: 'checkbox',
    },
    {
      name: 'addMarginBottom',
      type: 'checkbox',
    },
  ],
}
