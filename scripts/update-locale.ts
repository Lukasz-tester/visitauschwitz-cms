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

// Helper: path to heading text node within a block's heading richText field
const bh = (id: string, loc: string) =>
  `layout.$[${id}].heading.${loc}.root.children.0.children.0.text`

// Helper: path to heading text node within a column's richText/richTextEnd field
const ch = (bid: string, cid: string, field: string, loc: string) =>
  `layout.$[${bid}].columns.$[${cid}].${field}.${loc}.root.children.0.children.0.text`

// Helper: path to heading text node within a CTA tile's richText field
const th = (bid: string, tid: string, loc: string) =>
  `layout.$[${bid}].tiles.$[${tid}].richText.${loc}.root.children.0.children.0.text`

const updates: Update[] = [
  // ─── Post: Auschwitz Tickets Online Only (69bd353e99188628cbda9f97) ──
  {
    collection: 'posts',
    documentId: '69bd353e99188628cbda9f97',
    locale: 'en',
    fields: {
      layout: [
        // Block 1: Emphasis Intro
        {
          id: new ObjectId().toHexString(),
          blockType: 'Text',
          blockName: 'intro',
          style: 'emphasis',
          content: {
            en: richText([
              paragraph([
                textNode(
                  'Since March 1, 2026, entry cards to the Auschwitz-Birkenau Memorial are available exclusively online at ',
                ),
                linkNode('visit.auschwitz.org', 'https://visit.auschwitz.org', {
                  newTab: true,
                  format: 8,
                }),
                textNode(
                  '. The Museum ended all on-site ticket sales to combat unethical tour operators who misled visitors into paying inflated prices.',
                ),
              ]),
            ]),
          },
        },
        // Block 2: Why the Change
        {
          id: new ObjectId().toHexString(),
          blockType: 'Text',
          blockName: 'why-online-only',
          style: 'text',
          content: {
            en: richText([
              heading('Why the Museum Ended On-Site Ticket Sales', 'h2'),
              paragraph([]),
              paragraph([
                textNode(
                  'For years, unethical tour operators exploited the on-site ticket system at the Memorial. They fabricated stories about sold-out dates to pressure visitors into purchasing overpriced packages — sometimes at several times the actual cost.',
                ),
              ]),
              paragraph([
                textNode(
                  'The problem escalated to the point where visitors queued from 3–4 AM to secure entry cards, leading to conflicts that required police intervention. The Museum received a growing number of complaints about misleading practices and inflated prices charged by third-party operators.',
                ),
              ]),
            ]),
          },
        },
        // Block 3: Quote — Kacorzyk
        {
          id: new ObjectId().toHexString(),
          blockType: 'Text',
          blockName: 'quote-kacorzyk',
          style: 'quote',
          content: {
            en: richText([
              paragraph([
                textNode(
                  'Unethical practices by these entities became a kind of business model based on generating false information about the difficulty of getting to the Memorial and exploiting the emotions of people from around the world who want to visit this important place of remembrance.',
                  2,
                ),
              ]),
              paragraph([
                textNode('— Andrzej Kacorzyk,', 1),
                textNode(' Deputy Director, Auschwitz-Birkenau Memorial'),
              ]),
            ]),
          },
        },
        // Block 4: Image — Old ticket sales
        {
          id: new ObjectId().toHexString(),
          blockType: 'Image',
          media: new ObjectId('67d62b26e4565760a9cc6892'),
          caption: {
            en: richText([
              paragraph([
                textNode(
                  'On-site entry card sales at Auschwitz I, before the system was discontinued in March 2026.',
                ),
              ]),
            ]),
          },
        },
        // Block 5: How to Book
        {
          id: new ObjectId().toHexString(),
          blockType: 'Text',
          blockName: 'how-to-book',
          style: 'text',
          content: {
            en: richText([
              heading('How to Book Through visit.auschwitz.org', 'h2'),
              paragraph([]),
              paragraph([
                textNode('The '),
                linkNode('visit.auschwitz.org', 'https://visit.auschwitz.org', {
                  newTab: true,
                  format: 8,
                }),
                textNode(
                  ' platform is the only official reservation system for the Memorial. Visitors can reserve entry cards up to three months in advance. Free individual entry cards become available seven days before each visit date. Guided tour tickets are released progressively and remain available until sold out.',
                ),
              ]),
              heading('Real-Time Availability for Last-Minute Visits', 'h3'),
              paragraph([]),
              paragraph([
                textNode(
                  'Same-day booking is possible. The system displays real-time availability, so visitors can check open time slots directly from their mobile device — even on the way to the Memorial.',
                ),
              ]),
            ]),
          },
        },
        // Block 6: Quote — Bartyzel
        {
          id: new ObjectId().toHexString(),
          blockType: 'Text',
          blockName: 'quote-bartyzel',
          style: 'quote',
          content: {
            en: richText([
              paragraph([
                textNode(
                  'visit.auschwitz.org is the only official system for booking entry cards to the Auschwitz Memorial. The Museum does not cooperate with any external booking entities and bears no responsibility for services offered through other websites.',
                  2,
                ),
              ]),
              paragraph([
                textNode('— Bartosz Bartyzel,', 1),
                textNode(' Spokesman, Auschwitz-Birkenau Memorial'),
              ]),
            ]),
          },
        },
        // Block 7: Image — Scanning tickets
        {
          id: new ObjectId().toHexString(),
          blockType: 'Image',
          media: new ObjectId('67d791077d7f6cbd8c6d4747'),
          caption: {
            en: richText([
              paragraph([
                textNode('Visitors scanning entry cards at the Memorial entrance.'),
              ]),
            ]),
          },
        },
        // Block 8: Avoid Scams
        {
          id: new ObjectId().toHexString(),
          blockType: 'Text',
          blockName: 'avoid-scams',
          style: 'text',
          content: {
            en: richText([
              heading('3 Rules to Avoid Auschwitz Ticket Scams', 'h2'),
              paragraph([]),
              paragraph([
                textNode('1. Book only at visit.auschwitz.org.', 1),
                textNode(
                  ' This is the sole official platform. Entry cards purchased elsewhere carry no Museum guarantee.',
                ),
              ]),
              paragraph([
                textNode('2. Ignore "sold out" claims from third parties.', 1),
                textNode(
                  ' Operators routinely fabricate scarcity to push expensive packages. Always check availability yourself on the official site.',
                ),
              ]),
              paragraph([
                textNode('3. Report misleading operators.', 1),
                textNode(
                  ' If you encounter websites or agencies making false claims about ticket availability, report them to the Museum directly.',
                ),
              ]),
            ]),
          },
        },
        // Block 9: Emphasis Callout
        {
          id: new ObjectId().toHexString(),
          blockType: 'Text',
          blockName: 'callout-book',
          style: 'emphasis',
          content: {
            en: richText([
              paragraph([
                textNode('Book your entry cards at '),
                linkNode('visit.auschwitz.org', 'https://visit.auschwitz.org', {
                  newTab: true,
                  format: 8,
                }),
                textNode(
                  ' — the only official reservation system for the Auschwitz-Birkenau Memorial.',
                ),
              ]),
              paragraph([
                textNode('Source: '),
                linkNode(
                  'Official Museum announcement',
                  'https://www.auschwitz.org/en/museum/news/visit-auschwitz-org-entry-cards-to-the-memorial-available-only-online-from-1-march,1819.html',
                  { newTab: true, format: 8 },
                ),
              ]),
            ]),
          },
        },
        // Block 10: Image — Entrance
        {
          id: new ObjectId().toHexString(),
          blockType: 'Image',
          media: new ObjectId('67d62c80e4565760a9cc68df'),
          caption: {
            en: richText([
              paragraph([
                textNode(
                  'The reception building at Auschwitz I, where visitors now enter with pre-booked electronic entry cards.',
                ),
              ]),
            ]),
          },
        },
      ],
    },
    arrayFilters: [],
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
