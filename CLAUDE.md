# visitauschwitz-cms

## Project

Payload CMS v3 backend for **visitauschwitz.info** — a practical guide for visiting the Auschwitz-Birkenau Memorial and Museum. Created by Lukasz, a licensed Auschwitz guide since 2006. This is a public-service resource for visitor preparation, not a commercial tourism site.

**Audience:** international visitors (primarily travelling from Krakow), planning their first visit.
**Content scope:** tickets, transport, museum logistics, tour routes, preparation tips, rules, nearby sites.

## Dev

- **Package manager:** pnpm
- **Dev server:** `pnpm dev` (Next.js 15 + Turbopack)
- **Build:** `pnpm build`
- **Locales:** `en` (default), `pl` — more commented out in `src/i18n/localization.ts`

## MCP Tool Priority

- **Always check for `visitauschwitz-cms-local` first** (dev server). Only fall back to `visitauschwitz-cms-prod` if local is unavailable.

## Tone & Content Guidelines

Auschwitz-Birkenau is a memorial and place of remembrance, not a tourist attraction. All content must reflect this.

- **Somber, respectful tone** — convey memory and witness, not leisure travel
- **No marketing speak** — no tourism framing, no promotional language
- **Practical but dignified** — help visitors prepare while honouring the site's significance

### Wording Guidelines by Language

**All languages:** choose words conveying memory, witness, and learning — never leisure or entertainment.

| Language | Prefer | Avoid |
|----------|--------|-------|
| **Polish** | `zwiedzanie`, `upamiętnienie`, `pamięć`, `poznanie historii` | `wycieczka`, `wyjazd`, `wypad`, `wizyta turystyczna` |
| **German** | `Gedenkstättenbesuch`, `Besuch der Gedenkstätte` | `Ausflug`, `Reise` |
| **French** | `visite commémorative`, `visite du Mémorial` | `excursion`, `sortie` |

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
- **Current year** — include only in the **homepage H1** as a freshness signal (e.g. "How to Visit Auschwitz-Birkenau in 2026"). Do **not** add the year to subpage H1s, H2/H3 headings, SEO title tags, or meta descriptions — the frontend already appends `| {currentYear}` to every rendered title tag automatically
- **English titles:** Title Case — **Polish titles:** sentence case, only first word and proper nouns capitalised

### AI Search & Rich Results

- **Lead with a direct answer** — start pages/posts with a concise 2–3 sentence answer before expanding; AI models and featured snippets pull this
- **FAQ page** — dedicated /faq/ page with H2 per question, direct 1–2 sentence answer first, then detail; add `FAQPage` schema only to this page — Google removed FAQ rich results for non-authority sites in 2023 but schema still helps AI parsers
- **Structured content** — prefer lists, tables, step-by-step formats; AI models and Google parse these better than wall-of-text paragraphs
- **Cite authority** — mention "licensed guide since 2006" or similar credentials; AI models favor authoritative, first-hand sources
- **Long-tail keywords** — cover specific visitor questions as H2s on the FAQ page — e.g. "Can I bring a backpack to Auschwitz?" — these dominate AI-assisted search

## Content Creation via MCP

### MCP Tool Priority

- **Always check for `visitauschwitz-cms-local` first** (dev server). Only fall back to `visitauschwitz-cms-prod` if local is unavailable.

### MCP Partial Updates (Critical)

**Block IDs:** When the user provides a block ID (e.g. `69b82f6c82e7f12ebd4a1938`), it refers to the `blockName` field in the CMS, not the MongoDB `_id`. Use `blockName` to locate blocks, then use the actual `id` field for partial updates.

`updatePages`/`updatePosts` support **partial updates** via `DeepPartial`. Pass only the block `id` and the changed fields:

```json
{ "layout": [{ "id": "block-id", "columns": [{ "id": "col-id", "richText": { ... } }] }] }
```

- **Never fetch or re-upload entire layout arrays.** Only send the block(s) you're changing.
- Always use `select` param to limit response size (e.g., `select: { "layout": true }`).

### MCP Layout Limitation & MongoDB Fallback

MCP `updatePages`/`updatePosts` **cannot update `layout` fields** due to a Zod union validation bug in Payload's MCP plugin. The call fails with a schema error.

**Workaround:** Use `scripts/update-locale.ts` to update layout fields directly via MongoDB. The script uses positional array filters (`$[identifier]`) to target specific blocks/columns by their `id` field. Edit the `updates` array in the script, then run:

```bash
npx tsx scripts/update-locale.ts
```

Includes Lexical JSON helper functions (`richText`, `paragraph`, `heading`, `textNode`, `linkNode`, `linebreak`) for building content.

### Translation Workflow

When translating content between locales ("default locale" = source, "target locale" = destination):

1. **Find:** `find*` with `locale: "all"`, `select: { "layout": true }` — fetch only layout data for all locales at once
2. **Parse:** Identify untranslated fields — target locale is empty/null OR identical to default locale while default locale has content. Skip decorative `oneSixth` columns.
3. **Plan:** Output a translation table: block `id` | field name | default locale text | target locale status
4. **Translate:** Translate each string, preserving Lexical JSON structure (nodes, links, formatting codes)
   - **Context-aware links:** Link text is often part of a sentence — translate the entire paragraph as a unit, then split back into `textNode` / `linkNode` segments. Never translate link text in isolation.
5. **Update:** `update*` with `locale: "<target>"` — one call per block, only changed fields + block `id`

**Scope rule:** Check the entire content block (heading, richText, richTextEnd, all columns). If a block only has a heading (H2/H3/H4), also check the next block(s) for untranslated content in the same section.

**Target: ~5 MCP calls** for a typical translation task (1 find + N updates).

### Pages — Content Block Layout

- **1/6 column = decorative spacer** (hidden on mobile, margin on desktop). Never put content in it.
- Column sizes: `full`, `half`, `twoThirds`, `oneThird`, `oneSixth`
- **`richText`** (above image) = regular inline links (amber underline)
- **`richTextEnd`** (below image) = styled pill/button links via CSS. Best for CTA lists.
- Always add an empty paragraph after headings (frontend uses `padding-top`, not `margin-bottom`)
- **Lead answer block** — `addMarginTop: false`, `addMarginBottom: false` — the block sits directly below the hero without extra spacing

### Posts — Layout Blocks

- **Text block** (`blockType: "Text"`, `style`: `text` | `quote` | `emphasis`)
  - `emphasis` = bordered box, semibold, larger text. **Always use as first block** (intro/summary) + mid-article callouts
  - `quote` = card with large serif quotation mark. Italic quote text, bold attribution.
  - `text` = regular prose paragraphs
- **Image block** (`blockType: "Image"`, `media`: media ID, optional `caption`)
- **Typical pattern:** emphasis intro → text + H2 → image → more text/quote/image → emphasis callout

### Lexical JSON Conventions

- Empty paragraph after headings: `{ type: "paragraph", children: [], ... }`
- Heading tag: `tag: "h2"` / `"h3"`
- Bold: `format: 1`, Italic: `format: 2`, Underline: `format: 8`
- Links: `type: "link"` wrapping text, `fields: { url, newTab, linkType: "custom" }`

### Global Content Rules

- **Placeholder image:** media ID `67be70ae35ec329c954f5410`. Set alt text to a description of what the real image should be.
- **Posts always created as draft**
- **SEO:** title < 53 chars, description 140–155 chars
