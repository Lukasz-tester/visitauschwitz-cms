/**
 * Find and translate specific text across all CMS content.
 *
 * Usage:
 *   npx tsx scripts/find-and-translate.ts find "search text"
 *   npx tsx scripts/find-and-translate.ts translate "search text" [options]
 *
 * Options:
 *   --dry-run            Preview without applying changes
 *   --replace "text"     Replace English text before translating
 *   --locales pl,de      Target specific locales (default: all non-en)
 *   --collections pages  Search specific collections (default: pages,posts)
 */

import { readFileSync } from 'fs'
import { createInterface } from 'readline'
import { MongoClient, ObjectId } from 'mongodb'

// ─── ENV ─────────────────────────────────────────────────────────

function loadEnvVar(name: string): string | undefined {
  if (process.env[name]) return process.env[name]
  try {
    const env = readFileSync('.env', 'utf-8')
    const match = env.match(new RegExp(`^${name}=(.+)$`, 'm'))
    if (match) {
      process.env[name] = match[1]
      return match[1]
    }
  } catch {}
  return undefined
}

const DATABASE_URI = loadEnvVar('DATABASE_URI')
const OPENAI_KEY = loadEnvVar('OPENAI_KEY')
if (!DATABASE_URI) throw new Error('DATABASE_URI not found in environment or .env')

// ─── Constants ───────────────────────────────────────────────────

const ALL_LOCALES = ['en', 'pl', 'de', 'es', 'it', 'fr', 'nl', 'ru', 'uk']
const DEFAULT_TARGETS = ALL_LOCALES.filter((l) => l !== 'en')
const DEFAULT_COLLECTIONS = ['pages', 'posts']

// ─── Lexical helpers (from update-locale.ts) ─────────────────────

function textNode(text: string, format = 0) {
  return { detail: 0, format, mode: 'normal', style: '', text, type: 'text', version: 1 }
}

function linkNode(
  text: string,
  url: string,
  opts: { newTab?: boolean; format?: number; linkType?: string } = {},
) {
  return {
    children: [textNode(text, opts.format)],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'link',
    version: 3,
    fields: { url, newTab: opts.newTab ?? false, linkType: opts.linkType ?? 'custom' },
  }
}

