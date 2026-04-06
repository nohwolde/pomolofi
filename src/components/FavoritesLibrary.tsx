'use client'

import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FavoriteVideo } from '@/lib/favorites'

interface FavoritesLibraryProps {
  isOpen: boolean
  onClose: () => void
  onSelectVideo: (fav: FavoriteVideo) => void
  favorites: FavoriteVideo[]
  onRemoveFavorite: (id: string) => void
  currentVideoId?: string
  currentPlaylistId?: string
}

export default function FavoritesLibrary({
  isOpen,
  onClose,
  onSelectVideo,
  favorites,
  onRemoveFavorite,
  currentVideoId,
  currentPlaylistId,
}: FavoritesLibraryProps) {
  const videos = favorites.filter((f) => f.type === 'video')
  const playlists = favorites.filter((f) => f.type === 'playlist')

  const isActive = (fav: FavoriteVideo) => {
    if (fav.type === 'playlist') return fav.playlistId === currentPlaylistId
    return fav.videoId === currentVideoId
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="glass-effect rounded-3xl w-full max-w-[600px] mx-4 max-h-[80vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-white/10">
              <h2 className="text-xl font-medium text-white/90">
                My Library
                {favorites.length > 0 && (
                  <span className="ml-2 text-white/40 text-sm font-normal">
                    {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
                  </span>
                )}
              </h2>
              <motion.button
                onClick={onClose}
                className="cursor-pointer absolute top-5 right-5 text-white/60 hover:text-white/90 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Scrollable Content */}
            <div
              className="overflow-y-auto p-6 pt-4 custom-scrollbar scroll-smooth hover-reveal-scrollbar"
              style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
            >
              {favorites.length === 0 ? (
                <div className="py-12 text-center">
                  <svg className="w-12 h-12 mx-auto text-white/20 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <p className="text-white/40 text-sm">No saved items yet</p>
                  <p className="text-white/25 text-xs mt-1">
                    Play a video or playlist, then click the heart to save it here
                  </p>
                </div>
              ) : (
                <>
                  {/* Videos Section */}
                  {videos.length > 0 && (
                    <motion.div
                      className={playlists.length > 0 ? 'mb-8' : ''}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.05 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-sm font-medium text-white/70">
                          Videos
                          <span className="ml-1.5 text-white/30 font-normal">{videos.length}</span>
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {videos.map((fav) => (
                          <FavoriteCard
                            key={fav.id}
                            fav={fav}
                            isActive={isActive(fav)}
                            onSelect={() => onSelectVideo(fav)}
                            onRemove={() => onRemoveFavorite(fav.id)}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Playlists Section */}
                  {playlists.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10m-10 4h6" />
                        </svg>
                        <h3 className="text-sm font-medium text-white/70">
                          Playlists
                          <span className="ml-1.5 text-white/30 font-normal">{playlists.length}</span>
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {playlists.map((fav) => (
                          <FavoriteCard
                            key={fav.id}
                            fav={fav}
                            isActive={isActive(fav)}
                            onSelect={() => onSelectVideo(fav)}
                            onRemove={() => onRemoveFavorite(fav.id)}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function FavoriteCard({
  fav,
  isActive,
  onSelect,
  onRemove,
}: {
  fav: FavoriteVideo
  isActive: boolean
  onSelect: () => void
  onRemove: () => void
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const confirmTimeout = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    return () => {
      if (confirmTimeout.current) clearTimeout(confirmTimeout.current)
    }
  }, [])

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setConfirmingDelete(true)
    confirmTimeout.current = setTimeout(() => setConfirmingDelete(false), 3000)
  }

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirmTimeout.current) clearTimeout(confirmTimeout.current)
    setConfirmingDelete(false)
    onRemove()
  }

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirmTimeout.current) clearTimeout(confirmTimeout.current)
    setConfirmingDelete(false)
  }

  return (
    <motion.button
      onClick={onSelect}
      className={`cursor-pointer group relative rounded-lg overflow-hidden text-left transition-all
        ${isActive ? 'ring-2 ring-white/40' : 'hover:ring-2 hover:ring-white/25'}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-black/40">
        {fav.thumbnail ? (
          <img
            src={fav.thumbnail}
            alt={fav.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h10m-10 4h6" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

        {/* Confirm delete overlay */}
        <AnimatePresence>
          {confirmingDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="absolute inset-0 bg-black/70 flex items-center justify-center z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center gap-1.5">
                <p className="text-white/80 text-[11px] font-medium">Remove?</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleConfirmDelete}
                    className="cursor-pointer px-2.5 py-1 rounded bg-red-500/30 hover:bg-red-500/50 text-red-300 text-[10px] font-medium transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={handleCancelDelete}
                    className="cursor-pointer px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white/70 text-[10px] font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Now playing indicator */}
        {isActive && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 rounded px-1.5 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-white/80">Playing</span>
          </div>
        )}

        {/* Type badge */}
        {fav.type === 'playlist' && (
          <div className="absolute top-2 right-2 bg-black/60 rounded px-1.5 py-0.5 flex items-center gap-1">
            <svg className="w-2.5 h-2.5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10m-10 4h6" />
            </svg>
            <span className="text-[10px] text-white/70">Playlist</span>
          </div>
        )}

        {/* Delete button (hidden during confirm) */}
        {!confirmingDelete && (
          <button
            onClick={handleDeleteClick}
            className="cursor-pointer absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 bg-black/60 hover:bg-red-500/40 rounded p-1 transition-all duration-150"
          >
            <svg className="w-3 h-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Title */}
      <div className="p-2 bg-white/5">
        <p className="text-white/80 text-xs truncate">{fav.title}</p>
      </div>
    </motion.button>
  )
}
