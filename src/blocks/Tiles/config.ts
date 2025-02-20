import type { Block, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { media } from '@/fields/media'

const tileFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'oneThird',
    options: [
      {
        label: 'Half',
        value: 'half',
      },
      {
        label: 'One Third',
        value: 'oneThird',
      },
      {
        label: 'One Forth',
        value: 'oneForth',
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
  },
  media({
    overrides: {
      admin: {
        condition: (_, { enableMedia }) => Boolean(enableMedia),
      },
    },
  }),
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
        ]
      },
    }),
    label: false,
  },
  {
    name: 'linkTo',
    type: 'text',
  },
]

export const Tiles: Block = {
  slug: 'tiles',
  interfaceName: 'tilesBlock',
  fields: [
    {
      name: 'tiles',
      type: 'array',
      fields: tileFields,
    },
    {
      name: 'changeBackground',
      type: 'checkbox',
    },
  ],
  labels: {
    plural: 'Tiles',
    singular: 'Tiles',
  },
}
