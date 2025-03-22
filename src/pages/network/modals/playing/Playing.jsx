import "./Playing.css"

import Counter from "./utils/Counter";

import { initializeWebSocketConn } from "../../../../api/quiz-game/websocket"

import WaitingRoom from "../waiting-room/WaitingRoom";

import Yapping from "../../../external/yapping/Yapping";
import Chat from "../../../external/yapping/chat-manager/Chat"

import PlayingManager from "./components/playing-manager/PlayingManager";

import { useSelector } from "react-redux";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";

const Playing = () => {
    const socketHasInitRef = useRef(false)
    const socketHasSetup = useRef(false)
    const [socket, setSocket ] = useState(null)
    const { _id: deckId, deckName, words, learning:deck } = useSelector(state => state.deck.openDeck)
    const [searchParams, setSearchParams] = useSearchParams()
    const [{userId: playerID, username: playerName, avatar}] = useState(JSON.parse(localStorage.getItem('user')));
    const [ gameID, setGameID ] = useState(searchParams.get("gameID"))
    const [ isCreator ] = useState(searchParams.get("isCreator") === "true")
    const [randomGame ] = useState(searchParams.get("mode") === "random")
    const [typeOfGame, setTypeOfGame] = useState(searchParams.get("typeOfGame") || 'quiz') // quiz | story
    const [players, setPlayers] = useState([])
    const [error, setError] = useState(null)
    const [status, setStatus] = useState(isCreator ? "creating" : "joining") // creating | joining | waiting | countdown | playing
    const [storyGameUtils, setStoryGameUtils] = useState({activity: "onboarding", words: deck.words?.map(wordObj => wordObj.word) || []})

    useEffect(() => {
      if (socketHasInitRef.current) return;
      setSocket(initializeWebSocketConn());
      socketHasInitRef.current = true
    }, []);

    useEffect(() => {
      if (socketHasSetup.current) return
      if (!socket) return
      socketHasSetup.current = true
      const handleOpen = () => {
        if (playerID && gameID) {
          socket.send(
            JSON.stringify({
              method: "join",
              payload: { playerID, gameID, playerName, avatar },
            })
          );
        } else if (playerID && isCreator && !gameID) {
          socket.send(
            JSON.stringify({
              method: "create",
              payload: { playerID, playerName, avatar, typeOfGame, words: deck.words.map(wordObj => wordObj.word) },
            })
          );
        } else if (playerID && randomGame) {
          console.log(playerID, randomGame)
          socket.send(
            JSON.stringify({
              method: "join",
              payload: { playerID, mode: "random", playerName, avatar },
            })
          );
        }
      };

      socket.addEventListener("open", handleOpen)
      
      const handleMessage = (event) => {
        const { method, payload } = JSON.parse(event.data);
        console.log(payload)
        if (["join", "create"].includes(method)) {
          const { gameID, playerID, status: statusCode, typeOfGame } = payload;
          if (statusCode === 404) {console.log("error========");return setError(404)}
          setSearchParams({ gameID, playerID });
          setGameID(prev => prev || gameID)
          setPlayers(payload.players)
          setStatus("waiting");
          setTypeOfGame(prev => payload.typeOfGame || prev)
          setStoryGameUtils(prev => ({...prev, words: payload.words}))
        } else if (method === "waiting-room-update") {
          if (typeOfGame === "story") {
            console.log(payload.words)
            if (payload.storyGameUtils?.title) setStoryGameUtils(prev => ({...prev, title: payload.storyGameUtils.title}))
            if (payload.storyGameUtils?.summary) setStoryGameUtils(prev => ({...prev, summary: payload.storyGameUtils.summary}))
            setStoryGameUtils(prev => ({...prev, playerCount: payload.players.length}))
          } 
          setPlayers(prevPlayers => {
            if (payload.players?.length && prevPlayers.length !== payload.players?.length) return payload.players;
            return prevPlayers
          });
        } else if (method === "command" && payload?.command === "start") {
          setStatus("countdown");
        }
        // else if (method === "switch-activity" && payload.activity) setStoryGameUtils(prev => ({...prev, activity: payload.activity}))
        else if (method === "switch-activity") {
          console.log(payload)
          if (payload.activity === "" && payload.story) return setStoryGameUtils(prev => ({...prev, source: "external", activity: payload.activity, story: payload.story}))
          setStoryGameUtils(prev => (payload.activity === "onboarding" ? {source: "external", activity: payload.activity} : {...prev, source: "external", activity: payload.activity}))
        }
      };

      socket.addEventListener("message", handleMessage)
      
      return () => {
        if (socket.readyState === WebSocket.OPEN) {
          console.log("closing socket")
          socket.send(JSON.stringify({method: "disconnect", payload: {gameID, playerID}}))
          socket.close();
        }
        socket.onopen = null; // Clear open handler
        socket.onmessage = null; // Clear message handler
      };
    }, [socket])

    useEffect(() => {
      
      if (typeOfGame === "story" && storyGameUtils.activity === "onboarding" &&
        isCreator && (players.length > 1) && !(players.length === storyGameUtils.playerCount) &&
       (storyGameUtils?.title || storyGameUtils?.summary)
      ) {
        setStoryGameUtils(prev => {
          prev.playerCount = players.length;
          socket.send(JSON.stringify({method: "title-and-summary", payload: {gameID, playerID, storyGameUtils: prev, players}}));
          return prev
        })
      }
    }, [players, storyGameUtils])

    useEffect(() => {
      console.log(storyGameUtils.activity)
      if ( storyGameUtils.source !== "external" && storyGameUtils.activity !== null && players.length) {
        if (storyGameUtils.activity === "uploading") return socket.send(JSON.stringify({method: "switch-activity", payload: {gameID, playerID, ...storyGameUtils}}))
        socket.send(JSON.stringify({method: "switch-activity", payload: {gameID, playerID, activity: storyGameUtils.activity}}))
      }
    }, [storyGameUtils.activity])

    const handleStart = () => {
      socket.send(JSON.stringify({method: "command", payload: {command: "start", gameID}}))
    }

    const StoryView = <Yapping isGameCreator={isCreator} mode={"game-onboarding"} typeOfGame={typeOfGame}
                                storyGameUtils={storyGameUtils} setStoryGameUtils={setStoryGameUtils}
                      />

    const ChatView = <Chat 
                        isGameCreator={isCreator} 
                        mode={"chat"} storyGameUtils={storyGameUtils} 
                        setStoryGameUtils={setStoryGameUtils}
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
          (status === "countdown" || storyGameUtils.activity === "countdown") ? <Counter status={status} setStatus={setStatus} storyGameUtils={storyGameUtils} setStoryGameUtils={setStoryGameUtils} /> :
          (deck.words || storyGameUtils.words).length ? 
            <PlayingManager isCreator={isCreator} typeOfGame={typeOfGame} socket={socket} 
              deck={deck} gameID={gameID} playerID={playerID}
              storyGameUtils={storyGameUtils} setStoryGameUtils={setStoryGameUtils}
              StoryView={StoryView} ChatView={ChatView}
            /> 
            : <>Error getting the game set!</>  
        }
        </>
      }
      </>
    )
    
    
}

export default Playing

