
import './StoryCatalog.css'
import { Button } from "@mui/material"
import { Add as AddIcon } from '@mui/icons-material';
import { useEffect } from 'react';

const StoryCatalog = ({ stories, setActivity, setTitle, setSummary, setStory, selected, setSelected }) => {
  const resetStory = () => {
      setActivity('onboarding');
      setTitle('');
      setSummary("");
      setStory([]);
    }
  
  useEffect(() => setSelected(-1), [])

  return (
    <div className='side side-wide story-catalog'>
      {stories?.length ?
        <>
          <div>
            <p>Pick a story to practice with</p>
          </div>
          <div className='side-pool titles'>
              {stories?.map((story, i) => (
                  <span
                      key={i}
                      onClick={() => {
                          setSelected(i);
                      }}
                      className={`story--span ${selected === story.title ? 'selected' : ''}`}
                  >
                  {story.title}
                  </span>
              ))}
          </div>
          or
        </> :
        <>No stories yet!</> 
      }
      <Button startIcon={<AddIcon />} variant="contained" color='primary' disableElevation 
          onClick={resetStory}
      >
          New story
      </Button>
          
    </div>
  )
}

export default StoryCatalog
