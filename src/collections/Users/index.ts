import type { CollectionConfig } from 'payload'
import { authenticatedAdmin } from '../../access/authenticated'
import { authenticated } from '../../access/authenticated'
import { syncUserMediaUsage, deleteUserMediaUsage } from '../../hooks/syncMediaUsage'

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
  auth: {
    useSessions: false,
  },
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
    {
      name: 'bio',
      type: 'textarea',
      label: 'Short Bio',
      localized: true,
      admin: {
        description: 'A short biography displayed at the end of posts authored by this user.',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Author Photo',
      admin: {
        description: 'Portrait photo displayed alongside the author bio in post footers.',
      },
    },
  ],
  hooks: {
    afterChange: [syncUserMediaUsage],
    afterDelete: [deleteUserMediaUsage],
  },
  timestamps: true,
}

export default Users
