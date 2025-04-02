
import './StoryCatalog.css'
import { Button } from "@mui/material"
import { Add as AddIcon, Summarize } from '@mui/icons-material';
import { useEffect, useState } from 'react';

import { fetchAllStories } from '../../../../api/http';


const StoryCatalog = ({ deckId, setStorySettings, gameInfo }) => {

  const resetStory = () => {
      setStorySettings( prev => prev.rebuild({ 
        title: "", summary: "",
        mode: "create", step: "onboarding", details: [], 
        sentenceInProgress: {sentence: "", blanked: ""},
        sentenceIndex: 0,
      }) )
    }
  
  // useEffect(() => setSelected(-1), [])

  const [ stories, setStories ] = useState(gameInfo?.stories || [])

  useEffect(() => {
    if (!deckId || gameInfo) return
    fetchAllStories(deckId).then(setStories)
                    .catch((e) => console.log(e.msg));
  }, [deckId])

  setStorySettings(prev => {
    //console.log(prev.mode, prev.step);
    return prev
  })
  
  return (
    <div className='side side-wide story-catalog'>
      {stories.length ?
        <>
          <div>
            <p>Pick a story to practice with </p>
          </div>
          <div className='side-pool titles'>
              {stories?.map((story, i) => (
                  <span
                      key={i}
                      onClick={() => gameInfo ||
                          setStorySettings( prev => prev.rebuild(
                            {
                              ...story,
                              mode: "practice",
                              step: "practice",
                            }
                          ))
                      }
                      className="story--span"
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
