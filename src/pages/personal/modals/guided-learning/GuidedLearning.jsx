import React, { useState, useEffect } from 'react'
import ProgressBar from '@ramonak/react-progress-bar'
import { Button } from '@mui/material'
import './GuidedLearning.css'
import QuizCard from '../quiz/quiz-card/QuizCard'

import CardLearn from '../card-learn/CardLearn'

import { useSelector } from 'react-redux'
import usePageRefreshHandle from '../../../../utils/usePageRefreshHandle'

import formatRouter from "./utils/formatRouter"

import {  CHUNK_SIZE, CHUNK_TARGET_MASTERY_LEVEL, TARGET_PERFECT_LEVEL } from "../../../../constants";

const GuidedLearning = () => {
  const { _id: deckId, deckName, words, learning } = useSelector(state => state.deck.openDeck)
  const [craming, setCraming] = useState(false)
  const [userDecision, setUserDecision] = useState(false)
  const handleRefresh = usePageRefreshHandle()

  useEffect(() => {
    handleRefresh(deckId)
  }, [deckId])  

  console.log(learning)
  useEffect(() => {
    if (userDecision) {
      setCraming(learning.level % CHUNK_TARGET_MASTERY_LEVEL === 0)
    }
  }, [userDecision])

  return (
      userDecision ? (
        craming ?
          <CardLearn deckLearningChunk={{deckName, words: learning.words}}  setCraming={setCraming} /> :
          learning.words.length && <QuizCard importedFormat={'placeholder'} importedQuizType={'placeholder'} importedQuizLength={'placeholder'} order={'placeholder'} deckLearnChunk={learning} mode="guided-learning" formatRouter={formatRouter} setUserDecision={setUserDecision} />
        ) :
        <LearningDashboarb deckName={deckName} learning={learning} words={words} setUserDecision={setUserDecision}/>
  )
}

export default GuidedLearning

const LearningDashboarb = ({ deckName, learning, words, setUserDecision }) => {
  if (!learning?.words ) return
  const [chunkPerc] = useState(Math.round(learning?.words?.reduce((acc, curr) => acc + curr.level.level, 0) * 100 / (learning.words.length * TARGET_PERFECT_LEVEL) || 0))
  const [deckPerc] = useState(Math.floor( Math.floor(learning.level / CHUNK_TARGET_MASTERY_LEVEL) * words.length + learning.chunkIndex * CHUNK_TARGET_MASTERY_LEVEL + learning.level % CHUNK_TARGET_MASTERY_LEVEL * words.slice(learning.chunkIndex * CHUNK_SIZE, learning.chunkIndex * CHUNK_SIZE + CHUNK_SIZE).length * 100 / (words.length * TARGET_PERFECT_LEVEL) ) )

  const [currDisplay, setCurrDisplay] = useState(0)
  
  useEffect(() => {
    let intId;
    intId = setInterval(() => {
      setCurrDisplay(prev => {
        if (!(prev < (2 + learning.words.length))) clearInterval(intId)
        return prev + 1
      })
      if (currDisplay < (3 + learning.words.length)) setCurrDisplay(prev => prev + 1)
      else return clearInterval(intId)
    }, 500);

    return () => clearInterval(intId)
  }, [])

  return (
  <div className='Guided-learn'>
    <h2>{deckName}</h2>
    {learning.words.length ?
      <>
        <div>
          <div>
            <h4>Slice {learning.chunkIndex + 1}</h4>
            {currDisplay >= 0 && <ProgressBar completed = {chunkPerc} bgColor = 'gold' transitionDuration='.5s' labelAlignment='left' animateOnRender='true'/>}
          </div>
          <div>
            <h4>Whole deck</h4>
            { currDisplay > 0 && <ProgressBar completed = {deckPerc} bgColor = 'gold' transitionDuration='.5s' labelAlignment='left' animateOnRender='true'/> }
          </div>
          <div>
            <h3>Details for slice {learning.chunkIndex + 1}</h3>
            <div className='details'>
              {
                learning.words.map((word, indexHere) => currDisplay > (1 + indexHere) && <ProgressBar key={word._id} completed = {Math.round(word.level.level * 100 / TARGET_PERFECT_LEVEL)} bgColor = 'gold' transitionDuration='.5s' customLabel={word.word} labelAlignment='left' height='1.5em' borderRadius='10px' animateOnRender='true'/>
                )
              }
            </div>
          </div>
        </div>
        <div className='continue-btn-div'>
          <Button className='continue-btn' variant="contained" disableElevation color='primary' onClick={() => setUserDecision(true)}>Continue</Button>
        </div>
      </> :
      <div> -- empty deck --</div>
    }
  </div>
  )
}