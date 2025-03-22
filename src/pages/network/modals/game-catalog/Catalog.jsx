import Button from "../playing/components/game-button/Button"
import "./Catalog.css";
import { useNavigate, useSearchParams } from "react-router-dom";

const catalog = [
    {
        title: "Story Time",
        image: "https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1742429513/Flashcards/game-backg/story.png",
        description: "Collaborate with friends on a story",
        type: "story"
    },
    {
        title: "Vocabulary quiz",
        image: "https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1742429513/Flashcards/game-backg/vocabulary.png",
        description: "Compete with friends on vocabulary mastery",
        type: "quiz"
    },
    {
        title: "Meet and grow",
        image: "https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1742430555/Flashcards/game-backg/call.png",
        description: "Use that vocabulary in a chat with friends",
        type: "chat"
    },
]


const Catalog = () => {
    const navigate = useNavigate()
    // const [searchParams] = useSearchParams()
    const handleChooseGame = (typeOfGame) => {
        navigate(`../playing/?isCreator=true&&typeOfGame=${typeOfGame}`)
    }

  return (
    <div className="catalog">
      {
        catalog.map((game, i) => (
            <div key={i} className="game">
                <h3>{game.title}</h3>
                <img src={game.image} alt={game.title} />
                <p>
                    <p>{game.description}</p>
                    <Button text="Play" handleClick={() => handleChooseGame(game.type)}/>
                </p>
            </div>
            ))
      }
    </div>
  )
}

export default Catalog

