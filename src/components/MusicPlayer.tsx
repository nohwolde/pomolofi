'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import YouTubePlayer from './YouTubePlayer'
import FavoritesLibrary from './FavoritesLibrary'
import { FaPlay, FaPause, FaBackward, FaForward, FaHeart, FaRegHeart } from 'react-icons/fa'
import { motion } from 'framer-motion'
import VolumeSlider from './VolumeSlider'
import { getBlobUrl } from '@/lib/blob-urls'
import { useAuth } from '@/lib/auth'
import {
  FavoriteVideo,
  FavoriteType,
  getFavoritesFromStorage,
  persistFavorites,
  syncFavoritesOnLogin,
  createFavorite,
  fetchVideoTitle,
  fetchPlaylistInfo,
  parseYouTubeUrl,
} from '@/lib/favorites'

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
        videoId: 'ps9474I8Rp4',
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
        image: getBlobUrl('assets', 'chill-with-taiki.png')
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
  const [customPlaylistId, setCustomPlaylistId] = useState('')
  const [customContentType, setCustomContentType] = useState<FavoriteType>('video')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customVideoError, setCustomVideoError] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const previousVolume = useRef(volume)
  const customInputRef = useRef<HTMLDivElement>(null)

  const [tempVideoId, setTempVideoId] = useState('')
  const [favorites, setFavorites] = useState<FavoriteVideo[]>([])
  const [showLibrary, setShowLibrary] = useState(false)
  const { user } = useAuth()

  const currentStream = streams[currentStreamIndex]

  const hasCustomContent = customContentType === 'playlist'
    ? customPlaylistId !== ''
    : customVideoId !== ''

  const isCurrentFavorited = favorites.some((f) => {
    if (customContentType === 'playlist') return f.playlistId === customPlaylistId
    return f.videoId === customVideoId
  })

  const switchToRadio = () => {
    setIsCustomMode(false)
    setShowCustomInput(false)
    localStorage.setItem('isCustomMode', 'false')
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

  // Load initial custom video/playlist and mode from localStorage
  useEffect(() => {
    const storedCustomVideo = localStorage.getItem('customVideoId')
    const storedCustomPlaylist = localStorage.getItem('customPlaylistId')
    const storedContentType = localStorage.getItem('customContentType') as FavoriteType | null
    const wasInCustomMode = localStorage.getItem('isCustomMode') === 'true'

    if (storedCustomVideo) setCustomVideoId(storedCustomVideo)
    if (storedCustomPlaylist) setCustomPlaylistId(storedCustomPlaylist)
    if (storedContentType) setCustomContentType(storedContentType)
    if (wasInCustomMode) setIsCustomMode(true)
  }, [])

  // Load favorites from localStorage
  useEffect(() => {
    setFavorites(getFavoritesFromStorage())
  }, [])

  // Sync favorites on login
  useEffect(() => {
    if (user?.uid) {
      syncFavoritesOnLogin(user.uid).then((synced) => {
        setFavorites(synced)
      })
    }
  }, [user?.uid])

  // CSS variable for width
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--music-player-width',
      isCustomMode ? '360px' : '300px'
    )
  }, [isCustomMode])

  // Click outside handler for URL input popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (customInputRef.current &&
          !customInputRef.current.contains(event.target as Node) &&
          showCustomInput) {
        setShowCustomInput(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showCustomInput])

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

  const handleCustomUrl = (url: string) => {
    const parsed = parseYouTubeUrl(url)

    if (parsed.type === 'playlist' && parsed.playlistId) {
      setCustomPlaylistId(parsed.playlistId)
      setCustomVideoId(parsed.videoId || '')
      setCustomContentType('playlist')
      setIsCustomMode(true)
      setIsPlaying(true)
      setCustomVideoError(false)
      localStorage.setItem('customPlaylistId', parsed.playlistId)
      localStorage.setItem('customVideoId', parsed.videoId || '')
      localStorage.setItem('customContentType', 'playlist')
      localStorage.setItem('isCustomMode', 'true')
      setTempVideoId('')
    } else if (parsed.videoId) {
      setCustomVideoId(parsed.videoId)
      setCustomPlaylistId('')
      setCustomContentType('video')
      setIsCustomMode(true)
      setIsPlaying(true)
      setCustomVideoError(false)
      localStorage.setItem('customVideoId', parsed.videoId)
      localStorage.setItem('customPlaylistId', '')
      localStorage.setItem('customContentType', 'video')
      localStorage.setItem('isCustomMode', 'true')
      setTempVideoId('')
    } else {
      setCustomVideoError(true)
      setTempVideoId('')
    }
  }

  const handleToggleFavorite = useCallback(async () => {
    if (!hasCustomContent) return

    const existing = favorites.find((f) => {
      if (customContentType === 'playlist') return f.playlistId === customPlaylistId
      return f.videoId === customVideoId
    })

    if (existing) {
      const updated = favorites.filter((f) => f.id !== existing.id)
      setFavorites(updated)
      await persistFavorites(updated, user?.uid)
    } else {
      let title: string
      let thumbnail: string | undefined
      if (customContentType === 'playlist') {
        const info = await fetchPlaylistInfo(customPlaylistId)
        title = info.title
        thumbnail = info.thumbnail
      } else {
        title = await fetchVideoTitle(customVideoId)
      }
      const newFav = createFavorite(customVideoId, title, customContentType, customPlaylistId || undefined, thumbnail)
      const updated = [newFav, ...favorites]
      setFavorites(updated)
      await persistFavorites(updated, user?.uid)
    }
  }, [customVideoId, customPlaylistId, customContentType, hasCustomContent, favorites, user?.uid])

  const handleSelectFromLibrary = (fav: FavoriteVideo) => {
    if (fav.type === 'playlist' && fav.playlistId) {
      setCustomPlaylistId(fav.playlistId)
      setCustomVideoId(fav.videoId || '')
      setCustomContentType('playlist')
      localStorage.setItem('customPlaylistId', fav.playlistId)
      localStorage.setItem('customVideoId', fav.videoId || '')
      localStorage.setItem('customContentType', 'playlist')
    } else {
      setCustomVideoId(fav.videoId)
      setCustomPlaylistId('')
      setCustomContentType('video')
      localStorage.setItem('customVideoId', fav.videoId)
      localStorage.setItem('customPlaylistId', '')
      localStorage.setItem('customContentType', 'video')
    }
    setIsCustomMode(true)
    setIsPlaying(true)
    setCustomVideoError(false)
    localStorage.setItem('isCustomMode', 'true')
    setShowLibrary(false)
  }

  const handleRemoveFavorite = async (id: string) => {
    const updated = favorites.filter((f) => f.id !== id)
    setFavorites(updated)
    await persistFavorites(updated, user?.uid)
  }

  return (
    <>
      {/* Library Modal (rendered at portal level, outside the player) */}
      <FavoritesLibrary
        isOpen={showLibrary}
        onClose={() => setShowLibrary(false)}
        onSelectVideo={handleSelectFromLibrary}
        favorites={favorites}
        onRemoveFavorite={handleRemoveFavorite}
        currentVideoId={customVideoId}
        currentPlaylistId={customPlaylistId}
      />

      <div className={`fixed bottom-4 left-8 backdrop-blur-md bg-black/30 rounded-2xl p-5
        ${isCustomMode ? 'w-[360px]' : 'w-[300px]'}
        pointer-events-auto shadow-2xl border border-white/10 transition-all duration-300`}
      >
        <div className="relative">
          {/* Custom Video Input Popover */}
          {showCustomInput && (
            <motion.div
              ref={customInputRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -top-20 left-0 right-0 bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/10 z-10"
            >
              <input
                type="text"
                placeholder="Paste YouTube video or playlist URL"
                className="w-full bg-white/10 rounded-lg px-3 py-2 text-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={tempVideoId}
                onChange={(e) => setTempVideoId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCustomUrl(tempVideoId)
                    setShowCustomInput(false)
                  }
                }}
                autoFocus
              />
              {customVideoError && (
                <p className="text-red-400 text-xs mt-2">Invalid YouTube URL</p>
              )}
            </motion.div>
          )}

          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            {isCustomMode ? (
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={switchToRadio}
                  className="cursor-pointer text-white/70 hover:text-white/90 bg-white/10 rounded-lg px-2 py-1 text-base transition-colors self-start"
                >
                  ⇦ Radio
                </button>
                <h3 className="text-white/90 font-medium text-sm">
                  {customContentType === 'playlist' ? 'Custom Playlist' : 'Custom Video'}
                </h3>
              </div>
            ) : (
              <h3 className="text-white/90 font-medium text-sm">
                Lofi Radio
              </h3>
            )}

            <div className="flex items-center gap-1">
              {isCustomMode ? (
                <>
                  {hasCustomContent && (
                    <button
                      onClick={handleToggleFavorite}
                      className="cursor-pointer text-white/60 hover:text-white/90 transition-colors p-1.5"
                      title={isCurrentFavorited ? 'Remove from library' : 'Save to library'}
                    >
                      {isCurrentFavorited ? (
                        <FaHeart size={14} className="text-red-400" />
                      ) : (
                        <FaRegHeart size={14} />
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => setShowLibrary(true)}
                    className="cursor-pointer text-white/60 hover:text-white/90 transition-colors p-1.5"
                    title="My Library"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setShowCustomInput(!showCustomInput)}
                    className="cursor-pointer text-white/60 hover:text-white/90 text-xs transition-colors px-2 py-1 bg-white/10 rounded-lg"
                  >
                    Change
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsCustomMode(true)
                    localStorage.setItem('isCustomMode', 'true')
                    if (!hasCustomContent) setShowCustomInput(true)
                  }}
                  className="cursor-pointer text-white/70 hover:text-white/90 text-sm transition-colors"
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

          {/* Empty state */}
          {isCustomMode && !hasCustomContent && (
            <div className="w-full aspect-video bg-black/30 rounded-xl flex items-center justify-center mb-4">
              <div className="text-center">
                <p className="text-white/70 text-sm mb-2">No content selected</p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => setShowCustomInput(true)}
                    className="cursor-pointer px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white/90 text-xs transition-colors"
                  >
                    Add YouTube URL
                  </button>
                  {favorites.length > 0 && (
                    <button
                      onClick={() => setShowLibrary(true)}
                      className="cursor-pointer px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white/90 text-xs transition-colors"
                    >
                      My Library
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* YouTube Player */}
          <div className={`space-y-4 ${!isCustomMode || !hasCustomContent ? 'hidden' : ''}`}>
            <YouTubePlayer
              key={isCustomMode && customContentType === 'playlist' ? `pl-${customPlaylistId}` : 'video'}
              videoId={isCustomMode ? customVideoId : currentStream.videoId}
              playlistId={isCustomMode && customContentType === 'playlist' ? customPlaylistId : undefined}
              isPlaying={isPlaying}
              volume={volume}
              isVisible={isCustomMode}
              onError={() => setCustomVideoError(true)}
            />
          </div>

          {/* Player controls */}
          {isCustomMode ? (
            <div className="space-y-4">
              <VolumeSlider initialVolume={volume} onVolumeChange={handleVolumeChange}/>
            </div>
          ) : (
            <>
              {/* Album Art */}
              <div className="relative w-full h-32 mb-4 rounded-xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <img
                  src={currentStream.image}
                  alt={currentStream.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
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

          {/* Radio Controls */}
          {!isCustomMode && (
            <div className="flex flex-col gap-3">
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
              <VolumeSlider initialVolume={volume} onVolumeChange={handleVolumeChange}/>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
