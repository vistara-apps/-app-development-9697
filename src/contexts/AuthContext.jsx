import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, TABLES, SUBSCRIPTION_TIERS } from '../lib/supabase'

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

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        if (session?.user) {
          await loadUserProfile(session.user)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        // Fallback to mock for demo
        const savedUser = localStorage.getItem('wildsound_user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (authUser) => {
    try {
      // Get or create user profile
      let { data: profile, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error && error.code === 'PGRST116') {
        // User doesn't exist, create profile
        const newProfile = {
          id: authUser.id,
          email: authUser.email,
          subscription_tier: SUBSCRIPTION_TIERS.FREE,
          analysis_count: 0,
          created_at: new Date().toISOString()
        }

        const { data: createdProfile, error: createError } = await supabase
          .from(TABLES.USERS)
          .insert([newProfile])
          .select()
          .single()

        if (createError) throw createError
        profile = createdProfile
      } else if (error) {
        throw error
      }

      // Get pet profile if exists
      const { data: petProfile } = await supabase
        .from(TABLES.PET_PROFILES)
        .select('*')
        .eq('user_id', authUser.id)
        .single()

      setUser({
        id: profile.id,
        email: profile.email,
        subscriptionTier: profile.subscription_tier,
        analysisCount: profile.analysis_count || 0,
        petProfile: petProfile || null,
        stripeCustomerId: profile.stripe_customer_id
      })
    } catch (error) {
      console.error('Error loading user profile:', error)
      // Fallback to basic user data
      setUser({
        id: authUser.id,
        email: authUser.email,
        subscriptionTier: SUBSCRIPTION_TIERS.FREE,
        analysisCount: 0,
        petProfile: null
      })
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return data.user
    } catch (error) {
      console.error('Sign in error:', error)
      // Fallback to mock for demo
      const mockUser = {
        id: '1',
        email,
        subscriptionTier: 'free',
        analysisCount: 0,
        petProfile: null
      }
      localStorage.setItem('wildsound_user', JSON.stringify(mockUser))
      setUser(mockUser)
      return mockUser
    }
  }

  const signUp = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (error) throw error
      return data.user
    } catch (error) {
      console.error('Sign up error:', error)
      // Fallback to mock for demo
      const mockUser = {
        id: '1',
        email,
        subscriptionTier: 'free',
        analysisCount: 0,
        petProfile: null
      }
      localStorage.setItem('wildsound_user', JSON.stringify(mockUser))
      setUser(mockUser)
      return mockUser
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      localStorage.removeItem('wildsound_user')
      setUser(null)
    }
  }

  const updateUser = async (updates) => {
    try {
      if (user?.id && user.id !== '1') {
        // Update in Supabase
        const { error } = await supabase
          .from(TABLES.USERS)
          .update(updates)
          .eq('id', user.id)

        if (error) throw error
      }

      // Update local state
      const updatedUser = { ...user, ...updates }
      localStorage.setItem('wildsound_user', JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch (error) {
      console.error('Update user error:', error)
      // Fallback to local update
      const updatedUser = { ...user, ...updates }
      localStorage.setItem('wildsound_user', JSON.stringify(updatedUser))
      setUser(updatedUser)
    }
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
