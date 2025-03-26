
import React, { useState, useEffect } from 'react'

const ChatTranscript = ({playerID, players, setPlayers}) => {

    // generate code to speech-to-text and log thet transcript down there
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const player = players.find(player => player.playerID === playerID)
    const playerIndex = players.indexOf(player)
    if (isListening ^ player.isSpeaking && typeof player === "object") {
      setPlayers(prev => {
        const prevCopy = [...prev]
        console.log(prevCopy)
        prevCopy[playerIndex]["isSpeaking"] = !player.isSpeaking;
        return prevCopy
      })
    }
    
  }, [isListening])
  
  useEffect(() => {
    let recognition = null;
    
    const startListening = () => {
      if ('webkitSpeechRecognition' in window) {
        console.log('first')
        recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onstart = () => {
          setIsListening(true);
        };
        
        recognition.onresult = (event) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              const part = event.results[i][0].transcript
              currentTranscript += part ? part + '. ' : part;
            }
          }
          setTranscript((prev) => currentTranscript);
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognition.start();
      } else {
        alert('Speech recognition is not supported in this browser.');
      }
    };
    
    startListening();
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);
  return (
        <p className='actor-line'>
          {transcript ? transcript : "No transcript available yet. Start speaking to see your words appear here."}
        </p>
  )
}

export default ChatTranscript