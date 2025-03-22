import Button from "../playing/components/game-button/Button";
import { useNavigate } from 'react-router-dom';

import './JoinRoom.css'

export default ({ mode }) => {
    const navigate = useNavigate();

    const label = mode === 'friends' ? 'Create a new game' : 'Join a random game'

    const handleCreateOrJoin = () => {
        navigate(`game-catalog/?isCreator=${true}`)
    }

    const handleStart = () => {
        const gameIdInput = document.getElementById("gameIdInput")
        const gameID = gameIdInput.value

        navigate(`playing/?gameID=${gameID}`)
    }

    return (
        <div className="join-room">
            <div>
                <label htmlFor="">Enter Game ID:</label>
                <input type="text" id="gameIdInput"/>
                <Button variant="contained" disableElevation color='primary' handleClick={handleStart} text="Join" />
            </div>
            <p>or</p>
            <Button variant="contained" disableElevation color='primary' handleClick={handleCreateOrJoin} text={label} />
        </div>
    )
}