import React from 'react'

const AnalysisResults = ({ results }) => {
  const getConfidenceColor = (score) => {
    if (score >= 80) return '#059669' // Green
    if (score >= 60) return '#d97706' // Orange
    return '#dc2626' // Red
  }

  const getConfidenceLabel = (score) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Needs Improvement'
    return 'Poor'
  }

  if (results.error) {
    return (
      <div className="card">
        <h2>Analysis Error</h2>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#dc2626'
        }}>
          <strong>Error:</strong> {results.error}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="card">
        <h2>Interview Confidence Analysis Results</h2>
        
        {/* Overall Score */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px'
        }}>
          <h3>Overall Confidence Score</h3>
          <div style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: getConfidenceColor(results.overall_confidence),
            margin: '10px 0'
          }}>
            {results.overall_confidence}%
          </div>
          <div style={{
            fontSize: '1.2rem',
            color: '#6b7280',
            fontWeight: '600'
          }}>
            {getConfidenceLabel(results.overall_confidence)}
          </div>
        </div>

        {/* Detailed Scores */}
        <div className="scores-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Visual Confidence */}
          <div className="score-card" style={{
            padding: '20px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h4 style={{ marginBottom: '12px', color: '#374151' }}>
              Visual Confidence
            </h4>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: getConfidenceColor(results.visual_confidence),
              marginBottom: '8px'
            }}>
              {results.visual_confidence}%
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              Body language, eye contact, facial expressions
            </div>
          </div>

          {/* Linguistic Confidence */}
          <div className="score-card" style={{
            padding: '20px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <h4 style={{ marginBottom: '12px', color: '#374151' }}>
              Linguistic Confidence
            </h4>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: getConfidenceColor(results.linguistic_confidence),
              marginBottom: '8px'
            }}>
              {results.linguistic_confidence}%
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              Speech clarity, coherence, professional language
            </div>
          </div>
        </div>

        {/* Transcript */}
        {results.transcript && (
          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ marginBottom: '12px', color: '#374151' }}>
              Speech Transcript
            </h4>
            <div style={{
              padding: '16px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              fontStyle: 'italic',
              color: '#4b5563',
              lineHeight: '1.6'
            }}>
              "{results.transcript}"
            </div>
          </div>
        )}

        {/* Recommendations */}
        {results.recommendations && results.recommendations.length > 0 && (
          <div>
            <h4 style={{ marginBottom: '16px', color: '#374151' }}>
              Improvement Recommendations
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0
            }}>
              {results.recommendations.map((recommendation, index) => (
                <li key={index} style={{
                  padding: '12px 16px',
                  marginBottom: '8px',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #dbeafe',
                  borderRadius: '8px',
                  position: 'relative',
                  paddingLeft: '40px'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '16px',
                    top: '12px',
                    color: '#3b82f6',
                    fontWeight: 'bold'
                  }}>
                    💡
                  </span>
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Progress Visualization */}
      <div className="card">
        <h3>Score Breakdown</h3>
        <div style={{ marginTop: '20px' }}>
          {[
            { label: 'Overall Confidence', score: results.overall_confidence },
            { label: 'Visual Confidence', score: results.visual_confidence },
            { label: 'Linguistic Confidence', score: results.linguistic_confidence }
          ].map((item, index) => (
            <div key={index} style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '4px'
              }}>
                <span style={{ fontWeight: '600', color: '#374151' }}>
                  {item.label}
                </span>
                <span style={{ 
                  fontWeight: 'bold',
                  color: getConfidenceColor(item.score)
                }}>
                  {item.score}%
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#e5e7eb',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${item.score}%`,
                  height: '100%',
                  backgroundColor: getConfidenceColor(item.score),
                  transition: 'width 0.5s ease'
                }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AnalysisResults
