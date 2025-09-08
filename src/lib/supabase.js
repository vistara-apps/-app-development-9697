import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Create client with fallback values for build environments
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if we have real credentials
export const hasSupabaseCredentials = () => {
  return import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
}

// Database schema types for TypeScript-like documentation
export const TABLES = {
  USERS: 'users',
  PET_PROFILES: 'pet_profiles', 
  ANALYSES: 'analyses'
}

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  BASIC: 'basic', 
  PREMIUM: 'premium'
}

// Analysis types
export const ANALYSIS_TYPES = {
  AUDIO: 'audio',
  VIDEO: 'video'
}
