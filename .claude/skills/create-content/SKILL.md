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

- **Title tag:** < 53 characters
- **Meta description:** 140–155 characters
- Clear, unique, relevant; primary keywords placed naturally — no keyword stuffing

### Titles, Headings & Content Structure

These rules apply to **SEO title tags**, **H1**, and **H2/H3** headings — title tags are the highest-CTR element in search results, so treat them as a priority.

- Clear, unique, relevant, engaging; primary keywords placed in front for better CTR
- **Title tag:** primary keyword front-loaded, < 53 characters; include numbers where relevant — this is the first thing users see in SERPs
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
- **`richText`** (above image) = regular inline links (amber underline)
- **`richTextEnd`** (below image) = styled pill/button links via CSS. Best for CTA lists.
- Always add an empty paragraph after headings (frontend uses `padding-top`, not `margin-bottom`)
- **Lead answer block** — `addMarginTop: false`, `addMarginBottom: false` — the block sits directly below the hero without extra spacing

## Posts — Layout Blocks

- **Text block** (`blockType: "Text"`, `style`: `text` | `quote` | `emphasis`, rich text field: **`content`**)
  - `emphasis` = bordered box, semibold, larger text. **Always use as first block** (intro/summary) + mid-article callouts
  - `quote` = card with large serif quotation mark. Italic quote text, bold attribution.
  - `text` = regular prose paragraphs
- **Image block** (`blockType: "Image"`, `media`: media ID, **`caption`**: richText — not a plain string)
- **Block source mapping:** `Banner` (import) → slug `"Text"`, `Code` (import) → slug `"Image"` — config files: `src/blocks/Banner/config.ts`, `src/blocks/Code/config.ts`
- **H3 spacing:** always add an empty paragraph **before and after** every H3 heading for spacing
- **Typical pattern:** emphasis intro → text + H2 → image → more text/quote/image → emphasis callout

### Image Placement

- Every post must include **1 hero image** (`meta.image`) + **2–3 Image blocks** spread through the layout
- Before using the placeholder, check the media collection (`findMedia`) for a relevant existing image
- If no relevant image exists, use placeholder **`67be70ae35ec329c954f5410`**
- **Placeholder in Image block:** set the `caption` rich text to describe what the image **should** show (its future contents) — the user will replace the placeholder and use the caption as alt text for the real photo
- **Placeholder as hero image (`meta.image`):** append ` ALT: <desired image alt text>` at the end of `meta.description` after the real SEO description — the user will swap the hero photo and use this alt text

## Lexical JSON Conventions

- Empty paragraph after headings: `{ type: "paragraph", children: [], ... }`
- Heading tag: `tag: "h2"` / `"h3"`
- Bold: `format: 1`, Italic: `format: 2`, Underline: `format: 8`
- Links: `type: "link"` wrapping text, `fields: { url, newTab, linkType: "custom" }`
- **Link punctuation:** if a sentence or its ending part is a link, include the period **inside** the link node (not as a separate text node after it)

## Global Content Rules

- **Placeholder image:** media ID `67be70ae35ec329c954f5410`
- **Posts always created as draft**
- **Author:** always set `authors` to Łukasz (`675f51ab4d074485ad8b59af`) when creating posts
- **SEO:** title < 53 chars for pages and < 59 for posts, description 140–152 chars
