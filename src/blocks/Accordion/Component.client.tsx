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
      className={cn('rounded my-11 pb-11', {
        'bg-card': changeBackground,
      })}
    >
      {/* each content block receives unique id = blockName */}
      <div className="container" id={props.blockName || undefined}>
        {heading && (
          <RichText
            className="pt-11 pb-9
          md:prose-h2:text-4xl
          xl:prose-h2:text-5xl xl:prose-h3:text-3xl"
            content={heading}
            enableGutter={false}
          />
        )}
        <div className="">
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
    <div className="my-1 md:mx-16 2xl:mx-52 overflow-clip bg-card">
      <button
        className={`w-full p-4 text-start ease-in-out duration-700
          text-lg md:text-xl 2xl:text-2xl  
          ${isOpen ? 'bg-card-foreground' : ''}`}
        onClick={onClick}
      >
        <p>{question}</p>
        {/* <RiArrowDropDownLine className={`arrow ${isOpen ? 'active' : ''}`} /> */}
      </button>
      <div
        className={`${isOpen ? 'py-6 ease-in-out duration-700 left-4' : 'ease-in-out duration-700'}`}
      >
        <div
          className="ease-in-out duration-700"
          ref={contentHeight}
          style={isOpen ? { height: contentHeight.current?.scrollHeight } : { height: '0px' }}
        >
          <RichText content={answer} />
        </div>
      </div>
    </div>
  )
}
