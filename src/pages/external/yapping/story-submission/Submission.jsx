import { useRef } from "react";
import "./Submission.css"
import { Button } from "@mui/material"
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const Submission = ({mode , isLeadAuthor, title, setTitle, story, checked, setChecked, handleSubmit, setActivity}) => {
  const existingTitle = useRef(title)
  return (
    <div className="submission">
      <h3><AutoAwesomeIcon />Final touches</h3>
      <>
        {
            existingTitle.current ?
            <h3>Title: {existingTitle.current}</h3> :
            <span>
              <label htmlFor="">Complete the title</label>
              <input
                  type="text" name="" id="" placeholder='Title of the story' className='title'
                  onChange={(e) => setTitle(e.target.value)}
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
        {story.map(sentenceObj => sentenceObj.sentence).join(' ')}
      </p>
      { (isLeadAuthor || !mode) &&
        <Button
        className="submission--btn"
        variant="contained" color='primary' disableElevation
        onClick={() => isLeadAuthor ? setActivity("uploading") : handleSubmit()}
      >
        Submit Story
      </Button>
      }
    </div>
  )
}

export default Submission
