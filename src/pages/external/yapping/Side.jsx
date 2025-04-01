import React, { useState, useEffect} from 'react';

import shuffledNumbers from '../../../utils/shuffleArray';

const Side = (
  {
    storySettings, selectedWords, okAttempt, 
    correctWordSet, updateAttempt
  }) => {

  const [wordSetToDisplay, setWordSetToDisplay] = useState([])
  
  useEffect(() => {
    if (correctWordSet.length && storySettings.mode === 'practice') {
      const wordsToDisplay = shuffledNumbers(storySettings.words.length - 1).slice(0, 3).map((randIndex) => storySettings.words[randIndex]).concat(correctWordSet)
      const randomizedOrder = shuffledNumbers(wordsToDisplay.length - 1).map(randomIndex => wordsToDisplay[randomIndex])
      setWordSetToDisplay(randomizedOrder)
    }
  }, [correctWordSet])

  return (
    <div className="side">
        <div>
          {{create: false, practice: okAttempt?.split('.')?.length < 2 }[storySettings.mode] &&
              <p>
                {storySettings.mode === 'practice' ? 
                              'Use the right word(s) from this set!' : 
                selectedWords?.length === 0 && 'Pick the word(s) you are about to use!'}
              </p> 
          }
        </div>
        <>
          {
            <div className='side-pool word-pool'>
            {(storySettings.mode === 'practice' ? wordSetToDisplay : storySettings.words.filter(word => !selectedWords.includes(word))).map((word, i) => (
              <span 
                className={correctWordSet.includes(word) ? "right-word" : "wrong-word"}
                onClick={e => storySettings.mode === 'practice' && updateAttempt({word}) } 
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
