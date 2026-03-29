// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { s3Storage } from '@payloadcms/storage-s3'

import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import {
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  ItalicFeature,
  LinkFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import sharp from 'sharp' // editor-import
import { UnderlineFeature } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig, type Plugin } from 'payload'
import { fileURLToPath } from 'url'

import Categories from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import Users from './collections/Users'
import { Footer } from './globals/Footer/config'
import { Header } from './globals/Header/config'
import { NewsletterEmail } from './globals/NewsletterEmail/config'
import { revalidateRedirects } from './hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { Page, Post } from 'src/payload-types'

import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import localization from './i18n/localization'

import { resendAdapter } from '@payloadcms/email-resend'

import { translator, openAIResolver } from '@payload-enchants/translator'
import { payloadSyncAiTranslations } from 'payload-sync-ai-translations'
import { mcpPlugin } from '@payloadcms/plugin-mcp'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const generateTitle: GenerateTitle<Post | Page> = ({ doc, collectionConfig }) => {
  const date = new Date()
  if (collectionConfig?.slug === 'posts') {
    return doc?.title || `Auschwitz Visitor Information | ${date.getFullYear()}`
  }
  return doc?.title
    ? `${doc.title} | ${date.getFullYear()}`
    : `Auschwitz Visitor Information | ${date.getFullYear()}`
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  return doc?.slug
    ? `${process.env.NEXT_PUBLIC_SERVER_URL!}/${doc.slug}`
    : process.env.NEXT_PUBLIC_SERVER_URL!
}

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: lexicalEditor({
    features: () => {
      return [
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        LinkFeature({
          enabledCollections: ['pages', 'posts', 'media'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: ({ linkType }) => linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
              },
            ]
          },
        }),
      ]
    },
  }),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
    transactionOptions: false,
    connectOptions: {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      maxIdleTimeMS: 30000,
      heartbeatFrequencyMS: 10000,
    },
  }),
  collections: [Pages, Posts, Media, Categories, Users],
  cors: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL,
    process.env.FRONTEND_URL,
  ].filter(Boolean) as string[],
  csrf: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL,
    process.env.FRONTEND_URL,
  ].filter(Boolean) as string[],
  globals: [Header, Footer, NewsletterEmail],
  logger: {
    destination: process.stdout,
    options: { level: 'info' },
  },
  plugins: [
    translator({
      // collections with the enabled translator in the admin UI
      collections: ['posts', 'pages', 'forms', 'categories'],
      // globals with the enabled translator in the admin UI
      globals: ['header', 'footer', 'newsletter-email'],
      // add resolvers that you want to include, examples on how to write your own in ./plugin/src/resolvers
      resolvers: [
        openAIResolver({
          apiKey: process.env.OPENAI_KEY!,
          // model: 'gpt-4o',
          model: 'gpt-4.1',
          prompt: ({ localeFrom, localeTo, texts }) => {
            console.log('>>>>>>>>>>>> JSON ', texts)
            console.log('>>>>>>>>>>>> FROM ', localeFrom)
            console.log('>>>>>>>>>>>> TO ', localeTo)
            return `You are a translator for visitauschwitz.info, a practical guide to visiting the Auschwitz-Birkenau Memorial. Translate the
 following array from locale=${localeFrom} to locale=${localeTo}. Respond with a JSON array of strings only.

 Array: ${JSON.stringify(texts)}

 RULES:

 1. FRAGMENTS: Source texts are Lexical rich-text fragments (link text, bold spans) split from sentences. They share context within the array — translate coherently as parts of the same sentence, not in isolation.

 2. ARRAY STRUCTURE: Output array must match input length. If a fragment becomes empty due to word shifts, use an empty string (""). Indexes must align.

 3. TERMINOLOGY (examples are in Polish but applicable to all target languages):
 - if applicable, choose wording reflecting search patterns in the target language for best SEO performance (long tail keywords, phrases, etc.)
 - "Memorial" = "Miejsce Pamięci" (not "Memoriał")
 - "to book" = "zarezerwować" (not "kupić")
 - "educator" = "edukator" (not "przewodnik")
 - "tour" = "zwiedzanie" (not "wycieczka")
 - "self-guided tour" = "zwiedzanie samodzielne"
 - "Auschwitz" = "Auschwitz" (not "Oświęcim")
 - "entry pass" = "karta wstępu" (not "wejściówka" or "przejście" or "przepustka")

 4. CAPITALIZATION: Always use sentence case (only first word and proper nouns capitalized).

 5. WHITESPACE: Preserve leading and trailing spaces " " exactly as in the source text.
 
 6. SEO LENGTH:
    - [META_TITLE] = SEO meta title. HARD LIMIT: ≤55 characters. Aim for 45–55 characters.
    - [META_DESC] = SEO meta description. HARD LIMIT: ≤155 characters. Aim for 130–150
 characters (roughly 18–22 words).
    Keep it compelling with relevant keywords. Remove the prefix tag from output.
    COUNT CAREFULLY — exceeding these limits means the text gets truncated in Google search
  results.`
          },
        }),
      ],
    }),
    redirectsPlugin({
      collections: ['pages', 'posts'],
      overrides: {
        // @ts-expect-error
        fields: ({ defaultFields }) => {
          return defaultFields.map((field) => {
            if ('name' in field && field.name === 'from') {
              return {
                ...field,
                admin: {
                  description: 'You will need to rebuild the website when changing this field.',
                },
              }
            }
            return field
          })
        },
        hooks: {
          afterChange: [revalidateRedirects],
        },
      },
    }),
    nestedDocsPlugin({
      collections: ['categories'],
    }),
    seoPlugin({
      generateTitle,
      generateURL,
    }),
    formBuilderPlugin({
      fields: {
        payment: false,
      },
      formOverrides: {
        fields: ({ defaultFields }) => {
          return defaultFields.map((field) => {
            if ('name' in field && field.name === 'confirmationMessage') {
              return {
                ...field,
                editor: lexicalEditor({
                  features: ({ rootFeatures }) => {
                    return [
                      ...rootFeatures,
                      FixedToolbarFeature(),
                      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    ]
                  },
                }),
              }
            }
            return field
          })
        },
      },
    }),
    searchPlugin({
      collections: ['posts', 'pages'],
      beforeSync: beforeSyncWithSearch,
      searchOverrides: {
        fields: ({ defaultFields }) => {
          return [...defaultFields, ...searchFields]
        },
      },
    }),
    s3Storage({
      collections: { media: true },
      bucket: process.env.R2_BUCKET!,
      config: {
        region: 'auto',
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID!,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        },
      },
    }),
    payloadSyncAiTranslations({
      collections: {
        // clientProps.locales overrides the plugin default which passes full locale objects.
        // The server endpoint expects plain string codes — this is a bug in the plugin.
        posts: { excludeFields: ['slug'], clientProps: { locales: localization.locales.map((l) => l.code) } },
        pages: { excludeFields: ['slug'], clientProps: { locales: localization.locales.map((l) => l.code) } },
        categories: { excludeFields: ['slug'], clientProps: { locales: localization.locales.map((l) => l.code) } },
      },
      openai: {
        apiKey: process.env.OPENAI_KEY || '',
      },
    }) as unknown as Plugin,
    mcpPlugin({
      collections: {
        posts: {
          enabled: true,
          description:
            'Blog posts with localized title, slug, and block-based layout (Text and Image blocks). Related to categories, authors, and other posts. Supports draft/published versioning and SEO metadata.',
        },
        pages: {
          enabled: true,
          description:
            'Site pages with localized title, slug, a hero section (none/low/medium/high impact with rich text, links, and media), and block-based layout (CallToAction, Content, MediaBlock, Archive, Form, OpeningHours, Image, Text, Accordion). Supports draft/published versioning and SEO metadata.',
        },
        media: {
          enabled: true,
          description:
            'Uploaded media files (images) with localized alt text and optional caption.',
        },
        categories: {
          enabled: true,
          description:
            'Post categories with localized title. Supports nested hierarchy via nestedDocs plugin.',
        },
      },
    }),
    payloadCloudPlugin(), // storage-adapter-placeholder
  ],
  localization,
  secret: process.env.PAYLOAD_SECRET!,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  email: resendAdapter({
    defaultFromAddress: 'contact@visitauschwitz.info',
    defaultFromName: 'Lukasz',
    apiKey: process.env.RESEND_API || '',
  }),
})
