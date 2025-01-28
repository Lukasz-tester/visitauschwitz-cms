import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      richText?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, richText }) => {
  return (
    <div className="md:px-[17.3%] mt-16">
      <div className="container">
        {children ||
          (richText && <RichText content={richText} enableGutter={false} styleH1={true} />)}
      </div>
    </div>
  )
}
