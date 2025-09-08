import React from 'react'
import { Crown, Zap, ArrowRight, Check, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { SUBSCRIPTION_PLANS } from '../lib/stripe'

const PremiumCTA = ({ 
  variant = 'default',
  currentTier = 'free',
  onUpgrade,
  feature,
  className = ''
}) => {
  const getCurrentPlan = () => SUBSCRIPTION_PLANS[currentTier?.toUpperCase()] || SUBSCRIPTION_PLANS.FREE
  const getTargetPlan = () => {
    if (currentTier === 'free') return SUBSCRIPTION_PLANS.BASIC
    return SUBSCRIPTION_PLANS.PREMIUM
  }

  const currentPlan = getCurrentPlan()
  const targetPlan = getTargetPlan()

  // Feature-specific CTA
  if (variant === 'feature-gate') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`
          relative overflow-hidden rounded-xl p-6 text-center
          bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5
          border border-primary/20 ${className}
        `}
      >
        <div className="relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
            <Crown className="w-8 h-8 text-primary" />
          </div>
          
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Premium Feature
          </h3>
          
          <p className="text-text-secondary mb-4">
            {feature ? `${feature} is available in our premium plans` : 'This feature requires a premium subscription'}
          </p>
          
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="text-center">
              <div className="text-sm text-text-secondary">Current</div>
              <div className="font-semibold text-text-primary">{currentPlan.name}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-accent" />
            <div className="text-center">
              <div className="text-sm text-text-secondary">Upgrade to</div>
              <div className="font-semibold text-primary">{targetPlan.name}</div>
            </div>
          </div>
          
          <button
            onClick={() => onUpgrade?.(targetPlan.id)}
            className="
              w-full px-6 py-3 bg-gradient-to-r from-primary to-accent
              text-white font-semibold rounded-lg hover:shadow-lg
              transition-all duration-200 transform hover:scale-105
            "
          >
            Upgrade for ${targetPlan.price}/month
          </button>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      </motion.div>
    )
  }

  // Comparison CTA
  if (variant === 'comparison') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          relative overflow-hidden rounded-xl p-6
          bg-gradient-to-br from-surface to-surface/80
          border border-accent/20 ${className}
        `}
      >
        <div className="text-center mb-6">
          <Crown className="w-12 h-12 text-primary mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-text-primary mb-2">
            Unlock Premium Features
          </h3>
          <p className="text-text-secondary">
            Get the most out of WildSound AI with advanced analysis and unlimited access
          </p>
        </div>

        {/* Feature comparison */}
        <div className="space-y-3 mb-6">
          {[
            { feature: 'Monthly Analyses', free: '3', premium: 'Unlimited' },
            { feature: 'Body Language Analysis', free: false, premium: true },
            { feature: 'Advanced AI Insights', free: false, premium: true },
            { feature: 'Activity Recommendations', free: 'Basic', premium: 'Personalized' },
            { feature: 'Analysis History', free: false, premium: true },
            { feature: 'Multiple Pet Profiles', free: false, premium: true }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <span className="text-text-secondary text-sm">{item.feature}</span>
              <div className="flex items-center space-x-4">
                <div className="text-center min-w-[60px]">
                  {typeof item.free === 'boolean' ? (
                    item.free ? (
                      <Check className="w-4 h-4 text-green-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-red-400 mx-auto" />
                    )
                  ) : (
                    <span className="text-xs text-text-secondary">{item.free}</span>
                  )}
                </div>
                <div className="text-center min-w-[60px]">
                  {typeof item.premium === 'boolean' ? (
                    item.premium ? (
                      <Check className="w-4 h-4 text-primary mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-red-400 mx-auto" />
                    )
                  ) : (
                    <span className="text-xs text-primary font-medium">{item.premium}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => onUpgrade?.(SUBSCRIPTION_PLANS.BASIC.id)}
            className="
              flex-1 px-4 py-3 bg-accent hover:bg-accent/80
              text-white font-semibold rounded-lg transition-colors duration-200
            "
          >
            Basic - ${SUBSCRIPTION_PLANS.BASIC.price}/mo
          </button>
          <button
            onClick={() => onUpgrade?.(SUBSCRIPTION_PLANS.PREMIUM.id)}
            className="
              flex-1 px-4 py-3 bg-gradient-to-r from-primary to-accent
              text-white font-semibold rounded-lg hover:shadow-lg
              transition-all duration-200 transform hover:scale-105
            "
          >
            Premium - ${SUBSCRIPTION_PLANS.PREMIUM.price}/mo
          </button>
        </div>
      </motion.div>
    )
  }

  // Default CTA
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative overflow-hidden rounded-xl p-6 text-center
        bg-gradient-to-br from-primary/10 to-accent/10
        border border-primary/20 ${className}
      `}
    >
      <div className="relative z-10">
        <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
        
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          Ready for More?
        </h3>
        
        <p className="text-text-secondary mb-4">
          Upgrade to unlock unlimited analyses, advanced features, and personalized insights for your pet.
        </p>
        
        <div className="flex items-center justify-center space-x-2 mb-4">
          <span className="text-2xl font-bold text-primary">${targetPlan.price}</span>
          <span className="text-text-secondary">/month</span>
        </div>
        
        <button
          onClick={() => onUpgrade?.(targetPlan.id)}
          className="
            px-6 py-3 bg-gradient-to-r from-primary to-accent
            text-white font-semibold rounded-lg hover:shadow-lg
            transition-all duration-200 transform hover:scale-105
            flex items-center justify-center space-x-2 mx-auto
          "
        >
          <span>Upgrade Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full translate-y-12 -translate-x-12" />
    </motion.div>
  )
}

export default PremiumCTA
