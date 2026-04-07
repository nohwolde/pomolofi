'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function DemoTimer() {
  const [displayTime, setDisplayTime] = useState(25 * 60) // 25 minutes in seconds
  const [isAnimating, setIsAnimating] = useState(true)

  // Simulate timer countdown for demo purposes
  useEffect(() => {
    if (!isAnimating) return
    
    const interval = setInterval(() => {
      setDisplayTime(prev => {
        if (prev <= 0) return 25 * 60
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isAnimating])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Timer Panel */}
      <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-2xl">
        {/* Pomodoro Progress */}
        <motion.div 
          className="flex flex-col items-center gap-2 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-2">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <div className="text-xl">🍅</div>
              <div className="absolute inset-0 -z-10 bg-white/20 blur-sm rounded-full scale-150" />
              <div className="absolute inset-0 -z-20 bg-white/10 blur-md rounded-full scale-200" />
            </motion.div>
            <div className="text-sm text-white/70 font-light">
              2/4
            </div>
          </div>

          <div className="text-sm text-white/50 font-light flex items-center gap-1.5">
            <span>Next:</span>
            <span className="opacity-60">☕️</span>
          </div>
        </motion.div>

        {/* Timer Display */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl px-6 py-3 mb-4
            bg-black/20 backdrop-blur-md
            border border-white/20 
            shadow-[0_0_15px_rgba(0,0,0,0.5)] 
            text-center"
        >
          <div className="text-4xl font-light text-white tabular-nums">
            {formatTime(displayTime)}
          </div>
        </motion.div>
        
        {/* Timer Controls */}
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className="w-14 h-14 rounded-full 
              flex items-center justify-center 
              backdrop-blur-sm border border-white/10
              shadow-[0_0_10px_rgba(0,0,0,0.3)]
              transition-all duration-300
              bg-black/20 text-white hover:bg-white/20
              cursor-pointer"
          >
            <svg className="w-7 h-7 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isAnimating ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              )}
            </svg>
          </button>
          <button
            className="w-14 h-14 rounded-full 
              flex items-center justify-center 
              backdrop-blur-sm border border-white/10
              shadow-[0_0_10px_rgba(0,0,0,0.3)]
              transition-all duration-300
              bg-black/10 text-white hover:bg-white/20
              cursor-pointer"
          >
            <svg className="w-7 h-7 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mode Selector Preview */}
      <div className="glass-effect rounded-2xl p-4 flex gap-2">
        <div className="px-4 py-2 rounded-lg bg-white/20 text-white text-sm">
          Pomodoro
        </div>
        <div className="px-4 py-2 rounded-lg text-white/50 hover:text-white/70 text-sm cursor-pointer transition-colors">
          Short Break
        </div>
        <div className="px-4 py-2 rounded-lg text-white/50 hover:text-white/70 text-sm cursor-pointer transition-colors">
          Long Break
        </div>
      </div>
    </div>
  )
}
