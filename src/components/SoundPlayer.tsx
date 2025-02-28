'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlay, FaPause, FaChevronLeft, FaChevronRight, FaVolumeUp, FaFire } from 'react-icons/fa'
import { WiRaindrops, WiRain } from 'react-icons/wi'
import { GiWaveStrike } from 'react-icons/gi'

type Sound = {
  id: string
  name: string
  file: string
  icon: JSX.Element
  description: string
}

const sounds: Sound[] = [
  {
    id: 'light-rain',
    name: 'Light Rain',
    file: '/sounds/light-rain.mp3',
    icon: <WiRaindrops size={24} />,
    description: 'Gentle rainfall on a quiet day'
  },
  {
    id: 'heavy-rain',
    name: 'Heavy Rain',
    file: '/sounds/heavy-rain.mp3',
    icon: <WiRain size={24} />,
    description: 'Strong rainfall with subtle thunder'
  },
  {
    id: 'burning-fire',
    name: 'Burning Fire',
    file: '/sounds/burning-fire.mp3',
    icon: <FaFire size={20} />,
    description: 'Crackling fireplace ambience'
  },
  {
    id: 'ocean-waves',
    name: 'Ocean Waves',
    file: '/sounds/ocean-waves.mp3',
    icon: <GiWaveStrike size={22} />,
    description: 'Calming waves on a peaceful beach'
  }
]

export default function SoundPlayer() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentSoundId, setCurrentSoundId] = useState<string | null>(null)
  const [volume, setVolume] = useState(50)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isVolumeVisible, setIsVolumeVisible] = useState(false)
  const volumeButtonRef = useRef<HTMLButtonElement>(null)
  
  // Web Audio API refs
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const audioBufferRef = useRef<AudioBuffer | null>(null)

  const currentSound = sounds.find(sound => sound.id === currentSoundId)

  // Initialize Audio Context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    gainNodeRef.current = audioContextRef.current.createGain()
    gainNodeRef.current.connect(audioContextRef.current.destination)
    
    return () => {
      audioContextRef.current?.close()
    }
  }, [])

  // Load and decode audio file
  const loadAudio = async (url: string) => {
    if (!audioContextRef.current) return

    try {
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer)
      audioBufferRef.current = audioBuffer
      return audioBuffer
    } catch (error) {
      console.error('Error loading audio:', error)
    }
  }

  // Play audio with perfect looping
  const playAudio = (buffer: AudioBuffer) => {
    if (!audioContextRef.current || !gainNodeRef.current) return

    // Stop current playback if any
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop()
      sourceNodeRef.current.disconnect()
    }

    // Create and configure source node
    const source = audioContextRef.current.createBufferSource()
    source.buffer = buffer
    source.loop = true
    source.connect(gainNodeRef.current)
    sourceNodeRef.current = source

    // Start playback
    source.start(0)
  }

  // Handle sound selection
  const handleSoundSelect = async (soundId: string) => {
    const sound = sounds.find(s => s.id === soundId)
    if (!sound) return

    if (currentSoundId === soundId) {
      setIsPlaying(!isPlaying)
      if (isPlaying) {
        sourceNodeRef.current?.stop()
      } else if (audioBufferRef.current) {
        playAudio(audioBufferRef.current)
      }
    } else {
      // Stop current playback
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop()
        sourceNodeRef.current.disconnect()
      }

      setCurrentSoundId(soundId)
      setIsPlaying(true)

      // Load and play new audio
      const buffer = await loadAudio(sound.file)
      if (buffer) {
        playAudio(buffer)
      }
    }
    setIsExpanded(false)
  }

  // Handle volume changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume / 100
    }
  }, [volume])

  // Handle play/pause
  useEffect(() => {
    if (!audioBufferRef.current || !audioContextRef.current) return

    if (isPlaying) {
      playAudio(audioBufferRef.current)
    } else if (sourceNodeRef.current) {
      sourceNodeRef.current.stop()
    }
  }, [isPlaying])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop()
        sourceNodeRef.current.disconnect()
      }
      audioContextRef.current?.close()
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (volumeButtonRef.current && 
          !volumeButtonRef.current.contains(event.target as Node) &&
          !(event.target as Element).closest('.volume-panel')) {
        setIsVolumeVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <AnimatePresence>
        {isVolumeVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-[80px] left-[340px] bg-black/50 backdrop-blur-md rounded-xl p-2 
              shadow-lg border border-white/10 volume-panel"
          >
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-24 h-1.5 accent-white/70 hover:accent-white cursor-pointer"
              />
              <span className="text-white/70 text-xs min-w-[2.5rem]">{volume}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-4 left-[calc(var(--music-player-width,_300px)_+_40px)]">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="backdrop-blur-md bg-black/30 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          >
            {isExpanded ? (
              <motion.div
                initial={{ width: '180px', opacity: 0 }}
                animate={{ width: '300px', opacity: 1 }}
                exit={{ width: '180px', opacity: 0 }}
                transition={{ 
                  duration: 0.2,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className="p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white/90 font-medium">Ambient Sounds</h3>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <FaChevronLeft />
                  </button>
                </div>
                <div className="grid gap-2">
                  {sounds.map(sound => (
                    <button
                      key={sound.id}
                      onClick={() => handleSoundSelect(sound.id)}
                      className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all
                        ${currentSoundId === sound.id ? 
                          'bg-white/20 text-white' : 
                          'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                      <div className="text-white/90">{sound.icon}</div>
                      <div className="text-left">
                        <div className="font-medium leading-tight">{sound.name}</div>
                        <div className="text-xs text-white/50">{sound.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="h-[52px] flex items-center px-3"
              >
                {currentSound ? (
                  <div className="flex items-center justify-between gap-2 w-full">
                    <button
                      onClick={() => setIsExpanded(true)}
                      className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all"
                    >
                      <div className="text-white/90">{currentSound.icon}</div>
                      <span className="text-sm font-medium">{currentSound.name}</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                      >
                        {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} className="ml-0.5" />}
                      </button>
                      <button
                        ref={volumeButtonRef}
                        onClick={() => setIsVolumeVisible(!isVolumeVisible)}
                        className={`w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center 
                          transition-all ${isVolumeVisible ? 'text-white bg-white/10' : 'text-white/70'}`}
                      >
                        <FaVolumeUp size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all"
                  >
                    <FaChevronRight size={12} />
                    <span className="text-sm font-medium">Add Ambient Sound</span>
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}