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
      className={cn('pb-11', {
        'bg-card': changeBackground,
      })}
    >
      {/* each content block receives unique id = blockName */}
      <div className="container" id={props.blockName || undefined}>
        {heading && (
          <RichText
            className="py-11 pb-3 lg:mx-32 xl:mx-64
          md:prose-h2:text-5xl
          xl:prose-h2:text-6xl xl:prose-h3:text-3xl"
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
  )
}

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  const contentHeight = React.useRef<HTMLInputElement>(null)

  return (
    <div className="my-1 overflow-clip bg-card rounded border border-border lg:mx-32 xl:mx-64">
      <button
        className={`w-full p-4 text-start ease-in-out duration-700
          text-xl
          ${isOpen ? 'bg-card-foreground font-semibold' : ''}`}
        onClick={onClick}
      >
        <p>{question}</p>
        {/* <RiArrowDropDownLine className={`arrow ${isOpen ? 'active' : ''}`} /> */}
      </button>
      <div className={`${isOpen ? 'py-6 ease-in-out duration-700' : 'ease-in-out duration-700'}`}>
        <div
          className="ease-in-out duration-700 flex"
          ref={contentHeight}
          style={isOpen ? { height: contentHeight.current?.scrollHeight } : { height: '0px' }}
        >
          <RichText content={answer} />
        </div>
      </div>
    </div>
  )
}
