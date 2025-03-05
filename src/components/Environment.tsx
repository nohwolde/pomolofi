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
  
  // Get thumbnail path for current scene
  const getThumbnailPath = (scene: Scene): string => {
    if (scene.type === 'image') return scene.background as string
    
    const videoPath = scene.background.toString()
    const lastSlashIndex = videoPath.lastIndexOf('/')
    const basePath = videoPath.substring(0, lastSlashIndex + 1)
    const fileName = videoPath.substring(lastSlashIndex + 1).replace('.mp4', '')
    
    return `${basePath}${fileName}-thumbnail.jpeg`
  }

  useEffect(() => {
    if (currentScene.type === 'video') {
      setIsLoading(true)
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
    <AnimatePresence mode="wait">
      <motion.div
        key={currentScene.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full h-full"
      >
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white/90 rounded-full animate-spin" />
              <div className="text-sm text-white/70">Loading {currentScene.name}...</div>
            </div>
          </motion.div>
        )}
        
        {/* Thumbnail for faster initial display */}
        {isLoading && (
          <Image
            src={getThumbnailPath(currentScene)}
            alt={`${currentScene.name} thumbnail`}
            fill
            priority
            className="object-cover"
          />
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