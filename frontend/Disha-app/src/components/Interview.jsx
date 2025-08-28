import React, { useState, useRef, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase-config";
import "./Interview.css";

const Interview = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      const querySnapshot = await getDocs(collection(db, "questions"));
      const questionsList = querySnapshot.docs.map((doc) => doc.data().text);
      setQuestions(questionsList);

      // Pick first random question
      if (questionsList.length > 0) {
        setCurrentQuestion(
          questionsList[Math.floor(Math.random() * questionsList.length)]
        );
      }
    };
    fetchQuestions();
    initializeCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const startRecording = () => {
    if (!streamRef.current) {
      alert("Camera not initialized");
      return;
    }

    const recorder = new MediaRecorder(streamRef.current, {
      mimeType: "video/webm",
    });

    const chunks = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      setRecordedChunks(chunks);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
    setRecordedChunks([]); // clear previous
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const nextQuestion = () => {
    if (questions.length > 0) {
      const randomQuestion =
        questions[Math.floor(Math.random() * questions.length)];
      setCurrentQuestion(randomQuestion);
    }
  };

  const submitInterview = async () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (!recordedChunks.length) {
      alert("No recording found. Please record your interview first.");
      return;
    }

    setIsUploading(true);

    try {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const formData = new FormData();
      formData.append("video", blob, "interview.webm");

      const response = await fetch("http://localhost:8000/upload-video", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert(
          `Interview submitted successfully! Confidence Score: ${result.confidence}`
        );
      } else {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
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
        {/* Left side - Video */}
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
              <button onClick={stopRecording} className="control-btn stop-btn">
                Stop Recording
              </button>
            )}
          </div>
        </div>

        {/* Right side - Questions */}
        <div className="question-section">
          <div className="question-container">
            {currentQuestion ? (
              <>
                <p className="question-text">{currentQuestion}</p>
              </>
            ) : (
              <p>Loading questions...</p>
            )}
          </div>

          <div className="question-controls">
            <button
              onClick={nextQuestion}
              className="control-btn next-btn"
              disabled={isUploading}
            >
              Next Question
            </button>

            <button
              onClick={submitInterview}
              className="control-btn submit-btn"
              disabled={isUploading}
            >
              {isUploading ? "Submitting..." : "Submit Interview"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
