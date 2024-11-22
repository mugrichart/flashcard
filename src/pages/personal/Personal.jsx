import React, { useCallback, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Spinner from 'react-spinner-material';
import { Options, CardAdd, CardAddManual, CardAddAuto, CardLearn, NewDeck, GuidedLearning, Quiz } from "./modals"
import './Personal.css';
import Filters from '../filters/Filters';
import { useSelector, useDispatch } from 'react-redux';
import { openDeck, deckList, removeDecks } from '../../features/personal/deck/deckSlice';
import { Button } from '@mui/material';
import { Delete as DeleteIcon, FilterAlt as FilterIcon, Clear as Close } from '@mui/icons-material';
import { MuiCheckbox } from '../../components/MuiComponents';
import Info from '../../components/Info';

import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { fetchDeck, fetchAllDecks, deleteDecks, apiBatchRequest } from '../../api'

import { CHUNK_SIZE, CHUNK_TARGET_MASTERY_LEVEL, TARGET_PERFECT_LEVEL } from '../../constants'

const Personal = () => {
  const dispatch = useDispatch();
  const { deckList: deck_list } = useSelector((state) => state.deck);
  const userId = JSON.parse(localStorage.getItem('user')).userId;
  const [checked, setChecked] = useState(false);
  const [personalSelectedItem, setPersonalSelectedItem] = useState([]);
  const [searching, setSearching] = useState(true);
  const [error, setError] = useState('');
  const [myCardsOnly, setMyCardsOnly] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState({ label: '', value: '' });
  const [info, setInfo] = useState({ type: '', message: '', exists: false });
  const [useFilters, setUseFilters] = useState(false)
  const batchReqRef = useRef(0)

  const [userLearning, setUserLearning] = useState({})

  useEffect(() => {
    error && setInfo({ type: 'danger', message: error, exists: true });
  }, [error]);

  const apiBatchRequestHandle = useCallback( async(requests) => {
        try {
          const data = await apiBatchRequest(requests)
          const { toAdd, toWish } = data.successRequests; 
          if (toAdd) localStorage.removeItem('toAdd')
          if (toWish) localStorage.removeItem('toWish')
        } catch (error) {
          setError(error.message)
        }
  }, [])

  useEffect(() => {
    localStorage.removeItem('new-deck--to-create')
    const toAdd = JSON.parse(localStorage.getItem('toAdd'))
    const toWish = JSON.parse(localStorage.getItem('toWish'))
    const requests = []
    if (toAdd) requests.push({ route: 'toAdd', body: Object.entries(toAdd).map(([k, v]) => ({deckId: v.deckId ? k : '', deckName: k, words: v.words, deckLang: v.deckLang, userId})) } )
    if (toWish) requests.push({route: 'toWish', body:  Object.entries(toWish).map(([k, v]) => ({deckId: v.deckId ? k : '', deckName: k, words: v.words, deckLang: v.deckLang, userId})) } )
    if (batchReqRef.current === 0 && requests.length) { apiBatchRequestHandle(requests); batchReqRef.current = 1 }
    
  }, [])

  useEffect(() => {
    const getDeckList = async () => {
      try {
        const data = await fetchAllDecks(userId, myCardsOnly, selectedLanguage.value);
        setUserLearning(data.userLearning)
        return data;
      } catch (error) {
        throw new Error(error.message === 'Network Error' ? 'Network Error!' : 'Error. Try again!');
      } finally {
        setSearching(false)
      }
    };

    getDeckList()
      .then((data) => dispatch(deckList(data.decks)))
      .catch((e) => setError(e.message));
  }, [myCardsOnly, selectedLanguage]);

  const onDeckClickHandle = async (deck) => {
    const { _id: deckId } = deck;
    dispatch(openDeck({})); // Resetting the deck in case another deck is clicked
    setPersonalSelectedItem([]);
    fetchDeck(deckId)
      .then(deck => {
        dispatch(openDeck(deck))
        navigate(`options/?deck=${deck._id}`)
      })
      .catch(error => setError(error.message === 'network error' ? 'Network error' : 'Oops! Try again!'))
  };

  const deletingDecks = async () => {
    try {
      const data = await deleteDecks(personalSelectedItem)
      dispatch(removeDecks(personalSelectedItem));
      setPersonalSelectedItem([]);
      setInfo({ type: 'info', message: data.msg, exists: true } );
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (!info.exists) return;
    const timeout = setTimeout(() => {
      setInfo({exists: false});
    }, 5000);
    return () => clearTimeout(timeout);
  }, [info]);

  const navigate = useNavigate();

  const toTemporary = () => {
    navigate('../more/temporary/no-type/no-id');
  };

  return (
    <div className="personal">
      <>
        <div className="head">
          <div className="shelf">Your decks</div>
          <div className="new-deck" onClick={() => navigate('new-deck')}>New Card Deck</div>
        </div>

        {!personalSelectedItem.length ? (
          <div className="personal--filters">
            <span className="filter-btn" onClick={() => setUseFilters(!useFilters)}>{useFilters ? <Close /> : <FilterIcon />} Filters</span>
            {useFilters &&
              <Filters myCardsOnly={myCardsOnly} selectedLanguage={selectedLanguage} setMyCardsOnly={setMyCardsOnly} setSelectedLanguage={setSelectedLanguage} />
            }
            </div>
        ) : (
          <div className="personal--deleting-panel">
            <MuiCheckbox
              label={`${checked ? 'Unselect All' : 'Select All'}`} checkedValue={checked}
              callback={() => {
                setChecked(!checked);
                setPersonalSelectedItem(checked ? [] : deck_list.filter(deck => deck.creator === userId).map(deck => deck._id));
              }}
            />
            <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={deletingDecks}> Delete </Button>
          </div>
        )}

        {info.exists && <Info info={info} />}

        <div className="body">
          {searching && <Spinner radius={120} color="#345C70" stroke={2} visible={true} />}

          {deck_list && deck_list.map((deck) => (
            <div
              className="deck-card"
              style={{ backgroundColor: personalSelectedItem.includes(deck._id) ? '#2225' : '#C0D7DA' }}
              onClick={() => deck.creator === userId &&
                setPersonalSelectedItem(personalSelectedItem.includes(deck._id)
                  ? personalSelectedItem.filter((deckId) => deckId !== deck._id)
                  : [...personalSelectedItem, deck._id]
                )
              }
              onDoubleClick={() => onDeckClickHandle(deck)}
              key={deck._id}
            >
              <div className="deck--meta deck--language-and-owner">
                <div>{deck.deckLang.slice(0, 2)}</div>{deck.creator === userId && <div>Yours</div>}
              </div>
              {deck.deckName}
              <div className="deck--meta deck--mastery-and-length">
                <div>Mastery: 
                  {
                    (() => {
                        const currDeck = userLearning?.decks?.find(deckHere => deckHere.deckId === deck._id)
                        const perc = currDeck ? Math.floor( Math.floor(currDeck.level / CHUNK_TARGET_MASTERY_LEVEL) * deck.words.length + currDeck.chunkIndex * CHUNK_TARGET_MASTERY_LEVEL + currDeck.level % CHUNK_TARGET_MASTERY_LEVEL * deck.words.slice(currDeck.chunkIndex * CHUNK_SIZE, currDeck.chunkIndex * CHUNK_SIZE + CHUNK_SIZE).length * 100 / (deck.words.length * TARGET_PERFECT_LEVEL) ) : 0
                        return perc || 0
                      })()
                  }
                  %</div>
                <div>{deck.words?.length} cards</div>
              </div>
            </div>
          ))}
        </div>
      </>

      <div className="modal">
        {useLocation().pathname.split('/personal')[1] && <Close className="cancel" onClick={() => navigate('/')} />}
        <Routes>
          <Route path="options" element={<Options />} />
          <Route path="adding" element={<CardAdd />} />
          <Route path="adding/manual" element={<CardAddManual />} />
          <Route path="adding/auto" element={<CardAddAuto />} />
          <Route path="new-deck" element={<NewDeck />} />
          <Route path="learning" element={<CardLearn />} />
          <Route path="guided-learning" element={<GuidedLearning />} />
          <Route path="quiz" element={<Quiz />} />
        </Routes>
      </div>
    </div>
  );
};

export default Personal;
