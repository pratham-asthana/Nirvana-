import React, { useState, useRef, useEffect } from 'react';
import './Interview.css';

const Interview = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const questions = [
    "Question 1: Tell me about yourself.",
    "Question 2: What are your strengths and weaknesses?",
    "Question 3: Why do you want this position?",
    "Question 4: Where do you see yourself in 5 years?",
    "Question 5: What is your greatest achievement?"
  ];

  useEffect(() => {
    // Initialize webcam when component mounts
    initializeCamera();
    
    return () => {
      // Clean up camera stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const startRecording = () => {
    if (!streamRef.current) {
      alert('Camera not initialized');
      return;
    }

    const recorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm'
    });

    const chunks = [];
    
    recorder.ondataavailable = (event) => {
      console.log('Data available:', event.data.size);
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      console.log('Recording stopped, chunks:', chunks.length);
      setRecordedChunks(chunks);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
    setRecordedChunks([]); // Clear previous recordings
    console.log('Recording started');
  };

  const stopRecording = () => {
    console.log('Stop recording called');
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      console.log('Stopping recorder');
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const submitInterview = async () => {
    console.log('Submit button clicked');
    console.log('Recorded chunks length:', recordedChunks.length);
    console.log('Media recorder state:', mediaRecorder?.state);
    
    // Stop recording if still recording
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      console.log('Stopping recording before submit');
      mediaRecorder.stop();
      // Wait a moment for the stop event to process
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (!recordedChunks.length) {
      console.log('No recording found');
      alert('No recording found. Please record your interview first.');
      return;
    }

    setIsUploading(true);
    console.log('Starting upload process');

    try {
      // Create blob from recorded chunks
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      console.log('Blob created, size:', blob.size);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('video', blob, 'interview.webm');
      console.log('FormData created');

      // Upload to backend
      console.log('Sending request to backend...');
      const response = await fetch('http://localhost:8000/upload-video', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const result = await response.json();
        console.log('Success response:', result);
        alert(`Interview submitted successfully! Confidence Score: ${result.confidence}`);
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      alert(`Failed to submit interview. Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="interview-container">
      <div className="interview-header">
        <h1>Interview Session</h1>
        <p>Answer the questions while looking at the camera</p>
      </div>

      <div className="interview-content">
        {/* Left side - Video recording */}
        <div className="video-section">
          <div className="video-container">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="video-preview"
            />
            {isRecording && <div className="recording-indicator">● REC</div>}
          </div>
          
          <div className="video-controls">
            {!isRecording ? (
              <button 
                onClick={startRecording}
                className="control-btn start-btn"
                disabled={isUploading}
              >
                Start Recording
              </button>
            ) : (
              <button 
                onClick={stopRecording}
                className="control-btn stop-btn"
              >
                Stop Recording
              </button>
            )}
          </div>
        </div>

        {/* Right side - Questions */}
        <div className="question-section">
          <div className="question-container">
            <h2>Question {currentQuestion} of {questions.length}</h2>
            <p className="question-text">{questions[currentQuestion - 1]}</p>
          </div>

          <div className="question-controls">
            {currentQuestion < questions.length ? (
              <button 
                onClick={nextQuestion}
                className="control-btn next-btn"
                disabled={isUploading}
              >
                Next Question
              </button>
            ) : (
              <button 
                onClick={submitInterview}
                className="control-btn submit-btn"
                disabled={isUploading}
              >
                {isUploading ? 'Submitting...' : 'Submit Interview'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
