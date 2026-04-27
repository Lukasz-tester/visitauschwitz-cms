function nodeText(node: any): string {
  if (node.type === 'text') return node.text || ''
  if (node.type === 'link')
    return (node.children || []).map((c: any) => nodeText(c)).join('')
  if (node.type === 'linebreak') return '\n'
  return ''
}

function childrenText(children: any[]): string {
  return (children || []).map(nodeText).join('')
}

export function hasRichTextContent(rt: any): boolean {
  // Handle localized richText (e.g., { en: {...}, pl: {...} })
  if (rt && typeof rt === 'object' && !rt.root) {
    // Check if any locale has content
    for (const locale in rt) {
      if (hasRichTextContent(rt[locale])) {
        return true
      }
    }
    return false
  }

  // Handle standard richText structure
  const root = rt?.root?.children
  if (!root) return false

  for (const node of root) {
    if (node.type !== 'heading' && node.type !== 'paragraph') continue
    if (!node.children?.length) continue
    const text = childrenText(node.children).trim()
    if (text) return true
  }

  return false
}
