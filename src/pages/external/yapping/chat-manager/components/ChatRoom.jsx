import ChatTile from './ChatTile';
import './ChatRoom.css';
import ChatTranscript from './ChatTranscript';
import { useEffect, useState } from 'react';
import useChatRoom from './useChatRoom';

const hostId = 1

const ChatRoom = ({ playerID, players, setPlayers, storyGameUtils, setStoryGameUtils, isCreator }) => {

  // const [script, setScript] = useState(null)
  // const [currentLineObj, setCurrentLineObj ] = useState(null)

  // //console.log(script, storyGameUtils)

  // useEffect(() => {
  //   //console.log("---- current line: ", currentLineObj)
  //   if (!isCreator) return;
  //   let t = setTimeout(() => {
  //     //console.log("shifting")
  //     setStoryGameUtils(prev => ({...prev, direction: "server", activity: "next-line" }))
  //   }, 3000);

  //   return () => clearTimeout(t)
  // }, [currentLineObj, isCreator])

  // useEffect(() => {
  //   if (storyGameUtils.script.script) setScript(storyGameUtils.script.script)
  // }, [storyGameUtils.script.script])

  // useEffect(() => {
  //   //console.log("-------- script: ", script)
  //   if (storyGameUtils.direction === "client" && script) {
  //     //console.log(storyGameUtils, script)
  //     setCurrentLineObj(script[storyGameUtils.script.scriptIndex || 0])
  //   }
  // }, [storyGameUtils.script.scriptIndex, script])

  const { peers } = useChatRoom({ gameID: storyGameUtils.gameID, thisUserId: playerID, players })

 

  return (
    <div className="chat-room">

      <section className="first-section">
        {/* <h2>{ currentLineObj?.type === "narration" ? "Narration" : `${currentLineObj?.actor}'s line`}</h2>
        <p>Repharse the line to include the word <span className='line-word'>antagonist</span></p>
        <hr />
        <p className='actor-line'>
          { currentLineObj?.line }
        </p> */}
      </section>

      <section className="second-section">
        <div className="participants-grid">
          {players.map((player) => (
            <ChatTile
              key={player.playerID}
              user={player}
              audioObj={peers?.[player.playerID]}
              isActive={player.isSpeaking}
              isLocalUser={player.playerID === hostId}
            />
          ))}
        </div>
      </section>
      
      <section className="third-section">
        {/* <h2>Your rephrased line</h2>
        <hr />
        <ChatTranscript playerID={playerID} players={players} setPlayers={setPlayers} /> */}
      </section>

    </div>
  );
};


export default ChatRoom; 