
import { Directions } from "@mui/icons-material";
import { useState, useEffect } from "react"

const Counter = ({ gameInfo, setGameInfo, userID }) => {
    const [counter, setCounter] = useState(3)

    useEffect(() => {
      let intervalId = setInterval(() => {
          setCounter(counter - 1)
          if (counter - 1 === 0) {
            clearInterval(intervalId);
            setGameInfo(prev => ({...prev, status: "in progress", source: userID }))
          }
      }, 1000);

      return () => clearInterval(intervalId)

    }, [counter])

  return <div style={{
    minWidth: "min(500px, 95vw)",
    aspectRatio: "1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
    fontSize: "3rem",
    fontWeight: "bold",
  }}>{counter}</div>

}

export default Counter
