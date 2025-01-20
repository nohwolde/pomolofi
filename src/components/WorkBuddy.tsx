'use client'

import { useState } from 'react'

type BuddyMood = 'focused' | 'break' | 'celebrating'

export default function WorkBuddy() {
  const [mood, setMood] = useState<BuddyMood>('focused')
  
  return (
    <div className="absolute bottom-8 left-8 z-20">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
        <div className="character-container h-32 w-32">
          {/* Add your character animation here */}
        </div>
        <div className="mt-2 text-white text-center">
          {mood === 'focused' && "Let's focus together! 💪"}
          {mood === 'break' && "Time for a break! ☕"}
          {mood === 'celebrating' && "Great job! 🎉"}
        </div>
      </div>
    </div>
  )
} 