import React, { useEffect, useRef, useState } from 'react';
import "./Performance.css"

import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material"
import { School as SchoolIcon, Quiz as QuizIcon } from '@mui/icons-material';

import { useDispatch, useSelector } from 'react-redux';
import { updateLearning } from '../guided-learning/utils/useLearning';

const perfEmojis = ['😥', '😔', '😬', '😌', '🤠',  '🤠', '😎', '🤩']
const perfLabels = ['Really??', "C'mon", 'Are you for real?', 'practice more', 'fair', 'good', "Sheesh", 'No way']

import { CHUNK_SIZE, CHUNK_TARGET_MASTERY_LEVEL } from '../../../../constants';
import { masteryUpdate } from '../../../../api/http';

const Performance = ({ wins, entireTopic, topicLearnChunk, mode, setUserDecision }) => {
  const [correct, setCorrect] = useState(null)

  const userId = JSON.parse(localStorage.getItem('user')).userId;
  const dispatch = useDispatch()
  const { _id: topicId } = useSelector(state => state.topic)
  
  const uploadingRight = useRef(true)
  const navigate = useNavigate();

  const perfRefs = [-1, 20, 40, 60, 80, 95, 99]


  useEffect(()=>{
    setCorrect(wins.filter(card => card.result > 0).length)
    if (!["guided-learning"].includes(mode)) return 
    const wordsMasteriesList = wins.map(win => ({word: win.word, level: win.level + win.result }))
    let newWordSet = topicLearnChunk.words.map(word => word._id)
    let { level, chunkIndex } = topicLearnChunk
    let levelUp = false
    if (wordsMasteriesList.every(word => word.level > topicLearnChunk.level)) {
      level++
      if ( level > 0 && level % CHUNK_TARGET_MASTERY_LEVEL === 0 ) {
        if ((chunkIndex + 1) * CHUNK_SIZE < entireTopic.length) { // if moving to the next chunk, increment chunk index, and reset level to the baseline of the current level
          chunkIndex++;
          level -= CHUNK_TARGET_MASTERY_LEVEL
        } else { // if done with round through the topic, start at chunk zero maintaining the level
          chunkIndex = 0
        }
        levelUp = true
        newWordSet = entireTopic.slice(chunkIndex * CHUNK_SIZE, chunkIndex * CHUNK_SIZE + CHUNK_SIZE).map(word => word._id)
      }
    }

    console.log(wordsMasteriesList, topicLearnChunk);

    (async (wordsMasteriesList, topicId, topicLearnChunk) => {
      if (uploadingRight.current === false) return
      uploadingRight.current = false;
      try {
        const result = await masteryUpdate(wordsMasteriesList, topicId, topicLearnChunk)
        console.log(entireTopic)
        updateLearning(dispatch, topicId, entireTopic )
        // dispatch(chooseTopic(result.topic))
        //console.log(result.msg, result.topic)
      } catch (error) { console.log(error) }
    })(wordsMasteriesList, topicLearnChunk.topic, {...topicLearnChunk, words: newWordSet, level, chunkIndex, levelUp})

  }, [wins])

  const perfGauge = (correct, wins) => {
    const perf = Math.round(correct * 100 /wins.length)
    perfRefs.push(perf)
    perfRefs.sort((a, b) => a - b)
    // //console.log([perfLabels[perfRefs.indexOf(perf)], perfEmojis[perfRefs.indexOf(perf)]])
    return [perfLabels[perfRefs.indexOf(perf)], perfEmojis[perfRefs.indexOf(perf)]]
  }

  return (
    <div className='performance'>
      <div className="performance--title">Performance</div><hr />
      <div className="performance--body">
        <div className="amount">
          <div className="label">Correct</div>
          <div className="number">{`${correct}/${wins?.length}`}</div>
          {/* <div className="display" style={{color: amountUp?'greenyellow':'red' }}>{ amountUp?<TrendingUpIcon />:<TrendingDownIcon />}</div> */}
        </div>
        <div className="speed">
          {/* <div className="label">Performance</div> */}
          {/* <div className="number">{conclusion}{emoji}</div> */}
          <div className="number">{perfGauge(correct, wins)[0]}{perfGauge(correct, wins)[1]}</div>
          {/* <div className="display" style={{color: speedUp?'greenyellow':'red'}}>{ speedUp?<TrendingUpIcon />:<TrendingDownIcon /> }</div> */}
        </div>
        <div className="time">
          <div className="label">Accuracy</div>
          <div className="number">{Math.round(correct * 100 /wins.length)}%</div>
          {/* <div className="display" style={{color: timeUp?'red':'greenyellow'}}>{ timeUp?<TrendingUpIcon />:<TrendingDownIcon /> }</div> */}
        </div>
      </div>
      <div className="performance--foot">
        <Button startIcon={<SchoolIcon />} variant="contained" disableElevation color='primary' onClick={() => navigate(`../learning/?topic=${topicId}`)}>Revise the topic</Button>
        <Button startIcon={<QuizIcon />} variant="contained" disableElevation color='primary' onClick={() => ["guided-learning"].includes(mode) ? setUserDecision('') : insane(navigate, topicId)}>Continue</Button>
      </div>
    </div>
  )
}
export default Performance

const insane = (navigate, topicId) => {
  //console.log(topicId)
  const timerId = setTimeout(() => {
    navigate(`?topic=${topicId}`)
  }, 500);

  return () => clearTimeout(timerId)
}