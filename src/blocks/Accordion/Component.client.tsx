'use client'
import { useState } from 'react'

import { cn } from 'src/utilities/cn'
import React from 'react'
import RichText from '@/components/RichText'
import { ChevronDown, ChevronUp } from 'lucide-react'

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
      className={cn('w-full mx-0 py-1 place-self-center', {
        'bg-card': changeBackground,
      })}
    >
      <div //each content block receives unique id = blockName for internal linking
        className="container"
        id={props.blockName || undefined}
      >
        <div className="md:px-[17.3%]">
          {heading && (
            <RichText
              // no text > no text direction > no padding
              className={`${heading?.root?.direction !== null ? '' : ''}`}
              content={heading}
              enableGutter={false}
            />
          )}

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
    </div>
  )
}

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  const contentHeight = React.useRef<HTMLInputElement>(null)

  return (
    <div
      className={`[&_*]:ease-in-out [&_*]:duration-700 mb-1 overflow-clip bg-card rounded border hover:border-amber-600 dark:hover:border-amber-700/70
        ${isOpen ? 'border-amber-600 dark:border-amber-700/70' : ''}`}
    >
      <button
        className={` w-full p-3 text-start text-xl flex place-content-between
          ${isOpen ? 'bg-card-foreground' : ''}`}
        onClick={onClick}
      >
        <h3>{question}</h3>
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </button>
      <div className={`px-5 ${isOpen ? 'py-5' : ''}`}>
        <div
          ref={contentHeight}
          style={isOpen ? { height: contentHeight.current?.scrollHeight } : { height: '0px' }}
        >
          <RichText content={answer} enableGutter={false} />
        </div>
      </div>
    </div>
  )
}
