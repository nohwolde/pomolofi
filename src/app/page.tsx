'use client'

import { useState, useEffect } from 'react'
import Environment from '@/components/Environment'
import TimerModal from '@/components/TimerModal'
import TaskList, { Task } from '@/components/TaskList'
import SideControls from '@/components/SideControls'
import MiniTimer from '@/components/MiniTimer'
import MusicPlayer from '@/components/MusicPlayer'
import TimerCompleteModal from '../components/TimerCompleteModal'
import beachImg from '@/scenes/beach.jpg'
import cafeImg from '@/scenes/cozy-cafe.jpg'
import { motion } from 'framer-motion'
import EnvironmentModal from '@/components/EnvironmentModal'
import { StaticImageData } from 'next/image'
import SoundPlayer from '@/components/SoundPlayer'

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak'

interface Scene {
  id: string
  name: string
  background: string | StaticImageData
  type: 'video' | 'image'
}

const scenes = [
  {
    id: 'snow',
    name: 'Snowy Scene',
    background: '/scenes/0snow.mp4',  // Path from public folder
    type: 'video',
  },
  {
    id: 'cozy-cafe',
    name: 'Cozy Café',
    background: cafeImg,
    type: 'image',
  },
  {
    id: 'beach',
    name: 'Beach',
    background: beachImg,
    type: 'image',
  },
  {
    id: 'sunbeam-forest',
    name: 'Sunbeam Forest',
    background: '/scenes/sunbeam-forest.mp4',  // Path from public folder
    type: 'video',
  },
  {
    id: 'autumn-lake',
    name: 'Autumn Lake',
    background: '/scenes/autumn-lake.mp4',  // Path from public folder
    type: 'video',
  }, 
  {
    id: 'magical-forest',
    name: 'Magical Forest',
    background: '/scenes/magical-forest.mp4',  // Path from public folder
    type: 'video',
  },
  {
    id: 'black-hole', 
    name: 'Black Hole',
    background: '/scenes/black-hole.mp4',  // Path from public folder
    type: 'video',
  }
  // Add more scenes here
] as const;

