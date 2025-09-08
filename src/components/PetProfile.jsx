import React, { useState } from 'react'
import { User, Edit, Save, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const PetProfile = () => {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    petName: user?.petProfile?.petName || '',
    species: user?.petProfile?.species || 'dog',
    breed: user?.petProfile?.breed || '',
    age: user?.petProfile?.age || '',
    temperament: user?.petProfile?.temperament || ''
  })

  const handleSave = () => {
    if (!formData.petName || !formData.breed || !formData.age) {
      toast.error('Please fill in all required fields')
      return
    }

    updateUser({
      petProfile: {
        petProfileId: Date.now(),
        ...formData
      }
    })

    setIsEditing(false)
    toast.success('Pet profile updated successfully!')
  }

  const handleCancel = () => {
    setFormData({
      petName: user?.petProfile?.petName || '',
      species: user?.petProfile?.species || 'dog',
      breed: user?.petProfile?.breed || '',
      age: user?.petProfile?.age || '',
      temperament: user?.petProfile?.temperament || ''
    })
    setIsEditing(false)
  }

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center space-x-2">
          <User className="w-5 h-5 text-primary" />
          <span>Pet Profile</span>
        </h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="btn-secondary flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      {!user?.petProfile && !isEditing ? (
        <div className="text-center py-8">
          <User className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
          <h4 className="text-lg font-semibold mb-2">No Pet Profile Yet</h4>
          <p className="text-text-secondary mb-4">
            Create a profile for your pet to get personalized insights and recommendations.
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary"
          >
            Create Pet Profile
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Pet Name *
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.petName}
                onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                placeholder="Enter your pet's name"
              />
            ) : (
              <p className="text-lg font-medium">{user?.petProfile?.petName || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Species *
            </label>
            {isEditing ? (
              <select
                value={formData.species}
                onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
              >
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <p className="text-lg font-medium capitalize">
                {user?.petProfile?.species || 'Not set'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Breed *
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                placeholder="Enter breed"
              />
            ) : (
              <p className="text-lg font-medium">{user?.petProfile?.breed || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Age *
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                placeholder="e.g., 2 years"
              />
            ) : (
              <p className="text-lg font-medium">{user?.petProfile?.age || 'Not set'}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Temperament
            </label>
            {isEditing ? (
              <textarea
                value={formData.temperament}
                onChange={(e) => setFormData({ ...formData, temperament: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                placeholder="Describe your pet's personality and temperament"
              />
            ) : (
              <p className="text-text-secondary">
                {user?.petProfile?.temperament || 'Not set'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PetProfile