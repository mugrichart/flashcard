import { useEffect, useState, useCallback } from 'react';
import { removeKeywords } from './sentenceAnalyzer';
import useTextToSpeech from './useTextToSpeech';
import { Button } from '@mui/material';
import { STORY_MINIMUM_NUMBER_OF_SENTENCES } from "../../../../constants/"
import { StoreSharp } from '@mui/icons-material';


export default ({ 
    storySettings, setStorySettings,
    mode, isLeadAuthor,
    info, setInfo, 
    okAttempt, setOkAttempt,
    handlePartSelection,
    callUponAi,
    attempt, setAttempt,
    correctSentence, setCorrectSentence
  }) => {
    
  const [cheerSound] = useState(new Audio("/sounds/cheer.wav"))
  const [sentenceIndex, setSentenceIndex] = useState(0);

  // text to speech
  const [voice, setVoice] = useState(null);
  const { voices, speak, pause, resume, cancel } = useTextToSpeech();

  useEffect(() => {
    if (storySettings.mode === "practice") {
      setAttempt(storySettings.sentenceInPractice.blanked?.split(' '));
      setCorrectSentence(storySettings.sentenceInPractice.sentence?.split(' '))
    }
  }, [storySettings.sentenceInPractice])

  useEffect(() => {
    setVoice(voices[1]);
    return () => 
        {cancel(); cheerSound.pause()}
  }, [voices]);

  const sayIt = useCallback((script) => {
    const scriptToSpeak = storySettings.mode === 'create' ? script.join(' ') : script
    setTimeout(() => speak(scriptToSpeak, voice), 5000)
  }, [storySettings.mode, voice]);

  useEffect(() => {
    if (storySettings.mode === "create" || !attempt.length) return;
    const firstInput = document.getElementsByClassName('attempt-input')[0]
    firstInput?.focus()
    if (firstInput?.value?.startsWith('__')) firstInput.select()
    if (attempt?.join(' ') === correctSentence.join(' ')) {
      console.error(attempt)
      const approvedAttempt = okAttempt + ' ' + attempt.join(' ')
      setOkAttempt(approvedAttempt);
      
      if (storySettings.sentenceIndex === storySettings.details.length - 1) {
        cheerSound.play()
        setInfo({exists: true, type: 'success', message: 'Congratulations! You have successfully filled all the blanks in the story.'})
        setStorySettings(prev => prev.rebuild({mode: "read"}))
        return sayIt(`Congratulations for completing this story. I am now going to recount the whole story for you: ${approvedAttempt}`)
      }
     
      // setStorySettings(prev => prev.rebuild({sentenceIndex: prev.sentenceIndex + 1, sentenceInPractice: prev.details[prev.sentenceIndex + 1] }))
      setStorySettings(prev => prev.nextSentence(storySettings.sentenceIndex) || prev)
    }
  }, [attempt])


  useEffect(() => {
      if (!(storySettings.mode === 'practice')) return
      const [sentenceWithoutKeywords, sentenceWithKeywords] = removeKeywords(storySettings.sentenceInPractice.sentence?.split(' '), storySettings.sentenceInPractice.blanked?.split(' ').filter(word => !['.', ',', ';', ']', '"', ')', '}', '?', '!'].includes(word)))
      //console.log(sentenceWithKeywords, sentenceWithoutKeywords)
      if (storySettings.sentenceInPractice.blanked) {
        setAttempt(sentenceWithoutKeywords)
        setCorrectSentence(sentenceWithKeywords)
      }
    }
  ,[storySettings.sentenceIndex])

  const FinishButton = () => {
    const chosenButton = {
      text: "", whereTo: ""
    }
    if (storySettings.mode === "create") {
      const passedMinCheck = storySettings.details?.length >= STORY_MINIMUM_NUMBER_OF_SENTENCES; // The story has the minimum number of sentences
      const wordsFinished = storySettings.words.length === 0 && StoreSharp.story?.length > 0 // words finished, but there is some story
      const notWriting = !storySettings.sentenceInProgress.sentence;
      if ((passedMinCheck || wordsFinished) && (isLeadAuthor || !mode) && notWriting) {
        chosenButton.text = "Submit story"
        chosenButton.chosenActivity = "submit"
      }
    } 
    else if (storySettings.mode === "read") {
      chosenButton.text = "Practice again"
      chosenButton.chosenActivity = "catalog"
    }
  
    if (chosenButton.text) return (
      <Button
        variant="contained" color='primary' disableElevation 
        onClick={() => setStorySettings(prev => prev.rebuild({step: chosenButton.chosenActivity}))}
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
    handlePartSelection, callUponAi, 
    info, FinishButton
  }

}
