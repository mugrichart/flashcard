import React, { useEffect, useRef, useState } from 'react';
import './Temp.css'
import axios from 'axios';
import ProgressBar from "@ramonak/react-progress-bar";
import Spinner from 'react-spinner-material';

import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'

const Temp = () => {
    const { idType, id } = useParams();

    const { deckLang } = useSelector(state => state.deck)

    const flag = idType !== 'no-type'
    const oneTimeRef = useRef(0);
    const [unprocessed, setUnprocessed] = useState([]);
    const [processed, setProcessed] = useState([]);
    const [tempId, setTempId] = useState(null)
    const [status, setStatus] = useState('preProcessing')
    const [progress, setProgress] = useState(0)
    const [checked, setChecked] = useState(false);
    const [selected, setSelected] = useState([])
    const [timePerCard, setTimePerCard] = useState(2000) // milliseconds
    const [searching, setSearching] = useState(true);

    useEffect(() => {if (oneTimeRef.current === 0) {oneTimeRef.current = 1; console.log('request from temporary'); fetchingExtensionData(setSearching, setUnprocessed, setProcessed, setTempId) } }, [])
    
    useEffect(() => {
      let interval;
      if (status === 'processing') {
        const totalTime = unprocessed.length * timePerCard // number of milliseconds
        console.log(totalTime)
        const intervalDelay = 1000
        const step = intervalDelay * 100 / totalTime
        interval = setInterval(() => {
          setProgress(prev => prev < 100 ? prev + step : 100)
        }, intervalDelay);
      }
      return () => clearInterval(interval)
    }, [status])

    const select = () => {
      setChecked(prev => {
        if (prev) {setSelected([])} else setSelected(processed.map((card, i) => card._id))
        return !prev
      })
    }

    const cardStealing = async () => {
      try {
        const { httpEndpoint } = { httpEndpoint };
        const userId  = JSON.parse(localStorage.getItem('user')).userId
        const response = await axios.post(`${ httpEndpoint }/cards/temporary`, {userId, idType, id, deckLang, selected})
        const { id:deckId } = response.data;
        console.log(deckId)
        setProcessed(prev => prev.filter(card => !selected.includes(card._id)))
        setChecked(false); setSelected([])
      } catch (error) {
        console.log(error)
      }
    }
    
  return (
    <div className='Temp'>
      <div id='extension-div-id' className='alert'>Please open the flashcard chrome extension to sync data <button id='extension-btn-id' className='button-15'>Done</button></div>
      {searching && <Spinner />}
      {!flag && <div className="unprocessed" style={{height: unprocessed && unprocessed.length > 0 ? '15%' : '0'}}>
        { unprocessed && unprocessed.length > 0 && <>
          <h5>To be processed</h5>
          {status === 'processing' && <ProgressBar className='ProgressBar' completed={Math.floor(progress)} bgColor="black" /> }
          {status !== 'processing' && <button className='button-15' onClick={() => processing(setProgress, unprocessed, setUnprocessed, setProcessed, tempId, setStatus, setTimePerCard)}>Process !</button>}
          <div className="cards">
              { unprocessed.map( ({ word }, index) => <div key={index}> {word} </div>  )}
          </div>
        </>      
        }
      </div>}
      {flag && 
      <div className="card-stealing" style={{height: '15%'}}>
        <div className='card-stealing--cards'>
          <h3>Select cards to be copied from the temporary deck to your new deck</h3>
          <p style={{cursor: 'pointer'}} onClick={() => select()}><input type="checkbox" checked={checked} onChange={() => 'nothing to do'}/> <span>select all</span></p>
          <button className="button-15" onClick={cardStealing}>confirm</button>
        </div>
      </div>}
      
      <div className="processed" style={{height: unprocessed && unprocessed.length > 0 ? '85%' : '100%'}}>
        { unprocessed && unprocessed.length > 0 && <h5>Already processed</h5> }
        <div className="cards">
          {processed && processed.map((card, index) => <div style={{cursor: 'pointer', border: selected.includes(card._id) ? '1px solid rgba(0, 0, 0, .5)' : 'none'}} key={index} onClick={() => {return flag ? setSelected(prev => !selected.includes(card._id)?[...prev, card._id]:prev.filter(id => id !==card._id)) : 'do nothing'}}>
            <h4>{card['root word']}</h4> <br />
            <p>{ card.variations[0].meaning}</p> <br />
            <p>e.g: { card.variations[0].example}</p>
          </div>)}
        </div>
      </div>
    </div>
  );
};

export default Temp;

const processing = async (setProgress, beforeProcess, setUnprocessed, setProcessed, tempId, setStatus, setTimePerCard) => {
  setProgress(0)
  try {
    const { httpEndpoint } = { httpEndpoint };
    axios.get(`${ httpEndpoint }/cards/app`)
      .then(res => {
        const {timePerCard:timesPerCard} = res.data;
        console.log(timesPerCard);
        const timePerCard = timesPerCard ? timesPerCard.reduce((acc, curr) => acc + curr, 0) / timesPerCard.length : null
        console.log(timePerCard)
        setTimePerCard((prev) => timePerCard || prev)
        setStatus('processing')
      })
      .catch(error => {console.log(error.message)})

    const startTime = Date.now(); // Record start time
    const response2 = await axios.get(`${ httpEndpoint }/cards/temporary/${tempId}`)
    const { unprocessed, processed } = response2.data;
    const elapsedTime = Date.now() - startTime; // Calculate elapsed time
    const processCardLength = beforeProcess.length - unprocessed.length;
    await axios.patch(`${ httpEndpoint }/cards/app`, { timePerCard : elapsedTime / processCardLength }); // Send elapsed time to server
    setUnprocessed(unprocessed)
    setProcessed(processed)
    setStatus('processed')
  } catch (error) {
    setStatus('processing error')
    console.log(error.message)
  }
}

const fetchingExtensionData = (setSearching, setUnprocessed, setProcessed, setTempId) => {
    const handleExtensionMessage = (event) => {
      if (event.data.type === 'FROM_EXTENSION') {
        const words = event.data.payload
        console.log('Data received from extension: ')
        if (words && words.length > 0) console.log(words.length + ' words. e.g: ' + words[0].word + ' - ' + words[0].context);
        const { httpEndpoint } = { httpEndpoint };
        const userId  = JSON.parse(localStorage.getItem('user')).userId
        setSearching(true)
        axios.patch(`${ httpEndpoint }/cards/temporary`, {userId, words : words || []})
            .then(response => {
              const { unprocessed, processed, tempId } = response.data
              setUnprocessed(unprocessed)
              setProcessed(processed)
              setTempId(tempId)
              setSearching(false)
              window.postMessage({ type: 'CLEAR_STORAGE' }, '*')
              }
            )
            .catch(e => console.log(e))
            .finally(() => window.removeEventListener('message', handleExtensionMessage))
      }
    };
    
    const retrievingExtension = () => {
      if (document.documentElement.dataset.hasExtension) {
        document.getElementById('extension-div-id').style.display = 'none'
        console.log('did it')
        window.postMessage({ type: 'REQUEST_DATA_FROM_EXTENSION' }, '*');
      } else {
        document.getElementById('extension-btn-id').addEventListener('click', retrievingExtension)
      }
    };

    // Call the function to check for the extension and request data
    retrievingExtension();

    // Add the event listener for messages from the extension
    window.addEventListener('message', handleExtensionMessage);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('message', handleExtensionMessage);
    };
  }