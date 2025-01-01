
import "./WaitingRoom.css"
// import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom"
import Button from "../playing/components/game-button/Button"

const WaitingRoom = ({ typeOfGame, gameID, players, isCreator, handleStart, error, playerID }) => {
  const navigate = useNavigate()

  return (
    <div className="waiting-room" style={{padding: "1em"}}>
        { gameID ?
          <>
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <label htmlFor="">Share Game ID: {gameID}</label>
              <Button variant="contained" disableElevation color='primary' /*onClick={handleCopy}*/ text="Copy and share link" />
            </div> 
        
            <h2>Waiting for {5 - players.length} players</h2>
            <ul style={{padding: "1em"}}>
                {players.map((player, i) => <li style={{background: "lightblue", padding: ".5em 1em", listStyleType: "none"}}
                key={player?.playerID}>{player?.playerID === playerID ? "You": player?.playerName} joined</li>)}
            </ul>
            { (isCreator && players.length > 1 && typeOfGame !== "story") &&
              <Button variant="contained" disableElevation color='primary' handleClick={handleStart} text="Start Game" />
            }
          </>
          : 
          error === 404 ?
          <div>No existing game 
          <button onClick={() => navigate("../play-with-friends")}>Create one</button>
          </div> : 
          <></>
        }
    </div>
  )
}

export default WaitingRoom
