import { useEffect, useState, useCallback } from 'react';
import { removeKeywords } from './sentenceAnalyzer';
import useTextToSpeech from './useTextToSpeech';
import { Button } from '@mui/material';
import { STORY_MINIMUM_NUMBER_OF_SENTENCES } from "../../../../constants/"


export default ({ 
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
    
  // const [attempt, setAttempt] = useState(currSentence.blanked?.split(' '))
  // const [correctSentence, setCorrectSentence] = useState(currSentence.sentence?.split(' '))
  const [cheerSound] = useState(new Audio("/sounds/cheer.wav"))
  const [sentenceIndex, setSentenceIndex] = useState(0);

  // text to speech
  const [voice, setVoice] = useState(null);
  const { voices, speak, pause, resume, cancel } = useTextToSpeech();

  useEffect(() => {
    if (activity == "creating") setSentenceIndex(story.length)
    else {
      setAttempt(currSentence.blanked?.split(' '));
      setCorrectSentence(currSentence.sentence?.split(' '))
    }
  }, [story])

  useEffect(() => {
    setVoice(voices[1]);
    return () => 
        {cancel(); cheerSound.pause()}
  }, [voices]);

  const sayIt = useCallback((script) => {
    const scriptToSpeak = activity === 'creating' ? script.join(' ') : script
    setTimeout(() => speak(scriptToSpeak, voice), 5000)
  }, [activity, voice]);

  useEffect(() => {
    if (activity === "creating" || !attempt.length) return;
    const firstInput = document.getElementsByClassName('attempt-input')[0]
    firstInput?.focus()
    if (firstInput?.value?.startsWith('__')) firstInput.select()
    if (attempt?.join(' ') === correctSentence.join(' ')) {
      const approvedAttempt = okAttempt + ' ' + attempt.join(' ')
      setOkAttempt(approvedAttempt);
      const index = currSentence.index;
      setSentenceIndex(sentenceIndex + 1)
      if (index === story.length - 1) {
        cheerSound.play()
        setInfo({exists: true, type: 'success', message: 'Congratulations! You have successfully filled all the blanks in the story.'})
        setActivity('reading')
        return sayIt(`Congratulations for completing this story. I am now going to recount the whole story for you: ${approvedAttempt}`)
      }
      // sayIt(attempt)
      setCurrSentence({...story[index+1], index: index+1})
    }
  }, [attempt])


  useEffect(() => {
      if (!(activity === 'practicing')) return
      const [sentenceWithoutKeywords, sentenceWithKeywords] = removeKeywords(currSentence.sentence?.split(' '), currSentence.blanked?.split(' ').filter(word => !['.', ',', ';', ']', '"', ')', '}', '?', '!'].includes(word)))
      if (currSentence.blanked) {
        setAttempt(sentenceWithoutKeywords)
        setCorrectSentence(sentenceWithKeywords)
      }
    }
  ,[currSentence])

  const FinishButton = () => {
    const chosenButton = {
      text: "", whereTo: ""
    }
    if (activity === "creating") {
      const passedMinCheck = story?.length >= STORY_MINIMUM_NUMBER_OF_SENTENCES; // The story has the minimum number of sentences
      const wordsFinished = words.length === 0 && story?.length > 0 // words finished, but there is some story
      const notWriting = !currSentence.sentence;
      if ((passedMinCheck || wordsFinished) && (isLeadAuthor || !mode) && notWriting) {
        chosenButton.text = "Submit story"
        chosenButton.chosenActivity = "submitting"
      }
    } 
    else if (activity === "reading") {
      chosenButton.text = "Practice again"
      chosenButton.chosenActivity = ""
    }
  
    if (chosenButton.text) return (
      <Button
        variant="contained" color='primary' disableElevation 
        onClick={() => setActivity(chosenButton.chosenActivity)}
      >
        {chosenButton.text}
      </Button>
    )
    return null
  }

  return {
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