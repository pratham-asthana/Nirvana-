import React, { useRef, useState } from 'react';

const questions = [
  "Tell us about yourself.",
  "Why do you want this job?",
  "Describe a challenge you faced and how you overcame it.",
  "Where do you see yourself in 5 years?",
  "Why should we hire you?"
];

const RecordingPage = () => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [chunks, setChunks] = useState([]);

  // Start video stream
  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;
    }
  };

  // Start recording
  const startRecording = () => {
    setRecording(true);
    setChunks([]);
    const stream = videoRef.current.srcObject;
    const mediaRecorder = new window.MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        setChunks((prev) => [...prev, e.data]);
      }
    };
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setVideoURL(url);
      // Save video to server
      saveVideo(blob);
    };
    mediaRecorder.start();
  };

  // Stop recording
  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current.stop();
  };

  // Save video to backend
  const saveVideo = async (blob) => {
    const formData = new FormData();
    formData.append('video', blob, 'interview.webm');
    await fetch('/api/save-video', {
      method: 'POST',
      body: formData,
    });
  };

  // Next question
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Submit
  const handleSubmit = () => {
    stopRecording();
    alert('Interview submitted!');
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
      {/* Division 1: Video Recording */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Record Your Interview</h2>
        <video ref={videoRef} autoPlay style={{ width: '100%', maxWidth: '400px', border: '1px solid #ccc' }} />
        {!recording ? (
          <button onClick={startCamera} style={{ margin: '1rem' }}>Start Camera</button>
        ) : null}
        {!recording ? (
          <button onClick={startRecording} disabled={!videoRef.current || !videoRef.current.srcObject}>Start Recording</button>
        ) : (
          <button onClick={stopRecording}>Stop Recording</button>
        )}
        {videoURL && (
          <div>
            <h4>Recorded Video:</h4>
            <video src={videoURL} controls style={{ width: '100%', maxWidth: '400px' }} />
          </div>
        )}
      </div>

      {/* Division 2: Questions */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Interview Questions</h2>
        <div style={{ minHeight: '80px', fontSize: '1.2rem', marginBottom: '2rem' }}>
          {questions[currentQuestion]}
        </div>
        {currentQuestion < questions.length - 1 ? (
          <button onClick={handleNext} disabled={!recording}>Next</button>
        ) : (
          <button onClick={handleSubmit} disabled={!recording}>Submit</button>
        )}
      </div>
    </div>
  );
};

export default RecordingPage;
