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
          'prose dark:prose-invert break-words empty:prose-p:py-0.5 prose-p:opacity-90 prose-strong:opacity-90 prose-h2:opacity-75 prose-h3:opacity-80 prose-h4:opacity-85 prose-a:decoration-amber-700/80 dark:hover:prose-a:bg-amber-700/80 hover:prose-a:bg-amber-700/90 hover:prose-a:text-white/90 ':
            enableProse,
          'md:prose-h1:text-5xl lg:prose-h1:text-[4.1rem] opacity-85': styleH1,
          'md:prose-h2:text-4xl lg:prose-h2:text-5xl ': styleH2,
          'md:prose-h3:text-3xl lg:prose-h3:text-4xl ': styleH3,
          'lg:prose-h4:text-2xl': styleH4,
          'prose-a:bg-card-foreground prose-a:text-nowrap prose-a:p-2 prose-a:mx-0.5 prose-a:font-normal prose-a:no-underline prose-a:rounded-xl prose-a:text-xl prose-a:leading-[2.6] gap-9 prose-a:border prose-a:border-slate-500/40 hover:prose-a:border-amber-700/80 dark:hover:prose-a:border-white/80 hover:prose-a:text-white/90 dark:hover:prose-a:text-white/90 ':
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
