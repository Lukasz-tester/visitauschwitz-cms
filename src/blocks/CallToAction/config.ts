import type { Block, Field } from 'payload'
import { media } from '@/fields/media'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

const tileFields: Field[] = [
  {
    name: 'icon',
    type: 'select',
    options: [
      {
        label: 'Bus',
        value: 'bus',
      },
      {
        label: 'Car',
        value: 'car',
      },
      {
        label: 'Diamond',
        value: 'diamond',
      },
      {
        label: 'Food',
        value: 'food',
      },
      {
        label: 'Luggage',
        value: 'luggage',
      },
      {
        label: 'Map & Looking Glass',
        value: 'mapLookingGlass',
      },
      {
        label: 'Map & Placeholder',
        value: 'mapPlaceholder',
      },
      {
        label: 'Placeholder',
        value: 'placeholder',
      },
      {
        label: 'Plane',
        value: 'plane',
      },
      {
        label: 'Shoe',
        value: 'shoe',
      },
      {
        label: 'Stop Sign',
        value: 'stopSign',
      },
      {
        label: 'Ticket',
        value: 'ticket',
      },
      {
        label: 'Ticket & ID',
        value: 'ticketId',
      },
      {
        label: 'Ticket & ID small',
        value: 'ticketIdSmall',
      },
      {
        label: 'Toilet',
        value: 'toilet',
      },
      {
        label: 'Train',
        value: 'train',
      },
      {
        label: 'Umbrella',
        value: 'umbrella',
      },
      {
        label: 'Umbrella & Drops',
        value: 'umbrellaDrops',
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
    name: 'title',
    type: 'text',
    localized: true,
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

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    {
      name: 'tiles',
      type: 'array',
      fields: tileFields,
    },
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
      ],
    },
    {
      name: 'changeBackground',
      type: 'checkbox',
    },
  ],
  labels: {
    plural: 'Calls to Action',
    singular: 'Call to Action',
  },
}
