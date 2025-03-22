
import "./PlayerState.css"

const PlayersDashboard = ({ gameID, socket, players }) => {
  const sentRef = useRef(false)
  useEffect(() => {
    if (sentRef.current) return
    sentRef.current = true
    socket.send(JSON.stringify({method: "playing-update", payload: {gameID}}))
  }, [])

  return (
      <div 
          className="players-dashboard">
          {players.map(playerInfo => <PlayerState key={playerInfo.playerID} playerInfo={playerInfo}/>)}
      </div>
  )
}



const PlayerState = ({ playerInfo }) => {
    const { playerID, playerName, playerRank, playerScore, playerAvatar } = playerInfo
    const playerRankLabels = {1: '1st', 2: '2nd', 3: '3rd'}
  return (
    <div className="player-state" key={playerID + playerName}>
        <div className="score">{playerScore}</div>
        <img src={"https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1733702185/Flashcards/avatars/brandon-zacharias-ITo4f_z3wNM-unsplash_dkbftg.jpg"} alt="player avatar" className="avatar"/>
        <div className="name-and-rank">
            <span className="name">{playerName}</span>
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
