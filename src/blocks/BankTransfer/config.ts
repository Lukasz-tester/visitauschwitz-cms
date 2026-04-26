import type { Block, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  OrderedListFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

const currencyFields: Field[] = [
  {
    name: 'currencyLabel',
    type: 'text',
    localized: true,
    label: 'Currency Label',
  },
  {
    name: 'recipient',
    type: 'text',
    localized: true,
    label: 'Recipient / Account Holder',
  },
  {
    name: 'iban',
    type: 'text',
    label: 'IBAN',
    admin: {
      description: 'For EUR and PLN transfers',
    },
  },
  {
    name: 'bicSwift',
    type: 'text',
    label: 'BIC / SWIFT',
    admin: {
      description: 'For EUR transfers',
    },
  },
  {
    name: 'routingNumber',
    type: 'text',
    label: 'Routing Number',
    admin: {
      description: 'For USD transfers',
    },
  },
  {
    name: 'accountNumber',
    type: 'text',
    label: 'Account Number',
    admin: {
      description: 'For USD, GBP, and PLN transfers',
    },
  },
  {
    name: 'sortCode',
    type: 'text',
    label: 'Sort Code',
    admin: {
      description: 'For GBP transfers',
    },
  },
  {
    name: 'bankName',
    type: 'text',
    label: 'Bank Name',
    admin: {
      description: 'For PLN transfers',
    },
  },
  {
    name: 'currencyCode',
    type: 'select',
    label: 'Currency Code',
    options: [
      { label: 'EUR', value: 'EUR' },
      { label: 'USD', value: 'USD' },
      { label: 'GBP', value: 'GBP' },
      { label: 'PLN', value: 'PLN' },
    ],
  },
  {
    name: 'recommendedFor',
    type: 'richText',
    localized: true,
    editor: lexicalEditor({
      features: ({ rootFeatures }) => {
        return [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          UnorderedListFeature(),
          OrderedListFeature(),
        ]
      },
    }),
    label: 'Recommended For',
  },
]

export const BankTransfer: Block = {
  slug: 'bankTransfer',
  interfaceName: 'BankTransferBlock',
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
    },
    {
      name: 'currencies',
      type: 'array',
      fields: currencyFields,
      labels: {
        singular: 'Currency',
        plural: 'Currencies',
      },
    },
    {
      name: 'changeBackground',
      type: 'checkbox',
    },
    {
      name: 'blikHeading',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            UnorderedListFeature(),
            OrderedListFeature(),
          ]
        },
      }),
      label: 'BLIK Heading',
    },
    {
      name: 'blikButton',
      type: 'text',
      localized: true,
      label: 'BLIK Button',
    }
  ],
  labels: {
    plural: 'Bank Transfers',
    singular: 'Bank Transfer',
  },
}
