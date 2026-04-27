import { hasRichTextContent } from './hasRichTextContent'

type Column = {
  size?: string
  richText?: any
  richTextEnd?: any
  media?: any
  enableMedia?: boolean
  id?: string
}

type ContentBlock = {
  blockType: string
  heading?: any
  columns?: Column[]
  blockName?: string
}

function cleanColumn(col: Column): Column {
  const cleaned: Column = { ...col }

  // For oneSixth columns, keep only size for spacing
  if (col.size === 'oneSixth') {
    return { size: 'oneSixth', id: col.id }
  }

  // Remove empty richText
  if (!hasRichTextContent(col.richText)) {
    delete cleaned.richText
  }

  // Remove empty richTextEnd
  if (!hasRichTextContent(col.richTextEnd)) {
    delete cleaned.richTextEnd
  }

  // Remove null/undefined media
  if (!col.media) {
    delete cleaned.media
  }

  return cleaned
}

function filterContentBlock(block: ContentBlock): ContentBlock | null {
  if (block.blockType !== 'content') {
    return block
  }

  const filteredBlock: ContentBlock = { ...block }

  // Filter columns
  if (block.columns) {
    // Clean all columns (oneSixth columns are stripped to just size for spacing)
    const cleanedColumns = block.columns.map(cleanColumn)

    // Keep the block even if all columns are empty (for spacing)
    filteredBlock.columns = cleanedColumns
  }

  // Remove empty heading
  if (block.heading && !hasRichTextContent(block.heading)) {
    delete filteredBlock.heading
  }

  return filteredBlock
}

export function filterLayout(layout: any[]): any[] {
  if (!layout) return []

  return layout
    .map(filterContentBlock)
    .filter((block): block is ContentBlock => block !== null)
}
