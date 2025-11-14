'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Environment from '@/components/Environment'
import TimerModal from '@/components/TimerModal'
import TaskList, { Task } from '@/components/TaskList'
import SideControls from '@/components/SideControls'
import MusicPlayer from '@/components/MusicPlayer'
import TimerCompleteModal from '../components/TimerCompleteModal'
// Using blob storage for all scenes now
import { motion } from 'framer-motion'
import EnvironmentModal from '@/components/EnvironmentModal'
import { StaticImageData } from 'next/image'
import SoundPlayer from '@/components/SoundPlayer'
import UserButton from '@/components/UserButton'
import FocusStats from '@/components/FocusStats'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/lib/firebase'
import { incrementBreakTime, incrementFocusTime, incrementTasksCompleted, updateDailyStats, getUserStats, incrementPomodoros } from '@/lib/stats'
import { UserStatsData } from '@/types/stats'
import dynamic from "next/dynamic";
import FullscreenButton from '@/components/FullscreenButton'
import PoweredBy from '@/components/PoweredBy'
import { getBlobUrl } from '@/lib/blob-urls'

const Notes = dynamic(() => import('@/components/Notes'), { ssr: false })

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak'

interface Scene {
  id: string
  name: string
  background: string | StaticImageData
  type: 'video' | 'image'
}

const scenes: Record<string, Scene> = {
  "cozy-cafe": {
    id: 'cozy-cafe',
    name: 'Cozy Café',
    background: getBlobUrl('scenes', 'cozy-cafe.jpg'),
    type: 'image',
  },
  "beach": {
    id: 'beach',
    name: 'Beach',
    background: getBlobUrl('scenes', 'beach.jpg'),
    type: 'image',
  },
  "snow": {
    id: 'snow',
    name: 'Snowy Scene',
    background: getBlobUrl('scenes', 'snow.mp4'),
    type: 'video',
  },
  "winter-city": {
    id: 'winter-city',
    name: 'Winter City',
    background: getBlobUrl('scenes', 'winter-city.mp4'),
    type: 'video',
  },
  "sunbeam-forest": {
    id: 'sunbeam-forest',
    name: 'Sunbeam Forest',
    background: getBlobUrl('scenes', 'sunbeam-forest.mp4'),
    type: 'video',
  },
  "summer-village": {
    id: 'summer-village',
    name: 'Summer Village',
    background: getBlobUrl('scenes', 'summer-village.mp4'),
    type: 'video',
  },
  "sunset-beach": {
    id: 'sunset-beach',
    name: 'Sunset Beach',
    background: getBlobUrl('scenes', 'sunset-beach.mp4'),
    type: 'video',
  },
  "autumn-lake": {
    id: 'autumn-lake',
    name: 'Autumn Lake',
    background: getBlobUrl('scenes', 'autumn-lake.mp4'),
    type: 'video',
  },
  "cherry-blossom-lake": {
    id: 'cherry-blossom-lake',
    name: 'Cherry Blossom Lake',
    background: getBlobUrl('scenes', 'cherry-blossom-lake.mp4'),
    type: 'video',
  },
  "starry-night": {
    id: 'starry-night',
    name: 'Starry Night',
    background: getBlobUrl('scenes', 'starry-night.mp4'),
    type: 'video',
  },
  "charming-cafe": {
    id: 'charming-cafe',
    name: 'Charming Cafe',
    background: getBlobUrl('scenes', 'charming-cafe.mp4'),
    type: 'video',
  },
  "magical-forest": {
    id: 'magical-forest',
    name: 'Magical Forest',
    background: getBlobUrl('scenes', 'magical-forest.mp4'),
    type: 'video',
  },
  "black-hole": {
    id: 'black-hole',
    name: 'Black Hole',
    background: getBlobUrl('scenes', 'black-hole.mp4'),
    type: 'video',
  },
  "dark-star": {
    id: 'dark-star',
    name: 'Dark Star',
    background: getBlobUrl('scenes', 'dark-star.mp4'),
    type: 'video',
  }
  // Add more scenes here
};

