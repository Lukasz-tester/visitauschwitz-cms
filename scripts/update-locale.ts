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

import { readFileSync } from 'fs'
import { MongoClient, ObjectId } from 'mongodb'

// Load DATABASE_URI from .env if not set in environment
if (!process.env.DATABASE_URI) {
  const env = readFileSync('.env', 'utf-8')
  const match = env.match(/^DATABASE_URI=(.+)$/m)
  if (match) process.env.DATABASE_URI = match[1]
}
const DATABASE_URI = process.env.DATABASE_URI
if (!DATABASE_URI) {
  throw new Error('DATABASE_URI not found in environment or .env file')
}

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

// ─── Insert lead answer block at top of homepage layout ─────────────

interface MongoOpUpdate {
  collection: string
  documentId: string
  operation: '$push' | '$pull'
  fields: Record<string, unknown>
}

type Update = LocaleUpdate | MongoOpUpdate

const updates: Update[] = [
  // Step 1: Remove tickets-2026-policy block from its current position
  {
    collection: 'pages',
    documentId: '677dc19bcafe44e5e9560d03',
    operation: '$pull',
    fields: {
      layout: { blockName: 'tickets-2026-policy' },
    },
  },
  // Step 2: Re-insert it at position 1 (after lead-answer)
  {
    collection: 'pages',
    documentId: '677dc19bcafe44e5e9560d03',
    operation: '$push',
    fields: {
      layout: {
        $each: [
          {
            blockType: 'content',
            columns: [
              {
                size: 'oneSixth',
                id: new ObjectId().toString(),
              },
              {
                size: 'twoThirds',
                richText: {
                  en: richText([
                    heading('Are Auschwitz Tickets Online Only in 2026?', 'h2'),
                    paragraph([]),
                    paragraph([
                      textNode(
                        'Yes. From March 1, 2026, all entry passes to the Auschwitz-Birkenau Memorial must be booked online. On-site ticket sales have been permanently discontinued.',
                      ),
                    ]),
                    paragraph([
                      textNode(
                        'Book your free individual entry or guided tour exclusively through the official museum website. Be cautious of third-party sites charging inflated prices \u2014 the official booking system is the only legitimate source.',
                      ),
                    ]),
                  ]),
                  pl: richText([
                    heading('Czy bilety do Auschwitz w 2026 są tylko online?', 'h2'),
                    paragraph([]),
                    paragraph([
                      textNode(
                        'Tak. Od 1 marca 2026 roku wszystkie wejściówki do Miejsca Pamięci Auschwitz-Birkenau można rezerwować wyłącznie online. Sprzedaż biletów na miejscu została trwale zakończona.',
                      ),
                    ]),
                    paragraph([
                      textNode(
                        'Zarezerwuj bezpłatne wejście indywidualne lub zwiedzanie z przewodnikiem wyłącznie na oficjalnej stronie Muzeum. Uważaj na zewnętrzne serwisy pobierające zawyżone opłaty \u2014 jedynym wiarygodnym źródłem jest oficjalny system rezerwacji.',
                      ),
                    ]),
                  ]),
                },
                id: new ObjectId().toString(),
              },
            ],
            changeBackground: false,
            addMarginTop: false,
            addMarginBottom: false,
            addPaddingBottom: false,
            id: new ObjectId().toString(),
            blockName: 'tickets-2026-policy',
          },
        ],
        $position: 1,
      },
    },
  },
]

// ─── Runner ─────────────────────────────────────────────────────────

async function run() {
  const client = new MongoClient(DATABASE_URI as string)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db()

    for (const update of updates) {
      const collection = db.collection(update.collection)
      const filter = { _id: new ObjectId(update.documentId) }

      const operation = 'operation' in update ? update.operation : null

      let mongoOp: Record<string, unknown>
      let options: Record<string, unknown> = {}

      if (operation === '$push') {
        mongoOp = { $push: update.fields }
      } else if (operation === '$pull') {
        mongoOp = { $pull: update.fields }
      } else {
        mongoOp = { $set: update.fields }
        options = { arrayFilters: (update as LocaleUpdate).arrayFilters }
      }

      const result = await collection.updateOne(filter, mongoOp, options)

      console.log(
        `${update.collection}/${update.documentId}: ` +
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
