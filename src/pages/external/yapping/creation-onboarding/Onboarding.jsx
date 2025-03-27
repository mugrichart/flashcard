
import './Onboarding.css'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Button } from '@mui/material';

const Onboarding = ({ storySettings, setStorySettings,
  words, mode, playerCount, isLeadAuthor }) => {
  return (
    <div className='story-onboarding'>
      <h3>You are about to write a short story <br />using these words / expressions found in the deck</h3>
      <div className='side-pool word-pool'>{words.map((word, i) => <span key={i}> {word} </span>)}</div>
      <span>
          <input
            type="text" name="" id="" placeholder='Title of the story' className='title' value={storySettings.metadata.title || ""}
            onChange={(e) => setStorySettings(prev => ({...prev, metadata: { ...prev.metadata, title: e.target.value }}))}
          />
          <textarea 
            name="" id="Yapping--summary" placeholder='Brainstorm the summary here'
            value={storySettings.metadata.summary || ""} onChange={(e) => setStorySettings(prev => ({...prev, metadata: { ...prev.metadata, summary: e.target.value }}))}
            >
          </textarea>
      </span>
      {/*where the section would go if wasn't commented out*/}
      {((isLeadAuthor && playerCount > 1) || !mode) &&
        <Button
          variant="contained" color='primary' disableElevation
          onClick={() => setStorySettings(prev => ({ ...prev, state: { ...prev.state, mode: mode ? "countdown": "create", step: "create", story: [], sentenceInProgress: { sentence: ""} }}))}
        >
          Start
        </Button>
      }
    </div>
  )
}

export default Onboarding
