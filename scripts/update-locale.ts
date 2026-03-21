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

// Helper: path to full heading richText field on a content block
const hf = (id: string, loc: string) => `layout.$[${id}].heading.${loc}`

// Helper: path to heading text node within a column's richText/richTextEnd field
const ch = (bid: string, cid: string, field: string, loc: string) =>
  `layout.$[${bid}].columns.$[${cid}].${field}.${loc}.root.children.0.children.0.text`

// Helper: path to heading text node within a CTA tile's richText field
const th = (bid: string, tid: string, loc: string) =>
  `layout.$[${bid}].tiles.$[${tid}].richText.${loc}.root.children.0.children.0.text`

// Helper: path to full richText field on a CTA tile
const tf = (bid: string, tid: string, loc: string) =>
  `layout.$[${bid}].tiles.$[${tid}].richText.${loc}`

// Shortcut: create a richText object containing a single h2 heading
const h2 = (text: string) => richText([heading(text, 'h2')])

const updates: Update[] = [
  // ─── /tickets (9 headings) ────────────────────────────────────────
  {
    collection: 'pages',
    documentId: '677dc19bcafe44e5e9560d03',
    locale: 'all',
    fields: {
      [bh('b1', 'en')]: 'How to Book Auschwitz Tickets in 2026?',
      [bh('b1', 'pl')]: 'Jak zarezerwować bilety do Auschwitz w 2026?',
      [hf('b2', 'en')]: richText([heading('Practical Tips Before Booking Auschwitz Tickets', 'h2'), paragraph([])]),
      [hf('b2', 'pl')]: richText([heading('Praktyczne porady przed rezerwacją biletów do Auschwitz', 'h2'), paragraph([])]),
      [bh('b3', 'pl')]: 'Czy bilety do Auschwitz są tylko online w 2026?', // PL only
      [bh('b4', 'en')]: 'Can You Visit Auschwitz Without a Guide?',
      [bh('b4', 'pl')]: 'Czy można zwiedzać Auschwitz bez przewodnika?',
      [bh('b5', 'en')]: 'What Are Auschwitz-Birkenau Guided Tours Like?',
      [bh('b5', 'pl')]: 'Jak wygląda zwiedzanie Auschwitz-Birkenau z przewodnikiem?',
      [bh('b6', 'en')]: 'How to Join a Guided Auschwitz Tour?',
      [bh('b6', 'pl')]: 'Jak dołączyć do wycieczki z przewodnikiem do Auschwitz?',
      [bh('b7', 'en')]: 'Is a Private Auschwitz Tour Worth It?',
      [bh('b7', 'pl')]: 'Czy warto wybrać prywatne zwiedzanie Auschwitz-Birkenau?',
      [bh('b8', 'en')]: 'Are Organized Auschwitz Tours from Krakow Worth It?',
      [bh('b8', 'pl')]: 'Czy zorganizowane wycieczki do Auschwitz z Krakowa się opłacają?',
      [bh('b9', 'en')]: 'Disadvantages of Organized Auschwitz-Birkenau Tours',
      [bh('b9', 'pl')]: 'Wady zorganizowanych wycieczek do Auschwitz-Birkenau',
    },
    arrayFilters: [
      { 'b1.id': '67a2568bfa49aa6e12a0920a' },
      { 'b2.id': '680f5a776630e6f377b4b12a' },
      { 'b3.id': '69bca2cc03c41f967f4281ae' },
      { 'b4.id': '67ae0a9a394065e7e6204fa5' },
      { 'b5.id': '67ae0c86f1dc305c2c147ec0' },
      { 'b6.id': '67ae0e91f1dc305c2c147ed1' },
      { 'b7.id': '67ae0f48f1dc305c2c147ed8' },
      { 'b8.id': '67ae0fb1f1dc305c2c147edf' },
      { 'b9.id': '67ae1006f1dc305c2c147ee6' },
    ],
  },

  // ─── /arrival (6 headings) ────────────────────────────────────────
  {
    collection: 'pages',
    documentId: '677e7baff3320b6091e3bc29',
    locale: 'all',
    fields: {
      [th('b1', 't1', 'pl')]: 'Jak dojechać do Muzeum?', // CTA, PL only
      [bh('b2', 'en')]: 'How to Get from Auschwitz I to Birkenau?',
      [bh('b2', 'pl')]: 'Jak dostać się z Auschwitz I do Birkenau?',
      [bh('b3', 'en')]: 'Driving to Auschwitz: Best Routes, Parking & Tips',
      [bh('b3', 'pl')]: 'Dojazd samochodem do Auschwitz: trasy, parking i porady',
      [bh('b4', 'en')]: 'Kraków to Auschwitz Bus: Schedule, Prices & Stops',
      [bh('b4', 'pl')]: 'Autobus Kraków → Auschwitz: rozkład, ceny i przystanki',
      [bh('b5', 'en')]: 'Can You Get to Auschwitz by Train from Krakow?',
      [bh('b5', 'pl')]: 'Czy da się dojechać pociągiem do Auschwitz z Krakowa?',
      [bh('b6', 'en')]: 'Which Airports Are Closest to Auschwitz?',
      [bh('b6', 'pl')]: 'Które lotniska są najbliżej Auschwitz?',
    },
    arrayFilters: [
      { 'b1.id': '67c8b0e6d01c930d4956eeca' },
      { 't1.id': '67c8b0ead01c930d4956eecc' },
      { 'b2.id': '67c72ebbf2626643efd00528' },
      { 'b3.id': '67b50540234a38723d17d71a' },
      { 'b4.id': '67b5cb1b75d34d25e38f7ec7' },
      { 'b5.id': '67b3715b8215f64cf67b600b' },
      { 'b6.id': '678975d0e9ea8c8cf094bd4d' },
    ],
  },

  // ─── /museum (7 headings) ─────────────────────────────────────────
  {
    collection: 'pages',
    documentId: '67819798793515a2ea090884',
    locale: 'all',
    fields: {
      [bh('b1', 'en')]: 'What to Expect at the Auschwitz Visitor Center?',
      [bh('b1', 'pl')]: 'Czego spodziewać się w Centrum Obsługi Odwiedzających?',
      [hf('b2', 'en')]: richText([heading('How to Enter Auschwitz Memorial Site?', 'h2'), paragraph([])]),
      [hf('b2', 'pl')]: richText([heading('Jak wejść na teren Miejsca Pamięci Auschwitz?', 'h2'), paragraph([])]),
      [bh('b3', 'en')]: 'What to See Near Auschwitz-Birkenau Memorial in One Day?',
      [bh('b3', 'pl')]: 'Co warto zobaczyć w okolicy Auschwitz-Birkenau w jeden dzień?',
      [hf('b4', 'en')]: richText([heading('5 Important Memorial Sites Near Auschwitz Worth Visiting', 'h2'), paragraph([])]),
      [hf('b4', 'pl')]: richText([heading('5 ważnych miejsc pamięci w pobliżu Auschwitz', 'h2'), paragraph([])]),
      [bh('b5', 'en')]: 'Is Oświęcim Town Worth Visiting After Auschwitz?',
      [bh('b5', 'pl')]: 'Czy Oświęcim warto zwiedzić po Auschwitz?',
      [th('b6', 't1', 'en')]: 'What Facilities & Services Are Available at Auschwitz?', // CTA
      [th('b6', 't1', 'pl')]: 'Jakie udogodnienia są na terenie Auschwitz?',
      [bh('b7', 'en')]: 'Nature Near Auschwitz Memorial',
      [bh('b7', 'pl')]: 'Przyroda w okolicy Miejsca Pamięci Auschwitz',
    },
    arrayFilters: [
      { 'b1.id': '67d6f52e7d212c58b0a8a1cd' },
      { 'b2.id': '67dc89155489df140f9bcfad' },
      { 'b3.id': '67be697defd490714bffaa5b' },
      { 'b4.id': '67aca4d5a571e8fac47e63e2' },
      { 'b5.id': '67abd166953aa4c0ca1dfd24' },
      { 'b6.id': '67c0f2e93c07892e54d6413b' },
      { 't1.id': '67c0f2f43c07892e54d6413d' },
      { 'b7.id': '67abd77c2b859414d9646739' },
    ],
  },

  // ─── /supplement (7 headings) ─────────────────────────────────────
  {
    collection: 'pages',
    documentId: '6795fe0b07dd1cffb589c118',
    locale: 'all',
    fields: {
      [bh('b1', 'en')]: 'How to Plan Your Auschwitz-Birkenau Visit Step by Step?',
      [bh('b1', 'pl')]: 'Jak zaplanować wizytę w Auschwitz-Birkenau krok po kroku?',
      [ch('b2', 'c1', 'richText', 'en')]: 'What to Expect During Your Auschwitz Visit?',
      [ch('b2', 'c1', 'richText', 'pl')]: 'Czego spodziewać się podczas wizyty w Auschwitz?',
      [bh('b3', 'en')]: 'What Are the Official Auschwitz Visiting Rules?',
      [bh('b3', 'pl')]: 'Jakie są oficjalne zasady zwiedzania Auschwitz?',
      [bh('b4', 'en')]: 'Tips to Make the Most of Your Auschwitz Visit',
      [bh('b4', 'pl')]: 'Porady, jak w pełni docenić wizytę w Auschwitz',
      [bh('b5', 'pl')]: 'Wesprzyj moją działalność', // PL only
      [bh('b6', 'en')]: 'Works of Auschwitz-Birkenau Survivors',
      [bh('b6', 'pl')]: 'Dzieła ocalałych z Auschwitz-Birkenau',
      [bh('b7', 'pl')]: 'Źródła i atrybucje', // PL only
    },
    arrayFilters: [
      { 'b1.id': '67fa8bb518cef83b703cbe67' },
      { 'b2.id': '67dc991b5489df140f9bcfc7' },
      { 'c1.id': '6802258e41dceb08e77b0464' },
      { 'b3.id': '67deb15af5d8b5084b167b37' },
      { 'b4.id': '67aead6a9e7e248cfe2888b0' },
      { 'b5.id': '67bfd1e6b8310e0bd7fc3b88' },
      { 'b6.id': '67dbf734e06cd25a6f7260af' },
      { 'b7.id': '67bf9db20abd253bbcaea9db' },
    ],
  },

  // ─── /tour (4 headings) ───────────────────────────────────────────
  {
    collection: 'pages',
    documentId: '6781983f793515a2ea090c6a',
    locale: 'all',
    fields: {
      [bh('b1', 'en')]: 'What Does the Full Auschwitz-Birkenau Tour Route Include?',
      [bh('b1', 'pl')]: 'Co obejmuje pełna trasa zwiedzania Auschwitz-Birkenau?',
      [bh('b2', 'en')]: 'Most Important Sites to Visit at Auschwitz-Birkenau',
      [bh('b2', 'pl')]: 'Najważniejsze miejsca do zwiedzenia w Auschwitz-Birkenau',
      [bh('b3', 'pl')]: 'Auschwitz I – obóz główny', // PL only
      [bh('b4', 'pl')]: 'Auschwitz II-Birkenau', // PL only
    },
    arrayFilters: [
      { 'b1.id': '69bd7805e40066e9a11f673e' },
      { 'b2.id': '678d6735344965a1ce2e0559' },
      { 'b3.id': '678cebe7bc03e85682f74213' },
      { 'b4.id': '67d30bcc4048af38ffefc1ca' },
    ],
  },

  // ─── /home (5 headings) ───────────────────────────────────────────
  {
    collection: 'pages',
    documentId: '676c7b8613f815400b9f3711',
    locale: 'all',
    fields: {
      [th('b1', 't1', 'pl')]: 'Zasady zwiedzania Auschwitz', // CTA, PL only
      [bh('b2', 'en')]: 'Why Trust Me? 20+ Years as Auschwitz-Birkenau Official Guide',
      [bh('b2', 'pl')]: 'Dlaczego warto mi zaufać? 20+ lat jako oficjalny przewodnik po Auschwitz-Birkenau',
      [bh('b3', 'en')]: 'Auschwitz-Birkenau Then vs Now – What Has Changed?',
      [bh('b3', 'pl')]: 'Auschwitz-Birkenau wtedy i dziś – co się zmieniło?',
      [bh('b4', 'en')]: '6 Essential Things to Know Before Visiting Auschwitz',
      [bh('b4', 'pl')]: '6 najważniejszych rzeczy, które musisz wiedzieć przed wizytą w Auschwitz',
      [th('b5', 't2', 'pl')]: 'Najnowsze wpisy', // CTA, PL only
    },
    arrayFilters: [
      { 'b1.id': '6825b8ba4675f0840f86facd' },
      { 't1.id': '6825b8ba4675f0840f86facc' },
      { 'b2.id': '6825b8ba4675f0840f86fad6' },
      { 'b3.id': '6825b8ba4675f0840f86fadb' },
      { 'b4.id': '6825b8ba4675f0840f86fae3' },
      { 'b5.id': '6825b8ba4675f0840f86faf2' },
      { 't2.id': '6825b8ba4675f0840f86faf1' },
    ],
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
