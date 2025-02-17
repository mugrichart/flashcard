import { useCallback, useEffect, useState } from "react";

import axios from 'axios';
import API_BASE_URL from "../../../../../serverConfig";

const useGeneralHook = (
  {
    mode,
    aiHelp, setAiHelp,
    selected, setSelected,
    currSentence, setCurrSentence, 
    activity, setActivity, 
    info, setInfo , 
    deckId, 
    checked, 
    words, setWords,
    selectedWords, setSelectedWords,
    story, setStory,
    title, setTitle, 
    stories, setStories,
    summary, attempt, setAttempt, correctSentence
  }) => {

  const [userId] = useState(JSON.parse(localStorage.getItem('user')).userId);
  const [winSound] = useState(new Audio("/sounds/win.wav"))

  useEffect(() => {
    if (!deckId || mode?.startsWith("game")) return
    axios
    .get(`${API_BASE_URL}/cards/story-time/${deckId}`)
    .then((res) => {
      const { stories } = res.data;
      setStories(() => {
          return stories
      })
    })
    .catch((e) => console.log(e.msg));
  }, [deckId])

  useEffect(() => {
    let timerId;
    if (info?.exists) {
      timerId = setTimeout(() => {
        setInfo({exists: false})
      }, 10000);
    }

    return () => clearTimeout(timerId)
  }, [info])

  const updateAttempt = ({word, fillIndex, fillingMode}) => {
      // const copyOfAttemptSplit = [...attempt]
      // const wordAtThatIndex = copyOfAttemptSplit[indexOfAttemptedWord]
      // let attemptedWord = e.target.value
      // const wordLastCharacter = wordAtThatIndex[wordAtThatIndex.length - 1]
      // const endsWithPunctuation = ['.', ',', ';', ']', '"', '!', '?', ')'].includes(wordAtThatIndex)
      // attemptedWord += (endsWithPunctuation ? wordLastCharacter : '')
      // copyOfAttemptSplit[indexOfAttemptedWord] = attemptedWord
  
      const blank = attempt.find(w => w.startsWith('____'))
      const newAttempt = [...attempt];
      const wordIndex =fillIndex || attempt.indexOf(blank) 
      const correctWord = correctSentence[wordIndex];
      if (correctWord === word || 
            (['.', ',', ';', ']', '"', '!', '?', ')'].includes(correctWord[correctWord.length - 1]) && 
              correctWord.slice(0, correctWord.length-1) === word
            )
          ) {
        newAttempt[wordIndex] = correctSentence[wordIndex];
        setAttempt(newAttempt)
        winSound.play()
      }
      // if (attemptedWord === correctSentence[indexOfAttemptedWord]) {
      // }
      else if (fillingMode === "typing") {
        newAttempt[fillIndex] = word;
        setAttempt(newAttempt)
      }
    }

  const handleSummarySubmit = useCallback((e) => {
    e.preventDefault();
    if (aiHelp === 'Ai co-editor') {
      setInfo({exists: true, type: 'info', message: 'You can start writing the story. Hit Enter whenever you need a sentence from your assistant.'})
      return
    }
    axios.post(API_BASE_URL + '/cards/story-time/' + deckId, {userId, story, title, words, aiAssistance: aiHelp, summary: summaryInput})
         .then(({ data }) => {
            const story = data.story;
            setStories((prev) => {
              setActivity('');
              setInfo({ type: 'success', message: 'Your story was created successfully! => ' + story.title, exists: true })
              return [...prev, story]
            });
            setAiHelp('')
          })
  }, [aiHelp, summary, title])

    const handleSubmit = () => {
        if (mode?.startsWith("game")) return;
        axios
          .post(`${API_BASE_URL}/cards/story-time/${deckId}`, { userId: !checked ? userId : null, story, title, words: selectedWords })
          .then((res) => {
            const { story } = res.data;
            console.log(story);
            setStories((prev) => {
              // setActivity('practicing');
              setActivity('');
              setInfo({ type: 'success', message: 'Your story was created successfully! => ' + story.title, exists: true })
              return [...prev, story]
            });
            setAiHelp('')
          })
          .catch((e) => console.log(e.msg));
    };

    const handleBlanksGen = ({ currSentence, words}) => {
      const sentChunks = currSentence.sentence.split(" ");
      const usedWords = []
      const blanked = sentChunks.map(sentChunk => {
        for (const word of words) {
          const threshold = word.length / 2 > 4 ? word.length / 2 : 5
          if ( sentChunk.slice(0, threshold).includes(word.slice(0, threshold))) {
            usedWords.push(word);
            return '-'.repeat(5)
          }
        }
        return sentChunk
      }).join(" ")

      return { blanked, usedWords }
    }
    
      useEffect(() => {
        // console.log(activity, currSentence)
        if (activity === 'practicing' || !currSentence?.sentence) return
        if ( ['.', '?', '!'].includes(currSentence.sentence[currSentence.sentence.length - 1]) ) {
          // setInfo({ exists: true, type: 'warning', message: 'Select the part of this sentence that resembles one of the words in your deck',});
          const { blanked, usedWords } = handleBlanksGen({currSentence, words})
          partApproval({ ...currSentence, blanked})
          setSelectedWords(prev => [...prev, ...usedWords])
        }
      }, [currSentence?.sentence, activity]);
    
      const handlePartSelection = useCallback(() => {
        if (activity === 'practicing' || !currSentence.sentence) return
        if ( !['.', '?', '!'].includes(currSentence.sentence[currSentence.sentence.length - 1]) ) return;
        const part = window.getSelection().toString();
        if (part) {
          setCurrSentence( prev => ({...prev, blanked : prev.blanked ? prev.blanked.replace(part, '-'.repeat(part.length)) : prev.sentence.replace(part, '-'.repeat(part.length)) }) )
          setInfo({
            exists: true,
            type: 'warning',
            message: 'Thank you for selecting.\nIf you are satisfied with your selection, press > to write your next sentence',
          });
          
          // if (!currSentence.blanked) return () => window.addEventListener('keydown', handleApproval);
          // window.addEventListener('keydown', handleApproval);
          // return () => window.addEventListener('keydown', handleApproval);
        }
      }
    ,[currSentence, setCurrSentence, activity]);
    
      const partApproval = (currSentence) => {
        // setInfo({ exists: false });
        setStory((prev) => [...prev, {...currSentence, blanked: currSentence.blanked || currSentence.sentence}] );
        setCurrSentence({sentence: '', blanked: ''});
        // setSelectedWords([])
      }
    
      const handleApproval = useCallback((e) => {
        if ( e.type==="click" || e.key === 'ArrowRight') {
          partApproval();
          window.removeEventListener('keydown', handleApproval);
        }
      }, [partApproval]);
      
      useEffect(() => {
        // window.addEventListener('keydown', handleApproval);
        return () => {
          window.removeEventListener('keydown', handleApproval);
        };
      }, [handleApproval]);

      const callUponAi = useCallback((e) => {
        const key = e.key;
        if (["Tab", "Enter"].includes(key)) e.preventDefault();
        if (key === 'Tab') return setCurrSentence(prev => ({...prev, sentence: prev.sentence + "\t"}))
        if (key === 'Enter') return setCurrSentence(prev => {
          console.log(prev)
          if (prev.sentence) return {...prev, sentence: prev.sentence + "\n"}; 
          setStory(prev => [...prev, {sentence: "\n", blanked: "\n"}]); return prev
        }) 
        if (false) {
          if (!summary) {
            return setInfo({exists: true, type: 'warning', message: 'Enable your ai assistant to use it!'})
          }
          else { // the summary exists
            axios.post(API_BASE_URL + '/cards/story-time/' + deckId, {userId, story: story.map(sent => sent.sentence).join(' '), title, words, aiAssistance: aiHelp, summary})
                 .then(({data}) => {
                    const {title, aiSentence} = data.story;
                    if (title) setTitle(title)
                    if (aiSentence) setCurrSentence(aiSentence)
                 })
                 .catch(error => console.log(error))
          }
        }
      }, [summary, title, story])
      
    
      useEffect(() => {
        if (!stories?.length) return;
          // console.log(stories.length, selected, !selected)
          if (stories.length && selected > -1)  setActivity('practicing'); 
          const current = stories[selected];
          if (current) {
            setTitle(current.title);
            setStory(current.story);
            // setWords(current.words)
            //console.log(current.story[0])
            setCurrSentence({...current.story[0], index: 0})
          }
      }, [selected, stories]);

      return { handlePartSelection, handleSubmit, handleSummarySubmit, callUponAi, handleApproval, updateAttempt
      }
}

export default useGeneralHook