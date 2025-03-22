import "./Button.css";

const Button = ({text, handleClick}) => {
  return (
    <button onClick={handleClick} className="game-button">
        <div>
            {text}
        </div>
    </button>
  )
}

export default Button
