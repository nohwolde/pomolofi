'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface Scene {
  id: string
  name: string
  background: string | any // StaticImageData
  type: 'video' | 'image'
}

interface EnvironmentModalProps {
  isOpen: boolean
  onClose: () => void
  scenes: Scene[]
  onSelectScene: (scene: Scene) => void
}

export default function EnvironmentModal({ isOpen, onClose, scenes, onSelectScene }: EnvironmentModalProps) {
  const [visibleScenes, setVisibleScenes] = useState<Set<string>>(new Set())
  const observers = useRef<Map<string, IntersectionObserver>>(new Map())
  const observersSetup = useRef(false)
  
  // Memoize videos and images filtering since scenes never change
  const videos = useMemo(() => scenes.filter(scene => scene.type === 'video'), [scenes])
  const images = useMemo(() => scenes.filter(scene => scene.type === 'image'), [scenes])

  // Setup intersection observer only once
  useEffect(() => {
    if (observersSetup.current) return
    
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    }

    scenes.forEach(scene => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleScenes(prev => new Set(Array.from(prev).concat(scene.id)))
            observer.disconnect()
          }
        })
      }, options)
      
      observers.current.set(scene.id, observer)
    })
    
    observersSetup.current = true
    
    return () => {
      observers.current.forEach(observer => observer.disconnect())
    }
  }, [scenes])

  // Start observing elements when they're rendered
  useEffect(() => {
    if (!isOpen) return
    
    // Only observe scenes that are not already visible
    scenes.forEach(scene => {
      if (visibleScenes.has(scene.id)) return
      
      const observer = observers.current.get(scene.id)
      if (!observer) return
      
      const element = document.getElementById(`scene-${scene.id}`)
      if (element) observer.observe(element)
    })
    
    return () => {
      // Don't disconnect observers on unmount - keep track of what's been seen
    }
  }, [isOpen, scenes, visibleScenes])

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
            transition={{ 
              duration: 0.15,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="glass-effect rounded-3xl w-full max-w-[800px] mx-4 text-center max-h-[80vh] flex flex-col overflow-hidden"
          >
            {/* Fixed Header */}
            <div className="relative p-8 pb-4 border-b border-white/10">
              <h2 className="text-2xl font-medium text-white/90">Select Environment</h2>
              <motion.button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/60 hover:text-white/90 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Scrollable Content */}
            <div 
              className="overflow-y-auto p-8 pt-4 custom-scrollbar scroll-smooth hover-reveal-scrollbar"
              style={{ 
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {/* Live Wallpapers Section */}
              <motion.div 
                className="mb-12"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1}}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-lg font-medium text-white/80 mb-4 text-left">Live Wallpapers</h3>
                <div className="grid grid-cols-3 gap-4">
                  {videos.map(scene => (
                    <motion.button
                      id={`scene-${scene.id}`}
                      key={scene.id}
                      onClick={() => onSelectScene(scene)}
                      className="group relative aspect-video rounded-lg overflow-hidden hover:ring-2 hover:ring-white/50 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {visibleScenes.has(scene.id) ? (
                        <video
                          src={`${scene.background}#t=0.5`}
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover"
                          onMouseEnter={(e) => e.currentTarget.play()}
                          onMouseLeave={(e) => {
                            e.currentTarget.pause();
                            e.currentTarget.currentTime = 0;
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 w-full h-full bg-gray-800/70 animate-pulse flex items-center justify-center">
                          <span className="text-white/50">Loading...</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                      <span className="absolute bottom-2 left-2 text-sm text-white font-medium">
                        {scene.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Still Images Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-medium text-white/80 mb-4 text-left">Still Images</h3>
                <div className="grid grid-cols-3 gap-4">
                  {images.map(scene => (
                    <motion.button
                      id={`scene-${scene.id}`}
                      key={scene.id}
                      onClick={() => onSelectScene(scene)}
                      className="group relative aspect-video rounded-lg overflow-hidden hover:ring-2 hover:ring-white/50 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {visibleScenes.has(scene.id) ? (
                        <Image
                          src={scene.background}
                          alt={scene.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 w-full h-full bg-gray-800/70 animate-pulse flex items-center justify-center">
                          <span className="text-white/50">Loading...</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                      <span className="absolute bottom-2 left-2 text-sm text-white font-medium">
                        {scene.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 