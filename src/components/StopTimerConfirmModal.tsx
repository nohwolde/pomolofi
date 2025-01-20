'use client'

import { motion } from 'framer-motion'

type StopTimerConfirmModalProps = {
  onConfirmStop: () => void
  onPause: () => void
  onCancel: () => void
}

export default function StopTimerConfirmModal({ 
  onConfirmStop, 
  onPause,
  onCancel 
}: StopTimerConfirmModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] pointer-events-auto"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-effect rounded-3xl p-8 w-[400px] text-center"
      >
        <h2 className="text-2xl font-light text-white mb-4">
          End Work Session?
        </h2>
        
        <div className="text-white/50 mb-8">
          You can pause your session instead to continue later
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onPause}
            className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            Pause Session
          </button>
          <button
            onClick={onConfirmStop}
            className="px-6 py-3 rounded-xl bg-red-500/20 text-red-200 hover:bg-red-500/30 transition-colors"
          >
            End Session
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
} 