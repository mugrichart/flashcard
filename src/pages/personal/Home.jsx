import React, { useCallback, useEffect, useState, useRef } from 'react';
import Spinner from 'react-spinner-material';
import './Personal.css';
import Filters from '../filters/Filters';
import { useSelector, useDispatch } from 'react-redux';
import { chooseTopic, storeSubTopics, removeTopics } from '../../features/personal/topic/topicSlice';
import { updateLearning } from './modals/guided-learning/utils/useLearning';
import { Button } from '@mui/material';
import { Delete as DeleteIcon, FilterAlt as FilterIcon, Clear as Close } from '@mui/icons-material';
import { MuiCheckbox } from '../../components/MuiComponents';
import MinCard from '../../components/card/MinCard';
import Info from '../../components/Info';

import { useNavigate } from 'react-router-dom';
import { fetchOneTopic, fetchManyTopics, deleteTopics, apiBatchRequest, getWords } from '../../api/http'

import { CHUNK_SIZE, CHUNK_TARGET_MASTERY_LEVEL, TARGET_PERFECT_LEVEL } from '../../constants'

export default ({ page }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { subTopics, words, _id: topicID } = useSelector((state) => state.topic || {});
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
  const [topicChain, setTopicChain] = useState([])

  const [userLearning, setUserLearning] = useState({})

  useEffect(() => {
    console.log(error)
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
    localStorage.removeItem('new-topic--to-create')
    const toAdd = JSON.parse(localStorage.getItem('toAdd'))
    const toWish = JSON.parse(localStorage.getItem('toWish'))
    const requests = []
    if (toAdd) requests.push({ route: 'toAdd', body: Object.entries(toAdd).map(([k, v]) => ({id: v.id ? k : '', name: k, words: v.words, language: v.language, userId})) } )
    if (toWish) requests.push({route: 'toWish', body:  Object.entries(toWish).map(([k, v]) => ({id: v.id ? k : '', name: k, words: v.words, language: v.language, userId})) } )
    if (batchReqRef.current === 0 && requests.length) { apiBatchRequestHandle(requests); batchReqRef.current = 1 }
    
  }, [])

  const getSubTopics = useCallback(async (parent) => {
    try {
      const data = await fetchManyTopics(userId, myCardsOnly, selectedLanguage.value, parent);
      if (!data?.length) setMyCardsOnly(false)
      return data;
    } catch (error) {
      throw error;
    } finally {
      setSearching(false)
    }
  }, [myCardsOnly, selectedLanguage.value])

  useEffect(() => {
    getSubTopics(null)
      .then(({ topics }) => {
          if (topics) dispatch(storeSubTopics(topics))
          dispatch(chooseTopic({ words: []}))
      })
      .catch(error => setError(error.message))
  }, [myCardsOnly, selectedLanguage]);

  const onTopicClickHandle = async (topic) => {
    setPersonalSelectedItem([]);
    setTopicChain(topic ? [...topicChain, topic] : [])
    dispatch(chooseTopic(topic))
    setSearching(true)
    // navigate(`options/?topic=${topic._id}`)
    getSubTopics(topic?._id)
      .then(({ topics }) => {
        console.log(topics)
        dispatch(dispatch(storeSubTopics(topics)))
      })
      .catch(error => setError(error.message))
      .finally(() => setSearching(false))
    
    if (false) getWords("english", topic.words)
      .then(data => {
        console.log(data.words)
        dispatch(chooseTopic({words: data.words || []}))
      })
  };

  const deletingTopics = async () => {
    try {
      const data = await deleteTopics(personalSelectedItem)
      dispatch(removeTopics(personalSelectedItem));
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

  useEffect(() => {
    if (page !== "topics" && words.length) {
      setSearching(true)
      getWords("english", words)
      .then(data => {
        console.log(data.words)
        dispatch(chooseTopic({words: data.words || []}))
        setSearching(false)
        if (["chats", "stories"].includes(page)) {
          setSearching(true)
          updateLearning(dispatch, topicID, data.words)
            .then(() => {
                setSearching(false)
                if (page === "stories") navigate(`../../more/story-time/?topic=${topicID}`)
                if (page === "chats") navigate(`../../more/chat-time/?topic=${topicID}`)
            })
        }
        else if (page === "learning") {
          navigate(`../guided-learning?topic=${topicID}`)
        }
      })
    }


  }, [page])

  

  const topicDisplay = (name) => {
    return name.replaceAll("_", " ").split(" ").map(subName => subName.slice(0, 5)).join(" ") + " / "
  }

  const handleTopicNavigation = (topic, index) => {
    console.log(topicChain.slice(0, index))
    
    onTopicClickHandle(topic).then(() => setTopicChain(topicChain.slice(0, index + 1)))
  }

  return (
    <div className="personal">
        {!personalSelectedItem.length ? (
          <div className="personal--filters">
            <span className="filter-btn" onClick={() => setUseFilters(!useFilters)}>{useFilters ? <Close /> : <FilterIcon />} Filters</span>
              <Filters useFilters={useFilters} myCardsOnly={myCardsOnly} selectedLanguage={selectedLanguage} setMyCardsOnly={setMyCardsOnly} setSelectedLanguage={setSelectedLanguage} page={page} words={words}/>
          </div>
        ) : (
          <div className="personal--deleting-panel">
            <MuiCheckbox
              label={`${checked ? 'Unselect All' : 'Select All'}`} checkedValue={checked}
              callback={() => {
                setChecked(!checked);
                setPersonalSelectedItem(checked ? [] : subTopics.filter(topic => topic.creator === userId).map(topic => topic._id));
              }}
            />
            <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={deletingTopics}> Delete </Button>
          </div>
        )}

        <div className="head">
          <div className="shelf">Your {page} 
            <div style={{ maxWidth: "400px"}}>
                <button onClick={e => onTopicClickHandle()}>--/</button>
                {topicChain.map((topic, index) => <button key={index} onClick={() => handleTopicNavigation(topic, index)}>{topicDisplay(topic.name)}</button>)}
            </div>
          </div>
          <div>
            { words.length > 0 && page === "stories" && <button className='option' onClick={() => navigate(`../guided-learning?topic=${topicID}`)}>New story</button>}
            { words?.length > 0 && ["words", "topics"].includes(page) && <button className='option' onClick={() => navigate(`../learning`)}>▶️Learning</button>}
            {page === "topics" && <button className='option' onClick={() => navigate(`new-topic/?topics=${topicChain.map(topic => topic.name).join(" > ")}`)}>New {topicChain.length ? "sub topic" : "Topic"}</button>}
            {
                ["words"].includes(page) && topicChain.length > 0 && <>
                <button className='option' onClick={() => navigate(`../adding/?topic=${topicID}&&topics=${topicChain.map(topic => topic.name).join(" > ")}`)}>populate</button>
              </>
            }
          </div>
        </div>

        {info.exists && <Info info={info} />}

        <div className="body">
          {searching && <Spinner radius={120} color="#345C70" stroke={2} visible={true} />}

          {(subTopics?.length && page === "topics")? subTopics.map((topic) => (
            <li
              className="topic-card topic"
              style={{ backgroundColor: personalSelectedItem.includes(topic._id) ? '#2225' : '#C0D7DA' }}
              onClick={() => topic.creator === userId &&
                setPersonalSelectedItem(personalSelectedItem.includes(topic._id)
                  ? personalSelectedItem.filter((topicID) => topicID !== topic._id)
                  : [...personalSelectedItem, topic._id]
                )
              }
              onDoubleClick={() => onTopicClickHandle(topic)}
              key={topic._id}
            >
              <div className="topic--meta topic--language-and-owner">
                <div>{topic.language?.slice(0, 2)}</div>{topic.creator === userId && <div>Yours</div>}
              </div>
              {topic.name?.replaceAll("_", " ", 1)}
              <div className="topic--meta topic--mastery-and-length">
                <div>Mastery: 
                  {
                    (() => {
                        const currTopic = userLearning?.topics?.find(topicHere => topicHere.topicID === topic._id)
                        const perc = currTopic ? Math.floor( Math.floor(currTopic.level / CHUNK_TARGET_MASTERY_LEVEL) * topic.words.length + currTopic.chunkIndex * CHUNK_TARGET_MASTERY_LEVEL + currTopic.level % CHUNK_TARGET_MASTERY_LEVEL * topic.words.slice(currTopic.chunkIndex * CHUNK_SIZE, currTopic.chunkIndex * CHUNK_SIZE + CHUNK_SIZE).length * 100 / (topic.words.length * TARGET_PERFECT_LEVEL) ) : 0
                        return perc || 0
                      })()
                  }
                  %</div>
                <div>{topic.words?.length} cards</div>
              </div>
            </li>
            )) :
            ( page === "words" && words?.length) ?
              
                words.map((wObj, index) => <li 
                                            className='topic-card'
                                            key={index}
                                            // style={{width: "300px", padding: "1em", listStyle: "none", border: "2px solid lightblue", minHeight: "300px", height: "fit-content"}}
                                            ><MinCard wObj={wObj} /></li>)
            :
            !searching && <p>This topic doesn't have {page === "topics" ? "topics" : "words"} yet! Populate it!</p>
          }
        </div>
      
    </div>
  );
};
