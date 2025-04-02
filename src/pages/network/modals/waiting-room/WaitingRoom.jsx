
import "./WaitingRoom.css"
// import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom"
import Button from "../playing/components/game-button/Button"

const WaitingRoom = ({ gameInfo, userID, handleStart, error }) => {
  const navigate = useNavigate()

  const handleCopy = () => {
    const joinLink = window.location.origin + window.location.pathname + `?gameID=${gameInfo?.id}`
    //console.log(joinLink)
    navigator.clipboard.writeText(joinLink)
  }
  return (
    <div className="waiting-room" style={{padding: "1em"}}>
        { gameInfo?.id ?
          <>
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <label>Share Game ID: {gameInfo.id}</label>
              <Button variant="contained" disableElevation color='primary' handleClick={handleCopy} text="Copy and Share Link" />
            </div> 
        
            <h2>Waiting for {5 - Object.values(gameInfo.players).length} players</h2>
            <ul style={{padding: "1em"}}>
                {Object.values(gameInfo.players).reverse().map((player, i) => 
                <li style={{background: "lightblue", padding: ".5em 1em", listStyleType: "none"}}
                    key={player.id + i || i}>{ player?.id === userID ? "You": player.username} joined
                </li>)}
            </ul>
            { (gameInfo.creator === userID && Object.keys(gameInfo.players).length > 1 && gameInfo.data.deck?.deckName && gameInfo.type === "quiz") &&
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
