import React, { useState, useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';  // Ensure the worker is loaded correctly
import './Pdf.css';

// Generate a thumbnail from the first page of the PDF file
const generateThumbnail = async (file) => {
  const fileUrl = URL.createObjectURL(file);
  const loadingTask = pdfjsLib.getDocument(fileUrl);

  try {
    const pdfDocument = await loadingTask.promise;
    const firstPage = await pdfDocument.getPage(1);

    const scale = 1.5;  // Increase the scale for a clearer thumbnail
    const viewport = firstPage.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const context = canvas.getContext('2d');
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    // Render the page into the canvas
    await firstPage.render(renderContext).promise;

    // Optional: Resize the canvas down after rendering to balance quality
    const tempCanvas = document.createElement('canvas');
    const tempContext = tempCanvas.getContext('2d');
    tempCanvas.width = viewport.width / 2;
    tempCanvas.height = viewport.height / 2;
    tempContext.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

    // Convert resized canvas to an image data URL
    return tempCanvas.toDataURL();
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return null;
  }
};


const Pdf = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePaths, setFilePaths] = useState([]);

  useEffect(() => {
    // Retrieve saved file paths from localStorage on component mount
    const savedPaths = JSON.parse(localStorage.getItem('filePaths')) || [];
    setFilePaths(savedPaths);
  }, []);

  const handleFileSelection = async (file) => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const fileName = file.name;

      // Generate thumbnail for the PDF file
      const thumbnail = await generateThumbnail(file);

      // Save the file info (name, URL, thumbnail) in localStorage if not already saved
      const newFilePaths = [...new Set([...filePaths, { name: fileName, url: fileUrl, thumbnail }])];
      setFilePaths(newFilePaths);
      localStorage.setItem('filePaths', JSON.stringify(newFilePaths));
      setSelectedFile(fileUrl);
    }
  };

  const handleSavedFileClick = (fileUrl) => {
    setSelectedFile(fileUrl);
  };

  return (
    <div className="pdf">
      <h1 style={{ fontSize: selectedFile ? '16px' : '5em' }}>PDF Viewer</h1>
      <PdfViewer selectedFile={selectedFile} onSelectFile={handleFileSelection} filePaths={filePaths} onFileClick={handleSavedFileClick} />
    </div>
  );
};

const PdfViewer = ({ selectedFile, onSelectFile, filePaths, onFileClick }) => {
  const [word, setWord] = useState(null);
  const [context, setContext] = useState(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [info, setInfo] = useState({
    exists: true, type: 'info', message: 'Select the word/expression you need to save!'
  });

  const handleWordApprove = (e) => {
    //console.log(word, context)
    if (word && context) {
      const temp = JSON.parse(localStorage.getItem('temporary'));
      const words = [...new Set(temp?.words || [])];
      //console.log(words)
      localStorage.setItem('temporary', JSON.stringify({ words: [...words, {word, context}] }));
      setInfo({ exists: true, type: 'info', message: 'Saved successfully!' });
      setWord(null); setContext(null)
    }
    else if (word) {
      setInfo({ exists: true, type: 'info', message: `Now, select the sentence that contains "${word}"` });
    }
  };

  const handleWordSelect = () => {
    const selection = window.getSelection().toString();
    if (word && selection) setContext(selection)
    else if (!word && selection) {
        setWord(selection)
        setInfo({ exists: true, type: 'info', message: `Now, select the sentence that contains "${selection}"` });
    }
  };

  useEffect(() => {
    if (!selectedFile) return
    document.onselectstart = (e) => false
    const timerId = setTimeout(() => {
      document.onselectstart = (e) => true
      document.addEventListener('mouseup', handleWordSelect);
    }, 3000);

    return () => {
      clearTimeout(timerId)
      document.removeEventListener('mouseup', handleWordSelect);
      // document.removeEventListener('click', handleWordApprove);
    };
  }, [selectedFile, word,  context]);

  const handleClear = {
    word: () => setWord(null),
    context: () => setContext(null),
    both: () => {setWord(null); setContext(null)}
  }

  useEffect(() => {
    let timerId;
    if (info.exists) {
      timerId = setTimeout(() => {
        setInfo({ exists: false });
      }, 3000);
    }
    return () => clearTimeout(timerId);
  }, [info]);

  const [fullScreen, setFullScreen] = useState(false);

  return (
    <div className="pdf-viewer-container">
      {(selectedFile && info.exists) && (
        <section className={`pdf-viewer--info pdf-viewer--info-${info.type}`}>
          {info.message}
        </section>
      )}
      {(selectedFile && word && context) && (
        <section className="pdf-viewer--info pdf-viewer--logging-selections">
          <div className='word-and-context'>
            <div className='word'>{word}</div>
            <div className='context'>{context}</div>
          </div>
          <div className='guide'>
            <p>❌If there is a mistake, clear the selections </p>
            <p>✅Otherwise, click anywhere to save</p>
          </div>
          <div className='controls'>
            {/* {!context && <button onClick={handleClear.word}>❌ Clear</button>} */}
            {(word && context) && (
                <>
                  <button className='clear' onClick={handleClear.both}>❌ Clear</button>
                  <button className='save' onClick={handleWordApprove}>✅ Save</button>
                  {/* <button onClick={handleClear.context}>❌ just context</button> */}
                </>
            )}
          </div>
        </section>
      )}
      {!selectedFile && (
        <div className="pdf-upload">
          <label htmlFor="fileInput">
            Click here to upload a PDF file
          </label>
          <input
            id="fileInput"
            type="file"
            accept="application/pdf"
            onChange={(e) => onSelectFile(e.target.files[0])}
            style={{ display: 'none' }}
          />
        </div>
      )}
      {filePaths.length > 0 && !selectedFile && (
        <div className="saved-file-paths">
          <h3>Or continue reading:</h3>
          <ul>
            {filePaths.map((file, index) => (
              <li key={index} onClick={() => onFileClick(file.url)} style={{ cursor: 'pointer' }}>
                <img src={file.thumbnail} alt={`${file.name} thumbnail`} />
                <div>{file.name.split('.').slice(0, file.name.split('.').length - 1)}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedFile && (
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
          <div className={`pdf-viewer pdf-viewer--full-${fullScreen}`}>
            <Viewer fileUrl={selectedFile} plugins={[defaultLayoutPluginInstance]} />
          </div>
        </Worker>
      )}
    </div>
  );
};

export default Pdf;
