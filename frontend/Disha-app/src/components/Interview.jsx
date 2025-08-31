import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import "./Interview.css";

const Interview = () => {
  const { domainId } = useParams();
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [questions, setQuestions] = useState([]);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const docRef = doc(db, "questions", domainId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const qArray = Object.values(data);
          setQuestions(qArray);
        } else {
          console.log("No such questions found for this domain !");
          setQuestions([]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuestions();
  }, [domainId]);

  useEffect(() => {
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
      const blob = new Blob(recordedChunks, {
        type: "video/webm;codecs=vp8,opus",
      });
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
            `Speech Confidence: ${(result.speech_confidence).toFixed(
              1
            )}%\n` +
            `Vision Confidence: ${(result.vision_confidence).toFixed(
              1
            )}%\n` +
            `Total Confidence: ${(result.total_confidence).toFixed(
              1
            )}%\n` +
            `Flags: ${(result.flags).toFixed(
              1
            )}\n` +
            `${
              result.disqualified
                ? "Warning: Potential disqualification flags detected!"
                : ""
            }`
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
        <div className="questions-section">
          <h2>Questions</h2>
          {questions.length > 0 ? (
            <ol>
              {questions.map((q, idx) => (
                <li key={idx}>{q}</li>
              ))}
            </ol>
          ) : (
            <p>No questions found for this domain.</p>
          )}

          <button
            onClick={submitInterview}
            className="control-btn submit-btn"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Submit Interview"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Interview;
