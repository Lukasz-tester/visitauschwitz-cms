---
name: create-content
description: "TRIGGER when: user asks to create a new post, write an article, create a new page, or add new content blocks. Provides tone guidelines, SEO rules, content structure, MCP workflow, layout block conventions, and Lexical JSON patterns."
---

# Content Creation

## Tone & Content Guidelines

Auschwitz-Birkenau is a memorial and place of remembrance, not a tourist attraction. All content must reflect this.

- **Somber, respectful tone** — convey memory and witness, not leisure travel
- **No marketing speak** — no tourism framing, no promotional language
- **Practical but dignified** — help visitors prepare while honouring the site's significance

### Wording Guidelines by Language

**All languages:** choose words conveying memory, witness, and learning — never leisure or entertainment.

| Language   | Prefer                                                       | Avoid                                                |
| ---------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| **Polish** | `zwiedzanie`, `upamiętnienie`, `pamięć`, `poznanie historii` | `wycieczka`, `wyjazd`, `wypad`, `wizyta turystyczna` |
| **German** | `Gedenkstättenbesuch`, `Besuch der Gedenkstätte`             | `Ausflug`, `Reise`                                   |
| **French** | `visite commémorative`, `visite du Mémorial`                 | `excursion`, `sortie`                                |

**"Book" = "reserve" (not "buy/purchase")** — Auschwitz entry cards can be free. In all languages, translate "book" as "reserve" (`zarezerwować` in Polish, not `kupić`).

### SEO Metadata Rules

- **Title tag (pages):** < 53 characters (frontend appends `| {year}`, ~60 visible in SERP)
- **Title tag (posts):** < 59 characters (no year appended — this IS the full SERP budget)
- **CTR is the priority** — use the full character budget. A short title wastes prime SERP real estate. Front-load primary keyword, include differentiators (transport modes, numbers, specifics), make every character earn its click.
- **Meta description:** 140–155 characters
- Clear, unique, relevant; primary keywords placed naturally — no keyword stuffing

### Titles, Headings & Content Structure

These rules apply to **SEO title tags**, **H1**, and **H2/H3** headings — title tags are the highest-CTR element in search results, so treat them as a priority.

- Clear, unique, relevant, engaging; primary keywords placed in front for better CTR
- **Title tag:** primary keyword front-loaded; include numbers where relevant — this is the first thing users see in SERPs (see char limits in SEO Metadata Rules above)
- **H1:** one per page, primary keyword front-loaded, < 60 characters
- **H2/H3:** use question format only when it genuinely matches search intent and adds value — e.g. "Can You Visit Auschwitz Without a Guide?" triggers featured snippets because people actually search that question. Do **not** force questions when a descriptive or number-based heading is stronger (e.g. "Driving to Auschwitz: Routes & Parking", "5 Booking Tips to Avoid Sold-Out Dates"). Never change the heading's topic to fit a question — the heading must match the content below it.
- Include numbers in titles/headings where appropriate — e.g. "5 Memorial Sites Near Auschwitz Worth Visiting" — improves CTR
- **Current year** — include only in the **homepage H1** as a freshness signal (e.g. "How to Visit Auschwitz-Birkenau in 2026"). Do **not** add the year to H1s, H2/H3 headings, SEO title tags, or meta descriptions — the frontend already appends `| {currentYear}` to every rendered meta title tag automatically. For **Posts**: include the year in the H1/H2/H3 headings when relevant for SEO or AI search (e.g. policy changes, seasonal updates).
- **English titles:** Title Case — **Polish titles:** sentence case, only first word and proper nouns capitalised

### AI Search & Rich Results

- **Lead with a direct answer** — start pages/posts with a concise 2–3 sentence answer before expanding; AI models and featured snippets pull this
- **FAQ page** — dedicated /faq/ page with H2 per question, direct 1–2 sentence answer first, then detail; add `FAQPage` schema only to this page — Google removed FAQ rich results for non-authority sites in 2023 but schema still helps AI parsers
- **Structured content** — prefer lists, tables, step-by-step formats; AI models and Google parse these better than wall-of-text paragraphs
- **Cite authority** — mention "licensed guide since 2006" or similar credentials; AI models favor authoritative, first-hand sources
- **Long-tail keywords** — cover specific visitor questions as H2s on the FAQ page — e.g. "Can I bring a backpack to Auschwitz?" — these dominate AI-assisted search

