import { useEffect } from "react"
import "./PlayerState.css"

import WebSocketService from "../../../../../../api/ws"

const PlayersDashboard = ({ gameInfo, userID }) => {
  // useEffect(() => {
  //   WebSocketService.send("playing-update", { id: gameInfo.id})
  // }, [])

  return (
      <div 
          className="players-dashboard">
          {Object.values(gameInfo.players).map(playerData => <PlayerState playerData={playerData} userID={userID} />)}
      </div>
  )
}



const PlayerState = ({ playerData, userID }) => {
    const playerRankLabels = {1: '1st', 2: '2nd', 3: '3rd'}
    const defaultAvatar = "https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1733702185/Flashcards/avatars/brandon-zacharias-ITo4f_z3wNM-unsplash_dkbftg.jpg"
  return (
    <div className="player-state" key={playerData.id}>
        <div className="score">{playerData.score}</div>
        <img src={playerData.avatar || defaultAvatar} alt="player avatar" className="avatar"/>
        <div className="name-and-rank">
            <span className="name">{playerData.id === userID ? "You" : playerData.username}</span>
            { playerData.rank ?
              <span className="rank">
              {
                playerRankLabels[playerData.rank] || `${playerRank}th`
              }
              </span> : <></>
            }
        </div>
    </div>
  )
}

export default PlayersDashboard
