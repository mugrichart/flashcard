
import { Directions } from "@mui/icons-material";
import { useState, useEffect } from "react"

const Counter = ({ isCreator, status, setStatus, storyGameUtils, setStoryGameUtils }) => {
    const [counter, setCounter] = useState(3)

    useEffect(() => {
      let intervalId;
      if (status === "countdown" || storyGameUtils.activity === "countdown") {
          intervalId = setInterval(() => {
              setCounter(counter - 1)
              if (counter - 1 === 0) {
                clearInterval(intervalId);
                setStatus("playing");
                setStoryGameUtils(prev => ({...prev, activity: "creating", direction: isCreator ? "server" : "client"}))
              }
          }, 1000);
      }

      return () => clearInterval(intervalId)

    }, [counter, status])

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