### SEO Keyword Research

Before writing titles, H1/H2/H3 headings, or meta descriptions, **read the keyword research memory** at `~/.claude/projects/-Users-lucky-dev-visit-auschwitz-info-visitauschwitz-cms/memory/seo_keyword_research.md`. It contains 100+ researched search phrases in 3 volume tiers (EN + PL) plus long-tail phrases ideal for H2 headings and FAQ questions. Pick phrases that match the content topic and weave them into headings and body text naturally.

### Ticket Policy (March 2026)

- Entry cards available **only online** at visit.auschwitz.org since March 1, 2026
- No on-site ticket sales at the Museum entrance
- Reservations up to 3 months in advance; free entry cards bookable 7 days ahead
- Guided tour tickets available until sold out; real-time availability for last-minute visits
- visit.auschwitz.org is the **only** official reservation system — Museum does not cooperate with external booking entities
- Source: https://www.auschwitz.org/en/museum/news/visit-auschwitz-org-entry-cards-to-the-memorial-available-only-online-from-1-march,1819.html

## MCP Workflow

### MCP Tool Priority

- **Always check for `visitauschwitz-cms-local` first** (dev server). Only fall back to `visitauschwitz-cms-prod` if local is unavailable.
- **If MCP tools are not available** and the workflow requires them, ask the user to reconnect (`/mcp`) before proceeding — do not attempt workarounds.

### MCP Partial Updates (Critical)

**Block IDs:** When the user provides a block ID (e.g. `69b82f6c82e7f12ebd4a1938`), it refers to the `blockName` field in the CMS, not the MongoDB `_id`. Use `blockName` to locate blocks, then use the actual `id` field for partial updates.

**WARNING — Layout arrays are REPLACED, not merged.** MCP `updatePages`/`updatePosts` passes `layout` to MongoDB via `$set`, which **replaces the entire array**. Sending a partial layout (only some blocks) **deletes all blocks not included**. The `DeepPartial` TypeScript type only makes fields optional at compile time — it does NOT merge arrays by `id` at runtime.

**Safe approaches for layout field updates:**

1. **Full array:** Fetch the complete layout, modify in-place, send back the full array. Use for MCP-based updates.
2. **MongoDB positional filters:** Use `scripts/update-locale.ts` with `$[identifier]` array filters to target specific fields within specific blocks without touching the array. Use for bulk field updates (e.g. translating headings across many blocks).

**For non-array fields** (title, slug, meta, hero), MCP partial updates work fine — send only the fields you want to change.

- Always use `select` param to limit response size (e.g., `select: { "layout": true }`).

### MCP Layout — Patched

The MCP plugin's Zod schema conversion (`json-schema-to-zod@2.6.1`) fails on block discriminated unions (`anyOf`/`oneOf` with `blockType`). This affects both `create` and `update` for any collection with layout blocks.

**Fix applied:** `pnpm patch @payloadcms/plugin-mcp@3.77.0` — patches `sanitizeJsonSchema.js` to replace block union `items` schemas with `{}` (accept any), skipping Zod validation for blocks while keeping all other validation intact. Patch file: `patches/@payloadcms__plugin-mcp@3.77.0.patch`.

**With the patch, MCP handles layout fields normally** — use MCP for all create/update operations (it handles versioning, hooks, localization automatically).

**MongoDB fallback** (`scripts/update-locale.ts`) is still useful for targeted positional array updates on existing docs (e.g., updating a single heading across many blocks). Run with `npx tsx scripts/update-locale.ts`. Includes Lexical JSON helper functions (`richText`, `paragraph`, `heading`, `textNode`, `linkNode`, `linebreak`).

## Pages — Content Block Layout

- **1/6 column = decorative spacer** (hidden on mobile, margin on desktop). Never put content in it.
- Column sizes: `full`, `half`, `twoThirds`, `oneThird`, `oneSixth`
- **`richText`** (above image) = regular inline links (amber underline). Supports ordered/unordered lists.
- **`richTextEnd`** (below image) = styled pill/button links via CSS. Best for CTA lists. Supports ordered/unordered lists.
- Always add an empty paragraph after headings (frontend uses `padding-top`, not `margin-bottom`)
- **Lead answer block** — `addMarginTop: false`, `addMarginBottom: false` — the block sits directly below the hero without extra spacing

