import type { CollectionConfig } from 'payload'

import { authenticatedAdmin } from '../../access/authenticated'

const MarketingCampaigns: CollectionConfig = {
  slug: 'marketing-campaigns',
  access: {
    create: authenticatedAdmin,
    delete: authenticatedAdmin,
    read: authenticatedAdmin,
    update: authenticatedAdmin,
  },
  admin: {
    defaultColumns: ['name', 'status', 'sentCount', 'updatedAt'],
    useAsTitle: 'name',
    components: {
      views: {
        edit: {
          send: {
            Component: '@/collections/MarketingCampaigns/components/SendView',
            path: '/send',
            tab: {
              label: 'Send',
              href: '/send',
            },
          },
        },
      },
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal campaign label, e.g. "May 2026 promo".',
      },
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Email subject line.',
      },
    },
    {
      name: 'preheader',
      type: 'text',
      localized: true,
      admin: {
        description: 'Preview text shown in email clients before the email is opened.',
      },
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: 'Main email body. Separate paragraphs with a blank line.',
      },
    },
    {
      name: 'footer',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Optional footer text. Overrides the default footer.',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Sending', value: 'sending' },
        { label: 'Paused', value: 'paused' },
        { label: 'Completed', value: 'completed' },
      ],
      admin: {
        readOnly: true,
        description: 'Managed automatically by the send endpoint.',
      },
    },
    {
      name: 'sentCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Total number of emails sent so far.',
      },
    },
    {
      name: 'currentPage',
      type: 'number',
      defaultValue: 1,
      admin: {
        readOnly: true,
        description: 'Current subscriber page — used to resume a paused send.',
      },
    },
    {
      name: 'startedAt',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'When the first batch was sent.',
      },
    },
    {
      name: 'completedAt',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'When all subscribers were reached.',
      },
    },
  ],
  timestamps: true,
}

export default MarketingCampaigns
