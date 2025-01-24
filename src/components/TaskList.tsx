'use client'

import { motion, AnimatePresence } from 'framer-motion'
import React, { useState, useEffect } from 'react';

export type Task = {
  id: string
  title: string
  completed: boolean
}

type TaskListProps = {
  tasks: Task[]
  onCompleteTask: (taskId: string) => void
  expanded: boolean
  onAddTask: () => void
  onToggleExpand: () => void
  setTasks: (tasks: Task[]) => void
}

export default function TaskList({ 
  tasks, 
  onCompleteTask, 
  expanded, 
  onAddTask,
  onToggleExpand,
  setTasks
}: TaskListProps) {
  const activeTask = tasks.find(t => !t.completed)
  const nextUpTasks = tasks.filter(t => !t.completed && t.id !== activeTask?.id)
  const completedTasks = tasks.filter(t => t.completed);
  const [isCompletedTasksVisible, setIsCompletedTasksVisible] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isCompletedOpen, setIsCompletedOpen] = useState(false);

  const toggleCompletedTasksVisibility = () => {
    setIsCompletedTasksVisible(!isCompletedTasksVisible);
  };

  const handleCompleteTask = (taskId: string) => {
    onCompleteTask(taskId);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  };

  // Clear completed tasks
  const clearCompletedTasks = () => {
    const newTasks = tasks.filter(task => !task.completed);
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks)); // Update local storage
  };

  // Load tasks from localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      console.log(storedTasks);
      try {
        const parsedTasks = JSON.parse(storedTasks);
        // Check if parsedTasks is an array
        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks);
        } else {
          console.error('Parsed tasks is not an array:', parsedTasks);
        }
      } catch (error) {
        console.error('Error parsing stored tasks:', error);
      }
    }
  }, [setTasks]);

  // Save tasks whenever they change
  useEffect(() => {
    if (tasks.length > 0) { // Only save if tasks are not empty
      localStorage.setItem('tasks', JSON.stringify(tasks));
      console.log('Saved tasks to localStorage:', tasks); // Debug log
    }
  }, [tasks]);

  // Garbage collection for completed tasks
  useEffect(() => {
    if (completedTasks.length > 20) {
      const newCompletedTasks = completedTasks.slice(completedTasks.length - 20);
      setTasks(newCompletedTasks)
    }
  }, [completedTasks]);

  const toggleCompletedTasks = () => {
    setIsCompletedOpen(!isCompletedOpen);
  };

  return (
    <div className="fixed left-8 top-8 flex flex-col items-start">
      {/* Celebration Message */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-500 text-white p-2 rounded-lg mb-4"
          >
            🎉 Task Completed! Great job! 🎉
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Task */}
      {activeTask ? (
        <div className="backdrop-blur-xl rounded-xl p-6 mb-4 max-w-sm shadow-xl 
          bg-gray-400/20 border border-white/10 transition-all duration-300 hover:shadow-2xl hover:bg-gray-400/30">
          <div className="text-sm text-white/70 mb-2 uppercase tracking-wider font-medium">Current Focus</div>
          <div className="text-xl text-white font-medium">{activeTask.title}</div>
          <div className="flex items-center justify-end mt-4">
            <button
              onClick={() => handleCompleteTask(activeTask.id)}
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              Mark Complete
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={onAddTask}
          className="backdrop-blur-xl rounded-xl p-6 mb-4 text-white/70 
            bg-gray-400/20 border border-white/10 hover:text-white hover:bg-gray-400/30 
            transition-all duration-300 shadow-xl hover:shadow-2xl"
        >
          + Add your next task
        </button>
      )}

      {/* Next Up Section */}
      <div className="backdrop-blur-xl rounded-xl p-6 w-[300px] shadow-xl 
        bg-gray-400/20 border border-white/10 transition-all duration-300 hover:shadow-2xl hover:bg-gray-400/30">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={onToggleExpand}
            className="flex items-center gap-2 group"
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
          <button
            onClick={onAddTask}
            className="text-sm text-white/80 hover:text-white transition-colors"
          >
            + Add Task
          </button>
        </div>
        
        {/* Always show first next task */}
        {nextUpTasks.length > 0 && (
          <div className="flex items-center gap-3 text-white/70 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg group mb-2">
            <span className="flex-1">{nextUpTasks[0].title}</span>
            <button
              onClick={() => handleCompleteTask(nextUpTasks[0].id)}
              className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-white/70 transition-all"
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
                    className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-white/70 transition-all"
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
            No tasks yet
          </div>
        )}
      </div>

      {/* Completed Tasks Section */}
      <div className="backdrop-blur-xl rounded-xl p-6 w-[300px] shadow-xl 
        bg-gray-400/20 border border-white/10 transition-all duration-300 hover:shadow-2xl hover:bg-gray-400/30 
        mt-4 max-h-60 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={toggleCompletedTasks}
            className="flex items-center gap-2 group"
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
          <button
            onClick={clearCompletedTasks}
            className="text-sm text-white/80 hover:text-white transition-colors"
          >
            Clear
          </button>
        </div>
        
        <AnimatePresence>
          {isCompletedOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="completed-tasks"
            >
              {completedTasks.length > 0 ? (
                completedTasks.map((task, index) => (
                  <div key={index} className="flex items-center">
                    <span className="mr-2">✓</span>
                    {task.title}
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