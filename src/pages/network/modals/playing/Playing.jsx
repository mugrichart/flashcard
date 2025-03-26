import "./Playing.css"

import Counter from "./utils/Counter";

import WebSocketService from "../../../../api/game/websocket"

import WaitingRoom from "../waiting-room/WaitingRoom";

import Yapping from "../../../external/yapping/Yapping";
import Chat from "../../../external/yapping/chat-manager/Chat"

import PlayingManager from "./components/playing-manager/PlayingManager";

import { useSelector } from "react-redux";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";

const Playing = () => {
    
    const { _id: deckId, deckName, words, learning:deck } = useSelector(state => state.deck.openDeck)
    const [searchParams, setSearchParams] = useSearchParams()
    const [{userId: playerID, username: playerName, avatar}] = useState(JSON.parse(localStorage.getItem('user')));
    const [ gameID, setGameID ] = useState(searchParams.get("gameID"))
    const [ isCreator ] = useState(searchParams.get("isCreator") === "true")
    const [randomGame ] = useState(searchParams.get("mode") === "random")
    const [typeOfGame, setTypeOfGame] = useState(searchParams.get("typeOfGame")) // quiz | story | chat
    const [players, setPlayers] = useState([])
    const [error, setError] = useState(null)
    const [status, setStatus] = useState(isCreator ? "creating" : "joining") // creating | joining | waiting | countdown | playing
    const [storyGameUtils, setStoryGameUtils] = useState({activity: "onboarding", words: deck?.words?.map(wordObj => wordObj.word) || []})

    useEffect(() => {
      if (playerID && gameID) WebSocketService.send("join", { playerID, gameID, playerName, avatar })
      else if (playerID && isCreator && !gameID) WebSocketService.send("create", { playerID, playerName, avatar, typeOfGame, words: deck.words?.map(wordObj => wordObj.word) })
      else if (playerID && randomGame) WebSocketService.send("join", { playerID, mode: "random", playerName, avatar })    
      
      const joinHandler = (payload) => {
          const { gameID, playerID, status: statusCode, typeOfGame, isCreator } = payload;
          if (statusCode === 404) {console.log("error========");return setError(404)}
          setSearchParams({ gameID, playerID, isCreator});
          setGameID(prev => prev || gameID)
          console.log(payload.players)
          if (typeof payload.players[0] === "object") setPlayers(payload.players)
          setStatus("waiting");
          setTypeOfGame(prev => payload.typeOfGame || prev)
          setStoryGameUtils(prev => ({...prev, words: payload.words}))
      }

      WebSocketService.route("create", joinHandler)
      WebSocketService.route("join", joinHandler)

      const waitingRoomUpdateHandler = (payload) => {
        if (typeOfGame === "story") {
          console.log(payload.words)
          if (payload.storyGameUtils?.title) setStoryGameUtils(prev => ({...prev, title: payload.storyGameUtils.title}))
          if (payload.storyGameUtils?.summary) setStoryGameUtils(prev => ({...prev, summary: payload.storyGameUtils.summary}))
          setStoryGameUtils(prev => ({...prev, playerCount: payload.players.length}))
        } 
        setPlayers(prevPlayers => {
          console.log(payload.players)
          if (payload.players?.length && prevPlayers?.length !== payload.players?.length && typeof payload.players[0] === "object") return payload.players;
          return prevPlayers
        });
      }

      WebSocketService.route("waiting-room-update", waitingRoomUpdateHandler)

      const commandHandler = (payload) => {
          if (!payload?.command === "start") return
          console.log(payload.script)
          setStoryGameUtils(prev => ({...prev, script: payload.script, direction: "client"}))
          setStatus("countdown");
      }

      WebSocketService.route("command", commandHandler)

      const switchActivityHandler = (payload) => {
        console.log(payload)
        if (payload.activity === "" && payload.story) return setStoryGameUtils(prev => ({...prev, direction: "client", activity: payload.activity, story: payload.story}))
        setStoryGameUtils(prev => ({...prev, ...payload, direction: "client", script: {...prev.script, scriptIndex: payload.scriptIndex}}))
      }
      
      WebSocketService.route("switch-activity", switchActivityHandler)

      const closingHandle = () => {
        WebSocketService.send("disconnect", { gameID, playerID });
        WebSocketService.close()
      }

      // return closingHandle

    }, [])

    useEffect(() => {
      
      if (typeOfGame === "story" && storyGameUtils.activity === "onboarding" &&
        isCreator && (players.length > 1) && !(players.length === storyGameUtils.playerCount) &&
       (storyGameUtils?.title || storyGameUtils?.summary)
      ) {
        setStoryGameUtils(prev => {
          prev.playerCount = players.length;
          WebSocketService.send("title-and-summary", {gameID, playerID, storyGameUtils: prev, players});
          return prev
        })
      }
    }, [players, storyGameUtils])

    useEffect(() => {
      console.log(storyGameUtils, isCreator, typeOfGame, typeOfGame === "chat" && storyGameUtils.activity === "next-line" && isCreator)
      if (storyGameUtils.direction === "server") {
        if ( storyGameUtils.activity !== null && players.length) {
          console.log("shocker")
          if (storyGameUtils.activity === "uploading") return WebSocketService.send("switch-activity", {gameID, playerID, ...storyGameUtils})
          console.log("------- Sending: ", Date())
          WebSocketService.send("switch-activity", {gameID, playerID, activity: storyGameUtils.activity})
        }
        // else if (typeOfGame === "chat" && storyGameUtils.activity === "next-line" && isCreator) {
        //   console.log("sending >>>>> ")
        //   WebSocketService.send("switch-activity", {gameID, playerID, activity: storyGameUtils.activity})
        // }
      }

    }, [storyGameUtils.direction])

    const handleStart = () => {
      console.log('client - sending command')
      WebSocketService.send("command", {command: "start", gameID, typeOfGame, words: deck.words, players })
    }

    const StoryView = <Yapping isGameCreator={isCreator} mode={"game-onboarding"} typeOfGame={typeOfGame}
                                storyGameUtils={storyGameUtils} setStoryGameUtils={setStoryGameUtils}
                      />

    const ChatView = <Chat 
                        isGameCreator={isCreator} 
                        mode={"chat"} storyGameUtils={{...storyGameUtils, gameID}} 
                        setStoryGameUtils={setStoryGameUtils}
                        players={players} setPlayers={setPlayers}
                        playerID={playerID} isCreator={isCreator}
                    />
    return (
      <>
      {
        ["waiting", "creating", "joining"].includes(status) && storyGameUtils.activity === "onboarding" ?
        <>
          { ["story", "chat"].includes(typeOfGame) && StoryView}
          <WaitingRoom typeOfGame={typeOfGame} players={players?.length ? players : []} isCreator={isCreator} gameID={gameID} handleStart={handleStart} error={error} playerID={playerID}/>
        </> :
        <> 
        {
          (status === "countdown" || storyGameUtils.activity === "countdown") ? <Counter isCreator={isCreator} status={status} setStatus={setStatus} storyGameUtils={storyGameUtils} setStoryGameUtils={setStoryGameUtils} /> :
          (deck.words || storyGameUtils.words)?.length || typeOfGame === "chat" ? 
            <PlayingManager isCreator={isCreator} typeOfGame={typeOfGame} 
              deck={deck} gameID={gameID} playerID={playerID}
              storyGameUtils={storyGameUtils} setStoryGameUtils={setStoryGameUtils}
              StoryView={StoryView} ChatView={ChatView}
            /> 
            : <>{ !deck?.words && "No deck words!" || !storyGameUtils?.words && "No game words!"}</>  
        }
        </>
      }
      </>
    )
    
    
}

export default Playing

