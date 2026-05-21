import type { Block, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  OrderedListFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

const rowFields: Field[] = [
  {
    name: 'label',
    type: 'text',
    localized: true,
    required: true,
    admin: { description: 'e.g. "3.5-h general tour" or "Typical range"' },
  },
  {
    name: 'sublabel',
    type: 'text',
    localized: true,
    admin: { description: 'Optional smaller text under the label (e.g. "up to 30 people").' },
  },
  {
    name: 'pricePLN',
    type: 'number',
    admin: {
      description:
        'Price in PLN for standard (non-matrix) rows. NOT localized — one value powers every locale. Frontend converts to EUR/USD/GBP on the fly. Leave empty when the section uses Column Headers (matrix mode); fill "Matrix Prices (PLN)" below instead.',
    },
  },
  {
    name: 'pricePLNDiscount',
    type: 'number',
    admin: {
      description: 'Optional discounted price in PLN (e.g. student/75+/disability rate).',
    },
  },
  {
    name: 'priceMaxPLN',
    type: 'number',
    admin: {
      description: 'Optional upper bound — shows as "X–Y" range (use for "Typical range" rows).',
    },
  },
  {
    name: 'unit',
    type: 'text',
    localized: true,
    admin: { description: 'e.g. "per person", "per group".' },
  },
  {
    name: 'pricesPLN',
    type: 'array',
    labels: { singular: 'Matrix Price', plural: 'Matrix Prices (PLN)' },
    admin: {
      description:
        'Matrix-mode prices. Add one entry per column header on the section. Frontend uses these when the section has Column Headers; otherwise the single "Price PLN" field is used.',
    },
    fields: [
      {
        name: 'value',
        type: 'number',
        required: true,
        admin: { description: 'PLN amount for this column.' },
      },
    ],
  },
]

const sectionFields: Field[] = [
  {
    name: 'title',
    type: 'text',
    localized: true,
    required: true,
    admin: { description: 'Section heading, e.g. "Individual Visit" or "Group Visit (Private Tour)".' },
  },
  {
    name: 'intro',
    type: 'richText',
    localized: true,
    editor: lexicalEditor({
      features: ({ rootFeatures }) => [
        ...rootFeatures,
        HeadingFeature({ enabledHeadingSizes: ['h4'] }),
        FixedToolbarFeature(),
        InlineToolbarFeature(),
        UnorderedListFeature(),
        OrderedListFeature(),
      ],
    }),
    admin: { description: 'Short intro for this section (e.g. explains individual vs group).' },
  },
  {
    name: 'rowLabelHeader',
    type: 'text',
    localized: true,
    admin: {
      description:
        'Optional. Header for the leftmost (row-label) column when using matrix mode, e.g. "Number of people in group". Leave empty for the standard one-price-per-row layout.',
    },
  },
  {
    name: 'columnHeaders',
    type: 'array',
    labels: { singular: 'Column Header', plural: 'Column Headers' },
    admin: {
      description:
        'Optional. Define column headers (e.g. "0–10", "11–20", "21–30") to switch this section to a matrix layout. Each row must then supply a matching number of values in "Prices PLN (matrix)". Leave empty for the standard layout.',
    },
    fields: [
      {
        name: 'header',
        type: 'text',
        localized: true,
        required: true,
      },
    ],
  },
  {
    name: 'rows',
    type: 'array',
    labels: { singular: 'Price Row', plural: 'Price Rows' },
    fields: rowFields,
  },
  {
    name: 'footnote',
    type: 'richText',
    localized: true,
    editor: lexicalEditor({
      features: ({ rootFeatures }) => [
        ...rootFeatures,
        FixedToolbarFeature(),
        InlineToolbarFeature(),
        UnorderedListFeature(),
      ],
    }),
    admin: { description: 'Small print under the table, e.g. discount notes.' },
  },
]

export const TicketPrices: Block = {
  slug: 'ticketPrices',
  interfaceName: 'TicketPricesBlock',
  labels: {
    singular: 'Ticket Prices',
    plural: 'Ticket Prices',
  },
  fields: [
    {
      name: 'heading',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      label: false,
    },
    {
      name: 'sections',
      type: 'array',
      labels: { singular: 'Price Section', plural: 'Price Sections' },
      fields: sectionFields,
    },
    {
      name: 'warning',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          UnorderedListFeature(),
          OrderedListFeature(),
        ],
      }),
      admin: { description: 'Callout shown after the sections (e.g. cancellation warning).' },
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
