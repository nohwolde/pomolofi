'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Task = {
  id: string
  title: string
  completed: boolean
  pomodoros: number
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const addTask = (title: string) => {
    if (title.trim()) {
      setTasks([...tasks, {
        id: Date.now().toString(),
        title: title.trim(),
        completed: false,
        pomodoros: 1
      }])
      setNewTaskTitle('')
    }
  }

  return (
    <div className="fixed top-6 right-6 glass-effect rounded-2xl p-4 w-[300px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg text-white/90">Today's Tasks</h2>
        <span className="text-sm text-white/50">
          {tasks.filter(t => t.completed).length}/{tasks.length}
        </span>
      </div>
      
      <div className="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
        <AnimatePresence>
          {tasks.map(task => (
            <motion.div 
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="group flex items-center gap-3 hover:bg-white/5 rounded-lg p-2 transition-colors"
            >
              <button
                onClick={() => {
                  setTasks(tasks.map(t => 
                    t.id === task.id ? {...t, completed: !t.completed} : t
                  ))
                }}
                className={`w-4 h-4 rounded border transition-colors ${
                  task.completed 
                    ? 'bg-white/20 border-transparent' 
                    : 'border-white/30 hover:border-white/50'
                }`}
              />
              <span className={`flex-1 text-sm ${
                task.completed 
                  ? 'text-white/30 line-through' 
                  : 'text-white/90'
              }`}>
                {task.title}
              </span>
              <span className="text-xs text-white/30">
                {task.pomodoros}🍅
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <form 
        onSubmit={(e) => {
          e.preventDefault()
          addTask(newTaskTitle)
        }}
        className="mt-4"
      >
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a task..."
          className="w-full bg-white/5 rounded-lg px-3 py-2 text-sm text-white/90 placeholder-white/30 focus:outline-none focus:bg-white/10"
        />
      </form>
    </div>
  )
} 