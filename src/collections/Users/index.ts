import type { CollectionConfig } from 'payload'
import { authenticated, authenticatedAdmin } from '../../access/authenticated'

const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticatedAdmin,
    create: authenticatedAdmin,
    delete: authenticatedAdmin,
    read: authenticated,
    update: authenticatedAdmin,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'], // dodaj role do kolumn
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role', // <-- nowe pole
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      defaultValue: 'admin',
      admin: {
        position: 'sidebar', // można wyświetlić w panelu bocznym
      },
    },
  ],
  timestamps: true,
}

export default Users
