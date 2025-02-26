'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak'

const DEFAULT_DURATIONS = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15
}

// Get saved durations from localStorage or use defaults
const getSavedDurations = () => {
  if (typeof window === 'undefined') return DEFAULT_DURATIONS
  
  const saved = localStorage.getItem('timerDurations')
  return saved ? JSON.parse(saved) : DEFAULT_DURATIONS
}

type TimerModalProps = {
  onClose: () => void
  onStart: (mode: TimerMode, duration: number) => void
  currentMode: TimerMode
  onDurationsChange: (durations: { pomodoro: number; shortBreak: number; longBreak: number }) => void
}

export default function TimerModal({ onClose, onStart, currentMode, onDurationsChange }: TimerModalProps) {
  const [mode, setMode] = useState<TimerMode>(currentMode)
  const [customDurations, setCustomDurations] = useState(getSavedDurations())
  const [duration, setDuration] = useState(customDurations[currentMode])

  // Save durations to localStorage when they change
  useEffect(() => {
    localStorage.setItem('timerDurations', JSON.stringify(customDurations))
  }, [customDurations])

  // Update parent when durations change
  useEffect(() => {
    onDurationsChange(customDurations)
  }, [customDurations, onDurationsChange])

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode)
    setDuration(customDurations[newMode])
  }

  const handleDurationChange = (newDuration: number) => {
    const validDuration = Math.max(1, Math.min(60, newDuration))
    setDuration(validDuration)
    setCustomDurations((prev: any) => ({
      ...prev,
      [mode]: validDuration
    }))
  }

  const handleReset = () => {
    setCustomDurations(DEFAULT_DURATIONS)
    setDuration(DEFAULT_DURATIONS[mode])
  }

  const handleStart = () => {
    onStart(mode, duration * 60) // Convert minutes to seconds
  }

  const isDifferentFromDefault = JSON.stringify(customDurations) !== JSON.stringify(DEFAULT_DURATIONS)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-effect rounded-3xl p-8 w-[400px] text-center"
      >
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => handleModeChange('pomodoro')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              mode === 'pomodoro' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/70'
            }`}
          >
            Pomodoro
          </button>
          <button
            onClick={() => handleModeChange('shortBreak')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              mode === 'shortBreak' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/70'
            }`}
          >
            Short Break
          </button>
          <button
            onClick={() => handleModeChange('longBreak')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              mode === 'longBreak' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/70'
            }`}
          >
            Long Break
          </button>
        </div>

        <div className="mb-8">
          <div className="relative text-center mb-4">
            <div className="text-sm text-white/50 uppercase tracking-wider">Duration (minutes)</div>
            {isDifferentFromDefault && (
              <button
                onClick={handleReset}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-sm text-white/50 hover:text-white transition-colors"
              >
                Reset
              </button>
            )}
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handleDurationChange(duration - 5)}
              className="w-10 h-10 rounded-full glass-effect flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10"
            >
              -
            </button>
            <input
              type="number"
              value={duration}
              onChange={(e) => handleDurationChange(parseInt(e.target.value) || DEFAULT_DURATIONS[mode])}
              className="w-20 bg-transparent text-center text-4xl font-light text-white focus:outline-none"
              min="1"
              max="60"
            />
            <button
              onClick={() => handleDurationChange(duration + 5)}
              className="w-10 h-10 rounded-full glass-effect flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="px-16 py-3 text-xl font-medium rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors uppercase tracking-widest"
        >
          Start
        </button>
      </motion.div>
    </motion.div>
  )
} 