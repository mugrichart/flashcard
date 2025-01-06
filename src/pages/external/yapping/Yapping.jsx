import { useEffect, useState } from 'react';
import './Yapping.css';
import Side from './Side';
import StoryCatalog from './story-catalog/StoryCatalog';
import Onboarding from './creation-onboarding/Onboarding';
import Story from './Story';
import Submission from './story-submission/Submission';

import useGeneralHook from './utils/useGeneralHook';
import { useSelector } from 'react-redux';
import { getKeywords } from './utils/sentenceAnalyzer';

import usePageRefreshHandle from "../../../utils/usePageRefreshHandle"

import Info from '../../../components/Info'

const Yapping = ({ mode, storyGameUtils, setStoryGameUtils, isGameCreator }) => {
  const handleRefresh = usePageRefreshHandle()
  const { learning, _id: deckId } = useSelector((state) => state.deck.openDeck);
  const [words, setWords] = useState(learning?.words?.map((wordObj) => wordObj.word)?.slice(0, 30) || []); // 30 words

  useEffect(() => {
    if (words.length) return
    setWords(cards.map((cardObj) => cardObj['related words'][Math.floor(Math.random() * cardObj['related words'].length)]).slice(0, 30))
  }, [learning])

  useEffect(() => {
    handleRefresh(deckId)
  }, [deckId])  

  const [story, setStory] = useState([]);
  const [stories, setStories] = useState([]);
  const [title, setTitle] = useState(mode?.startsWith("game") ? storyGameUtils.title : "");
  const [summary, setSummary] = useState(mode?.startsWith("game") ? storyGameUtils.summary : "")
  const [checked, setChecked] = useState(false);
  const [activity, setActivity] = useState(storyGameUtils?.activity || ""); // creating or practicing
  const [selected, setSelected] = useState(-1); // story index
  const [aiHelp, setAiHelp] = useState('');
  const [aiOptionsDisplay, setAiOptionsDisplay] = useState(false);
  const [currSentence, setCurrSentence] = useState({sentence: '', blanked: ''});
  const [selectedWords, setSelectedWords] = useState([])
  const [okAttempt, setOkAttempt] = useState("")
  const [isLeadAuthor, setIsLeadAuthor] = useState(isGameCreator)

  const [info, setInfo] = useState({ type: '', message: '', exists: false });

  const { handlePartSelection, handleSubmit, handleSummarySubmit, callUponAi, handleApproval} = useGeneralHook(
    mode,
    aiHelp, setAiHelp,
    selected, setSelected,
    currSentence, setCurrSentence, 
    activity, setActivity, 
    info, setInfo,
    deckId, 
    checked, 
    words, setWords,
    setSelectedWords,
    story, setStory,
    title, setTitle, 
    stories, setStories,
    summary
  )

  useEffect(() => {
    if (!mode?.startsWith("game")) return
    // console.log('about to change story', storyGameUtils, `activity: ${activity}`)
    const votedSentence = storyGameUtils.votedSentence;
    const titleDifferent = storyGameUtils?.title !== title
    const summaryDifferent = storyGameUtils?.summary !== summary
    const activityDifferent = (storyGameUtils.activity === "" || storyGameUtils.activity) && storyGameUtils.activity !== activity
    if (
        storyGameUtils?.source === "this-writer" || storyGameUtils.voting ||
        !(votedSentence || titleDifferent || summaryDifferent || activityDifferent)
    ) return
    if (votedSentence) setStory(prev => {
        const updatedStory = [...prev]; 
        updatedStory[updatedStory.length - 1] = storyGameUtils.votedSentence;
        return updatedStory
      })
    if (titleDifferent) setTitle(storyGameUtils.title)
    if (summaryDifferent) setSummary(storyGameUtils.summary)
    if (activityDifferent) setActivity(storyGameUtils.activity)
    if (storyGameUtils.activity === "") setStories(prev => [...prev, storyGameUtils.story])
  }, [storyGameUtils])

  useEffect(() => {
    // console.log(activity, storyGameUtils)
    if (!mode?.startsWith("game")) return
    if (currSentence.sentence && storyGameUtils.source !== "this-writer") {
      setStoryGameUtils(prev => ({...prev, source: "this-writer"})) // so that when story changes, can be exported to game
    }
    if (
      (activity === "submitting" && storyGameUtils.activity === "creating") ||
      (activity === "uploading" && storyGameUtils.activity === "submitting") ||
      (activity === "" && storyGameUtils.activity === "uploading") ||
      (activity === "onboarding" && storyGameUtils.activity === "") ||
      (activity === "countdown" && storyGameUtils.activity === "onboarding") ||
      (activity === "creating" && storyGameUtils.activity === "countdown")
    ) {
      setStoryGameUtils(prev => (activity === "uploading" && storyGameUtils.activity === "submitting") ?
                        {...prev, activity, title, summary, story, checked, source: "this-writer"} :
                        {...prev, activity, source: "this-writer"}
        )
    }
  }, [currSentence, activity])

  useEffect(() => {
    // console.log(title, summary, mode, storyGameUtils)
    if (mode?.startsWith("game") && (title || summary) && (storyGameUtils.title !== title || storyGameUtils.summary !== summary)) {
      setStoryGameUtils(prev => ({...prev, title, summary}))
    }
  }, [title, summary])

  useEffect(() => {
    // console.log(mode, story, storyGameUtils)
    if (!mode?.startsWith("game")) return;
    if (storyGameUtils.source !== "this-writer") return;
    setStoryGameUtils(prev => ({...prev, currSentence: story[story.length - 1]}))
  }, [story])

  return (
    <div className='Yapping'>
      {
        {creating: story?.length < 3, practicing: okAttempt?.split('.')?.length < 2 }[activity] || !activity ?
        <h1>Story time</h1> : <></>
      }
      {info.exists && (
        <Info info={info} id='Yapping--info' />
      )}
      {aiHelp &&
        <form action="" className='Yapping--summary' id='Yapping--form' onSubmit={handleSummarySubmit}>
          <label htmlFor="">Title: <input type="text" id='Yapping--title' placeholder='optional' /></label>
          <p>Provide a short summary of your story to guide your assistant</p>
          <textarea name="" id="Yapping--summary"></textarea>
          <input type="submit" value='Start' className='Yapping--button'/>
        </form>
      }
      {activity ? <h3>Title: {title || '---No title yet!---'}</h3> : <></>}
      {
        !activity ?
        <StoryCatalog 
          stories={stories}
          setSelected={setSelected} selected={selected}
          setActivity={setActivity}
          setTitle={setTitle} setSummary={setSummary}
          setStory={setStory}
        /> :
        <></>
      }
      {
        ['creating', 'practicing'].includes(activity) &&
        <Side 
        stories={stories}
        words={words} setWords={setWords} 
        selectedWords={selectedWords} setSelectedWords={setSelectedWords}
        okAttempt={okAttempt}
        currSentence={currSentence.sentence}
        setSelected={setSelected} selected={selected}
        setActivity={setActivity} activity={activity} 
        story={story} setStory={setStory}
        correctWordSet={activity === 'practicing' && getKeywords(currSentence.sentence?.split(' '), currSentence.blanked?.split(' ').filter(word => !['.', ',', ';', ']', '"', ')', '}', '?', '!'].includes(word)))}
        />
      }
      { activity==='onboarding' &&
        <Onboarding 
          isLeadAuthor={isLeadAuthor}
          words={words} mode={mode}
          setAiHelp={setAiHelp} aiHelp={aiHelp}
          title={title} setTitle={setTitle}
          aiOptionsDisplay={aiOptionsDisplay} setAiOptionsDisplay={setAiOptionsDisplay}
          setActivity={setActivity}
          summary={summary} setSummary={setSummary}
        />
      }
      {
        ['creating', 'practicing', 'reading'].includes(activity) && story &&
        <Story 
          mode={mode}
          isLeadAuthor={isLeadAuthor}
          selectedWords={selectedWords} words={words}
          info={info} setInfo={setInfo}
          story={story} 
          activity={activity} setActivity={setActivity}
          title={title} setTitle={setTitle}
          okAttempt={okAttempt} setOkAttempt={setOkAttempt}
          currSentence={currSentence} setCurrSentence={setCurrSentence}
          setAiHelp={setAiHelp} aiHelp={aiHelp} 
          setChecked={setChecked} checked={checked}
          setAiOptionsDisplay={setAiOptionsDisplay} aiOptionsDisplay={aiOptionsDisplay} 
          handlePartSelection={handlePartSelection} 
          handleSubmit={handleSubmit} 
          callUponAi={callUponAi}
          handleApproval={handleApproval}
        />
      }
      {
        activity === 'submitting' && 
        <Submission 
          mode = {mode}
          isLeadAuthor={isLeadAuthor}
          title={title} setTitle={setTitle}
          story={story}
          checked={checked} setChecked={setChecked}
          handleSubmit={handleSubmit}
        />
      }

    </div>
  );
};

export default Yapping;
