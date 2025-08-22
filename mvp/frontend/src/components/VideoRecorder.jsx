import React, { useState, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import axios from 'axios'

const VideoRecorder = ({ onAnalysisComplete, onAnalysisStart, isAnalyzing }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedChunks, setRecordedChunks] = useState([])
  const webcamRef = useRef(null)
  const mediaRecorderRef = useRef(null)

  const handleStartRecording = useCallback(() => {
    if (webcamRef.current && webcamRef.current.stream) {
      const mediaRecorder = new MediaRecorder(webcamRef.current.stream, {
        mimeType: 'video/webm'
      })
      
      mediaRecorderRef.current = mediaRecorder
      setRecordedChunks([])
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data])
        }
      }
      
      mediaRecorder.onstop = () => {
        // This will be handled in handleStopRecording
      }
      
      mediaRecorder.start()
      setIsRecording(true)
    }
  }, [])

  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording])

  const handleAnalyze = async () => {
    if (recordedChunks.length === 0) {
      alert('No recording found. Please record a video first.')
      return
    }

    try {
      onAnalysisStart()
      
      // Create blob from recorded chunks
      const blob = new Blob(recordedChunks, { type: 'video/webm' })
      
      // Create form data
      const formData = new FormData()
      formData.append('video', blob, 'recorded-video.webm')
      
      // Send to backend for analysis
      const response = await axios.post('/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds timeout
      })
      
      if (response.data.success) {
        onAnalysisComplete(response.data.analysis)
      } else {
        throw new Error(response.data.error || 'Analysis failed')
      }
      
    } catch (error) {
      console.error('Error analyzing video:', error)
      alert(`Analysis failed: ${error.message}`)
      onAnalysisComplete({
        error: error.message,
        overall_confidence: 0,
        visual_confidence: 0,
        linguistic_confidence: 0,
        transcript: '',
        recommendations: ['Unable to analyze video. Please try again.']
      })
    }
  }

  const handleReset = () => {
    setRecordedChunks([])
    setIsRecording(false)
  }

  return (
    <div className="card">
      <h2>Video Interview Recording</h2>
      <p>Record yourself answering an interview question. Speak clearly and maintain eye contact with the camera.</p>
      
      <div className="video-container" style={{ marginBottom: '20px' }}>
        <Webcam
          ref={webcamRef}
          audio={true}
          width="100%"
          height="300"
          style={{ 
            border: '2px solid #e5e7eb', 
            borderRadius: '8px',
            backgroundColor: '#f9fafb'
          }}
        />
      </div>
      
      <div className="recording-status" style={{ marginBottom: '20px' }}>
        {isRecording && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            color: '#dc2626',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#dc2626',
              borderRadius: '50%',
              marginRight: '8px',
              animation: 'pulse 1s infinite'
            }}></div>
            Recording in progress...
          </div>
        )}
        
        {recordedChunks.length > 0 && !isRecording && (
          <div style={{ color: '#059669', fontSize: '16px', fontWeight: '600' }}>
            ✓ Video recorded successfully! Ready for analysis.
          </div>
        )}
      </div>
      
      <div className="controls" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {!isRecording ? (
          <button 
            className="btn btn-success" 
            onClick={handleStartRecording}
            disabled={isAnalyzing}
          >
            {recordedChunks.length > 0 ? 'Record Again' : 'Start Recording'}
          </button>
        ) : (
          <button 
            className="btn btn-danger" 
            onClick={handleStopRecording}
          >
            Stop Recording
          </button>
        )}
        
        {recordedChunks.length > 0 && !isRecording && (
          <>
            <button 
              className="btn btn-primary" 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Confidence'}
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={handleReset}
              disabled={isAnalyzing}
            >
              Reset
            </button>
          </>
        )}
      </div>
      
      {isAnalyzing && (
        <div className="loading">
          <div className="spinner"></div>
          <span style={{ marginLeft: '12px' }}>
            Analyzing your interview performance...
          </span>
        </div>
      )}
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

export default VideoRecorder
