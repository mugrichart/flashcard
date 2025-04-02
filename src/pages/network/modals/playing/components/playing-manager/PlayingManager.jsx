import PlayersDashboard from "../../components/player-state/PlayerDashboard"

import QuizCard from "../../../../../personal/modals/quiz/quiz-card/QuizCard"
import { useDispatch } from "react-redux";
import { StoryView } from "../../Playing";

import formatRouter from "../../utils/formatRouter"

import WebSocketService from "../../../../../../api/ws";

import { useState, useEffect } from "react";
import { openDeck } from "../../../../../../features/personal/deck/deckSlice";

const PlayingManager = ({ gameInfo, setGameInfo, userID, typeOfGame, deck, gameID, playerID, storyGameUtils, setStoryGameUtils, ChatView }) => {
    // //console.log("....Playing")
    const [afterUpdateFunc, setAfterUpdateFunc ] = useState(null)
    const dispatch = useDispatch()
    // const [players, setPlayers] = useState([])
    
    const [on, setOn] = useState(false)
    const [status, setStatus] = useState('')
    
    const handlePlay = (afterPlayHandle) => { // The call back is what happens after the server responds to the play
      const [ correct, registerPlay ] = afterPlayHandle
      WebSocketService.send("game/in progress", { gameInfo, isCorrect: correct, source: userID })
      setStatus('waiting'); setOn(true)
      // setGameInfo(prev => ({...prev, data: {...prev.data, isCorrect: correct}, source: userID}))
      // WebSocketService.send("play", {playerID, gameID, isCorrect: correct})
      setAfterUpdateFunc(() => registerPlay)
    }
  
    // useEffect(() => {
    //   //console.log(storyGameUtils.direction, storyGameUtils.currSentence)
    //   if (storyGameUtils.currSentence) {
    //     WebSocketService.send("add-new-sentence", {gameID, playerID, storyGameUtils})
    //   }
    // }, [storyGameUtils.currSentence])
  
    useEffect(() => {

      // WebSocketService.route("play", () => //console.log("play"))

      // WebSocketService.route("playing-update", (payload) => {
      //     if (afterUpdateFunc) {
      //       afterUpdateFunc()
      //     }
      //     setPlayers(payload.players || [])
      // })

      // WebSocketService.route("all-players-wrote", (payload) => setStoryGameUtils(prev => ({...prev, voting: true, direction: "client", currSentences: payload.currSentences})))

      // WebSocketService.route("voted-sentence", (payload) => setStoryGameUtils(prev => ({...prev, direction: "client", votedSentence: payload.votedSentence})))
      
    }, [afterUpdateFunc])
  
    // useEffect(() => {
    //   if (storyGameUtils.currSentences) setVoting(true)
    // }, [storyGameUtils.currSentences])

    useEffect(() => {
      if (gameInfo.type !== "quiz") return

      const handleInProgress = (payload) => {
        console.log("Payload received:", payload.data?.deck);
        dispatch(openDeck({_id: payload.data.deck.deckId, words: payload.data.deck.words}))
        setGameInfo(prev => payload);
        if (afterUpdateFunc) {
                afterUpdateFunc();
                setOn(false)
        }
      }

      const handleRedirect = (payload) => {
        setGameInfo(payload)
      }
      
      if (gameInfo.creator === userID && gameInfo.type === "story") WebSocketService.send("game/in progress", { gameInfo, beginning: true})
      WebSocketService.registerEvent("game/in progress", handleInProgress)
      WebSocketService.registerEvent("game/in progress/redirect", handleRedirect)

      return () => {
        WebSocketService.unregisterEvent("game/in progress")
        WebSocketService.unregisterEvent("game/in progress/redirect")
      }
    }, [afterUpdateFunc])
    
  
    return (
      <>
        
        <PlayersDashboard gameInfo={gameInfo} userID={userID} />
        {(gameInfo.type === "quiz" && gameInfo.status === "in progress") ?
          <QuizCard 
            importedFormat={'placeholder'} importedQuizType={'placeholder'}
            importedQuizLength={'placeholder'} order={'placeholder'} deckLearnChunk={gameInfo.data.deck.learning} mode={"quiz-game"} 
            formatRouter={formatRouter} setUserDecision={''} 
            handlePlay={handlePlay} deckId={gameInfo.data.deck._id} words={gameInfo.data.deck.words}
          /> :
          gameInfo.type === "story" ?
          <StoryView gameInfo={gameInfo} setGameInfo={setGameInfo} userID={userID} /> :
          ChatView
          // <Yapping isGameCreator={isCreator} mode={"game-creating"} storyGameUtils={storyGameUtils} setStoryGameUtils={setStoryGameUtils}/>
        }
        {
          <Poll gameInfo={gameInfo} setGameInfo={setGameInfo} on={on} setOn={setOn} status={status} setStatus={setStatus} /> 
        }
      </>
    ) 
  }
  
  const Poll = ({ gameInfo, setGameInfo, on, setOn, status, setStatus }) => {
    
    const [options, setOptions ] = useState([])

    useEffect(() => {

      if (gameInfo.type !== "story") return
      
      const retrieveSentences = (payload) => {
        const { poll } = payload;
        setOn(true);
        setStatus("voting")
        setOptions(poll.options)
      }

      const retrievePollResult = (payload) => {
        const { poll } = payload
        setOn(true); setOptions([poll.bestOption])
        setStatus("result")

        const t = setTimeout(() => {
          setGameInfo(prev => {
            const copyOfPrev = {...prev}
            copyOfPrev.data.details.pop();
            copyOfPrev.data.details.push(poll.bestOption)
            return copyOfPrev
          });
          setOn(false)
        }, 2000);

        return () => clearTimeout(t)
      }

      WebSocketService.registerEvent("game/in progress/poll/on", retrieveSentences)
      WebSocketService.registerEvent("game/in progress/poll/done", retrievePollResult)

      return () => {
        WebSocketService.unregisterEvent("game/in progress/poll/on")
        WebSocketService.unregisterEvent("game/in progress/poll/done")
      }
    }, [])
  
    const handlePolling = (votedSentence) => {
      WebSocketService.send("game/in progress", { gameInfo, votedSentence })
      setOptions([])
      setStatus("waiting")
    }
    
    return on &&
      <div style={{padding: "1em 2em"}}>
        <h2>
          {
            status === "voting" ? "Pick the best sentence" :
            status === "waiting" ? "Waiting for others..." :
            "This was the best choice"
          }
        </h2>
        {
          options.map((option, i) => <div key={i} id={i}
            style={{padding: "1em 2em", background: "lightblue", cursor: "pointer"}} 
            onClick={() => handlePolling(option)}>
            {option.sentence}</div>
          )
        }
      </div>
    
  }

export default PlayingManager
