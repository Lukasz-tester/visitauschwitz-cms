'use client'

import React, { useState } from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type Props = Extract<Page['layout'][0], { blockType: 'oh' }>

const date = new Date()
const currentMonthNumber = date.getMonth()

export const OpeningHoursBlock: React.FC<
  Props & {
    id?: string
  }
> = ({ months, richText, description, enterBetweenTitle, freeFromTitle, leaveBeforeTitle }) => {
  const currentMonth = months?.[currentMonthNumber].month

  const [value, setValue] = useState(currentMonth)

  const onMonthChange = (monthToSet: string) => {
    setValue(monthToSet)
  }
  return (
    <div className="container">
      <div className="md:px-[17.3%] xl:px-[25%] p-11 place-content-center justify-between">
        <div className="text-base mb-8">
          {richText && <RichText content={richText} enableGutter={false} />}
        </div>
        <div className="text-lg lg:grid lg:grid-cols-2 place-content-between">
          <div className="mb-8">
            {description && <div className="mb-6 mr-6">{description}</div>}
            <Select onValueChange={onMonthChange} value={value}>
              <SelectTrigger className="w-auto bg-card md:pl-3 border border-border">
                <SelectValue placeholder={currentMonth} />
              </SelectTrigger>
              <SelectContent>
                {(months || []).map(({ month }, i) => (
                  <SelectItem key={i} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="p-5 rounded border border-border">
            {(months || []).map(({ month }, i) => (
              <div key={i}>
                {month === value && (
                  <div>
                    <div className="pb-1">{enterBetweenTitle + ' '} </div>
                    <div className="text-2xl pb-1">{months?.[i].enterBetween}</div>
                    <div className="mt-4 pb-1">{freeFromTitle}</div>
                    <div className="text-2xl pb-1">{months?.[i].freeFrom}</div>
                    <div className="mt-4 pb-1">{leaveBeforeTitle}</div>
                    <div className="text-2xl">{months?.[i].leaveBefore}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
