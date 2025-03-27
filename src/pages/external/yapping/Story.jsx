
import { Button } from '@mui/material';
import useStory from './utils/useStory';

const Story = (props) => {
  
  const {
    storySettings, setStorySettings,
    attempt, setAttempt,
    correctSentence, okAttempt, 
    activity, setActivity, currSentence, 
    setCurrSentence, story, handleApproval, handlePartSelection, callUponAi, 
    selectedWords, isLeadAuthor, mode, words, sentenceIndex, setSentenceIndex,
    info, FinishButton
  } = useStory(props)
  
  console.log("story: ", storySettings)

  return (
    <div className="story">
        {
          ['create', 'practice', 'read'].includes(storySettings.state.mode) &&
          <>
            <p className='sentence'>{
                storySettings.state.mode === 'creating-null' ? // making sure this doesn't happen because I plan to remove this on creating
                storySettings.state.sentenceInPractice.sentence && 
                storySettings.state.sentenceInPractice.sentence.split(' ')
                .map((word, index) => 
                    <label key={word + storySettings.state.sentenceInPractice.sentence[index - 1] + storySettings.state.sentenceInPractice.sentence[index + 1]}>
                      <span style={{background: storySettings.state.sentenceInPractice.blanked && !storySettings.state.sentenceInPractice.blanked.includes(word) && 'yellow'}}>{word}</span>
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
                storySettings.state.story.map((currSentence, thisIndex) => (
                  <span className={`draft-sentence ${currSentence.sentence !== "\n" ? "": "new-line"}`} key={thisIndex} style={{opacity: thisIndex > storySettings.state.sentenceIndex ? .1: 1}}>
                    { 
                      (thisIndex == storySettings.state.sentenceIndex) ? 
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
                        thisIndex < storySettings.state.sentenceIndex ? currSentence.sentence : currSentence.blanked
                      )
                    }
                  </span>
                ))
              }
              
              {
                storySettings.state.mode === "create" &&// selectedWords.length > 0 &&
                <input type="text" className="draft-sentence"
                  placeholder={storySettings.state.story.length ? "": "Type your story here using the provided words"} name="" id="" autoFocus
                  value={storySettings.state.mode === 'create' ? storySettings.state.sentenceInProgress?.sentence: attempt.join(' ') }
                  onChange={(e) => {
                    if (storySettings.state.mode === 'create') setStorySettings((prev) => ({...prev, state: {...prev.state, sentenceInProgress: { sentence: e.target.value } }}))
                    else if (storySettings.state.mode === 'practice') setAttempt(e.target.value.split(' '))
                    }
                  }
                  onKeyDown={callUponAi}
                  onMouseUp={() => handlePartSelection(storySettings.state.sentenceInProgress, setCurrSentence)}
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


