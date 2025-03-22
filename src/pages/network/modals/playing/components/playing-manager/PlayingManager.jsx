import PlayersDashboard from "../../components/player-state/PlayerDashboard"

import QuizCard from "../../../../../personal/modals/quiz/quiz-card/QuizCard"
import formatRouter from "../../utils/formatRouter"

import { useState, useEffect } from "react";

const PlayingManager = ({ typeOfGame, socket, deck, gameID, playerID, storyGameUtils, setStoryGameUtils, StoryView, ChatView }) => {
    // console.log("....Playing")
    if (!socket) return
    const [afterUpdateFunc, setAfterUpdateFunc ] = useState(null)
    const [players, setPlayers] = useState([])
    const [voting, setVoting] = useState(false)
  
    const handlePlay = (afterPlayHandle) => { // The call back is what happens after the server responds to the play
      const [ correct, registerPlay ] = afterPlayHandle
      socket.send(JSON.stringify({method: "play", payload: {playerID, gameID, isCorrect: correct}}))
      setAfterUpdateFunc(() => registerPlay)
    }
  
    useEffect(() => {
      console.log(storyGameUtils.source, storyGameUtils.currSentence)
      if (storyGameUtils.currSentence) {
        socket.send(JSON.stringify({method: "add-new-sentence", payload: {gameID, playerID, storyGameUtils}}))
      }
    }, [storyGameUtils.currSentence])
  
    useEffect(() => {
      socket.onmessage = event => {
        const { method, payload } = JSON.parse(event.data)
        if (method === "play") {
          // nothing to do for now
        }
        else if (method === "playing-update") {
          if (afterUpdateFunc) {
            afterUpdateFunc()
          }
          setPlayers(payload.players || [])
        }
        else if (method === "all-players-wrote") {
          setStoryGameUtils(prev => ({...prev, voting: true, source: "external", currSentences: payload.currSentences}))
        }
        else if (method === "voted-sentence") {
          setStoryGameUtils(prev => ({...prev, source: "external", votedSentence: payload.votedSentence}))
        }
        
      }
    }, [afterUpdateFunc])
  
    useEffect(() => {
      if (storyGameUtils.currSentences) setVoting(true)
    }, [storyGameUtils.currSentences])
  
    const handleVoting = (e) => {
      const bestSentence = parseInt(e.target.id)
      setVoting(false);
      setStoryGameUtils(prev => ({...prev, voting: false}))
      socket.send(JSON.stringify({method: "voting-best-sentence", payload: {gameID, playerID, bestSentence}}))
    }
  
    return (
      <>
        
        <PlayersDashboard players={players} gameID={gameID} socket={socket} playerID={playerID}/>
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
