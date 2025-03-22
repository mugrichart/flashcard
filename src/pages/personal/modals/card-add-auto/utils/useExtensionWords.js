import { useEffect, useRef, useState } from "react";

export default () => {
    const [isExtensionOpen, setIsExtensionOpen] = useState(false)
    const [extensionWords, setExtensionWords] = useState([])
    const oneTimeRef = useRef(0)

    useEffect(() => {
        if (oneTimeRef.current === 1) return;
        oneTimeRef.current = 1;
        fetchingExtensionData(setExtensionWords, setIsExtensionOpen)
    }, [])

    return [isExtensionOpen, extensionWords]
}

const fetchingExtensionData = (setExtensionWords, setIsExtensionOpen) => {
    let timeout;
    const handleExtensionMessage = (event) => {
      if (event.data.type === 'FROM_EXTENSION') {
        const words = event.data.payload
        setExtensionWords(words || [])
        console.log('Data received from extension: ')
        console.log(words?.length + ' words: ' + words);
        window.postMessage({ type: 'CLEAR_STORAGE' }, '*')
        window.removeEventListener('message', handleExtensionMessage)
      }
    };
    
    let attempt = 0;
    const maxAttempts = 15; // or a suitable number
    const retrievingExtension = () => {
        if (attempt >= maxAttempts) {
            clearTimeout(timeout);
            setIsExtensionOpen(true);
            console.log('Extension not found after multiple attempts.');
            return;
        }
        if (document.documentElement.dataset.hasExtension) {
            clearTimeout(timeout);
            setIsExtensionOpen(true);
            window.postMessage({ type: 'REQUEST_DATA_FROM_EXTENSION' }, '*');
        } else {
            attempt++;
            timeout = setTimeout(retrievingExtension, 2000);
        }
    };

    // Call the function to check for the extension and request data
    retrievingExtension();

    // Add the event listener for messages from the extension
    window.addEventListener('message', handleExtensionMessage);

    // Cleanup function to remove the event listener
    return () => {
        clearTimeout(timeout)
        window.removeEventListener('message', handleExtensionMessage);
    };
  }
