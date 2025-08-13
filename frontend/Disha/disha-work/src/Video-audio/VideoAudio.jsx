import React from "react";
import { useState, useRef } from "react";

const VideoAudio = () => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [questions] = useState([
    "Tell us about yourself.",
    "Describe a challenging project you worked on.",
    "How do you handle tight deadlines?",
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });
      mediaRecorderRef.current = mediaRecorder;

      let chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        uploadVideo(blob);
        chunks = [];
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
    videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
  };

  const uploadVideo = async (blob) => {
    const formData = new FormData();
    formData.append("video", blob, "interview.webm");

    await fetch("/upload", {
      // Your backend endpoint
      method: "POST",
      body: formData,
    });
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 1, borderRight: "1px solid #ccc", padding: "20px" }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: "100%", borderRadius: "8px" }}
        />
        {!recording ? (
          <button onClick={startRecording}>Start Interview</button>
        ) : (
          <button onClick={stopRecording}>Stop Interview</button>
        )}
      </div>

      <div style={{ flex: 1, padding: "20px" }}>
        <h2>Question {currentQuestionIndex + 1}</h2>
        <p>{questions[currentQuestionIndex]}</p>
        <button
          onClick={() =>
            setCurrentQuestionIndex((prev) =>
              Math.min(prev + 1, questions.length - 1)
            )
          }
        >
          Next Question
        </button>
      </div>
    </div>
  );
};

export default VideoAudio;
