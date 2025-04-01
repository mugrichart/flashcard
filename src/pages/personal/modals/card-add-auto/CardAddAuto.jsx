import React, { useEffect, useState } from 'react';
import './CardAddAuto.css';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import usePageRefreshHandle from '../../../../utils/usePageRefreshHandle';

import { Button, Chip } from "@mui/material"
import { Add as AddIcon, Clear as ClearIcon, Check as CheckIcon } from "@mui/icons-material"

import { useSearchWords } from './utils/useSearchWords';
import useExtensionWords from './utils/useExtensionWords';

const CardAddAuto = () => {
  const handleRefresh = usePageRefreshHandle()
  const navigate = useNavigate()
  
  const retrieveIds = () => {
      const openDeck = useSelector(state => state.deck.openDeck)
      if (openDeck?.deckName) return openDeck
      if (handleRefresh()) return useSelector(state => state.deck.openDeck)
      const newDeck = localStorage.getItem('new-deck--to-create')
      if (!newDeck) return {}
      const { deckName, deckLang } = JSON.parse(newDeck);
      return {_id: '', deckLang, deckName}
  }

  const [openDeck] = useState(retrieveIds())
  const {_id: deckId, deckLang, deckName } =  openDeck

  const [ isExtensionOpen, extensionWords ] = useExtensionWords()

  const [searchValue, setSearchValue] = useState('')
  const [fetching, searchWords, status, setStatus] = useSearchWords(searchValue, deckLang)
  const [extraWords, setExtraWords] = useState(JSON.parse(localStorage.getItem('temporary'))?.words || [])

  const [searchingWord, setSearchingWord] = useState({word: '', context: ''})
  
  useEffect(() => {
    //console.log(openDeck?.deckName)
    if (!openDeck?.deckName) navigate('../new-deck')
  }, [openDeck])

  const handleDeleteExtraWord = (word) => {
    setExtraWords((prev) => {
      //console.log(prev)
      const updatedWords = prev.filter(extraWord => !(extraWord.word === word.word && extraWord.context === word.context));
      //console.log(updatedWords)
      localStorage.setItem('temporary', JSON.stringify({ words: updatedWords }));
      //console.log(word, searchingWord)
      if (searchingWord?.word === word.word) { setSearchingWord({word: '', context: ''}); setSearchValue('') }
      return updatedWords;
    });
  };

  useEffect(() => {
    if (extensionWords.length) {
      setExtraWords(prev => {
        prev = prev.concat(extensionWords)
        localStorage.setItem('temporary', JSON.stringify({words: prev}))
        return prev
      }
      );
    }
  }, [extensionWords])
  
  const handleSearch = (e) => {
    //console.log(searchValue); 
    e.preventDefault();
    fetching(searchValue); 
    setSearchingWord({word: searchValue, context: ''})
  }

  return (
    <form action="" className='card-add-auto' onSubmit={handleSearch}>
      <div className='card-add-auto--top'>
        <label htmlFor="deck name" className="deckName">{deckName}</label>
      </div>
      <input type='text' className='card-auto-search' autoFocus placeholder="Search for the word you want" 
        value={searchValue} 
        onChange={(e) => setSearchValue(e.target.value)}
      />
      { status === 'loading' && <p>...{status}</p> }
      <SearchList setStatus={setStatus} handleDeleteExtraWord={handleDeleteExtraWord} searchingWord={searchingWord} setSearchingWord={setSearchingWord} searchWords={searchWords} searchValue={searchValue} deckId={deckId} deckName={deckName} status={status} deckLang={deckLang}/>
      {
       ( status === 'idle' && extraWords?.length > 0) && 
        <div className='card-auto--extra-words'> 
          <label htmlFor="">Search these words from your reading: </label>
          <ul >
          {extraWords?.slice(0, 3).map((word, i) => 
                <AddWordCard 
                  wordExists={true}
                  handleClick={() => { fetching(word.word); setSearchValue(word.word); setSearchingWord(word) }}
                  word={word.word}
                  context={word.context}
                  BtnComponent={<ClearIcon 
                      sx={{
                        color: '#bb0000',
                        cursor: 'pointer',
                        '&:hover': {
                          color: '#ee0000',
                          transform: 'scale(1.5)'
                        },
                      }}
                      onClick = {() => handleDeleteExtraWord(word)}
                  />}
                /> 
          )}
          </ul>
        </div>
      }
      {
        !isExtensionOpen && <div className='extension-opening-prompt'>Activate the flashcard extension to access words from your internet reading</div>

      }
    </form>
  )
}

