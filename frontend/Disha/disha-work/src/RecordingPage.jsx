import React, { useRef, useState, useEffect } from 'react';

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

  // Camera state
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Start video stream automatically on mount
  useEffect(() => {
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          videoRef.current.srcObject = stream;
          setCameraReady(true);
        } else {
          setCameraError('Camera not supported in this browser.');
        }
      } catch (err) {
        setCameraError('Camera access denied or unavailable.');
      }
    };
    startCamera();
    // Cleanup: stop camera on unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Start recording
  const startRecording = () => {
    setRecording(true);
    setChunks([]);
    const stream = videoRef.current.srcObject;
    if (!stream) {
      setCameraError('Camera stream not available.');
      return;
    }
    try {
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
        saveVideo(blob);
      };
      mediaRecorder.start();
    } catch (err) {
      setCameraError('Recording not supported or failed to start.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    setRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
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
        <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxWidth: '400px', border: '1px solid #ccc' }} />
        {cameraError && <div style={{ color: 'red', margin: '1rem' }}>{cameraError}</div>}
        <button onClick={startRecording} disabled={!cameraReady || recording} style={{ margin: '1rem' }}>Start Recording</button>
        <button onClick={stopRecording} disabled={!recording}>Stop Recording</button>
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
