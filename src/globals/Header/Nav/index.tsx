import React from 'react'

import type { Header as HeaderType } from '@/payload-types'
import NavItems from '../NavItems'
import { useMediaQuery } from '@/utilities/helpers'

export const HeaderNav: React.FC<{ header: HeaderType }> = ({ header }) => {
  const isWideScreen = useMediaQuery('(min-width: 768px)')

  return (
    <nav className={`flex-wrap ease-in-out duration-1000 pr-4 ${isWideScreen ? '' : 'hidden'}`}>
      <div className="flex items-center">
        <NavItems header={header} />
      </div>
    </nav>
  )
}
