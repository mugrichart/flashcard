
import './Onboarding.css'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Button } from '@mui/material';

import StorySetup from '../utils/storySettings';

const Onboarding = (
  { storySettings, setStorySettings,
    gameInfo, userID
  }) => {
  return (
    <div className='story-onboarding'>
      <h3>You are about to write a short story <br />using these words / expressions found in the deck</h3>
      <div className='side-pool word-pool'>{storySettings.words.map((word, i) => <span key={i}> {word} </span>)}</div>
      <span>
          <input
            type="text" name="" id="" placeholder='Title of the story' className='title' value={storySettings.title || ""}
            onChange={(e) => setStorySettings(prev => prev.rebuild({title: e.target.value }))}
          />
          <textarea 
            name="" id="Yapping--summary" placeholder='Brainstorm the summary here'
            value={storySettings.summary || ""} onChange={(e) => setStorySettings(prev => prev.rebuild({summary: e.target.value }))}
            >
          </textarea>
      </span>
      {!gameInfo || gameInfo.creator === userID && Object.keys(gameInfo.players) &&
        <Button
          variant="contained" color='primary' disableElevation
          onClick={() => setStorySettings(prev => prev.rebuild({ step: "create" }))}
        >
          Start
        </Button>
      }
    </div>
  )
}

export default Onboarding
