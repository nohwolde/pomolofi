'use client'

import { AnimatePresence } from 'framer-motion'
import MiniTimer from './MiniTimer'

type SideControlsProps = {
  onTimerClick: () => void
  onTaskClick: () => void
  onTasksExpandClick: () => void
  isTimerActive: boolean
  isTimerPaused: boolean
  onTimerToggle: () => void
  onTimerStop: () => void
  timeLeft: number
  showTime: boolean
  onToggleShowTime: () => void
}

export default function SideControls({ 
  onTimerClick, 
  onTaskClick, 
  onTasksExpandClick,
  isTimerActive,
  isTimerPaused,
  onTimerToggle,
  onTimerStop,
  timeLeft,
  showTime,
  onToggleShowTime
}: SideControlsProps) {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-3">
        <AnimatePresence>
          {isTimerActive && (
            <MiniTimer 
              timeLeft={timeLeft} 
              isActive={!isTimerPaused} 
              showTime={showTime}
              onToggleShowTime={onToggleShowTime}
            />
          )}
        </AnimatePresence>
        {isTimerActive ? (
          <div className="flex flex-col gap-2">
            <button
              onClick={onTimerToggle}
              className="w-14 h-14 rounded-full glass-effect flex items-center justify-center text-white hover:text-white hover:bg-white/15 transition-all shadow-2xl bg-white/20"
              title={isTimerPaused ? "Resume Timer" : "Pause Timer"}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isTimerPaused ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
            </button>
            <button
              onClick={onTimerStop}
              className="w-14 h-14 rounded-full glass-effect flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-all shadow-2xl bg-white/10"
              title="Stop Timer"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={onTimerClick}
            className="w-14 h-14 rounded-full glass-effect flex items-center justify-center text-white hover:text-white hover:bg-white/15 transition-all shadow-2xl bg-white/10"
            title="Start Timer"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}
      </div>

      <button
        onClick={onTaskClick}
        className="w-14 h-14 rounded-full glass-effect flex items-center justify-center text-white hover:text-white hover:bg-white/15 transition-all shadow-2xl bg-white/10"
        title="Add Task"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <button
        onClick={onTasksExpandClick}
        className="w-14 h-14 rounded-full glass-effect flex items-center justify-center text-white hover:text-white hover:bg-white/15 transition-all shadow-2xl bg-white/10"
        title="Show Tasks"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </button>
    </div>
  )
} 