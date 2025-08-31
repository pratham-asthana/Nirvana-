import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import "./Interview.css";

const Interview = () => {
  const { domainId } = useParams();
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [askedQuestions, setAskedQuestions] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const docRef = doc(db, "questions", domainId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const questionsList = object.values(data);
          setQuestions(questionsList);

          if (questionsList.length > 0) {
            setCurrentQuestion(
              questionsList[Math.floor(Math.random() * questionsList.length)]
            );
          }
        } else {
          console.log("No such domain questions found !");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuestions();
    initializeCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [domainId]);

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
      mimeType: "video/webm;codecs=vp8,opus",
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
    const remaining = questions.filter((q) => !askedQuestions.includes(q));
    if (remaining.length === 0) {
      alert("You have answered all questions!");
      return;
    }
    const randomQuestion =
      remaining[Math.floor(Math.random() * remaining.length)];
    setCurrentQuestion(randomQuestion);
    setAskedQuestions([...askedQuestions, randomQuestion]);
  };

  const submitInterview = async () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      // Wait for the recorder.onstop to fire and chunks to be updated
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (!recordedChunks.length) {
      alert("No recording found. Please record your interview first.");
      return;
    }

    setIsUploading(true);

    try {
      // Create a blob with proper codec information
      const blob = new Blob(recordedChunks, { type: "video/webm;codecs=vp8,opus" });
      const formData = new FormData();
      formData.append("video", blob, "interview.webm");

      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert(
          `Interview Analysis:\n` +
          `Speech Confidence: ${(result.speech_confidence * 100).toFixed(1)}%\n` +
          `Vision Confidence: ${(result.vision_confidence * 100).toFixed(1)}%\n` +
          `Total Confidence: ${(result.total_confidence * 100).toFixed(1)}%\n` +
          `${result.disqualified ? 'Warning: Potential disqualification flags detected!' : ''}`
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
              controls={false}
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
