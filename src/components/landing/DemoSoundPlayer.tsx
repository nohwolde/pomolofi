'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaPlay, FaPause, FaVolumeUp, FaFire } from 'react-icons/fa'
import { WiRaindrops, WiRain } from 'react-icons/wi'
import { GiWaveStrike } from 'react-icons/gi'

type Sound = {
  id: string
  name: string
  icon: JSX.Element
  description: string
}

const sounds: Sound[] = [
  {
    id: 'light-rain',
    name: 'Light Rain',
    icon: <WiRaindrops size={24} />,
    description: 'Gentle rainfall on a quiet day'
  },
  {
    id: 'heavy-rain',
    name: 'Heavy Rain',
    icon: <WiRain size={24} />,
    description: 'Strong rainfall with subtle thunder'
  },
  {
    id: 'burning-fire',
    name: 'Burning Fire',
    icon: <FaFire size={20} />,
    description: 'Crackling fireplace ambience'
  },
  {
    id: 'ocean-waves',
    name: 'Ocean Waves',
    icon: <GiWaveStrike size={22} />,
    description: 'Calming waves on a peaceful beach'
  }
]

function PlaybackControls({ 
  isPlaying, 
  volume, 
  onPlayPause, 
  onVolumeChange 
}: { 
  isPlaying: boolean
  volume: number
  onPlayPause: () => void
  onVolumeChange: (v: number) => void
}) {
  const [isVolumeHovered, setIsVolumeHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 pt-4 border-t border-white/10"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onPlayPause}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
        >
          {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} className="ml-0.5" />}
        </button>
        
        <div 
          className="flex-1 flex items-center gap-2"
          onMouseEnter={() => setIsVolumeHovered(true)}
          onMouseLeave={() => setIsVolumeHovered(false)}
        >
          <FaVolumeUp size={14} className="text-white/70" />
          <div className="flex-1 relative h-4 flex items-center">
            {/* Track background */}
            <div className="absolute h-1 w-full bg-white/30 rounded-full" />
            {/* Filled part */}
            <div 
              className="absolute h-1 bg-white/70 rounded-full" 
              style={{ width: `${volume}%` }}
            />
            {/* Thumb - visible on hover */}
            <div 
              className={`absolute h-3 w-3 bg-white rounded-full transform -translate-x-1.5 
                transition-opacity duration-200 ${isVolumeHovered ? 'opacity-100' : 'opacity-0'}`}
              style={{ left: `${volume}%` }}
            />
            {/* Invisible input for interaction */}
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="absolute w-full h-4 opacity-0 cursor-pointer"
            />
          </div>
          <span className="text-white/70 text-xs w-8 text-center">{volume}%</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function DemoSoundPlayer() {
  const [selectedSound, setSelectedSound] = useState<string>('light-rain')
  const [isPlaying, setIsPlaying] = useState(true)
  const [volume, setVolume] = useState(50)

  const currentSound = sounds.find(s => s.id === selectedSound)

  return (
    <div className="backdrop-blur-md bg-black/30 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-5 w-full max-w-[300px]"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white/90 font-medium">Ambient Sounds</h3>
        </div>
        
        <div className="grid gap-2">
          {sounds.map(sound => (
            <button
              key={sound.id}
              onClick={() => {
                setSelectedSound(sound.id)
                setIsPlaying(true)
              }}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer
                ${selectedSound === sound.id ? 
                  'bg-white/20 text-white' : 
                  'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
            >
              <div className="text-white/90">{sound.icon}</div>
              <div className="text-left flex-1">
                <div className="font-medium leading-tight">{sound.name}</div>
                <div className="text-xs text-white/50">{sound.description}</div>
              </div>
              {selectedSound === sound.id && isPlaying && (
                <div className="flex gap-0.5">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-white/70 rounded-full"
                      animate={{
                        height: [8, 16, 8],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Playback Controls */}
        {currentSound && (
          <PlaybackControls 
            isPlaying={isPlaying}
            volume={volume}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onVolumeChange={setVolume}
          />
        )}
      </motion.div>
    </div>
  )
}
