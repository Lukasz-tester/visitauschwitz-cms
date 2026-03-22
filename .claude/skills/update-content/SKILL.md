---
name: update-content
description: "TRIGGER when: user asks to translate content between locales, update/change heading text, edit existing block content, modify layout text, or localize pages/posts. Handles translations, heading field updates, and any modifications to existing content blocks."
---

# Update Existing Content

## Translation Workflow

When translating content between locales ("default locale" = source, "target locale" = destination):

1. **Find:** `find*` with `locale: "all"`, `select: { "layout": true }` — fetch only layout data for all locales at once
2. **Parse:** Identify untranslated fields — target locale is empty/null OR identical to default locale while default locale has content. Skip decorative `oneSixth` columns.
3. **Plan:** Output a translation table: block `id` | field name | default locale text | target locale status
4. **Translate:** Translate each string, preserving Lexical JSON structure (nodes, links, formatting codes)
   - **Context-aware links:** Link text is often part of a sentence — translate the entire paragraph as a unit, then split back into `textNode` / `linkNode` segments. Never translate link text in isolation.
5. **Update:** For **non-layout fields** (title, meta, hero): use MCP `update*` with `locale: "<target>"`. For **layout fields** (headings, richText within blocks): use `scripts/update-locale.ts` with MongoDB positional array filters — MCP replaces the entire layout array and will destroy content.

**Scope rule:** Check the entire content block (heading, richText, richTextEnd, all columns). If a block only has a heading (H2/H3/H4), also check the next block(s) for untranslated content in the same section.

## Wording Guidelines by Language

**All languages:** choose words conveying memory, witness, and learning — never leisure or entertainment.

| Language   | Prefer                                                       | Avoid                                                |
| ---------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| **Polish** | `zwiedzanie`, `upamiętnienie`, `pamięć`, `poznanie historii` | `wycieczka`, `wyjazd`, `wypad`, `wizyta turystyczna` |
| **German** | `Gedenkstättenbesuch`, `Besuch der Gedenkstätte`             | `Ausflug`, `Reise`                                   |
| **French** | `visite commémorative`, `visite du Mémorial`                 | `excursion`, `sortie`                                |

**"Book" = "reserve" (not "buy/purchase")** — Auschwitz entry cards can be free. In all languages, translate "book" as "reserve" (`zarezerwować` in Polish, not `kupić`).

## Content Block `heading` Field — Update Rules

The block-level `heading` richText field on Content blocks is a **section intro area**, not just a heading container. It typically holds:
- `[0]` heading node (h2/h3/h4)
- `[1]` empty paragraph (spacing)
- `[2+]` optional intro/description paragraphs with real text

**NEVER replace the entire heading field** with `hf()` to change heading text — this destroys intro content below the heading.

**To change heading text on an existing heading:**
Use `bh()` — text-only path that targets ONLY the text node inside the heading:
```
layout.$[id].heading.{locale}.root.children.0.children.0.text
```
This preserves all other nodes (empty paragraphs, description text).

**When the block heading field is empty** (first child is an empty paragraph):
The heading may live in column `richText` instead. Check the first column's richText for an h2 node. If found, update column text using `ch()`:
```
layout.$[bid].columns.$[cid].richText.{locale}.root.children.0.children.0.text
```

**For genuinely new headings** (no heading exists anywhere):
Use `hf()` to set the full block heading field. Include an empty paragraph after the heading node:
```ts
richText([heading(text, 'h2'), paragraph([])])
```

**`bh()` / `ch()` on non-existent nodes:** These helpers use `$set` on a deep dot-notation path (e.g. `children.0.children.0.text`). If any node along the path doesn't exist, MongoDB creates bare intermediate objects with **only** the terminal field — missing required Lexical fields (`type`, `detail`, `format`, `mode`, `style`, `version`). This causes `parseEditorState: type "undefined"` crashes. **Always verify the target text node exists** before using `bh()`/`ch()`. If it doesn't, use `hf()` with full Lexical structure instead.

**Pre-flight check (mandatory before batch updates):**
1. For each target block, query its `heading.en.root.children` — if childCount > 1, the field has intro content → use text-only `bh()` — but first confirm `children.0.children.0` has a `type` field (is a real text node). If the text node doesn't exist, use `hf()`.
2. If childCount = 1 and child is an empty paragraph → heading field is empty, check column richText for h2
3. If no heading anywhere → genuinely new, use `hf()` with full richText structure

**Array filter identifiers:** Hex IDs from plan tables are the block `id` field. Use `{ 'b1.id': '...' }` not `{ 'b1.blockName': '...' }`. Human-readable names like "booking" are `blockName`.

## MCP Safety

- **Always check for `visitauschwitz-cms-local` first** (dev server). Only fall back to `visitauschwitz-cms-prod` if local is unavailable.
- **WARNING — Layout arrays are REPLACED, not merged.** MCP `updatePages`/`updatePosts` replaces the entire `layout` array. Sending partial layout **deletes all blocks not included**.
- For **layout field updates**: use `scripts/update-locale.ts` with MongoDB positional array filters (`$[identifier]`). Run with `npx tsx scripts/update-locale.ts`.
- For **non-array fields** (title, slug, meta, hero): MCP partial updates work fine.
- Always use `select` param to limit response size (e.g., `select: { "layout": true }`).

## Lexical JSON Conventions

- Empty paragraph after headings: `{ type: "paragraph", children: [], ... }`
- Heading tag: `tag: "h2"` / `"h3"`
- Bold: `format: 1`, Italic: `format: 2`, Underline: `format: 8`
- Links: `type: "link"` wrapping text, `fields: { url, newTab, linkType: "custom" }`
