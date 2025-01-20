'use client'

import { motion } from 'framer-motion'

type MiniTimerProps = {
  timeLeft: number
  isActive: boolean
  showTime: boolean
  onToggleShowTime: () => void
}

export default function MiniTimer({ timeLeft, isActive, showTime, onToggleShowTime }: MiniTimerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="relative flex flex-col items-center">
      <button
        onClick={onToggleShowTime}
        className="absolute -top-6 left-1/2 -translate-x-1/2 text-white/50 hover:text-white/70 transition-colors"
        title={showTime ? "Hide Timer" : "Show Timer"}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {showTime ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          )}
        </svg>
      </button>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="glass-effect rounded-2xl px-4 py-2 shadow-2xl bg-white/10 text-center w-[100px]"
      >
        <div className="text-2xl font-light text-white tabular-nums flex justify-center items-center h-[36px]">
          {showTime ? formatTime(timeLeft) : (
            <span className="tracking-[0.5em] pl-[0.5em]">···</span>
          )}
        </div>
      </motion.div>
    </div>
  )
} 