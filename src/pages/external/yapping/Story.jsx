
import { Button } from '@mui/material';
import useStory from './utils/useStory';

const Story = (props) => {
  
  const {
    attempt, setAttempt,
    correctSentence, okAttempt, 
    activity, setActivity, currSentence, 
    setCurrSentence, story, handleApproval, handlePartSelection, callUponAi, 
    selectedWords, isLeadAuthor, mode, words, sentenceIndex, setSentenceIndex,
    info, FinishButton
  } = useStory(props)
  
  return (
    <div className="story">
        {
          ['creating', 'practicing', 'reading'].includes(activity) &&
          <>
            <p className='sentence'>{
                activity === 'creating-null' ? // making sure this doesn't happen because I plan to remove this on creating
                currSentence.sentence && 
                currSentence.sentence.split(' ')
                .map((word, index) => 
                    <label key={word + currSentence.sentence[index - 1] + currSentence.sentence[index + 1]}>
                      <span style={{background: currSentence.blanked && !currSentence.blanked.includes(word) && 'yellow'}}>{word}</span>
                      &nbsp;
                    </label>
                ) 
                : 
                attempt?.map(
                (word, index) => {
                  if (correctSentence[index] !== word) return (
                    <label key={word + index}>
                      {
                        word.split('').map((char, i) => {
                          const numOfPastWords = correctSentence?.slice(0, index)?.join(' ').length
                          const correctCondition = (correctSentence.join(' ')[numOfPastWords + i + 1] === char && char !== '_') || ['.', ',', ';', ']', '"', '!', '?', ')'].includes(char)
                          return <span key={char + i} style={{color: correctCondition ? 'green' : 'red', textDecoration: correctCondition && 'underline'}}>{char}</span>
                        })
                      }
                      &nbsp;
                    </label>
                  )
                  }
                )
              }
            </p>
            <article className="draft-story">
              {
                story.map((currSentence, thisIndex) => (
                  <span className={`draft-sentence ${currSentence.sentence !== "\n" ? "": "new-line"}`} key={thisIndex} style={{opacity: thisIndex > sentenceIndex ? .1: 1}}>
                    { 
                      (thisIndex === sentenceIndex) ? 
                        attempt.map((word, i) => {
                          return word === correctSentence[i] ?
                          <label key={word + i}>{word} </label>: 
                          <span key={word + i}>
                            <input type='text'  value={['.', ',', ';', ']', '"', '!', '?', ')'].includes(word[word.length - 1]) ? word.slice(0, word.length - 1) : word}
                              className='attempt-input'
                              onChange={ e => props.updateAttempt({word: e.target.value, fillIndex: i, fillingMode: "typing"}) }
                            />&nbsp;
                            {['.', ',', ';', ']', '"', '!', '?', ')'].includes(word[word.length - 1]) ? <label>{word[word.length - 1]} </label> : ''}
                          </span>
                          }
                      ) 
                      :
                      (
                        thisIndex < sentenceIndex ? currSentence.sentence : currSentence.blanked
                      )
                    }
                  </span>
                ))
              }
              {
                activity === "creating" &&// selectedWords.length > 0 &&
                <input type="text" className="draft-sentence"
                  placeholder={story.length ? "": "Type your story here using the provided words"} name="" id="" autoFocus
                  value={activity === 'creating' ? currSentence.sentence: attempt.join(' ') }
                  onChange={(e) => {
                    if (activity === 'creating') setCurrSentence((prev) => ({...prev, sentence: e.target.value}))
                    else if (activity === 'practicing') setAttempt(e.target.value.split(' '))
                    }
                  }
                  onKeyDown={callUponAi}
                  onMouseUp={() => handlePartSelection(currSentence, setCurrSentence)}
                  readOnly={info.exists && info.type === 'warning'}
                />
                
              }
            </article>
            <FinishButton />
          </>
        }
        
    </div>
  )
}

export default Story


