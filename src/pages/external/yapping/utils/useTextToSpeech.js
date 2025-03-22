import { useState, useEffect } from 'react';

const synth = window.speechSynthesis;

const speak = (text, voice) => {
  const utterance = new SpeechSynthesisUtterance();
  utterance.voice = voice;
  utterance.text = text;
  synth.speak(utterance);
  // utterance.rate = state.rate;
  // utterance.onend = resolve;
};

const useTextToSpeech = () => {
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const list = synth.getVoices()?.slice(0, 8);
    setVoices(list);
  }, []);

  return {
    voices,
    speak: speak,
    pause: () => synth.pause(),
    resume: () => synth.resume(),
    cancel: () => synth.cancel(),
  };
};

export default useTextToSpeech;