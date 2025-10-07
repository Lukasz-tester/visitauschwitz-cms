import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated, authenticatedAdmin } from '../access/authenticated'

const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticatedAdmin,
    delete: authenticatedAdmin,
    read: anyone,
    update: authenticatedAdmin,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
  ],
}

export default Categories