## Posts — Layout Blocks

- **Text block** (`blockType: "Text"`, `style`: `text` | `quote` | `emphasis`, rich text field: **`content`**)
  - `emphasis` = bordered box, semibold, larger text. **Always use as first block** (intro/summary) + mid-article callouts. **Never place links inside emphasis blocks** — move links to a regular `text` block instead.
  - `quote` = card with large serif quotation mark. Italic quote text (format: 2). **Use for credibility if applicable** — spoken quotes from survivors or authorities, but also cited written texts (catalogue introductions, official letters, written statements). **Attribution format:** `— Name,` in bold (format: 1), then `Role, Organisation, Description` in regular (format: 0).
  - `text` = regular prose paragraphs
- **Lists in Text blocks:** Use **unordered lists** for non-sequential items (rules, tips, what to bring) and **ordered lists** for sequential steps (directions, booking process, itinerary). Lists improve readability and are preferred by AI search and featured snippets. Available in all Text block styles.
- **Image block** (`blockType: "Image"`, `media`: media ID, **`caption`**: richText — not a plain string)
- **Block source mapping:** `Banner` (import) → slug `"Text"`, `Code` (import) → slug `"Image"` — config files: `src/blocks/Banner/config.ts`, `src/blocks/Code/config.ts`
- **H2 spacing:** add empty paragraph **after** every H2
- **H3 spacing:** add empty paragraph **before and after** every H3, **exception:** no spacer paragraph before a H3 heading that starts a block
- **No spacer between paragraphs** — empty paragraphs are only for heading spacing
- **Typical pattern:** emphasis intro → text + H2 → image → more text/quote/image → emphasis callout

### Image Placement

- Every post must include **1 hero image** (`meta.image`) + **2–4 Image blocks** spread through the layout
- Before using the placeholder, check the media collection (`findMedia`) for a relevant existing image
- If no relevant image exists, use placeholder **`67be70ae35ec329c954f5410`**
- **Placeholder in Image block:** set the `caption` rich text to describe what the image **should** show (its future contents) — the user will replace the placeholder and use the caption as alt text for the real photo
- **Placeholder as hero image (`meta.image`):** append ` ALT: <desired image alt text>` at the end of `meta.description` after the real SEO description — the user will swap the hero photo and use this alt text

## Lexical JSON Conventions

- Empty paragraph after headings: `{ type: "paragraph", children: [], ... }`
- Heading tag: `tag: "h2"` / `"h3"`
- Bold: `format: 1`, Italic: `format: 2`, Underline: `format: 8`
- Links: `type: "link"` wrapping text, `fields: { url, newTab, linkType: "custom" }`
- Unordered list: `type: "list"`, `tag: "ul"`, `listType: "bullet"`, `start: 0`
- Ordered list: `type: "list"`, `tag: "ol"`, `listType: "number"`, `start: 1`
- List items: `type: "listitem"`, `value: 1` (increments per item), `checked: null`; children can contain text nodes, formatted text, and link nodes


## Content Accuracy

- **Only use verified information.** When basing content on an existing page, extract actual links, numbers, and details from that page. Never invent URLs, prices, or details. If unsure, ask the user in a `[QUESTION]` comment.
- **Accordion content is rich.** Always extract and use content from accordion blocks — they contain detailed, verified information (timetables, bus lines, prices, step-by-step directions).
- **Try token-saving methods first.** Use small targeted commands (regex, jq, grep) before spawning agents or reading entire files. Always prefer the simplest approach.

## Global Content Rules

- **Always present full post content for user review before injecting into CMS.** Draft all texts, images, links, SEO metadata, and block structure in the plan/conversation first. Only call `createPosts` after the user approves. Use `[QUESTION]` inline comments for anything uncertain.
- **Placeholder image:** media ID `67be70ae35ec329c954f5410`
- **Posts always created as draft**
- **Author:** always set `authors` to Łukasz (`675f51ab4d074485ad8b59af`) when creating posts
- **SEO:** title < 53 chars for pages, < 59 for posts (see CTR rules in SEO Metadata Rules), description 140–152 chars
