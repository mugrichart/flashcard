import React, { useEffect, useState } from 'react';
import QuizCard from '../quiz-card/QuizCard';
import quizFormat from './quizFormat';

import './Quiz.css';

import shuffledNumbers from '../../../../../utils/shuffleArray';

import { useSelector } from 'react-redux';

const Quiz = () => {
  const deck  = useSelector(state => state.deck.openDeck)
  const order = shuffledNumbers(deck.words?.length - 1).slice(0, 10)

  const [questionTypes, setQuestionTypes] = useState(['mcq', 'guess'])
  const [answerTypes, setAnswerTypes] = useState(['meaning', 'example', 'synonym', 'antonym']);
  const [answerLengths, setAnswerLengths] = useState(['short', 'long'])
  const [quizOn, setQuizOn ] = useState(false)

  const [quizType, setQuizType] = useState(null)
  const [quizLength, setQuizLength] = useState(null)
  const [format, setFormat] = useState(null)

  const handleSubmit = () => {
    if ( !(answerLengths[0] && questionTypes[0] && answerTypes[0]) ) return 
    const route = `quiz-${answerLengths[0]}-${questionTypes[0]}`;
    setFormat(quizFormat(route))
    setQuizLength(route.split('-')[1])
    setQuizType(answerTypes[0])
    setQuizOn(true)
  }

  return (
       !quizOn ?
        <div className='quiz'>
          <h1 className="quiz-head">Choose one everywhere</h1>
          <div className="quiz-body">
            <div className="quiz-question-type">
                <div className="title">Type of question</div>
                <div className="content">
                    { questionTypes.map((item) => {
                      return <button className='quiz-QT custom-button-1' key={item} onClick={(e) => setQuestionTypes([item])}>{item}</button>
                    })}
                </div>
            </div>
            <div className="quiz-answer-type">
                <div className="title">Type of answer</div>
                <div className="content">{answerTypes.map((item) => {return <button className='quiz-AT custom-button-1' key={item}  onClick={(e) => setAnswerTypes([item])}>{item}</button>})}</div>
            </div>
            <div className="quiz-answer-length">
                <div className="title">Length of answer</div>
                <div className="content">{
                  answerLengths.map((item) => {
                    return <button className='quiz-AL custom-button-1' key={item} onClick={(e) => setAnswerLengths([item])}>{item}</button>
                  })
                }</div>
            </div>
          </div>
          <input className="quiz-submit" onClick={() => {handleSubmit()}} type='submit' value={'submit'} />
        </div> 
       :
      deck.words?.length && 
      <QuizCard 
        importedFormat={format} importedQuizType={quizType} 
        importedQuizLength={quizLength} order={order} 
        deckLearnChunk={{ words: order.map(i => deck.words[i]) }} 
        autoMode={false} formatRouter={'placeholder'}
        words={deck.words} deckId={deck._id || deck.deckId}
      />
  )
}

export default Quiz