// Helper function to get initial stats
const getInitialStats = () => {
  // Check if we're in the browser and localStorage is available
  if (typeof window !== 'undefined') {
    const today = new Date().toISOString().split('T')[0]
    const storedStats = localStorage.getItem('dailyStats')
    
    if (storedStats) {
      const stats = JSON.parse(storedStats)
      if (stats.date === today) {
        return stats
      }
    }
  }
  
  // Default values if no stored stats or different day
  return {
    date: new Date().toISOString().split('T')[0],
    focusTime: 0,
    breakTime: 0,
    pomodorosCompleted: 0,
    tasksCompleted: 0,
  }
}

export default function Home() {
  const [currentSceneId, setCurrentSceneId] = useState<string>('snow'); // Default scene
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isTasksExpanded, setIsTasksExpanded] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showTime, setShowTime] = useState(true);
  const [showTimerComplete, setShowTimerComplete] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [showStreamSelect, setShowStreamSelect] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]); // Track completed tasks
  const [isCompletedTasksVisible, setIsCompletedTasksVisible] = useState(false); // Collapsible state
  const [isTimerCompleteModalOpen, setIsTimerCompleteModalOpen] = useState(false);
  const [completedMode, setCompletedMode] = useState<TimerMode>('pomodoro');
  const [alarmAudio, setAlarmAudio] = useState<HTMLAudioElement | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isEnvironmentModalOpen, setIsEnvironmentModalOpen] = useState(false);
  const [dailyTasksCompleted, setDailyTasksCompleted] = useState(0);
  const [dailyStats, setDailyStats] = useState(getInitialStats());
  const [user] = useAuthState(auth);
  const [userStats, setUserStats] = useState<UserStatsData | null>(null);
  const [timeframe, setTimeframe] = useState<'today' | '7days' | '28days'>('today');

  // Timer durations from localStorage
  const [timerDurations, setTimerDurations] = useState<{ pomodoro: number; shortBreak: number; longBreak: number }>({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  });

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([]);

  // First declare state
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [totalBreakTime, setTotalBreakTime] = useState(0);

  // Get current scene from scenes array
  // const currentScene = scenes.find(scene => scene.id === currentSceneId) || scenes[0];
  const currentScene = scenes[currentSceneId];

  // Load tasks and timer durations from localStorage on initial render
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }

    const storedDurations = localStorage.getItem('timerDurations');
    if (storedDurations) {
      setTimerDurations(JSON.parse(storedDurations));
    }

    // Load the current scene ID from localStorage
    const storedSceneId = localStorage.getItem('currentSceneId')
    if (storedSceneId && scenes[storedSceneId]) {
      setCurrentSceneId(storedSceneId);
    }
    const storedStats = localStorage.getItem('dailyStats');
    if (storedStats) {
      try {
        const stats = JSON.parse(storedStats)
        const today = new Date().toISOString().split('T')[0]
        
        // Only restore stats if they're from today
        if (stats.date === today) {
          setTotalFocusTime(stats.focusTime)
          setTotalBreakTime(stats.breakTime)
          setPomodorosCompleted(stats.pomodorosCompleted)
          setDailyTasksCompleted(stats.tasksCompleted)
        }
      } catch (error) {
        console.error('Error parsing stored stats:', error)
      }
    }
    setIsInitialLoad(false)
  }, [])

  // Initialize audio
  useEffect(() => {
    const audio = new Audio(getBlobUrl('assets', 'timer-complete.mp3'))
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
  const [startTime, setStartTime] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(timerDurations.pomodoro * 60)
  const [pausedTimeLeft, setPausedTimeLeft] = useState<number | null>(null)
  const timerRef = useRef<number>()
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
    setDailyTasksCompleted(prev => prev + 1)
    if (user?.uid) {
      incrementTasksCompleted(user.uid)
    }
  }

  // Update the updateTimer callback
  const updateTimer = useCallback(() => {
    if (!startTime) return
    
    const now = Date.now()
    const elapsed = Math.floor((now - startTime) / 1000)
    const initial = pausedTimeLeft ?? (timerDurations[timerMode] * 60)
    const remaining = Math.max(0, initial - elapsed)
    
    // Calculate minutes elapsed since last update
    const previousMinutes = Math.ceil(timeLeft / 60)
    const currentMinutes = Math.ceil(remaining / 60)
    const minutesElapsed = previousMinutes - currentMinutes

    // Update stats if a minute has passed
    if (minutesElapsed > 0) {
      if (timerMode === 'pomodoro') {
        setTotalFocusTime(prev => prev + 1)
        // Update database if user is signed in
        if (user?.uid) {
          incrementFocusTime(user.uid)
        }
      } else {
        setTotalBreakTime(prev => prev + 1)
        if (user?.uid) {
          incrementBreakTime(user.uid)
        }
      }
    }
    
    setTimeLeft(remaining)
    
    if (remaining > 0) {
      timerRef.current = window.setTimeout(updateTimer, 1000)
    } else {
      setIsTimerActive(false)
      setIsTimerPaused(false)
      setPausedTimeLeft(null)
      if (alarmAudio) {
        alarmAudio.play()
      }
      handleTimerComplete()
    }
  }, [startTime, timerMode, timerDurations, pausedTimeLeft, alarmAudio, timeLeft, user])

  useEffect(() => {
    if (isTimerActive && !isTimerPaused) {
      if (!startTime) {
        setStartTime(Date.now())
      }
      timerRef.current = window.setTimeout(updateTimer, 1000)
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      if (isTimerPaused) {
        setPausedTimeLeft(timeLeft)
        setStartTime(null)
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isTimerActive, isTimerPaused, startTime, updateTimer])

  // Update the initial timeLeft when timerDurations change
  useEffect(() => {
    if (!isTimerActive) {
      setTimeLeft(timerDurations[timerMode] * 60)
    }
  }, [timerDurations, timerMode])

  // Update handleTimerStart to use current timerDurations
  const handleTimerStart = (mode: typeof timerMode, duration: number) => {
    const currentDuration = timerDurations[mode] * 60 // Use current duration from settings
    setTimerMode(mode)
    setTimeLeft(currentDuration)
    setPausedTimeLeft(null)
    setStartTime(Date.now())
    setIsTimerActive(true)
    setIsTimerPaused(false)
    setIsTimerOpen(false)
  }

  const handleTimerComplete = () => {
    console.log('Timer Complete Stats:', {
      timerMode,
      timeLeft,
      totalTime: timerDurations[timerMode] * 60,
      focusTime: timerMode === 'pomodoro' ? timerDurations[timerMode] : 0
    })

    // First update pomodorosCompleted if it's a pomodoro session
    let newPomodoroCount = pomodorosCompleted
    if (timerMode === 'pomodoro') {
      newPomodoroCount = pomodorosCompleted + 1
      setPomodorosCompleted(newPomodoroCount)
      if (user?.uid) {
        incrementPomodoros(user.uid)
      }
    }

    setCompletedMode(timerMode)
    setIsTimerCompleteModalOpen(true)
  }

  // Update handleStartNextTimer to properly initialize with current durations
  const handleStartNextTimer = (mode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
    const nextDuration = timerDurations[mode] * 60
    setTimerMode(mode)
    setTimeLeft(nextDuration)
    setPausedTimeLeft(null)
    setStartTime(Date.now())  // Add this to properly start the timer
    setIsTimerActive(true)
    setIsTimerPaused(false)
    setIsTimerCompleteModalOpen(false)
    if (alarmAudio) {
      alarmAudio.pause()
      alarmAudio.currentTime = 0
    }
  }

  const handleStopSession = () => {
    setIsTimerActive(false)
    setIsTimerPaused(false)
    setTimeLeft(0)
    setStartTime(null)
    setPausedTimeLeft(null)
    setIsTimerCompleteModalOpen(false)
    if (alarmAudio) {
      alarmAudio.pause()
      alarmAudio.currentTime = 0
    }
  }

  const handleCloseTimerCompleteModal = () => {
    setIsTimerCompleteModalOpen(false);
    // Stop and reset alarm
    if (alarmAudio) {
      alarmAudio.pause();
      alarmAudio.currentTime = 0;
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
    setPausedTimeLeft(timeLeft)
    setStartTime(null)
  }

  const handleSelectScene = (scene: Scene) => {
    setCurrentSceneId(scene.id);
    localStorage.setItem('currentSceneId', scene.id);
    setIsEnvironmentModalOpen(false);
  }

  // Save stats whenever they change
  useEffect(() => {
    if (!isInitialLoad) {
      const fetchStats = async () => {
        // const newStats = {
        //   date: new Date().toISOString().split('T')[0],
        //   focusTime: totalFocusTime,
        //   breakTime: totalBreakTime,
        //   pomodorosCompleted,
        //   tasksCompleted: dailyTasksCompleted,
        // }
        // setDailyStats(newStats)
        // localStorage.setItem('dailyStats', JSON.stringify(newStats))
        // retrieve stats from database
        console.log('User:', user);
        if (user?.uid) {
          const stats = await getUserStats(user.uid)
          setUserStats(stats)
          console.log('User Stats:', stats)
          
        }
      }
      fetchStats()
    }
    console.log('isInitialLoad:', isInitialLoad)
  }, [isInitialLoad, user])

  // Fetch user stats when user is authenticated
  useEffect(() => {
    async function loadStats() {
      if (user?.uid) {
        const stats = await getUserStats(user.uid)
        setUserStats(stats)

        // Update dailyStats with the new stats
        setDailyStats(stats)
      }
    }
    loadStats()
  }, [user])

  // Add state for notes
  const [isNotesOpen, setIsNotesOpen] = useState(false)

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background Scene */}
      <div className="absolute inset-0">
        <Environment currentScene={currentScene} />
      </div>

      {/* UI Layer */}
      <div className="absolute inset-0 pointer-events-auto">
        {/* Add UserButton near the top */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-4 hidden md:flex">
          <FocusStats
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            userStats={userStats || undefined}
          />
          <UserButton />
        </div>

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

        {/* Pomodoro Progress */}
        <div className="pointer-events-auto">
          <SideControls 
            onTimerClick={() => setIsTimerOpen(true)}
            onTaskClick={() => setShowAddTask(true)}
            onTasksExpandClick={() => setIsTasksExpanded(!isTasksExpanded)}
            onNotesClick={() => setIsNotesOpen(true)}
            isTimerActive={isTimerActive}
            isTimerPaused={isTimerPaused}
            onTimerToggle={isTimerPaused ? () => setIsTimerPaused(false) : () => setIsTimerPaused(true)}
            onTimerStop={handleStopSession}
            timeLeft={timeLeft}
            showTime={showTime}
            onToggleShowTime={() => setShowTime(!showTime)}
            completedMode={completedMode}
            pomodorosCompleted={pomodorosCompleted}
            timerMode={timerMode}
            totalTime={timerDurations[timerMode] * 60}
          />
        </div>

        {/* Environment Modal */}
        <EnvironmentModal 
          isOpen={isEnvironmentModalOpen}
          onClose={() => setIsEnvironmentModalOpen(false)}
          scenes={Object.values(scenes)}
          onSelectScene={handleSelectScene}
        />

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
              onDurationsChange={setTimerDurations}
            />
          </div>
        )}

        {/* Audio Players */}
        {/* <div className="fixed bottom-4 left-8 flex flex-col md:flex-row gap-4">
          <div className="music-player-container">
            <MusicPlayer />
          </div>
          <div className="sound-player-container">
            <SoundPlayer />
          </div>
        </div> */}

        <div className="fixed bottom-4 left-8 flex flex-col md:flex-row gap-4">
            <MusicPlayer />
            <SoundPlayer />
        </div>

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
          alarmAudio={alarmAudio}
        />

        <Notes 
          isOpen={isNotesOpen}
          onClose={() => setIsNotesOpen(false)}
        />

        {/* Powered by Highfly */}
        <PoweredBy />

        {/* Fullscreen button */}
        <FullscreenButton />
      </div>
    </div>
  )
}