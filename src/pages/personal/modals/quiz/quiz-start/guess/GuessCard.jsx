import React, { useState, useEffect, useRef } from 'react';
import './GuessCard.css';
import ProgressBar from "@ramonak/react-progress-bar";
import { QuestionMark, Check as CheckIcon } from '@mui/icons-material';

const GuessCard = ({ cardMotion, cardFormat, btmProSize, handleItemClick, topProSize, quizType, quizLength }) => {
    const [checkCorrect, setCheckCorrect] = useState(false)
    const [flip, setFlip] = useState(false)
    const [playedYet, setPlayedYet] = useState(false)

    const containerRef = useRef(null)

    useEffect(() => {
        setCheckCorrect(false)
        setFlip(false)
    }, [cardFormat, cardMotion]);

    // useEffect(() => {
    //     if ( topProSize >= 100 && !playedYet) {
    //         console.log('================offfff')
    //         handleClick({})
    //     }
    // }, [topProSize])

    const handleClick = (e) => {
        if (!checkCorrect) flipCard()
        else {
            const box = containerRef.current.getBoundingClientRect()
            const clickPosition = (e.clientX - box.left) / box.width
            if (clickPosition < .33) return grade(false)
            if (clickPosition > .66) return grade(true)
             flipCard()
        }
    }

    const grade = (know) => {
        containerRef.current.classList.add(know ? 'glow-green' : 'glow-red')
        setPlayedYet(true)
        handleItemClick({value: "guess-placeholder"}, know)
    }

    const flipCard = () => {
        setFlip(!flip)
        setCheckCorrect(!checkCorrect)
    }

    return (
        <div className={`guess-quiz ${cardMotion}`}>
            <div className='guess-top'>
                {labels && labels[quizLength] && labels[quizLength][quizType]}
            </div>
            <div className={`guess-container ${flip ? 'showBack' : 'showFront'}`} ref={containerRef}>
                <div className='guess-question' onClick={handleClick}>
                    <div style={{color: 'orangered'}}><QuestionMark /></div>
                    <p>{ cardFormat?.question }</p>
                </div>
                <div className='guess-answer' onClick={handleClick}>
                    <div style={{color: 'greenyellow'}}><CheckIcon color='green'/></div>
                    <p>{ cardFormat?.answer }</p>
                </div>
            </div>
            <p className='guess-card--footer'>{checkCorrect ? 
                'Tap on the Right edge of the card if you knew the answer, or Left if you did not' 
                : 'Say the answer in your head, then Tap to check the right answer'}
            </p>
        </div>
    );
};

export default GuessCard;

const labels = {
    'long': {
        'meaning': 'What is the meaning of ',
        'synonym': 'Give a synonym of ',
        'antonym': 'Give an antonym of ',
        'example': 'Make a sentence with '
    },
    'short': {
        'meaning': 'What is the word/expression for ',
        'synonym': 'Give a synonym of ',
        'antonym': 'Give an antonym of ',
        'example': 'Find a word/expression to fill in the blanks '
    }
};

const waveToColor = (x, low, midpoint) => {
    const angle = (x - low) * 2 * Math.PI / midpoint;
    return [higherFreqCos(angle), lowerFreqCos(angle)];
};

const higherFreqCos = (x) => {
    return 1;
    //return (Math.cos(x) + 3)/4
};

const lowerFreqCos = (x) => {
    return (-2 * Math.cos(0.5 * x) + 2) / 4;
};
