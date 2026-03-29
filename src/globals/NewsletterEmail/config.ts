import type { GlobalConfig } from 'payload'

import { revalidateNewsletterEmail } from './hooks/revalidateNewsletterEmail'

export const NewsletterEmail: GlobalConfig = {
  slug: 'newsletter-email',
  access: {
    read: () => true,
  },
  admin: {
    components: {
      elements: {
        beforeDocumentControls: [
          '@/components/admin/SidebarLocaleSwitcher#SidebarLocaleSwitcher',
        ],
      },
    },
  },
  fields: [
    {
      name: 'subject',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'The email subject line sent in the auto-reply.',
      },
    },
    {
      name: 'intro',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: 'Introduction/greeting section of the email body.',
      },
    },
    {
      name: 'footer',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Footer section of the email (e.g., contact details, legal notices).',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateNewsletterEmail],
  },
}
