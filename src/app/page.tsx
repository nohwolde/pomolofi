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

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak'

const scenes = [
  {
    id: 'cozy-cafe',
    name: 'Cozy Café',
    background: cafeImg,
  },
  {
    id: 'beach',
    name: 'Beach',
    background: beachImg,
  },
  // Add more scenes here
]

export default function Home() {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
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

  // Timer durations from localStorage
  const [timerDurations, setTimerDurations] = useState<{ pomodoro: number; shortBreak: number; longBreak: number }>({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  });

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([])

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

    // Load the current scene index from localStorage
    const storedSceneIndex = localStorage.getItem('currentSceneIndex')
    if (storedSceneIndex) {
      setCurrentSceneIndex(Number(storedSceneIndex))
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

  // Function to cycle through environments
  const handleChangeEnvironment = () => {
    const nextIndex = (currentSceneIndex + 1) % scenes.length;
    setCurrentSceneIndex(nextIndex);
    localStorage.setItem('currentSceneIndex', nextIndex.toString()); // Store the current scene index
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background Scene */}
      <div className="absolute inset-0">
        <Environment currentScene={scenes[currentSceneIndex]} />
      </div>

      {/* UI Layer */}
      <div className="absolute inset-0 pointer-events-auto">
        {/* Change Environment Button */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={handleChangeEnvironment}
            className="flex items-center px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#FFFFFFFF" height="30px" width="30px" version="1.1" id="Layer_1" viewBox="0 0 485 485" xmlSpace="preserve">
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

        {/* Add Task Modal */}
        {showAddTask && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-auto">
            <div className="glass-effect rounded-2xl p-6 w-[400px]">
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
            </div>
          </div>
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