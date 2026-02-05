'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const initialTasks = [
  { id: '1', title: 'Finish project proposal', completed: false },
  { id: '2', title: 'Review pull requests', completed: false },
  { id: '3', title: 'Update documentation', completed: false },
  { id: '4', title: 'Morning standup', completed: true },
  { id: '5', title: 'Email client updates', completed: true },
]

export default function DemoTaskList() {
  const [tasks, setTasks] = useState(initialTasks)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isCompletedOpen, setIsCompletedOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const activeTasks = tasks.filter(t => !t.completed)
  const completedTasks = tasks.filter(t => t.completed)
  const activeTask = activeTasks[0]
  const nextUpTasks = activeTasks.slice(1)

  const handleCompleteTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ))
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 2000)
  }

  return (
    <div className="flex flex-col items-start gap-4 w-full max-w-sm">
      {/* Celebration Message */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-500 text-white p-2 rounded-lg"
          >
            Task Completed! Great job!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Task */}
      {activeTask && (
        <div className="backdrop-blur-xl rounded-xl p-6 max-w-sm shadow-xl 
          bg-gray-400/20 border border-white/10 transition-all duration-300 hover:shadow-2xl hover:bg-gray-400/30">
          <div className="text-sm text-white/70 mb-2 uppercase tracking-wider font-medium">Current Focus</div>
          <div className="text-xl text-white font-medium">{activeTask.title}</div>
          <div className="flex items-center justify-end mt-4">
            <button
              onClick={() => handleCompleteTask(activeTask.id)}
              className="text-sm text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              Mark Complete
            </button>
          </div>
        </div>
      )}

      {/* Next Up Section */}
      <div className="backdrop-blur-xl rounded-xl p-6 w-full max-w-[300px] shadow-xl 
        bg-gray-400/20 border border-white/10 transition-all duration-300 hover:shadow-2xl hover:bg-gray-400/30">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="text-sm text-white/70 uppercase tracking-wider font-medium group-hover:text-white/90">
              Next Up {nextUpTasks.length > 0 && `(${nextUpTasks.length})`}
            </div>
            {nextUpTasks.length > 1 && (
              <svg 
                className={`w-4 h-4 text-white/50 transition-transform group-hover:text-white/70 ${
                  expanded ? 'rotate-180' : ''
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
          <span className="text-sm text-white/50">+ Add Task</span>
        </div>
        
        {/* First next task */}
        {nextUpTasks.length > 0 && (
          <div className="flex items-center gap-3 text-white/70 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg group mb-2">
            <span className="flex-1">{nextUpTasks[0].title}</span>
            <button
              onClick={() => handleCompleteTask(nextUpTasks[0].id)}
              className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-white/70 transition-all cursor-pointer"
            >
              ✓
            </button>
          </div>
        )}
        
        {/* Remaining tasks when expanded */}
        <AnimatePresence>
          {expanded && nextUpTasks.length > 1 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 overflow-hidden border-t border-white/10 pt-3 mt-1"
            >
              {nextUpTasks.slice(1).map(task => (
                <motion.div 
                  key={task.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg group"
                >
                  <span className="flex-1">{task.title}</span>
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-white/70 transition-all cursor-pointer"
                  >
                    ✓
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {!expanded && nextUpTasks.length > 1 && (
          <div className="text-white/30 text-center text-sm mt-2 border-t border-white/10 pt-2">
            +{nextUpTasks.length - 1} more task{nextUpTasks.length !== 2 ? 's' : ''}
          </div>
        )}

        {nextUpTasks.length === 0 && (
          <div className="text-white/50 text-center py-2">
            All caught up!
          </div>
        )}
      </div>

      {/* Completed Tasks Section */}
      <div className="backdrop-blur-xl rounded-xl p-6 w-full max-w-[300px] shadow-xl 
        bg-gray-400/20 border border-white/10 transition-all duration-300 hover:shadow-2xl hover:bg-gray-400/30">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => setIsCompletedOpen(!isCompletedOpen)}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="text-sm text-white/80 uppercase tracking-wider font-medium group-hover:text-white/90">
              Completed {completedTasks.length > 0 && `(${completedTasks.length})`}
            </div>
            <svg 
              className={`w-4 h-4 text-white/50 transition-transform group-hover:text-white/70 ${
                isCompletedOpen ? 'rotate-180' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        <AnimatePresence>
          {isCompletedOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              {completedTasks.length > 0 ? (
                completedTasks.map((task) => (
                  <div key={task.id} className="flex items-center text-white/50 text-sm">
                    <span className="mr-2 text-green-400">✓</span>
                    <span className="line-through">{task.title}</span>
                  </div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-white/80 text-center py-2"
                >
                  No completed tasks yet
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
