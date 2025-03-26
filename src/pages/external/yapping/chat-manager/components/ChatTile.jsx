import { useState, useEffect, useRef } from 'react';
import './ChatTile.css';

const ChatTile = ({ user, isActive, isLocalUser, stream }) => {
  const [amplitude, setAmplitude] = useState(0);
  const smoothedAmplitude = useRef(0);

  const audioRef = useRef();

  useEffect(() => {
    if (audioRef.current) audioRef.current.srcObject = stream;
  }, [stream])

  useEffect(() => {
    let audioContext;
    let analyzer;
    let microphone;
    let animationFrame;

    const processAudioInput = () => {
      const dataArray = new Uint8Array(analyzer.frequencyBinCount);
      analyzer.getByteTimeDomainData(dataArray); // Using time domain for better voice detection
      
      // Calculate RMS (Root Mean Square) for better amplitude representation
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const amplitude = (dataArray[i] - 128) / 128;
        sum += amplitude * amplitude;
      }
      const rms = Math.sqrt(sum / dataArray.length);

      // Smooth the transition between values
      smoothedAmplitude.current += (rms - smoothedAmplitude.current) * 0.2;
      
      // Apply some thresholding to reduce noise
      const threshold = 0.01;
      const normalizedAmplitude = smoothedAmplitude.current < threshold 
        ? 0 
        : Math.min(smoothedAmplitude.current * 3, 1);

      setAmplitude(normalizedAmplitude);
      animationFrame = requestAnimationFrame(processAudioInput);
    };

    const initializeAudio = async () => {
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyzer = audioContext.createAnalyser();
        
        // Adjust analyzer settings for voice
        analyzer.fftSize = 1024;
        analyzer.smoothingTimeConstant = 0.2;

        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyzer);
        
        processAudioInput();
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    if (isLocalUser && isActive) {
      initializeAudio();
    } else if (!isLocalUser && isActive) {
      const intervalId = setInterval(() => {
        setAmplitude(Math.random() * 0.5 + 0.5);
      }, 100);
      return () => clearInterval(intervalId);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [isActive, isLocalUser]);

  return (
    <span className="chat-tile">
      <div 
        className="voice-indicator" 
        style={{ 
          transform: `scale(${1 + amplitude * 0.4})`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <div className="avatar">
          <img src={user.playerAvatar} alt={user.name} />
        </div>
      </div>
      <div className="user-name">{user.name}</div>
      <audio key={user.playerID} ref={audioRef} autoPlay></audio>
    </span>
  );
};

export default ChatTile; 