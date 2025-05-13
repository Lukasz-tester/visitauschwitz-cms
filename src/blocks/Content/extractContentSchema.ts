export function extractContentSchema(block, fullUrl) {
  if (block.blockType !== 'content') return null

  const extractText = (richText) => {
    if (!richText?.root?.children) return ''
    const traverse = (nodes) =>
      nodes
        .map((node) => {
          if (node.text) return node.text
          if (node.children) return traverse(node.children)
          return ''
        })
        .join(' ')
    return traverse(richText.root.children).trim()
  }

  const extractFirstHeading = (headingRoot) => {
    if (!headingRoot?.children) return null
    for (const child of headingRoot.children) {
      if (child.type === 'heading' && (child.tag === 'h2' || child.tag === 'h3')) {
        return extractText({ root: { children: [child] } })
      }
    }
    return null
  }

  const contentItems: {
    '@type': string
    name: string
    url: string
    description?: string
    image?: string
  }[] = []

  const filteredColumns = block.columns?.filter((col) => col.size !== 'oneSixth') || []

  for (const column of filteredColumns) {
    const textStart = extractText(column.richText)
    const textEnd = extractText(column.richTextEnd)
    const combinedText = (textStart + ' ' + textEnd).trim()

    // Check for media items with a valid media URL
    const mediaUrl =
      column.enableMedia && column.media?.url
        ? process.env.PAYLOAD_PUBLIC_SERVER_URL + column.media.url
        : undefined

    const mediaName = column.media?.filename
    const mediaDescription = column.media?.alt

    const id = column.id || Math.random().toString(36).slice(2)

    if (!combinedText && !mediaUrl && !mediaName) continue // Skip completely empty items

    // Construct the content item
    const contentItem: {
      '@type': string
      name: string
      url: string
      description?: string
      image?: string
    } = {
      '@type': mediaName && mediaDescription ? 'ImageObject' : 'WebPageElement', // Only 'ImageObject' if mediaName and mediaDescription are present
      name: mediaName || combinedText.slice(0, 60) || 'Content', // Use media.filename or combined text for name
      url: `${fullUrl}#${id}`,
      description: mediaDescription || combinedText || undefined, // Use media.alt or combined text for description
    }

    // Only add the image if mediaUrl is valid and it's an image item
    if (mediaUrl && mediaName && mediaDescription) {
      contentItem.image = mediaUrl
    }

    contentItems.push(contentItem)
  }

  const headingText = extractFirstHeading(block.heading?.root)
  const blockDescription = contentItems
    .map((item) => item.description)
    .filter(Boolean)
    .join(' ')
    .slice(0, 500)

  const blockId = block.id || block.blockName || Math.random().toString(36).slice(2)

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPageElement',
    name: headingText || 'Content Section',
    url: `${fullUrl}#${blockId}`,
    description: blockDescription || undefined,
    hasPart: contentItems,
  }
}
