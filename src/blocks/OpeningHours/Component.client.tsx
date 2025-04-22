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
      <div className="md:px-[17.3%] pt-14 grid xl:grid-cols-2">
        <div className="text-xl rounded border border-slate-500/40 bg-card xl:mr-7">
          <div className="justify-items-end">
            <Select onValueChange={onMonthChange} value={value}>
              <SelectTrigger
                aria-label="Select month"
                className="w-auto bg-card-foreground pl-3 pr-1 border-spacing border-slate-500/40 hover:bg-amber-700/80 hover:text-white/90"
              >
                <SelectValue />
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
        <div className="mt-12 xl:mt-0 xl:ml-7">
          {richText && <RichText content={richText} enableGutter={false} styleLink={true} />}
        </div>
      </div>
    </div>
  )
}
