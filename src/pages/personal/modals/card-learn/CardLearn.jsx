import React, { useState, useEffect } from 'react';
import './CardLearn.css';
import ProgressBar from "@ramonak/react-progress-bar";
import Spinner from 'react-spinner-material';
import { useSelector } from 'react-redux';

import usePageRefreshHandle from '../../../../utils/usePageRefreshHandle';

import { Button } from "@mui/material"

import useTextToSpeech from '../../../external/yapping/utils/useTextToSpeech';

const CardLearn = ({ deckLearningChunk, setCraming }) => {
  const { openDeck: deck } = deckLearningChunk ? { openDeck: deckLearningChunk } : useSelector(state => state.deck);
  const handleRefresh = usePageRefreshHandle()

  const [cardIndex, setCardIndex] = useState(0);
  const [cards, setCards] = useState(deck ? deck.words : []);
  const [cardMotion, setCardMotion] = useState('card-entering-left');

  // text to speech
  const [voice, setVoice] = useState(null);
  const { voices, speak, pause, resume, cancel } = useTextToSpeech();

  useEffect(() => {
    handleRefresh(deck._id)
  }, [deck._id])  

  useEffect(() => {
    cancel()
    setCards(deck ? deck.words : [])
  }, [deck])

  useEffect(() => {
    setVoice(voices[1]);
  }, [voices]);

  useEffect(() => () => cancel() , [])

  const sayIt = (script) => speak('Please pay attention: ' + script, voice);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowLeft') changeCard('>');
      else if (event.key === 'ArrowRight') changeCard('<');
    };

    // Add swipe touch and mouse event listeners
    let startX = 0;
    let startY = 0;
    let isSwiping = false;

    const handleTouchStart = (event) => {
      startX = event.touches[0].clientX; // Get the X-coordinate when touch starts
      startY = event.touches[0].clientY; // Get the Y-coordinate when touch starts
      isSwiping = true; // Flag to indicate the start of a swipe
    };

    const handleTouchMove = (event) => {
      if (!isSwiping) return; // If not swiping, exit
      const moveX = event.touches[0].clientX - startX;
      const moveY = event.touches[0].clientY - startY;
      const swipeThreshold = 30; // Adjust this value as needed

      // If the swipe is primarily horizontal and exceeds the threshold, prevent default scrolling
      if (Math.abs(moveX) > Math.abs(moveY) && Math.abs(moveX) > swipeThreshold) {
          event.preventDefault(); // Prevent scrolling
      }
    };

    const handleTouchEnd = (event) => {
      if (!isSwiping) return; // If not swiping, exit
      isSwiping = false; // Reset swiping flag
      const endX = event.changedTouches[0].clientX; // Get the X-coordinate when touch ends
      if (Math.abs(endX - startX) < 30) return
      if (startX > endX) {
        // Swipe left
        changeCard('<');
      } else if (startX < endX) {
        // Swipe right
        changeCard('>');
      }
    };

    const handleMouseDown = (event) => {
      startX = event.clientX; // Get the X-coordinate when mouse is pressed
      startY = event.clientY; // Get the Y-coordinate when mouse is pressed
      isSwiping = true; // Flag to indicate the start of a swipe
    };

    const handleMouseMove = (event) => {
      if (!isSwiping) return; // If not swiping, exit
      const moveX = event.clientX - startX;
      const moveY = event.clientY - startY;

      const swipeThreshold = 30; // Adjust this value as needed
      // If the swipe is primarily horizontal and exceeds the threshold, prevent default scrolling
      if (Math.abs(moveX) > Math.abs(moveY) && Math.abs(moveX) > swipeThreshold) {
          event.preventDefault(); // Prevent scrolling
      }
    };

    const handleMouseUp = (event) => {
      if (!isSwiping) return; // If not swiping, exit
      isSwiping = false; // Reset swiping flag
      const endX = event.clientX; // Get the X-coordinate when mouse is released
      if (Math.abs(endX - startX) < 30) return
      if (startX > endX) {
        // Swipe left
        changeCard('<');
      } else if (startX < endX) {
        // Swipe right
        changeCard('>');
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cards.length]);

  useEffect(() => {
    if (!cards[cardIndex]) return
    cancel();
    sayIt('to this ' + cards[cardIndex].type + ': ' + cards[cardIndex].word + '; And this is a sentence using the ' + cards[cardIndex].type + ': ' + cards[cardIndex].example);
  }, [cardIndex, cards]);

  const changeCard = (direction) => {
    let timerId;
    if (direction === '>') {
      setCardMotion('card-exiting-right');
      timerId = setTimeout(() => {
        setCardIndex((prev) => prev > 0 ? prev - 1 : cards.length - 1);
        setCardMotion('card-entering-left');
      }, 500);
    } else {
      setCardMotion('card-exiting-left');
      timerId = setTimeout(() => {
        setCardIndex((prev) => prev < cards.length - 1 ? prev + 1 : 0);
        setCardMotion('card-entering-right');
      }, 500);
    }
    return () => clearTimeout(timerId);
  };

  return (
    <>
      {deck ? (
        <div className={`card-learn ${cardMotion}`}>
          <div className='card-learn--top'>{deck.deckName} 
            {deckLearningChunk && <Button variant="contained" disableElevation color='primary' onClick={() => {cancel(); setCraming(false)}}>Ready for a quiz</Button>
          }</div>
          {cards.length ? (
            <>
              <div className="card-learn--body">
                {/* <i className="arrow" onClick={() => changeCard('<')}>
                  <ArrowBack />
                </i> */}
                <section className='card-learn--content'>
                  <div className='card-learn--word'>{cards[cardIndex].word}</div>
                  <ul className='card-learn--descr'>
                    {cards[cardIndex].type && <li>-- {cards[cardIndex].type}</li>}
                    <li>{cards[cardIndex]['language style']}</li>
                  </ul>
                  <br />
                  <div><span>Def: </span>{cards[cardIndex].meaning}</div>
                  <br />
                  <div><span>e.g: </span>{cards[cardIndex].example}</div>
                  <br />
                  {cards[cardIndex].synonym && <div>Synonym = {cards[cardIndex].synonym}</div>}
                  {cards[cardIndex].antonym && <div>Antonym = {cards[cardIndex].antonym}</div>}
                  <br />
                  {
                    cards[cardIndex]['related words']?.length &&
                    <>
                      <span>Related words : </span>
                      <ul className='card-learn--related'>
                        {cards[cardIndex]['related words'].map((wordHere, i) => <li key={i}>{wordHere}</li>)}
                      </ul>
                    </>
                  }
                </section>
                {/* <i className="arrow" onClick={() => changeCard('>')}>
                  <ArrowFwd />
                </i> */}
              </div>
              {
                cardIndex < 4 &&
                <>
                  <br />
                  <div className='card-learn--info'>Swipe left or right</div>
                </>
              }
              <br />
              <ProgressBar completed={Math.round((cardIndex + 1) * 100 / cards.length)} bgColor="black" />
            </>
          ) : (
            <div style={{ height: '200px', textAlign: 'center' }}>-- empty deck --</div>
          )}
        </div>
      ) : (
        <div style={{ height: '200px', width: '200px', padding: '50px' }}>
          <Spinner radius={100} color={"#b0b0ff"} stroke={2} visible={true} />
        </div>
      )}
    </>
  );
};

export default CardLearn;
