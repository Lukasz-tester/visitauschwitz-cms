import crypto from 'crypto'
import type { CollectionConfig } from 'payload'

import { authenticatedAdmin } from '../../access/authenticated'

const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  access: {
    create: () => true,
    delete: authenticatedAdmin,
    read: authenticatedAdmin,
    update: authenticatedAdmin,
  },
  admin: {
    defaultColumns: ['email', 'locale', 'confirmed', 'createdAt'],
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'confirmed',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether the subscriber has confirmed their email address.',
      },
    },
    {
      name: 'token',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Confirmation token sent via email.',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) return crypto.randomUUID()
            return value
          },
        ],
      },
    },
    {
      name: 'locale',
      type: 'select',
      required: true,
      defaultValue: 'en',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Polski', value: 'pl' },
      ],
    },
    {
      name: 'confirmedAt',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'When the subscriber confirmed their email.',
      },
    },
  ],
  timestamps: true,
}

export default Subscribers
