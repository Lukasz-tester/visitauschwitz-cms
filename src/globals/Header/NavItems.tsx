import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

const NavItems: React.FC<{ header: HeaderType, onClick?(): void }> = ({ header, onClick }) => {
  const navItems = header?.navItems || []

  return (
    <>
      {navItems.map(({ link }, i) => (
        <CMSLink
          key={i}
          {...link}
          onClick={onClick}
          appearance="link"
          className="p-3 pl-5 text-2xl lg:text-3xl opacity-85"
        />
      ))}
    </>
  )
}

export default NavItems
