/**
 * Direct MongoDB locale updater for Payload CMS.
 *
 * Workaround for MCP updatePages/updatePosts Zod union bug on `layout` fields.
 * Uses positional array filters to update specific blocks/columns by their `id`.
 *
 * Usage:
 *   npx tsx scripts/update-locale.ts
 *
 * Edit the `updates` array below with the fields you need to change.
 */

import { MongoClient, ObjectId } from 'mongodb'

const DATABASE_URI =
  'mongodb+srv://visitauschwitzinfo:mmmooongo@museum-cluster.u0kan.mongodb.net/?retryWrites=true&w=majority&appName=museum-cluster'

// ─── Lexical helpers ────────────────────────────────────────────────
// When building translated content, treat each paragraph as a single translation unit.
// Link text (linkNode) is often part of a sentence — translate the full sentence first,
// then split into textNode/linkNode segments preserving the natural word boundaries.

function textNode(text: string, format = 0) {
  return { detail: 0, format, mode: 'normal', style: '', text, type: 'text', version: 1 }
}

function linkNode(
  text: string,
  url: string,
  opts: { newTab?: boolean; format?: number } = {},
) {
  return {
    children: [textNode(text, opts.format)],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'link',
    version: 3,
    fields: { url, newTab: opts.newTab ?? false, linkType: 'custom' },
  }
}

function linebreak() {
  return { type: 'linebreak', version: 1 }
}

function paragraph(children: object[]) {
  return {
    children,
    direction: children.length ? 'ltr' : null,
    format: '',
    indent: 0,
    type: 'paragraph',
    version: 1,
    textFormat: 0,
    textStyle: '',
  }
}

function heading(text: string, tag: 'h2' | 'h3' | 'h4' = 'h3') {
  return {
    children: [textNode(text)],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'heading',
    version: 1,
    tag,
  }
}

function richText(children: object[]) {
  return {
    root: {
      children,
      direction: children.length ? 'ltr' : null,
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

// ─── Update definition ─────────────────────────────────────────────

interface LocaleUpdate {
  collection: string
  documentId: string
  locale: string
  /** MongoDB dot-notation paths → values. Use `layout.$[block].heading.pl` style. */
  fields: Record<string, unknown>
  /** Array filters for positional `$[identifier]` operators. */
  arrayFilters?: Record<string, unknown>[]
}

// ─── Define your updates here ───────────────────────────────────────

const updates: LocaleUpdate[] = [
  {
    collection: 'pages',
    documentId: '6781983f793515a2ea090c6a',
    locale: 'pl',
    fields: {
      // 1. Heading PL
      'layout.$[block].heading.pl': richText([heading('Wyjście z Auschwitz', 'h3')]),

      // 2. Column 69b82f6c82e7f12ebd4a193b (oneThird, index 2) — richTextEnd PL
      'layout.$[block].columns.$[col2].richTextEnd.pl': richText([
        paragraph([
          textNode(
            'Po zwiedzaniu komory gazowej zejdź tunelem i wyjdź schodami na górę. Podczas zwiedzania z przewodnikiem oddaj słuchawki po drodze.',
          ),
        ]),
      ]),

      // 3. Column 69b82f6c82e7f12ebd4a1941 (half, index 8) — richTextEnd PL
      'layout.$[block].columns.$[col8].richTextEnd.pl': richText([
        paragraph([
          textNode('Przejdź na główny '),
          linkNode('parking', 'museum#model-map'),
          textNode(' przez metalowe bramki.'),
          linebreak(),
          linkNode('Przejdź do Birkenau.', 'arrival#get-to-birkenau'),
        ]),
      ]),
    },
    arrayFilters: [
      { 'block.id': '69b82f6c82e7f12ebd4a1938' },
      { 'col2.id': '69b82f6c82e7f12ebd4a193b' },
      { 'col8.id': '69b82f6c82e7f12ebd4a1941' },
    ],
  },
]

// ─── Runner ─────────────────────────────────────────────────────────

async function run() {
  const client = new MongoClient(DATABASE_URI)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db()

    for (const update of updates) {
      const collection = db.collection(update.collection)
      const filter = { _id: new ObjectId(update.documentId) }

      const result = await collection.updateOne(
        filter,
        { $set: update.fields },
        { arrayFilters: update.arrayFilters },
      )

      console.log(
        `${update.collection}/${update.documentId} [${update.locale}]: ` +
          `matched=${result.matchedCount}, modified=${result.modifiedCount}`,
      )
    }
  } catch (err) {
    console.error('Update failed:', err)
    process.exit(1)
  } finally {
    await client.close()
    console.log('Disconnected')
  }
}

run()
