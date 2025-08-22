import React, { useState } from 'react'
import VideoRecorder from './components/VideoRecorder'
import AnalysisResults from './components/AnalysisResults'
import InterviewQuestions from './components/InterviewQuestions'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [analysisResults, setAnalysisResults] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results)
    setCurrentView('results')
    setIsAnalyzing(false)
  }

  const handleAnalysisStart = () => {
    setIsAnalyzing(true)
  }

  const resetApp = () => {
    setCurrentView('home')
    setAnalysisResults(null)
    setIsAnalyzing(false)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>🧘 Nirvana MVP</h1>
          <p>AI-Powered Interview Confidence Analysis</p>
        </div>
      </header>

      <main className="container">
        {currentView === 'home' && (
          <div className="home-view">
            <div className="card">
              <h2>Welcome to Nirvana Interview Analysis</h2>
              <p>
                Practice your interview skills with AI-powered confidence analysis. 
                Record yourself answering questions and get instant feedback on your performance.
              </p>
              <div className="action-buttons">
                <button 
                  className="btn btn-primary"
                  onClick={() => setCurrentView('questions')}
                >
                  View Sample Questions
                </button>
                <button 
                  className="btn btn-success"
                  onClick={() => setCurrentView('record')}
                >
                  Start Interview Practice
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'questions' && (
          <div>
            <InterviewQuestions />
            <div style={{ marginTop: '20px' }}>
              <button className="btn btn-secondary" onClick={resetApp}>
                Back to Home
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => setCurrentView('record')}
                style={{ marginLeft: '10px' }}
              >
                Start Recording
              </button>
            </div>
          </div>
        )}

        {currentView === 'record' && (
          <div>
            <VideoRecorder 
              onAnalysisComplete={handleAnalysisComplete}
              onAnalysisStart={handleAnalysisStart}
              isAnalyzing={isAnalyzing}
            />
            <div style={{ marginTop: '20px' }}>
              <button className="btn btn-secondary" onClick={resetApp}>
                Back to Home
              </button>
            </div>
          </div>
        )}

        {currentView === 'results' && analysisResults && (
          <div>
            <AnalysisResults results={analysisResults} />
            <div style={{ marginTop: '20px' }}>
              <button className="btn btn-primary" onClick={resetApp}>
                Start New Analysis
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2025 Nirvana MVP - AI Interview Analysis System</p>
        </div>
      </footer>
    </div>
  )
}

export default App
