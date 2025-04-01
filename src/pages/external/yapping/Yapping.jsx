import { useEffect, useState } from 'react';
import isEqual from "lodash/lodash";

import './Yapping.css';
import Side from './Side';
import StoryCatalog from './story-catalog/StoryCatalog';
import Onboarding from './creation-onboarding/Onboarding';
import ChatOnboarding  from './chat-onboarding/Onboarding';
import Story from './Story';
import Submission from './story-submission/Submission';

import useGeneralHook from './utils/useGeneralHook';
import { useSelector } from 'react-redux';
import { getKeywords } from './utils/sentenceAnalyzer';

import usePageRefreshHandle from "../../../utils/usePageRefreshHandle"

import Info from '../../../components/Info'

import StorySetup from './utils/storySettings';

const Yapping = ({ gameInfo, setGameInfo, userID, mode, storyGameUtils, setStoryGameUtils, isGameCreator, typeOfGame }) => {
  const handleRefresh = usePageRefreshHandle()
  const { learning: deck, _id: deckId, words: cards } = useSelector((state) => state.deck.openDeck);
  const [words, setWords] = useState(deck.words?.map((wordObj) => wordObj.word)?.slice(0, 20) || [] ); // 20 words

  useEffect(() => {
    if (mode?.startsWith("game")) return;
    setWords(deck.words?.map(wordObj => wordObj.word)?.slice(0, 20) || [])
  }, [deck])

  useEffect(() => {
    handleRefresh(deckId)
  }, [deckId])  

  const [ storySettings, setStorySettings ] = useState( {} )

  const areObjValuesDifferent = (obj1, obj2, keys) => {
    if (Object.keys(obj1).length && Object.keys(obj2).length) return keys.map(k => obj1[k] !== obj2[k]).some(v => v)
  }

  useEffect(() => {
    if ( areObjValuesDifferent(gameInfo.data, storySettings, ["title", "summary", "step", "sentenceIndex"])) {
      setGameInfo(prev => {
        const copyOfGameInfo = { ...prev }
        if (storySettings.step === "submit" && copyOfGameInfo.status === "in progress") {
          copyOfGameInfo.status = "post-game";
          copyOfGameInfo.statusHistory.push("in progress")
        }
        copyOfGameInfo.data = {...storySettings.metadata, ...storySettings.state}
        copyOfGameInfo.source = userID
        console.log("altered game")
        return copyOfGameInfo
      })
    }
  }, [storySettings])

  useEffect(() => {
    if (gameInfo.source !== userID) {
      console.log("altered story")
      setStorySettings( new StorySetup(gameInfo.data || {}))
    }
  }, [gameInfo])

  const [checked, setChecked] = useState(false);
  const [selectedWords, setSelectedWords] = useState([])
  const [okAttempt, setOkAttempt] = useState("")
  const [attempt, setAttempt] = useState([])
  const [correctSentence, setCorrectSentence] = useState([])
  const [correctWordSet, setCorrectWordSet] = useState([])

  const [info, setInfo] = useState({ type: '', message: '', exists: false });

  const { handleSubmit, callUponAi, updateAttempt } = useGeneralHook(
    {
    storySettings, setStorySettings,
    mode, info, setInfo,
    deckId, checked, 
    words, setWords,
    selectedWords, setSelectedWords,
    attempt, setAttempt, correctSentence
  }
  )

  useEffect(() => {
    if (storySettings.state?.mode === 'practice') 
      setCorrectWordSet(
        getKeywords(
          storySettings.sentenceInPractice.sentence?.split(' '), 
          storySettings.sentenceInPractice.blanked?.split(' ').filter(word => !['.', ',', ';', ']', '"', ')', '}', '?', '!'].includes(word)))
      )
  }, [storySettings?.sentenceInPractice])


  return (
    <div className='Yapping'>
      {
        {create: storySettings.details?.length < 3, practice: okAttempt?.split('.')?.length < 2 }[storySettings.mode] || !storySettings.mode ?
        <h1>Story time</h1> : <></>
      }
      {info.exists && (
        <Info info={info} id='Yapping--info' />
      )}
      {(storySettings.mode && storySettings.title) ? <h3>Title: {storySettings.title}</h3> : <></>}
      {
        storySettings.step === "catalog" ?
        <StoryCatalog 
          deckId = {deckId}
          setStorySettings={setStorySettings}
          gameInfo={gameInfo}
        /> :
        <></>
      }
      {
        ['create', 'practice'].includes(storySettings.mode) && ['create', 'practice'].includes(storySettings.step) &&
        <Side 
          selectedWords={selectedWords} 
          okAttempt={okAttempt}
          correctWordSet={correctWordSet}
          updateAttempt={updateAttempt}
          storySettings={storySettings}
        />
      }
      { storySettings.mode === "create" && storySettings.step ==='onboarding' &&
        (
          gameInfo.type === "story"?
          <Onboarding 
            storySettings={storySettings} setStorySettings={setStorySettings}
            gameInfo={gameInfo} userID={userID}
          /> :
          <ChatOnboarding 
            storySettings={storySettings} setStorySettings={setStorySettings}
            playerCount = {storyGameUtils?.playerCount || 0}
            mode={mode}
          />
        )
      }
      {
        ['create', 'practice', 'read'].includes(storySettings.mode) && ['create', 'practice', 'read'].includes(storySettings.step) &&
        <Story 
          storySettings={storySettings} setStorySettings={setStorySettings}
          mode={mode}
          info={info} setInfo={setInfo}
          okAttempt={okAttempt} setOkAttempt={setOkAttempt}
          callUponAi={callUponAi}
          attempt={attempt} setAttempt={setAttempt}
          correctSentence={correctSentence} setCorrectSentence={setCorrectSentence}
          updateAttempt={updateAttempt}
        />
      }
      {
        storySettings.step === 'submit' && 
        <Submission 
          storySettings={storySettings} setStorySettings={setStorySettings}
          gameInfo={gameInfo} setGameInfo={setGameInfo}
          userID={userID}
          mode = {mode}
          checked={checked} setChecked={setChecked}
          handleSubmit={handleSubmit}
        />
      }

    </div>
  );
};

export default Yapping;