export default CardAddAuto

const SearchList = ({ setStatus, handleDeleteExtraWord, searchingWord, setSearchingWord, searchWords, searchValue, deckId, deckName, deckLang, status }) => {
  const fetch_Save = (word, whereTo, doWhat) => {
    let toAdd; let words;
    if (['load', 'load-save'].includes(doWhat)) {
      toAdd = JSON.parse(localStorage.getItem(whereTo));
      words = toAdd?.[deckId || deckName]?.words || []
      if (doWhat === 'load') return words
    }

    localStorage.setItem(whereTo, JSON.stringify({...toAdd, [deckId || deckName]: {deckId, deckLang, words: [...words, word]}}));
    setAddedWords([...addedWords, word]);
    handleDeleteExtraWord(word)
    setStatus('idle')
  }

  // Limit the displayed words to a maximum of 10
  const limitedSearchWords = searchWords?.slice(0, 10);
  const [addedWords, setAddedWords] = useState([...fetch_Save('', 'toAdd', 'load'), ...fetch_Save('', 'toWish', 'load')]) //the indices

  return <>
      <ul className='card-auto--search-list'>
        { ['success', 'error'].includes(status) &&
          (
            limitedSearchWords.map((word, i) => (
              <AddWordCard 
                key={word+i}
                wordExists={true}
                handleClick={() => !addedWords.some(addedWord => addedWord.word === word.word && addedWord.context === word.example) && fetch_Save({word: word.word, context: word.example}, 'toAdd', 'load-save')}
                word={word.word} 
                context={word.example} 
                BtnComponent={addedWords.some(addedWord => addedWord.word === word.word && addedWord.context === word.example) &&
                  <CheckIcon color='success'/>}
              />
            ))
          )
        }
      </ul>

      {
        (['success', 'error'].includes(status) && searchValue) &&
        <>
          <div className="item-not-found">
            {limitedSearchWords.length ? "Can't find what you are looking for? Add it to the wishlist here" :`OOps!!! The word is not yet in our evolving dictionary. Add it to the wishlist here`}
          </div>
          <AddWordCard 
                // handleClick={() => !addedWords.includes('bibi') && fetch_Save('bibi', 'toAdd', 'load-save')}
                wordExists={false}
                word={searchingWord.word} 
                context={searchingWord.context}
                setSearchingWord = {setSearchingWord}
                BtnComponent={addedWords.some(word => word.word === searchingWord.word && word.context === searchingWord.context) ?
                  <CheckIcon color='success'/> :
                    <>
                      <ClearIcon 
                          sx={{
                            color: '#bb0000',
                            cursor: 'pointer',
                            '&:hover': {
                              color: '#ee0000',
                              transform: 'scale(1.5)'
                            },
                          }}
                          onClick = {() => handleDeleteExtraWord(searchingWord)}
                      />
                      {searchingWord.context && 
                        <Button startIcon={<AddIcon />} variant="contained" color='primary' disableElevation 
                          onClick={() => fetch_Save(searchingWord, 'toWish', 'load-save')} >
                        </Button>
                      }
                    </>
                }
          />
        </>
      }

  </>
}

const AddWordCard = ({wordExists, handleClick, word, context, setSearchingWord, BtnComponent}) => {
  return (
    <div className={`search-item  ${wordExists && 'clickable'}`}>
      <div className={`word-and-context`} onClick={handleClick}>
        <div className="word">{word}</div>
        <div className="context">
          {
            wordExists ? 
            <div>{context}</div>
            :
            <input className='card-wish-input' 
              type="text" placeholder='Type the context here'
              value={context}
              onChange={e => setSearchingWord(prev => ({...prev, context: e.target.value}))}
            />
          }
        </div>
      </div>
      {BtnComponent}
    </div>
  )
}