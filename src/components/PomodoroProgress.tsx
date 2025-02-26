import { motion } from 'framer-motion'

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak'

type PomodoroProgressProps = {
  completedMode: TimerMode
  pomodorosCompleted: number
  timerMode: TimerMode
  isActive: boolean
}

export default function PomodoroProgress({
  completedMode,
  pomodorosCompleted,
  timerMode,
  isActive
}: PomodoroProgressProps) {
  const getNextMode = (): TimerMode => {
    if (timerMode === 'pomodoro') {
      return ((pomodorosCompleted % 4) + 1 === 0) ? 'longBreak' : 'shortBreak'
    }
    return 'pomodoro'
  }

  const nextMode = getNextMode()
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col items-center gap-2 mb-4"
    >
      {/* Current session */}
      <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-2">
        <motion.div
          animate={isActive ? {
            scale: [1, 1.1, 1],
            rotate: [0, 2, -2, 0]
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          <div className="text-xl">
            {timerMode === 'pomodoro' && '🍅'}
            {timerMode === 'shortBreak' && '☕️'}
            {timerMode === 'longBreak' && '🌴'}
          </div>
          {isActive && (
            <>
              <div className="absolute inset-0 -z-10 bg-white/20 blur-sm rounded-full scale-150" />
              <div className="absolute inset-0 -z-20 bg-white/10 blur-md rounded-full scale-200" />
            </>
          )}
        </motion.div>
        {/* Only show session count during pomodoro */}
        {timerMode === 'pomodoro' && (
          <div className="text-sm text-white/70 font-light">
            {pomodorosCompleted}/4
          </div>
        )}
      </div>

      {/* Next session indicator */}
      <div className="text-sm text-white/50 font-light flex items-center gap-1.5">
        <span>Next:</span>
        <span className="opacity-60">
          {nextMode === 'pomodoro' && '🍅'}
          {nextMode === 'shortBreak' && '☕️'}
          {nextMode === 'longBreak' && '🌴'}
        </span>
      </div>
    </motion.div>
  )
} 