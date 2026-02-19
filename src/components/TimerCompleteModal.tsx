'use client'

import { motion } from 'framer-motion'
import { PomodoroPreset } from '@/types/preset'
import { getAccent } from '@/lib/preset-accents'

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak'

type TimerCompleteModalProps = {
  completedMode: TimerMode
  pomodorosCompleted: number
  onStartNext: (mode: TimerMode) => void
  onStop: () => void
  isOpen: boolean
  onClose: () => void
  presets: PomodoroPreset[]
  activePresetId: string
  onSwitchPreset: (presetId: string) => void
}

export default function TimerCompleteModal({
  completedMode,
  pomodorosCompleted,
  onStartNext,
  onStop,
  isOpen,
  onClose,
  alarmAudio,
  presets,
  activePresetId,
  onSwitchPreset,
}: TimerCompleteModalProps & { alarmAudio: HTMLAudioElement | null }) {
  if (!isOpen) return null;

  const getNextMode = (): TimerMode => {
    if (completedMode === 'pomodoro') {
      return (pomodorosCompleted % 4 === 0) ? 'longBreak' : 'shortBreak'
    }
    return 'pomodoro'
  }

  const nextMode = getNextMode()

  const messages: Record<TimerMode, string> = {
    pomodoro: 'Work session complete!',
    shortBreak: 'Break time over!',
    longBreak: 'Long break finished!'
  }

  const subtitles: Record<TimerMode, string> = {
    pomodoro: 'Ready to focus?',
    shortBreak: 'Take a short break!',
    longBreak: 'Time for a longer break!',
  }

  const nextLabels: Record<TimerMode, string> = {
    pomodoro: 'Continue Working',
    shortBreak: 'Take Short Break',
    longBreak: 'Take Long Break',
  }

  const stopAlarm = () => {
    if (alarmAudio) {
      alarmAudio.pause()
      alarmAudio.currentTime = 0
    }
  }

  const handleStartNext = (mode: TimerMode) => {
    stopAlarm()
    onStartNext(mode)
  }

  const handleStop = () => {
    stopAlarm()
    onStop()
  }

  const handleClose = () => {
    stopAlarm()
    onClose()
  }

  // Only show cycle switching after a break ends (going back to work).
  // After a work session the user should take the break their current cycle prescribes.
  const showCycleSwitcher = completedMode !== 'pomodoro' && presets.length > 1

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 pointer-events-auto"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 10 }}
        transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
        className="glass-effect rounded-3xl p-8 w-[440px] text-center"
      >
        <h2 className="text-2xl font-light text-white mb-2">
          {messages[completedMode]}
        </h2>

        <p className="text-sm text-white/50 mb-8">
          {subtitles[nextMode]}
        </p>

        {/* Action buttons -- End on left (secondary), Next on right (primary) */}
        <div className={`flex gap-3 ${showCycleSwitcher ? 'mb-6' : ''}`}>
          <button
            onClick={handleStop}
            className="cursor-pointer flex-1 px-5 py-3 rounded-xl border border-white/15 text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium"
          >
            End Session
          </button>
          <button
            onClick={() => handleStartNext(nextMode)}
            className="cursor-pointer flex-1 px-5 py-3 rounded-xl bg-green-500/90 text-white hover:bg-green-500 transition-colors text-sm font-medium shadow-lg shadow-green-500/20"
          >
            {nextLabels[nextMode]}
          </button>
        </div>

        {/* Preset quick-switch -- only after a break, when returning to work */}
        {showCycleSwitcher && (
          <div className="border-t border-white/10 pt-5">
            <p className="text-[11px] text-white/40 uppercase tracking-widest mb-3">
              Switch Cycle
            </p>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset, idx) => {
                const isActive = activePresetId === preset.id
                const accent = getAccent(preset.id, idx)
                return (
                  <button
                    key={preset.id}
                    onClick={() => { stopAlarm(); onSwitchPreset(preset.id) }}
                    className={`cursor-pointer text-left px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? `${accent.activeBg} ring-1 ${accent.ring}`
                        : `${accent.bg} hover:brightness-150`
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${accent.dot} ${isActive ? 'opacity-100' : 'opacity-40'}`} />
                      <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-white/60'}`}>
                        {preset.name}
                      </span>
                    </div>
                    <span className={`text-[11px] pl-3.5 tabular-nums ${isActive ? 'text-white/45' : 'text-white/25'}`}>
                      {preset.pomodoro}m · {preset.shortBreak}m · {preset.longBreak}m
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
