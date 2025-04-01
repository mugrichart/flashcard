import { useRef } from "react";
import "./Submission.css"
import { Button } from "@mui/material"
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StorySetup from "../utils/storySettings";

const Submission = ({storySettings, setStorySettings, externalSource,
                    gameInfo, setGameInfo, userID,
                    checked, setChecked, handleSubmit}) => {
  const existingTitle = useRef(storySettings.title)
  return (
    <div className="submission">
      <h3><AutoAwesomeIcon />Final touches</h3>
      <>
        {
            !(existingTitle.current || gameInfo.creator !== userID) &&
            // <h3>Title: {storySettings.title}</h3> :
            <span>
              <label htmlFor="">Complete the title</label>
              <input
                  type="text" name="" id="" placeholder='Title of the story' className='title'
                  onChange={(e) => setStorySettings(prev => prev.rebuild({ title: e.target.value }))}
              />
            </span>
        }
      </>
      <span>
        <label htmlFor="incognito" onClick={() => setChecked(!checked)}>
          <input onChange={() => {}} className='checkbox' value={checked} type="checkbox" name="incognito" id="incognito"
          />
          &nbsp;incognito
        </label>
        <span tooltip='nothing'> &#9432;</span>
      </span>
      <h4>Your story</h4>
      <p id="text-container">
        {storySettings.details.map(sentenceObj => sentenceObj.sentence).join(' ')}
      </p>
      { !externalSource && storySettings.title &&
        <Button
        className="submission--btn"
        variant="contained" color='primary' disableElevation
        onClick={() => gameInfo ? setStorySettings(prev => prev.rebuild({step: "uploading"})) : handleSubmit()}
      >
        Submit Story
      </Button>
      }
    </div>
  )
}

export default Submission
