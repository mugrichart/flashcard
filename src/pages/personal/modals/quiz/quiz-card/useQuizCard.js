import { useState, useEffect, useRef } from "react";

import quizFormat from "../quiz-selector/quizFormat";

import cardFormatter from "./utils/cardFormatter";
import nextCard from "./utils/nextCard";

import { useSelector } from 'react-redux'

let interval = null;
import { AVERAGE_READING_SPEED_PER_CHAR, READING_BONUS_TIME as BONUS_TIME } from "../../../../../constants"

const enteringAudio = new Audio('/sounds/woosh.wav')
const tickAudio = new Audio('/sounds/tick-tock.wav')

const useQuizCard = (importedFormat, importedQuizType, importedQuizLength, order, deckLearnChunk, mode, formatRouter, handlePlay) => {
    const { _id: deckId, words: deck } = useSelector(state => state.deck.openDeck)
    const [card, setCard] = useState(deckLearnChunk[0]);
    const [correctOption, setCorrectOption] = useState(null);
    const [selectedItem, setSelectedItem] = useState({});
    const [optionArray, setOptionArray] = useState([]);
    const [quizDone, setQuizDone] = useState(false);
    const [topProSize, setTopProSize ] = useState(0);
    const [btmProSize, setBtmProSize] = useState(0);
    const [cardFormat, setCardFormat] = useState(null);

    const [cardTime, setCardTime] = useState(null);

    const [format, setFormat] = useState(importedFormat)
    const [ quizType, setQuizType ] = useState(importedQuizType)
    const [ quizLength, setQuizLength ] = useState(importedQuizLength)
    const [ wins, setWins ] = useState([])
    const hasPlayed = useRef(false)

    const [cardMotion, setCardMotion] = useState('card-entering-left');

    useEffect(() => {
      enteringAudio.volume = .05
      enteringAudio.currentTime = 0.3
      tickAudio.currentTime = 0
      tickAudio.volume = .02
      enteringAudio.play()
      return () => {
        enteringAudio.pause(), 
        tickAudio.pause()
      }
    }, [])

    const changeCard = (direction) => {
      let timerId;
      const delay = 700
      if (direction === '>') {
        setCardMotion('card-exiting-right');
        setTopProSize(0)
        timerId = setTimeout(() => {
          enteringAudio.currentTime = 0.2
          tickAudio.currentTime = 0
          tickAudio.volume = .02
          enteringAudio.play()
          setCardMotion('card-entering-left');
        }, delay);
      } else {
        setTopProSize(0)
        setCardMotion('card-exiting-left');
        timerId = setTimeout(() => {
          setCardMotion('card-entering-right');
        }, delay);
      }
      return () => clearTimeout(timerId);
    };
    
    useEffect(() => {
      (async() => {
        if (!card ) return
        hasPlayed.current = false;
        tickAudio.play()
        let formatted;
        if (["guided-learning", "quiz-game"].includes(mode)) {
          // const level = 7 //Math.round(Math.random() * 8) //card.level.level
          const level = card.level.level
          const { quizType, route, quizLength } = formatRouter(level)
          const format = quizFormat(route)
          setQuizType( quizType )
          setQuizLength( quizLength )
          formatted = await cardFormatter(deck, card, format, quizType, quizLength, blankedWordFinder)
          const totalChars = format.content.type === 'mcq' ?
            formatted.label0 + formatted.label1 + formatted.options?.reduce((acc, curr) => acc + (quizLength === 'long' ? curr[quizType] : curr.word), '') :
            labels[quizLength][quizType]  + formatted.question + formatted.answer
          setCardTime(totalChars.length * AVERAGE_READING_SPEED_PER_CHAR + BONUS_TIME)
          setFormat(format)
          setCardFormat(prev => ({...format, ...formatted}))
        }
        else {
          formatted = await cardFormatter(deck, card, format, quizType, quizLength, blankedWordFinder)
          const totalChars = format.content.type === 'mcq' ?
            formatted.label0 + formatted.label1 + formatted.options?.reduce((acc, curr) => acc + (quizLength === 'long' ? curr[quizType] : curr.word), '') :
            labels[quizLength][quizType]  + formatted.question + formatted.answer
          setCardTime(totalChars.length * AVERAGE_READING_SPEED_PER_CHAR + BONUS_TIME)
          console.log(formatted, '......formatted')
          setCardFormat(prev => ({...format, ...formatted}))
        }
        setOptionArray(formatted.options)
        setCorrectOption(formatted.corrOpt)
      })()
    },
    [card])


    useEffect(() => {
      if (!deck || cardMotion !== 'card-entering-left') return
      const stepTime = .1 // half a sec
      interval = setInterval(() => {
        setTopProSize(prev => {
          if (prev > 100) {
            clearInterval(interval); return prev
          }
          const percentage = prev + stepTime * 100 * 1000 / cardTime 
          // console.log(`percentage: ${percentage}`)
          if (percentage > 100) {
            if ( !(hasPlayed.current || quizDone) ) handleItemClick({value: 'no selection because of timeout'}, false);  // true on automatic for toks, otherwise, false
            clearInterval(interval)
            return 100
          }
          return percentage
          }
        )
      }, stepTime * 1000);

      return () => clearInterval(interval)
    }, [deck, cardMotion, cardTime, quizDone, handlePlay])

    useEffect(() => {
      if (interval !== null && quizDone) {
        clearInterval(interval);
        interval = null;
      }
    }, [quizDone])

    useEffect(() => {
      let delayId

      nextCard(setQuizDone, btmProSize, setBtmProSize, delayId, cardTime, quizType, deckLearnChunk, setCard, changeCard, setSelectedItem)
      
      return () => clearTimeout(delayId)
    }, [btmProSize])

    const handleItemClick = (item, correct) => {
            hasPlayed.current = true
            setWins(prev => [...prev, {...card?.level, result: (correct ? 1 : -1) }])
            setSelectedItem(item);
            tickAudio.volume = 0
            if (mode === "quiz-game") { // want to do this after server
              return handlePlay(
                [
                  correct,
                  () => {
                    setBtmProSize(prev =>  Math.round((Math.round(prev*deckLearnChunk.length/100) + 1) * 100/deckLearnChunk.length) ) 
                  }
                ]
              )
            }

            setBtmProSize(prev =>  Math.round((Math.round(prev*deckLearnChunk.length/100) + 1) * 100/deckLearnChunk.length) ) 
    };
    
    const blankedWordFinder = (example, blankedExample) => {
      const exHere = example.split(' ')
      // const blankedHere = blankedExample.split(' ')
      return exHere.filter(chunk => !blankedExample.includes(chunk)).join(' ')
    }

    const colors = (percentage) => {
      // Cap percentage between 0 and 100
      percentage = Math.max(0, Math.min(100, percentage));
    
      // Map percentage to HSL hue (120 is green, 0 is red)
      const hue = 120 - (percentage * 1.2); // 120 (green) to 0 (red)
    
      // Return HSL color string with full saturation and lightness of 50%
      return `hsl(${hue}, 100%, 50%)`;
    }
    
    

    return {
        correctOption, selectedItem, optionArray, quizDone, topProSize, btmProSize, cardFormat,
        cardMotion, deck, deckId, colors, handleItemClick, blankedWordFinder, card, 
        format, quizType, quizLength, wins
    }
}


export default useQuizCard

const labels = {
  'long': {
      'meaning': 'What is the meaning of ',
      'synonym': 'Give a synonym of ',
      'antonym': 'Give an antonym of ',
      'example': 'Make a sentence with '
  },
  'short': {
      'meaning': 'What is the word/expression for ',
      'synonym': 'Give a synonym of ',
      'antonym': 'Give an antonym of ',
      'example': 'Find a word/expression to fill in the blanks '
  }
};