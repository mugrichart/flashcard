import { useRef, useEffect } from "react"
import "./PlayerState.css"

import WebSocketService from "../../../../../../api/game/websocket"

const PlayersDashboard = ({ gameID, socket, players, playerID }) => {
  const sentRef = useRef(false)
  useEffect(() => {
    if (sentRef.current) return
    sentRef.current = true
    WebSocketService.send("playing-update", {gameID})
  }, [])

  return (
      <div 
          className="players-dashboard">
          {players.map(playerInfo => <PlayerState playerInfo={playerInfo} thisPlayer={playerID}/>)}
      </div>
  )
}



const PlayerState = ({ playerInfo, thisPlayer }) => {
    const { playerID, playerName, playerRank, playerScore, playerAvatar } = playerInfo
    const playerRankLabels = {1: '1st', 2: '2nd', 3: '3rd'}
    const defaultAvatar = "https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1733702185/Flashcards/avatars/brandon-zacharias-ITo4f_z3wNM-unsplash_dkbftg.jpg"
  return (
    <div className="player-state" key={playerID + playerName}>
        <div className="score">{playerScore}</div>
        <img src={playerAvatar || defaultAvatar} alt="player avatar" className="avatar"/>
        <div className="name-and-rank">
            <span className="name">{playerID === thisPlayer ? "You" : playerName}</span>
            { playerRank ?
              <span className="rank">
              {
                playerRankLabels[playerRank] ? playerRankLabels[playerRank] : `${playerRank}th`
              }
              </span> : <></>
            }
        </div>
    </div>
  )
}

export default PlayersDashboard
