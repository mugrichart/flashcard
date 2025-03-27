import PlayersDashboard from "../../components/player-state/PlayerDashboard"

import QuizCard from "../../../../../personal/modals/quiz/quiz-card/QuizCard"
import formatRouter from "../../utils/formatRouter"

import WebSocketService from "../../../../../../api/ws";

import { useState, useEffect } from "react";

const PlayingManager = ({ typeOfGame, deck, gameID, playerID, storyGameUtils, setStoryGameUtils, StoryView, ChatView }) => {
    // console.log("....Playing")
    const [afterUpdateFunc, setAfterUpdateFunc ] = useState(null)
    const [players, setPlayers] = useState([])
    const [voting, setVoting] = useState(false)
  
    const handlePlay = (afterPlayHandle) => { // The call back is what happens after the server responds to the play
      const [ correct, registerPlay ] = afterPlayHandle
      WebSocketService.send("play", {playerID, gameID, isCorrect: correct})
      setAfterUpdateFunc(() => registerPlay)
    }
  
    useEffect(() => {
      console.log(storyGameUtils.direction, storyGameUtils.currSentence)
      if (storyGameUtils.currSentence) {
        WebSocketService.send("add-new-sentence", {gameID, playerID, storyGameUtils})
      }
    }, [storyGameUtils.currSentence])
  
    useEffect(() => {

      WebSocketService.route("play", () => console.log("play"))

      WebSocketService.route("playing-update", (payload) => {
          if (afterUpdateFunc) {
            afterUpdateFunc()
          }
          setPlayers(payload.players || [])
      })

      WebSocketService.route("all-players-wrote", (payload) => setStoryGameUtils(prev => ({...prev, voting: true, direction: "client", currSentences: payload.currSentences})))

      WebSocketService.route("voted-sentence", (payload) => setStoryGameUtils(prev => ({...prev, direction: "client", votedSentence: payload.votedSentence})))
      
    }, [afterUpdateFunc])
  
    useEffect(() => {
      if (storyGameUtils.currSentences) setVoting(true)
    }, [storyGameUtils.currSentences])
  
    const handleVoting = (e) => {
      const bestSentence = parseInt(e.target.id)
      setVoting(false);
      setStoryGameUtils(prev => ({...prev, voting: false}))
      WebSocketService.send("voting-best-sentence", { gameID, playerID, bestSentence })
    }
  
    return (
      <>
        
        <PlayersDashboard players={players} gameID={gameID} playerID={playerID}/>
        {typeOfGame === "quiz" ?
          <QuizCard 
            importedFormat={'placeholder'} importedQuizType={'placeholder'}
            importedQuizLength={'placeholder'} order={'placeholder'} deckLearnChunk={deck} mode={"quiz-game"} 
            formatRouter={formatRouter} setUserDecision={''} 
            handlePlay={handlePlay}
          /> :
          typeOfGame === "story" ?
          StoryView :
          ChatView
          // <Yapping isGameCreator={isCreator} mode={"game-creating"} storyGameUtils={storyGameUtils} setStoryGameUtils={setStoryGameUtils}/>
        }
        {
          voting ? 
          <Voting currSentences={storyGameUtils.currSentences} handleVoting={handleVoting}/> :
          <></>
        }
      </>
    ) 
  }
  
  const Voting = ({ currSentences, handleVoting }) => {
    return (
      <div style={{padding: "1em 2em"}}>
        {
          currSentences.map((currSentence, i) => <div key={i} id={i}
            style={{padding: "1em 2em", background: "lightblue", cursor: "pointer"}} 
            onClick={handleVoting}>
            {currSentence.sentence}</div>
          )
        }
      </div>
    )
  }

export default PlayingManager
