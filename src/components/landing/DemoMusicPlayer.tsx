'use client'

import { useState } from 'react'
import { FaPlay, FaPause, FaBackward, FaForward, FaVolumeMute, FaVolumeUp } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { getBlobUrl } from '@/lib/blob-urls'

const streams = [
  {
    id: 'lofi-girl',
    name: 'Lofi Girl',
    artist: '@LofiGirl',
    image: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg'
  },
  {
    id: 'afro-lofi',
    name: 'AfroLofi',
    artist: '@afrolofi',
    image: 'https://i.ytimg.com/vi/2OpuFmwuARc/hqdefault.jpg'
  },
  {
    id: 'jazz-lofi',
    name: 'Jazz Lofi',
    artist: '@LofiGirl',
    image: 'https://i.ytimg.com/vi/HuFYqnbVbzY/hqdefault.jpg'
  },
  {
    id: 'chill-lofi',
    name: 'Chill Lofi',
    artist: '@ChillwithTaiki',
    image: getBlobUrl('assets', 'chill-with-taiki.png')
  },
  {
    id: 'chillhop-lofi',
    name: 'Chillhop Lofi',
    artist: '@ChillhopMusic',
    image: 'https://i.ytimg.com/vi/5yx6BWlEVcY/hqdefault.jpg'
  }
]

export default function DemoMusicPlayer() {
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [volume, setVolume] = useState(50)
  const [isMuted, setIsMuted] = useState(false)
  const [isVolumeHovered, setIsVolumeHovered] = useState(false)

  const currentStream = streams[currentStreamIndex]

  const handlePreviousStream = () => {
    setCurrentStreamIndex((prevIndex) => 
      prevIndex === 0 ? streams.length - 1 : prevIndex - 1
    )
  }

  const handleNextStream = () => {
    setCurrentStreamIndex((prevIndex) => 
      prevIndex === streams.length - 1 ? 0 : prevIndex + 1
    )
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const effectiveVolume = isMuted ? 0 : volume

  return (
    <div className="backdrop-blur-md bg-black/30 rounded-2xl p-5 w-full max-w-[300px] shadow-2xl border border-white/10">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white/90 font-medium text-sm">
          Lofi Radio
        </h3>
        <span className="text-white/50 text-xs flex items-center gap-1">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          LIVE
        </span>
      </div>

      {/* Album Art */}
      <div className="relative w-full h-32 mb-4 rounded-xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
        <motion.img 
          key={currentStream.id}
          src={currentStream.image} 
          alt={currentStream.name} 
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute bottom-0 left-0 p-3 w-full z-20">
          <h3 className="text-white font-medium text-base leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {currentStream.name}
          </h3>
          <p className="text-white/90 text-xs drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {currentStream.artist}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3">
        {/* Main Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousStream}
            className="p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <FaBackward size={16} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all transform hover:scale-105 cursor-pointer"
          >
            {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} className="ml-1" />}
          </button>
          <button
            onClick={handleNextStream}
            className="p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <FaForward size={16} />
          </button>
        </div>

        {/* Volume Control - matching internal app style */}
        <div 
          className="flex items-center gap-2 pr-2"
          onMouseEnter={() => setIsVolumeHovered(true)}
          onMouseLeave={() => setIsVolumeHovered(false)}
        >
          <button
            onClick={toggleMute}
            className="text-white/70 hover:text-white transition-colors flex items-center cursor-pointer"
          >
            {isMuted || volume === 0 ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
          </button>
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 relative h-4 flex items-center">
              {/* Track background */}
              <div className="absolute h-1 w-full bg-white/30 rounded-full" />
              {/* Filled part */}
              <div 
                className="absolute h-1 bg-white/70 rounded-full" 
                style={{ width: `${effectiveVolume}%` }}
              />
              {/* Thumb - visible on hover */}
              <div 
                className={`absolute h-3 w-3 bg-white rounded-full transform -translate-x-1.5 
                  transition-opacity duration-200 ${isVolumeHovered ? 'opacity-100' : 'opacity-0'}`}
                style={{ left: `${effectiveVolume}%` }}
              />
              {/* Invisible input for interaction */}
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value))
                  if (isMuted && Number(e.target.value) > 0) setIsMuted(false)
                }}
                className="absolute w-full h-4 opacity-0 cursor-pointer"
              />
            </div>
            <span className="text-white/70 text-xs w-8 text-center">
              {effectiveVolume}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
