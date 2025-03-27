import React, { useState, useEffect} from 'react';

import shuffledNumbers from '../../../utils/shuffleArray';

const Side = (
  {
    words, selectedWords, okAttempt, 
    correctWordSet, updateAttempt, storySettings
  }) => {

  const [wordSetToDisplay, setWordSetToDisplay] = useState([])
  
  useEffect(() => {
    if (correctWordSet.length && storySettings.state.mode === 'practice') {
      const wordsToDisplay = shuffledNumbers(words.length - 1).slice(0, 3).map((randIndex) => words[randIndex]).concat(correctWordSet)
      const randomizedOrder = shuffledNumbers(wordsToDisplay.length - 1).map(randomIndex => wordsToDisplay[randomIndex])
      setWordSetToDisplay(randomizedOrder)
    }
  }, [correctWordSet])

  // console.log("words: ", words)
  // console.log("words c: ", correctWordSet)

  // console.log("toDisplay: ", wordSetToDisplay)

  // console.log(storySettings)

  return (
    <div className="side">
        <div>
          {{create: false, practice: okAttempt?.split('.')?.length < 2 }[storySettings.state.mode] &&
              <p>
                {storySettings.state.mode === 'practice' ? 
                              'Use the right word(s) from this set!' : 
                selectedWords?.length === 0 && 'Pick the word(s) you are about to use!'}
              </p> 
          }
        </div>
        <>
          {
            <div className='side-pool word-pool'>
            {(storySettings.state.mode === 'practice' ? wordSetToDisplay : words.filter(word => !selectedWords.includes(word))).map((word, i) => (
              <span 
                className={correctWordSet.includes(word) ? "right-word" : "wrong-word"}
                onClick={e => storySettings.state.mode === 'practice' && updateAttempt({word}) } 
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
