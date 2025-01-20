'use client'

import { motion } from 'framer-motion'

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak'

type TimerCompleteModalProps = {
  completedMode: TimerMode
  pomodorosCompleted: number
  onStartNext: (mode: TimerMode) => void
  onStop: () => void
  isOpen: boolean
  onClose: () => void
}

export default function TimerCompleteModal({ 
  completedMode, 
  pomodorosCompleted,
  onStartNext,
  onStop,
  isOpen,
  onClose
}: TimerCompleteModalProps) {
  if (!isOpen) return null;

  const getNextMode = (): TimerMode => {
    if (completedMode === 'pomodoro') {
      return (pomodorosCompleted % 4 === 0) ? 'longBreak' : 'shortBreak'
    }
    return 'pomodoro'
  }

  const nextMode = getNextMode()
  const messages = {
    pomodoro: 'Work session complete!',
    shortBreak: 'Break time over!',
    longBreak: 'Long break finished!'
  }

  const getNextButtonText = () => {
    if (nextMode === 'pomodoro') {
      return 'Continue Working'
    } else if (nextMode === 'longBreak') {
      return 'Take Long Break'
    } else {
      return 'Take Short Break'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-auto"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-effect rounded-3xl p-8 w-[400px] text-center"
      >
        <h2 className="text-2xl font-light text-white mb-4">
          {messages[completedMode]}
        </h2>
        
        <div className="text-white/50 mb-8">
          {nextMode === 'pomodoro' ? (
            'Ready to focus?'
          ) : nextMode === 'longBreak' ? (
            'Time for a longer break!'
          ) : (
            'Take a short break!'
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onStartNext(nextMode)}
            className="flex-1 px-6 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            {getNextButtonText()}
          </button>
          <button
            onClick={onStop}
            className="flex-1 px-6 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            End Session
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
} 