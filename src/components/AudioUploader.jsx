import React, { useState, useRef } from 'react'
import { Mic, Upload, Play, Pause, Square, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'

const AudioUploader = ({ onAnalyze, disabled }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [uploadedFile, setUploadedFile] = useState(null)
  
  const mediaRecorderRef = useRef(null)
  const audioRef = useRef(null)
  const recordingTimerRef = useRef(null)
  const fileInputRef = useRef(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      const chunks = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunks.push(e.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        setUploadedFile(new File([blob], 'recording.wav', { type: 'audio/wav' }))
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
    } catch (error) {
      toast.error('Could not access microphone')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      clearInterval(recordingTimerRef.current)
    }
  }

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const resetRecording = () => {
    setAudioUrl(null)
    setUploadedFile(null)
    setIsPlaying(false)
    setRecordingTime(0)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('audio/')) {
      setUploadedFile(file)
      const url = URL.createObjectURL(file)
      setAudioUrl(url)
      toast.success('Audio file uploaded successfully')
    } else {
      toast.error('Please upload a valid audio file')
    }
  }

  const handleAnalyze = () => {
    if (uploadedFile) {
      onAnalyze(uploadedFile, 'audio')
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="glass rounded-xl p-6 space-y-6">
      <h2 className="text-xl font-semibold">Audio Analysis</h2>
      
      {/* Recording Section */}
      <div className="space-y-4">
        <div className="text-center">
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={disabled}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 hover:scale-105"
            >
              <Mic className="w-8 h-8 text-white" />
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 flex items-center justify-center transition-all duration-300"
            >
              <Square className="w-8 h-8 text-white" />
            </button>
          )}
          
          <p className="mt-2 text-text-secondary">
            {isRecording ? `Recording: ${formatTime(recordingTime)}` : 'Click to record'}
          </p>
        </div>

        {/* Audio Playback */}
        {audioUrl && (
          <div className="space-y-4">
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={isPlaying ? pauseAudio : playAudio}
                className="btn-secondary flex items-center space-x-2"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              
              <button
                onClick={resetRecording}
                className="btn-secondary flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Section */}
      <div className="relative">
        <div className="text-center text-text-secondary mb-4">OR</div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="w-full btn-secondary flex items-center justify-center space-x-2 py-4"
        >
          <Upload className="w-5 h-5" />
          <span>Upload Audio File</span>
        </button>
      </div>

      {/* Analyze Button */}
      {uploadedFile && (
        <button
          onClick={handleAnalyze}
          disabled={disabled}
          className="w-full btn-primary"
        >
          Analyze Audio
        </button>
      )}
    </div>
  )
}

export default AudioUploader