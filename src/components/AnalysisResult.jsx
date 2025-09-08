import React from 'react'
import { RotateCcw, Heart, AlertTriangle, Activity, Lightbulb } from 'lucide-react'

const AnalysisResult = ({ result, onReset }) => {
  const getEmotionColor = (emotion) => {
    const colors = {
      'Happy': 'text-green-400',
      'Excited': 'text-yellow-400',
      'Anxious': 'text-red-400',
      'Playful': 'text-blue-400',
      'Calm': 'text-purple-400',
      'Alert': 'text-orange-400'
    }
    return colors[emotion] || 'text-text-secondary'
  }

  const getUrgencyColor = (urgency) => {
    const colors = {
      'Low': 'text-green-400',
      'Medium': 'text-yellow-400',
      'High': 'text-red-400'
    }
    return colors[urgency] || 'text-text-secondary'
  }

  const getConfidenceBarColor = (confidence) => {
    if (confidence >= 80) return 'from-green-500 to-green-600'
    if (confidence >= 60) return 'from-yellow-500 to-yellow-600'
    return 'from-red-500 to-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Analysis Complete</h3>
          <button
            onClick={onReset}
            className="btn-secondary flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Analysis</span>
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">File:</span>
            <span className="font-medium">{result.fileName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Type:</span>
            <span className="font-medium capitalize">{result.type}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Analyzed:</span>
            <span className="font-medium">
              {new Date(result.timestamp).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="glass rounded-xl p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Heart className="w-5 h-5 text-primary" />
          <span>Emotional Analysis</span>
        </h4>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Emotion:</span>
            <span className={`font-semibold ${getEmotionColor(result.emotion)}`}>
              {result.emotion}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Intent:</span>
            <span className="font-medium">{result.intent}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Urgency:</span>
            <span className={`font-medium ${getUrgencyColor(result.urgency)}`}>
              {result.urgency}
            </span>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-secondary">Confidence:</span>
              <span className="font-medium">{result.confidence}%</span>
            </div>
            <div className="w-full bg-surface rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${getConfidenceBarColor(result.confidence)}`}
                style={{ width: `${result.confidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="glass rounded-xl p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-primary" />
          <span>Interpretation</span>
        </h4>
        <p className="text-text-secondary leading-relaxed">
          {result.description}
        </p>
      </div>

      {/* Suggestions */}
      <div className="glass rounded-xl p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          <span>Activity Suggestions</span>
        </h4>
        <ul className="space-y-3">
          {result.suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-text-secondary leading-relaxed">{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AnalysisResult