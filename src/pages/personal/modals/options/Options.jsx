import React, { useEffect } from 'react';
import './Options.css';

import usePageRefreshHandle from '../../../../utils/usePageRefreshHandle';

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Button } from "@mui/material"
import { Add as AddIcon, School as SchoolIcon, Quiz as QuizIcon, ContentCopy, Create } from '@mui/icons-material';

const Options = () => {
  const navigate = useNavigate();
  const handleRefresh = usePageRefreshHandle()

  const { _id: deckId, deckName, words } = useSelector(state => state.deck.openDeck)

  useEffect(() => {
    handleRefresh(deckId)
  }, [deckId])  

  return (
    <div className='card'>
        <h3>{deckName}</h3>
        <div>
          <Button startIcon={<AddIcon />} variant="contained" color='primary' disableElevation onClick={() => navigate(`../adding/?deck=${deckId}`)} >Populate the deck</Button>
          {words?.length ?
            <>
              <Button startIcon={<SchoolIcon />} variant="contained" disableElevation color='primary' onClick={() => navigate(`../guided-learning/?deck=${deckId}`)}>Guided learning</Button>
              <Button startIcon={<SchoolIcon />} variant="contained" disableElevation color='primary' onClick={() => navigate(`../learning/?deck=${deckId}`)}>Non-guided learning</Button>
              <Button startIcon={<QuizIcon />} variant="contained" disableElevation color='primary' onClick={() => navigate(`../quiz/?deck=${deckId}`)}>Take a quiz</Button>
              <Button startIcon={<Create />} variant="contained" disableElevation color='primary' onClick={() => navigate(`../../../more/story-time/?deck=${deckId}`)}>Story Time</Button>
            </>:
            <></>
          }
          </div>
    </div>
  )
}

export default Options
