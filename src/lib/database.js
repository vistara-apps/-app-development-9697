import { supabase, TABLES, ANALYSIS_TYPES } from './supabase'

/**
 * Database service for WildSound AI
 * Handles all database operations with fallback to localStorage for demo
 */

// Pet Profile Operations
export const createPetProfile = async (userId, petData) => {
  try {
    const profile = {
      user_id: userId,
      pet_name: petData.petName,
      species: petData.species,
      breed: petData.breed,
      age: petData.age,
      temperament: petData.temperament,
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from(TABLES.PET_PROFILES)
      .insert([profile])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating pet profile:', error)
    // Fallback to localStorage
    const profile = {
      id: Date.now().toString(),
      ...petData,
      userId,
      createdAt: new Date().toISOString()
    }
    localStorage.setItem(`pet_profile_${userId}`, JSON.stringify(profile))
    return profile
  }
}

export const updatePetProfile = async (profileId, updates) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.PET_PROFILES)
      .update(updates)
      .eq('id', profileId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating pet profile:', error)
    // Fallback to localStorage
    const stored = localStorage.getItem(`pet_profile_${profileId}`)
    if (stored) {
      const profile = { ...JSON.parse(stored), ...updates }
      localStorage.setItem(`pet_profile_${profileId}`, JSON.stringify(profile))
      return profile
    }
    throw error
  }
}

export const getPetProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.PET_PROFILES)
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  } catch (error) {
    console.error('Error getting pet profile:', error)
    // Fallback to localStorage
    const stored = localStorage.getItem(`pet_profile_${userId}`)
    return stored ? JSON.parse(stored) : null
  }
}

// Analysis Operations
export const saveAnalysis = async (userId, analysisData) => {
  try {
    const analysis = {
      user_id: userId,
      analysis_type: analysisData.type,
      file_name: analysisData.fileName,
      emotion: analysisData.emotion,
      confidence: analysisData.confidence,
      intent: analysisData.intent,
      urgency: analysisData.urgency,
      description: analysisData.description,
      suggestions: JSON.stringify(analysisData.suggestions),
      created_at: analysisData.timestamp || new Date().toISOString()
    }

    const { data, error } = await supabase
      .from(TABLES.ANALYSES)
      .insert([analysis])
      .select()
      .single()

    if (error) throw error

    // Update user's analysis count
    await incrementAnalysisCount(userId)

    return data
  } catch (error) {
    console.error('Error saving analysis:', error)
    // Fallback to localStorage
    const analysis = {
      id: Date.now().toString(),
      userId,
      ...analysisData,
      createdAt: new Date().toISOString()
    }
    
    const existingAnalyses = getStoredAnalyses(userId)
    existingAnalyses.push(analysis)
    localStorage.setItem(`analyses_${userId}`, JSON.stringify(existingAnalyses))
    
    return analysis
  }
}

export const getUserAnalyses = async (userId, limit = 50) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.ANALYSES)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    
    // Parse suggestions JSON
    return data.map(analysis => ({
      ...analysis,
      suggestions: JSON.parse(analysis.suggestions || '[]')
    }))
  } catch (error) {
    console.error('Error getting user analyses:', error)
    // Fallback to localStorage
    return getStoredAnalyses(userId)
  }
}

export const getAnalysisById = async (analysisId) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.ANALYSES)
      .select('*')
      .eq('id', analysisId)
      .single()

    if (error) throw error
    
    return {
      ...data,
      suggestions: JSON.parse(data.suggestions || '[]')
    }
  } catch (error) {
    console.error('Error getting analysis:', error)
    throw error
  }
}

