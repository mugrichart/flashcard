
import './StoryCatalog.css'
import { Button } from "@mui/material"
import { Add as AddIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';

import { fetchAllStories } from '../../../../api/http';

import storySettingsSelector from '../utils/storySettings';


const StoryCatalog = ({ deckId, setStorySettings }) => {

  const resetStory = () => {

      setStorySettings( storySettingsSelector( { mode: "create", step: "onboarding" } ))
      // setActivity('onboarding');
      // setTitle('');
      // setSummary("");
      // setStory([]);
    }
  
  // useEffect(() => setSelected(-1), [])

  const [ stories, setStories ] = useState([])

  useEffect(() => {
    // if (!deckId || mode?.startsWith("game")) return
    fetchAllStories(deckId).then(setStories)
                    .catch((e) => console.log(e.msg));
  }, [deckId])

  return (
    <div className='side side-wide story-catalog'>
      {stories.length ?
        <>
          <div>
            <p>Pick a story to practice with</p>
          </div>
          <div className='side-pool titles'>
              {stories?.map((story, i) => (
                  <span
                      key={i}
                      onClick={() => {
                          setStorySettings(storySettingsSelector(
                            {
                              title: story.title,
                              summary: story.summary,
                              author: story.author,
                              story: story.story,
                              mode: "practice",
                              step: "practice",
                              sentenceInPractice: story.story[0],
                              sentenceIndex: 0
                            }
                          ))
                      }}
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
