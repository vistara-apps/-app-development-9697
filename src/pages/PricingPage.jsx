import React from 'react'
import { Check, X, Star } from 'lucide-react'

const PricingPage = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out WildSound AI',
      features: [
        { name: '3 analyses per month', included: true },
        { name: 'Basic vocalization analysis', included: true },
        { name: 'Email support', included: true },
        { name: 'Advanced body language analysis', included: false },
        { name: 'Unlimited analyses', included: false },
        { name: 'Personalized activity plans', included: false },
        { name: 'Priority support', included: false }
      ],
      popular: false,
      buttonText: 'Get Started',
      buttonClass: 'btn-secondary'
    },
    {
      name: 'Basic',
      price: '$5',
      period: 'per month',
      description: 'Great for regular pet communication insights',
      features: [
        { name: 'Unlimited audio analyses', included: true },
        { name: 'Basic vocalization analysis', included: true },
        { name: 'Email support', included: true },
        { name: 'Analysis history', included: true },
        { name: 'Advanced body language analysis', included: false },
        { name: 'Personalized activity plans', included: false },
        { name: 'Priority support', included: false }
      ],
      popular: false,
      buttonText: 'Start Basic Plan',
      buttonClass: 'btn-primary'
    },
    {
      name: 'Premium',
      price: '$15',
      period: 'per month',
      description: 'Complete pet communication solution',
      features: [
        { name: 'Unlimited analyses', included: true },
        { name: 'Advanced vocalization analysis', included: true },
        { name: 'Advanced body language analysis', included: true },
        { name: 'Personalized activity plans', included: true },
        { name: 'Detailed analytics dashboard', included: true },
        { name: 'Priority support', included: true },
        { name: 'Early access to new features', included: true }
      ],
      popular: true,
      buttonText: 'Start Premium Plan',
      buttonClass: 'btn-primary'
    }
  ]

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Choose Your <span className="gradient-text">Perfect Plan</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Unlock the full potential of pet communication with plans designed for every need
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`glass rounded-xl p-8 relative ${
                plan.popular ? 'border-2 border-primary' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-text-secondary">/{plan.period}</span>
                </div>
                <p className="text-text-secondary">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                    )}
                    <span className={feature.included ? 'text-text-primary' : 'text-text-secondary'}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              <button className={`w-full ${plan.buttonClass}`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {[
              {
                question: 'How accurate is the pet communication analysis?',
                answer: 'Our AI models achieve 80-95% accuracy in emotion detection and behavioral analysis, trained on thousands of hours of pet audio and video data.'
              },
              {
                question: 'Can I cancel my subscription anytime?',
                answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.'
              },
              {
                question: 'What types of pets are supported?',
                answer: 'Currently, we support dogs, cats, and birds. We\'re continuously expanding our AI models to include more species.'
              },
              {
                question: 'Is my pet data secure?',
                answer: 'Absolutely. We use enterprise-grade encryption and never share your pet data with third parties. Your privacy is our priority.'
              }
            ].map((faq, index) => (
              <div key={index} className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-text-secondary leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold mb-4">Ready to understand your pet better?</h2>
          <p className="text-xl text-text-secondary mb-8">
            Join thousands of pet parents who are already deepening their bond with their furry friends.
          </p>
          <button className="btn-primary text-lg px-8 py-4">
            Start Your Free Trial
          </button>
        </div>
      </div>
    </div>
  )
}

export default PricingPage