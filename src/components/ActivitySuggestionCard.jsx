import React from 'react'
import { Clock, Target, Star, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const ActivitySuggestionCard = ({ 
  activity, 
  variant = 'default',
  onComplete,
  isCompleted = false 
}) => {
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'physical':
        return '🏃'
      case 'mental':
        return '🧠'
      case 'social':
        return '👥'
      case 'training':
        return '🎯'
      default:
        return '🎮'
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-green-400 bg-green-400/10'
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/10'
      case 'hard':
        return 'text-red-400 bg-red-400/10'
      default:
        return 'text-blue-400 bg-blue-400/10'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`
        relative overflow-hidden rounded-xl p-6 transition-all duration-300
        ${variant === 'default' 
          ? 'bg-surface border border-white/10 hover:border-accent/30' 
          : 'bg-gradient-to-br from-surface to-surface/80 border border-accent/20'
        }
        ${isCompleted ? 'opacity-75' : ''}
      `}
    >
      {/* Completion indicator */}
      {isCompleted && (
        <div className="absolute top-4 right-4">
          <CheckCircle className="w-5 h-5 text-green-400" />
        </div>
      )}

      {/* Category icon and difficulty */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getCategoryIcon(activity.category)}</span>
          <span className="text-sm text-text-secondary capitalize">
            {activity.category || 'Activity'}
          </span>
        </div>
        
        <span className={`
          px-2 py-1 rounded-full text-xs font-medium
          ${getDifficultyColor(activity.difficulty)}
        `}>
          {activity.difficulty || 'Easy'}
        </span>
      </div>

      {/* Title and description */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          {activity.title}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {activity.description}
        </p>
      </div>

      {/* Duration */}
      {activity.duration && (
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-4 h-4 text-accent" />
          <span className="text-sm text-text-secondary">
            {activity.duration}
          </span>
        </div>
      )}

      {/* Benefits */}
      {activity.benefits && activity.benefits.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-text-primary mb-2 flex items-center">
            <Star className="w-4 h-4 text-primary mr-1" />
            Benefits
          </h4>
          <div className="flex flex-wrap gap-1">
            {activity.benefits.slice(0, 3).map((benefit, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
              >
                {benefit}
              </span>
            ))}
            {activity.benefits.length > 3 && (
              <span className="px-2 py-1 bg-white/5 text-text-secondary text-xs rounded-full">
                +{activity.benefits.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-accent" />
          <span className="text-xs text-text-secondary">
            {activity.category} Activity
          </span>
        </div>
        
        {onComplete && !isCompleted && (
          <button
            onClick={() => onComplete(activity)}
            className="
              px-3 py-1.5 bg-accent hover:bg-accent/80 text-white text-sm 
              rounded-lg transition-colors duration-200 font-medium
            "
          >
            Try It
          </button>
        )}
        
        {isCompleted && (
          <span className="text-xs text-green-400 font-medium">
            Completed ✓
          </span>
        )}
      </div>

      {/* Hover effect overlay */}
      <div className="
        absolute inset-0 bg-gradient-to-r from-accent/5 to-primary/5 
        opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none
      " />
    </motion.div>
  )
}

export default ActivitySuggestionCard