export default function Home() {
  const [currentSceneId, setCurrentSceneId] = useState<string>('snow') // Default scene
  const [isTimerOpen, setIsTimerOpen] = useState(false)
  const [isTasksExpanded, setIsTasksExpanded] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [showTime, setShowTime] = useState(true)
  const [showTimerComplete, setShowTimerComplete] = useState(false)
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0)
  const [showStreamSelect, setShowStreamSelect] = useState(false)
  const [completedTasks, setCompletedTasks] = useState<string[]>([]) // Track completed tasks
  const [isCompletedTasksVisible, setIsCompletedTasksVisible] = useState(false) // Collapsible state
  const [isTimerCompleteModalOpen, setIsTimerCompleteModalOpen] = useState(false)
  const [completedMode, setCompletedMode] = useState<TimerMode>('pomodoro')
  const [alarmAudio, setAlarmAudio] = useState<HTMLAudioElement | null>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isEnvironmentModalOpen, setIsEnvironmentModalOpen] = useState(false)

  // Timer durations from localStorage
  const [timerDurations, setTimerDurations] = useState<{ pomodoro: number; shortBreak: number; longBreak: number }>({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  });

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([])

  // Find the scene by ID
  const currentScene = scenes.find(scene => scene.id === currentSceneId) ?? scenes[0]

  // Load tasks and timer durations from localStorage on initial render
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }

    const storedDurations = localStorage.getItem('timerDurations')
    if (storedDurations) {
      setTimerDurations(JSON.parse(storedDurations));
    }

    // Load the current scene ID from localStorage
    const storedSceneId = localStorage.getItem('currentSceneId')
    if (storedSceneId && scenes.some(scene => scene.id === storedSceneId)) {
      setCurrentSceneId(storedSceneId)
    }
    setIsInitialLoad(false)
  }, [])

  // Initialize audio
  useEffect(() => {
    const audio = new Audio('/timer-complete.wav')
    audio.preload = 'auto'
    setAlarmAudio(audio)
    
    return () => {
      audio.pause()
      audio.remove()
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem('tasks', JSON.stringify(tasks))
      console.log('Saved tasks to localStorage:', tasks) // Debug log
    }
  }, [tasks])

  // Timer state
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [isTimerPaused, setIsTimerPaused] = useState(false)
  const [timeLeft, setTimeLeft] = useState(timerDurations.pomodoro * 60) // Start with pomodoro duration in seconds
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro')
    
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      completed: false
    }

    setTasks(prevTasks => [...prevTasks, newTask])
    setNewTaskTitle('')
    setShowAddTask(false)
  }

  const handleCompleteTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ))
    setPomodorosCompleted(prev => prev + 1) // Increment completed pomodoros
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerActive && !isTimerPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsTimerActive(false)
      setIsTimerPaused(false)
      if (alarmAudio) {
        alarmAudio.play()
      }
      handleTimerComplete(); // Open the TimerCompleteModal
    }
    return () => {
      clearInterval(interval)
      if (alarmAudio) {
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
      }
    }
  }, [isTimerActive, isTimerPaused, timeLeft, alarmAudio])

  const handleTimerStart = (mode: typeof timerMode, duration: number) => {
    setTimerMode(mode)
    setTimeLeft(duration)
    setIsTimerActive(true)
    setIsTimerPaused(false)
    setIsTimerOpen(false)
  }

  const handleTimerComplete = () => {
    // Increment pomodorosCompleted if the current mode is 'pomodoro'
    if (timerMode === 'pomodoro') {
      setPomodorosCompleted(prev => prev + 1);
    }

    // Determine the next mode
    let nextMode: TimerMode;
    if (timerMode === 'pomodoro') {
      nextMode = (pomodorosCompleted % 4 === 0) ? 'longBreak' : 'shortBreak';
    } else {
      nextMode = 'pomodoro';
    }

    setCompletedMode(timerMode); // Set the completed mode for the modal
    setTimerMode(nextMode); // Set the next mode for the timer
    setIsTimerCompleteModalOpen(true);
  }

  const handleStartNextTimer = (mode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
    let nextDuration = 0;
    if (mode === 'pomodoro') {
      nextDuration = timerDurations.pomodoro * 60; // Convert to seconds
    } else if (mode === 'shortBreak') {
      nextDuration = timerDurations.shortBreak * 60; // Convert to seconds
    } else if (mode === 'longBreak') {
      nextDuration = timerDurations.longBreak * 60; // Convert to seconds
    }
    setTimerMode(mode);
    setTimeLeft(nextDuration);
    setIsTimerActive(true);
    setIsTimerPaused(false);
    setIsTimerCompleteModalOpen(false);
  }

  const handleStopSession = () => {
    setIsTimerActive(false);
    setIsTimerPaused(false);
    setTimeLeft(0);
    setIsTimerCompleteModalOpen(false); // Close modal on stop
    if (alarmAudio) {
      alarmAudio.pause();
      alarmAudio.currentTime = 0;
    }
  }

  const handleCloseTimerCompleteModal = () => {
    setIsTimerCompleteModalOpen(false);
    if (alarmAudio) {
        alarmAudio.pause();
    }
  }

  const handleToggleExpand = () => {
    setIsTasksExpanded(!isTasksExpanded)
  }

  const toggleCompletedTasksVisibility = () => {
    setIsCompletedTasksVisible(!isCompletedTasksVisible)
  }

  const handlePauseSession = () => {
    setIsTimerPaused(true)
    setShowTimerComplete(false)
  }

  const handleSelectScene = (scene: Scene) => {
    setCurrentSceneId(scene.id);
    localStorage.setItem('currentSceneId', scene.id);
    setIsEnvironmentModalOpen(false);
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background Scene */}
      <div className="absolute inset-0">
        <Environment currentScene={currentScene} />
      </div>

      {/* UI Layer */}
      <div className="absolute inset-0 pointer-events-auto">
        {/* Change Environment Button */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={() => setIsEnvironmentModalOpen(true)}
            className="flex items-center p-2.5 rounded-xl 
              bg-black/20 backdrop-blur-md 
              border border-white/20 
              shadow-[0_0_15px_rgba(0,0,0,0.5)] 
              hover:bg-white/20 
              transition-all duration-300 
              group
              before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-black/20 before:to-transparent before:-z-10"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              xmlnsXlink="http://www.w3.org/1999/xlink" 
              fill="currentColor" 
              height="24px" 
              width="24px" 
              version="1.1" 
              id="Layer_1" 
              viewBox="0 0 485 485" 
              xmlSpace="preserve"
              className="text-white group-hover:text-white relative z-10 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]"
            >
              <g>
                <polygon points="30,30 106,30 106,0 0,0 0,106 30,106  "/>
                <polygon points="379,0 379,30 455,30 455,106 485,106 485,0  "/>
                <polygon points="455,455 379,455 379,485 485,485 485,379 455,379  "/>
                <polygon points="30,379 0,379 0,485 106,485 106,455 30,455  "/>
                <path d="M274.405,175c26.191,0,47.5-21.309,47.5-47.5S300.597,80,274.405,80s-47.5,21.309-47.5,47.5S248.214,175,274.405,175z"/>
                <polygon points="80,405 405,405 405,308.18 346.358,246.304 275.241,287.672 176.238,216.922 80,318.465  "/>
              </g>
            </svg>
          </button>
        </div>
        

        {/* Environment Modal */}
        <EnvironmentModal 
          isOpen={isEnvironmentModalOpen}
          onClose={() => setIsEnvironmentModalOpen(false)}
          scenes={scenes}
          onSelectScene={handleSelectScene}
        />

        {/* Side Controls */}
        <div className="pointer-events-auto">
          <SideControls 
            onTimerClick={() => setIsTimerOpen(true)}
            onTaskClick={() => setShowAddTask(true)}
            onTasksExpandClick={() => setIsTasksExpanded(!isTasksExpanded)}
            isTimerActive={isTimerActive}
            isTimerPaused={isTimerPaused}
            onTimerToggle={isTimerPaused ? () => setIsTimerPaused(false) : () => setIsTimerPaused(true)}
            onTimerStop={handleStopSession}
            timeLeft={timeLeft}
            showTime={showTime}
            onToggleShowTime={() => {
                setShowTime(!showTime)
            }}
          />
        </div>

        {/* Task List */}
        <div className="pointer-events-auto">
          <TaskList 
            tasks={tasks}
            setTasks={setTasks}
            onCompleteTask={handleCompleteTask}
            expanded={isTasksExpanded}
            onAddTask={() => setShowAddTask(true)}
            onToggleExpand={handleToggleExpand}
          />
        </div>

        {/* Timer Modal */}
        {isTimerOpen && (
          <div className="pointer-events-auto">
            <TimerModal 
              onClose={() => setIsTimerOpen(false)}
              onStart={handleTimerStart}
              currentMode={timerMode}
            />
          </div>
        )}

        {/* Music Player */}
        <MusicPlayer />
        <SoundPlayer />

        {/* Add Task Modal */}
        {showAddTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={(e) => e.target === e.currentTarget && setShowAddTask(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-effect rounded-3xl p-8 w-[400px] text-center"
            >
              <h2 className="text-xl text-white/90 mb-4">Add New Task</h2>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="What would you like to focus on?"
                className="w-full bg-white/5 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowAddTask(false)}
                  className="px-4 py-2 rounded-lg text-white/70 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
                >
                  Add Task
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Timer Complete Modal */}
        <TimerCompleteModal 
          completedMode={completedMode}
          pomodorosCompleted={pomodorosCompleted}
          onStartNext={handleStartNextTimer}
          onStop={handleStopSession}
          isOpen={isTimerCompleteModalOpen}
          onClose={handleCloseTimerCompleteModal}
        />
      </div>
    </div>
  )
}