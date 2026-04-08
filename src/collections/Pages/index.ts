import type { CollectionConfig, TypedLocale } from 'payload'

import { authenticated, authenticatedAdmin } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { Code } from '@/blocks/Code/config'
import { Banner } from '@/blocks/Banner/config'
import { hero } from '@/heros/config'
import { slugField } from '@/fields/slug'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidatePage } from './hooks/revalidatePage'
import { syncPageMediaUsage, deletePageMediaUsage } from '../../hooks/syncMediaUsage'

import { OpeningHours } from '@/blocks/OpeningHours/config'
import { Accordion } from '@/blocks/Accordion/config'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    create: authenticatedAdmin,
    delete: authenticatedAdmin,
    read: authenticatedOrPublished,
    update: authenticatedAdmin,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, locale }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'pages',
          locale: locale.code,
        })

        return `${process.env.NEXT_PUBLIC_SERVER_URL}${path}`
      },
    },
    preview: (data, { locale }) => {
      const path = generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
        locale,
      })

      return `${process.env.NEXT_PUBLIC_SERVER_URL}${path}`
    },
    useAsTitle: 'title',
    components: {
      edit: {
        beforeDocumentControls: [
          '@/components/admin/SidebarLocaleSwitcher#SidebarLocaleSwitcher',
        ],
      },
    },
  },
  fields: [
    {
      name: '_documentMeta',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/DocumentMeta#DocumentMeta',
        },
      },
    },
    {
      name: 'title',
      localized: true,
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              // localized: true,   "leave it this way or layout will reset for each language"
              blocks: [
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                OpeningHours,
                Code,
                Banner,
                Accordion,
              ],
              required: true,
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage, syncPageMediaUsage],
    afterDelete: [deletePageMediaUsage],
    beforeChange: [populatePublishedAt],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 1500,
      },
    },
    maxPerDoc: 50,
  },
}
