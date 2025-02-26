'use client'

import { useState, useEffect } from 'react'
import Image, { StaticImageData } from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'

type Scene = {
  id: string
  name: string
  background: string | StaticImageData
  type: 'video' | 'image'
}
type EnvironmentProps = {
  currentScene: Scene
}

export default function Environment({ currentScene }: EnvironmentProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (currentScene.type === 'video') {
      const video = document.createElement('video')
      video.src = currentScene.background as string
      video.preload = 'auto' // Force preload for current scene
      video.onloadeddata = () => setIsLoading(false)
      return () => {
        video.src = '' // Cleanup
      }
    } else {
      setIsLoading(false)
    }
  }, [currentScene])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0.5, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white/90 rounded-full animate-spin" />
              <div className="text-sm text-white/70">Loading {currentScene.name}...</div>
            </div>
          </div>
        )}
        {currentScene.type === 'video' ? (
          <video
            key={currentScene.id}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            src={currentScene.background as string}
            onLoadedData={() => setIsLoading(false)}
          />
        ) : (
          <Image
            src={currentScene.background as string}
            alt={currentScene.name}
            fill
            priority
            className="object-cover"
            onLoadingComplete={() => setIsLoading(false)}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
} 