'use client'

import { useState, useEffect, useRef } from 'react'
import YouTubePlayer from './YouTubePlayer'
import { FaPlay, FaPause, FaBackward, FaForward, FaVolumeMute, FaVolumeUp } from 'react-icons/fa'

const streams = [
    {
        id: 'lofi-girl',
        name: 'Lofi Girl',
        artist: '@LofiGirl',
        videoId: 'jfKfPfyJRdk',
        image: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg'
    },
    {
        id: 'afro-lofi',
        name: 'AfroLofi',
        artist: '@afrolofi',
        videoId: '2OpuFmwuARc',
        image: 'https://i.ytimg.com/vi/2OpuFmwuARc/hqdefault.jpg'
    },
    {
        id: 'jazz-lofi',
        name: 'Jazz Lofi',
        artist: '@LofiGirl',
        videoId: "HuFYqnbVbzY",
        image: 'https://i.ytimg.com/vi/HuFYqnbVbzY/hqdefault.jpg'
    },
    {
        id: 'chill-lofi',
        name: 'Chill Lofi',
        artist: '@ChillwithTaiki',
        videoId: 'qH3fETPsqXU',
        image: '/chill-with-taiki.png'
    },
    {
        id: 'chillhop-lofi',
        name: 'Chillhop Lofi',
        artist: '@ChillhopMusic',
        videoId: '5yx6BWlEVcY',
        image: 'https://i.ytimg.com/vi/5yx6BWlEVcY/hqdefault.jpg'
    }
]

export default function MusicPlayer() {
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(50)
  const [isVolumeVisible, setIsVolumeVisible] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const previousVolume = useRef(volume)

  const currentStream = streams[currentStreamIndex]

  // Load initial stream from localStorage
  useEffect(() => {
    const storedStreamId = localStorage.getItem('currentStreamId')
    if (storedStreamId) {
      const index = streams.findIndex(stream => stream.id === storedStreamId)
      if (index !== -1) {
        setCurrentStreamIndex(index)
      }
    }
  }, [])

  const handleStreamChange = (index: number) => {
    setCurrentStreamIndex(index)
    setIsPlaying(true)
    localStorage.setItem('currentStreamId', streams[index].id)
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume.current)
      setIsMuted(false)
    } else {
      previousVolume.current = volume
      setVolume(0)
      setIsMuted(true)
    }
  }

  const handlePreviousStream = () => {
    setCurrentStreamIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? streams.length - 1 : prevIndex - 1
      localStorage.setItem('currentStreamId', streams[newIndex].id)
      return newIndex
    })
    setIsPlaying(true)
  }

  const handleNextStream = () => {
    setCurrentStreamIndex((prevIndex) => {
      const newIndex = prevIndex === streams.length - 1 ? 0 : prevIndex + 1
      localStorage.setItem('currentStreamId', streams[newIndex].id)
      return newIndex
    })
    setIsPlaying(true)
  }

  return (
    <div className="fixed bottom-4 left-8 backdrop-blur-md bg-black/30 rounded-2xl p-5 w-[300px] pointer-events-auto shadow-2xl border border-white/10">
      <div className="relative">
        {/* Album Art and Gradient Overlay */}
        <div className="relative w-full h-32 mb-4 rounded-xl overflow-hidden group">
          {/* Stronger gradient from bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <img 
            src={currentStream.image} 
            alt={currentStream.name} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
          />
          {/* Enhanced text visibility */}
          <div className="absolute bottom-0 left-0 p-3 w-full">
            <h3 className="text-white font-medium text-base leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {currentStream.name}
            </h3>
            <p className="text-white/90 text-xs drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {currentStream.artist}
            </p>
          </div>
        </div>

        {/* Hidden YouTube Player */}
        <div className="hidden">
          <YouTubePlayer 
            videoId={currentStream.videoId} 
            isPlaying={isPlaying} 
            volume={volume}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3"> {/* reduced gap from gap-4 to gap-3 */}
          {/* Progress Bar (Visual Only) */}

          {/* Main Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousStream}
              className="p-2 text-white/70 hover:text-white transition-colors"
            >
              <FaBackward size={16} />
            </button>
            <button
              onClick={handlePlayPause}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all transform hover:scale-105"
            >
              {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} className="ml-1" />}
            </button>
            <button
              onClick={handleNextStream}
              className="p-2 text-white/70 hover:text-white transition-colors"
            >
              <FaForward size={16} />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2"
               onMouseEnter={() => setIsVolumeVisible(true)}
               onMouseLeave={() => setIsVolumeVisible(false)}>
            <button
              onClick={toggleMute}
              className="p-2 text-white/70 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
            </button>
            <div className={`flex-1 transition-opacity duration-200 ${isVolumeVisible ? 'opacity-100' : 'opacity-0'}`}>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full accent-white/70 hover:accent-white cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}