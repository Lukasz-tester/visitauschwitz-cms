import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') || 'en'

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'checklist' } },
    locale: locale as 'en' | 'pl',
    depth: 0,
    limit: 1,
  })

  const page = result.docs[0]
  if (!page) {
    return new Response('Checklist page not found', { status: 404 })
  }

  const title = escapeHtml(page.title || 'Before You Go — Preparation Checklist')
  const meta = (page as unknown as Record<string, unknown>).meta as { title?: string; description?: string } | undefined
  const metaTitle = escapeHtml(meta?.title || '')
  const metaDescription = escapeHtml(meta?.description || '')
  const layout = (page.layout as LayoutBlock[]) || []

  let contentHtml = ''
  for (const block of layout) {
    if (block.blockType === 'content') {
      // Render heading
      if (block.heading?.root) {
        contentHtml += renderLexical(block.heading.root)
      }
      // Render columns
      for (const col of block.columns || []) {
        if (col.richText?.root) {
          contentHtml += renderLexical(col.richText.root)
        }
      }
    }
  }

  const html = `<!DOCTYPE html>
<html lang="${escapeHtml(locale)}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${metaTitle || title} — visitauschwitz.info</title>
  <meta name="description" content="${metaDescription}" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: #1a1a1a;
      max-width: 700px;
      margin: 0 auto;
      padding: 24px 32px;
    }

    .header {
      text-align: center;
      padding-bottom: 16px;
      margin-bottom: 20px;
      border-bottom: 2px solid #1a1a1a;
    }

    .header h1 {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .header .description {
      font-size: 14px;
      color: #555;
      margin-bottom: 8px;
      line-height: 1.4;
    }

    .header .site {
      font-size: 13px;
      color: #666;
    }

    h2 {
      font-size: 16px;
      font-weight: 700;
      margin-top: 20px;
      margin-bottom: 8px;
      padding-bottom: 4px;
      border-bottom: 1px solid #ccc;
    }

    h3 {
      font-size: 14px;
      font-weight: 600;
      margin-top: 14px;
      margin-bottom: 6px;
    }

    p {
      margin-bottom: 8px;
    }

    p em, p i { color: #555; }

    ul {
      list-style: none;
      padding-left: 4px;
      margin-bottom: 12px;
    }

    ul li {
      padding: 2px 0;
      padding-left: 0;
      line-height: 1.45;
    }

    a {
      color: #1a1a1a;
      text-decoration: underline;
    }

    .footer {
      margin-top: 24px;
      padding-top: 12px;
      border-top: 1px solid #ccc;
      font-size: 12px;
      color: #888;
      text-align: center;
    }

    .print-btn {
      display: block;
      text-align: center;
      margin: 16px auto;
      padding: 10px 24px;
      background: #1a1a1a;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      text-decoration: none;
    }

    .print-btn:hover { background: #333; }

    @media print {
      body { padding: 0; font-size: 12px; }
      .header { margin-bottom: 12px; padding-bottom: 10px; }
      .header h1 { font-size: 18px; }
      h2 { font-size: 14px; margin-top: 14px; break-after: avoid; }
      ul li { padding: 1px 0; }
      .print-btn { display: none; }
      .footer { font-size: 10px; }
      a { color: #1a1a1a; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${metaTitle || title}</h1>
    ${metaDescription ? `<p class="description">${metaDescription}</p>` : ''}
    <div class="site">visitauschwitz.info</div>
  </div>

  <button class="print-btn" onclick="window.print()">Print this checklist</button>

  ${contentHtml}

  <div class="footer">
    visitauschwitz.info &mdash; Practical guide by a licensed Auschwitz guide since 2006
  </div>
</body>
</html>`

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

// --- Types ---

interface LexicalNode {
  type: string
  tag?: string
  text?: string
  format?: number | string
  listType?: string
  children?: LexicalNode[]
  fields?: { url?: string; newTab?: boolean; linkType?: string }
}

interface LayoutBlock {
  blockType: string
  heading?: { root: LexicalNode }
  columns?: { richText?: { root: LexicalNode }; size?: string }[]
}

// --- Lexical to HTML renderer ---

function renderLexical(node: LexicalNode): string {
  if (!node) return ''

  switch (node.type) {
    case 'root':
      return renderChildren(node)

    case 'heading': {
      const tag = node.tag || 'h2'
      const inner = renderChildren(node)
      return inner ? `<${tag}>${inner}</${tag}>` : ''
    }

    case 'paragraph': {
      const inner = renderChildren(node)
      return inner ? `<p>${inner}</p>` : ''
    }

    case 'list': {
      const tag = node.listType === 'number' ? 'ol' : 'ul'
      return `<${tag}>${renderChildren(node)}</${tag}>`
    }

    case 'listitem': {
      const inner = renderChildren(node)
      return `<li>${inner}</li>`
    }

    case 'link': {
      const url = escapeHtml(node.fields?.url || '#')
      const target = node.fields?.newTab ? ' target="_blank" rel="noopener"' : ''
      return `<a href="${url}"${target}>${renderChildren(node)}</a>`
    }

    case 'text': {
      let t = escapeHtml(node.text || '')
      const fmt = typeof node.format === 'number' ? node.format : 0
      if (fmt & 1) t = `<strong>${t}</strong>`
      if (fmt & 2) t = `<em>${t}</em>`
      if (fmt & 8) t = `<u>${t}</u>`
      return t
    }

    case 'linebreak':
      return '<br />'

    default:
      return renderChildren(node)
  }
}

function renderChildren(node: LexicalNode): string {
  return (node.children || []).map(renderLexical).join('')
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
