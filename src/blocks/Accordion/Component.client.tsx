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
  const { accordionItems, changeBackground } = props

  const [activeIndex, setActiveIndex] = useState(null)
  const handleItemClick = (inndex) => {
    setActiveIndex((prevIndex) => (prevIndex === inndex ? null : inndex))
  }
  return (
    <div
      className={cn('w-full m-0 place-self-center', {
        // 'bg-gradient-to-r from-transparent via-slate-800/30 to-transparent': changeBackground,
        'bg-card-foreground': changeBackground,
      })}
    >
      <div //each content block receives unique id = blockName for internal linking
        className="container"
        id={props.blockName || undefined}
      >
        <div className="md:px-[17.3%]">
          {accordionItems &&
            accordionItems.length > 0 &&
            accordionItems.map((item, index) => {
              return (
                <div key={index} className="py-1">
                  <AccordionItem
                    key={index}
                    answer={item.answer}
                    question={item.question}
                    isOpen={activeIndex === index}
                    onClick={() => handleItemClick(index)}
                    changedBackground={changeBackground}
                  />
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

const AccordionItem = ({ question, answer, isOpen, onClick, changedBackground }) => {
  const contentHeight = React.useRef<HTMLInputElement>(null)

  return (
    <div
      className={`[&_*]:ease-in-out [&_*]:duration-700 overflow-clip rounded-xl border border-slate-500/30 hover:border-amber-600 dark:hover:border-amber-700/70
        ${isOpen ? 'border-amber-600 dark:border-amber-700/70' : ''}
        ${changedBackground ? 'bg-background' : 'bg-card'}`}
    >
      <button
        className={` w-full p-3 text-start text-xl opacity-85 flex place-content-between
          ${isOpen ? 'bg-card-foreground' : ''}
          ${changedBackground ? '' : ''}`}
        onClick={onClick}
      >
        <h3>{question}</h3>
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </button>
      <div className={`px-5 ${isOpen ? 'pt-5 pb-2' : ''}`}>
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
