import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, Crown, BarChart3, History, Activity, Zap } from 'lucide-react'
import PetProfile from '../components/PetProfile'
import ActivitySuggestionCard from '../components/ActivitySuggestionCard'
import PremiumCTA from '../components/PremiumCTA'
import { getUserAnalyses, getUserStats } from '../lib/database'
import { generateActivitySuggestions } from '../lib/openai'
import { hasFeatureAccess, SUBSCRIPTION_PLANS } from '../lib/stripe'
import toast from 'react-hot-toast'

const DashboardPage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [analyses, setAnalyses] = useState([])
  const [stats, setStats] = useState(null)
  const [activitySuggestions, setActivitySuggestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load user analyses
      const userAnalyses = await getUserAnalyses(user.id, 20)
      setAnalyses(userAnalyses)
      
      // Load user stats
      const userStats = await getUserStats(user.id)
      setStats(userStats)
      
      // Generate activity suggestions if user has premium access
      if (hasFeatureAccess(user.subscriptionTier, 'premiumSuggestions') && user.petProfile) {
        const suggestions = await generateActivitySuggestions(user.petProfile, userAnalyses.slice(0, 5))
        setActivitySuggestions(suggestions)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = (planId) => {
    // In a real implementation, this would redirect to Stripe checkout
    toast.success(`Redirecting to upgrade to ${planId} plan...`)
    console.log('Upgrade to:', planId)
  }

  const handleActivityComplete = (activity) => {
    toast.success(`Great! You completed: ${activity.title}`)
    // In a real implementation, you might track completed activities
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access your dashboard</h1>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'profile', label: 'Pet Profile', icon: User },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
    { id: 'activities', label: 'Activities', icon: Activity },
  ]

  const getAnalyticsData = () => {
    if (!stats) return { monthlyCount: 0, totalCount: 0, breakdown: {} }
    
    const emotions = analyses.reduce((acc, analysis) => {
      acc[analysis.emotion] = (acc[analysis.emotion] || 0) + 1
      return acc
    }, {})
    
    const mostCommonEmotion = Object.entries(emotions).sort(([,a], [,b]) => b - a)[0]
    const avgConfidence = analyses.length > 0 
      ? Math.round(analyses.reduce((sum, a) => sum + (a.confidence || 0), 0) / analyses.length)
      : 0
    
    return {
      monthlyCount: stats.monthlyCount,
      totalCount: stats.totalCount,
      mostCommonEmotion: mostCommonEmotion ? mostCommonEmotion[0] : 'N/A',
      avgConfidence
    }
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-text-secondary">
            Welcome back! Here's what's happening with your pet.
          </p>
        </div>

        {/* Subscription Status */}
        <div className="glass rounded-xl p-6 mb-8 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">
                  {user.subscriptionTier === 'free' ? 'Free Tier' : 'Premium Plan'}
                </h3>
                <p className="text-text-secondary">
                  {user.subscriptionTier === 'free' 
                    ? 'Upgrade to unlock unlimited analyses'
                    : 'You have unlimited access to all features'
                  }
                </p>
              </div>
            </div>
            {user.subscriptionTier === 'free' && (
              <button 
                onClick={() => handleUpgrade('basic')}
                className="btn-primary"
              >
                Upgrade Now
              </button>
            )}
          </div>
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

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'profile' && <PetProfile />}
          
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-text-secondary mt-2">Loading analytics...</p>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="glass rounded-xl p-6">
                      <h3 className="font-semibold mb-4">Analyses This Month</h3>
                      <div className="text-3xl font-bold text-primary">{getAnalyticsData().monthlyCount}</div>
                      <p className="text-text-secondary text-sm">
                        {SUBSCRIPTION_PLANS[user.subscriptionTier?.toUpperCase()]?.limits.analysesPerMonth === -1 
                          ? 'Unlimited' 
                          : `${SUBSCRIPTION_PLANS[user.subscriptionTier?.toUpperCase()]?.limits.analysesPerMonth || 3} limit`
                        }
                      </p>
                    </div>
                    <div className="glass rounded-xl p-6">
                      <h3 className="font-semibold mb-4">Most Common Emotion</h3>
                      <div className="text-3xl font-bold text-green-400">{getAnalyticsData().mostCommonEmotion}</div>
                      <p className="text-text-secondary text-sm">Based on recent analyses</p>
                    </div>
                    <div className="glass rounded-xl p-6">
                      <h3 className="font-semibold mb-4">Average Confidence</h3>
                      <div className="text-3xl font-bold text-blue-400">{getAnalyticsData().avgConfidence}%</div>
                      <p className="text-text-secondary text-sm">AI accuracy score</p>
                    </div>
                  </div>
                  
                  {user.subscriptionTier === 'free' && (
                    <PremiumCTA 
                      variant="comparison"
                      currentTier={user.subscriptionTier}
                      onUpgrade={handleUpgrade}
                      className="mt-6"
                    />
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-6">Analysis History</h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-text-secondary mt-2">Loading history...</p>
                </div>
              ) : analyses.length > 0 ? (
                <div className="space-y-4">
                  {analyses.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-surface rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          item.analysis_type === 'audio' ? 'bg-red-500' : 'bg-blue-500'
                        }`} />
                        <div>
                          <p className="font-medium capitalize">{item.analysis_type || item.type} Analysis</p>
                          <p className="text-text-secondary text-sm">
                            {new Date(item.created_at || item.timestamp).toLocaleDateString()}
                          </p>
                          {item.file_name && (
                            <p className="text-text-secondary text-xs">{item.file_name}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{item.emotion}</p>
                        <p className="text-text-secondary text-sm">{item.confidence}% confidence</p>
                        {item.intent && (
                          <p className="text-text-secondary text-xs">{item.intent}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-text-secondary">No analyses yet. Start by analyzing your pet's sounds or videos!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Activity Suggestions</h3>
                {!hasFeatureAccess(user.subscriptionTier, 'premiumSuggestions') && (
                  <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">
                    Premium Feature
                  </span>
                )}
              </div>
              
              {!hasFeatureAccess(user.subscriptionTier, 'premiumSuggestions') ? (
                <PremiumCTA 
                  variant="feature-gate"
                  currentTier={user.subscriptionTier}
                  onUpgrade={handleUpgrade}
                  feature="Personalized Activity Suggestions"
                />
              ) : !user.petProfile ? (
                <div className="glass rounded-xl p-6 text-center">
                  <Activity className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Complete Your Pet Profile</h4>
                  <p className="text-text-secondary mb-4">
                    Add your pet's information to get personalized activity suggestions.
                  </p>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="btn-primary"
                  >
                    Complete Profile
                  </button>
                </div>
              ) : loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-text-secondary mt-2">Generating suggestions...</p>
                </div>
              ) : activitySuggestions.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activitySuggestions.map((activity, index) => (
                    <ActivitySuggestionCard
                      key={index}
                      activity={activity}
                      onComplete={handleActivityComplete}
                    />
                  ))}
                </div>
              ) : (
                <div className="glass rounded-xl p-6 text-center">
                  <Activity className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">No Suggestions Yet</h4>
                  <p className="text-text-secondary">
                    Analyze your pet's behavior to get personalized activity suggestions.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
