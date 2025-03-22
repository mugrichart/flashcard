import React, { useEffect, useState } from 'react';
import './NewDeck.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openDeck } from '../../../../features/personal/deck/deckSlice'

import { LanguageSelect } from '../../../filters/Filters';

export default () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [value, setValue] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState({label: '', value: ''});

  useEffect(() => {
    const newDeck = localStorage.getItem('new-deck--to-create')
    if (!newDeck) return
    const { deckName, deckLang, langLabel } = JSON.parse(newDeck)
    if (!deckName) return
    setValue(deckName); dispatch(openDeck({_id: '', deckName})); setSelectedLanguage({value: deckLang, label: langLabel})

  }, [])

  useEffect(() =>
    { 
      if (!value || !selectedLanguage.value) return
      dispatch(openDeck({_id: '', deckName: value, deckLang: selectedLanguage.value}))
      localStorage.setItem('new-deck--to-create', JSON.stringify({ deckName: value, deckLang: selectedLanguage.value, langLabel: selectedLanguage.label }))
    }, 
    [selectedLanguage, value])


  const showAlert = () => {
    document.getElementsByClassName('deck--alert')[0].classList.remove('deck--hide')
    const timerId = setTimeout(() => {
      document.getElementsByClassName('deck--alert')[0].classList.add('deck--hide')
    }, 3000);
    return () => clearTimeout(timerId)
  }
  const handle = (from) => {
    return !(value && selectedLanguage.value) ? showAlert() : 
            navigate(from)
  }
  
  return (
    <div className='new-deck-page'>
      <h1>Find a creative deck name</h1>
      <input type="deck-name" placeholder='Deck name' autoFocus value={value} onChange={(e) => {setValue(e.target.value); dispatch(openDeck({_id: '', deckName: e.target.value}))}}/>
      <div className='select-container'>
        <label htmlFor="deck language">Cards language</label>
        <LanguageSelect selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
      </div>
      <p className='deck--alert deck--hide'>Please provide deck name and language !</p>
      
      <div className="custom-button-1" onClick={() => handle('../adding/manual')}>Create cards manually</div>
      <div className="custom-button-1" onClick={() =>  handle('../adding/auto')}>generate cards with AI</div>
      {/* <div className='custom-button-1' onClick={() =>  handle('../more/temporary')}>Copy cards from Temporary</div> */}
      
    </div>
  )
}
