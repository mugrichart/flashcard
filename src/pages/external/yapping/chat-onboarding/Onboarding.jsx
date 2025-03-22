
import './Onboarding.css'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Button } from '@mui/material';

const Onboarding = ({words, mode, playerCount, isLeadAuthor, setAiHelp, setAiOptionsDisplay, aiOptionsDisplay, aiHelp, title, setTitle, setActivity, summary, setSummary }) => {
  return (
    <div className='story-onboarding'>
      <h3>You are about to have a chat <br />using these words / expressions found in the deck</h3>
      <div className='side-pool word-pool'>{words.map((word, i) => <span key={i}> {word} </span>)}</div>
      <span>
          <input
            type="text" name="" id="" placeholder='Topic of the conversation' className='title' value={title || ""}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea 
            name="" id="Yapping--summary" placeholder='Draft an overview to guide the conversation'
            value={summary || ""} onChange={e => setSummary(e.target.value)}
            >
          </textarea>
      </span>
      {/*where the section would go if wasn't commented out*/}
      {((isLeadAuthor && playerCount > 1) || !mode) &&
        <Button
          variant="contained" color='primary' disableElevation
          onClick={() => setActivity(mode ? "countdown": "creating")}
        >
          Start
        </Button>
      }
    </div>
  )
}

export default Onboarding

/* <section>
    <span className='ai-assistant' onClick={() => setAiOptionsDisplay(!aiOptionsDisplay)}>
      <AutoAwesomeIcon />
      {aiHelp ? aiHelp : 'Get Ai assistance'}
    </span>
    {aiOptionsDisplay && (
      <section>
        <div>
          <span className='summary' onClick={() => { setAiHelp('Ai co-editor'); setAiOptionsDisplay(false); }}>
            Ai co-editor
          </span>
          <p>This will take turns with you in writing sentences for your story</p>
        </div>
        <div>
          <span className='summary' onClick={() => { setAiHelp('Ai for you'); setAiOptionsDisplay(false); }}>
            Ai for you
          </span>
          <p>This will take over the generation of the entire story for you</p>
        </div>
      </section>
    )}
  </section> */