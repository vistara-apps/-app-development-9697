// OpenAI API integration for pet behavior analysis
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

if (!OPENAI_API_KEY) {
  console.warn('OpenAI API key not found. Using mock analysis.')
}

/**
 * Analyze pet vocalization using OpenAI GPT-4
 * @param {string} audioDescription - Description of the audio or base64 data
 * @param {Object} petProfile - Pet profile information
 * @returns {Promise<Object>} Analysis result
 */
export const analyzeVocalization = async (audioDescription, petProfile = {}) => {
  if (!OPENAI_API_KEY) {
    return getMockAnalysis('audio', petProfile)
  }

  const prompt = `
    You are a professional pet behavior analyst. Analyze the following pet vocalization and provide insights.
    
    Pet Information:
    - Species: ${petProfile.species || 'Unknown'}
    - Breed: ${petProfile.breed || 'Unknown'}
    - Age: ${petProfile.age || 'Unknown'}
    - Temperament: ${petProfile.temperament || 'Unknown'}
    
    Audio Description: ${audioDescription}
    
    Please provide a JSON response with the following structure:
    {
      "emotion": "Primary emotion (Happy, Anxious, Excited, Calm, etc.)",
      "confidence": "Confidence score 1-100",
      "intent": "Likely intent (Greeting, Food Request, Attention Seeking, etc.)",
      "urgency": "Urgency level (Low, Medium, High)",
      "description": "Detailed explanation of the vocalization",
      "suggestions": ["Array of 3-5 actionable suggestions for the pet owner"]
    }
  `

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert pet behavior analyst. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const analysisText = data.choices[0].message.content
    
    // Parse JSON response
    const analysis = JSON.parse(analysisText)
    
    return {
      ...analysis,
      type: 'audio',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('OpenAI analysis error:', error)
    return getMockAnalysis('audio', petProfile)
  }
}

/**
 * Analyze pet body language using OpenAI GPT-4 Vision
 * @param {string} videoDescription - Description of the video or image data
 * @param {Object} petProfile - Pet profile information
 * @returns {Promise<Object>} Analysis result
 */
export const analyzeBodyLanguage = async (videoDescription, petProfile = {}) => {
  if (!OPENAI_API_KEY) {
    return getMockAnalysis('video', petProfile)
  }

  const prompt = `
    You are a professional pet behavior analyst specializing in body language interpretation.
    
    Pet Information:
    - Species: ${petProfile.species || 'Unknown'}
    - Breed: ${petProfile.breed || 'Unknown'}
    - Age: ${petProfile.age || 'Unknown'}
    - Temperament: ${petProfile.temperament || 'Unknown'}
    
    Video/Image Description: ${videoDescription}
    
    Please analyze the pet's body language and provide a JSON response with:
    {
      "emotion": "Primary emotion based on body language",
      "confidence": "Confidence score 1-100",
      "intent": "Likely intent or message",
      "urgency": "Urgency level (Low, Medium, High)",
      "description": "Detailed explanation of body language cues",
      "suggestions": ["Array of 3-5 actionable suggestions based on the body language"]
    }
  `

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert pet body language analyst. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const analysisText = data.choices[0].message.content
    
    const analysis = JSON.parse(analysisText)
    
    return {
      ...analysis,
      type: 'video',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('OpenAI analysis error:', error)
    return getMockAnalysis('video', petProfile)
  }
}

/**
 * Generate activity suggestions based on pet profile and analysis history
 * @param {Object} petProfile - Pet profile information
 * @param {Array} recentAnalyses - Recent analysis results
 * @returns {Promise<Array>} Activity suggestions
 */
export const generateActivitySuggestions = async (petProfile, recentAnalyses = []) => {
  if (!OPENAI_API_KEY) {
    return getMockActivitySuggestions(petProfile)
  }

  const prompt = `
    Generate personalized activity suggestions for a pet based on their profile and recent behavior analysis.
    
    Pet Profile:
    - Species: ${petProfile.species || 'Unknown'}
    - Breed: ${petProfile.breed || 'Unknown'}
    - Age: ${petProfile.age || 'Unknown'}
    - Temperament: ${petProfile.temperament || 'Unknown'}
    
    Recent Behavior Patterns: ${JSON.stringify(recentAnalyses.slice(0, 5))}
    
    Please provide a JSON array of 5-7 activity suggestions with this structure:
    [
      {
        "title": "Activity name",
        "description": "Brief description",
        "duration": "Estimated time",
        "difficulty": "Easy/Medium/Hard",
        "category": "Physical/Mental/Social/Training",
        "benefits": ["Array of benefits"]
      }
    ]
  `

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a pet activity specialist. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 800
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const suggestionsText = data.choices[0].message.content
    
    return JSON.parse(suggestionsText)
  } catch (error) {
    console.error('OpenAI suggestions error:', error)
    return getMockActivitySuggestions(petProfile)
  }
}

// Mock analysis functions for fallback
const getMockAnalysis = (type, petProfile) => {
  const emotions = ['Happy', 'Excited', 'Calm', 'Anxious', 'Playful', 'Alert']
  const intents = type === 'audio' 
    ? ['Greeting', 'Food Request', 'Attention Seeking', 'Play Invitation', 'Warning']
    : ['Play Invitation', 'Attention Seeking', 'Relaxed State', 'Alert Behavior', 'Submission']
  
  return {
    type,
    emotion: emotions[Math.floor(Math.random() * emotions.length)],
    confidence: Math.floor(Math.random() * 20) + 80,
    intent: intents[Math.floor(Math.random() * intents.length)],
    urgency: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
    description: type === 'audio' 
      ? 'Your pet is expressing a clear emotional state through their vocalization. The tone and pattern suggest they are trying to communicate a specific need or feeling.'
      : 'Your pet\'s body language indicates their current emotional state and intentions. Their posture and movements provide valuable insights into their mood.',
    suggestions: [
      'Engage in interactive play for 10-15 minutes',
      'Provide mental stimulation with puzzle toys',
      'Consider a short training session with treats',
      'Ensure fresh water and comfortable environment',
      'Monitor for any changes in behavior patterns'
    ],
    timestamp: new Date().toISOString()
  }
}

const getMockActivitySuggestions = (petProfile) => {
  return [
    {
      title: 'Interactive Puzzle Feeding',
      description: 'Use puzzle feeders to make mealtime mentally stimulating',
      duration: '15-20 minutes',
      difficulty: 'Easy',
      category: 'Mental',
      benefits: ['Mental stimulation', 'Slower eating', 'Problem solving']
    },
    {
      title: 'Hide and Seek Training',
      description: 'Teach your pet to find hidden treats around the house',
      duration: '10-15 minutes',
      difficulty: 'Medium',
      category: 'Training',
      benefits: ['Mental exercise', 'Bonding', 'Obedience training']
    },
    {
      title: 'Outdoor Exploration Walk',
      description: 'Take a leisurely walk in a new environment',
      duration: '30-45 minutes',
      difficulty: 'Easy',
      category: 'Physical',
      benefits: ['Exercise', 'Socialization', 'Environmental enrichment']
    }
  ]
}
