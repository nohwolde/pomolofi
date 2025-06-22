'use client'

import { useState, useEffect, useRef } from 'react'
import YouTubePlayer from './YouTubePlayer'
import { FaPlay, FaPause, FaBackward, FaForward, FaVolumeMute, FaVolumeUp } from 'react-icons/fa'
import { motion } from 'framer-motion'
import VolumeSlider from './VolumeSlider'

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
        videoId: 'KMXZF-K2mus',
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
  const [isCustomMode, setIsCustomMode] = useState(false)
  const [customVideoId, setCustomVideoId] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customVideoError, setCustomVideoError] = useState(false)
  const [isVolumeVisible, setIsVolumeVisible] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const previousVolume = useRef(volume)
  const customInputRef = useRef<HTMLDivElement>(null);

  const [tempVideoId, setTempVideoId] = useState('')

  const currentStream = streams[currentStreamIndex]

  const switchToRadio = () => {
    setIsCustomMode(false)
    localStorage.setItem('isCustomMode', 'false');
  }

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

  // Load initial custom video and mode from localStorage
  useEffect(() => {
    const storedCustomVideo = localStorage.getItem('customVideoId');
    const wasInCustomMode = localStorage.getItem('isCustomMode') === 'true';

    if (storedCustomVideo) {
      setCustomVideoId(storedCustomVideo);
    }
    if (wasInCustomMode) {
      setIsCustomMode(true);
    }
  }, []);

  // Add a CSS variable for the width
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--music-player-width', 
      isCustomMode ? '360px' : '300px'
    );
  }, [isCustomMode]);

  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (customInputRef.current && 
          !customInputRef.current.contains(event.target as Node) && 
          showCustomInput) {
        setShowCustomInput(false);
      }
    }
    
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCustomInput]);

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

  const handleCustomVideo = (url: string) => {
    const videoId = extractYouTubeId(url)
    if (videoId) {
      setCustomVideoId(videoId)
      setIsCustomMode(true)
      setIsPlaying(true)
      setCustomVideoError(false)
      localStorage.setItem('customVideoId', videoId)
      setTempVideoId('')
    } else {
      setCustomVideoError(true)
      setTempVideoId('')
    }
  }

  const extractYouTubeId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  return (
    <div className={`fixed bottom-4 left-8 backdrop-blur-md bg-black/30 rounded-2xl p-5 
      ${isCustomMode ? 'w-[360px]' : 'w-[300px]'} 
      pointer-events-auto shadow-2xl border border-white/10 transition-all duration-300`}
    >
      <div className="relative">
        {/* Custom Video Input */}
        {showCustomInput && (
          <motion.div
            ref={customInputRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-20 left-0 right-0 bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/10"
          >
            <input
              type="text"
              placeholder="Paste YouTube URL"
              className="w-full bg-white/10 rounded-lg px-3 py-2 text-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={tempVideoId}
              onChange={(e) => setTempVideoId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCustomVideo(tempVideoId);
                  setShowCustomInput(false);
                }
              }}
              autoFocus
            />
            {customVideoError && (
              <p className="text-red-400 text-xs mt-2">Invalid YouTube URL</p>
            )}
          </motion.div>
        )}

        {/* Header with Custom Toggle */}
        <div className="flex justify-between items-center mb-4">
          {isCustomMode ? (
            <div className="flex flex-col items-start gap-2">
              <button
                onClick={() =>switchToRadio()}
                className="text-white/70 hover:text-white/90 bg-white/10 rounded-lg px-2 py-1 text-base transition-colors"
              >
                ⇦ Radio
              </button>
              <h3 className="text-white/90 font-medium text-sm">
                Custom Video
              </h3>
            </div>
          ) : (
            <h3 className="text-white/90 font-medium text-sm">
              Lofi Radio
            </h3>
          )}
          <div className="flex items-center gap-2">
            {isCustomMode ? (
              <div className="flex gap-2 self-start mt-0">
                <button
                  onClick={() => setShowCustomInput(!showCustomInput)}
                  className="text-white/70 hover:text-white/90 text-sm transition-colors"
                >
                  Change Video
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (isCustomMode) {
                    setIsCustomMode(false)
                    localStorage.setItem('isCustomMode', 'false')
                  } else {
                    setIsCustomMode(true)
                    localStorage.setItem('isCustomMode', 'true')
                    setShowCustomInput(!showCustomInput && !customVideoId)
                  }
                }}
                className="text-white/70 hover:text-white/90 text-sm transition-colors"
              >
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Custom
                </span>
              </button>
            )}
          </div>
        </div>

        {isCustomMode && customVideoId == '' && (
          // Simple empty state for when no video ID exists
          <div className="w-full aspect-video bg-black/30 rounded-xl flex items-center justify-center mb-4">
            <div className="text-center">
              <p className="text-white/70 text-sm mb-2">No custom video selected</p>
              <button
                onClick={() => setShowCustomInput(true)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white/90 text-xs"
              >
                Add YouTube URL
              </button>
            </div>
          </div>
        )}
        <div className={`space-y-4 ${!isCustomMode ? 'hidden' : isCustomMode && customVideoId == '' ? 'hidden' : ''}`}>
            <YouTubePlayer
              videoId={isCustomMode ? customVideoId : currentStream.videoId}
              isPlaying={isPlaying}
              volume={volume}
              isVisible={isCustomMode}
              onError={() => setCustomVideoError(true)}
            />
        </div>

        {/* Player */}
        {isCustomMode ? (
          <div className="space-y-4">
            {/* Volume Control Only */}
            <VolumeSlider initialVolume={volume} onVolumeChange={handleVolumeChange}/>
          </div>
        ) : (
          <>
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
          </>
        )}

        {/* Controls */}
        {(!isCustomMode) && (
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
            <VolumeSlider initialVolume={volume} onVolumeChange={handleVolumeChange}/>
          </div>
        )}
      </div>
    </div>
  )
}