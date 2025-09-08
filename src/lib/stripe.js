// Stripe integration for subscription payments
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!STRIPE_PUBLISHABLE_KEY) {
  console.warn('Stripe publishable key not found. Payment features will be disabled.')
}

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      '3 analyses per month',
      'Basic vocalization analysis',
      'Limited activity suggestions'
    ],
    limits: {
      analysesPerMonth: 3,
      bodyLanguageAnalysis: false,
      premiumSuggestions: false
    }
  },
  BASIC: {
    id: 'basic',
    name: 'Basic',
    price: 5,
    priceId: 'price_basic_monthly', // Replace with actual Stripe price ID
    features: [
      '50 analyses per month',
      'Full vocalization analysis',
      'Basic body language analysis',
      'Personalized activity suggestions',
      'Analysis history'
    ],
    limits: {
      analysesPerMonth: 50,
      bodyLanguageAnalysis: true,
      premiumSuggestions: true
    }
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 15,
    priceId: 'price_premium_monthly', // Replace with actual Stripe price ID
    features: [
      'Unlimited analyses',
      'Advanced vocalization analysis',
      'Full body language analysis',
      'AI-powered activity plans',
      'Priority support',
      'Export analysis reports',
      'Multiple pet profiles'
    ],
    limits: {
      analysesPerMonth: -1, // Unlimited
      bodyLanguageAnalysis: true,
      premiumSuggestions: true,
      multiplePets: true,
      exportReports: true
    }
  }
}

/**
 * Initialize Stripe (would typically load Stripe.js)
 * @returns {Promise<Object>} Stripe instance
 */
export const initializeStripe = async () => {
  if (!STRIPE_PUBLISHABLE_KEY) {
    throw new Error('Stripe publishable key not configured')
  }

  // In a real implementation, you would load Stripe.js here
  // const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY)
  // return stripe
  
  // Mock implementation for demo
  return {
    redirectToCheckout: async ({ sessionId }) => {
      console.log('Redirecting to Stripe checkout with session:', sessionId)
      // In real implementation, this would redirect to Stripe
      return { error: null }
    }
  }
}

/**
 * Create a Stripe checkout session
 * @param {string} priceId - Stripe price ID
 * @param {string} userId - User ID
 * @param {string} successUrl - Success redirect URL
 * @param {string} cancelUrl - Cancel redirect URL
 * @returns {Promise<Object>} Checkout session
 */
export const createCheckoutSession = async (priceId, userId, successUrl, cancelUrl) => {
  if (!STRIPE_PUBLISHABLE_KEY) {
    throw new Error('Stripe not configured')
  }

  // In a real implementation, this would call your backend API
  // which would create a Stripe checkout session
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      priceId,
      userId,
      successUrl,
      cancelUrl
    })
  })

  if (!response.ok) {
    throw new Error('Failed to create checkout session')
  }

  return response.json()
}

/**
 * Create a customer portal session for managing subscriptions
 * @param {string} customerId - Stripe customer ID
 * @param {string} returnUrl - Return URL after managing subscription
 * @returns {Promise<Object>} Portal session
 */
export const createPortalSession = async (customerId, returnUrl) => {
  if (!STRIPE_PUBLISHABLE_KEY) {
    throw new Error('Stripe not configured')
  }

  // In a real implementation, this would call your backend API
  const response = await fetch('/api/create-portal-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerId,
      returnUrl
    })
  })

  if (!response.ok) {
    throw new Error('Failed to create portal session')
  }

  return response.json()
}

/**
 * Check if user has access to a feature based on their subscription
 * @param {string} subscriptionTier - User's subscription tier
 * @param {string} feature - Feature to check
 * @returns {boolean} Whether user has access
 */
export const hasFeatureAccess = (subscriptionTier, feature) => {
  const plan = SUBSCRIPTION_PLANS[subscriptionTier?.toUpperCase()] || SUBSCRIPTION_PLANS.FREE
  
  switch (feature) {
    case 'bodyLanguageAnalysis':
      return plan.limits.bodyLanguageAnalysis
    case 'premiumSuggestions':
      return plan.limits.premiumSuggestions
    case 'multiplePets':
      return plan.limits.multiplePets
    case 'exportReports':
      return plan.limits.exportReports
    default:
      return true
  }
}

/**
 * Check if user has reached their analysis limit
 * @param {string} subscriptionTier - User's subscription tier
 * @param {number} currentUsage - Current month's usage
 * @returns {boolean} Whether user has reached limit
 */
export const hasReachedAnalysisLimit = (subscriptionTier, currentUsage) => {
  const plan = SUBSCRIPTION_PLANS[subscriptionTier?.toUpperCase()] || SUBSCRIPTION_PLANS.FREE
  
  if (plan.limits.analysesPerMonth === -1) {
    return false // Unlimited
  }
  
  return currentUsage >= plan.limits.analysesPerMonth
}

/**
 * Get remaining analyses for the current month
 * @param {string} subscriptionTier - User's subscription tier
 * @param {number} currentUsage - Current month's usage
 * @returns {number} Remaining analyses (-1 for unlimited)
 */
export const getRemainingAnalyses = (subscriptionTier, currentUsage) => {
  const plan = SUBSCRIPTION_PLANS[subscriptionTier?.toUpperCase()] || SUBSCRIPTION_PLANS.FREE
  
  if (plan.limits.analysesPerMonth === -1) {
    return -1 // Unlimited
  }
  
  return Math.max(0, plan.limits.analysesPerMonth - currentUsage)
}
