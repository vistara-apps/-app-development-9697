import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
