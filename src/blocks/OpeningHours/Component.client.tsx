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
> = ({ months, richText, enterBetweenTitle, freeFromTitle, leaveBeforeTitle }) => {
  const currentMonth = months?.[currentMonthNumber].month

  const [value, setValue] = useState(currentMonth)

  const onMonthChange = (monthToSet: string) => {
    setValue(monthToSet)
  }
  return (
    <div className="container">
      <div className="md:px-[17.3%] grid xl:grid-cols-2">
        <div className="xl:mr-7">
          {richText && <RichText content={richText} enableGutter={false} />}
        </div>
        <div className="text-xl rounded border border-border bg-card xl:ml-7">
          <div className="justify-items-end">
            <Select onValueChange={onMonthChange} value={value}>
              <SelectTrigger className="w-auto bg-card-foreground px-3 border border-border">
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
          {(months || []).map(({ month }, i) => (
            <div key={i}>
              {month === value && (
                <div className="p-5">
                  <div className="pb-2">{enterBetweenTitle + ' '} </div>
                  <div className="text-3xl pb-2">{months?.[i].enterBetween}</div>
                  <div className="mt-4 pb-2">{freeFromTitle}</div>
                  <div className="text-3xl pb-2">{months?.[i].freeFrom}</div>
                  <div className="mt-4 pb-2">{leaveBeforeTitle}</div>
                  <div className="text-3xl pb-2">{months?.[i].leaveBefore}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
