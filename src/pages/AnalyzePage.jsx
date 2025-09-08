import React, { useState } from 'react'
import { Upload, Mic, Video, Play, Pause, RotateCcw, Loader } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from '../components/AuthModal'
import AudioUploader from '../components/AudioUploader'
import VideoUploader from '../components/VideoUploader'
import AnalysisResult from '../components/AnalysisResult'
import toast from 'react-hot-toast'

const AnalyzePage = () => {
  const [activeTab, setActiveTab] = useState('audio')
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user } = useAuth()

  const handleAnalysis = async (file, type) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    // Check subscription limits
    if (user.subscriptionTier === 'free' && user.analysisCount >= 3) {
      toast.error('Free tier limit reached. Upgrade to continue analyzing.')
      return
    }

    setIsAnalyzing(true)
    
    // Simulate API call
    setTimeout(() => {
      const mockResult = {
        id: Date.now(),
        type,
        fileName: file.name,
        timestamp: new Date().toISOString(),
        emotion: type === 'audio' ? 'Happy' : 'Playful',
        confidence: Math.floor(Math.random() * 20) + 80,
        intent: type === 'audio' ? 'Greeting' : 'Attention Seeking',
        urgency: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        description: type === 'audio' 
          ? 'Your pet is expressing joy and excitement, likely greeting you or anticipating something positive.'
          : 'Your pet is in a playful mood and is seeking attention or interaction.',
        suggestions: [
          'Engage in interactive play for 10-15 minutes',
          'Provide mental stimulation with puzzle toys',
          'Consider a short training session with treats'
        ]
      }
      
      setAnalysis(mockResult)
      setIsAnalyzing(false)
      toast.success('Analysis complete!')
    }, 3000)
  }

  const tabs = [
    { id: 'audio', label: 'Audio Analysis', icon: Mic },
    { id: 'video', label: 'Video Analysis', icon: Video }
  ]

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Analyze Your Pet's <span className="gradient-text">Communication</span>
          </h1>
          <p className="text-xl text-text-secondary">
            Upload audio or video clips to understand what your pet is trying to tell you
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 p-1 glass rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            {activeTab === 'audio' ? (
              <AudioUploader onAnalyze={handleAnalysis} disabled={isAnalyzing} />
            ) : (
              <VideoUploader onAnalyze={handleAnalysis} disabled={isAnalyzing} />
            )}

            {/* Analysis Status */}
            {isAnalyzing && (
              <div className="glass rounded-xl p-6 text-center">
                <Loader className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analyzing...</h3>
                <p className="text-text-secondary">
                  Our AI is processing your {activeTab} to understand your pet's communication
                </p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div>
            {analysis ? (
              <AnalysisResult result={analysis} onReset={() => setAnalysis(null)} />
            ) : (
              <div className="glass rounded-xl p-8 text-center">
                <Upload className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Analysis Yet</h3>
                <p className="text-text-secondary">
                  Upload an {activeTab} file to see your pet's communication analysis here
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Subscription Info */}
        {user && user.subscriptionTier === 'free' && (
          <div className="mt-12 glass rounded-xl p-6 border border-yellow-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-yellow-400">Free Tier</h3>
                <p className="text-text-secondary">
                  {3 - (user.analysisCount || 0)} analyses remaining
                </p>
              </div>
              <button className="btn-primary">
                Upgrade Now
              </button>
            </div>
          </div>
        )}
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  )
}

export default AnalyzePage