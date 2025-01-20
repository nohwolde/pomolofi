'use client'

import { useState } from 'react'
import YouTubePlayer from './YouTubePlayer'
import { FaPlay, FaPause, FaBackward, FaForward } from 'react-icons/fa'

const streams = [
    {
        id: 'lofi',
        name: 'Lofi Girl',
        videoId: 'jfKfPfyJRdk',
        image: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg'    },
    {
        id: 'afro-lofi', 
        name: 'Afro Lofi',
        videoId: '2OpuFmwuARc', 
        image: 'https://i.ytimg.com/vi/2OpuFmwuARc/hqdefault.jpg'
    }, 
    {
        id: 'jazz-lofi', 
        name: 'Jazz Lofi', 
        videoId: "HuFYqnbVbzY",
        image: 'https://i.ytimg.com/vi/HuFYqnbVbzY/hqdefault.jpg'
    }, 
    {
        id: 'chill-lofi', 
        name: 'Chill Lofi',
        videoId: 'qH3fETPsqXU', 
        image: 'https://i.ytimg.com/vi/qH3fETPsqXU/hqdefault.jpg'
    }, 
        {
        id: 'chillhop-lofi', 
        name: 'Chillhop Lofi',
        videoId: '5yx6BWlEVcY', 
        image: 'https://i.ytimg.com/vi/5yx6BWlEVcY/hqdefault.jpg'
    }
]

export default function MusicPlayer() {
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(100) // Volume from 0 to 100

  const currentStream = streams[currentStreamIndex]

  const handleStreamChange = (index: number) => {
    setCurrentStreamIndex(index)
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
  }

  const handlePreviousStream = () => {
    setCurrentStreamIndex((prevIndex) => (prevIndex === 0 ? streams.length - 1 : prevIndex - 1))
  }

  const handleNextStream = () => {
    setCurrentStreamIndex((prevIndex) => (prevIndex === streams.length - 1 ? 0 : prevIndex + 1))
  }

  return (
    <div className="fixed bottom-4 left-8 backdrop-blur-lg bg-white/10 rounded-2xl p-4 w-[300px] pointer-events-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg text-white">Now Playing</h2>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="slider"
        />
      </div>
      <div className="flex items-center mb-4">
        <img src={currentStream.image} alt={currentStream.name} className="w-24 h-16 rounded-lg" />
        <div className="ml-3 flex-grow">
          <h3 className="text-white">{currentStream.name}</h3>
        </div>
      </div>
      <YouTubePlayer videoId={currentStream.videoId} isPlaying={isPlaying} volume={volume} />
      <div className="flex items-center justify-center mt-2">
        <button
          onClick={handlePreviousStream} // Change to the previous stream
          className="p-1 text-white hover:text-gray-300 transition-colors"
        >
          <FaBackward />
        </button>
        <button
          onClick={handlePlayPause}
          className="mx-2 p-1 text-white hover:text-gray-300 transition-colors"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button
          onClick={handleNextStream} // Change to the next stream
          className="p-1 text-white hover:text-gray-300 transition-colors"
        >
          <FaForward />
        </button>
      </div>
    </div>
  )
}