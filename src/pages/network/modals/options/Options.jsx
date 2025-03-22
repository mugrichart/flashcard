import React, { useEffect } from 'react';
import './Options.css';

import usePageRefreshHandle from '../../../../utils/usePageRefreshHandle';

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// import { Button } from "@mui/material"
import Button from "../playing/components/game-button/Button"
// import {  School as SchoolIcon, Quiz as QuizIcon } from '@mui/icons-material';

const Options = () => {
  const navigate = useNavigate();
  const handleRefresh = usePageRefreshHandle()

  const { _id: deckId, deckName, words } = useSelector(state => state.deck.openDeck)

  useEffect(() => {
    handleRefresh(deckId)
  }, [deckId])  

  return (
    <div className='card'>
        
        <Button variant="contained" disableElevation color='primary' handleClick={() => navigate(`../play-with-friends`)} text="Play with friends" />
        <Button variant="contained" disableElevation color='primary' handleClick={() => navigate(`../random-game-playing/?mode=random`)} text="Random game" />
        <Button variant="contained" disableElevation color='primary' handleClick={() => navigate(`../championship`)} text="Tournament" />
            
    </div>
  )
}

export default Options
