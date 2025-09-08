import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, Crown, BarChart3, History, Settings } from 'lucide-react'
import PetProfile from '../components/PetProfile'

const DashboardPage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

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
  ]

  const mockHistory = [
    {
      id: 1,
      type: 'audio',
      emotion: 'Happy',
      confidence: 92,
      timestamp: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      type: 'video',
      emotion: 'Playful',
      confidence: 87,
      timestamp: '2024-01-14T15:45:00Z'
    },
    {
      id: 3,
      type: 'audio',
      emotion: 'Anxious',
      confidence: 78,
      timestamp: '2024-01-13T09:15:00Z'
    }
  ]

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
              <button className="btn-primary">
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold mb-4">Total Analyses</h3>
                <div className="text-3xl font-bold text-primary">12</div>
                <p className="text-text-secondary text-sm">This month</p>
              </div>
              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold mb-4">Most Common Emotion</h3>
                <div className="text-3xl font-bold text-green-400">Happy</div>
                <p className="text-text-secondary text-sm">67% of analyses</p>
              </div>
              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold mb-4">Average Confidence</h3>
                <div className="text-3xl font-bold text-blue-400">84%</div>
                <p className="text-text-secondary text-sm">Highly accurate</p>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-6">Analysis History</h3>
              <div className="space-y-4">
                {mockHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-surface rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        item.type === 'audio' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <p className="font-medium capitalize">{item.type} Analysis</p>
                        <p className="text-text-secondary text-sm">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.emotion}</p>
                      <p className="text-text-secondary text-sm">{item.confidence}% confidence</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage