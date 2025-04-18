import "./Playing.css";
import Counter from "./utils/Counter";
import WebSocketService from "../../../../api/ws";
import WaitingRoom from "../waiting-room/WaitingRoom";
import Yapping from "../../../external/yapping/Yapping";
import Chat from "../../../external/yapping/chat-manager/Chat";
import PlayingManager from "./components/playing-manager/PlayingManager";

import { useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Lobby from "./components/quiz-lobby/Lobby";

const Playing = () => {
  const [searchParams] = useSearchParams();
  const [gameID] = useState(searchParams.get("gameID"));
  const { _id: topicId, topicName, words, learning: topic } = !gameID ? useSelector((state) => state.topic.openTopic) : {};

  const { userId: userID, username, avatar } = JSON.parse(localStorage.getItem("user")) || {};
  const { userId: playerID, username: playerName } = JSON.parse(localStorage.getItem("user")) || {};
  const [isCreator] = useState(searchParams.get("isCreator") === "true");
  const [randomGame] = useState(searchParams.get("mode") === "random");

  const [typeOfGame, setTypeOfGame] = useState(searchParams.get("typeOfGame"));
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(isCreator ? "creating" : "joining");
  const [storyGameUtils, setStoryGameUtils] = useState({
    activity: "onboarding",
    words: topic?.words?.map((wordObj) => wordObj.word) || [],
  });

  const [ gameInfo, setGameInfo ] = useState(null)

  useEffect(() => {
    if (playerID) {
      if (gameID) WebSocketService.send("game/join", { userID, id: gameID, username, avatar });
      else if (isCreator && topic) WebSocketService.send("game/create", { userID, username, avatar, type: typeOfGame, topic, words: topic.words?.map((wordObj) => wordObj.word) });
      else if (randomGame) WebSocketService.send("game/join", { playerID, mode: "random", playerName, avatar });
    }

    const handleJoin = (payload) => {
      // console.log("Payload received:", payload);
      setGameInfo(prev => ({...payload}));
    };

    const handleLobby = (payload) => {
      // console.log("Payload: ", payload)
      setGameInfo(prev => payload);
    };

    
    const handlePostGame = (payload) => {
      // console.log(payload)
      setGameInfo(prev => payload)
    }

    const eventsSetup = () => {
      
      WebSocketService.initialize()
      WebSocketService.registerEvent("game/create", handleJoin);
      WebSocketService.registerEvent("game/join", handleJoin);
      WebSocketService.registerEvent("game/lobby", handleLobby);
      WebSocketService.registerEvent("game/post-game", handlePostGame);
      // WebSocketService.registerEvent("command", handleCommand);
      // WebSocketService.registerEvent("switch-activity", handleSwitchActivity);

    }

    eventsSetup()

    return () => {
      WebSocketService.unregisterEvent("game/create");
      WebSocketService.unregisterEvent("game/join");
      WebSocketService.unregisterEvent("game/lobby");
      WebSocketService.unregisterEvent("game/post-game");
      // WebSocketService.unregisterEvent("command");
      // WebSocketService.unregisterEvent("switch-activity");
      // WebSocketService.send("disconnect", { gameID, playerID }); //Uncaught Error: "disconnect" is a reserved event name
      WebSocketService.close();
    };
  }, []);

  useEffect(() => {
    if (gameInfo?.source === userID) {
      WebSocketService.send("game/" + gameInfo.status, gameInfo)
    }
  }, [gameInfo?.data?.title, gameInfo?.data?.summary])

  useEffect(() => {
    if (gameInfo?.source === userID && gameInfo?.data?.sentenceIndex) {
      WebSocketService.send("game/in progress", { gameInfo })
    }
  },[gameInfo?.data?.sentenceIndex])

  useEffect(() => {
    if (gameInfo?.source == userID) {
      console.log(gameInfo.status.toUpperCase())
      WebSocketService.send("game/" + gameInfo.status, gameInfo)
    }
  }, [gameInfo?.data?.step])

  useEffect(() => {
    if (gameInfo && gameInfo.source === userID && gameInfo.status !== "in progress") {
      const path = "game/" + gameInfo.status
      WebSocketService.send(path, gameInfo)
    }
  }, [gameInfo?.status])

  const handleStart = () => {
    console.log("...starting")
    setGameInfo(prev => ({...prev, data: {...prev.data, step: "quiz"}, source: userID}))
  };

  const ChatView = (
    <Chat
      isGameCreator={isCreator}
      mode={"chat"}
      storyGameUtils={{ ...storyGameUtils, gameID }}
      setStoryGameUtils={setStoryGameUtils}
      players={players}
      setPlayers={setPlayers}
      playerID={playerID}
    />
  );

  return (
    <>
      { gameInfo?.status === "lobby" && gameInfo?.data?.step === "onboarding" ? (
        <>
          {["story", "chat"].includes(gameInfo.type) ? <StoryView gameInfo={gameInfo} setGameInfo={setGameInfo} userID={userID}/> :
            <Lobby topic={gameInfo?.data?.topic} setGameInfo={setGameInfo} gameInfo={gameInfo}/>
          }
          <WaitingRoom gameInfo={gameInfo} userID={userID} handleStart={handleStart} error={error} />
        </>
      ) : (
        <>
          { (gameInfo?.data?.step === "create" || gameInfo?.data?.step === "quiz") && gameInfo.status === "lobby" ? 
            <Counter gameInfo={gameInfo} setGameInfo={setGameInfo} userID={userID}/>
           : gameInfo?.type ? (
            <PlayingManager
              gameInfo={gameInfo} setGameInfo={setGameInfo} userID={userID}
              isCreator={isCreator}
              typeOfGame={typeOfGame}
              topic={topic}
              gameID={gameID}
              playerID={playerID}
              storyGameUtils={storyGameUtils}
              setStoryGameUtils={setStoryGameUtils}
              ChatView={ChatView}
            />
          ) : (
            <>...Loading</>
          )}
        </>
      )}
    </>
  );
};

export default Playing;

export const StoryView = ({ gameInfo, setGameInfo, userID }) =>
  <Yapping 
    gameInfo={gameInfo}
    setGameInfo={setGameInfo}
    userID={userID}
  />