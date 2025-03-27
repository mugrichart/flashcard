import { useEffect, useState, useCallback } from 'react';
import { removeKeywords } from './sentenceAnalyzer';
import useTextToSpeech from './useTextToSpeech';
import { Button } from '@mui/material';
import { STORY_MINIMUM_NUMBER_OF_SENTENCES } from "../../../../constants/"
import { StoreSharp } from '@mui/icons-material';


export default ({ 
    storySettings, setStorySettings,
    mode, isLeadAuthor,
    selectedWords, words,
    info, setInfo,
    story, 
    activity, setActivity,
    okAttempt, setOkAttempt,
    title, setTitle,
    currSentence, setAiHelp, aiHelp, 
    aiOptionsDisplay, setAiOptionsDisplay, 
    setChecked, checked, handlePartSelection, 
    handleSubmit, setCurrSentence,
    callUponAi, handleApproval,
    attempt, setAttempt,
    correctSentence, setCorrectSentence
  }) => {
    
  const [cheerSound] = useState(new Audio("/sounds/cheer.wav"))
  const [sentenceIndex, setSentenceIndex] = useState(0);

  // text to speech
  const [voice, setVoice] = useState(null);
  const { voices, speak, pause, resume, cancel } = useTextToSpeech();

  useEffect(() => {
    if (storySettings.state.mode == "create") setSentenceIndex(storySettings.state.story.length)
    else {
      setAttempt(storySettings.state.sentenceInPractice.blanked?.split(' '));
      setCorrectSentence(storySettings.state.sentenceInPractice.sentence?.split(' '))
    }
  }, [storySettings.state.story])

  useEffect(() => {
    setVoice(voices[1]);
    return () => 
        {cancel(); cheerSound.pause()}
  }, [voices]);

  const sayIt = useCallback((script) => {
    const scriptToSpeak = storySettings.mode === 'create' ? script.join(' ') : script
    setTimeout(() => speak(scriptToSpeak, voice), 5000)
  }, [activity, voice]);

  useEffect(() => {
    if (storySettings.state.mode === "create" || !attempt.length) return;
    const firstInput = document.getElementsByClassName('attempt-input')[0]
    firstInput?.focus()
    if (firstInput?.value?.startsWith('__')) firstInput.select()
    if (attempt?.join(' ') === correctSentence.join(' ')) {
      const approvedAttempt = okAttempt + ' ' + attempt.join(' ')
      setOkAttempt(approvedAttempt);
      
      if (storySettings.state.sentenceIndex === storySettings.state.story.length - 1) {
        cheerSound.play()
        setInfo({exists: true, type: 'success', message: 'Congratulations! You have successfully filled all the blanks in the story.'})
        setStorySettings(prev => ({...prev, state: {...prev.state, mode: "read"}}))
        return sayIt(`Congratulations for completing this story. I am now going to recount the whole story for you: ${approvedAttempt}`)
      }
     
      setStorySettings(prev => ({...prev, state: {...prev.state, sentenceIndex: prev.state.sentenceIndex + 1, sentenceInPractice: prev.state.story[prev.state.sentenceIndex + 1] }}))
    }
  }, [attempt])


  useEffect(() => {
      if (!(storySettings.state.mode === 'practice')) return
      const [sentenceWithoutKeywords, sentenceWithKeywords] = removeKeywords(storySettings.state.sentenceInPractice.sentence?.split(' '), storySettings.state.sentenceInPractice.blanked?.split(' ').filter(word => !['.', ',', ';', ']', '"', ')', '}', '?', '!'].includes(word)))
      if (storySettings.state.sentenceInPractice.blanked) {
        setAttempt(sentenceWithoutKeywords)
        setCorrectSentence(sentenceWithKeywords)
      }
    }
  ,[storySettings.state.sentenceInPractice])

  const FinishButton = () => {
    const chosenButton = {
      text: "", whereTo: ""
    }
    if (storySettings.state.mode === "create") {
      const passedMinCheck = storySettings.state.story?.length >= STORY_MINIMUM_NUMBER_OF_SENTENCES; // The story has the minimum number of sentences
      const wordsFinished = words.length === 0 && StoreSharp.state.story?.length > 0 // words finished, but there is some story
      const notWriting = !currSentence.sentence;
      if ((passedMinCheck || wordsFinished) && (isLeadAuthor || !mode) && notWriting) {
        chosenButton.text = "Submit story"
        chosenButton.chosenActivity = "submit"
      }
    } 
    else if (storySettings.state.mode === "read") {
      chosenButton.text = "Practice again"
      chosenButton.chosenActivity = "catalog"
    }
  
    if (chosenButton.text) return (
      <Button
        variant="contained" color='primary' disableElevation 
        onClick={() => setStorySettings(prev => ({...prev, state: {...prev.state, step: chosenButton.chosenActivity}}))}
      >
        {chosenButton.text}
      </Button>
    )
    return null
  }

  return {
    storySettings, setStorySettings,
    attempt, setAttempt,
    correctSentence,
    okAttempt, activity, setActivity, currSentence, 
    setCurrSentence, story, handleApproval, handlePartSelection, callUponAi, 
    selectedWords, isLeadAuthor, mode, words,
    sentenceIndex, setSentenceIndex, 
    info,
    FinishButton
  }

}