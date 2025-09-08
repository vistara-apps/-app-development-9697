import React from 'react'
import { Link } from 'react-router-dom'
import { Play, Mic, Video, Activity, Star, Check } from 'lucide-react'
import { motion } from 'framer-motion'

const HomePage = () => {
  const features = [
    {
      icon: Mic,
      title: 'Vocalization Analysis',
      description: 'Upload audio clips and get instant insights into your pet\'s emotional state and needs.'
    },
    {
      icon: Video,
      title: 'Body Language Decoder',
      description: 'Analyze video clips to understand your pet\'s physical cues and body language.'
    },
    {
      icon: Activity,
      title: 'Activity Suggestions',
      description: 'Get personalized activity recommendations based on your pet\'s breed, age, and behavior.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      text: 'Finally understand why my cat meows at 3 AM! This app has transformed our relationship.',
      rating: 5
    },
    {
      name: 'Mike Chen',
      text: 'Amazing accuracy in detecting my dog\'s different barks. Now I know when he\'s anxious vs excited.',
      rating: 5
    },
    {
      name: 'Emma Davis',
      text: 'The activity suggestions are spot-on for my Golden Retriever. Highly recommended!',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            >
              Understand your pet's every{' '}
              <span className="gradient-text">bark and meow</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              AI-powered pet communication platform that helps you interpret your pet's 
              vocalizations and body language to better understand their needs and emotions.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/analyze" className="btn-primary flex items-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Start Analyzing</span>
              </Link>
              <Link to="/pricing" className="btn-secondary">
                View Pricing
              </Link>
            </motion.div>
          </div>

          {/* Demo Video/Image Placeholder */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 relative"
          >
            <div className="glass rounded-xl p-8 max-w-4xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="flex-1">
                  <div className="glass rounded-lg p-6 bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Mic className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Audio Analysis</h3>
                        <p className="text-sm text-text-secondary">Recording: Bark #1</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gradient-to-r from-primary to-purple-600 rounded-full"></div>
                      <div className="text-sm text-text-secondary">Analyzing vocal patterns...</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="glass rounded-lg p-6">
                    <h3 className="font-semibold mb-4">Analysis Results</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Emotion:</span>
                        <span className="text-green-400 font-medium">Happy (92%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Intent:</span>
                        <span className="text-blue-400 font-medium">Greeting</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Urgency:</span>
                        <span className="text-yellow-400 font-medium">Low</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features for Pet Parents</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Everything you need to build a deeper connection with your furry friend
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-xl p-6 hover:shadow-glass transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Loved by Pet Parents Worldwide</h2>
            <p className="text-xl text-text-secondary">See what our users are saying</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-xl p-6"
              >
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-text-secondary mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to understand your pet better?</h2>
          <p className="text-xl text-text-secondary mb-8">
            Join thousands of pet parents who are already deepening their bond with their furry friends.
          </p>
          <Link to="/analyze" className="btn-primary text-lg px-8 py-4">
            Start Your Free Trial
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage