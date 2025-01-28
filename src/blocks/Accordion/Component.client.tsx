'use client'
import { useState } from 'react'

import { cn } from 'src/utilities/cn'
import React from 'react'
import RichText from '@/components/RichText'

import type { Page } from '@/payload-types'

type Props = Extract<Page['layout'][0], { blockType: 'accordion' }>

export const AccordionBlock: React.FC<
  {
    id?: string
  } & Props
> = (props) => {
  const { accordionItems, heading, changeBackground } = props

  const [activeIndex, setActiveIndex] = useState(null)
  const handleItemClick = (inndex) => {
    setActiveIndex((prevIndex) => (prevIndex === inndex ? null : inndex))
  }

  return (
    <div
      className={cn('md:px-[17.3%] mx-0 pb-1', {
        'bg-card': changeBackground,
      })}
    >
      {/* each content block receives unique id = blockName */}
      <div className="container" id={props.blockName || undefined}>
        {heading && <RichText className="pt-11 pb-8" content={heading} enableGutter={false} />}

        {accordionItems &&
          accordionItems.length > 0 &&
          accordionItems.map((item, index) => {
            return (
              <AccordionItem
                key={index}
                answer={item.answer}
                question={item.question}
                isOpen={activeIndex === index}
                onClick={() => handleItemClick(index)}
              />
            )
          })}
      </div>
    </div>
  )
}

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  const contentHeight = React.useRef<HTMLInputElement>(null)

  return (
    <div
      className={`[&_*]:ease-in-out [&_*]:duration-700 mb-1 overflow-clip bg-card rounded border ${isOpen ? 'border-amber-700 dark:border-amber-700/50' : ''}`}
    >
      <button
        className={`w-full p-3 text-start text-xl flex place-content-between
          ${isOpen ? 'bg-card-foreground' : ''}`}
        onClick={onClick}
      >
        <p>{question}</p>
        <div className="font-extrabold">{isOpen ? '<' : '>'}</div>
      </button>
      <div className={`px-4 ${isOpen ? 'py-2' : ''}`}>
        <div
          className="flex"
          ref={contentHeight}
          style={isOpen ? { height: contentHeight.current?.scrollHeight } : { height: '0px' }}
        >
          <RichText content={answer} enableGutter={false} />
        </div>
      </div>
    </div>
  )
}
