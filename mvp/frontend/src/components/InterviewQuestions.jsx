import React, { useState, useEffect } from 'react'
import axios from 'axios'

const InterviewQuestions = () => {
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/mock-questions')
      setQuestions(response.data.questions)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching questions:', error)
      // Fallback questions
      setQuestions([
        "Tell me about yourself and your background.",
        "What are your greatest strengths?",
        "Describe a challenging situation you faced and how you handled it.",
        "Why are you interested in this position?",
        "Where do you see yourself in 5 years?"
      ])
      setLoading(false)
    }
  }

  const nextQuestion = () => {
    setCurrentQuestion((prev) => (prev + 1) % questions.length)
  }

  const prevQuestion = () => {
    setCurrentQuestion((prev) => (prev - 1 + questions.length) % questions.length)
  }

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
          <span>Loading interview questions...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>Sample Interview Questions</h2>
      <p>Practice with these common interview questions. Choose one to focus on during your recording.</p>
      
      <div style={{
        backgroundColor: '#f8fafc',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        padding: '30px',
        margin: '20px 0',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '0.9rem',
          color: '#64748b',
          marginBottom: '12px',
          fontWeight: '600'
        }}>
          Question {currentQuestion + 1} of {questions.length}
        </div>
        
        <div style={{
          fontSize: '1.4rem',
          fontWeight: '600',
          color: '#1e293b',
          lineHeight: '1.4',
          marginBottom: '20px'
        }}>
          {questions[currentQuestion]}
        </div>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            className="btn btn-secondary"
            onClick={prevQuestion}
            disabled={questions.length <= 1}
          >
            ← Previous
          </button>
          <button
            className="btn btn-secondary"
            onClick={nextQuestion}
            disabled={questions.length <= 1}
          >
            Next →
          </button>
        </div>
      </div>

      <div style={{
        backgroundColor: '#ecfdf5',
        border: '1px solid #a7f3d0',
        borderRadius: '8px',
        padding: '16px',
        marginTop: '20px'
      }}>
        <h4 style={{ color: '#065f46', marginBottom: '8px' }}>
          💡 Tips for Success:
        </h4>
        <ul style={{ 
          color: '#047857', 
          margin: 0,
          paddingLeft: '20px',
          lineHeight: '1.6'
        }}>
          <li>Maintain eye contact with the camera</li>
          <li>Speak clearly and at a moderate pace</li>
          <li>Use specific examples in your answers</li>
          <li>Keep your posture confident and relaxed</li>
          <li>Take a moment to think before answering</li>
        </ul>
      </div>

      {questions.length > 1 && (
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ marginBottom: '12px', color: '#374151' }}>
            All Questions:
          </h4>
          <div style={{ display: 'grid', gap: '8px' }}>
            {questions.map((question, index) => (
              <div
                key={index}
                onClick={() => setCurrentQuestion(index)}
                style={{
                  padding: '12px 16px',
                  backgroundColor: index === currentQuestion ? '#dbeafe' : '#f9fafb',
                  border: index === currentQuestion ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '0.95rem',
                  color: '#374151'
                }}
                onMouseEnter={(e) => {
                  if (index !== currentQuestion) {
                    e.target.style.backgroundColor = '#f3f4f6'
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== currentQuestion) {
                    e.target.style.backgroundColor = '#f9fafb'
                  }
                }}
              >
                <strong>Q{index + 1}:</strong> {question}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default InterviewQuestions
