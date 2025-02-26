'use client'

import { useState, useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBolt, FaCheckCircle, FaClock, FaCoffee, FaFire, FaRegLightbulb, FaListAlt, FaChartBar } from 'react-icons/fa'
import { UserStatsData, DailyStats } from '@/types/stats'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, ComposedChart, Bar, LabelList } from 'recharts'
import { useAuth } from "@/lib/auth"
import { updateDailyStats } from "@/lib/stats";
import UserButton, { AuthModal } from './UserButton'
import { auth } from '@/lib/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

interface FocusStatsProps {
  timeframe?: 'today' | '7days' | '28days'
  onTimeframeChange?: (timeframe: 'today' | '7days' | '28days') => void
  userStats?: UserStatsData
}

const FocusStats = memo(function FocusStats({
  timeframe = 'today',
  onTimeframeChange,
  userStats,
}: FocusStatsProps) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const getLast5Days = () => {
    // get the last 5 days from the userStats
    if (!userStats?.recentDays) return []
    return userStats.recentDays.slice(-5).reverse()
    // return Array.from({ length: 5 }, (_, i) => {
    //   const date = new Date()
    //   date.setDate(date.getDate() - i)
    //   return {
    //     date: date.toISOString().split('T')[0],
    //     focusTime: 0,
    //     breakTime: 0,
    //     pomodorosCompleted: 0,
    //     tasksCompleted: 0
    //   }
    // }).reverse()
  }

  const getChartData = () => {
    if (!userStats?.recentDays) {
      return getLast5Days()
    }

    switch (timeframe) {
      case 'today':
        return [userStats.recentDays[userStats.recentDays.length - 1]]
      
      case '7days':
        return userStats.recentDays.slice(-7)
      
      case '28days':
        return userStats.recentDays
    }
  }
  
  // First get the chart data
  const chartData = getChartData()

  // Then define getDisplayStats using the chartData
  const getDisplayStats = () => {
    if (!userStats?.recentDays) return {
      focusTime: 0,
      breakTime: 0,
      pomodorosCompleted: 0,
      tasksCompleted: 0
    }

    const relevantDays = timeframe === 'today'
      ? [userStats.recentDays[userStats.recentDays.length - 1]]
      : timeframe === '7days'
        ? userStats.recentDays.slice(-7)
        : userStats.recentDays

    return {
      focusTime: relevantDays.reduce((sum, day) => sum + (day.focusTime || 0), 0),
      breakTime: relevantDays.reduce((sum, day) => sum + (day.breakTime || 0), 0),
      pomodorosCompleted: relevantDays.reduce((sum, day) => sum + (day.pomodorosCompleted || 0), 0),
      tasksCompleted: relevantDays.reduce((sum, day) => sum + (day.tasksCompleted || 0), 0)
    }
  }

  const stats = getDisplayStats()

  const formatTime = (minutes: number) => {
    if (!minutes || minutes < 1) return '0m'
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }



  console.log('Chart Data:', chartData)

  const MonthlyView = ({ data }: { data: DailyStats[] }) => {
    const transformedData = data.map(day => ({
      ...day,
      focusTime: Math.floor(day.focusTime),
      breakTime: Math.floor(day.breakTime),
      displayFocusTime: Math.floor(day.focusTime),
      displayDate: new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }))

    // Adjust chart height based on timeframe
    const chartHeight = timeframe === '28days' ? 400 : 300

    // Calculate total focus time from the same transformed data used in the graph
    const totalFocusTime = transformedData.reduce((total, day) => 
      total + Math.floor(day.focusTime), 0
    );

    return (
      <div className="space-y-6">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <ComposedChart 
            data={transformedData} 
            margin={{ 
              top: 20, 
              right: 30,
              bottom: 30,
              left: 20 
            }}
          >
            <defs>
              <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(139,92,246)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="rgb(139,92,246)" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false}
              stroke="rgba(255,255,255,0.05)"
            />
            
            <XAxis 
              dataKey="displayDate"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              interval="preserveStart"
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', { 
                  month: 'short',
                  day: 'numeric'
                })
              }}
            />
            
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              tickFormatter={(value) => `${Math.round(value)}m`}
            />
            
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                backdropFilter: 'blur(12px)',
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
              itemStyle={{ color: '#8b5cf6' }}
              formatter={(value: any) => [`${Math.round(value)}m`, 'Focus Time']}
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            />

            <Bar 
              dataKey="displayFocusTime"
              fill="url(#colorFocus)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
              isAnimationActive={true}
              animationDuration={300}
            >
              <LabelList
                dataKey="focusTime"
                position="top"
                content={({ value, x, y }) => (
                  <text
                    x={x}
                    y={y}
                    fill="rgba(255,255,255,0.6)"
                    fontSize={10}
                    textAnchor="middle"
                    dy={-8}
                  >
                    {`${Math.round(Number(value))}m`}
                  </text>
                )}
              />
            </Bar>

            <Line
              type="monotone"
              dataKey="displayFocusTime"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#8b5cf6' }}
              isAnimationActive={true}
              animationDuration={300}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Summary stats using the same data as the graph */}
        {!(timeframe === 'today') && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-white/50 text-sm mb-1">Total Focus Time</div>
              <div className="text-xl font-light text-white">
                {formatTime(totalFocusTime)}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-white/50 text-sm mb-1">Most Productive Day</div>
              <div className="text-xl font-light text-white">
                {getMostProductiveDay(transformedData)}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-white/50 text-sm mb-1">Active Days</div>
              <div className="text-xl font-light text-white">
                {transformedData.filter(day => day.focusTime > 0).length} days
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const handleStatsUpdate = async () => {
    const currentDate = new Date().toISOString().split('T')[0]
    const newStats = {
      date: currentDate,
      focusTime: stats.focusTime,
      breakTime: stats.breakTime,
      pomodorosCompleted: stats.pomodorosCompleted,
      tasksCompleted: stats.tasksCompleted,
    }

    // Always update localStorage
    localStorage.setItem('dailyStats', JSON.stringify(newStats))

    // Update Firebase if user is authenticated
    if (user) {
      try {
        await updateDailyStats(user.uid, newStats)
        // Refresh stats after update
        onTimeframeChange?.(timeframe)
      } catch (error) {
        console.error('Failed to update stats:', error)
      }
    }
  }

  const handleTimeframeChange = (newTimeframe: 'today' | '7days' | '28days') => {
    if (!user && newTimeframe !== 'today') {
      setShowPremiumModal(true)
      return
    }
    onTimeframeChange?.(newTimeframe)
  }

  const getMostProductiveDay = (data: DailyStats[]) => {
    if (!data || data.length === 0) return 'No data yet'
    
    // Sort by focus time to get most productive day
    const mostProductive = [...data].sort((a, b) => b.focusTime - a.focusTime)[0]
    
    // Create date at start of day in local timezone
    const date = new Date(mostProductive.date + 'T00:00:00')
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 
          shadow-[0_0_10px_rgba(0,0,0,0.3)] hover:bg-white/20 transition-colors
          relative before:absolute before:inset-0 before:rounded-lg 
          before:bg-gradient-to-r before:from-black/10 before:to-transparent before:-z-10"
      >
        <span className="relative z-10 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)] flex items-center gap-2">
          <FaBolt className="text-purple-400" />
          Focus Stats
        </span>
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[60]"
            onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-black/40 backdrop-blur-md rounded-3xl p-12 w-[800px] max-h-[90vh] overflow-y-auto relative
                border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)]"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-light text-white">Focus Stats</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTimeframeChange('today')}
                    className={`px-4 py-1 rounded-lg ${
                      timeframe === 'today' ? 'bg-purple-500' : 'bg-white/10'
                    } text-white/90 text-sm hover:bg-white/20 transition-colors`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => handleTimeframeChange('7days')}
                    className={`px-4 py-1 rounded-lg ${
                      timeframe === '7days' ? 'bg-purple-500' : 'bg-white/10'
                    } text-white/90 text-sm hover:bg-white/20 transition-colors`}
                  >
                    7 Days
                  </button>
                  <button
                    onClick={() => handleTimeframeChange('28days')}
                    className={`px-4 py-1 rounded-lg ${
                      timeframe === '28days' ? 'bg-purple-500' : 'bg-white/10'
                    } text-white/90 text-sm hover:bg-white/20 transition-colors`}
                  >
                    28 Days
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-white/5 rounded-xl p-4 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <FaClock className="text-purple-400" />
                      <div className="text-white/50 text-sm">Focus Time</div>
                    </div>
                    <div className="text-2xl font-light text-white">
                      {formatTime(stats.focusTime)}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent" />
                </div>

                <div className="bg-white/5 rounded-xl p-4 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <FaCoffee className="text-teal-400" />
                      <div className="text-white/50 text-sm">Break Time</div>
                    </div>
                    <div className="text-2xl font-light text-white">
                      {formatTime(stats.breakTime)}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-transparent" />
                </div>

                <div className="bg-white/5 rounded-xl p-4 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <FaFire className="text-orange-400" />
                      <div className="text-white/50 text-sm">Sessions</div>
                    </div>
                    <div className="text-2xl font-light text-white">
                      {stats.pomodorosCompleted}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent" />
                </div>

                <div className="bg-white/5 rounded-xl p-4 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <FaCheckCircle className="text-green-400" />
                      <div className="text-white/50 text-sm">Tasks</div>
                    </div>
                    <div className="text-2xl font-light text-white">
                      {stats.tasksCompleted}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent" />
                </div>
              </div>

              <MonthlyView data={chartData} />

              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white/90 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showAuthModal && (
        <AuthModal 
          showAuthModal={showAuthModal}
          setShowAuthModal={setShowAuthModal}
        />
      )}

      {!user && showPremiumModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[60]"
          onClick={(e) => e.target === e.currentTarget && setShowPremiumModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-black/40 backdrop-blur-md rounded-3xl p-12 w-[600px] text-center relative
              border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)]"
          >
            {/* <h2 className="text-4xl font-light text-white mb-4">
              Login or Signup
            </h2> */}
            <p className="text-xl text-white/80 mb-12">
              Login or Signup to access more features and insights.
            </p>

            <button
              onClick={() => {
                setShowPremiumModal(false)
                setIsModalOpen(false)
                setShowAuthModal(true)
              }}
              className="px-8 py-4 bg-purple-500 hover:bg-purple-600 transition-colors rounded-xl text-white
                text-lg shadow-lg shadow-purple-500/20 flex items-center gap-2 mx-auto"
            >
              <FaBolt className="text-xl" />
               Login or Signup
            </button>

            <button
              onClick={() => setShowPremiumModal(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white/90 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  )
})

export default FocusStats 