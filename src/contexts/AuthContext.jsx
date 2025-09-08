import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Mock authentication for demo
  useEffect(() => {
    // Simulate auth check
    const savedUser = localStorage.getItem('wildsound_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (email, password) => {
    // Mock sign in
    const mockUser = {
      id: '1',
      email,
      subscriptionTier: 'free',
      petProfile: null
    }
    localStorage.setItem('wildsound_user', JSON.stringify(mockUser))
    setUser(mockUser)
    return mockUser
  }

  const signUp = async (email, password) => {
    // Mock sign up
    const mockUser = {
      id: '1',
      email,
      subscriptionTier: 'free',
      petProfile: null
    }
    localStorage.setItem('wildsound_user', JSON.stringify(mockUser))
    setUser(mockUser)
    return mockUser
  }

  const signOut = async () => {
    localStorage.removeItem('wildsound_user')
    setUser(null)
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    localStorage.setItem('wildsound_user', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}