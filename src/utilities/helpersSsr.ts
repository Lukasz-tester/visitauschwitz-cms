export const removeSpecialChars = (text: string) => {
  let cleanedText = text.replace(/[\p{So}\p{C}]|\u200B|\u200C|\u200D|↓/gu, '')
  cleanedText = cleanedText.trim()
  cleanedText = cleanedText.replace(/\s+/g, ' ')
  return cleanedText
}

//BELOW this old version:
export const extractTextFromRichText = (richText: any, maxLength: number = 250) => {
  if (!richText || !richText.root || !Array.isArray(richText.root.children)) {
    return ''
  }

  // Recursively extract text from children
  const extractText = (children: any[]): string => {
    return children
      .map((child) => {
        if (child.text) {
          return child.text
        }
        // If there are nested children, recurse to extract their text
        if (child.children) {
          return extractText(child.children)
        }
        return ''
      })
      .join(' ') // Join text nodes with space
  }

  const fullText = extractText(richText.root.children)

  // If the text is short enough, return it as is
  if (fullText.length <= maxLength) {
    return fullText
  }

  // Truncate the text at the maximum length and ensure it ends at a sentence boundary
  const truncatedText = fullText.slice(0, maxLength)
  const lastSpaceIndex = truncatedText.lastIndexOf(' ')
  let truncatedSentence = truncatedText.slice(0, lastSpaceIndex)

  // Ensure it ends at a punctuation mark
  const sentenceEndIndex = Math.max(
    truncatedSentence.lastIndexOf('.'),
    truncatedSentence.lastIndexOf('?'),
    truncatedSentence.lastIndexOf('!'),
  )

  if (sentenceEndIndex !== -1) {
    truncatedSentence = truncatedSentence.slice(0, sentenceEndIndex + 1)
  }

  // Add ellipsis if truncation occurred
  return truncatedSentence + '...'
}
