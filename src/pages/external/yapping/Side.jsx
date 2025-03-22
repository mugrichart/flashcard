import React, { useState, useEffect} from 'react';

import shuffledNumbers from '../../../utils/shuffleArray';

const Side = (
  { stories, setWords, words, selectedWords, setSelectedWords, okAttempt, 
    currSentence, setSelected, setActivity, activity, setTitle, story, setStory, selected, correctWordSet, updateAttempt
  }) => {

  const [wordSetToDisplay, setWordSetToDisplay] = useState([])
  
  useEffect(() => {
    if (correctWordSet.length && activity === 'practicing') {
      const wordsToDisplay = shuffledNumbers(words.length - 1).slice(0, 3).map((randIndex) => words[randIndex]).concat(correctWordSet)
      const randomizedOrder = shuffledNumbers(wordsToDisplay.length - 1).map(randomIndex => wordsToDisplay[randomIndex])
      setWordSetToDisplay(randomizedOrder)
    }
  }, [correctWordSet])

  console.log("words: ", words)

  return (
    <div className={`side ${activity? '': "side-wide"}`}>
        <div>
          {{creating: false, practicing: okAttempt?.split('.')?.length < 2 }[activity] &&
              <p>
                {activity === 'practicing' ? 
                              'Use the right word(s) from this set!' : 
                selectedWords?.length === 0 && 'Pick the word(s) you are about to use!'}
              </p> 
          }
        </div>
        <>
          {
            <div className='side-pool word-pool'>
            {(activity === 'practicing' ? wordSetToDisplay : words.filter(word => !selectedWords.includes(word))).map((word, i) => (
              <span 
                className={correctWordSet.includes(word) ? "right-word" : "wrong-word"}
                onClick={e => activity === 'practicing' && updateAttempt({word}) } 
                key={i}>
                {word}
              </span>
            ))}
          </div>
          }
        </>
      </div>
  )
}

export default Side
