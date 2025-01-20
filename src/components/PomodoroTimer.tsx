'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

type TimerMode = 'work' | 'break'

export default function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const resetTimer = useCallback(() => {
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60)
    setIsActive(false)
  }, [mode])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
    }

    return () => clearInterval(interval)
  }, [isActive, timeLeft])

  return (
    <div className="fixed top-6 left-6 glass-effect rounded-2xl p-4 min-w-[200px]">
      <div className="text-4xl font-light text-white/90 text-center tabular-nums">
        {formatTime(timeLeft)}
      </div>
      
      <div className="mt-4 flex gap-2 text-sm">
        <button
          onClick={() => {
            setMode('work')
            setTimeLeft(25 * 60)
            setIsActive(false)
          }}
          className={`px-4 py-1.5 rounded-lg transition-colors ${
            mode === 'work' 
              ? 'bg-white/20 text-white' 
              : 'text-white/50 hover:text-white'
          }`}
        >
          Work
        </button>
        <button
          onClick={() => {
            setMode('break')
            setTimeLeft(5 * 60)
            setIsActive(false)
          }}
          className={`px-4 py-1.5 rounded-lg transition-colors ${
            mode === 'break'
              ? 'bg-white/20 text-white'
              : 'text-white/50 hover:text-white'
          }`}
        >
          Break
        </button>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setIsActive(!isActive)}
          className="flex-1 py-1.5 rounded-lg text-sm text-white/90 hover:bg-white/10 transition-colors"
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="w-12 py-1.5 rounded-lg text-sm text-white/50 hover:bg-white/10 transition-colors"
        >
          ↺
        </button>
      </div>
    </div>
  )
} 