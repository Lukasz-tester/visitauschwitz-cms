import React from 'react'
import RichText from '@/components/RichText'
import { ImageMedia } from '@/components/Media/ImageMedia'

export type CodeBlockProps = {
  caption: Record<string, any>
  blockType: 'code'
  media?: any
}

type Props = CodeBlockProps & {
  className?: string
}

export const CodeBlock: React.FC<Props> = ({ media, caption }) => {
  return (
    <div className="mb-10 pt-5 place-self-center">
      <ImageMedia imgClassName="rounded mb-3" resource={media} />
      <div className="self-end items-end right-0">
        <RichText
          className="not-prose text-md text-gray-500 dark:text-gray-400"
          content={caption}
          enableProse={false}
          enableGutter={false}
        />
      </div>
    </div>
  )
}
