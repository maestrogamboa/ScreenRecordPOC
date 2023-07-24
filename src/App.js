import React, { useState } from 'react';

const App = () => {
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      setMediaStream(stream);
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      const chunks = [];
      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        setRecordedChunks(chunks);
      };

      recorder.start();
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaStream(null);
      setMediaRecorder(null);
    }
  };

  const saveRecording = () => {
    if (recordedChunks.length === 0) {
      console.warn('No recording available.');
      return;
    }

    
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);

    // Create a link element and set its href and download attributes
    const a = document.createElement('a');
    a.href = url;
    a.download = 'screen_recording.webm';

    // Programmatically click the link to start the download
    a.click();
  };

  return (
    <div>
      <h1>Screen Recording Example</h1>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <button onClick={saveRecording}>Save Recording</button>
    </div>
  );
};

export default App;