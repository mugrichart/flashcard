import React, { useEffect, useState } from 'react';
import { ArrowBackIos as ArrowBack, ArrowForwardIos as ArrowFwd } from '@mui/icons-material';
import ProgressBar from "@ramonak/react-progress-bar";
import Spinner from 'react-spinner-material';
import './CardAdd.css';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import usePageRefreshHandle from '../../../../utils/usePageRefreshHandle';

const CardAdd = () => {
  const navigate = useNavigate()
  const handleRefresh = usePageRefreshHandle()

  const { openDeck: deck } = useSelector(state => state.deck)
  const [cardIndex, setCardIndex] = useState(0);
  const [cards, setCards ] = useState(deck.words)

  useEffect(() => {
    handleRefresh(deck._id)
  }, [deck._id])  

  useEffect(() => setCards(deck.words), [deck.words])
  
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft')
        setCardIndex((prev) => (prev > 0 ? prev - 1 : cards.length -1 ));
      else if (event.key === 'ArrowRight')
        setCardIndex((prev) => (prev < cards.length - 1 ? prev + 1 : 0));
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [cards?.length]); 
  
  
  console.log(deck)

  return (
    <>
    { deck?.deckName ?
    <div className='card-add'>
      <div className="head">
        <div>{deck.deckName}</div>
        {deck._id ? <>
                          <button onClick={() => navigate(`manual/?deck=${deck._id}`)}>manual add</button>
                          <button onClick={() => navigate(`auto/?deck=${deck._id}`)}>auto add</button>
                        </>:
                        <></>
        }
      </div>
      {cards?.length ?
          <>
            <div className="main">
                <div className="top">
                  <div>{cards[cardIndex].word}</div>
                  <div>{cards[cardIndex].type}</div>
                </div>
                <div className="middle">
                    <i className="arrow" onClick={() => setCardIndex((prev) => prev > 0 ? prev-1 : cards.length-1)}><ArrowBack /></i>
                    <div className="content">
                        <div>{cards[cardIndex].meaning}</div>
                        <br /><br />
                        <div>e.g: {cards[cardIndex].example}</div>  
                    </div>
                    <i className="arrow" onClick={() => setCardIndex((prev) => prev < cards.length - 1 ? prev + 1 : 0)}><ArrowFwd /></i>
                </div>
                <button className="main--bottom" onClick={() => navigate('../card/learn')}>
                    learn more
                </button>
            </div>
            <div className="card-add--bottom">
            <div>click on &lt; or &gt; to swipe left or right</div>
                <ProgressBar completed = {Math.round((cardIndex + 1) * 100 / cards.length)} bgColor = "black" /> 
            </div>
          </> :
          <>--empty deck---</>
      }
    </div> : <div style={{height: '200px', width: '200px', padding: '50px'}}><Spinner radius={100} color={"#b0b0ff"} stroke={2} visible={true} /></div> 
      }
    </>
  )
}

export default CardAdd
