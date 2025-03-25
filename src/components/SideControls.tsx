'use client'

import { AnimatePresence } from 'framer-motion'
import { FaRegStickyNote } from 'react-icons/fa'
import MiniTimer from './MiniTimer'
import PomodoroProgress from './PomodoroProgress'

interface SideControlsProps {
  onTimerClick: () => void
  onTaskClick: () => void
  onTasksExpandClick: () => void
  onNotesClick: () => void
  isTimerActive: boolean
  isTimerPaused: boolean
  onTimerToggle: () => void
  onTimerStop: () => void
  timeLeft: number
  showTime: boolean
  onToggleShowTime: () => void
  timerMode: 'pomodoro' | 'shortBreak' | 'longBreak'
  totalTime: number
  completedMode: 'pomodoro' | 'shortBreak' | 'longBreak'
  pomodorosCompleted: number
}

export default function SideControls({ 
  onTimerClick, 
  onTaskClick, 
  onTasksExpandClick,
  onNotesClick,
  isTimerActive,
  isTimerPaused,
  onTimerToggle,
  onTimerStop,
  timeLeft,
  showTime,
  onToggleShowTime,
  timerMode,
  totalTime,
  completedMode,
  pomodorosCompleted,
}: SideControlsProps) {
  const buttonBaseClasses = `
    w-14 h-14 rounded-full 
    flex items-center justify-center 
    backdrop-blur-sm border border-white/10
    shadow-[0_0_10px_rgba(0,0,0,0.3)]
    transition-all duration-300
    relative
    before:absolute before:inset-0 
    before:rounded-full 
    before:bg-gradient-to-r 
    before:from-black/10 
    before:to-transparent 
    before:-z-10
  `

  const activeButtonClasses = `${buttonBaseClasses} bg-black/20 text-white hover:bg-white/20`
  const inactiveButtonClasses = `${buttonBaseClasses} bg-black/10 text-white hover:bg-white/20`

  return (
    <div className="fixed right-4 top-20 md:top-1/2 md:-translate-y-1/2 z-10 ">
      <div className="flex flex-col items-center gap-3">
        {/* Timer section with progress */}
        <div className="bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10">
          <PomodoroProgress 
            completedMode={completedMode}
            pomodorosCompleted={pomodorosCompleted}
            timerMode={timerMode}
            isActive={isTimerActive && !isTimerPaused}
          />

          {/* Timer display */}
          <AnimatePresence>
            {isTimerActive && (
              <div className="mb-3 w-full flex justify-center">
                <MiniTimer 
                  timeLeft={timeLeft}
                  isActive={!isTimerPaused} 
                  showTime={showTime}
                  onToggleShowTime={onToggleShowTime}
                />
              </div>
            )}
          </AnimatePresence>
          
          {/* Timer controls */}
          <div className="flex gap-2 justify-center">
            {isTimerActive ? (
              <>
                <button
                  onClick={onTimerToggle}
                  className={activeButtonClasses}
                  title={isTimerPaused ? "Resume Timer" : "Pause Timer"}
                >
                  <svg className="w-7 h-7 relative z-10 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isTimerPaused ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                </button>
                <button
                  onClick={onTimerStop}
                  className={inactiveButtonClasses}
                  title="Stop Timer"
                >
                  <svg className="w-7 h-7 relative z-10 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                </button>
              </>
            ) : (
              <button
                onClick={onTimerClick}
                className={inactiveButtonClasses}
                title="Start Timer"
              >
                <svg className="w-7 h-7 relative z-10 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Other controls */}
        {/* TODO: finish notes page */}
        {/* <button
          onClick={onTaskClick}
          className={inactiveButtonClasses}
          title="Add Task"
        >
          <svg className="w-7 h-7 relative z-10 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        <button
          onClick={onNotesClick}
          className="w-12 h-12 rounded-xl bg-black/30 backdrop-blur-md border border-white/10
            text-white/70 hover:text-white transition-all hover:bg-black/40 relative group"
          title="Show Notes"
        >
          <FaRegStickyNote className="w-5 h-5 relative z-10 mx-auto drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]" />
        </button> */}
      </div>
    </div>
  )
} 