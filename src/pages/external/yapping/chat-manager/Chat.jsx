
import React from 'react'

import ChatRoom from "./components/ChatRoom"


const Chat = ({ mode, storyGameUtils, setStoryGameUtils, players, setPlayers, playerID, isCreator }) => {
  console.log(players)
  return (
    <ChatRoom playerID={playerID} players={players} setPlayers={setPlayers} storyGameUtils={storyGameUtils} setStoryGameUtils={setStoryGameUtils} isCreator={isCreator}/>
  )
}


export default Chat

const participants = [
  {
    id: 0,
    name: "John",
    avatarUrl: "https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1742429513/Flashcards/game-backg/story.png",
    isSpeaking: false
  },
  {
    id: 1,
    name: "Richard",
    avatarUrl: "https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1742429513/Flashcards/game-backg/story.png",
    isSpeaking: true
  },
  {
    id: 2,
    name: "Mugisha",
    avatarUrl: "https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1742429513/Flashcards/game-backg/story.png",
    isSpeaking: false
  }
];