function mkParagraph(children: object[]) {
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

function mkHeading(text: string, tag: 'h2' | 'h3' | 'h4' = 'h3') {
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

function mkRichText(children: object[]) {
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

// ─── CLI parsing ─────────────────────────────────────────────────

interface Config {
  command: 'find' | 'translate'
  searchText: string
  dryRun: boolean
  replaceWith: string | null
  targetLocales: string[]
  collections: string[]
}

function parseArgs(): Config {
  const args = process.argv.slice(2)
  if (args.length < 2) {
    console.log(`Usage:
  npx tsx scripts/find-and-translate.ts find "text"
  npx tsx scripts/find-and-translate.ts translate "text" [--dry-run] [--replace "new"] [--locales pl,de] [--collections pages]`)
    process.exit(0)
  }

  const command = args[0] as Config['command']
  if (command !== 'find' && command !== 'translate') {
    console.error(`Unknown command: ${command}. Use 'find' or 'translate'.`)
    process.exit(1)
  }

  const searchText = args[1]
  let dryRun = false
  let replaceWith: string | null = null
  let targetLocales = DEFAULT_TARGETS
  let collections = DEFAULT_COLLECTIONS

  for (let i = 2; i < args.length; i++) {
    switch (args[i]) {
      case '--dry-run':
        dryRun = true
        break
      case '--replace':
        replaceWith = args[++i]
        break
      case '--locales':
        targetLocales = args[++i].split(',')
        break
      case '--collections':
        collections = args[++i].split(',')
        break
    }
  }

  return { command, searchText, dryRun, replaceWith, targetLocales, collections }
}

// ─── Types ───────────────────────────────────────────────────────

interface SearchMatch {
  collection: string
  documentId: string
  documentTitle: string
  documentSlug: string
  matchedText: string
  displayPath: string
  translations: Record<string, string> // locale → text (only existing)

  // Update info — pre-computed during search
  updateType: 'plain' | 'text-node' | 'rich-paragraph' | 'unsupported'
  /** MongoDB path with `{locale}` placeholder */
  mongoPath: string
  arrayFilters: Record<string, unknown>[]
  /** For text-node: path to check if locale field exists */
  localeCheckPath?: string
  /** For text-node headings: tag for fallback full-field creation */
  headingTag?: string
  /** For rich-paragraph: original Lexical children for marker rebuild */
  originalChildren?: any[]
  /** Reason if unsupported */
  skipReason?: string
}

// ─── Text extraction from Lexical nodes ──────────────────────────

function nodeText(node: any): string {
  if (!node) return ''
  if (node.type === 'text') return node.text || ''
  if (node.type === 'link')
    return (node.children || []).map((c: any) => nodeText(c)).join('')
  if (node.type === 'linebreak') return '\n'
  return ''
}

function childrenText(children: any[]): string {
  return (children || []).map(nodeText).join('')
}

interface ExtractedNode {
  text: string
  nodeIndex: number
  nodeType: 'heading' | 'paragraph'
  headingTag?: string
  hasLinks: boolean
  children: any[]
}

function extractNodes(richTextVal: any): ExtractedNode[] {
  const root = richTextVal?.root?.children
  if (!root) return []
  const out: ExtractedNode[] = []

  for (let i = 0; i < root.length; i++) {
    const n = root[i]
    if (n.type !== 'heading' && n.type !== 'paragraph') continue
    if (!n.children?.length) continue
    const text = childrenText(n.children).trim()
    if (!text) continue
    out.push({
      text,
      nodeIndex: i,
      nodeType: n.type,
      headingTag: n.tag,
      hasLinks: n.children.some((c: any) => c.type === 'link'),
      children: n.children,
    })
  }
  return out
}

/** Get translated text for a specific node in a localized richText field */
function getRichTextTranslation(
  localizedField: any,
  locale: string,
  nodeIndex: number,
): string | null {
  const val = localizedField?.[locale]
  if (!val?.root?.children) return null
  const node = val.root.children[nodeIndex]
  if (!node?.children) return null
  const text = childrenText(node.children).trim()
  return text || null
}

/** Check if a locale's richText field has a valid text node at the expected path */
function hasTextNodeAt(localizedField: any, locale: string, nodeIndex: number): boolean {
  const node = localizedField?.[locale]?.root?.children?.[nodeIndex]
  if (!node?.children?.length) return false
  return node.children[0]?.type === 'text' || node.children[0]?.type === 'link'
}

// ─── Search engine ───────────────────────────────────────────────

function searchDocument(doc: any, collection: string, search: string): SearchMatch[] {
  const matches: SearchMatch[] = []
  const q = search.toLowerCase()
  const title = doc.title?.en || doc.title || '(untitled)'
  const slug = doc.slug || ''

  const base = { collection, documentId: doc._id.toString(), documentTitle: title, documentSlug: slug }

  // --- Helper: search a plain text localized field ---
  function plainField(
    field: any,
    path: string,
    mongoPath: string,
    filters: Record<string, unknown>[] = [],
  ) {
    const en = typeof field === 'object' ? field?.en : field
    if (!en || typeof en !== 'string' || !en.toLowerCase().includes(q)) return
    const translations: Record<string, string> = {}
    if (typeof field === 'object') {
      for (const [loc, val] of Object.entries(field)) {
        if (typeof val === 'string' && val.trim()) translations[loc] = val
      }
    } else {
      translations.en = en
    }
    matches.push({
      ...base,
      matchedText: en,
      displayPath: path,
      translations,
      updateType: 'plain',
      mongoPath: mongoPath.replace('{L}', '{locale}'),
      arrayFilters: filters,
    })
  }

  // --- Helper: search a localized richText field inside a block ---
  function richField(
    localizedRT: any,
    displayPrefix: string,
    mongoPrefix: string,
    filters: Record<string, unknown>[],
    opts?: { isHeadingField?: boolean },
  ) {
    const enRT = localizedRT?.en
    if (!enRT) return
    const nodes = extractNodes(enRT)

    for (const node of nodes) {
      if (!node.text.toLowerCase().includes(q)) continue

      // Gather existing translations for this node
      const translations: Record<string, string> = {}
      for (const loc of ALL_LOCALES) {
        const t = getRichTextTranslation(localizedRT, loc, node.nodeIndex)
        if (t) translations[loc] = t
      }

      const isSimpleHeading = node.nodeType === 'heading' && !node.hasLinks
      const isSimpleParagraph = node.nodeType === 'paragraph' && !node.hasLinks

      let updateType: SearchMatch['updateType']
      let mongoPath: string
      let headingTag: string | undefined
      let originalChildren: any[] | undefined
      let skipReason: string | undefined

      if (isSimpleHeading) {
        // Text-only path: set just the .text property of the first text node
        updateType = 'text-node'
        mongoPath = `${mongoPrefix}.{locale}.root.children.${node.nodeIndex}.children.0.text`
        headingTag = node.headingTag
      } else if (isSimpleParagraph) {
        // Simple paragraph (no links) — also text-only if single child
        if (node.children.length === 1 && node.children[0].type === 'text') {
          updateType = 'text-node'
          mongoPath = `${mongoPrefix}.{locale}.root.children.${node.nodeIndex}.children.0.text`
        } else {
          // Multiple text nodes (e.g. bold + normal) — treat as rich paragraph
          updateType = 'rich-paragraph'
          mongoPath = `${mongoPrefix}.{locale}.root.children.${node.nodeIndex}`
          originalChildren = node.children
        }
      } else if (node.hasLinks) {
        // Paragraph or heading with links — marker-based
        updateType = 'rich-paragraph'
        mongoPath = `${mongoPrefix}.{locale}.root.children.${node.nodeIndex}`
        originalChildren = node.children
        headingTag = node.headingTag
      } else {
        updateType = 'unsupported'
        mongoPath = ''
        skipReason = 'Unrecognized node structure'
      }

      const display = `${displayPrefix} → ${node.nodeType}${node.headingTag ? ` ${node.headingTag}` : ''}${node.hasLinks ? ' (has links)' : ''}`

      matches.push({
        ...base,
        matchedText: node.text,
        displayPath: display,
        translations,
        updateType,
        mongoPath,
        arrayFilters: filters,
        localeCheckPath: `${mongoPrefix}.{locale}`,
        headingTag,
        originalChildren,
        skipReason,
      })
    }
  }

  // 1. Document title
  plainField(doc.title, 'title', 'title.{L}')

  // 2. Meta fields
  if (doc.meta) {
    plainField(doc.meta.title, 'meta.title', 'meta.title.{L}')
    plainField(doc.meta.description, 'meta.description', 'meta.description.{L}')
  }

  // 3. Layout blocks
  const layout = doc.layout || []
  for (let bi = 0; bi < layout.length; bi++) {
    const block = layout[bi]
    const bt = block.blockType
    const bid = block.id
    if (!bid) continue

    // Short alias for array filter variable names (last 4 chars of ID for readability)
    const bVar = `b${bid.slice(-4)}`
    const bFilter = { [`${bVar}.id`]: bid }

    switch (bt) {
      case 'content': {
        richField(
          block.heading,
          `layout[${bi}].heading`,
          `layout.$[${bVar}].heading`,
          [bFilter],
          { isHeadingField: true },
        )
        for (let ci = 0; ci < (block.columns || []).length; ci++) {
          const col = block.columns[ci]
          if (col.size === 'oneSixth' || !col.id) continue
          const cVar = `c${col.id.slice(-4)}`
          const cFilter = { [`${cVar}.id`]: col.id }
          const filters = [bFilter, cFilter]
          richField(
            col.richText,
            `layout[${bi}].columns[${ci}].richText`,
            `layout.$[${bVar}].columns.$[${cVar}].richText`,
            filters,
          )
          richField(
            col.richTextEnd,
            `layout[${bi}].columns[${ci}].richTextEnd`,
            `layout.$[${bVar}].columns.$[${cVar}].richTextEnd`,
            filters,
          )
        }
        break
      }

      case 'cta': {
        for (let ti = 0; ti < (block.tiles || []).length; ti++) {
          const tile = block.tiles[ti]
          if (!tile.id) continue
          const tVar = `t${tile.id.slice(-4)}`
          const tFilter = { [`${tVar}.id`]: tile.id }
          const filters = [bFilter, tFilter]
          // Tile title (plain text)
          if (tile.title) {
            const en = tile.title?.en || tile.title
            if (en && typeof en === 'string' && en.toLowerCase().includes(q)) {
              const translations: Record<string, string> = {}
              if (typeof tile.title === 'object') {
                for (const [loc, val] of Object.entries(tile.title)) {
                  if (typeof val === 'string' && val.trim()) translations[loc] = val as string
                }
              }
              matches.push({
                ...base,
                matchedText: en,
                displayPath: `layout[${bi}].tiles[${ti}].title`,
                translations,
                updateType: 'plain',
                mongoPath: `layout.$[${bVar}].tiles.$[${tVar}].title.{locale}`,
                arrayFilters: filters,
              })
            }
          }
          // Tile richText
          richField(
            tile.richText,
            `layout[${bi}].tiles[${ti}].richText`,
            `layout.$[${bVar}].tiles.$[${tVar}].richText`,
            filters,
          )
        }
        break
      }

      case 'accordion': {
        for (let ai = 0; ai < (block.accordionItems || []).length; ai++) {
          const item = block.accordionItems[ai]
          if (!item.id) continue
          const aVar = `a${item.id.slice(-4)}`
          const aFilter = { [`${aVar}.id`]: item.id }
          const filters = [bFilter, aFilter]
          // Question (plain text)
          if (item.question) {
            const en =
              typeof item.question === 'object' ? item.question?.en : item.question
            if (en && typeof en === 'string' && en.toLowerCase().includes(q)) {
              const translations: Record<string, string> = {}
              if (typeof item.question === 'object') {
                for (const [loc, val] of Object.entries(item.question)) {
                  if (typeof val === 'string' && val.trim())
                    translations[loc] = val as string
                }
              }
              matches.push({
                ...base,
                matchedText: en,
                displayPath: `layout[${bi}].accordionItems[${ai}].question`,
                translations,
                updateType: 'plain',
                mongoPath: `layout.$[${bVar}].accordionItems.$[${aVar}].question.{locale}`,
                arrayFilters: filters,
              })
            }
          }
          // Answer (richText)
          richField(
            item.answer,
            `layout[${bi}].accordionItems[${ai}].answer`,
            `layout.$[${bVar}].accordionItems.$[${aVar}].answer`,
            filters,
          )
        }
        break
      }

      case 'Text': {
        // Banner block
        richField(
          block.content,
          `layout[${bi}].content`,
          `layout.$[${bVar}].content`,
          [bFilter],
        )
        break
      }

      case 'oh': {
        richField(
          block.richText,
          `layout[${bi}].richText`,
          `layout.$[${bVar}].richText`,
          [bFilter],
        )
        plainField(
          block.enterBetweenTitle,
          `layout[${bi}].enterBetweenTitle`,
          `layout.$[${bVar}].enterBetweenTitle.{L}`,
          [bFilter],
        )
        plainField(
          block.freeFromTitle,
          `layout[${bi}].freeFromTitle`,
          `layout.$[${bVar}].freeFromTitle.{L}`,
          [bFilter],
        )
        plainField(
          block.leaveBeforeTitle,
          `layout[${bi}].leaveBeforeTitle`,
          `layout.$[${bVar}].leaveBeforeTitle.{L}`,
          [bFilter],
        )
        break
      }

      case 'archive': {
        richField(
          block.introContent,
          `layout[${bi}].introContent`,
          `layout.$[${bVar}].introContent`,
          [bFilter],
        )
        break
      }

      case 'formBlock': {
        richField(
          block.introContent,
          `layout[${bi}].introContent`,
          `layout.$[${bVar}].introContent`,
          [bFilter],
        )
        richField(
          block.outroContent,
          `layout[${bi}].outroContent`,
          `layout.$[${bVar}].outroContent`,
          [bFilter],
        )
        break
      }

      case 'Image': {
        // Code block
        richField(
          block.caption,
          `layout[${bi}].caption`,
          `layout.$[${bVar}].caption`,
          [bFilter],
        )
        break
      }
    }
  }

  return matches
}

// ─── Marker-based translation for paragraphs with links ──────────

function childrenToMarkedText(children: any[]): string {
  let linkIdx = 0
  let out = ''
  for (const child of children) {
    if (child.type === 'text') {
      out += child.text || ''
    } else if (child.type === 'link') {
      const linkText = (child.children || [])
        .map((c: any) => (c.type === 'text' ? c.text : ''))
        .join('')
      out += `[LINK:${linkIdx}]${linkText}[/LINK:${linkIdx}]`
      linkIdx++
    } else if (child.type === 'linebreak') {
      out += '\n'
    }
  }
  return out
}

function markedTextToChildren(markedText: string, originalChildren: any[]): any[] {
  // Collect original link nodes in order
  const originalLinks: any[] = []
  for (const child of originalChildren) {
    if (child.type === 'link') originalLinks.push(child)
  }

  const result: any[] = []
  // Split by [LINK:N]...[/LINK:N] markers
  const regex = /\[LINK:(\d+)\](.*?)\[\/LINK:\1\]/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(markedText)) !== null) {
    // Text before this link
    const before = markedText.slice(lastIndex, match.index)
    if (before) result.push(textNode(before))

    // Link node — use original link's fields (URL, newTab, etc.)
    const linkIndex = parseInt(match[1])
    const translatedLinkText = match[2]
    const origLink = originalLinks[linkIndex]
    if (origLink) {
      const childFormat = origLink.children?.[0]?.format ?? 0
      result.push(
        linkNode(translatedLinkText, origLink.fields?.url || '', {
          newTab: origLink.fields?.newTab,
          format: childFormat,
          linkType: origLink.fields?.linkType,
        }),
      )
    } else {
      // Fallback: plain text if original link not found
      result.push(textNode(translatedLinkText))
    }

    lastIndex = regex.lastIndex
  }

  // Remaining text after last link
  const remaining = markedText.slice(lastIndex)
  if (remaining) result.push(textNode(remaining))

  return result
}

function buildParagraphNode(children: any[], originalNode?: any): any {
  const isHeading = originalNode?.type === 'heading'
  if (isHeading) {
    return {
      children,
      direction: children.length ? 'ltr' : null,
      format: originalNode.format ?? '',
      indent: originalNode.indent ?? 0,
      type: 'heading',
      version: 1,
      tag: originalNode.tag || 'h3',
    }
  }
  return mkParagraph(children)
}

// ─── Translation engine ──────────────────────────────────────────

async function translateTexts(
  texts: string[],
  targetLocales: string[],
  context?: string,
): Promise<Record<string, string>[]> {
  if (!OPENAI_KEY) throw new Error('OPENAI_KEY not found — cannot translate')

  const systemPrompt = `You are an expert translator for visitauschwitz.info — a memorial education site about visiting Auschwitz-Birkenau.

Translation rules:
- Use words conveying memory, witness, learning — never leisure/entertainment.
- "Book" = "reserve" (not buy/purchase). Auschwitz entry cards can be free.
- Polish: prefer "zwiedzanie", "upamiętnienie", "pamięć" — avoid "wycieczka", "wyjazd", "wypad".
- German: prefer "Gedenkstättenbesuch", "Besuch der Gedenkstätte" — avoid "Ausflug", "Reise".
- French: prefer "visite commémorative", "visite du Mémorial" — avoid "excursion", "sortie".
- Preserve proper nouns: Auschwitz, Birkenau, Oświęcim, Kraków.
- Preserve [LINK:N]...[/LINK:N] markers exactly — they mark hyperlink boundaries.
- Preserve year numbers, formatting, and sentence structure as closely as possible.
- Keep translations at similar length to the original.

Respond ONLY with a JSON object. No markdown, no explanation.`

  const textsBlock = texts
    .map((t, i) => `[${i}] "${t}"`)
    .join('\n')

  const userPrompt = `Translate each text below to: ${targetLocales.join(', ')}
${context ? `Context: These texts appear on ${context}` : ''}

${textsBlock}

Respond with JSON: { "0": { "pl": "...", "de": "...", ... }, "1": { ... }, ... }`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`OpenAI API error ${response.status}: ${err}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('Empty response from OpenAI')

  const parsed = JSON.parse(content)

  // Normalize: return array of { locale: translation } objects
  const results: Record<string, string>[] = []
  for (let i = 0; i < texts.length; i++) {
    results.push(parsed[String(i)] || parsed[i] || {})
  }
  return results
}

// ─── Update executor ─────────────────────────────────────────────

async function applyUpdates(
  db: any,
  matches: SearchMatch[],
  translations: Record<string, string>[],
  config: Config,
) {
  // Group updates by (collection, documentId)
  const groups = new Map<
    string,
    { collection: string; documentId: string; fields: Record<string, unknown>; arrayFilters: Record<string, unknown>[] }
  >()

  for (let mi = 0; mi < matches.length; mi++) {
    const m = matches[mi]
    const t = translations[mi]
    if (!t) continue

    const key = `${m.collection}:${m.documentId}`
    if (!groups.has(key)) {
      groups.set(key, {
        collection: m.collection,
        documentId: m.documentId,
        fields: {},
        arrayFilters: [],
      })
    }
    const group = groups.get(key)!

    // If replacing English text too
    if (config.replaceWith && m.updateType !== 'unsupported') {
      const enPath = m.mongoPath.replace('{locale}', 'en')
      if (m.updateType === 'plain' || m.updateType === 'text-node') {
        group.fields[enPath] = config.replaceWith
      }
      // For rich-paragraph, English replacement is handled via the node rebuild below
    }

    for (const locale of config.targetLocales) {
      const translatedText = t[locale]
      if (!translatedText) continue

      const path = m.mongoPath.replace('{locale}', locale)

      if (m.updateType === 'plain') {
        group.fields[path] = translatedText
      } else if (m.updateType === 'text-node') {
        group.fields[path] = translatedText
      } else if (m.updateType === 'rich-paragraph') {
        // Rebuild Lexical paragraph node from marked text
        const newChildren = markedTextToChildren(translatedText, m.originalChildren || [])
        // Find the original node to preserve its type (heading vs paragraph)
        const origNode = m.headingTag
          ? { type: 'heading', tag: m.headingTag, format: '', indent: 0 }
          : undefined
        group.fields[path] = buildParagraphNode(newChildren, origNode)
      }
    }

    // Merge array filters (deduplicate by key)
    for (const filter of m.arrayFilters) {
      const filterKey = Object.keys(filter)[0]
      const exists = group.arrayFilters.some((f) => Object.keys(f)[0] === filterKey)
      if (!exists) group.arrayFilters.push(filter)
    }
  }

  // Execute updates
  for (const [key, group] of groups) {
    if (Object.keys(group.fields).length === 0) continue

    const coll = db.collection(group.collection)
    const filter = { _id: new ObjectId(group.documentId) }
    const options: any = {}
    if (group.arrayFilters.length > 0) {
      options.arrayFilters = group.arrayFilters
    }

    const result = await coll.updateOne(filter, { $set: group.fields }, options)
    console.log(
      `  ${group.collection}/${group.documentId}: matched=${result.matchedCount}, modified=${result.modifiedCount}`,
    )
  }
}

// ─── Display formatting ──────────────────────────────────────────

function displayMatches(matches: SearchMatch[]) {
  if (matches.length === 0) {
    console.log('No matches found.')
    return
  }

  console.log(`\nFound ${matches.length} match${matches.length > 1 ? 'es' : ''}:\n`)

  for (let i = 0; i < matches.length; i++) {
    const m = matches[i]
    const method =
      m.updateType === 'plain'
        ? 'direct'
        : m.updateType === 'text-node'
          ? m.headingTag
            ? `bh (${m.headingTag} text-only)`
            : 'text-only'
          : m.updateType === 'rich-paragraph'
            ? 'marker-based'
            : `SKIP: ${m.skipReason}`

    console.log(`  ${i + 1}. ${m.collection} / ${m.documentSlug} (${m.documentId})`)
    console.log(`     ${m.displayPath}`)
    console.log(`     Method: ${method}`)

    // Show existing translations (only non-empty)
    for (const [loc, text] of Object.entries(m.translations)) {
      const truncated = text.length > 80 ? text.slice(0, 77) + '...' : text
      console.log(`     ${loc}: "${truncated}"`)
    }
    console.log()
  }
}

function displayTranslationPreview(
  matches: SearchMatch[],
  translations: Record<string, string>[],
  config: Config,
) {
  console.log('\n── Translation Preview ──\n')

  for (let i = 0; i < matches.length; i++) {
    const m = matches[i]
    const t = translations[i]
    const sourceText = config.replaceWith || m.matchedText

    console.log(`  ${i + 1}. "${sourceText}"`)
    if (config.replaceWith) {
      console.log(`     (replacing: "${m.matchedText}")`)
    }
    for (const locale of config.targetLocales) {
      if (t[locale]) console.log(`     ${locale}: "${t[locale]}"`)
    }
    console.log()
  }
}

// ─── Confirmation prompt ─────────────────────────────────────────

async function confirm(message: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(`${message} (y/n) `, (answer) => {
      rl.close()
      resolve(answer.toLowerCase() === 'y')
    })
  })
}

// ─── Main ────────────────────────────────────────────────────────

async function main() {
  const config = parseArgs()
  const client = new MongoClient(DATABASE_URI)

  try {
    await client.connect()
    console.log('Connected to MongoDB')
    const db = client.db()

    // Search phase
    const allMatches: SearchMatch[] = []
    for (const collName of config.collections) {
      const docs = await db.collection(collName).find({}).toArray()
      for (const doc of docs) {
        const matches = searchDocument(doc, collName, config.searchText)
        allMatches.push(...matches)
      }
    }

    displayMatches(allMatches)

    if (config.command === 'find' || allMatches.length === 0) return

    // ── translate command ──

    // Filter out unsupported matches
    const translatable = allMatches.filter((m) => m.updateType !== 'unsupported')
    const skipped = allMatches.filter((m) => m.updateType === 'unsupported')

    if (skipped.length > 0) {
      console.log(`Skipping ${skipped.length} unsupported match(es).`)
    }

    if (translatable.length === 0) {
      console.log('No translatable matches.')
      return
    }

    // Prepare texts for translation
    const textsToTranslate = translatable.map((m) => {
      const sourceText = config.replaceWith || m.matchedText
      if (m.updateType === 'rich-paragraph' && m.originalChildren) {
        // Use marker format for paragraphs with links
        return childrenToMarkedText(m.originalChildren)
      }
      return sourceText
    })

    // If --replace, update the marker text too
    if (config.replaceWith) {
      for (let i = 0; i < translatable.length; i++) {
        if (translatable[i].updateType !== 'rich-paragraph') {
          textsToTranslate[i] = config.replaceWith
        }
      }
    }

    // Translate
    const context = translatable[0]
      ? `"${translatable[0].documentTitle}" (${translatable[0].documentSlug})`
      : undefined

    console.log(`\nTranslating ${textsToTranslate.length} text(s) to ${config.targetLocales.join(', ')}...`)
    const translations = await translateTexts(textsToTranslate, config.targetLocales, context)

    // Preview
    displayTranslationPreview(translatable, translations, config)

    if (config.dryRun) {
      console.log('── Dry run — no changes applied ──')
      return
    }

    // Confirm
    const ok = await confirm(
      `Apply ${translatable.length} translation(s) to ${config.targetLocales.length} locale(s)?`,
    )
    if (!ok) {
      console.log('Cancelled.')
      return
    }

    // Apply
    console.log('\nApplying updates...')
    await applyUpdates(db, translatable, translations, config)
    console.log('Done.')
  } catch (err) {
    console.error('Error:', err)
    process.exit(1)
  } finally {
    await client.close()
  }
}

main()
