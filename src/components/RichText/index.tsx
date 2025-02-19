import { cn } from '@/utilities/cn'
import React from 'react'

import { serializeLexical } from './serialize'

type Props = {
  className?: string
  content: Record<string, any>
  enableGutter?: boolean
  enableProse?: boolean
  styleLink?: boolean
  styleH1?: boolean
  styleH2?: boolean
  styleH3?: boolean
  styleH4?: boolean
}

const RichText: React.FC<Props> = ({
  className,
  content,
  enableGutter = true,
  enableProse = true,

  styleLink = false,
  styleH1 = false,
  styleH2 = true,
  styleH3 = true,
  styleH4 = true,
}) => {
  if (!content) {
    return null
  }

  return (
    <div
      className={cn(
        {
          'container ': enableGutter,
          'max-w-none ': !enableGutter,
          'prose dark:prose-invert opacity-85 dark:opacity-80 prose-a:decoration-amber-600 dark:prose-a:decoration-amber-700 hover:prose-a:bg-amber-600 dark:hover:prose-a:bg-amber-700':
            enableProse,
          'md:prose-h1:text-7xl opacity-90': styleH1,
          'lg:prose-h2:text-5xl ': styleH2,
          'lg:prose-h3:text-4xl ': styleH3,
          'lg:prose-h4:text-2xl ': styleH4,
          'prose-a:bg-card prose-a:no-underline prose-a:rounded prose-a:p-2 prose-a:text-[22px] prose-a:border prose-a:border-card-foreground ':
            styleLink,
        },
        className,
      )}
    >
      {content &&
        !Array.isArray(content) &&
        typeof content === 'object' &&
        'root' in content &&
        serializeLexical({ nodes: content?.root?.children })}
    </div>
  )
}

export default RichText