export const deleteAnalysis = async (analysisId, userId) => {
  try {
    const { error } = await supabase
      .from(TABLES.ANALYSES)
      .delete()
      .eq('id', analysisId)
      .eq('user_id', userId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting analysis:', error)
    // Fallback to localStorage
    const analyses = getStoredAnalyses(userId)
    const filtered = analyses.filter(a => a.id !== analysisId)
    localStorage.setItem(`analyses_${userId}`, JSON.stringify(filtered))
    return true
  }
}

// User Operations
export const incrementAnalysisCount = async (userId) => {
  try {
    const { error } = await supabase.rpc('increment_analysis_count', {
      user_id: userId
    })

    if (error) throw error
  } catch (error) {
    console.error('Error incrementing analysis count:', error)
    // Fallback - update local storage
    const stored = localStorage.getItem('wildsound_user')
    if (stored) {
      const user = JSON.parse(stored)
      user.analysisCount = (user.analysisCount || 0) + 1
      localStorage.setItem('wildsound_user', JSON.stringify(user))
    }
  }
}

export const updateUserSubscription = async (userId, subscriptionTier, stripeCustomerId = null) => {
  try {
    const updates = {
      subscription_tier: subscriptionTier,
      updated_at: new Date().toISOString()
    }

    if (stripeCustomerId) {
      updates.stripe_customer_id = stripeCustomerId
    }

    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating user subscription:', error)
    throw error
  }
}

export const getUserStats = async (userId) => {
  try {
    // Get analysis count for current month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { data: monthlyAnalyses, error: monthlyError } = await supabase
      .from(TABLES.ANALYSES)
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', startOfMonth.toISOString())

    if (monthlyError) throw monthlyError

    // Get total analysis count
    const { data: totalAnalyses, error: totalError } = await supabase
      .from(TABLES.ANALYSES)
      .select('id')
      .eq('user_id', userId)

    if (totalError) throw totalError

    // Get analysis breakdown by type
    const { data: analysisBreakdown, error: breakdownError } = await supabase
      .from(TABLES.ANALYSES)
      .select('analysis_type')
      .eq('user_id', userId)

    if (breakdownError) throw breakdownError

    const breakdown = analysisBreakdown.reduce((acc, analysis) => {
      acc[analysis.analysis_type] = (acc[analysis.analysis_type] || 0) + 1
      return acc
    }, {})

    return {
      monthlyCount: monthlyAnalyses.length,
      totalCount: totalAnalyses.length,
      breakdown
    }
  } catch (error) {
    console.error('Error getting user stats:', error)
    // Fallback to localStorage
    const analyses = getStoredAnalyses(userId)
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const monthlyAnalyses = analyses.filter(a => 
      new Date(a.createdAt || a.timestamp) >= startOfMonth
    )

    const breakdown = analyses.reduce((acc, analysis) => {
      acc[analysis.type] = (acc[analysis.type] || 0) + 1
      return acc
    }, {})

    return {
      monthlyCount: monthlyAnalyses.length,
      totalCount: analyses.length,
      breakdown
    }
  }
}

// File Upload Operations
export const uploadFile = async (file, bucket = 'analyses') => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${bucket}/${fileName}`

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file)

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return {
      path: filePath,
      url: publicUrl,
      fileName: file.name
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    // For demo purposes, return a mock URL
    return {
      path: `mock/${file.name}`,
      url: URL.createObjectURL(file),
      fileName: file.name
    }
  }
}

export const deleteFile = async (filePath, bucket = 'analyses') => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting file:', error)
    return false
  }
}

// Helper functions for localStorage fallback
const getStoredAnalyses = (userId) => {
  const stored = localStorage.getItem(`analyses_${userId}`)
  return stored ? JSON.parse(stored) : []
}

// Database schema creation (for reference)
export const DATABASE_SCHEMA = {
  users: `
    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      subscription_tier VARCHAR(50) DEFAULT 'free',
      analysis_count INTEGER DEFAULT 0,
      stripe_customer_id VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  pet_profiles: `
    CREATE TABLE pet_profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      pet_name VARCHAR(255) NOT NULL,
      species VARCHAR(100) NOT NULL,
      breed VARCHAR(255),
      age VARCHAR(50),
      temperament TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  analyses: `
    CREATE TABLE analyses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      analysis_type VARCHAR(50) NOT NULL,
      file_name VARCHAR(255),
      file_path VARCHAR(500),
      emotion VARCHAR(100),
      confidence INTEGER,
      intent VARCHAR(255),
      urgency VARCHAR(50),
      description TEXT,
      suggestions JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  rpc_functions: `
    CREATE OR REPLACE FUNCTION increment_analysis_count(user_id UUID)
    RETURNS void AS $$
    BEGIN
      UPDATE users 
      SET analysis_count = analysis_count + 1,
          updated_at = NOW()
      WHERE id = user_id;
    END;
    $$ LANGUAGE plpgsql;
  `
}
