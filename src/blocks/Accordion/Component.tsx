'use client'
import React, { useRef, useState } from 'react'
import data from './data'

//  accordionitem component
const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  const contentHeight = React.useRef<HTMLInputElement>(null)

  console.log('contentHeight', contentHeight.current)

  return (
    <div className="wrapper bg-card">
      <button className={`question-container ${isOpen ? 'active' : ''}`} onClick={onClick}>
        <p className="question-content">{question}</p>
        {/* <RiArrowDropDownLine className={`arrow ${isOpen ? 'active' : ''}`} /> */}
      </button>

      <div
        ref={contentHeight}
        className="answer-container"
        style={isOpen ? { height: contentHeight.current?.scrollHeight } : { height: '0px' }}
      >
        <p className="answer-content">{answer}</p>
      </div>

      <style jsx>{`
        .container {
          max-width: 650px;
          width: 100%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .wrapper {
          border-bottom: 1px solid black;
          overflow: hidden;
        }
        .wrapper .question-container {
          width: 100%;
          text-align: left;
          padding: 20px 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 500;
          font-size: 20px;
          background: transparent;
          border: none;
          cursor: pointer;
        }
        .question-container.active {
          color: #1db954;
          background-image: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.04), transparent);
        }
        .wrapper .question-container:hover {
          background-image: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.04), transparent);
        }
        .wrapper .arrow {
          transition: 0.5s ease-in-out;
        }
        .arrow.active {
          rotate: 180deg;
          color: #1db954;
        }
        .wrapper .answer-container {
          padding: 0 1rem;
          transition: height 0.7s ease-in-out;
        }
        .wrapper .answer-content {
          padding: 1rem 0;
          font-style: italic;
        }
      `}</style>
    </div>
  )
}

const Accordion = () => {
  const [activeIndex, setActiveIndex] = useState(null)

  const handleItemClick = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index))
  }

  return (
    <div className="container">
      {data.map((item, index) => (
        <AccordionItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={activeIndex === index}
          onClick={() => handleItemClick(index)}
        />
      ))}
    </div>
  )
}

export default Accordion
